from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any

from django.db import transaction
from django.utils.text import slugify

from posts.models import (
    GlobalMarketIndex,
    GlobalMarketAnalysis,
    IndianMarketIndex,
    IndianMarketAnalysis,
    InstitutionalFlow,
    InstitutionalFlowAnalysis,
    MarketBreadth,
    MarketReport,
    OptionChainSummary,
    SectorAnalysis,
    SectorPerformance,
    StockMover,
    StockMoverAnalysis,
)


DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
MIN_REQUIRED_SECTIONS = 3
QUALITY_SECTION_POINTS = {
    "institutional_flow": 15,
    "market_breadth": 15,
    "sectoral_indices": 15,
    "top_gainers": 10,
    "top_losers": 10,
    "indian_indices": 15,
    "option_chain_summary": 10,
    "global_cues": 10,
}

SECTOR_KEYWORDS = {
    "IT": {"TCS", "INFY", "HCLTECH", "TECHM", "WIPRO", "LTIM", "PERSISTENT", "MPHASIS"},
    "Banking": {"HDFCBANK", "ICICIBANK", "SBIN", "AXISBANK", "KOTAKBANK", "INDUSINDBK"},
    "Healthcare": {"APOLLOHOSP", "MAXHEALTH", "DRREDDY", "CIPLA", "SUNPHARMA", "DIVISLAB"},
    "Auto": {"MARUTI", "M&M", "EICHERMOT", "TATAMOTORS", "BAJAJ-AUTO", "HEROMOTOCO"},
    "Energy": {"ONGC", "COALINDIA", "POWERGRID", "NTPC", "RELIANCE", "BPCL"},
    "Metals": {"TATASTEEL", "HINDALCO", "JSWSTEEL", "VEDL", "SAIL"},
    "Consumer": {"ITC", "NESTLEIND", "TATACONSUM", "HINDUNILVR", "BRITANNIA", "TRENT"},
    "Financial Services": {"BAJFINANCE", "BAJAJFINSV", "JIOFIN", "SHRIRAMFIN", "SBILIFE", "HDFCLIFE"},
}


class PremarketReportError(ValueError):
    """Raised when the source data cannot produce a safe report."""


@dataclass(frozen=True)
class MarketSignals:
    fii_net: Decimal | None
    dii_net: Decimal | None
    institutional_bias: str
    breadth_bias: str
    ad_ratio: Decimal | None
    leading_sectors: list[dict[str, Any]]
    weak_sectors: list[dict[str, Any]]
    top_gainers: list[dict[str, Any]]
    top_losers: list[dict[str, Any]]
    option_chain_summaries: list[dict[str, Any]]
    loser_sector_pressure: str | None
    overall_mood: str
    quality_score: int
    report_type: str
    quality_notes: dict[str, Any]


def build_report_from_data(
    raw_data: dict[str, Any],
    *,
    report_date: date,
    status: str = MarketReport.STATUS_DRAFT,
    replace: bool = False,
    image_url: str = DEFAULT_IMAGE_URL,
) -> MarketReport:
    validate_source_data(raw_data)
    signals = extract_market_signals(raw_data)
    title = (
        "Pre-Market Report: Nifty, Bank Nifty, FII/DII Data and "
        f"Stocks to Watch - {report_date.strftime('%d %B %Y')}"
    )
    slug = f"pre-market-report-{report_date.isoformat()}"

    with transaction.atomic():
        existing = MarketReport.objects.filter(report_date=report_date).first()
        if existing and not replace:
            raise PremarketReportError(
                f"A market report already exists for {report_date}. Use --replace to regenerate it."
            )
        if existing:
            existing.delete()

        report = MarketReport.objects.create(
            title=title,
            slug=slugify(slug),
            report_date=report_date,
            status=status,
            image_url=image_url,
            overall_conclusion=render_overall_conclusion(signals),
            quality_score=signals.quality_score,
            report_type=signals.report_type,
            quality_notes=signals.quality_notes,
            raw_data=raw_data,
        )

        create_analysis_records(report, signals)
        create_index_records(report, raw_data)
        create_institutional_flows(report, raw_data, report_date)
        create_stock_movers(report, raw_data)
        create_market_breadth(report, raw_data)
        create_sector_performance(report, signals)
        create_option_chain_summaries(report, signals)

    return report


