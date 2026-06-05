from datetime import date
from decimal import Decimal
from tempfile import TemporaryDirectory

from django.test import TestCase
from django.test import override_settings
from rest_framework.test import APIClient

from posts.models import (
    IndianMarketIndex,
    InstitutionalFlow,
    MarketBreadth,
    MarketReport,
    OptionChainSummary,
    SectorPerformance,
    StockMover,
)
from posts.services.premarket_data_collector import (
    PremarketDataCollector,
    archive_premarket_data,
    extract_google_finance_price,
)
from posts.services.premarket_report_generator import (
    PremarketReportError,
    build_report_from_data,
    extract_market_signals,
)


def sample_premarket_data():
    return {
        "institutional_flow": [
            {
                "category": "DII",
                "buy_value": 17530.0,
                "sell_value": 11789.11,
                "net_value": 5740.89,
                "trend": "up",
            },
            {
                "category": "FII",
                "buy_value": 17053.63,
                "sell_value": 22670.19,
                "net_value": -5616.56,
                "trend": "down",
            },
        ],
        "top_gainers": [
            {"symbol": "APOLLOHOSP", "prev_close": "8089.5", "ltp": "8299", "pct_change": "2.59", "volume": "724687"},
            {"symbol": "SBIN", "prev_close": "956.65", "ltp": "971.5", "pct_change": "1.55", "volume": "27947005"},
        ],
        "top_losers": [
            {"symbol": "TCS", "prev_close": "2446.9", "ltp": "2245", "pct_change": "-8.25", "volume": "15660062"},
            {"symbol": "TECHM", "prev_close": "1571.4", "ltp": "1470", "pct_change": "-6.45", "volume": "3493572"},
            {"symbol": "HCLTECH", "prev_close": "1243.5", "ltp": "1177.5", "pct_change": "-5.31", "volume": "4800922"},
        ],
        "market_breadth": {
            "advances": 1373,
            "declines": 1901,
            "ad_ratio": 0.72,
        },
        "sectoral_indices": [
            {
                "index_name": "NIFTY PSU BANK",
                "last": "8185.90",
                "change": "1.70",
                "pct_change": 1.7,
                "pe": "7.94",
                "pb": "1.20",
                "dividend_yield": "2.37",
                "trend": "up",
            },
            {
                "index_name": "NIFTY IT",
                "last": "29384.45",
                "change": "-5.57",
                "pct_change": -5.57,
                "pe": "20.00",
                "pb": "5.36",
                "dividend_yield": "3.32",
                "trend": "down",
            },
            {
                "index_name": "NIFTY FMCG",
                "last": "48123.95",
                "change": "-1.01",
                "pct_change": -1.01,
                "pe": "33.11",
                "pb": "8.33",
                "dividend_yield": "0.96",
                "trend": "down",
            },
        ],
        "indian_indices": [
            {
                "index_name": "NIFTY 50",
                "last": "24620.20",
                "prev_close": "24542.50",
                "change": "77.70",
                "change_percent": 0.32,
                "trend": "up",
                "source": "nse",
            },
            {
                "index_name": "NIFTY BANK",
                "last": "55635.90",
                "prev_close": "55410.25",
                "change": "225.65",
                "change_percent": 0.41,
                "trend": "up",
                "source": "nse",
            },
            {
                "index_name": "NIFTY 500",
                "last": "23175.10",
                "prev_close": "23201.85",
                "change": "-26.75",
                "change_percent": -0.12,
                "trend": "down",
                "source": "nse",
            },
            {
                "index_name": "INDIA VIX",
                "last": "15.75",
                "prev_close": "16.12",
                "change": "-0.37",
                "change_percent": -2.3,
                "trend": "down",
                "source": "nse",
            },
        ],
        "option_chain_summary": {
            "NIFTY": {
                "expiry": "09-Jun-2026",
                "pcr": 0.98,
                "max_call_oi_strike": 24000,
                "max_call_oi": 123456,
                "max_put_oi_strike": 22000,
                "max_put_oi": 120000,
                "underlying_value": 23405.6,
            }
        },
    }


