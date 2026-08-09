/**
 * The design system, read out of the stylesheet that defines it.
 *
 * Values are parsed from src/styles/global.css at build time rather than typed
 * here, for the same reason the contrast table is computed rather than written
 * down: a hand-copied value is a claim about the system, and this has to be the
 * system. Change a token and this page changes with it or the build fails.
 *
 * Organised by family rather than by kind, because that is the argument. A
 * family is the unit a system is made of — a set of members answering one
 * question — and every family here has a note saying what went wrong that made
 * it necessary. A catalogue of components would document the output. This
 * documents the decisions.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ratio } from './palette.mjs';

// Resolved from the project root, not from import.meta.url: this module gets
// bundled into dist/.prerender before it runs, so a path relative to the module
// points at the build output rather than the source it is supposed to read.
const css = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf8');

/** Every `--name: value;` declared in the theme block, in source order. */
function tokens(prefix) {
  const out = [];
  const re = new RegExp(`--(${prefix}[a-z0-9-]*)\\s*:\\s*([^;]+);`, 'g');
  let m;
  while ((m = re.exec(css))) {
    const name = m[1];
    if (!out.some((t) => t.name === name)) out.push({ name, value: m[2].trim() });
  }
  return out;
}

const colour = tokens('color-');
const value = (name) => colour.find((c) => c.name === name)?.value ?? '';

/** The surfaces a thing can sit on, darkest page-side first. */
export const surfaces = [
  ['paper', 'The page itself.'],
  ['paper-raised', 'A card lifted off the page: story cards, figure cards, the nav.'],
  ['band-a', 'The darker of the two alternating rows.'],
  ['band-b', 'The lighter of the two.'],
  ['mount', 'The mat a screenshot is mounted on, in the compare blocks and the capture cards.'],
  ['header', 'The references band.'],
  ['note', 'A disclosure that needs to look like a caveat.'],
].map(([name, use]) => ({
  name,
  use,
  value: value(`color-${name}`),
  onInk: ratio(value('color-ink'), value(`color-${name}`)),
}));

/** Ink, in the three weights the site allows. */
export const inks = [
  ['ink', 'Body, headings, anything that carries the argument.'],
  ['ink-2', 'Secondary prose and labels.'],
  ['ink-3', 'Detail that must not compete: captions, metadata.'],
  ['signal', 'Links. Nothing else is ever this colour.'],
].map(([name, use]) => ({ name, use, value: value(`color-${name}`) }));

/**
 * Sorted by rendered size rather than source order: the file happens to declare
 * h2 above lede, which reads as a broken scale when the whole set is shown at
 * once. The clamped display step has no single px and sorts last.
 */
export const type = tokens('text-').sort((a, b) => {
  const px = (t) => (t.value.startsWith('clamp') ? Infinity : parseFloat(t.value));
  return px(a) - px(b);
});
export const space = tokens('space-');

/** The marks, and what each one means when it appears. */
export const marks = [
  ['bullet', 'An item in an unordered list.'],
  ['1', 'The first item in an ordered list. Five exist; a sixth falls back to a plain numeral.'],
  ['2', 'The second.'],
  ['3', 'The third.'],
  ['4', 'The fourth.'],
  ['5', 'The fifth, and the last one drawn.'],
  ['hollow', 'A point in a sequence that is not a step — the way out rather than another gate.'],
];

/**
 * The rules. These are the system, more than the values are: a token can be
 * looked up, but a rule is what stops the same decision being made twice.
 * Each carries the defect that produced it, because that is the evidence.
 */
export const rules = [
  {
    rule: 'One banding rule, for every alternating row on the site.',
    why: 'There were five zebra implementations in four files with three different treatments. Changing the ledger left the principles list, the before/now ledger and the ratio table on the old grey. A new banded pattern joins the selector list; it does not get its own colours.',
  },
  {
    rule: 'Blue is a link. Nothing else is ever blue.',
    why: 'Status swatches in the feedback table were blue squares, which read as an affordance that was not there. The colour is the only thing that says “link”, so spending it elsewhere costs the one place it has to work.',
  },
  {
    rule: 'A marker hangs in the indent; the text starts at 26px.',
    why: 'Numbered lists indented 38px and bulleted lists 22px, so two lists in the same column started on different edges. The disclosure caret later landed on a third edge at 393px. All of them now share one.',
  },
  {
    rule: 'A mark takes its colour from currentColor.',
    why: 'The chevron and the list markers are masks rather than images, so a marker is blue inside a link and ink inside a caption without being told. An <img> would freeze the fill.',
  },
  {
    rule: 'Evidence sits on the mount; lists sit on the bands.',
    why: 'The compare blocks and capture cards were reading the alternating row’s lighter band — a token tuned for separating list items, doing the job of lifting a screenshot off the page. It sat four units from the page background and disappeared.',
  },
  {
    rule: 'Every colour pair is checked at the smallest size it is used.',
    why: 'The check runs before the build and fails it. Two pairs failed during this build; both times the token changed rather than the component, so the fix propagated everywhere.',
  },
];
