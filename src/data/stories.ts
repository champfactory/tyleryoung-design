/**
 * Three stories. Not four.
 *
 * Hiring managers give the first case study 5–10 minutes, the second 3–5, the
 * third 1–2. A fourth is not read. So the homepage offers exactly three choices,
 * ordered by what this audience screens for, and everything else on the site sits
 * behind a single quiet link.
 *
 * Each story absorbs the leadership essays that belong to it (see `leadership`).
 * The essays still live at their original URLs — they're just no longer a
 * competing top-level section.
 */

export type Story = {
  num: string;
  slug: string;
  eyebrow: string;
  /** The claim. One sentence, verb-first. This is the 15-second read. */
  claim: string;
  /** What changed. The 30-second read. */
  outcome: string;
  /** Essays whose substance is folded into this story. */
  leadership: string[];
  artifacts: { label: string; href?: string; live?: boolean; needs?: string }[];
  /** true where the claim/outcome are words I wrote, not Tyler-approved copy */
  draft?: boolean;
};

export const stories: Story[] = [
  {
    num: '01',
    slug: '/atheer-design-pipeline',
    eyebrow: 'AI-Native Practice',
    claim:
      'I replaced an agency handoff process with a pipeline that returns working code.',
    outcome:
      'Paper to Claude Code to React, Tailwind and Storybook — with the design system as the constraint on what could be generated. Ninety-six components, fifty-one Storybook stories, and six rounds of review on running software.',
    leadership: ['how-i-built-culture-around-paradox', 'how-i-translated-design-work'],
    artifacts: [
      { label: 'Component library', href: 'https://atheer-next-storybook.fly.dev/', live: true },
      { label: 'Read the story', href: '/atheer-design-pipeline' },
    ],
    draft: true,
  },
  {
    num: '02',
    slug: '/ops-manager',
    eyebrow: 'Data-Dense B2B',
    claim: 'I design dense operational software, and you can open it right now.',
    outcome:
      'A working surface for people who monitor field operations all day — status carried by shape rather than colour, and a sidebar that surfaces what changed instead of waiting to be clicked.',
    leadership: ['how-i-managed-ux-complexity', 'how-i-infused-design-roles-with-product-thinking'],
    artifacts: [
      { label: 'Open the product', href: 'https://atheer-next.fly.dev/', live: true },
      { label: 'Component library', href: 'https://atheer-next-storybook.fly.dev/', live: true },
      { label: 'Read the story', href: '/ops-manager' },
    ],
    draft: true,
  },
  {
    num: '03',
    slug: '/design-at-scale',
    eyebrow: 'Organisational Scale',
    claim: 'I have run this at the scale of a company, not a sprint.',
    outcome:
      'A global design system across five business functions and more than 200 components, adopted through usefulness rather than mandate — and design repositioned from execution to strategy.',
    leadership: ['how-i-scaled-design-efficiency', 'how-i-shaped-cross-functional-reputation'],
    artifacts: [{ label: 'Read the story', href: '/design-at-scale' }],
    draft: true,
  },
];

export const storyBySlug = (slug: string) => stories.find((s) => s.slug === slug);
