import os
import re

ROOT = r"c:\Users\josec\Desktop\moneygreeks\frontend\app"
EXTS = {'.jsx', '.tsx', '.js', '.ts'}

# We only want NAVIGATION links (href, Link, router.push) — NOT backend API fetches
# Backend API trailing slashes are FINE (Django requires them)
NAV_PATTERN = re.compile(r'''(?:href|to)=["\x27`](/[a-z][a-z0-9/_-]*/)["\x27`]''')

results = []

for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.next', '__pycache__')]
    for fname in files:
        if os.path.splitext(fname)[1] not in EXTS:
            continue
        fpath = os.path.join(dirpath, fname)
        try:
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
        except Exception:
            continue

        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped.startswith('//') or stripped.startswith('*'):
                continue
            for m in NAV_PATTERN.finditer(line):
                val = m.group(1)
                # Skip plain "/" (homepage)
                if val == '/':
                    continue
                rel = fpath.replace(ROOT, '').lstrip('\\/')
                results.append((rel, i, stripped[:120], val))

seen = set()
for rel, lineno, content, val in sorted(results):
    key = (rel, lineno)
    if key in seen:
        continue
    seen.add(key)
    print(f"FILE: {rel}  LINE {lineno}")
    print(f"  TRAILING-SLASH URL: {val}")
    print(f"  CODE: {content[:110]}")
    print()

if not results:
    print("✅ No trailing slash navigation URLs found!")
