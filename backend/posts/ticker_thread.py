import time
import threading
import requests

URLS = {
    "NIFTY 50": "https://priceapi.moneycontrol.com/pricefeed/notapplicable/inidicesindia/in%3BNSX",
    "SENSEX": "https://priceapi.moneycontrol.com/pricefeed/notapplicable/inidicesindia/in%3BSEN",
    "NIFTY BANK": "https://priceapi.moneycontrol.com/pricefeed/notapplicable/inidicesindia/in%3Bnbx",
    "NIFTY MIDCAP 100": "https://priceapi.moneycontrol.com/pricefeed/notapplicable/inidicesindia/in%3Bccx",
}

headers = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://www.moneycontrol.com/",
    "Accept": "application/json"
}

def fetch_live_data():
    from .models import LiveMarketIndex  # import inside thread to avoid AppRegistryNotReady
    
    while True:
        for name, url in URLS.items():
            try:
                r = requests.get(url, headers=headers, timeout=10)
                r.raise_for_status()
                data = r.json().get("data", {})
                
                pricecurrent = float(data.get("pricecurrent", "0.0").replace(',', ''))
                priceprevclose = float(data.get("priceprevclose", str(pricecurrent)).replace(',', ''))
                
                calculated_change = pricecurrent - priceprevclose
                if priceprevclose > 0:
                    calculated_percent = (calculated_change / priceprevclose) * 100
                else:
                    calculated_percent = 0.0
                
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
        
        # Wait for 10 seconds before fetching again
        time.sleep(10)

def start_ticker_thread():
    thread = threading.Thread(target=fetch_live_data, daemon=True)
    thread.start()
