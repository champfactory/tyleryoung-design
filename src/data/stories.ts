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
  /**
   * The phrases the card sets in full ink while the rest of the passage stays
   * quiet. With no headline above it, this is what carries the structure: a
   * reader skimming only the dark words should still land on the claim.
   * Short noun phrases — a bolded clause is just a second paragraph.
   */
  emphasis?: string[];
  artifacts: { label: string; href?: string; needs?: string }[];
  /** true where the claim/outcome are words I wrote, not Tyler-approved copy */
  draft?: boolean;
};

export const stories: Story[] = [
  {
    num: '01',
    slug: '/alucify',
    eyebrow: 'Codebase intelligence',
    claim: 'I designed the control layer for agentic software development.',
    emphasis: [
      'control layer',
      'agentic software development',
      'brownfield codebase',
      'human judgement',
      'Twenty screens across four connected flows',
    ],
   
    outcome:
      'Agents generate faster than teams can specify and absorb change. Alucify models what a brownfield codebase means, then shows where context is missing, what a change would reach, and where human judgement is still required. Twenty screens across four connected flows.',
    /*
     * No link to alucify.ai from here. The public site still runs the company's
     * earlier fixed-price-delivery positioning, which contradicts the case study
     * this card opens. Inside the story the disclosure sits beside it and says
     * so; on a card there is no room for that context.
     */
    artifacts: [
      { label: 'Screens', href: 'https://alucify-screens.fly.dev/#/dashboard' },
      { label: 'Figma', href: 'https://www.figma.com/design/N7vnpK60xZfzI8luYKbevA/Alucify-Patterns?node-id=0-1' },
      { label: 'Story', href: '/alucify' },
    ],
    draft: true,
  },
  {
    num: '02',
    slug: '/ops-manager',
    eyebrow: 'Frontline operations',
    claim: 'I design operations software for work already in motion.',
    emphasis: [
      'operations software',
      'already in motion',
      '69 component states across 11 families',
      'not just the clean screen',
    ],
   
    outcome:
      'A data-dense operations product built around the job already underway, and the component system behind it. The published library documents 69 component states across 11 families plus 6 token references — the empty, dense and missing-content ones, not just the clean screen.',
    artifacts: [
      { label: 'Product', href: 'https://atheer-next.fly.dev/' },
      { label: 'Library', href: 'https://atheer-next-storybook.fly.dev/' },
      { label: 'Story', href: '/ops-manager' },
    ],
    draft: true,
  },
  {
    num: '03',
    slug: '/review-loop',
    eyebrow: 'Human-in-the-loop design',
    claim: 'I own the collaboration between stakeholders and agents.',
    emphasis: [
      'stakeholders and agents',
      '48 notes',
      'what each note actually meant',
    ],
   
    outcome:
      'A stakeholder reviewed a working app and returned 48 notes. Claude Code made responding fast; it did not make the notes unambiguous — one asked me to rename wording that was not on the screen. Deciding what each note actually meant was the work. Both versions are still running.',
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

/**
 * Split a passage into runs, marking the ones that should be set in full ink.
 *
 * The titleless card has no headline to carry the claim, so the emphasis does
 * it: a reader who skims only the dark words should still land on what the work
 * was. Longest phrases match first, so a phrase that contains another does not
 * get chopped in half by it.
 */
export function emphasise(text: string, phrases: string[] = []) {
  if (phrases.length === 0) return [{ text, on: false }];
  const escaped = [...phrases]
    .sort((a, b) => b.length - a.length)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'g');
  return text
    .split(re)
    .filter((run) => run !== '')
    .map((run) => ({ text: run, on: phrases.includes(run) }));
}