def validate_source_data(raw_data: dict[str, Any]) -> None:
    if not isinstance(raw_data, dict) or not raw_data:
        raise PremarketReportError("Source JSON is empty or invalid.")

    section_checks = {
        "institutional_flow": bool(raw_data.get("institutional_flow")),
        "top_gainers": bool(raw_data.get("top_gainers")),
        "top_losers": bool(raw_data.get("top_losers")),
        "market_breadth": bool(raw_data.get("market_breadth")),
        "sectoral_indices": bool(raw_data.get("sectoral_indices")),
    }
    available_sections = sum(section_checks.values())
    if available_sections < MIN_REQUIRED_SECTIONS:
        missing = ", ".join(name for name, present in section_checks.items() if not present)
        raise PremarketReportError(
            f"Insufficient source data. Need at least {MIN_REQUIRED_SECTIONS} sections; missing: {missing}."
        )


def extract_market_signals(raw_data: dict[str, Any]) -> MarketSignals:
    flows = raw_data.get("institutional_flow", [])
    breadth = raw_data.get("market_breadth", {})
    sectors = sorted(
        raw_data.get("sectoral_indices", []),
        key=lambda item: to_decimal(item.get("pct_change")),
        reverse=True,
    )
    top_gainers = sort_movers(raw_data.get("top_gainers", []), reverse=True)[:5]
    top_losers = sort_movers(raw_data.get("top_losers", []), reverse=False)[:5]
    option_chain_summaries = normalize_option_chain_summaries(raw_data.get("option_chain_summary") or {})

    fii_net = find_institution_net(flows, "FII")
    dii_net = find_institution_net(flows, "DII")
    ad_ratio = to_decimal(breadth.get("ad_ratio"), default=None)

    institutional_bias = get_institutional_bias(fii_net, dii_net)
    breadth_bias = get_breadth_bias(ad_ratio)
    leading_sectors = [sector for sector in sectors if to_decimal(sector.get("pct_change")) > 0][:3]
    weak_sectors = [
        sector for sector in sorted(sectors, key=lambda item: to_decimal(item.get("pct_change")))
        if to_decimal(sector.get("pct_change")) < 0
    ][:3]
    loser_sector_pressure = detect_sector_pressure(top_losers)
    overall_mood = get_overall_mood(institutional_bias, breadth_bias, leading_sectors, weak_sectors)
    quality_notes = calculate_quality_notes(raw_data)

    return MarketSignals(
        fii_net=fii_net,
        dii_net=dii_net,
        institutional_bias=institutional_bias,
        breadth_bias=breadth_bias,
        ad_ratio=ad_ratio,
        leading_sectors=leading_sectors,
        weak_sectors=weak_sectors,
        top_gainers=top_gainers,
        top_losers=top_losers,
        option_chain_summaries=option_chain_summaries,
        loser_sector_pressure=loser_sector_pressure,
        overall_mood=overall_mood,
        quality_score=quality_notes["quality_score"],
        report_type=quality_notes["report_type"],
        quality_notes=quality_notes,
    )


def create_analysis_records(report: MarketReport, signals: MarketSignals) -> None:
    GlobalMarketAnalysis.objects.create(
        report=report,
        analysis=render_global_analysis(signals),
    )
    IndianMarketAnalysis.objects.create(
        report=report,
        analysis=(
            f"The domestic setup is {signals.overall_mood.lower()} based on institutional "
            f"activity, market breadth, sector rotation, and stock-specific movement. "
            f"{render_option_chain_analysis(signals)} "
            "Traders should wait for opening-range confirmation and avoid chasing the first "
            "move without clear volume support."
        ),
    )
    InstitutionalFlowAnalysis.objects.create(
        report=report,
        analysis=render_institutional_analysis(signals),
    )
    StockMoverAnalysis.objects.create(
        report=report,
        analysis=render_stock_mover_analysis(signals),
    )
    SectorAnalysis.objects.create(
        report=report,
        analysis=render_sector_analysis(signals),
    )


