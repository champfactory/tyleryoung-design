# tokens.md — extracted from tyleryoung.design (live Framer site)

Status: **DRAFT — decisions 1–2 resolved by Tyler 2026-08-06; 3–6 still open** (per `docs/04-style-reference.md` step 4).

**Resolved:**
- Stack: **Astro + React islands + Tailwind**, static output, MDX for prose.
- Contrast: **fix both failures** — bio grey darkened, CTA red darkened. See §1.
- "Building with AI" tier: **distinct neutral, receipt-led treatment** — the blue→violet
  ramp stays reserved for leadership essay groups.

Method: fetched the live HTML for the homepage, `/tldr`, and all 9 essay pages, then read
the inlined Framer CSS directly (`<style>` blocks). Every value below is a real declared
value from the live site, not an estimate. Rendered-pixel checks against a browser
screenshot have **not** been done — flagged where it matters.

Source archive: `reference/live-site/*.html` (11 pages, fetched 2026-08-06).

---

## 1. Color

Framer defines exactly five named color tokens. Everything else on the site is a raw hex.

| Proposed name | Value | Framer token | Where it's used |
|---|---|---|---|
| `bg` | `#ffffff` | `36c58b26` | Page background, all sections |
| `ink` | `#474747` | — | **The workhorse.** All headings, body copy, essay text, section headings |
| `ink-strong` | `#2b2b2b` | `bdc8b68e` | TL;DR body copy, default rich-text color |
| `ink-muted` | `#6b6b6b` | — | Project-card descriptions |
| `ink-subtle` | `#a1a1a1` | — | Homepage bio paragraph |
| `ink-faint` | `#b0b0b0` | `0313972a` | Current-page link state |
| `rule` | `#b8b8b8` | `1d0c13ac` | Defined but no usage found in fetched pages |
| `accent-cta` | `#ff0000` | `b06c2a4c` | Pill buttons ("14 slide deck") — **pure red** |
| `link` | `#0099ff` | — | Inline links inside rich text, underlined |

### Essay category tiles — a four-step blue→violet ramp

Each of the four essay groups is a large solid color block. This is the site's only
real chromatic system:

| Group | Color |
|---|---|
| Strategic influence — "designing competitive Advantage" | `#3db5ff` |
| Leadership approach — "Winning in creative ways" | `#428eff` |
| Cross-functional partnership — "Bridging Design and Product Thinking" | `#5260ff` |
| Systemic thinking — "building systems that scale" | `#8352ff` |

**Decision needed:** the new "Building with AI" tier will want a fifth step, or a
deliberately different treatment so it reads as a different tier rather than a fifth
essay category. Recommendation: do **not** extend the ramp — give the AI tier the
neutral/receipt treatment described in `docs/04-style-reference.md` §Design latitude,
so color continues to mean "leadership essay group."

### Contrast notes (WCAG, against `#ffffff`)

- `#474747` — 8.6:1. Fine.
- `#6b6b6b` — 5.2:1. Fine for body.
- `#a1a1a1` (bio paragraph) — **2.6:1. Fails AA for normal text**, and it's at 17px on
  mobile. This is the single worst accessibility defect found. Recommend darkening the
  bio to `#6b6b6b` or `#474747` in the rebuild. Needs Tyler's call.
- White on `#ff0000` — 4.0:1. **Fails AA for normal text**; the button label is 14px.
  Passes only if treated as large text, which it isn't. Recommend a slightly darker red
  (≈`#d90000` gives 5.3:1) or a larger label. Needs Tyler's call.

### A third contrast problem — the essay tiles (found after the first two; not yet decided)

The four essay tiles put white text on the ramp colors. Measured:

| Tile | White-on-color | 56px title (needs 3:1) | 18px eyebrow (needs 4.5:1) |
|---|---|---|---|
| `#3db5ff` Strategic influence | **2.3:1** | ❌ fails | ❌ fails |
| `#428eff` Leadership approach | **3.2:1** | ✅ passes | ❌ fails |
| `#5260ff` Cross-functional | 4.7:1 | ✅ | ✅ |
| `#8352ff` Systemic thinking | 4.6:1 | ✅ | ✅ |

