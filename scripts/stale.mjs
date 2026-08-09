/**
 * Fails the build when a comment describes something that no longer exists.
 *
 * This codebase explains itself in prose — most rules carry the defect that
 * produced them — and prose rots silently. The header of global.css named three
 * typefaces after one was deleted, said the essay groups were numbered when
 * they had been named for weeks, and cited a file in a gitignored directory
 * that a reader of the public repo follows to nothing. Nothing caught any of
 * it, because none of it is code.
 *
 * So: read the comments, pull out the things they name that are checkable —
 * custom properties, file paths, npm scripts — and confirm each one is real.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOTS = ['src', 'scripts', 'content'];
const CODE = /\.(astro|css|mjs|ts|js|md)$/;

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (CODE.test(e)) files.push(p);
  }
})('.'.length && ROOTS[0] ? ROOTS[0] : 'src');
for (const r of ROOTS.slice(1)) {
  if (!existsSync(r)) continue;
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (CODE.test(e)) files.push(p);
    }
  })(r);
}

/** Every custom property declared anywhere in the source. */
const declared = new Set();
for (const f of files) {
  for (const m of readFileSync(f, 'utf8').matchAll(/(--[a-z][a-z0-9-]*)\s*:/g)) declared.add(m[1]);
}

/** Every file in the repo, by path and by basename. */
const onDisk = new Set();
const byName = new Set();
(function walk(d) {
  for (const e of readdirSync(d)) {
    if (e === 'node_modules' || e === '.git' || e === 'dist' || e === '.astro') continue;
    const p = join(d, e).replace(/^\.\//, '');
    if (statSync(p).isDirectory()) { onDisk.add(p + '/'); walk(p); }
    else { onDisk.add(p); byName.add(basename(p)); }
  }
})('.');

const scripts = new Set(Object.keys(JSON.parse(readFileSync('package.json', 'utf8')).scripts));

/** Comment text only — code is checked by the compiler and by tokens.mjs. */
function comments(src, file) {
  const out = [];
  for (const m of src.matchAll(/\/\*[\s\S]*?\*\//g)) out.push(m[0]);
  for (const m of src.matchAll(/(^|\s)\/\/[^\n]*/g)) out.push(m[0]);
  for (const m of src.matchAll(/<!--[\s\S]*?-->/g)) out.push(m[0]);
  // the design-system rules are prose about the system, so they count as comments
  if (file.endsWith('system.mjs')) {
    for (const m of src.matchAll(/(?:statement|why|rule|use):\s*'((?:[^'\\]|\\.)*)'/g)) out.push(m[1]);
  }
  return out.join('\n');
}

const problems = [];
for (const f of files) {
  const text = comments(readFileSync(f, 'utf8'), f);
  const seen = new Set();
  const add = (kind, what) => {
    const k = `${kind}|${what}`;
    if (seen.has(k)) return;
    seen.add(k);
    problems.push({ file: f, kind, what });
  };

  /* Not preceded by a word character: `components-sidebar--default` is a
     Storybook story id, not a custom property. */
  for (const m of text.matchAll(/(?<![\w-])--[a-z][a-z0-9-]*/g)) {
    if (!declared.has(m[0])) add('token', m[0]);
  }
  for (const m of text.matchAll(/\b((?:src|scripts|content|public|docs|reference)\/[\w./-]*[\w/])/g)) {
    const p = m[1].replace(/[.,)]$/, '');
    /* A page is normally referred to without its extension, and that is a fair
       way to write it, so try the ones this repo uses before calling it stale. */
    const found =
      onDisk.has(p) ||
      onDisk.has(p + '/') ||
      ['.astro', '.mjs', '.ts', '.css', '.json', '.md'].some((e) => onDisk.has(p + e));
    if (!found) add('path', p);
  }
  /* Only extensions this repo authors, and only when the name is not part of a
     longer path, so the tail of a dotted filename is not read as a file of its
     own. A
     `.json` or `.md` is checked only as a full path above, because those names
     usually belong to something remote: the Storybook's index.json. */
  for (const m of text.matchAll(/(?<![\w./-])([\w-]+\.(?:mjs|astro|ts|css))\b/g)) {
    if (!byName.has(m[1])) add('file', m[1]);
  }
  for (const m of text.matchAll(/npm run ([a-z:-]+)/g)) {
    if (!scripts.has(m[1])) add('script', `npm run ${m[1]}`);
  }
}

console.log(`\n  ${files.length} source file(s) scanned for comments naming things that do not exist.`);

if (problems.length) {
  console.error('\n  STALE REFERENCES:');
  const byFile = new Map();
  for (const p of problems) {
    if (!byFile.has(p.file)) byFile.set(p.file, []);
    byFile.get(p.file).push(p);
  }
  for (const [file, list] of byFile) {
    console.error(`    ${file}`);
    for (const p of list) console.error(`      ${p.kind.padEnd(7)} ${p.what}`);
  }
  console.error('');
  process.exit(1);
}
console.log('  every token, path, file and script named in a comment exists.\n');
