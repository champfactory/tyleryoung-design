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
      'Figma to Claude Code to React, Tailwind and Storybook — with the design system as the constraint on what gets generated. Stakeholders reviewed running components instead of mockups.',
    leadership: ['how-i-scaled-design-efficiency', 'how-i-shaped-cross-functional-reputation'],
    artifacts: [{ label: 'Read the story', href: '/atheer-design-pipeline' }],
    draft: true,
  },
  {
    num: '02',
    slug: '/word-web',
    eyebrow: 'Shipped Product',
    claim: 'I ship products, and I make the model call myself.',
    outcome:
      'A live product built with a two-person team. Behind it, twelve models judged on quality, cost, latency and format conformance — a design decision with a per-request price attached.',
    leadership: ['how-i-built-a-shared-scoring-model', 'how-i-built-culture-around-paradox'],
    artifacts: [
      { label: 'Live product', needs: 'URL + decision to expose', live: true },
      { label: 'The evaluation', href: '/word-web' },
    ],
    draft: true,
  },
  {
    num: '03',
    slug: '/field-operations',
    eyebrow: 'Data-Dense B2B',
    claim: 'I design dense operational software people work in all day.',
    outcome:
      'Dealer-network monitoring for a technical support persona, with an AI layer answering the only question that matters on arrival: what needs my attention.',
    leadership: ['how-i-managed-ux-complexity', 'how-i-infused-design-roles-with-product-thinking'],
    artifacts: [{ label: 'Read the story', href: '/field-operations' }],
    draft: true,
  },
];

export const storyBySlug = (slug: string) => stories.find((s) => s.slug === slug);
