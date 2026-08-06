/**
 * Contrast audit for the design tokens.
 *
 * The old site shipped three separate WCAG failures (tokens.md §1). If the footer
 * is going to claim this site was built with Tyler's own workflow, the site has to
 * survive someone opening devtools. So the palette is checked on every build, not
 * by eye.
 *
 * The palette and the rules live in src/data/palette.mjs — the same module the
 * /colophon page renders from, so the page can't drift from the check.
 *
 * Usage: npm run contrast
 */
import { audit } from '../src/data/palette.mjs';

const rows = audit();
const failed = rows.filter((r) => !r.pass);

const w = (s, n) => String(s).padEnd(n);
console.log(`\n  ${w('PAIR', 30)}${w('RATIO', 8)}${w('NEED', 8)}${w('', 6)}USAGE`);
console.log('  ' + '-'.repeat(84));
for (const r of rows) {
  console.log(
    `  ${w(`${r.fg} on ${r.bg}`, 30)}${w(r.ratio.toFixed(2), 8)}${w(r.need.toFixed(2), 8)}${w(
      r.pass ? 'PASS' : 'FAIL',
      6
    )}${r.use}`
  );
}
console.log('');

if (failed.length > 0) {
  console.error(`  ${failed.length} pair(s) below threshold.\n`);
  process.exit(1);
}
console.log(`  ${rows.length} pairs pass.\n`);
