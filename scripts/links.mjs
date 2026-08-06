/**
 * Internal link check.
 *
 * The previous site's essay URLs are preserved exactly so existing links and
 * recruiter bookmarks survive the migration. That promise is only worth making
 * if something verifies it, so this walks every internal href in the built
 * output and confirms a page exists at the other end.
 *
 * Also fails on anchors that point at an id no page defines — a dead in-page
 * link is invisible until someone clicks it.
 *
 * Usage: npm run links
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

/** URLs the previous site published. These must never 404 again. */
const LEGACY = [
  '/tldr',
  '/how-i-aligned-formative-vision',
  '/how-i-built-a-shared-scoring-model',
  '/how-i-translated-design-work',
  '/how-i-built-culture-around-paradox',
  '/how-i-unlocked-team-trust',
  '/how-i-scaled-design-efficiency',
  '/how-i-shaped-cross-functional-reputation',
  '/how-i-infused-design-roles-with-product-thinking',
  '/how-i-managed-ux-complexity',
];

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const exists = async (p) => access(p).then(() => true, () => false);

async function resolves(path) {
  const clean = path.replace(/[?#].*$/, '').replace(/\/$/, '');
  if (clean === '') return exists(join(DIST, 'index.html'));
  return (
    (await exists(join(DIST, clean, 'index.html'))) ||
    (await exists(join(DIST, clean))) ||
    (await exists(join(DIST, `${clean}.html`)))
  );
}

let files;
try {
  files = (await htmlFiles(DIST)).sort();
} catch {
  console.error('\n  No dist/ — run `npm run build` first.\n');
  process.exit(1);
}

// collect every id defined anywhere, per route
const ids = new Map();
const route = (f) => '/' + f.replace(/^dist\//, '').replace(/index\.html$/, '').replace(/\/$/, '');

for (const f of files) {
  const html = await readFile(f, 'utf8');
  ids.set(route(f), new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const broken = [];
let checked = 0;

for (const f of files) {
  const html = await readFile(f, 'utf8');
  const from = route(f);
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    if (href.endsWith('.xml') || href.endsWith('.svg') || href.endsWith('.txt')) continue;
    checked++;

    const [path, hash] = href.split('#');
    const target = path === '' ? from : path;

    if (path !== '' && !(await resolves(path))) {
      broken.push({ from, href, why: 'no page at that path' });
      continue;
    }
    if (hash) {
      const targetIds = ids.get(target.replace(/\/$/, '') || '/');
      if (targetIds && !targetIds.has(hash)) {
        broken.push({ from, href, why: `no #${hash} on ${target || '/'}` });
      }
    }
  }
}

console.log(`\n  ${checked} internal link(s) checked across ${files.length} page(s)\n`);

const missingLegacy = [];
for (const l of LEGACY) if (!(await resolves(l))) missingLegacy.push(l);

if (missingLegacy.length) {
  console.error('  LEGACY URLS THAT NO LONGER RESOLVE:');
  for (const l of missingLegacy) console.error(`    ${l}`);
  console.error('');
} else {
  console.log(`  all ${LEGACY.length} legacy URLs from the previous site still resolve\n`);
}

if (broken.length) {
  console.error('  BROKEN:');
  for (const b of broken) console.error(`    ${b.from}  →  ${b.href}   (${b.why})`);
  console.error('');
}

if (broken.length || missingLegacy.length) process.exit(1);
console.log('  no broken internal links.\n');
