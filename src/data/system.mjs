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

/** What a thing sits on. */
export const surfaces = [
  ['paper', 'Page background.'],
  ['paper-raised', 'Raised cards, figures, and navigation.'],
  ['paper-sunk', 'A panel set into the page rather than lifted off it.'],
  ['band-a', 'Darker row in an alternating list.'],
  ['band-b', 'Lighter row in an alternating list.'],
  ['mount', 'Background for screenshots and other visual evidence.'],
  ['header', 'Background for reference headers.'],
  ['note', 'Background for caveats and disclosures.'],
].map(([name, use]) => ({
  name,
  use,
  value: value(`color-${name}`),
  onInk: ratio(value('color-ink'), value(`color-${name}`)),
}));

/** Text hierarchy. Signal is reserved for links. */
export const inks = [
  ['ink', 'Headings and primary text.'],
  ['ink-2', 'Secondary text and labels.'],
  ['ink-3', 'Captions, metadata, and supporting detail.'],
  ['signal', 'Links only.'],
  ['signal-ink', 'Text on a signal background.'],
].map(([name, use]) => ({ name, use, value: value(`color-${name}`) }));

/** Hairlines. Two weights, because a divider and a boundary are not the same. */
export const lines = [
  ['rule', 'Divider between items in the same block.'],
  ['rule-strong', 'Boundary between one block and the next.'],
].map(([name, use]) => ({ name, use, value: value(`color-${name}`) }));

/**
 * The dark counterpart, for terminals, code and receipts — and for this page,
 * which is why it is documented here rather than treated as a local exception.
 */
export const machine = [
  ['machine', 'Page background.'],
  ['machine-raised', 'Darker row in an alternating list, and raised panels.'],
  ['machine-band', 'Lighter row in an alternating list.'],
  ['machine-rule', 'Hairline.'],
  ['machine-ink', 'Primary text.'],
  ['machine-ink-2', 'Secondary text and labels.'],
  ['machine-signal', 'Links. Signal scores 3.24 here and fails, so this set carries its own.'],
].map(([name, use]) => ({ name, use, value: value(`color-${name}`) }));

/** What each text role is for. */
const TYPE_USE = {
  eyebrow: 'Section label above a heading.',
  meta: 'Rail labels and values.',
  caption: 'Figure captions and legends.',
  note: 'Secondary prose and list detail.',
  body: 'Running prose.',
  h3: 'Subheading inside a section.',
  lede: 'Opening paragraph.',
  h2: 'Section heading.',
  display: 'Page title.',
};

/**
 * Sorted by rendered size rather than source order: the file happens to declare
 * h2 above lede, which reads as a broken scale when the whole set is shown at
 * once. The clamped display step has no single px and sorts last.
 */
export const type = tokens('text-')
  .sort((a, b) => {
    const px = (t) => (t.value.startsWith('clamp') ? Infinity : parseFloat(t.value));
    return px(a) - px(b);
  })
  .map((t) => ({ ...t, use: TYPE_USE[t.name.replace('text-', '')] ?? '' }));

/** What each interval sits between. */
const SPACE_USE = {
  section: 'Between sections.',
  heading: 'Between a section heading and its content.',
  block: 'Between related content blocks.',
  embed: 'Around embedded media and interactive examples.',
  'page-top': 'Above the main page content.',
  'page-bottom': 'Below the main page content.',
};

export const space = tokens('space-').map((t) => ({
  ...t,
  use: SPACE_USE[t.name.replace('space-', '')] ?? '',
}));

/** How round a corner is. Two jobs, so two members. */
const RADIUS_USE = {
  mat: 'A mat or card sitting on the page.',
  inset: 'Something sitting on a mat.',
};

export const radii = tokens('radius-').map((t) => ({
  ...t,
  use: RADIUS_USE[t.name.replace('radius-', '')] ?? '',
}));

/** List items and sequence states. Each mark takes the colour of its text. */
export const marks = [
  ['bullet', 'Unordered-list item.'],
  ['1', 'First ordered-list item.'],
  ['2', 'Second ordered-list item.'],
  ['3', 'Third ordered-list item.'],
  ['4', 'Fourth ordered-list item.'],
  ['5', 'Fifth ordered-list item. Orders longer than five use plain numerals.'],
  ['hollow', 'An outcome or exit from a sequence rather than another step.'],
];

/**
 * Every colour token this file documents. The check in scripts/tokens.mjs
 * compares it against global.css and fails the build on a gap, because the
 * page claims to be the system rather than a description of it — and it
 * documented eleven of twenty-four the first time anyone counted.
 */
export const documented = [...surfaces, ...inks, ...lines, ...machine].map((t) => t.name);

/**
 * The rules. These are the system, more than the values are: a token can be
 * looked up, but a rule is what stops the same decision being made twice.
 * Each carries the defect that produced it, because that is the evidence.
 */
export const rules = [
  {
    title: 'Use one pattern for alternating rows',
    statement: 'All alternating rows use band-a and band-b, through one selector list.',
    why: 'There were five implementations across four files in three treatments. Updating one did not update the others, so changing the ledger left the principles list, the before/now ledger and the ratio table on the old grey. A new banded pattern joins the selector list; it does not get its own colours. The same defect had produced two names for one value — band-a and row were both #e9e9ed, kept in step by hand — and row is gone.',
  },
  {
    title: 'Reserve blue for links',
    statement: 'Only links use signal.',
    why: 'Status indicators in the feedback table were blue squares, which made them look interactive when they were not. The colour is the only thing that says "link", so spending it anywhere else costs the one place it has to work.',
  },
  {
    title: 'Align text to one edge',
    statement: 'List markers and disclosure controls hang in the indent. Their text starts at 26px.',
    why: 'Numbered lists indented 38px and bulleted lists 22px, so two lists in the same column started on different edges. The disclosure caret later landed on a third at 393px. 26px is what a single digit needs; the wider indent existed for a leading zero that is no longer used.',
  },
  {
    title: 'Let marks inherit text colour',
    statement: 'Marks are masks painted with currentColor.',
    why: 'A marker is signal inside a link and ink inside a caption without being told which. A fixed image would freeze the fill, and a pseudo-element cannot render a component. Each mask also carries width and height as well as a viewBox, so its intrinsic ratio does not depend on the engine.',
  },
  {
    title: 'Use the mount for evidence and the bands for lists',
    statement: 'Screenshots and embedded applications sit on mount. Alternating list items sit on band-a and band-b.',
    why: 'Both were reading band-b — a token tuned for separating rows in a list, doing the job of lifting a screenshot off the page. It sat four units from the page background and disappeared. The embed cards had the same defect a second time, on paper-raised: white cards holding near-white applications, meeting the page at 1.03:1.',
  },
  {
    title: 'Declare one size for a page title',
    statement: 'Every page title is --text-display. Nothing is computed per title.',
    why: 'The size used to be solved per headline so each one would fill its measure, which made the size depend on where the words broke — three lines came out larger than two. Thirteen pages ran 46px to 105px. A title that ends short of the right edge is normal; thirteen sizes of one component is not.',
  },
  {
    title: 'Test every colour pair that is used',
    statement: 'Each foreground and background pair is checked at the smallest size it appears at.',
    why: 'The check runs before the build and fails it. When a pair fails, the shared token changes rather than the component, so the correction applies everywhere. A second check fails the build if a token exists in the stylesheet and is not documented on this page — the page claimed to be the system while carrying eleven of twenty-four.',
  },
];
