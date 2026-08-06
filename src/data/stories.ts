/**
 * Three stories. Not four.
 *
 * Hiring managers give the first case study 5–10 minutes, the second 3–5, the
 * third 1–2. A fourth is not read. So the homepage offers exactly three choices,
 * ordered by relevance to the audience rather than by how easy each is to prove —
 * the proof strip in the hero does the credibility work before any story is read.
 *
 * Each story absorbs the leadership essays whose substance it demonstrates. The
 * essays still live at their original URLs behind /essays.
 */

export type Story = {
  num: string;
  slug: string;
  eyebrow: string;
  /** The claim. One sentence, first person. This is the 15-second read. */
  claim: string;
  /** What it was. The 30-second read. */
  outcome: string;
  leadership: string[];
  artifacts: { label: string; href?: string; live?: boolean; needs?: string }[];
  /** true where the claim/outcome are words I wrote, not Tyler-approved copy */
  draft?: boolean;
};

export const stories: Story[] = [
  {
    num: '01',
    slug: '/alucify',
    eyebrow: 'AI-Native Product',
    claim: 'I design tools for people accountable for work an agent did.',
    outcome:
      'A code-intelligence product whose landing metrics are blast radius, agent hours and token cost — twenty documented states, from first run to tenured use, including the ones usually left to engineering to improvise.',
    leadership: ['how-i-managed-ux-complexity', 'how-i-infused-design-roles-with-product-thinking'],
    artifacts: [{ label: 'See the work', href: '/alucify' }],
    draft: true,
  },
  {
    num: '02',
    slug: '/ops-manager',
    eyebrow: 'Systems + Practice',
    claim: 'I build the design systems that machines generate from.',
    outcome:
      'A design system is no longer a library people import from — it is the constraint on what an agent is allowed to produce. Ninety-six components and fifty-one stories, governed by a 1,048-line operating spec, with the product and its library deployed and open right now.',
    leadership: ['how-i-scaled-design-efficiency', 'how-i-built-culture-around-paradox'],
    artifacts: [
      { label: 'Open the product', href: 'https://atheer-next.fly.dev/', live: true },
      { label: 'Component library', href: 'https://atheer-next-storybook.fly.dev/', live: true },
      { label: 'Read the story', href: '/ops-manager' },
    ],
    draft: true,
  },
  {
    num: '03',
    slug: '/review-loop',
    eyebrow: 'How I Work',
    claim: 'I put stakeholders in front of code an agent wrote, and kept the receipts.',
    outcome:
      'Forty-eight itemised notes taken against a running build, and the diff showing which half was acted on and which was declined. When generation is cheap, review is the constraint — and reviewing code instead of mockups is what makes the decision auditable at all.',
    leadership: ['how-i-shaped-cross-functional-reputation', 'how-i-translated-design-work'],
    artifacts: [{ label: 'Read the story', href: '/review-loop' }],
    draft: true,
  },
];

export const storyBySlug = (slug: string) => stories.find((s) => s.slug === slug);