def create_index_records(report: MarketReport, raw_data: dict[str, Any]) -> None:
    for item in raw_data.get("indian_indices", []):
        name = str(item.get("index_name") or item.get("name") or "")[:100]
        if not name:
            continue
        change_percent = to_decimal(item.get("change_percent") or item.get("pct_change"))
        IndianMarketIndex.objects.create(
            report=report,
            index_name=name,
            prev_close=to_decimal(item.get("prev_close") or item.get("previous_close") or item.get("last")),
            open_price=to_decimal(item.get("last") or item.get("ltp") or item.get("price")),
            change=to_decimal(item.get("change")),
            change_percent=change_percent,
            trend="down" if change_percent < 0 else "up",
        )

    global_indices = (raw_data.get("global_cues") or {}).get("indices", [])
    for item in global_indices:
        name = str(item.get("index_name") or item.get("name") or "")[:100]
        if not name:
            continue
        change_percent = to_decimal(item.get("change_percent") or item.get("pct_change"))
        GlobalMarketIndex.objects.create(
            report=report,
            index_name=name,
            prev_close=to_decimal(item.get("prev_close") or item.get("previous_close") or item.get("last")),
            open_price=to_decimal(item.get("last") or item.get("ltp") or item.get("price")),
            change=to_decimal(item.get("change")),
            change_percent=change_percent,
            trend="down" if change_percent < 0 else "up",
        )


def create_institutional_flows(report: MarketReport, raw_data: dict[str, Any], report_date: date) -> None:
    for item in raw_data.get("institutional_flow", []):
        category = str(item.get("category", "")).upper()
        if category not in {"FII", "DII"}:
            continue
        net_value = to_decimal(item.get("net_value"))
        InstitutionalFlow.objects.create(
            report=report,
            institution_type=category,
            date=report_date,
            buy_value=to_decimal(item.get("buy_value")),
            sell_value=to_decimal(item.get("sell_value")),
            net_value=net_value,
            trend="down" if net_value < 0 else "up",
        )


def create_stock_movers(report: MarketReport, raw_data: dict[str, Any]) -> None:
    for category, source_key in (("gainer", "top_gainers"), ("loser", "top_losers")):
        for item in raw_data.get(source_key, [])[:20]:
            StockMover.objects.create(
                report=report,
                category=category,
                symbol=str(item.get("symbol", ""))[:20],
                prev_close=to_decimal(item.get("prev_close")),
                open_price=to_decimal(item.get("ltp")),
                change_percent=to_decimal(item.get("pct_change")),
                volume=str(item.get("volume", ""))[:50],
            )


def create_market_breadth(report: MarketReport, raw_data: dict[str, Any]) -> None:
    breadth = raw_data.get("market_breadth") or {}
    MarketBreadth.objects.create(
        report=report,
        advancing=int(to_decimal(breadth.get("advances"))),
        declining=int(to_decimal(breadth.get("declines"))),
        advance_decline_ratio=to_decimal(breadth.get("ad_ratio")),
    )


def create_sector_performance(report: MarketReport, signals: MarketSignals) -> None:
    selected = [("gainer", sector) for sector in signals.leading_sectors]
    selected.extend(("loser", sector) for sector in signals.weak_sectors)

    for category, sector in selected:
        SectorPerformance.objects.create(
            report=report,
            category=category,
            sector_name=str(sector.get("index_name", ""))[:100],
            prev_close=to_decimal(sector.get("last")),
            change=to_decimal(sector.get("change")),
            change_percent=to_decimal(sector.get("pct_change")),
            pe=to_decimal(sector.get("pe")),
            pb=to_decimal(sector.get("pb")),
            div_yield=to_decimal(sector.get("dividend_yield")),
        )


def create_option_chain_summaries(report: MarketReport, signals: MarketSignals) -> None:
    for summary in signals.option_chain_summaries:
        OptionChainSummary.objects.create(
            report=report,
            symbol=str(summary.get("symbol", ""))[:20],
            expiry=str(summary.get("expiry", ""))[:20],
            pcr=to_decimal(summary.get("pcr"), default=None),
            max_call_oi_strike=to_decimal(summary.get("max_call_oi_strike"), default=None),
            max_call_oi=int(to_decimal(summary.get("max_call_oi")) or 0),
            max_put_oi_strike=to_decimal(summary.get("max_put_oi_strike"), default=None),
            max_put_oi=int(to_decimal(summary.get("max_put_oi")) or 0),
            underlying_value=to_decimal(summary.get("underlying_value"), default=None),
            analysis=render_single_option_chain_analysis(summary),
        )


