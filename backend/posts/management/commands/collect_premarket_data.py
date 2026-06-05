import json
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from posts.services.premarket_data_collector import (
    PremarketDataCollector,
    archive_premarket_data,
)


class Command(BaseCommand):
    help = "Collect NSE-first pre-market data and archive the raw JSON snapshot."

    def add_arguments(self, parser):
        parser.add_argument("--date", dest="report_date", help="Date in YYYY-MM-DD format. Defaults to today.")
        parser.add_argument("--output", help="Optional output JSON path. Defaults to data_archive/premarket/YYYY-MM-DD.json.")
        parser.add_argument(
            "--skip-google",
            action="store_true",
            help="Skip optional Google Finance context collection.",
        )

    def handle(self, *args, **options):
        report_date = self.parse_report_date(options.get("report_date"))
        collector = PremarketDataCollector()
        raw_data = collector.collect(report_date=report_date, include_google=not options["skip_google"])

        if options.get("output"):
            output_path = Path(options["output"]).expanduser()
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(json.dumps(raw_data, indent=2, ensure_ascii=False), encoding="utf-8")
        else:
            output_path = archive_premarket_data(raw_data, report_date=report_date)

        self.stdout.write(self.style.SUCCESS(f"Archived pre-market data: {output_path}"))
        for source, status in raw_data.get("source_status", {}).items():
            self.stdout.write(f"{source}: {status}")

    @staticmethod
    def parse_report_date(value):
        if not value:
            return timezone.localdate()
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError as exc:
            raise CommandError("--date must be in YYYY-MM-DD format.") from exc
