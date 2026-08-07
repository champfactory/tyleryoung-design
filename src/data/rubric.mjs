/**
 * The standard this site is held to.
 *
 * Written before the redesign and used to settle arguments during it. It is here
 * rather than in a doc because a standard nobody can see is a preference.
 *
 * Goals say what success looks like. Values say what will not be traded to get
 * there. Requirements are the testable form of both — and each one records
 * whether a machine checks it or a person does, because a requirement with no
 * check is an intention.
 *
 * `check` maps to a script in this repo: `contrast`, `links`, `needs`, or
 * `build` for something the build itself enforces. `null` means judgment, and
 * says so on the page rather than implying coverage that does not exist.
 */

export const goals = [
  {
    goal: 'A stranger knows what I do in ninety seconds',
    because: 'That is how long a portfolio gets, on bad wifi, between two other tabs.',
  },
  {
    goal: 'Every claim can be opened',
    because: 'A running URL settles what a screenshot only asserts.',
  },
  {
    goal: 'Leadership reads as capability, not as a demand for a title',
    because: 'The work should qualify me for the role on offer, not only the one above it.',
  },
  {
    goal: 'The site is itself evidence of the practice it describes',
    because: 'It claims I direct agents to produce production code. It should be that.',
  },
];

export const values = [
  {
    value: 'No invented facts',
    means: 'No metric, date, outcome or team size I cannot source. An empty slot ships visible before a plausible one ships quietly.',
  },
  {
    value: 'Plain words',
    means: 'Short sentences, concrete nouns. If a line needs decoding it is costing the reader time they have not got.',
  },
  {
    value: 'Evidence over assertion',
    means: 'Show the artifact, then say what it demonstrates. Never the other way round.',
  },
  {
    value: 'Accessible by default',
    means: 'Contrast, focus, alt text and heading order are part of the build, not a pass at the end.',
  },
  {
    value: 'Fast on bad wifi',
    means: 'Static output, self-hosted fonts, no third-party requests on content pages.',
  },
];

export const requirements = [
  {
    req: 'Every colour pair meets WCAG AA at the smallest size it is used',
    check: 'contrast',
    detail: '17 pairs, computed from the tokens',
  },
  {
    req: 'No unfinished slot or unapproved line ships',
    check: 'needs',
    detail: 'derived from the built HTML, not a list kept by hand',
  },
  {
    req: 'Every old essay URL still resolves',
    check: 'links',
    detail: '10 URLs from the previous site',
  },
  {
    req: 'No internal link 404s, no anchor points at a missing id',
    check: 'links',
    detail: 'every href in the built output',
  },
  {
    req: 'No client JavaScript on content pages',
    check: 'build',
    detail: 'static output; count the script tags',
  },
  {
    req: 'Real alt text on every image, describing that image',
    check: null,
    detail: 'a person reads each one',
  },
  {
    req: 'One h1 per page, headings in order, no skipped levels',
    check: null,
    detail: 'a person reads each one',
  },
  {
    req: 'The first line of every page lands in the same place',
    check: null,
    detail: 'measured by hand when it drifts',
  },
];

export const checked = requirements.filter((r) => r.check).length;
