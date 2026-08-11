/**
 * Renders public/og.png from the site's own tokens.
 *
 * BaseLayout says the share card "is generated from the site's own stylesheet,
 * so the share card cannot drift from the design system". That was a claim, not
 * a check, and it was false: og.png was a static export. When the palette went
 * dark the card stayed white, so every link preview showed a site that no
 * longer exists — the same class of defect scripts/tokens.mjs was written for.
 *
 * Run `npm run og` to regenerate. `npm run og:check` fails the build if the
 * committed card no longer matches the stylesheet, which is what makes the
 * sentence in BaseLayout true.
 *
 * The copy is fixed here and matches og:image:alt. Changing it is Tyler's call,
 * not this script's.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { webkit } from 'playwright';
import { TOKENS } from '../src/data/palette.mjs';

const check = process.argv.includes('--check');
const out = join(process.cwd(), 'public/og.png');

const css = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf8');
const font = (name) =>
  css.match(new RegExp(`--font-${name}:\\s*([^;]+);`))[1].replace(/\s+/g, ' ').trim();

const html = `<!doctype html><meta charset="utf-8"><style>
  html, body { margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px; box-sizing: border-box;
    padding: 76px 76px 68px;
    display: flex; flex-direction: column; justify-content: space-between;
    background: ${TOKENS.paper};
    font-family: ${font('prose')};
    -webkit-font-smoothing: antialiased;
  }
  .eyebrow { font-size: 21px; letter-spacing: 0.14em; text-transform: uppercase; }
  .eyebrow b { color: ${TOKENS.ink}; font-weight: 600; }
  .eyebrow span { color: ${TOKENS['ink-2']}; font-weight: 400; margin-left: 14px; }
  h1 {
    margin: 0; font-family: ${font('display')};
    font-size: 82px; line-height: 1.08; letter-spacing: -0.028em;
    font-weight: 600; color: ${TOKENS.ink};
  }
  .url { font-size: 21px; letter-spacing: 0.14em; text-transform: uppercase; color: ${TOKENS.signal}; }
</style>
<div class="eyebrow"><b>Tyler Young</b><span>Senior Director of Design</span></div>
<h1>I build the systems<br>AI designs within</h1>
<div class="url">tyleryoung.design</div>`;

const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
const buf = await page.screenshot({ type: 'png' });
await browser.close();

if (check) {
  const current = readFileSync(out);
  if (!current.equals(buf)) {
    console.log('\n  og.png no longer matches the stylesheet it claims to come from.');
    console.log('  Run `npm run og` to regenerate it.\n');
    process.exit(1);
  }
  console.log(`\n  share card matches the stylesheet (ground ${TOKENS.paper}).\n`);
} else {
  writeFileSync(out, buf);
  console.log(`\n  wrote public/og.png — 1200x630, ground ${TOKENS.paper}.\n`);
}
