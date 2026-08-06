import re, html, json, os

SRC = "/Users/tyleryoung/Documents/portfolio 2/reference/live-site"
OUT = "/Users/tyleryoung/Documents/portfolio 2/content"

def clean(s):
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    return ' '.join(html.unescape(s).replace('\xa0', ' ').split())

def dedupe(seq):
    out = []
    for x in seq:
        if x not in out:
            out.append(x)
    return out

# ---------- TL;DR ----------
h = open(os.path.join(SRC, 'tldr.html'), encoding='utf-8').read()
b = re.sub(r'<script.*?</script>', '', h[h.find('<body'):], flags=re.S)

summary = dedupe([clean(m) for m in re.findall(r'<p[^>]*--framer-font-size:22px[^>]*--framer-font-weight:700[^>]*>(.*?)</p>', b, re.S)])
parts = re.split(r'<h2[^>]*styles-preset-18btz5x[^>]*>(.*?)</h2>', b, flags=re.S)
sections = []
for i in range(1, len(parts), 2):
    head = clean(parts[i])
    body = parts[i + 1]
    cut = body.find('href="./')
    if cut != -1:
        body = body[:cut]
    paras = dedupe([clean(m) for m in re.findall(r'<p[^>]*>(.*?)</p>', body, re.S)])
    paras = [p for p in paras if p and p.lower() not in
             {'strategic influence', 'leadership approach', 'cross-functional partnership', 'systemic thinking'}]
    if head and paras:
        sections.append((head, paras))
sections = dedupe([(a, json.dumps(c)) for a, c in sections])
sections = [(a, json.loads(c)) for a, c in sections]

L = ['---', 'slug: tldr', 'title: TL;DR',
     '# description: [NEEDS: real meta description — live site ships "Made with Framer"]',
     'summary:']
for s in summary:
    L.append('  - %s' % s)
L += ['---', '']
for head, paras in sections:
    L.append('## %s' % head)
    L.append('')
    for p in paras:
        L.append(p)
        L.append('')
open(os.path.join(OUT, 'tldr.md'), 'w').write('\n'.join(L))
print('tldr | summary lines:', len(summary), '| sections:', [a for a, _ in sections])

# ---------- Homepage ----------
h = open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
b = re.sub(r'<script.*?</script>', '', h[h.find('<body'):], flags=re.S)

bio = dedupe([clean(m) for m in re.findall(r'<p[^>]*--framer-font-size:(?:24|17)px[^>]*--framer-font-weight:800[^>]*>(.*?)</p>', b, re.S)])
bio = [p for p in bio if len(p) > 60]

# the card region ends where the first essay-group eyebrow starts
cards_region = b[:b.find('Strategic influence')]

eyebrows = dedupe([clean(m) for m in re.findall(r'<p[^>]*--framer-font-size:14px[^>]*--framer-text-transform:uppercase[^>]*>(.*?)</p>', cards_region, re.S)])
eyebrows = [e for e in eyebrows if 'Tyler Young' not in e]  # drop the nav wordmark
titles = dedupe([clean(m) for m in re.findall(r'<h2[^>]*--framer-font-size:40px[^>]*>(.*?)</h2>', cards_region, re.S)])
descs = dedupe([clean(m) for m in re.findall(r'<p[^>]*--framer-font-size:1[78]px[^>]*--framer-font-weight:700[^>]*>(.*?)</p>', cards_region, re.S)])
decks = dedupe([(html.unescape(m.group(1)), clean(m.group(2)))
                for m in re.finditer(r'<a [^>]*href="(https://www\.figma\.com/[^"]+)"[^>]*>(.*?)</a>', cards_region, re.S)])
decks = [(u, lbl.split(' slide deck')[0].split()[-1] + ' slide deck') for u, lbl in decks]

groups = []
for m in re.finditer(r'<p[^>]*--framer-font-size:18px[^>]*--framer-text-transform:uppercase[^>]*>(.*?)</p>', b, re.S):
    groups.append(clean(m.group(1)))
