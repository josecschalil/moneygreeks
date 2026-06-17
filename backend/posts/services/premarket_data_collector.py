from __future__ import annotations

import csv
import io
import json
import re
from datetime import date, timedelta
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import HTTPCookieProcessor, Request, build_opener

import yfinance as yf  # pip install yfinance

from django.conf import settings
from django.utils import timezone

DEFAULT_TIMEOUT_SECONDS = 20

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/",
}
NSE_BASE_URL = "https://www.nseindia.com"

# ---------------------------------------------------------------------------
# Yahoo Finance instrument definitions
# Each entry needs:
#   name    – display label
#   symbol  – Yahoo Finance ticker symbol
#   key     – unique snake_case identifier (used in source_status keys)
#   bucket  – which sub-list in the payload to place the result into
# ---------------------------------------------------------------------------
YAHOO_FINANCE_INSTRUMENTS = [
    # Global indices
    {"name": "Dow Jones",           "symbol": "^DJI",       "key": "dji",       "bucket": "global_indices"},
    {"name": "Nasdaq Composite",    "symbol": "^IXIC",      "key": "ixic",      "bucket": "global_indices"},
    {"name": "S&P 500",             "symbol": "^GSPC",      "key": "gspc",      "bucket": "global_indices"},
    {"name": "Nikkei 225",          "symbol": "^N225",      "key": "n225",      "bucket": "global_indices"},
    {"name": "Hang Seng",           "symbol": "^HSI",       "key": "hsi",       "bucket": "global_indices"},
    {"name": "Shanghai Composite",  "symbol": "000001.SS",  "key": "sse",       "bucket": "global_indices"},
    {"name": "FTSE 100",            "symbol": "^FTSE",      "key": "ftse",      "bucket": "global_indices"},
    {"name": "DAX",                 "symbol": "^GDAXI",     "key": "gdaxi",     "bucket": "global_indices"},
    {"name": "CAC 40",              "symbol": "^FCHI",      "key": "fchi",      "bucket": "global_indices"},
    # Commodities & currency
    {"name": "Gold",                "symbol": "GC=F",       "key": "gold",      "bucket": "commodities_currency"},
    {"name": "Silver",              "symbol": "SI=F",       "key": "silver",    "bucket": "commodities_currency"},
    {"name": "Crude Oil (WTI)",     "symbol": "CL=F",       "key": "crude_oil", "bucket": "commodities_currency"},
    {"name": "USD/INR",             "symbol": "INR=X",      "key": "usd_inr",   "bucket": "commodities_currency"},
    {"name": "EUR/USD",             "symbol": "EURUSD=X",   "key": "eur_usd",   "bucket": "commodities_currency"},
]

NSE_PRIMARY_INDICES = {"NIFTY 50", "NIFTY BANK", "NIFTY 500", "INDIA VIX"}

# NSE option chain symbols and their API identifiers
OPTION_CHAIN_SYMBOLS = ("NIFTY", "BANKNIFTY")


class CollectionError(RuntimeError):
    pass