def render_overall_conclusion(signals: MarketSignals) -> str:
    leading = join_names([sector.get("index_name") for sector in signals.leading_sectors])
    weak = join_names([sector.get("index_name") for sector in signals.weak_sectors])
    gainers = join_names([item.get("symbol") for item in signals.top_gainers])
    losers = join_names([item.get("symbol") for item in signals.top_losers])
    options_context = render_option_chain_analysis(signals, concise=True)

    return (
        f"Today's pre-market setup points to a {signals.overall_mood.lower()} market bias. "
        f"Institutional activity is {signals.institutional_bias.lower()}, while market breadth "
        f"is {signals.breadth_bias.lower()} with an advance-decline ratio of {format_decimal(signals.ad_ratio)}. "
        "This suggests traders should begin the session with a prepared watchlist rather than a fixed directional view.\n\n"
        f"Sector rotation is important today. Strength is visible in {leading or 'select pockets of the market'}, "
        f"while weakness is visible in {weak or 'limited pockets'}. Active gainers include {gainers or 'select large-cap names'}, "
        f"whereas pressure is visible in {losers or 'select weak counters'}.\n\n"
        f"{options_context} "
        "The safer approach is to wait for opening-range confirmation, use nearby price levels from the live chart, "
        "and keep risk management and position sizing controlled. This report is for market preparation and education only, not a direct buy or sell recommendation."
    )


def render_global_analysis(signals: MarketSignals) -> str:
    source_status = signals.quality_notes.get("source_status", {})
    has_global_cues = "global_cues" not in signals.quality_notes.get("missing_sections", [])
    if has_global_cues:
        return (
            "Global market cues are included as context for today's opening setup. "
            "Because free global sources can be delayed, traders should treat them as a broad risk indicator and confirm the domestic opening range before taking a directional view."
        )

    failed_sources = [
        name for name, status in source_status.items()
        if isinstance(status, str) and status.startswith("failed")
    ]
    detail = f" Missing optional sources: {join_names(failed_sources)}." if failed_sources else ""
    return (
        "Global market cues were not strong enough to include as a decisive signal in this report. "
        "The report therefore gives higher weight to NSE-derived domestic data, institutional activity, sector rotation, and market breadth."
        f"{detail}"
    )


def render_institutional_analysis(signals: MarketSignals) -> str:
    return (
        f"Institutional flow is {signals.institutional_bias.lower()}. "
        f"FII net activity stands at {format_currency(signals.fii_net)}, while DII net activity stands at "
        f"{format_currency(signals.dii_net)}. "
        "When foreign and domestic flows diverge, traders should watch whether domestic buying can absorb selling pressure. "
        "A clean intraday bias is stronger only when price action confirms the flow data after the market opens."
    )


def render_stock_mover_analysis(signals: MarketSignals) -> str:
    gainers = join_names([item.get("symbol") for item in signals.top_gainers])
    losers = join_names([item.get("symbol") for item in signals.top_losers])
    pressure = (
        f" A cluster of weakness is visible in {signals.loser_sector_pressure}, so traders should be cautious with long setups in that pocket."
        if signals.loser_sector_pressure
        else ""
    )

    return (
        f"The active gainer list is led by {gainers or 'select counters'}, showing where early momentum may stay stock-specific. "
        f"The loser list is led by {losers or 'select counters'}, which should be watched for continuation pressure or reversal attempts."
        f"{pressure} Volume confirmation and opening-range behavior should decide whether these names remain actionable."
    )


def render_sector_analysis(signals: MarketSignals) -> str:
    leading = join_names([sector.get("index_name") for sector in signals.leading_sectors])
    weak = join_names([sector.get("index_name") for sector in signals.weak_sectors])

    return (
        f"Sector performance is selective. Leading sectors are {leading or 'not clearly established'}, while weaker sectors are "
        f"{weak or 'not clearly established'}. This type of rotation usually favors focused stock selection over broad market chasing. "
        "Traders should compare sector strength with index direction before committing to intraday positions."
    )


