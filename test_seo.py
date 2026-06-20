import urllib.request, re

ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
req = urllib.request.Request('https://www.moneygreeks.live/news-today', headers={'User-Agent': ua})
res = urllib.request.urlopen(req)
html = res.read().decode('utf-8')

# 1. Check canonical
canons = re.findall(r'<link[^>]+rel=["\']canonical["\'][^>]+>', html)
print("CANONICAL TAGS:", canons or "NONE FOUND")

# 2. Check all meta tags in head
head_match = re.search(r'<head>(.*?)</head>', html, re.DOTALL)
if head_match:
    head = head_match.group(1)
    # Find all link tags
    links = re.findall(r'<link[^>]+>', head)
    print("\nALL HEAD LINKS:")
    for l in links:
        print(" ", l)

# 3. Check for X-Robots-Tag in the response headers
print("\nRESPONSE HEADERS:")
for k, v in res.headers.items():
    print(f"  {k}: {v}")
