/**
 * The palette, and the rules it has to satisfy.
 *
 * One source of truth, used by two consumers:
 *   - scripts/contrast.mjs  — fails the build if a pair drops below threshold
 *   - src/pages/colophon    — renders the same audit on the page, computed live
 *
 * The colophon showing a hand-typed table of passing numbers would be a claim.
 * Computing it from the same module the check runs against makes it evidence.
 */

export const TOKENS = {
  paper: '#ffffff', // was #f6f4ef
  'paper-raised': '#fcfbf8',
  'paper-sunk': '#edeae1',
  row: '#f5f5f6',
  ink: '#1a1a18',
  'ink-2': '#55534b',
  'ink-3': '#6b6961',
  rule: '#d0ccbe',
  'rule-strong': '#b9b4a6',
  machine: '#16161a',
  'machine-raised': '#202027',
  'machine-ink': '#e6e4dc',
  'machine-ink-2': '#9d9a90',
  signal: '#99560a',
  'signal-ink': '#ffffff',
  live: '#2f6f4e',
  header: '#d6e9f8',
  'header-rule': '#a3c6e2',
  /* The header blue rotated to green and nothing else: #d6e9f8 is
     hsl(206, 71%, 91%), so this is hsl(140, 71%, 91%). Same saturation, same
     lightness, so the two bands sit at the same weight on the page. */
  accent: '#d6f8e1',
  'accent-rule': '#a3e2b8',
};

/** Pairs that must pass, at the smallest size each is actually used. */
export const PAIRS = [
  ['ink', 'paper', 'AA', 'body + headings'],
  ['ink-2', 'paper', 'AA', 'secondary prose'],
  ['ink-3', 'paper', 'AA', 'mono labels @ 11px'],
  ['signal', 'paper', 'AA', 'links, section numbers'],
  ['live', 'paper', 'AA', 'live-product marker'],
  ['ink', 'paper-raised', 'AA', 'card text'],
  ['ink', 'paper-sunk', 'AA', 'sunk panel text'],
  ['ink', 'row', 'AA', 'banded row text'],
  ['ink-3', 'row', 'AA', 'banded row detail @ 16px'],
  ['machine-ink', 'machine', 'AA', 'terminal body text'],
  ['machine-ink-2', 'machine', 'AA', 'terminal dim text'],
  ['machine-ink', 'machine-raised', 'AA', 'raised panel text'],
  ['signal-ink', 'signal', 'AA', 'inverted signal label'],
  ['ink', 'header', 'AA', 'wordmark on the header'],
  ['ink', 'accent', 'AA', 'reference quotes on the accent band'],
  ['ink-3', 'accent', 'AA', 'attribution @ 11px on the accent band'],
  ['ink-2', 'header', 'AA', 'header sentence @ 11px'],
  ['signal', 'header', 'AA', 'current-page marker on the header'],
  ['header-rule', 'header', 'UI', 'header hairline'],
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
