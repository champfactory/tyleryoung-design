# tyleryoung.design

Source for Tyler Young's portfolio. Static site, no client JavaScript on content
pages, deployed as plain HTML.

The site links here from its colophon, so this repo is part of what it is arguing:
a design system with the checks that enforce it, rather than a set of screenshots
of one.

## Running it

```
npm install
npm run dev        # http://localhost:4321
npm run build      # static output to dist/
```

## The checks

Two audits, both written for this project, both runnable on their own.

```
npm run contrast   # every color pair in the system, at the size it is used
npm run needs      # every unfinished slot in the built HTML
npm run audit      # contrast, then build, then needs
```

**`contrast`** reads `src/data/palette.mjs` and checks each declared pair against
the threshold for the smallest size it actually appears at — 4.5:1 for text,
lower for non-informational hairlines. It exits non-zero on failure. It failed
twice during the initial build; two tokens were darkened until it passed. The
`/colophon` page renders its output from the same module, so the page cannot
drift from the check.

**`needs`** scans built HTML for `data-needs` and `data-draft` markers and reports
where each one landed, grouped by route. The site marks its own gaps in the
markup — red for a missing asset or an open decision, a dotted underline for copy
that hasn't been approved — so the report is derived from the build rather than
maintained by hand. `npm run needs -- --strict` fails while any remain, which is
the gate on shipping.

## Layout

```
content/          prose as markdown — essays, TL;DR (edited without touching components)
src/data/         design tokens, essay groupings, site constants
src/components/   Receipt, WorkCard, Needs, Draft, Nav, Footer, CrossLinks
src/layouts/      BaseLayout, DocumentLayout (essays and case studies share one anatomy)
src/pages/        routes
scripts/          the audits, plus the extractors used to port the previous site
```

`src/components/Receipt.astro` is the one bespoke treatment: a dark panel pairing
an instruction with what came back. Built once, reused by every technical case
study.

## Status

In progress. The site is deliberately full of visible placeholders — assets that
don't exist yet and copy awaiting approval. `npm run needs` lists them. Nothing is
filled with plausible-looking substitute content.
