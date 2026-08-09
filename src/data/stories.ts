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
  /**
   * The credit under the embed on the homepage: the company, and what the
   * project is. Drafted — the pages never name a product, only "the Atheer
   * operations product", so the second half reuses the approved eyebrow rather
   * than inventing a product name.
   */
  credit: string;
  /** The claim. One sentence, first person. This is the 15-second read. */
  claim: string;
  /** What it was. The 30-second read. */
  outcome: string;
  artifacts: { label: string; href?: string; needs?: string }[];
  /** true where the claim/outcome are words I wrote, not Tyler-approved copy */
  draft?: boolean;
};

export const stories: Story[] = [
  {
    num: '01',
    slug: '/alucify',
    eyebrow: 'Codebase intelligence',
    credit: 'Alucify — codebase intelligence',
    claim: 'I designed a control layer for agentic software development.',
    outcome:
      'Agents write code faster than teams can absorb it. I designed the surfaces that show what the system knows, what it inferred, and where a person still has to decide.',
    /*
     * No link to alucify.ai from here. The public site still runs the company's
     * earlier fixed-price-delivery positioning, which contradicts the case study
     * this card opens. Inside the story the disclosure sits beside it and says
     * so; on a card there is no room for that context.
     */
    artifacts: [
      { label: 'Product', href: 'https://alucify-screens.fly.dev/#/dashboard' },
      { label: 'Figma', href: 'https://www.figma.com/design/N7vnpK60xZfzI8luYKbevA/Alucify-Patterns?node-id=0-1' },
      { label: 'Story', href: '/alucify' },
    ],
    draft: true,
  },
  {
    num: '02',
    slug: '/ops-manager',
    eyebrow: 'Frontline operations',
    credit: 'Atheer — frontline operations',
    claim: 'I designed an enterprise operations product and the system to build it.',
    outcome:
      'Technicians see the job in front of them, what comes next, and what could block it. I built the product and the component system behind it, so the team could keep building without me.',
    artifacts: [
      { label: 'Product', href: 'https://atheer-next.fly.dev/' },
      { label: 'Library', href: 'https://atheer-next-storybook.fly.dev/' },
      { label: 'Story', href: '/ops-manager' },
    ],
    /* Tyler wrote the claim and the summary. */
  },
  {
    num: '03',
    slug: '/review-loop',
    eyebrow: 'Human-in-the-loop design',
    credit: 'Atheer — human-in-the-loop design',
    claim: 'I own the collaboration between stakeholders and agents.',
    outcome:
      'I turned 48 stakeholder notes\u2014some vague, some inaccurate\u2014into clear requirements an agent could act on. That meant checking each against the product, separating the problem from the proposed solution, and deciding what belonged in the next build.',
    artifacts: [
      { label: 'Review build', href: 'https://metin-oasis-v6.fly.dev/' },
      { label: 'Outcome build', href: 'https://metin-oasis-v7.fly.dev/' },
      { label: 'Story', href: '/review-loop' },
    ],
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
export const storyEyebrow = (slug: string) => storyBySlug(slug)?.eyebrow ?? '';

/**
 * The page's H1 — the same sentence its homepage card leads with.
 *
 * One rule for every title on this site: a first-person claim, no terminal
 * punctuation. The card keeps its full stop because it sits in a paragraph of
 * cards; a headline does not need one, and half of them having one was most of
 * what made the set look unplanned.
 */
export const storyTitle = (slug: string) => (storyBySlug(slug)?.claim ?? '').replace(/\.$/, '');

/**
 * Footer links: the numbered eyebrow, exactly as the story page wears it, so a
 * reader arriving at the footer sees the same name and the same position in the
 * series that the page itself shows.
 */
export const storyLinks = stories.map((s) => [s.slug, s.eyebrow] as [string, string]);