groups = dedupe(groups)
grouptitles = dedupe([clean(m) for m in re.findall(r'<h2[^>]*--framer-font-size:56px[^>]*>(.*?)</h2>', b, re.S)])
def unrepeat(s):
    """responsive variants nest the same label 2-3x inside one anchor"""
    for n in (3, 2):
        if len(s) % n == 0:
            unit = len(s) // n
            if s == s[:unit] * n:
                return s[:unit]
    return s

essaylinks = dedupe([(html.unescape(m.group(1)), unrepeat(clean(m.group(2))))
                     for m in re.finditer(r'<a [^>]*href="\./(how-i-[a-z0-9-]+)"[^>]*>(.*?)</a>', b, re.S)])

# references: parse each card as a unit so name/title/quote stay aligned
refs = []
for m in re.finditer(r'<h5[^>]*styles-preset-11zqp4w[^>]*>(.*?)</h5>(.*?)<h4[^>]*styles-preset-17kdz91[^>]*>(.*?)</h4>(.*?)<p[^>]*styles-preset-10bfisf[^>]*>(.*?)</p>', b, re.S):
    refs.append((clean(m.group(3)), clean(m.group(1)), clean(m.group(5))))
refs = dedupe(refs)

L = ['---', 'slug: /', 'title: Tyler Young | Senior Director of Design',
     '# description: [NEEDS: real meta description — live site ships "Tyler Young\'s personal portfolio"]',
     'nav:', '  wordmark: Tyler Young', '  role: Senior Director of design',
     '  links:', '    - { label: "TL;DR", href: "/tldr" }',
     '    - { label: "Contact", href: "mailto:43tylers@gmail.com" }', '---', '',
     '## Bio', '', '<!-- PORTED VERBATIM. One new sentence on AI-native practice goes here. -->',
     '<!-- [NEEDS: the one added bio sentence — Tyler writes or approves] -->', '']
for p in bio:
    L += [p, '']

L += ['## Project cards', '',
      '<!-- Order below is the CURRENT live order. The rebuild puts the automotive card first. -->', '']
for i, t in enumerate(titles):
    L.append('### %s' % t)
    L.append('')
    L.append('- eyebrow: %s' % (eyebrows[i] if i < len(eyebrows) else '[NEEDS]'))
    L.append('- description: %s' % (descs[i] if i < len(descs) else '[NEEDS]'))
    if i < len(decks):
        L.append('- link: "%s" -> %s' % (decks[i][1], decks[i][0]))
    L.append('- image alt: [NEEDS: real alt text — live site has none]')
    L.append('')

L += ['## Essay groups', '']
for i, g in enumerate(groups):
    L.append('### %s' % (grouptitles[i] if i < len(grouptitles) else '[NEEDS]'))
    L.append('')
    L.append('- eyebrow: %s' % g)
    L.append('')

L += ['<!-- essay links, in live-site order -->', '']
for slug, label in essaylinks:
    L.append('- [%s](/%s)' % (label, slug))
L.append('')

L += ['## Executive references', '']
for name, title, quote in refs:
    L.append('### %s' % name)
    L.append('')
    L.append('- title: %s' % title)
    L.append('- headshot alt: [NEEDS: correct per-person alt text — live site says "David Sabel" on all three]')
    L.append('')
    L.append('> %s' % quote)
    L.append('')

L += ['## Footer', '',
      '<!-- NEW. Does not exist on the live site. -->',
      '<!-- [NEEDS: the one-sentence "built with my own Claude Code workflow" line — Tyler approves] -->',
      '<!-- links: How I design with AI · Contact · (c) year -->', '']

open(os.path.join(OUT, 'homepage.md'), 'w').write('\n'.join(L))
print('homepage | bio:', len(bio), '| cards:', len(titles), '| groups:', len(groups),
      '| essay links:', len(essaylinks), '| refs:', len(refs))
