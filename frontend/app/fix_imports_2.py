import os, glob, re

moved_components = ['ArticleCard', 'Icon', 'MarketTick', 'SectionHeader', 'SentimentWidget', 'SidebarWidgets']

for root, dirs, files in os.walk('c:/Users/richi/Desktop/moneygreeks/frontend/app/components/news-today'):
    for file in files:
        if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            original = content
            
            for comp in moved_components:
                # Replace import XYZ from '../Comp' with './Comp'
                content = re.sub(r'([\'\"])\.\./(' + comp + r')([\'\"])', r'\g<1>./\g<2>\g<3>', content)
                # Also replace import XYZ from '../../Comp' if there were any
                content = re.sub(r'([\'\"])\.\./\.\./(' + comp + r')([\'\"])', r'\g<1>./\g<2>\g<3>', content)

            if content != original:
                print('Fixed', filepath)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
