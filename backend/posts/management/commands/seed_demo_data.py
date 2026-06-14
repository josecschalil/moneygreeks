from datetime import date, timedelta
from decimal import Decimal
from itertools import cycle

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from posts.models import (
    BlogPost,
    DailySentiment,
    EducationCategory,
    Enquiry,
    GlobalMarketAnalysis,
    GlobalMarketIndex,
    IndianMarketAnalysis,
    IndianMarketIndex,
    InstitutionalFlow,
    InstitutionalFlowAnalysis,
    MarketBreadth,
    MarketReport,
    NewsletterSubscriber,
    OptionChainSummary,
    PostMarketReport,
    SectorAnalysis,
    SectorPerformance,
    StockMover,
    StockMoverAnalysis,
)


class Command(BaseCommand):
    help = "Seed demo data across the posts app so the frontend can render realistic content."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Remove existing demo records before seeding fresh ones.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            self.clear_demo_data()

        categories = self.seed_education_categories()
        reports = self.seed_market_reports()
        self.seed_related_market_data(reports)
        self.seed_blog_posts(categories)
        self.seed_supporting_data()

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))

    def clear_demo_data(self):
        demo_filters = {
            "slug__startswith": "demo-",
        }
        BlogPost.objects.filter(**demo_filters).delete()
        EducationCategory.objects.filter(**demo_filters).delete()
        PostMarketReport.objects.filter(**demo_filters).delete()
        NewsletterSubscriber.objects.filter(email__endswith="@demo.moneygreeks.local").delete()
        Enquiry.objects.filter(email__endswith="@demo.moneygreeks.local").delete()
        DailySentiment.objects.filter(date__gte=date(2026, 1, 1)).delete()
        MarketReport.objects.filter(slug__startswith="demo-").delete()

    def seed_education_categories(self):
        category_specs = [
            ("Options Basics", "Foundations of calls, puts, and risk control."),
            ("Greeks", "Delta, gamma, theta, vega, and how they affect positions."),
            ("Risk Management", "Sizing, hedging, and portfolio-level protection."),
            ("Macro", "Rates, inflation, growth, and liquidity context."),
            ("Price Action", "Patterns, trends, and market structure."),
            ("Volatility", "Implied volatility, realized volatility, and regime shifts."),
            ("Sector Rotation", "How leadership moves between sectors."),
            ("Derivatives", "Multi-leg strategies and payoff design."),
            ("Market Breadth", "Advance-decline dynamics and participation."),
            ("Earnings", "How to read company results and guidance."),
        ]

        categories = []
        for name, description in category_specs:
            slug = slugify(f"demo-{name}")
            category, _ = EducationCategory.objects.update_or_create(
                slug=slug,
                defaults={"name": name, "description": description},
            )
            categories.append(category)
        return categories

    def seed_market_reports(self):
        base_date = date(2026, 6, 14)
        report_templates = [
            ("Global markets steady ahead of central bank commentary", "published", "full", 84),
            ("Indian indices consolidate after a strong open", "published", "standard", 79),
            ("FII buying offsets cautious domestic flows", "published", "standard", 76),
            ("Mid-cap momentum narrows while defensives outperform", "published", "limited", 72),
            ("Breadth improves as advancers outnumber decliners", "published", "full", 88),
            ("Options positioning shows elevated call writing", "published", "limited", 74),
            ("Energy and metal names lead sector rotation", "published", "standard", 81),
            ("Volatility cools after a choppy session", "published", "limited", 69),
            ("Foreign flows and earnings guidance keep traders alert", "published", "full", 86),
            ("Closing recap highlights selective strength across majors", "published", "standard", 80),
        ]

        reports = []
        for idx, (headline, status, report_type, quality_score) in enumerate(report_templates):
            report_date = base_date - timedelta(days=idx)
            title = f"Demo Market Report {idx + 1}: {headline}"
            slug = f"demo-market-report-{idx + 1}"
            report, _ = MarketReport.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "report_date": report_date,
                    "status": status,
                    "image_url": f"https://images.unsplash.com/photo-1642790106117-1b7d8b14d51b?auto=format&fit=crop&w=1200&q=80",
                    "overall_conclusion": (
                        "Demo conclusion: the market remained constructive with rotational leadership, "
                        "supported by selective institutional participation and stable breadth."
                    ),
                    "quality_score": quality_score,
                    "report_type": report_type,
                    "quality_notes": {
                        "summary": "Synthetic demo content for frontend hydration.",
                        "signals": ["breadth", "flows", "volatility", "sector rotation"],
                    },
                    "raw_data": {
                        "source": "seed_demo_data",
                        "date": report_date.isoformat(),
                    },
                },
            )
            reports.append(report)
        return reports

    def seed_related_market_data(self, reports):
        global_names = ["S&P 500", "NASDAQ", "Dow Jones", "FTSE 100", "DAX", "Nikkei 225", "Hang Seng", "ASX 200", "CAC 40", "Nifty 50"]
        indian_names = ["Nifty 50", "Sensex", "Nifty Bank", "Nifty IT", "Nifty Pharma", "Nifty Metal", "Nifty Realty", "Nifty Auto", "Nifty FMCG", "Nifty PSU Bank"]
        institution_cycle = cycle(["FII", "DII"])
        stock_symbols = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "LT", "SBIN", "ITC", "HINDUNILVR", "AXISBANK"]
        sector_names = ["Technology", "Banking", "Energy", "Healthcare", "Auto", "Metals", "FMCG", "Real Estate", "Pharma", "Capital Goods"]
        option_symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY", "RELIANCE", "TCS", "SBIN", "INFY", "ICICIBANK", "LT", "HDFCBANK"]

        for idx, report in enumerate(reports):
            idx_decimal = Decimal(idx)
            GlobalMarketIndex.objects.update_or_create(
                report=report,
                index_name=global_names[idx],
                defaults={
                    "prev_close": Decimal("10000.00") + (idx_decimal * Decimal("123")),
                    "open_price": Decimal("10020.00") + (idx_decimal * Decimal("121")),
                    "change": Decimal("20.00") - idx_decimal,
                    "change_percent": Decimal("0.20") + (idx_decimal / Decimal("10")),
                    "trend": "up" if idx % 2 == 0 else "down",
                },
            )
            GlobalMarketAnalysis.objects.update_or_create(
                report=report,
                defaults={
                    "analysis": (
                        "Global risk sentiment stayed balanced, with index support coming from "
                        "large-cap stability and a pause in bond yield volatility."
                    )
                },
            )

            IndianMarketIndex.objects.update_or_create(
                report=report,
                index_name=indian_names[idx],
                defaults={
                    "prev_close": Decimal("22000.00") + (idx_decimal * Decimal("90")),
                    "open_price": Decimal("22040.00") + (idx_decimal * Decimal("88")),
                    "change": Decimal("40.00") - (idx_decimal * Decimal("1.5")),
                    "change_percent": Decimal("0.18") + (idx_decimal / Decimal("12")),
                    "trend": "up" if idx % 3 != 1 else "down",
                },
            )
            IndianMarketAnalysis.objects.update_or_create(
                report=report,
                defaults={
                    "analysis": (
                        "Indian equities traded in a constructive range, with financials and "
                        "energy names helping offset weakness in defensives."
                    )
                },
            )

            InstitutionalFlow.objects.update_or_create(
                report=report,
                institution_type=next(institution_cycle),
                date=report.report_date,
                defaults={
                    "buy_value": Decimal("1450.00") + (idx_decimal * Decimal("55")),
                    "sell_value": Decimal("1320.00") + (idx_decimal * Decimal("41")),
                    "net_value": Decimal("130.00") + (idx_decimal * Decimal("14")),
                    "trend": "up" if idx % 2 == 0 else "down",
                },
            )
            InstitutionalFlowAnalysis.objects.update_or_create(
                report=report,
                defaults={
                    "analysis": (
                        "Institutional flows remained selective, but the net posture was healthy "
                        "enough to keep momentum names in focus."
                    )
                },
            )

            StockMover.objects.update_or_create(
                report=report,
                symbol=stock_symbols[idx],
                category="gainer" if idx % 2 == 0 else "loser",
                defaults={
                    "prev_close": Decimal("1000.00") + (idx_decimal * Decimal("37")),
                    "open_price": Decimal("1010.00") + (idx_decimal * Decimal("35")),
                    "change_percent": Decimal("1.25") - (idx_decimal / Decimal("10")),
                    "volume": f"{4 + idx}M",
                },
            )
            StockMoverAnalysis.objects.update_or_create(
                report=report,
                defaults={
                    "analysis": (
                        "Large-cap movers were driven by earnings revisions, passive flows, and "
                        "short-covering in names with better-than-expected margin commentary."
                    )
                },
            )

            MarketBreadth.objects.update_or_create(
                report=report,
                defaults={
                    "advancing": 1700 + (idx * 35),
                    "declining": 1200 + (idx * 20),
                    "advance_decline_ratio": Decimal("1.35") + (idx_decimal / Decimal("20")),
                },
            )

            SectorPerformance.objects.update_or_create(
                report=report,
                sector_name=sector_names[idx],
                category="gainer" if idx % 2 == 0 else "loser",
                defaults={
                    "prev_close": Decimal("100.00") + (idx_decimal * Decimal("4")),
                    "change": Decimal("1.50") - (idx_decimal / Decimal("5")),
                    "change_percent": Decimal("1.25") - (idx_decimal / Decimal("8")),
                    "pe": Decimal("18.00") + idx_decimal,
                    "pb": Decimal("3.10") + (idx_decimal / Decimal("10")),
                    "div_yield": Decimal("1.20") + (idx_decimal / Decimal("20")),
                },
            )
            SectorAnalysis.objects.update_or_create(
                report=report,
                defaults={
                    "analysis": (
                        "Sector leadership remained concentrated in cyclicals and rate-sensitive "
                        "groups, while expensive defensives lagged."
                    )
                },
            )

            OptionChainSummary.objects.update_or_create(
                report=report,
                symbol=option_symbols[idx],
                expiry=f"{report.report_date:%d %b %Y}",
                defaults={
                    "pcr": Decimal("0.95") + (idx_decimal / Decimal("50")),
                    "max_call_oi_strike": Decimal("22500.00") + (idx_decimal * Decimal("100")),
                    "max_call_oi": 100000 + (idx * 8500),
                    "max_put_oi_strike": Decimal("22000.00") + (idx_decimal * Decimal("100")),
                    "max_put_oi": 95000 + (idx * 7800),
                    "underlying_value": Decimal("22350.00") + (idx_decimal * Decimal("90")),
                    "analysis": (
                        "Open interest remained balanced with a mild bullish bias, suggesting a "
                        "range-bound session unless fresh macro catalysts emerge."
                    ),
                },
            )

    def seed_blog_posts(self, categories):
        blog_specs = [
            ("How delta affects directional trades", "education", "latest"),
            ("Why inflation data still matters for equity multiples", "finance", "deep_dive"),
            ("Top three risk controls for swing traders", "education", "quick_hit"),
            ("Sector rotation signs to watch this quarter", "news", "latest"),
            ("Understanding gamma risk into expiry", "education", "deep_dive"),
            ("Technology earnings and broader market sentiment", "technology", "hero"),
            ("How to interpret option chain shifts", "education", "breaking"),
            ("Macro liquidity and the market breadth backdrop", "finance", "live_feed"),
            ("What volume profile says about trend continuation", "education", "quick_hit"),
            ("Why selectivity is winning in this tape", "news", "latest"),
        ]

        category_map = {cat.name: cat for cat in categories}
        education_cycle = cycle(categories)

        for idx, (title, category, placement) in enumerate(blog_specs):
            slug = f"demo-blog-post-{idx + 1}"
            education_category = None
            if category == "education":
                education_category = next(education_cycle)
            elif category == "news":
                education_category = category_map["Macro"]

            BlogPost.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "subtitle": "Demo content used to hydrate the frontend during development.",
                    "category": category,
                    "news_placement": placement,
                    "education_category": education_category,
                    "featured_image": "https://images.unsplash.com/photo-1642790106117-1b7d8b14d51b?auto=format&fit=crop&w=1200&q=80",
                    "author": "MoneyGreeks Team",
                    "author_designation": "Market Analyst",
                    "key_highlights": [
                        "Built for local demo hydration",
                        "Covers the main frontend card layouts",
                        "Safe to regenerate any time",
                    ],
                    "content": [
                        {"type": "h1", "text": title},
                        {
                            "type": "paragraph",
                            "text": "This is seeded demo content created to make the frontend pages look populated and realistic.",
                        },
                        {
                            "type": "paragraph",
                            "text": "You can replace these records later with live editorial or market data without changing the schema.",
                        },
                    ],
                    "view_count": 100 + (idx * 17),
                },
            )

    def seed_supporting_data(self):
        for idx in range(10):
            date_value = date(2026, 6, 14) - timedelta(days=idx)
            DailySentiment.objects.update_or_create(
                date=date_value,
                defaults={
                    "bullish_votes": 40 + (idx * 3),
                    "bearish_votes": 22 + (idx * 2),
                },
            )

            NewsletterSubscriber.objects.update_or_create(
                email=f"demo.subscriber.{idx + 1}@demo.moneygreeks.local",
                defaults={},
            )

            Enquiry.objects.update_or_create(
                email=f"demo.enquiry.{idx + 1}@demo.moneygreeks.local",
                subject=f"Demo enquiry {idx + 1}",
                defaults={
                    "first_name": f"Demo{idx + 1}",
                    "last_name": "User",
                    "message": (
                        "This is seeded demo data for testing the enquiries admin and frontend states."
                    ),
                    "is_read": idx % 2 == 0,
                },
            )

            PostMarketReport.objects.update_or_create(
                slug=f"demo-post-market-report-{idx + 1}",
                defaults={
                    "title": f"Demo Post-Market Report {idx + 1}",
                    "report_date": date_value,
                    "analyst": "Jose C S",
                    "analyst_designation": "Founder & Head Analyst, MoneyGreeks",
                    "overall_conclusion": (
                        "The close was orderly, with profit booking in pockets and support from "
                        "select index heavyweights."
                    ),
                    "report_data": {
                        "summary": "Seeded post-market demo data",
                        "session": idx + 1,
                        "date": date_value.isoformat(),
                    },
                    "is_published": True,
                },
            )
