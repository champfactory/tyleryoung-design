/**
 * Fails the build if a colour token exists in global.css and is not documented
 * on /design-system.
 *
 * The page says the values are read from the stylesheet, so "this has to be the
 * system". That was a claim, not a check — the first time anyone counted, the
 * page carried eleven of twenty-four. A claim a build can verify should be
 * verified by the build.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { documented, radii } from '../src/data/system.mjs';

const css = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf8');
const declared = [
  ...new Set([...css.matchAll(/--((?:color|radius)-[a-z0-9-]+)\s*:/g)].map((m) => m[1])),
];
const known = [...documented.map((n) => `color-${n}`), ...radii.map((r) => r.name)];

const missing = declared.filter((n) => !known.includes(n));
const phantom = known.filter((n) => !declared.includes(n));

console.log(`\n  ${declared.length} colour and radius token(s) declared, ${known.length} documented.`);

if (missing.length) {
  console.log(`\n  UNDOCUMENTED — add to src/data/system.mjs or remove from global.css:`);
  for (const n of missing) console.log(`    --${n}`);
}
if (phantom.length) {
  console.log(`\n  DOCUMENTED BUT NOT DECLARED:`);
  for (const n of phantom) console.log(`    --${n}`);
}

if (missing.length || phantom.length) process.exit(1);
console.log('  every colour and radius token is documented.\n');
