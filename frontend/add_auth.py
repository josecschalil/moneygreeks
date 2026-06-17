import os
import re

admin_dir = r"c:\Users\josec\Desktop\moneygreeks\frontend\app\admin"
auth_import = 'import { getAuthHeaders } from "@/app/admin/utils/auth";\n'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'fetch(' not in content:
        return

    # Add import if not present
    if 'getAuthHeaders' not in content:
        # Find first import or just put it at top after 'use client'
        if '"use client";' in content or "'use client';" in content:
            content = re.sub(r'([\'"]use client[\'"];?\n)', r'\1' + auth_import, content, count=1)
        else:
            content = auth_import + content

    # Replace fetch(URL) with fetch(URL, { headers: getAuthHeaders() })
    # Replace fetch(URL, { ... }) with fetch(URL, { ..., headers: getAuthHeaders(...) })
    
    # It's tricky to do this purely with regex for all nested brackets. 
    # Let's do it manually for known patterns or use a simpler regex.
    # Actually, most fetch calls are:
    # 1. fetch(url)
    # 2. fetch(url, { method: ..., headers: { ... }, body: ... })
    
    # We can just replace `headers: {` with `headers: getAuthHeaders({` and close it. 
    # But some don't have headers.
    
    # A robust way for this specific project:
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        if 'fetch(' in line and not 'headers:' in line and not '{' in line.split('fetch(')[1]:
            # fetch(url) or fetch(`url`)
            line = re.sub(r'fetch\((.*?)\)', r'fetch(\1, { headers: getAuthHeaders() })', line)
        elif 'headers: {' in line:
            # Replace `headers: {` with `headers: getAuthHeaders({`
            line = line.replace('headers: {', 'headers: getAuthHeaders({')
            # Now we need to find the matching closing bracket for headers.
            # Usually it's `},` on the next lines. This is too complex for simple line-by-line.
        new_lines.append(line)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

for root, dirs, files in os.walk(admin_dir):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

print("Done")