def render_option_chain_analysis(signals: MarketSignals, *, concise: bool = False) -> str:
    summaries = [
        render_single_option_chain_analysis(item, concise=concise)
        for item in signals.option_chain_summaries
    ]
    summaries = [summary for summary in summaries if summary]
    if not summaries:
        return (
            "Options data is not being treated as a decisive signal today, so price action and opening-range confirmation remain more important."
        )
    return " ".join(summaries)


def render_single_option_chain_analysis(summary: dict[str, Any], *, concise: bool = False) -> str:
    symbol = str(summary.get("symbol") or "Index").upper()
    pcr = to_decimal(summary.get("pcr"), default=None)
    call_strike = to_decimal(summary.get("max_call_oi_strike"), default=None)
    put_strike = to_decimal(summary.get("max_put_oi_strike"), default=None)
    underlying = to_decimal(summary.get("underlying_value"), default=None)
    expiry = summary.get("expiry")

    if not pcr and not call_strike and not put_strike:
        return ""

    pcr_text = "a balanced options setup"
    if pcr is not None:
        if pcr >= Decimal("1.2"):
            pcr_text = f"a put-heavy PCR near {format_decimal(pcr)}, which can indicate supportive positioning but also requires confirmation"
        elif pcr <= Decimal("0.8"):
            pcr_text = f"a call-heavy PCR near {format_decimal(pcr)}, which keeps the setup cautious unless price confirms strength"
        else:
            pcr_text = f"a balanced PCR near {format_decimal(pcr)}"

    zones = []
    if call_strike is not None:
        zones.append(f"highest call OI at {format_decimal(call_strike)}")
    if put_strike is not None:
        zones.append(f"highest put OI at {format_decimal(put_strike)}")

    expiry_text = f" for the {expiry} expiry" if expiry else ""
    zone_text = join_names(zones)
    distance_note = render_option_distance_note(underlying, call_strike, put_strike)

    if concise and zone_text:
        return (
            f"Options data shows {pcr_text}; the largest OI strikes are better treated as expiry positioning, "
            f"not automatic intraday support or resistance. {distance_note}"
        ).strip()
    if zone_text:
        return (
            f"{symbol} options{expiry_text} show {pcr_text}, with {zone_text}. "
            f"These are OI walls for expiry context, not direct day-trading support or resistance. {distance_note}"
        ).strip()
    return f"{symbol} options{expiry_text} show {pcr_text}."


def render_option_distance_note(
    underlying: Decimal | None,
    call_strike: Decimal | None,
    put_strike: Decimal | None,
) -> str:
    if not underlying or underlying <= 0:
        return ""

    notes = []
    if put_strike is not None:
        put_distance = abs((underlying - put_strike) / underlying * Decimal("100"))
        notes.append(f"put wall is {format_decimal(put_distance)}% away")
    if call_strike is not None:
        call_distance = abs((call_strike - underlying) / underlying * Decimal("100"))
        notes.append(f"call wall is {format_decimal(call_distance)}% away")
    if not notes:
        return ""
    return f"From spot, the {join_names(notes)}, so live price action should decide intraday levels."


def calculate_quality_notes(raw_data: dict[str, Any]) -> dict[str, Any]:
    missing_sections = []
    present_sections = []
    score = 0

    for section, points in QUALITY_SECTION_POINTS.items():
        if section_has_quality_value(raw_data, section):
            present_sections.append(section)
            score += points
        else:
            missing_sections.append(section)

    if score >= 85:
        report_type = MarketReport.REPORT_TYPE_FULL
    elif score >= 60:
        report_type = MarketReport.REPORT_TYPE_STANDARD
    elif score >= 35:
        report_type = MarketReport.REPORT_TYPE_LIMITED
    else:
        report_type = MarketReport.REPORT_TYPE_FAILED

    source_status = raw_data.get("source_status") or raw_data.get("_meta", {}).get("source_status") or {}
    return {
        "quality_score": min(score, 100),
        "report_type": report_type,
        "present_sections": present_sections,
        "missing_sections": missing_sections,
        "source_status": source_status,
    }


def section_has_quality_value(raw_data: dict[str, Any], section: str) -> bool:
    if section == "global_cues":
        return bool((raw_data.get("global_cues") or {}).get("indices"))
    if section == "option_chain_summary":
        return any(bool(value) for value in (raw_data.get("option_chain_summary") or {}).values())
    if section == "indian_indices":
        important_names = {"NIFTY 50", "NIFTY BANK", "BANK NIFTY", "BSE SENSEX", "SENSEX"}
        return any(
            str(item.get("index_name") or item.get("name") or "").upper() in important_names
            for item in raw_data.get("indian_indices", [])
        )
    return bool(raw_data.get(section))


