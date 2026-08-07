/**
 * Three stories. Not four.
 *
 * Hiring managers give the first case study 5–10 minutes, the second 3–5, the
 * third 1–2. A fourth is not read. So the homepage offers exactly three choices,
 * ordered by relevance to the audience rather than by how easy each is to prove —
 * the proof strip in the hero does the credibility work before any story is read.
 *
 * The essays live behind /essays, at their original URLs. Each story used to
 * carry a strand linking out to the two essays it supposedly echoed; the links
 * were real but the connections were stretched, so they are gone.
 */

export type Story = {
  num: string;
  slug: string;
  eyebrow: string;
  /** The claim. One sentence, first person. This is the 15-second read. */
  claim: string;
  /** What it was. The 30-second read. */
  outcome: string;
  artifacts: { label: string; href?: string; live?: boolean; needs?: string }[];
  /** true where the claim/outcome are words I wrote, not Tyler-approved copy */
  draft?: boolean;
};

export const stories: Story[] = [
  {
    num: '01',
    slug: '/alucify',
    eyebrow: 'AI-Native Product',
    claim: 'I design tools for people who have to review code an AI wrote.',
    outcome:
      'A code intelligence product. Its landing screen reports blast radius, agent hours and token cost. Twenty screens, from first run to daily use, including the empty and half-finished ones most tools leave to engineering.',
    artifacts: [{ label: 'See the work', href: '/alucify' }],
    draft: true,
  },
  {
    num: '02',
    slug: '/ops-manager',
    eyebrow: 'Systems + Practice',
    claim: 'I build the design systems AI generates from.',
    outcome:
      '96 components and 51 stories, built under a 1,048-line spec that sets what the agent is allowed to produce. The product and its component library are both running right now — open either one.',
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
    eyebrow: 'Human-in-the-loop design',
    claim: 'I run stakeholder reviews on running code, not mockups.',
    outcome:
      'A stakeholder reviewed a working app and wrote 48 notes. I decided which ones to act on, fed them into Claude Code, and shipped a new version. Both versions are still running, and the diff shows what changed.',
    artifacts: [{ label: 'Read the story', href: '/review-loop' }],
    draft: true,
  },
];

export const storyBySlug = (slug: string) => stories.find((s) => s.slug === slug);

/**
 * The eyebrow a story page wears, e.g. "01 · Systems + Practice".
 *
 * Every place a story is named — the homepage card, the page's own eyebrow, the
 * footer link — reads from this file. They had drifted into five different
 * names for the same three pieces of work, and two pages were both numbered 01.
 */
export const storyEyebrow = (slug: string) => {
  const s = storyBySlug(slug);
  return s ? `${s.num} · ${s.eyebrow}` : '';
};

/**
 * The page's H1 — the same sentence its homepage card leads with.
 *
 * One rule for every title on this site: a first-person claim, no terminal
 * punctuation. The card keeps its full stop because it sits in a paragraph of
 * cards; a headline does not need one, and half of them having one was most of
 * what made the set look unplanned.
 */
export const storyTitle = (slug: string) => (storyBySlug(slug)?.claim ?? '').replace(/\.$/, '');

/** Footer links: the same short name the story is known by everywhere else. */
export const storyLinks = stories.map((s) => [s.slug, s.eyebrow] as [string, string]);
