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

from django.conf import settings
from django.utils import timezone


NSE_BASE_URL = "https://www.nseindia.com"
GOOGLE_FINANCE_BASE_URL = "https://www.google.com/finance/quote"
MONEYCONTROL_BASE_URL = "https://www.moneycontrol.com/"
MONEYCONTROL_GLOBAL_MARKETS_URL = (
    "https://api.moneycontrol.com/mcapi/v1/premarket/get-global-marketdata?section=mi"
)
GOOGLE_PRICE_CLASS = "YMlKec fxKbKc"

DEFAULT_TIMEOUT_SECONDS = 20
DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/json,text/csv,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/",
}

GOOGLE_FINANCE_INSTRUMENTS = [
    {"key": "nifty_50", "name": "NIFTY 50", "symbol": "NIFTY_50:INDEXNSE", "bucket": "indian_indices"},
    {"key": "nifty_bank", "name": "Nifty Bank", "symbol": "NIFTY_BANK:INDEXNSE", "bucket": "indian_indices"},
    {"key": "sensex", "name": "BSE Sensex", "symbol": "SENSEX:INDEXBOM", "bucket": "indian_indices"},
    {"key": "dow_jones", "name": "Dow Jones", "symbol": ".DJI:INDEXDJX", "bucket": "global_indices"},
    {"key": "nasdaq", "name": "Nasdaq Composite", "symbol": ".IXIC:INDEXNASDAQ", "bucket": "global_indices"},
    {"key": "sp_500", "name": "S&P 500", "symbol": ".INX:INDEXSP", "bucket": "global_indices"},
    {"key": "gold", "name": "Gold Futures", "symbol": "GCW00:COMEX", "bucket": "commodities_currency"},
    {"key": "crude_oil", "name": "Crude Oil Futures", "symbol": "CLW00:NYMEX", "bucket": "commodities_currency"},
]
NSE_PRIMARY_INDICES = {"NIFTY 50", "NIFTY BANK", "NIFTY 500", "INDIA VIX"}


class CollectionError(RuntimeError):
    pass


class PremarketDataCollector:
    def __init__(self, *, timeout: int = DEFAULT_TIMEOUT_SECONDS):
        self.timeout = timeout
        self.opener = build_opener(HTTPCookieProcessor())
        self.source_status: dict[str, str] = {}
        self.report_date: date | None = None

    def collect(self, *, report_date: date | None = None, include_google: bool = True) -> dict[str, Any]:
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

        self.warm_nse_session()
        payload["institutional_flow"] = self.safe_collect("nse_fii_dii", self.collect_institutional_flow, [])
        payload["top_gainers"] = self.safe_collect("nse_top_gainers", self.collect_stock_movers, [], "gainers")
        payload["top_losers"] = self.safe_collect("nse_top_losers", self.collect_stock_movers, [], "loosers")
        payload["market_breadth"] = self.safe_collect("nse_market_breadth", self.collect_market_breadth, {})
        payload["sectoral_indices"] = self.safe_collect("nse_sectoral_indices", self.collect_sectoral_indices, [])
        payload["indian_indices"].extend(self.safe_collect("nse_indian_indices", self.collect_indian_indices, []))
        payload["option_chain_summary"] = self.safe_collect("nse_option_chain", self.collect_option_chain_summary, {})
        payload["global_cues"]["indices"].extend(
            self.safe_collect("moneycontrol_global_indices", self.collect_moneycontrol_global_indices, [])
        )

        if include_google:
            google_context = self.safe_collect("google_finance_context", self.collect_google_finance_context, {})
            payload["indian_indices"].extend(google_context.get("indian_indices", []))
            payload["indian_indices"] = dedupe_index_rows(payload["indian_indices"])
            payload["global_cues"]["indices"].extend(google_context.get("global_indices", []))
            payload["global_cues"]["indices"] = dedupe_index_rows(payload["global_cues"]["indices"])
            payload["global_cues"]["commodities_currency"].extend(
                google_context.get("commodities_currency", [])
            )

        payload["source_status"] = self.source_status
        payload["_meta"] = {
            "collector": "PremarketDataCollector",
            "source_status": self.source_status,
        }
        return payload

    def warm_nse_session(self) -> None:
        try:
            self.fetch_text(NSE_BASE_URL)
            self.source_status["nse_session"] = "ok"
        except CollectionError as exc:
            self.source_status["nse_session"] = f"failed: {exc}"

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
        advances = data["advance"]["count"]["Advances"]
        declines = data["advance"]["count"]["Declines"]
        return {
            "advances": advances,
            "declines": declines,
            "ad_ratio": round(advances / declines, 2) if declines else None,
        }

    def collect_sectoral_indices(self) -> list[dict[str, Any]]:
        rows = self.fetch_csv("/api/allIndices?type=SECTORAL%20INDICES&mode=mae&csv=true")
        sectors = []
        for row in rows:
            if not row or len(row) < 7 or not row[0].startswith("NIFTY"):
                continue
            pct_change = to_float(row[3])
            sectors.append(
                {
                    "index_name": row[0],
                    "last": clean_number(row[1]),
                    "change": clean_number(row[2]),
                    "pct_change": pct_change,
                    "pe": clean_number(row[4]),
                    "pb": clean_number(row[5]),
                    "dividend_yield": clean_number(row[6]),
                    "trend": "down" if pct_change < 0 else "up",
                }
            )
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
            pct_change = to_float(row.get("percentChange"))
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

    def collect_moneycontrol_global_indices(self) -> list[dict[str, Any]]:
        payload = json.loads(
            self.fetch_text(MONEYCONTROL_GLOBAL_MARKETS_URL, referer=MONEYCONTROL_BASE_URL)
        )
        indices = []
        for item in payload.get("data", []):
            if not isinstance(item, dict):
                continue
            name = str(item.get("name") or "").strip()
            if not name:
                continue
            last = clean_number(item.get("ltp"))
            change = clean_number(item.get("chg"))
            change_percent = clean_number(item.get("chgper"))
            indices.append(
                {
                    "index_name": name,
                    "name": name,
                    "last": last,
                    "prev_close": str(float_or_zero(last) - float_or_zero(change)),
                    "change": change,
                    "change_percent": change_percent,
                    "trend": "down" if str(change).startswith("-") else "up",
                    "market_state": item.get("market_state"),
                    "market_time": item.get("market_time"),
                    "updated_date": item.get("updatedDate"),
                    "source": "moneycontrol",
                }
            )
        return indices

    def collect_google_finance_context(self) -> dict[str, list[dict[str, Any]]]:
        context = {
            "indian_indices": [],
            "global_indices": [],
            "commodities_currency": [],
        }
        for instrument in GOOGLE_FINANCE_INSTRUMENTS:
            quote_data = self.collect_google_finance_quote(instrument)
            if not quote_data:
                continue
            context[instrument["bucket"]].append(quote_data)
        return context

    def collect_google_finance_quote(self, instrument: dict[str, str]) -> dict[str, Any] | None:
        url = f"{GOOGLE_FINANCE_BASE_URL}/{quote(instrument['symbol'], safe=':')}?hl=en"
        html = self.fetch_text(url, referer="https://www.google.com/finance/")
        price = extract_google_finance_price(html)
        if not price:
            return None
        change, change_percent = extract_google_finance_change(html)
        return {
            "index_name": instrument["name"],
            "name": instrument["name"],
            "symbol": instrument["symbol"],
            "last": price,
            "prev_close": str(float_or_zero(price) - float_or_zero(change)),
            "change": change or "0",
            "change_percent": change_percent or "0",
            "trend": "down" if str(change or "").strip().startswith("-") else "up",
            "source": "google_finance",
        }

    def fetch_csv(self, path: str) -> list[list[str]]:
        text = self.fetch_text(NSE_BASE_URL + path if path.startswith("/") else path)
        return list(csv.reader(io.StringIO(text)))

    def fetch_json(self, path: str) -> dict[str, Any]:
        text = self.fetch_text(NSE_BASE_URL + path if path.startswith("/") else path)
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