And the eyebrow is rendered at **80% opacity**, which pushes all four lower still.

This one is harder than the other two — darkening the first two steps changes the
ramp's character, which is a real design decision, not a bug fix. Options: (a) darken
steps 1–2 until they clear, (b) drop the eyebrow opacity to 100% and darken only step 1,
(c) leave it. **Not implemented — waiting on Tyler.** Only affects the homepage (Phase 1).

---

## 2. Typography

**One typeface: Inter.** Weights in use: 400, 500, 700, 800, 900. No display/serif
pairing. OpenType features `cv03 cv04 cv09 cv11 blwf` are on for some headings —
worth keeping for the alternate glyph shapes.

Note the site leans on **800/900 (ExtraBold/Black)** far more than typical — that heaviness
is a real part of its voice, not an accident.

### Type scale (desktop / mobile where different)

| Role | Size | Weight | Line-height | Tracking | Transform | Color |
|---|---|---|---|---|---|---|
| Nav wordmark | 14px | 500 | — | — | uppercase | `#474747` |
| Homepage bio paragraph | 24px / 17px | 800 | 150% | -0.5px | — | `#a1a1a1` |
| Card eyebrow ("Execution Impact") | 14px | 800 | — | — | uppercase | `#474747` |
| Card title (`h2`, "Fast Find") | 40px / 26px | 900 | — | — | — | `#474747` |
| Card description | 18px / 17px | 700 | 28px | -0.5px | — | `#6b6b6b` |
| Pill button label | 14px | 900 | — | — | uppercase | `#ffffff` |
| Essay-tile eyebrow ("Strategic influence") | 18px | 800 | — | — | uppercase | `#ffffff` @ 80% opacity |
| Essay-tile title (`h2`) | 56px / 36px | 900 | — | — | — | `#ffffff` |
| Essay link in tile | 28px / 20px | 800 | 140% | -0.5px | — | `#474747` |
| Section heading ("Executive References") | 32px | 900 | 120% | 0 | uppercase | `#474747` |
| Reference name (`h4`) | 22px | 700 | 120% | 0 | — | `#474747` |
| Reference title (`h5`) | 16px | 500 | 120% | 0 | — | `#474747` |
| Reference quote (`p`) | 18px | 400 | 140% | -0.01em | — | `#474747` |
| **Essay `h1`** | 40px | 900 | 100% | — | uppercase | `#474747` |
| Essay metadata label | 19px | 700 | 1.2em | 0 | — | `#474747` |
| Essay metadata value | 19px | 400 | 1.2em | 0 | — | `#474747` |
| Essay section `h2` | 32px | 900 | 120% | 0 | uppercase | `#474747` |
| Essay body `p` | 22px | 400 | 150% | — | — | `#474747` |
| Essay cross-link | 23px | 700 | 150% | — | — | `#474747` |
| TL;DR `h1` | 40px | 900 | 100% | — | uppercase | `#474747` |
| TL;DR summary lines | 22px | 700 | 34px | — | — | `#2b2b2b` |
| TL;DR body | 22px | 400 | 34px | — | — | `#2b2b2b` |

**Observation worth Tyler's attention:** essay body copy is 22px/150% — genuinely large,
editorial. The rebuild should preserve that; it's a big part of why the essays read well.

### Link treatment

- Nav / cross-links: no underline, color `#474747`, hover `#474747`, current `#b0b0b0`.
- Inline rich-text links: `#0099ff`, underlined.
- No visible focus ring is defined anywhere. **The rebuild must add one** (accessibility
  floor in `CLAUDE.md`).

---

## 3. Layout & spacing

