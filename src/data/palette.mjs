/**
 * The palette, and the rules it has to satisfy.
 *
 * One source of truth, used by two consumers:
 *   - scripts/contrast.mjs  — fails the build if a pair drops below threshold
 *   - src/pages/how-i-design-with-ai — was the colophon; the audit moved with it
 *
 * A page showing a hand-typed table of passing numbers would be a claim.
 * Computing it from the same module the check runs against makes it evidence.
 */

/**
 * The token values, read out of the stylesheet that declares them.
 *
 * This used to be a hand-written copy of every hex. It drifted: the neutrals
 * were retuned to hue 210 in global.css and this table kept the old 240s, so
 * the contrast gate spent that time checking five colours the site no longer
 * shipped. A check that tests a stale copy of the thing is worse than no check,
 * because it reports confidence it has not earned.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf8');

export const TOKENS = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map((m) => [
    m[1],
    m[2],
  ]),
);

/** Pairs that must pass, at the smallest size each is actually used. */
export const PAIRS = [
  ['machine-ink', 'machine', 'AA', 'design-system page body'],
  ['machine-ink-2', 'machine', 'AA', 'design-system page labels'],
  ['machine-signal', 'machine', 'AA', 'design-system page links'],
  ['machine-ink', 'machine-raised', 'AA', 'design-system row text'],
  ['machine-ink-2', 'machine-raised', 'AA', 'design-system row detail'],
  ['machine-ink', 'machine-band', 'AA', 'design-system row text, alternate'],
  ['machine-ink-2', 'machine-band', 'AA', 'design-system row detail, alternate'],
  ['ink', 'paper', 'AA', 'body + headings'],
  ['ink', 'band-a', 'AA', 'ledger row text'],
  ['ink', 'band-b', 'AA', 'ledger row text, alternate'],
  ['ink-2', 'band-a', 'AA', 'ledger row label'],
  ['ink-2', 'band-b', 'AA', 'ledger row label, alternate'],
  ['ink', 'mount', 'AA', 'compare note and capture text'],
  ['ink-2', 'mount', 'AA', 'before/after tag and capture label'],
  ['ink-2', 'paper', 'AA', 'secondary prose'],
  ['ink-3', 'paper', 'AA', 'mono labels @ 11px'],
  ['signal', 'paper', 'AA', 'links, section numbers'],
  ['ink', 'paper-raised', 'AA', 'card text'],
  ['ink-3', 'paper-raised', 'AA', 'figure card label'],
  ['ink', 'paper-sunk', 'AA', 'sunk panel text'],
  ['ink-3', 'band-a', 'AA', 'banded row detail @ 16px'],
  ['machine-ink', 'machine', 'AA', 'terminal body text'],
  ['machine-ink-2', 'machine', 'AA', 'terminal dim text'],
  ['machine-ink', 'machine-raised', 'AA', 'raised panel text'],
  ['signal-ink', 'signal', 'AA', 'inverted signal label'],
  ['ink', 'paper', 'AA', 'wordmark on the nav'],
  ['ink-2', 'paper-raised', 'AA', 'disclosure eyebrow @ 11px'],
  ['ink-2', 'paper', 'AA', 'reference attribution @ 11px on the band'],
  ['signal', 'paper', 'AA', 'nav links on the nav'],
  ['rule-strong', 'paper', 'UI', 'hairline rules'],
  ['rule', 'paper', 'UI', 'hairline rules (subtle)'],
];

export const THRESHOLD = { AA: 4.5, 'AA-large': 3.0, UI: 1.4 };

export function luminance(hex) {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

export function audit() {
  return PAIRS.map(([fg, bg, level, use]) => {
    for (const t of [fg, bg]) {
      if (!TOKENS[t]) throw new Error(`palette: pair "${fg} on ${bg}" (${use}) names --color-${t}, which global.css does not define`);
    }
    const r = ratio(TOKENS[fg], TOKENS[bg]);
    const need = THRESHOLD[level];
    return {
      fg,
      bg,
      use,
      level,
      ratio: r,
      need,
      pass: r >= need,
    };
  });
}
