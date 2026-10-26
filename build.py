"""Assemble index.html from the engine (Three.js fire wall) and the portfolio layer.

    python build.py

src/engine.html     the patched Three.js scene (fire theme only, NAGUN wall, textures inline)
src/portfolio.html  static shell of the UI layer
src/portfolio.css   styles of the UI layer
src/portfolio.js    behaviour of the UI layer
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')


def read(name):
    with open(os.path.join(SRC, name), encoding='utf8') as f:
        return f.read()


page = read('engine.html')
css, shell, js = read('portfolio.css'), read('portfolio.html'), read('portfolio.js')

meta = (
    '  <meta name="description" content="Portfolio of Nagun Haridasan, AI / ML engineer in Bengaluru: local LLMs on a 4GB phone, '
    'speech, Three.js and data. Interactive Three.js fire wall with an AI assistant.">\n'
    '  <meta name="theme-color" content="#0b0705">\n'
)
page = page.replace('<meta name="referrer" content="no-referrer">', '<meta name="referrer" content="no-referrer">\n' + meta, 1)
assert '</head>' in page and '</body>' in page
page = page.replace('</head>', '<style id="portfolio-css">\n' + css + '\n</style>\n</head>', 1)
page, n = re.subn(r'(<body[^>]*>)', lambda m: m.group(1) + '\n' + shell + '\n', page, count=1)
assert n == 1
i = page.rindex('</body>')
page = page[:i] + '<script id="portfolio-js">\n' + js + '\n</script>\n' + page[i:]

out = os.path.join(HERE, 'index.html')
with open(out, 'w', encoding='utf8', newline='\n') as f:
    f.write(page)
print('index.html', round(len(page.encode('utf8')) / 1024), 'KB')
