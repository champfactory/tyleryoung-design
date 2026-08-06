import re, html, os, json, sys

SRC = "/Users/tyleryoung/Documents/portfolio 2/reference/live-site"
OUT = "/Users/tyleryoung/Documents/portfolio 2/content"

def clean(s):
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    s = s.replace('\xa0', ' ')
    return ' '.join(s.split())

def inner_links(s):
    """keep <a href> as markdown"""
    s = re.sub(r'<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>',
               lambda m: '[%s](%s)' % (clean(m.group(2)), html.unescape(m.group(1))), s, flags=re.S)
    return clean(s)

def dedupe(seq):
    out = []
    for x in seq:
        if x not in out:
            out.append(x)
    return out

def parse_essay(path):
    h = open(path, encoding='utf-8').read()
    b = h[h.find('<body'):]
    b = re.sub(r'<script.*?</script>', '', b, flags=re.S)

    title = re.search(r'<title[^>]*>(.*?)</title>', h).group(1)
    title = html.unescape(title)

    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', b, re.S)
    h1 = clean(h1.group(1)) if h1 else ''

    labels = dedupe([clean(m) for m in re.findall(r'<p[^>]*styles-preset-1vdd63g[^>]*>(.*?)</p>', b, re.S)])
    values = dedupe([inner_links(m) for m in re.findall(r'<p[^>]*styles-preset-7m6sev[^>]*>(.*?)</p>', b, re.S)])
    meta = list(zip(labels, values))

    # sections: split on the section-heading preset
    parts = re.split(r'<h2[^>]*styles-preset-18btz5x[^>]*>(.*?)</h2>', b, flags=re.S)
    sections = []
    for i in range(1, len(parts), 2):
        head = clean(parts[i])
        body = parts[i + 1]
        # stop at the cross-link block that closes every essay page
        cut = body.find('href="./')
        if cut != -1:
            body = body[:cut]
        blocks = []
        for m in re.finditer(r'<(p|ol|ul)\b[^>]*>(.*?)</\1>', body, re.S):
            tag, content = m.group(1), m.group(2)
            if tag == 'p':
                if '<li' in content:
                    continue
                t = inner_links(content)
                if t:
                    blocks.append(('p', t))
            else:
                items = [inner_links(x) for x in re.findall(r'<li[^>]*>(.*?)</li>', content, re.S)]
                items = [x for x in items if x]
                if items:
                    blocks.append((tag, items))
        # drop duplicate paragraphs from responsive variants
        seen, ded = set(), []
        for kind, val in blocks:
            key = (kind, json.dumps(val))
            if key in seen:
                continue
            seen.add(key)
            ded.append((kind, val))
        # the closing cross-link block opens with a category eyebrow — drop it
        EYEBROWS = {'strategic influence', 'leadership approach',
                    'cross-functional partnership', 'systemic thinking'}
        while ded and ded[-1][0] == 'p' and ded[-1][1].lower() in EYEBROWS:
            ded.pop()
        if head and ded:
            sections.append((head, ded))
    sections = dedupe([(h, json.dumps(b)) for h, b in sections])
    sections = [(h, json.loads(b)) for h, b in sections]

    crosslinks = dedupe([(clean(m.group(2)), html.unescape(m.group(1)))
                         for m in re.finditer(r'<a [^>]*href="\./([a-z0-9-]+)"[^>]*>(.*?)</a>', b, re.S)])
    crosslinks = [(t, s) for t, s in crosslinks if t and s.startswith('how-i-')]
    return dict(title=title, h1=h1, meta=meta, sections=sections, crosslinks=crosslinks)


def to_md(slug, d):
    L = []
    L.append('---')
    L.append('slug: %s' % slug)
    L.append('title: >-')
    L.append('  %s' % d['h1'])
    L.append('metaTitle: >-')
    L.append('  %s' % d['title'])
    L.append('# description: [NEEDS: real meta description — live site ships "Made with Framer"]')
    for k, v in d['meta']:
        L.append('%s: >-' % k.lower())
        L.append('  %s' % v)
    L.append('---')
    L.append('')
    for head, blocks in d['sections']:
        L.append('## %s' % head)
        L.append('')
        for kind, val in blocks:
            if kind == 'p':
                L.append(val)
            elif kind == 'ol':
                for i, x in enumerate(val, 1):
                    L.append('%d. %s' % (i, x))
            else:
                for x in val:
                    L.append('- %s' % x)
            L.append('')
    # Cross-links are NOT emitted here — the essay template derives them from
    # src/data/essayGroups.ts so the grouping lives in one place.
    return '\n'.join(L)


os.makedirs(OUT + '/essays', exist_ok=True)
slugs = [f[:-5] for f in sorted(os.listdir(SRC)) if f.startswith('how-i-')]
for s in slugs:
    d = parse_essay(os.path.join(SRC, s + '.html'))
    d['crosslinks'] = [(t, sl) for t, sl in d['crosslinks'] if sl != s]  # drop self-link
    open(os.path.join(OUT, 'essays', s + '.md'), 'w').write(to_md(s, d))
    print(s, '| meta:', len(d['meta']), '| sections:', [h for h, _ in d['sections']], '| xlinks:', len(d['crosslinks']))
