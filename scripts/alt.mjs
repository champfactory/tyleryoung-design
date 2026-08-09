/**
 * Alt-text check.
 *
 * The previous site shipped the same alt text on three different people's
 * headshots, and nine more images with none at all. Both are the kind of thing
 * that is easy to fix once and easy to reintroduce the next time an image gets
 * added in a hurry.
 *
 * Two rules, and the second is the one that mattered:
 *
 *   1. Every image has non-empty alt text.
 *   2. No two images share the same alt text.
 *
 * Rule 2 catches the specific failure the old site had. Copying a description
 * from the image above it satisfies rule 1 while describing the wrong thing, and
 * that is exactly how three people ended up with one name between them.
 *
 * Usage: npm run alt
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

/** Decorative images legitimately carry alt="" — none on this site, so far. */
const ALLOW_EMPTY = [];

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let files;
try {
  files = (await htmlFiles(DIST)).sort();
} catch {
  console.error('\n  No dist/ — run `npm run build` first.\n');
  process.exit(1);
}

const missing = [];
const unsized = [];
const byAlt = new Map();
let count = 0;

for (const f of files) {
  const html = await readFile(f, 'utf8');
  const page = '/' + f.replace(/^dist\//, '').replace(/index\.html$/, '');
  for (const m of html.matchAll(/<img[^>]*>/g)) {
    const tag = m[0];
    count++;
    const src = (tag.match(/src="([^"]*)"/) || [, '(no src)'])[1];
    const alt = tag.match(/\salt="([^"]*)"/);
    if (!alt || !alt[1].trim()) {
      if (!ALLOW_EMPTY.includes(src)) missing.push({ page, src });
      continue;
    }
    const key = alt[1].trim();
    if (!byAlt.has(key)) byAlt.set(key, []);
    byAlt.get(key).push({ page, src });

    /* An <img> with no intrinsic size reserves no box, so everything under it
       jumps when the file arrives. Twenty-seven of thirty-four were missing
       both when anyone counted. */
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) unsized.push({ page, src });
  }
}

const unsizedList = unsized;
const shared = [...byAlt.entries()].filter(([, uses]) => uses.length > 1);

console.log(`\n  ${count} image(s) across ${files.length} page(s)\n`);

if (missing.length) {
  console.error('  IMAGES WITH NO ALT TEXT:');
  for (const m of missing) console.error(`    ${m.page}  ${m.src}`);
  console.error('');
}

if (shared.length) {
  console.error('  ALT TEXT USED ON MORE THAN ONE IMAGE:');
  for (const [alt, uses] of shared) {
    console.error(`    "${alt.slice(0, 70)}${alt.length > 70 ? '…' : ''}"`);
    for (const u of uses) console.error(`      ${u.page}  ${u.src}`);
  }
  console.error('');
}

if (unsizedList.length) {
  console.error('  IMAGES WITH NO WIDTH/HEIGHT (they reserve no box, so the page jumps):');
  for (const u of unsizedList) console.error(`    ${u.page}  ${u.src}`);
  console.error('');
}

if (missing.length || shared.length || unsizedList.length) process.exit(1);
console.log(`  every image has alt text, no two share it, and every one states its size.\n`);