| Token | Value |
|---|---|
| Content max-width | `1200px` |
| Breakpoints | `≤809px` (mobile) · `810–1199px` (tablet) · `≥1200px` (desktop) |
| Mobile design width | `390px` (Framer's mobile frame) |
| Essay page horizontal padding | `180px` desktop → `40px` tablet → `20–30px` mobile |
| Essay section vertical rhythm | `88px` top block, `64px` between sections, `60px` body blocks |
| Homepage section padding | `30px 60px 0 30px` desktop → `30px 30px 0` tablet → `0 0 88px` mobile |
| Essay tile size | `510 × 480px`, aspect-ratio 1.0625, `50px` padding, `16px` internal gap |
| Essay tile (tablet) | `375 × 353px` |
| Essay tile (mobile) | full width, `390px` tall, `40px` padding |
| Common gaps | `8 · 10 · 16 · 20 · 24 · 30 · 40 · 88px` |
| Border radius | **none anywhere except the pill button** (`40px`) |
| Shadows | **none** |
| Pill button | `padding: 10px 22px`, `gap: 10px`, `radius: 40px` |

Spacing is not on a strict 4/8 grid (30, 50, 60, 88, 180 all appear). Recommendation:
normalize to a 4px scale in Tailwind and accept ±2px drift rather than hard-coding
Framer's arbitrary values. **This is a judgment call — flagging it rather than deciding it.**

---

## 4. Defects found in the live site (do not reproduce)

Confirmed by reading the markup:

1. **`alt="David Sabel"` on all 6 reference headshot instances.** Confirmed — the brief
   was right. The Framer layer itself is named "David Sabel", which is how it happened.
2. **9 of 19 homepage images have no `alt` attribute at all** — every project-card image.
   The brief didn't catch this one.
3. **All 6 essay-page images have no `alt` attribute.** Same.
4. **Every essay page ships `<meta name="description" content="Made with Framer">`.**
   The homepage has a real (if thin) description: "Tyler Young's personal portfolio".
5. **No `<h1>` on the homepage.** Heading order starts at `h2`. Essay pages do have an `h1`.
6. **No visible focus styles** defined anywhere.
7. **Bio paragraph at 2.6:1 contrast** — see §1.
8. **Button label white-on-red at 4.0:1** — see §1.
9. **Default Framer favicon and touch icon** are still in place.
10. **No footer exists.** The homepage ends after Executive References. The planned
    footer is genuinely new construction, not a port.

---

## 5. Discrepancies vs. the handoff docs

- `docs/02-content-inventory.md` says **ten** "How I..." essays. The live site links
  **nine**, and the doc itself lists nine slugs. Assuming nine is correct — please confirm
  nothing is missing.
- Heading casing really is inconsistent on the live site: "designing competitive Advantage",
  "Winning in creative ways", "leadership approach", "TEAM DEVELOPMENT" (TL;DR). Since the
  CSS applies `text-transform: uppercase` to most of these, **casing is invisible in the
  rendered page** — it's a Framer content artifact, not a design choice. Recommendation:
  normalize source casing to sentence case, keep the uppercase transform. Low risk.
- The three Figma deck links resolve as `figma.com/deck/...` URLs; I have not verified
  they're publicly accessible (that's on the assets checklist).

---

## 6. Proposed Tailwind theme (for review, not yet written to code)

```js
colors: {
  ink:        '#474747',
  'ink-strong':'#2b2b2b',
  'ink-muted': '#6b6b6b',
  'ink-subtle':'#a1a1a1',   // see contrast note
  'ink-faint': '#b0b0b0',
  rule:       '#b8b8b8',
  cta:        '#ff0000',    // see contrast note
  link:       '#0099ff',
  essay: { 1:'#3db5ff', 2:'#428eff', 3:'#5260ff', 4:'#8352ff' },
},
fontFamily: { sans: ['Inter var','Inter','system-ui','sans-serif'] },
maxWidth:   { content: '1200px' },
borderRadius:{ pill: '40px' },
screens:    { md: '810px', lg: '1200px' },
```

---

## 7. Open questions for Tyler

1. **Sign off on the palette as-is, or fix the two contrast failures** (bio grey, red button)?
2. **Does the "Building with AI" tier get a fifth ramp color, or a distinct neutral
   treatment?** (Recommendation: distinct neutral.)
3. **Keep the 800/900 weight-heavy voice**, or lighten headings in the rebuild?
4. **Casing:** normalize source to sentence case (rendered result unchanged)? (Recommendation: yes.)
5. **Spacing:** normalize to a 4px scale, accepting ~2px drift from the Framer values?
6. Confirm **nine** essays, not ten.
