/**
 * Seven essays, two groups.
 *
 * Grouped by what each one *is* — an instrument — rather than by leadership
 * virtue. Every essay here describes the same move: take a judgment that lived
 * in someone's head and make it explicit, portable and enforceable. That is the
 * same move the operating spec makes, a decade later, with a machine on the
 * other end of it.
 *
 * Three essays were merged into one: they described a single system three times
 * and shared identical sections on the live site. Both retired URLs redirect.
 */
export type EssayGroup = {
  eyebrow: string;
  title: string;
  blurb: string;
  slugs: string[];
};

export const essayGroups: EssayGroup[] = [
  {
    eyebrow: 'Instruments',
    title: 'Making judgment explicit',
    blurb:
      'A decision rule, written down, that outlives the person who made it. Scoring models, budgets, thresholds, systems.',
    slugs: [
      'how-i-translated-design-work',
      'how-i-managed-ux-complexity',
      'how-i-scaled-design-efficiency',
      'how-i-built-culture-around-paradox',
    ],
  },
  {
    eyebrow: 'Teams',
    title: 'Changing how the work gets done',
    blurb:
      'Structure, roles and growth paths rebuilt so the standard holds without anyone enforcing it.',
    slugs: [
      'how-i-unlocked-team-trust',
      'how-i-shaped-cross-functional-reputation',
      'how-i-infused-design-roles-with-product-thinking',
    ],
  },
];

export function groupForSlug(slug: string): EssayGroup | undefined {
  return essayGroups.find((g) => g.slugs.includes(slug));
}