class PremarketDataCollector:
    def __init__(self, *, timeout: int = DEFAULT_TIMEOUT_SECONDS):
        self.timeout = timeout
        self.opener = build_opener(HTTPCookieProcessor())
        self.source_status: dict[str, str] = {}
        self.report_date: date | None = None

    # -----------------------------------------------------------------------
    # Public entry point
    # -----------------------------------------------------------------------

    def collect(self, *, report_date: date | None = None) -> dict[str, Any]:
        report_date = report_date or timezone.localdate()
        self.report_date = report_date
        self.source_status = {}

        payload: dict[str, Any] = {
            "report_date": report_date.isoformat(),
            "collected_at": timezone.now().isoformat(),
            "institutional_flow": [],
            "top_gainers": [],
            "top_losers": [],
            "market_breadth": {},
            "sectoral_indices": [],
            "indian_indices": [],
            "global_cues": {
                "indices": [],
                "commodities_currency": [],
            },
            "option_chain_summary": {},
        }

        # Warm NSE session once; all NSE endpoints reuse the same cookie jar.
        self.warm_nse_session()

        payload["institutional_flow"] = self.safe_collect(
            "nse_fii_dii", self.collect_institutional_flow, []
        )
        payload["top_gainers"] = self.safe_collect("nse_top_gainers", self.collect_stock_movers, [], "gainers")
        payload["top_losers"] = self.safe_collect("nse_top_losers", self.collect_stock_movers, [], "loosers")
        payload["market_breadth"] = self.safe_collect(
            "nse_market_breadth", self.collect_market_breadth, {}
        )
        payload["sectoral_indices"] = self.safe_collect(
            "nse_sectoral_indices", self.collect_sectoral_indices, []
        )
        payload["indian_indices"].extend(
            self.safe_collect("nse_indian_indices", self.collect_indian_indices, [])
        )
        payload["option_chain_summary"] = self.safe_collect(
            "nse_option_chain", self.collect_option_chain_summary, {}
        )

        # Yahoo Finance for global cues
        yahoo_context = self.safe_collect(
            "yahoo_finance_context", self.collect_yahoo_finance_context, {}
        )
        payload["indian_indices"].extend(yahoo_context.get("indian_indices", []))
        payload["indian_indices"] = dedupe_index_rows(payload["indian_indices"])

        payload["global_cues"]["indices"].extend(yahoo_context.get("global_indices", []))
        payload["global_cues"]["indices"] = dedupe_index_rows(payload["global_cues"]["indices"])

        payload["global_cues"]["commodities_currency"].extend(
            yahoo_context.get("commodities_currency", [])
        )

        payload["source_status"] = self.source_status
        payload["_meta"] = {
            "collector": "PremarketDataCollector",
            "source_status": self.source_status,
        }
        return payload

    # -----------------------------------------------------------------------
    # NSE session
    # -----------------------------------------------------------------------

    def warm_nse_session(self) -> None:
        """
        Hits the NSE homepage and option-chain pages to obtain session cookies
        required by all subsequent NSE API calls.

        FIX (Bug 1): The v3 option-chain endpoint requires a cookie that is
        only issued after visiting the /option-chain page with the correct
        Referer header. We now prime each symbol explicitly so the cookie jar
        is fully populated before any data call is made.
        """
        # Step 1 — homepage sets the base session cookie
        try:
            self.fetch_text(NSE_BASE_URL)
        except CollectionError:
            pass

        # Step 2 — option-chain page sets the gate cookie for v3 API calls
        try:
            self.fetch_text(
                f"{NSE_BASE_URL}/option-chain",
                referer=NSE_BASE_URL,
            )
        except CollectionError:
            pass

        # Step 3 — prime the v3 endpoint for each symbol we'll query;
        # NSE issues a per-symbol token on first access that subsequent
        # data calls require. Failures are non-fatal.
        for symbol in OPTION_CHAIN_SYMBOLS:
            try:
                self.fetch_text(
                    f"{NSE_BASE_URL}/api/option-chain-v3?type=Indices&symbol={symbol}",
                    referer=f"{NSE_BASE_URL}/option-chain",
                )
            except CollectionError:
                pass

        self.source_status["nse_session"] = "ok"

    # -----------------------------------------------------------------------
    # Safe wrapper
    # -----------------------------------------------------------------------

    def safe_collect(self, source_name: str, fn, fallback, *args):
        try:
            result = fn(*args)
            if has_collected_value(result):
                self.source_status[source_name] = "ok"
                return result
            self.source_status[source_name] = "empty"
            return fallback
        except Exception as exc:
            self.source_status[source_name] = f"failed: {exc}"
            return fallback

    # -----------------------------------------------------------------------
    # NSE collectors
    # -----------------------------------------------------------------------

    def collect_institutional_flow(self) -> list[dict[str, Any]]:
        rows = self.fetch_csv("/api/fiidiiTradeReact?csv=true")
        institutional_flow = []
        for row in rows[1:]:
            if len(row) < 5:
                continue
            category_raw = row[0].upper()
            if "DII" in category_raw:
                category = "DII"
            elif "FII" in category_raw:
                category = "FII"
            else:
                continue
            net_value = to_float(row[4])
            institutional_flow.append(
                {
                    "category": category,
                    "buy_value": to_float(row[2]),
                    "sell_value": to_float(row[3]),
                    "net_value": net_value,
                    "trend": "down" if net_value < 0 else "up",
                }
            )
        return institutional_flow

    def collect_stock_movers(self, mover_type: str) -> list[dict[str, Any]]:
        rows = self.fetch_csv(f"/api/live-analysis-variations?index={mover_type}&type=NIFTY&csv=true")
        movers = []
        for row in rows[1:]:
            if len(row) < 8:
                continue
            movers.append(
                {
                    "symbol": row[0],
                    "prev_close": clean_number(row[4]),
                    "ltp": clean_number(row[5]),
                    "pct_change": clean_number(row[6]),
                    "volume": clean_number(row[7]),
                }
            )
        return movers
    def collect_market_breadth(self) -> dict[str, Any]:
        data = self.fetch_json("/api/live-analysis-advance")
        advance_data = data.get("advance", {})
        count_data = advance_data.get("count", {})
        advances = count_data.get("Advances", 0)
        declines = count_data.get("Declines", 0)
        return {
            "advances": advances,
            "declines": declines,
            "ad_ratio": round(advances / declines, 2) if declines else None,
        }

    def collect_sectoral_indices(self) -> list[dict[str, Any]]:
        """
        Fetches sectoral indices from the NSE allIndices JSON endpoint.
        The CSV endpoint is unreliable; the JSON API is more stable and
        includes all the same fields we need.
        """
        data = self.fetch_json("/api/allIndices")
        rows = data.get("data", [])
        sectors = []
        for row in rows:
            if not isinstance(row, dict):
                continue
            index_name = normalize_index_name(row.get("index") or row.get("indexName") or "")
            # Keep only NIFTY sectoral indices (not broad/thematic)
            if not index_name.startswith("NIFTY") or index_name in NSE_PRIMARY_INDICES:
                continue
            # Skip strategy / non-sectoral indices that don't represent a sector
            if any(kw in index_name for kw in ("ALPHA", "BETA", "MOMENTUM", "QUALITY",
                                                "MULTI", "MIDCAP", "SMALLCAP", "MICROCAP",
                                                "LARGEMIDCAP", "TOTAL MARKET", "500",
                                                "100", "50 VALUE")):
                continue
            pct_change = to_float(row.get("percentChange") or row.get("pChange"))
            last = clean_number(row.get("last") or row.get("lastPrice"))
            change = clean_number(row.get("variation") or row.get("change"))
            pe = clean_number(row.get("pe") or row.get("P/E") or "")
            pb = clean_number(row.get("pb") or row.get("P/B") or "")
            dy = clean_number(row.get("dividendYield") or row.get("Div Yield") or "")
            sectors.append(
                {
                    "index_name": index_name,
                    "last": last,
                    "change": change,
                    "pct_change": pct_change,
                    "pe": pe,
                    "pb": pb,
                    "dividend_yield": dy,
                    "trend": "down" if pct_change < 0 else "up",
                }
            )
        # Sort by absolute % change so biggest movers come first
        sectors.sort(key=lambda r: abs(to_float(r["pct_change"])), reverse=True)
        return sectors

    def collect_indian_indices(self) -> list[dict[str, Any]]:
        data = self.fetch_json("/api/allIndices")
        rows = data.get("data", [])
        indices = []
        for row in rows:
            if not isinstance(row, dict):
                continue
            index_name = normalize_index_name(row.get("index") or row.get("indexName"))
            if index_name not in NSE_PRIMARY_INDICES:
                continue
            pct_change = to_float(row.get("percentChange") or row.get("pChange"))
            indices.append(
                {
                    "index_name": index_name,
                    "last": clean_number(row.get("last") or row.get("lastPrice")),
                    "prev_close": clean_number(row.get("previousClose")),
                    "change": clean_number(row.get("variation") or row.get("change")),
                    "change_percent": pct_change,
                    "trend": "down" if pct_change < 0 else "up",
                    "source": "nse",
                }
            )
        return indices

    def collect_option_chain_summary(self) -> dict[str, Any]:
        expiry = next_weekly_expiry(self.report_date).strftime("%d-%b-%Y")
        return {
            "NIFTY": self.collect_single_option_chain_summary("NIFTY", expiry),
            "BANKNIFTY": self.collect_single_option_chain_summary("BANKNIFTY", expiry),
        }

    def collect_single_option_chain_summary(self, symbol: str, expiry: str) -> dict[str, Any]:
        data = self.fetch_json(
            f"/api/option-chain-v3?type=Indices&symbol={symbol}&expiry={expiry}"
        )
        records = data.get("records", {}).get("data", [])
        ce_rows = [row["CE"] for row in records if row.get("CE")]
        pe_rows = [row["PE"] for row in records if row.get("PE")]
        total_call_oi = sum(int(row.get("openInterest") or 0) for row in ce_rows)
        total_put_oi = sum(int(row.get("openInterest") or 0) for row in pe_rows)
        max_call = max(ce_rows, key=lambda row: int(row.get("openInterest") or 0), default={})
        max_put = max(pe_rows, key=lambda row: int(row.get("openInterest") or 0), default={})
        return {
            "expiry": expiry,
            "pcr": round(total_put_oi / total_call_oi, 2) if total_call_oi else None,
            "max_call_oi_strike": max_call.get("strikePrice"),
            "max_call_oi": max_call.get("openInterest"),
            "max_put_oi_strike": max_put.get("strikePrice"),
            "max_put_oi": max_put.get("openInterest"),
            "underlying_value": data.get("records", {}).get("underlyingValue"),
        }
    def collect_yahoo_finance_context(self) -> dict[str, list[dict[str, Any]]]:
        """
        Uses the yfinance library to fetch quotes for every instrument in
        YAHOO_FINANCE_INSTRUMENTS and returns three buckets:
          - indian_indices
          - global_indices
          - commodities_currency

        All tickers are fetched in a single batch call (yf.download) so the
        number of HTTP round-trips is minimised.  Per-instrument failures are
        recorded in source_status under "yahoo_finance_<key>".
        """
        context: dict[str, list[dict[str, Any]]] = {
            "indian_indices": [],
            "global_indices": [],
            "commodities_currency": [],
        }

        symbols = [inst["symbol"] for inst in YAHOO_FINANCE_INSTRUMENTS]

        # Batch-download 2 days of data so we can compute change vs prev close.
        # period="2d" is the minimal fetch that gives us both today and yesterday.
        try:
            df = yf.download(
                tickers=symbols,
                period="2d",
                interval="1d",
                auto_adjust=False,
                progress=False,
                threads=True,
            )
        except Exception as exc:
            self.source_status["yahoo_finance_batch"] = f"failed: {exc}"
            return context

        self.source_status["yahoo_finance_batch"] = "ok"

        for instrument in YAHOO_FINANCE_INSTRUMENTS:
            status_key = f"yahoo_finance_{instrument['key']}"
            quote_data = self._parse_yahoo_instrument(df, instrument)
            if quote_data:
                self.source_status[status_key] = "ok"
                context[instrument["bucket"]].append(quote_data)
            else:
                self.source_status[status_key] = "empty: no data"

        return context

    def _parse_yahoo_instrument(
        self, df: Any, instrument: dict[str, str]
    ) -> dict[str, Any] | None:
        """
        Extracts the latest price, previous close, change, and % change for
        one instrument from the batched yfinance DataFrame.

        yfinance returns a MultiIndex DataFrame when multiple tickers are
        requested:
            columns = (field, ticker)
        and a plain DataFrame when only one ticker is requested.  We handle
        both shapes.
        """
        import pandas as pd  # noqa: PLC0415  (local import keeps top-level clean)

        symbol = instrument["symbol"]

        try:
            # Multi-ticker download → MultiIndex columns
            if isinstance(df.columns, pd.MultiIndex):
                close_series = df["Close"][symbol].dropna()
            else:
                # Single-ticker fall-back (shouldn't happen in batch mode)
                close_series = df["Close"].dropna()

            if close_series.empty:
                return None

            last_price = float(close_series.iloc[-1])
            prev_close = float(close_series.iloc[-2]) if len(close_series) >= 2 else last_price
        except (KeyError, IndexError, TypeError):
            return None

        change = last_price - prev_close
        change_pct = (change / prev_close * 100) if prev_close else 0.0

        return {
            "index_name": instrument["name"],
            "name": instrument["name"],
            "symbol": symbol,
            "last": f"{last_price:.4f}",
            "prev_close": f"{prev_close:.4f}",
            "change": f"{change:+.4f}",
            "change_percent": f"{change_pct:.2f}",
            "trend": "down" if change < 0 else "up",
            "source": "yahoo_finance",
        }

    # -----------------------------------------------------------------------
    # Low-level HTTP helpers (NSE only)
    # -----------------------------------------------------------------------

    def fetch_csv(self, path: str) -> list[list[str]]:
        text = self.fetch_text(
            NSE_BASE_URL + path if path.startswith("/") else path
        )
        return list(csv.reader(io.StringIO(text)))

    def fetch_json(self, path: str) -> dict[str, Any]:
        text = self.fetch_text(
            NSE_BASE_URL + path if path.startswith("/") else path
        )
        return json.loads(text)

    def fetch_text(self, url: str, *, referer: str | None = None) -> str:
        headers = dict(DEFAULT_HEADERS)
        if referer:
            headers["Referer"] = referer
        request = Request(url, headers=headers)
        try:
            with self.opener.open(request, timeout=self.timeout) as response:
                return response.read().decode("utf-8", errors="replace")
        except (HTTPError, URLError, TimeoutError) as exc:
            raise CollectionError(str(exc)) from exc


