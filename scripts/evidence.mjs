/**
 * Evidence check — the most important gate on this site.
 *
 * The whole argument is that every claim can be opened. Three case studies embed
 * running deployments, one embeds a design file, and the homepage cards link
 * straight into them. If any of those goes down, the site keeps asserting
 * something that is no longer true, and nothing about the build would notice —
 * the HTML is still perfectly valid.
 *
 * So: pull every external artifact URL out of the built output and confirm each
 * one answers. A dead deployment should fail the build the same way a broken
 * internal link does.
 *
 * Usage: npm run evidence
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

/** Hosts whose liveness the site's claims depend on. */
const TRACKED = [/\.fly\.dev/, /figma\.com/];

/** Not evidence: source, mail, and anything a reader is not sent to as proof. */
const IGNORE = [/github\.com/, /^mailto:/, /fonts\./];

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
  files = await htmlFiles(DIST);
} catch {
  console.error('\n  No dist/ — run `npm run build` first.\n');
  process.exit(1);
}

/** url -> the pages that depend on it */
const found = new Map();
for (const f of files) {
  const html = await readFile(f, 'utf8');
  const page = '/' + f.replace(/^dist\//, '').replace(/index\.html$/, '');
  for (const m of html.matchAll(/(?:href|src)="(https:\/\/[^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (IGNORE.some((r) => r.test(url))) continue;
    if (!TRACKED.some((r) => r.test(url))) continue;
    // Keep the query string. It looked like view state, but an embed URL carries
    // its node id and host there — stripped, the same file answers 400. Only the
    // fragment is dropped, since a server never sees it.
    const key = url.split('#')[0];
    if (!found.has(key)) found.set(key, new Set());
    found.get(key).add(page);
  }
}

const urls = [...found.keys()].sort();
console.log(`\n  ${urls.length} external artifact(s) referenced across ${files.length} page(s)\n`);

const dead = [];
await Promise.all(
  urls.map(async (url) => {
    try {
      // HEAD first, but some hosts answer 404 to HEAD on a URL that GETs fine,
      // so a failing HEAD is only a reason to try GET — never a verdict.
      let res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
      if (res.status >= 400) {
        res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
      }
      const w = String(res.status).padEnd(5);
      console.log(`  ${w}${url}`);
      if (res.status >= 400) dead.push({ url, why: `HTTP ${res.status}` });
    } catch (err) {
      console.log(`  ---  ${url}`);
      dead.push({ url, why: err.name === 'TimeoutError' ? 'timed out' : 'unreachable' });
    }
  }),
);

if (dead.length) {
  console.error('\n  EVIDENCE THAT NO LONGER ANSWERS:');
  for (const d of dead) {
    console.error(`    ${d.url} — ${d.why}`);
    for (const p of found.get(d.url)) console.error(`      claimed on ${p}`);
  }
  console.error('');
  process.exit(1);
}

console.log(`\n  all ${urls.length} artifacts answer.\n`);
