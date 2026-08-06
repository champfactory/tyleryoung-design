/**
 * Derive the gathering list from the build instead of maintaining it by hand.
 *
 * Every [NEEDS] slot and every line of unapproved draft copy is marked in the
 * source (data-needs / data-draft). This scans the built HTML and reports where
 * they landed. When an asset arrives and gets wired in, its line disappears here
 * on its own — the list can't drift out of date the way a checklist does.
 *
 * docs/06-build-plan.md, Definition of done: "All Phase 2 content live with zero
 * [NEEDS] placeholders remaining." That's this script exiting with 0 found.
 *
 * Usage: npm run needs        (after a build)
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const text = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const route = (f) =>
  '/' + f.replace(/^dist\//, '').replace(/index\.html$/, '').replace(/\/$/, '');

let files;
try {
  files = (await htmlFiles(DIST)).sort();
} catch {
  console.error('\n  No dist/ — run `npm run build` first.\n');
  process.exit(1);
}

const pages = [];
let totalNeeds = 0;
let totalDrafts = 0;

for (const f of files) {
  const html = await readFile(f, 'utf8');
  const needs = [];

  // block placeholders: <span class="what">…</span>
  for (const m of html.matchAll(/<span class="what"[^>]*>([\s\S]*?)<\/span>/g)) {
    needs.push({ kind: 'asset', what: text(m[1]) });
  }
  // inline placeholders: <mark class="needs" data-needs>…</mark>
  for (const m of html.matchAll(/<mark class="needs"[^>]*data-needs[^>]*>([\s\S]*?)<\/mark>/g)) {
    needs.push({ kind: 'inline', what: text(m[1]).replace(/^NEEDS:\s*/i, '') });
  }
  // bare [NEEDS: …] strings, e.g. in metadata rails and meta tags
  for (const m of html.matchAll(/\[NEEDS:\s*([^\]]+)\]/g)) {
    needs.push({ kind: 'literal', what: text(m[1]) });
  }

  // meta descriptions I drafted rather than Tyler approving
  if (html.includes('<!-- DRAFT-META:')) {
    needs.push({ kind: 'inline', what: 'meta description is drafted, not approved' });
  }

  const drafts = [...html.matchAll(/data-draft(?!-)/g)].length;
  totalDrafts += drafts;
  totalNeeds += needs.length;

  if (needs.length || drafts) pages.push({ route: route(f), needs, drafts });
}

const label = { asset: 'ASSET ', inline: 'DECIDE', literal: 'FIELD ' };

console.log('\n  OPEN ITEMS — derived from the build\n');
for (const p of pages) {
  console.log(`  ${p.route}`);
  if (p.drafts) console.log(`    ${p.drafts} passage(s) of draft copy awaiting approval`);
  for (const n of p.needs) {
    const w = n.what.length > 92 ? n.what.slice(0, 89) + '...' : n.what;
    console.log(`    ${label[n.kind]}  ${w}`);
  }
  console.log('');
}

console.log(`  ${totalNeeds} open placeholder(s) · ${totalDrafts} draft passage(s) · ${pages.length} page(s) affected\n`);

if (process.argv.includes('--strict') && (totalNeeds > 0 || totalDrafts > 0)) {
  console.error('  Not ready to cut over.\n');
  process.exit(1);
}
