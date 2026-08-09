/**
 * Runs axe-core over every built page.
 *
 * The other checks in this audit test what the source says. This one tests what
 * a browser renders, which is a different question and catches a different
 * class of thing: the contrast script compares a hand-written list of colour
 * pairs, so it can only find a failure someone remembered to declare. ink-3 on
 * the mount measured 4.47 and was never on that list. axe found it because it
 * looked at the page.
 *
 * WCAG 2.1 A and AA. Best-practice rules are reported but do not fail the
 * build — they are advice, not the standard.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { webkit } from 'playwright';

const PORT = process.env.PORT ?? 4399;
const axe = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');

const pages = [];
(function walk(d, base = '') {
  for (const e of readdirSync(d)) {
    const p = `${d}/${e}`;
    if (statSync(p).isDirectory()) walk(p, `${base}/${e}`);
    else if (e === 'index.html') pages.push(base || '/');
  }
})('dist');

const browser = await webkit.launch();
const failures = new Map();
const advice = new Map();
let checked = 0;

for (const route of pages.sort()) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    const res = await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'load' });
    if (!res || res.status() >= 300) continue;
    await page.waitForTimeout(300);
    await page.evaluate(axe);
    const out = await page.evaluate(async () =>
      window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
      }),
    );
    checked++;
    for (const v of out.violations) {
      const standard = v.tags.some((t) => t.startsWith('wcag'));
      const bucket = standard ? failures : advice;
      const key = `${v.id}|${v.help}`;
      if (!bucket.has(key)) bucket.set(key, new Set());
      for (const n of v.nodes) bucket.get(key).add(`${route}  ${n.target.join(' ')}`);
    }
  } finally {
    await page.close();
  }
}
await browser.close();

console.log(`\n  axe-core over ${checked} page(s), WCAG 2.1 A/AA.`);

if (advice.size) {
  console.log('\n  best practice (not failing):');
  for (const [k, where] of advice) console.log(`    ${k.split('|')[1]} — ${[...where].length} instance(s)`);
}

if (failures.size) {
  console.error('\n  WCAG VIOLATIONS:');
  for (const [k, where] of failures) {
    console.error(`    ${k.split('|')[0]} — ${k.split('|')[1]}`);
    for (const w of [...where].slice(0, 6)) console.error(`      ${w}`);
  }
  console.error('');
  process.exit(1);
}
console.log('  no WCAG violations.\n');
