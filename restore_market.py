import sys

f = open('frontend/app/market-data/[slug]/page.tsx', 'r', encoding='utf-8')
lines = f.readlines()
f.close()

insertion = [
    '      <nav className="bg-white border-b border-gray-200">\n',
    '        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">\n',
    '          <ol className="flex items-center space-x-2 text-sm text-gray-500">\n',
    '            <li><a href="/" className="hover:text-blue-600">Home</a></li>\n',
    '            <li className="text-gray-400 before:mx-2"><a href="/" className="hover:text-blue-600">Moneygreeks</a></li>\n',
    '            <li className="text-blue-600 font-medium">pre-market-data</li>\n',
    '          </ol>\n',
    '        </div>\n',
    '      </nav>\n',
    '\n',
    '      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">\n',
    '        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">\n',
    '          {/* Main Content */}\n',
    '          <main className="lg:col-span-2">\n',
    '            {/* Article Header */}\n',
    '            <article>\n',
    '              <header className="mb-8">\n',
    '                <h1 className="text-4xl font-bold text-gray-900 mb-4">\n',
    '                  {metadata.title}\n',
    '                </h1>\n',
    '\n',
    '                {/* Article Meta */}\n',
    '                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">\n',
]

# Insert after line 424 (index 423 = the breadcrumbJsonLd script line)
new_lines = lines[:424] + insertion + lines[424:]

with open('frontend/app/market-data/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Done. Total lines: {len(new_lines)}')