# ---------------------------------------------------------------------------
# Archive helper
# ---------------------------------------------------------------------------

def archive_premarket_data(raw_data: dict[str, Any], *, report_date: date) -> Path:
    archive_dir = Path(settings.BASE_DIR) / "data_archive" / "premarket"
    archive_dir.mkdir(parents=True, exist_ok=True)
    archive_path = archive_dir / f"{report_date.isoformat()}.json"
    archive_path.write_text(
        json.dumps(raw_data, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return archive_path


# ---------------------------------------------------------------------------
# Utility functions
# ---------------------------------------------------------------------------

def to_float(value: Any) -> float:
    return float(clean_number(value) or 0)


def float_or_zero(value: Any) -> float:
    try:
        return float(clean_number(value) or 0)
    except ValueError:
        return 0.0


def clean_number(value: Any) -> str:
    if value is None:
        return ""
    return str(value).replace(",", "").replace("₹", "").replace("$", "").strip()


def normalize_index_name(value: Any) -> str:
    return str(value or "").strip().upper()


def dedupe_index_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[str] = set()
    deduped = []
    for row in rows:
        name = normalize_index_name(row.get("index_name") or row.get("name"))
        if not name or name in seen:
            continue
        seen.add(name)
        deduped.append(row)
    return deduped


def next_weekly_expiry(base_date: date | None = None, *, offset: int = 0) -> date:
    """
    Returns the (offset+1)-th upcoming Thursday from base_date.
    offset=0 → next Thursday, offset=1 → Thursday after that, etc.
    If base_date itself is a Thursday it is NOT counted (we need a future date).
    """
    base_date = base_date or date.today()
    # Days until next Thursday (weekday 3)
    days_until = (3 - base_date.weekday()) % 7
    if days_until == 0:          # Today is Thursday → jump to next week's
        days_until = 7
    first_expiry = base_date + timedelta(days=days_until)
    return first_expiry + timedelta(weeks=offset)


def last_thursday_of_month(year: int, month: int) -> date:
    """Returns the last Thursday of the given month (NSE monthly expiry)."""
    # Start from the last day of the month and walk back to Thursday
    if month == 12:
        last_day = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = date(year, month + 1, 1) - timedelta(days=1)
    days_back = (last_day.weekday() - 3) % 7   # 3 = Thursday
    return last_day - timedelta(days=days_back)


def next_month(year: int, month: int) -> tuple[int, int]:
    """Returns (year, month) for the month after the given one."""
    return (year + 1, 1) if month == 12 else (year, month + 1)


def has_collected_value(value: Any) -> bool:
    if not value:
        return False
    if isinstance(value, dict):
        return any(has_collected_value(item) for item in value.values())
    if isinstance(value, list):
        return len(value) > 0
    return True