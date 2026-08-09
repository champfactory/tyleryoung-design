/**
 * Fails the build if the site ships more JavaScript than it has argued for.
 *
 * The old requirement was absolute — "content pages ship without client-side
 * JavaScript" — and it lived in a data file nothing rendered, so nothing ever
 * checked it. The modal made it false. An absolute nobody measures is worth
 * less than a budget the build enforces, so this is the budget.
 *
 * Raising either number is a decision, not an accident: it means editing this
 * file, which is the point.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Pages allowed to ship any script at all, and why. */
const ALLOWED = new Map([['/review-loop', 'the 48-note sheet — dialog.showModal, focus and Escape']]);

/** Total inline + external script bytes the whole site may ship. */
const BUDGET = 2048;

const pages = [];
(function walk(dir, base = '') {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, `${base}/${e}`);
    else if (e === 'index.html') pages.push([base || '/', p]);
  }
})('dist');

let total = 0;
const offenders = [];
const rows = [];

for (const [route, file] of pages.sort()) {
  const html = readFileSync(file, 'utf8');
  const srcs = [...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].reduce(
    (n, m) => n + m[1].length,
    0,
  );
  let ext = 0;
  for (const s of srcs) {
    try {
      ext += statSync(join('dist', s)).size;
    } catch {}
  }
  const bytes = inline + ext;
  if (!bytes) continue;
  total += bytes;
  rows.push([route, bytes, srcs.length]);
  if (!ALLOWED.has(route)) offenders.push(route);
}

console.log(`\n  ${rows.length} of ${pages.length} page(s) ship script, ${total}B total (budget ${BUDGET}B).`);
for (const [route, bytes, files] of rows) {
  console.log(`    ${route.padEnd(28)} ${String(bytes).padStart(5)}B  ${files} external file(s)  — ${ALLOWED.get(route) ?? 'NOT ALLOWED'}`);
}

if (offenders.length) {
  console.log(`\n  These pages ship script and are not in the allowlist:`);
  for (const o of offenders) console.log(`    ${o}`);
}
if (total > BUDGET) console.log(`\n  Over budget by ${total - BUDGET}B.`);

if (offenders.length || total > BUDGET) process.exit(1);
console.log('  within budget.\n');
