import urllib.request
import json
url = "https://priceapi.moneycontrol.com/pricefeed/notapplicable/inidicesindia/in%3BNSX"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.moneycontrol.com/', 'Accept': 'application/json'})
with urllib.request.urlopen(req) as response:
    print(json.dumps(json.loads(response.read().decode('utf-8')), indent=2))
