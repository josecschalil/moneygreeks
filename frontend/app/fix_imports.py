import os, glob, re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Fix imports inside app/components/news-today/*
    filepath_normalized = filepath.replace('\\', '/')
    if 'components/news-today' in filepath_normalized:
        content = re.sub(r'([\'\"])(\.\./\.\./news-today/MarketInsight\.module\.css)([\'\"])', r'\g<1>./MarketInsight.module.css\g<3>', content)
        content = re.sub(r'([\'\"])(\.\./news-today/MarketInsight\.module\.css)([\'\"])', r'\g<1>./MarketInsight.module.css\g<3>', content)
        content = re.sub(r'([\'\"])(\.\./\.\./news-today/data)([\'\"])', r'\g<1>./data\g<3>', content)
        content = re.sub(r'([\'\"])(\.\./news-today/data)([\'\"])', r'\g<1>./data\g<3>', content)

    # Fix imports in app/news-today/page.jsx
    if filepath_normalized.endswith('app/news-today/page.jsx') or filepath_normalized.endswith('app/news-today/page.tsx'):
        content = re.sub(r'([\'\"])(\.\./components/news/)([\'\"])', r'\g<1>../components/news-today/\g<3>', content)
        content = re.sub(r'([\'\"])(\./MarketInsight\.module\.css)([\'\"])', r'\g<1>../components/news-today/MarketInsight.module.css\g<3>', content)

    # If any file imports ArticleCard, Icon, MarketTick, SectionHeader, SentimentWidget, SidebarWidgets from components/
    # they need to import from components/news-today/
    content = re.sub(r'([\'\"])(.*)components/(ArticleCard|Icon|MarketTick|SectionHeader|SentimentWidget|SidebarWidgets)([\'\"])', r'\g<1>\g<2>components/news-today/\g<3>\g<4>', content)

    # If any file imports from components/news/ it should be components/news-today/
    content = re.sub(r'([\'\"])(.*)components/news/([^\'\"]+)([\'\"])', r'\g<1>\g<2>components/news-today/\g<3>\g<4>', content)

    if content != original:
        print('Updated', filepath)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk('c:/Users/richi/Desktop/moneygreeks/frontend/app'):
    for file in files:
        if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
            process_file(os.path.join(root, file))
