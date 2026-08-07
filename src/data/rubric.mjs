/**
 * The standard this site is held to.
 *
 * Written before the redesign and used to settle arguments during it. It lives
 * here rather than in a document because a standard nobody can see is a
 * preference.
 *
 * Counts are not restated here. They drifted once — the page claimed 17 colour
 * pairs when there were 19, and 9 external artifacts when there were 12 — which
 * is the exact failure this page argues against. Anything countable is either
 * derived at render time from the same source the script reads, or left out.
 *
 * Each requirement names its verifier. `AUTOMATIC` means a script in this repo
 * fails the build; `HUMAN REVIEW` means a person reads it. The page draws that
 * line explicitly, because the two are not the same promise.
 */

export const principles = [
  {
    principle: 'A hiring manager can place me in the first minute',
    detail:
      'Time constrained, highly trained, hard to impress.',
  },
  {
    principle: 'Every important claim has evidence',
    detail:
      'A working product, a component library, a design artifact, or a visible result should sit close to the claim it supports.',
  },
  {
    principle: 'Leadership reads as capability',
    detail:
      'The site should show how I establish direction, improve decisions, and raise the quality of other people’s work — not simply state the title I have held.',
  },
  {
    principle: 'The site demonstrates the practice it describes',
    detail:
      'I claim that I direct AI agents to produce production code. The portfolio should provide evidence of that practice in its own construction.',
  },
];

/** Paired, so each row is one decision that changed rather than two lists. */
export const comparison = [
  ['Leadership claims came first', 'Running work comes first'],
  ['Projects linked mostly to decks', 'Claims sit beside inspectable evidence'],
  ['Evidence appeared late', 'Three projects establish the story immediately'],
  ['The hero pushed work below the fold', 'Leadership writing follows the product work'],
  ['Accessibility depended on manual attention', 'Accessibility decisions are part of the build'],
];

const AUTO = 'AUTOMATIC';
const HUMAN = 'HUMAN REVIEW';

export const requirements = [
  {
    req: 'Every deployment and design file the site points at still answers.',
    mode: AUTO,
    how: 'npm run evidence · every external artifact in the built output',
  },
  {
    req: 'Every colour pair meets WCAG AA at the smallest size where it appears.',
    mode: AUTO,
    how: 'npm run contrast · {pairs} pairs computed from the design tokens',
  },
  {
    req: 'No unfinished slot or unapproved line ships unnoticed.',
    mode: AUTO,
    how: 'npm run needs · derived from the built HTML',
  },
  {
    req: 'Every URL preserved from the previous portfolio still resolves.',
    mode: AUTO,
    how: 'npm run links · every URL preserved from the previous site',
  },
  {
    req: 'No internal link returns a 404 or points to a missing anchor.',
    mode: AUTO,
    how: 'npm run links · every internal href in the built output',
  },
  {
    req: 'Content pages ship without client-side JavaScript.',
    mode: AUTO,
    how: 'Verified from the static build output',
  },
  {
    req: 'Every image has alt text, and no two images share it.',
    mode: AUTO,
    how: 'npm run alt · the second rule is what catches a description copied from the image above it',
  },
  {
    req: 'Every page has one H1 and a logical heading sequence.',
    mode: HUMAN,
    how: 'Heading structure is reviewed page by page',
  },
  {
    req: 'The first line of every page lands in the same place.',
    mode: HUMAN,
    how: 'Alignment is checked across routes and breakpoints',
  },
];

export const automatic = requirements.filter((r) => r.mode === AUTO).length;

/** The four pairs shown before the full table is expanded. */
export const PREVIEW_PAIRS = [
  ['ink', 'paper'],
  ['ink-2', 'paper'],
  ['signal', 'paper'],
  ['ink-2', 'header'],
];
