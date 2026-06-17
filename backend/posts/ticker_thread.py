import requests
import time
import threading
URLS = {
    "NIFTY 50": "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI",
    "SENSEX": "https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN",
    "NIFTY BANK": "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEBANK",
    "NIFTY MIDCAP 100": "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSMIDCP",
}

headers = {
    "User-Agent": "Mozilla/5.0",
}

def fetch_live_data():
    from .models import LiveMarketIndex

    while True:
        for name, url in URLS.items():
            try:
                r = requests.get(url, headers=headers, timeout=10)
                r.raise_for_status()
                data = r.json()
                
                meta = data["chart"]["result"][0]["meta"]
                pricecurrent = float(meta.get("regularMarketPrice", 0))
                priceprevclose = float(meta.get("chartPreviousClose", pricecurrent))

                calculated_change = pricecurrent - priceprevclose
                calculated_percent = (calculated_change / priceprevclose) * 100 if priceprevclose > 0 else 0.0

                LiveMarketIndex.objects.update_or_create(
                    name=name,
                    defaults={
                        "last_price": pricecurrent,
                        "change": calculated_change,
                        "percent_change": calculated_percent,
                        "up": calculated_change >= 0,
                    }
                )
            except Exception as e:
                print(f"Error fetching {name}: {e}")

        time.sleep(10)

def start_ticker_thread():
    thread = threading.Thread(target=fetch_live_data, daemon=True)
    thread.start()