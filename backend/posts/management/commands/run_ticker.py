import time
import requests
from django.core.management.base import BaseCommand
from posts.models import LiveMarketIndex, ApiSystemLog

URLS = {
    "NIFTY 50": "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI",
    "SENSEX": "https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN",
    "NIFTY BANK": "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEBANK",
    "NIFTY MIDCAP 100": "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSMIDCP",
    "INDIA VIX": "https://query1.finance.yahoo.com/v8/finance/chart/%5EINDIAVIX",
}

headers = {
    "User-Agent": "Mozilla/5.0",
}

class Command(BaseCommand):
    help = "Runs a continuous background process to fetch live market indices"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting live ticker..."))
        while True:
            for name, url in URLS.items():
                api_name = f"Yahoo Finance Ticker: {name}"
                try:
                    r = requests.get(url, headers=headers, timeout=10)
                    r.raise_for_status()
                    data = r.json()
                    
                    meta = data["chart"]["result"][0]["meta"]
                    pricecurrent = float(meta.get("regularMarketPrice", 0))
                    priceprevclose = float(meta.get("chartPreviousClose", pricecurrent))

                    calculated_change = pricecurrent - priceprevclose
                    calculated_percent = (calculated_change / priceprevclose) * 100 if priceprevclose > 0 else 0.0

                    try:
                        LiveMarketIndex.objects.update_or_create(
                            name=name,
                            defaults={
                                "last_price": pricecurrent,
                                "change": calculated_change,
                                "percent_change": calculated_percent,
                                "up": calculated_change >= 0,
                            }
                        )
                    except Exception as db_err:
                        self.stderr.write(f"DB Error saving index {name}: {db_err}")
                    
                    # Log success
                    try:
                        ApiSystemLog.objects.update_or_create(
                            api_name=api_name,
                            defaults={
                                "status": ApiSystemLog.STATUS_OK,
                                "error_message": "",
                                "is_failing": False
                            }
                        )
                    except Exception as db_err:
                        self.stderr.write(f"DB Error logging success: {db_err}")

                except requests.exceptions.RequestException as e:
                    # Handle rate limits (429) specifically
                    status = ApiSystemLog.STATUS_RATE_LIMITED if (hasattr(e, 'response') and e.response is not None and e.response.status_code == 429) else ApiSystemLog.STATUS_ERROR
                    
                    try:
                        ApiSystemLog.objects.update_or_create(
                            api_name=api_name,
                            defaults={
                                "status": status,
                                "error_message": str(e),
                                "is_failing": True
                            }
                        )
                    except Exception as db_err:
                        self.stderr.write(f"DB Error logging failure: {db_err}")
                    self.stderr.write(f"Error fetching {name}: {e}")
                except Exception as e:
                    try:
                        ApiSystemLog.objects.update_or_create(
                            api_name=api_name,
                            defaults={
                                "status": ApiSystemLog.STATUS_ERROR,
                                "error_message": str(e),
                                "is_failing": True
                            }
                        )
                    except Exception as db_err:
                        self.stderr.write(f"DB Error logging failure: {db_err}")
                    self.stderr.write(f"Error fetching {name}: {e}")

            time.sleep(10)