def normalize_option_chain_summaries(raw_options: dict[str, Any]) -> list[dict[str, Any]]:
    summaries = []
    for symbol, item in raw_options.items():
        if not isinstance(item, dict):
            continue
        summary = {
            "symbol": symbol,
            "expiry": item.get("expiry"),
            "pcr": item.get("pcr"),
            "max_call_oi_strike": item.get("max_call_oi_strike"),
            "max_call_oi": item.get("max_call_oi"),
            "max_put_oi_strike": item.get("max_put_oi_strike"),
            "max_put_oi": item.get("max_put_oi"),
            "underlying_value": item.get("underlying_value"),
        }
        if render_single_option_chain_analysis(summary):
            summaries.append(summary)
    return summaries


def get_institutional_bias(fii_net: Decimal | None, dii_net: Decimal | None) -> str:
    if fii_net is None and dii_net is None:
        return "unconfirmed"
    if (fii_net or Decimal("0")) < 0 and (dii_net or Decimal("0")) > 0:
        return "mixed, with DII support against FII selling"
    if (fii_net or Decimal("0")) > 0 and (dii_net or Decimal("0")) > 0:
        return "supportive, with both FII and DII net buying"
    if (fii_net or Decimal("0")) < 0 and (dii_net or Decimal("0")) < 0:
        return "risk-off, with both FII and DII net selling"
    if (fii_net or Decimal("0")) > 0:
        return "moderately supportive due to FII buying"
    return "cautious due to institutional selling pressure"


def get_breadth_bias(ad_ratio: Decimal | None) -> str:
    if ad_ratio is None:
        return "unconfirmed"
    if ad_ratio >= Decimal("1.25"):
        return "strong"
    if ad_ratio >= Decimal("0.9"):
        return "balanced"
    return "weak"


def get_overall_mood(
    institutional_bias: str,
    breadth_bias: str,
    leading_sectors: list[dict[str, Any]],
    weak_sectors: list[dict[str, Any]],
) -> str:
    if "risk-off" in institutional_bias or breadth_bias == "weak":
        return "Cautious"
    if "supportive" in institutional_bias and breadth_bias in {"strong", "balanced"}:
        return "Constructive"
    if len(weak_sectors) > len(leading_sectors):
        return "Selective and cautious"
    return "Selective"


def detect_sector_pressure(movers: list[dict[str, Any]]) -> str | None:
    counts: dict[str, int] = {}
    for mover in movers:
        symbol = str(mover.get("symbol", "")).upper()
        for sector, symbols in SECTOR_KEYWORDS.items():
            if symbol in symbols:
                counts[sector] = counts.get(sector, 0) + 1
    if not counts:
        return None
    sector, count = max(counts.items(), key=lambda item: item[1])
    return sector if count >= 2 else None


def sort_movers(movers: list[dict[str, Any]], *, reverse: bool) -> list[dict[str, Any]]:
    return sorted(movers, key=lambda item: to_decimal(item.get("pct_change")), reverse=reverse)


def find_institution_net(flows: list[dict[str, Any]], category: str) -> Decimal | None:
    for flow in flows:
        if str(flow.get("category", "")).upper() == category:
            return to_decimal(flow.get("net_value"), default=None)
    return None


def to_decimal(value: Any, default: Decimal | None = Decimal("0")) -> Decimal | None:
    if value is None or value == "":
        return default
    try:
        return Decimal(str(value).replace(",", "").strip())
    except (InvalidOperation, ValueError):
        return default


def format_decimal(value: Decimal | None) -> str:
    if value is None:
        return "unavailable"
    return f"{value:.2f}"


def format_currency(value: Decimal | None) -> str:
    if value is None:
        return "unavailable"
    sign = "-" if value < 0 else ""
    return f"{sign}Rs {abs(value):,.2f} crore"


def join_names(values: list[Any]) -> str:
    names = [str(value) for value in values if value]
    if not names:
        return ""
    if len(names) == 1:
        return names[0]
    return ", ".join(names[:-1]) + f" and {names[-1]}"
