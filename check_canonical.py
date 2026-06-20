import urllib.request, re
try:
    html = urllib.request.urlopen('https://www.moneygreeks.live/news-today').read().decode('utf-8')
    m = re.search(r'<link rel="canonical" href="([^"]+)"', html)
    print(m.group(1) if m else 'None')
except Exception as e:
    print(e)