class PremarketSignalTests(TestCase):
    def test_extracts_mixed_institutional_signal_and_weak_breadth(self):
        signals = extract_market_signals(sample_premarket_data())

        self.assertEqual(signals.fii_net, Decimal("-5616.56"))
        self.assertEqual(signals.dii_net, Decimal("5740.89"))
        self.assertIn("mixed", signals.institutional_bias)
        self.assertEqual(signals.breadth_bias, "weak")
        self.assertEqual(signals.loser_sector_pressure, "IT")

    def test_sorts_sector_strength_and_weakness(self):
        signals = extract_market_signals(sample_premarket_data())

        self.assertEqual(signals.leading_sectors[0]["index_name"], "NIFTY PSU BANK")
        self.assertEqual(signals.weak_sectors[0]["index_name"], "NIFTY IT")


class PremarketReportGenerationTests(TestCase):
    def test_generates_draft_report_and_related_records(self):
        report = build_report_from_data(
            sample_premarket_data(),
            report_date=date(2026, 6, 4),
        )

        self.assertEqual(report.status, MarketReport.STATUS_DRAFT)
        self.assertEqual(report.slug, "pre-market-report-2026-06-04")
        self.assertEqual(InstitutionalFlow.objects.filter(report=report).count(), 2)
        self.assertEqual(StockMover.objects.filter(report=report).count(), 5)
        self.assertEqual(IndianMarketIndex.objects.filter(report=report).count(), 4)
        self.assertEqual(SectorPerformance.objects.filter(report=report).count(), 3)
        self.assertEqual(OptionChainSummary.objects.filter(report=report).count(), 1)
        self.assertTrue(MarketBreadth.objects.filter(report=report).exists())
        self.assertIn("risk management", report.overall_conclusion)
        self.assertIn("expiry positioning", report.overall_conclusion)
        self.assertIn("not direct day-trading support or resistance", report.option_chain_summaries.first().analysis)
        self.assertEqual(report.quality_score, 90)
        self.assertEqual(report.report_type, MarketReport.REPORT_TYPE_FULL)
        self.assertNotIn("indian_indices", report.quality_notes["missing_sections"])
        self.assertIsNotNone(report.global_analysis)
        self.assertIsNotNone(report.indian_analysis)

    def test_rejects_duplicate_without_replace(self):
        build_report_from_data(sample_premarket_data(), report_date=date(2026, 6, 4))

        with self.assertRaises(PremarketReportError):
            build_report_from_data(sample_premarket_data(), report_date=date(2026, 6, 4))

    def test_replace_regenerates_single_report(self):
        first = build_report_from_data(sample_premarket_data(), report_date=date(2026, 6, 4))
        second = build_report_from_data(
            sample_premarket_data(),
            report_date=date(2026, 6, 4),
            replace=True,
        )

        self.assertNotEqual(first.id, second.id)
        self.assertEqual(MarketReport.objects.filter(report_date=date(2026, 6, 4)).count(), 1)

    def test_public_api_hides_drafts_and_returns_published_reports(self):
        report = build_report_from_data(sample_premarket_data(), report_date=date(2026, 6, 4))
        client = APIClient()

        draft_response = client.get("/report-list/")
        self.assertEqual(draft_response.status_code, 200)
        self.assertEqual(draft_response.json(), [])

        report.status = MarketReport.STATUS_PUBLISHED
        report.save(update_fields=["status"])

        list_response = client.get("/report-list/")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()), 1)

        detail_response = client.get(f"/reports/{report.slug}/")
        self.assertEqual(detail_response.status_code, 200)
        payload = detail_response.json()
        self.assertEqual(payload["status"], MarketReport.STATUS_PUBLISHED)
        self.assertEqual(payload["quality_score"], 90)
        self.assertEqual(payload["report_type"], MarketReport.REPORT_TYPE_FULL)
        self.assertIn("institutional_analysis", payload)
        self.assertEqual(len(payload["indian_indices"]), 4)
        self.assertEqual(len(payload["option_chain_summaries"]), 1)
        self.assertNotIn("raw_data", payload)


