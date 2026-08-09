/**
 * Six essays, three groups.
 *
 * This is the only definition of that taxonomy. There were two: this file said
 * Instruments and Teams, while /essays said Planning, Standards and People, so
 * every essay page was labelled from a scheme the index had replaced. Same
 * class of drift as five stylesheets each implementing one zebra rule.
 *
 * `label` is what a reader sees in a rail or an eyebrow. `statement` is the
 * first-person heading the index uses. `frame` is the one-line description in
 * the index's opening row. All three were being written in two places; a rail
 * that says "Planning" while the index says something else is the same drift
 * this file exists to stop.
 *
 * Three earlier essays were merged into these; their URLs redirect in
 * astro.config.mjs and are checked by `npm run links`.
 */
export type EssayGroup = {
  label: string;
  statement: string;
  frame: string;
  slugs: string[];
};

export const essayGroups: EssayGroup[] = [
  {
    label: 'Planning',
    statement: 'I put design into the decision, not just the delivery',
    frame: 'Decide what is worth building before the roadmap hardens.',
    slugs: ['how-i-translated-design-work', 'how-i-managed-ux-complexity'],
  },
  {
    label: 'Standards',
    statement: 'I made quality something other teams could rely on',
    frame: 'Keep quality consistent without me in every review.',
    slugs: ['how-i-scaled-design-efficiency', 'how-i-built-culture-around-paradox'],
  },
  {
    label: 'People',
    statement: 'I developed designers to own more than execution',
    frame: 'Grow designers who can own a problem end to end.',
    slugs: ['how-i-unlocked-team-trust', 'how-i-shaped-cross-functional-reputation'],
  },
];

export function groupForSlug(slug: string): EssayGroup | undefined {
  return essayGroups.find((g) => g.slugs.includes(slug));
}
