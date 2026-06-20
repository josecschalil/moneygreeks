import urllib.request, re

def check_url(url):
    print(f"\nChecking {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'})
    try:
        res = urllib.request.urlopen(req)
        html = res.read().decode('utf-8')
        print(f"Status: {res.status}")
        print(f"Final URL after redirects: {res.url}")
        
        m = re.search(r'<link rel="canonical" href="([^"]+)"', html)
        print(f"Canonical URL: {m.group(1) if m else 'None found'}")
    except Exception as e:
        print(f"Error: {e}")

check_url('http://moneygreeks.live/news-today')
check_url('https://moneygreeks.live/news-today')
check_url('https://www.moneygreeks.live/news-today')
