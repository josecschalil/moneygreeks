import json
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from posts.models import MarketReport
from posts.services.premarket_report_generator import (
    PremarketReportError,
    build_report_from_data,
)


class Command(BaseCommand):
    help = "Generate a draft pre-market MarketReport from an NSE-derived JSON file."

    def add_arguments(self, parser):
        parser.add_argument(
            "--input",
            default="pre_market_data.json",
            help="Path to the JSON file. Defaults to pre_market_data.json in the current directory.",
        )
        parser.add_argument(
            "--date",
            dest="report_date",
            help="Report date in YYYY-MM-DD format. Defaults to today's local date.",
        )
        parser.add_argument(
            "--replace",
            action="store_true",
            help="Replace an existing report for the same date.",
        )
        parser.add_argument(
            "--publish",
            action="store_true",
            help="Create the report as published instead of draft.",
        )
        parser.add_argument(
            "--image-url",
            help="Optional image URL for the report header/card.",
        )

    def handle(self, *args, **options):
        input_path = Path(options["input"]).expanduser()
        if not input_path.exists():
            raise CommandError(f"Input JSON file not found: {input_path}")

        try:
            raw_data = json.loads(input_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise CommandError(f"Input JSON is invalid: {exc}") from exc

        report_date = self.parse_report_date(options.get("report_date"))
        status = MarketReport.STATUS_PUBLISHED if options["publish"] else MarketReport.STATUS_DRAFT

        try:
            report = build_report_from_data(
                raw_data,
                report_date=report_date,
                status=status,
                replace=options["replace"],
                **({"image_url": options["image_url"]} if options.get("image_url") else {}),
            )
        except PremarketReportError as exc:
            raise CommandError(str(exc)) from exc

        self.stdout.write(
            self.style.SUCCESS(
                f"Generated {report.status} {report.report_type} pre-market report "
                f"({report.quality_score}/100): {report.title} ({report.slug})"
            )
        )

    @staticmethod
    def parse_report_date(value):
        if not value:
            return timezone.localdate()
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError as exc:
            raise CommandError("--date must be in YYYY-MM-DD format.") from exc