def archive_premarket_data(raw_data: dict[str, Any], *, report_date: date) -> Path:
    archive_dir = Path(settings.BASE_DIR) / "data_archive" / "premarket"
    archive_dir.mkdir(parents=True, exist_ok=True)
    archive_path = archive_dir / f"{report_date.isoformat()}.json"
    archive_path.write_text(json.dumps(raw_data, indent=2, ensure_ascii=False), encoding="utf-8")
    return archive_path


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
    seen = set()
    deduped = []
    for row in rows:
        name = normalize_index_name(row.get("index_name") or row.get("name"))
        if not name or name in seen:
            continue
        seen.add(name)
        deduped.append(row)
    return deduped


def next_weekly_expiry(base_date: date | None = None) -> date:
    base_date = base_date or timezone.localdate()
    days_until_tuesday = (1 - base_date.weekday()) % 7
    if days_until_tuesday == 0:
        days_until_tuesday = 7
    return base_date + timedelta(days=days_until_tuesday)


def has_collected_value(value: Any) -> bool:
    if not value:
        return False
    if isinstance(value, dict):
        return any(has_collected_value(item) for item in value.values())
    if isinstance(value, list):
        return len(value) > 0
    return True


def extract_google_finance_price(html: str) -> str:
    class_tokens = [re.escape(token) for token in GOOGLE_PRICE_CLASS.split()]
    class_pattern = "".join(f"(?=[^\"]*{token})" for token in class_tokens)
    match = re.search(rf'<[^>]+class="{class_pattern}[^"]*"[^>]*>([^<]+)', html)
    return clean_number(match.group(1)) if match else ""


def extract_google_finance_change(html: str) -> tuple[str, str]:
    change_match = re.search(r'jsname="Fe7oBc"[^>]*>([^<]+)', html)
    percent_match = re.search(r'jsname="m6NnIb"[^>]*>\(([^<]+)\)', html)
    return (
        clean_number(change_match.group(1)) if change_match else "",
        clean_number(percent_match.group(1).replace("%", "")) if percent_match else "",
    )
