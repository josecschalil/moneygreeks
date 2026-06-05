from datetime import datetime

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from posts.models import MarketReport
from posts.services.premarket_data_collector import (
    PremarketDataCollector,
    archive_premarket_data,
)
from posts.services.premarket_report_generator import (
    PremarketReportError,
    build_report_from_data,
)


class Command(BaseCommand):
    help = "Collect, archive, generate, and optionally publish today's pre-market report."

    def add_arguments(self, parser):
        parser.add_argument("--date", dest="report_date", help="Date in YYYY-MM-DD format. Defaults to today.")
        parser.add_argument("--replace", action="store_true", help="Replace an existing report for the same date.")
        parser.add_argument(
            "--draft",
            action="store_true",
            help="Save as draft instead of auto-publishing.",
        )
        parser.add_argument(
            "--skip-google",
            action="store_true",
            help="Skip optional Google Finance context collection.",
        )
        parser.add_argument("--image-url", help="Optional image URL for the generated report.")

    def handle(self, *args, **options):
        report_date = self.parse_report_date(options.get("report_date"))
        collector = PremarketDataCollector()
        raw_data = collector.collect(report_date=report_date, include_google=not options["skip_google"])
        archive_path = archive_premarket_data(raw_data, report_date=report_date)

        status = MarketReport.STATUS_DRAFT if options["draft"] else MarketReport.STATUS_PUBLISHED
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

        self.stdout.write(self.style.SUCCESS(f"Archived data: {archive_path}"))
        self.stdout.write(
            self.style.SUCCESS(
                f"Generated {report.status} {report.report_type} report "
                f"({report.quality_score}/100): {report.slug}"
            )
        )
        missing = (report.quality_notes or {}).get("missing_sections", [])
        if missing:
            self.stdout.write(f"Missing sections: {', '.join(missing)}")
        for source, source_status in raw_data.get("source_status", {}).items():
            self.stdout.write(f"{source}: {source_status}")

    @staticmethod
    def parse_report_date(value):
        if not value:
            return timezone.localdate()
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError as exc:
            raise CommandError("--date must be in YYYY-MM-DD format.") from exc
