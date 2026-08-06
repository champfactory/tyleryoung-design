/**
 * The four leadership-essay groups, exactly as they exist on the live site.
 *
 * Source casing is normalized to sentence case here. The live site's casing is
 * inconsistent ("designing competitive Advantage", "Winning in creative ways"),
 * but the CSS applies `text-transform: uppercase` to both the eyebrow and the
 * group title — so the rendered output is identical either way. See tokens.md §5.
 */
export type EssayGroup = {
  eyebrow: string;
  title: string;
  color: string;
  slugs: string[];
};

export const essayGroups: EssayGroup[] = [
  {
    eyebrow: 'Strategic influence',
    title: 'Designing competitive advantage',
    color: 'var(--color-essay-1)',
    slugs: [
      'how-i-aligned-formative-vision',
      'how-i-built-a-shared-scoring-model',
      'how-i-translated-design-work',
    ],
  },
  {
    eyebrow: 'Leadership approach',
    title: 'Winning in creative ways',
    color: 'var(--color-essay-2)',
    slugs: ['how-i-built-culture-around-paradox', 'how-i-unlocked-team-trust'],
  },
  {
    eyebrow: 'Cross-functional partnership',
    title: 'Bridging design and product thinking',
    color: 'var(--color-essay-3)',
    slugs: [
      'how-i-scaled-design-efficiency',
      'how-i-shaped-cross-functional-reputation',
    ],
  },
  {
    eyebrow: 'Systemic thinking',
    title: 'Building systems that scale',
    color: 'var(--color-essay-4)',
    slugs: [
      'how-i-infused-design-roles-with-product-thinking',
      'how-i-managed-ux-complexity',
    ],
  },
];

export function groupForSlug(slug: string): EssayGroup | undefined {
  return essayGroups.find((g) => g.slugs.includes(slug));
}