class PremarketCollectorUtilityTests(TestCase):
    def test_collects_primary_indian_indices_from_all_indices_json(self):
        collector = PremarketDataCollector()

        def fake_fetch_json(path):
            self.assertEqual(path, "/api/allIndices")
            return {
                "data": [
                    {
                        "index": "NIFTY 50",
                        "last": "24,620.20",
                        "previousClose": "24,542.50",
                        "variation": "77.70",
                        "percentChange": "0.32",
                    },
                    {
                        "index": "NIFTY BANK",
                        "last": "55,635.90",
                        "previousClose": "55,410.25",
                        "variation": "225.65",
                        "percentChange": "0.41",
                    },
                    {
                        "index": "NIFTY 500",
                        "last": "23,175.10",
                        "previousClose": "23,201.85",
                        "variation": "-26.75",
                        "percentChange": "-0.12",
                    },
                    {
                        "index": "INDIA VIX",
                        "last": "15.75",
                        "previousClose": "16.12",
                        "variation": "-0.37",
                        "percentChange": "-2.30",
                    },
                    {"index": "NIFTY MIDCAP 100", "last": "1", "percentChange": "1"},
                ]
            }

        collector.fetch_json = fake_fetch_json
        rows = collector.collect_indian_indices()

        self.assertEqual([row["index_name"] for row in rows], ["NIFTY 50", "NIFTY BANK", "NIFTY 500", "INDIA VIX"])
        self.assertEqual(rows[0]["last"], "24620.20")
        self.assertEqual(rows[2]["trend"], "down")

    def test_collects_global_indices_from_moneycontrol_json(self):
        collector = PremarketDataCollector()

        def fake_fetch_text(url, *, referer=None):
            self.assertIn("moneycontrol", url)
            self.assertEqual(referer, "https://www.moneycontrol.com/")
            return """
            {
              "success": 1,
              "data": [
                {
                  "name": "GIFT Nifty",
                  "ltp": "23,313.50",
                  "chg": "-18.50",
                  "chgper": "-0.08",
                  "market_state": "open",
                  "market_time": "8:09 AM",
                  "updatedDate": "04 Jun, 2026"
                },
                {
                  "name": "Nasdaq",
                  "ltp": "26,853.98",
                  "chg": "-239.93",
                  "chgper": "-0.89",
                  "market_state": "closed",
                  "market_time": "1:29 AM",
                  "updatedDate": "04 Jun, 2026"
                }
              ]
            }
            """

        collector.fetch_text = fake_fetch_text
        rows = collector.collect_moneycontrol_global_indices()

        self.assertEqual([row["index_name"] for row in rows], ["GIFT Nifty", "Nasdaq"])
        self.assertEqual(rows[0]["last"], "23313.50")
        self.assertEqual(rows[0]["trend"], "down")
        self.assertEqual(rows[0]["source"], "moneycontrol")

    def test_google_finance_price_selector_extracts_price(self):
        html = '<div class="YMlKec fxKbKc">81,330.56</div>'

        self.assertEqual(extract_google_finance_price(html), "81330.56")

    def test_archives_premarket_data_by_date(self):
        with TemporaryDirectory() as temp_dir:
            with override_settings(BASE_DIR=temp_dir):
                archive_path = archive_premarket_data(
                    {"institutional_flow": [], "source_status": {"demo": "ok"}},
                    report_date=date(2026, 6, 4),
                )

                self.assertTrue(archive_path.exists())
                self.assertEqual(archive_path.name, "2026-06-04.json")
