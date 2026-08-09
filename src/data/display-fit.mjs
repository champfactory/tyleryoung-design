/**
 * Fits a page headline to its measure.
 *
 * Every document H1 wears one style. That was already true, and it was the
 * problem: one *size* applied to titles of 16 and 61 characters produces a
 * block that spans the column in one case and stops two-thirds of the way
 * across in the other. The style was shared; the result was not.
 *
 * So the size is derived from the text instead of fixed. We know what each
 * character costs — CHAR_EM below was measured from Archivo Variable at the
 * weight the display style actually uses — so we can break the line greedily,
 * exactly as the browser will, and solve for the largest size whose longest
 * line still fills the measure.
 *
 * The answer comes back in container-query units, as a fraction of the measure
 * rather than a pixel size. That matters: the wrap points are then identical at
 * every viewport, so a headline composed as two full lines on a desktop is
 * still two full lines at 390px. One rule, one composition, any width.
 */

/**
 * Advance width per character, in em, measured at weight 620 from the font the
 * site actually renders in. These were Archivo's; when the stack moved to the
 * platform UI face every headline overflowed, because the fitter was solving
 * with the wrong widths.
 */
const CHAR_EM = {" ": 0.19971,"!": 0.30273,"\"": 0.44141,"#": 0.62939,"$": 0.63574,"%": 0.86816,"&": 0.69287,"'": 0.26563,"(": 0.36572,")": 0.36572,"*": 0.43604,"+": 0.63574,",": 0.23389,"-": 0.4375,".": 0.23389,"/": 0.29639,"0": 0.64258,"1": 0.47021,"2": 0.59326,"3": 0.61963,"4": 0.63623,"5": 0.61426,"6": 0.64258,"7": 0.56543,"8": 0.63574,"9": 0.64258,":": 0.23389,";": 0.23389,"<": 0.63574,"=": 0.63574,">": 0.63574,"?": 0.52197,"@": 0.88379,"A": 0.67676,"B": 0.63037,"C": 0.70508,"D": 0.69434,"E": 0.56738,"F": 0.54248,"G": 0.72119,"H": 0.72119,"I": 0.25391,"J": 0.54102,"K": 0.63916,"L": 0.53809,"M": 0.85303,"N": 0.71045,"O": 0.74707,"P": 0.60693,"Q": 0.74658,"R": 0.62939,"S": 0.62109,"T": 0.59619,"U": 0.70459,"V": 0.66553,"W": 0.9541,"X": 0.67188,"Y": 0.65088,"Z": 0.62695,"[": 0.36572,"\\": 0.29639,"]": 0.36572,"^": 0.63574,"_": 0.56299,"`": 0.5,"a": 0.53516,"b": 0.58545,"c": 0.5332,"d": 0.58447,"e": 0.54346,"f": 0.3418,"g": 0.58105,"h": 0.57227,"i": 0.23145,"j": 0.23096,"k": 0.52393,"l": 0.23193,"m": 0.84717,"n": 0.56299,"o": 0.56152,"p": 0.58154,"q": 0.58105,"r": 0.34912,"s": 0.50146,"t": 0.34082,"u": 0.56299,"v": 0.51611,"w": 0.77002,"x": 0.51172,"y": 0.5249,"z": 0.49512,"{": 0.36572,"|": 0.23486,"}": 0.36572,"~": 0.63574,"—": 0.85303,"‘": 0.23389,"’": 0.23389,"“": 0.40918,"”": 0.40918};

/** Average of the measured set — used for anything not in the table. */
const FALLBACK_EM = 0.55;

/** `.display` sets letter-spacing: -0.025em, applied after every character. */
const TRACKING_EM = -0.025;

/** Below this the type is too small to read as a headline; wrap more instead. */
const FLOOR_PX = 30;

/**
 * The largest a headline may be at the reference measure. This is the one
 * number that sets the page's voice, and it is chosen, not derived: 110px is
 * about where a two-line headline stops being a headline and starts being a
 * poster. It selects the line count — the biggest size at or under it wins —
 * so a long title takes three lines and a short one takes two, and both end
 * up in the same size band.
 */
const TARGET_MAX_PX = 110;

/**
 * A hard ceiling, and the same number as the target below.
 *
 * Filling the measure is the goal, but it cannot be the only rule: a
 * 16-character headline only spans 1120px by reaching 171px, and at that size it
 * stops being the same component as every other page's title. Titles short
 * enough to need more than this stop short of the right edge instead. Size
 * consistency wins over spanning; they are only in conflict at the extremes.
 */
const ABSOLUTE_MAX_PX = 110;

/** More lines than this reads as a paragraph, not a headline. */
const MAX_LINES = 4;

/** Width of one word in em, tracking included. */
function widthEm(word) {
  let w = 0;
  for (const ch of word) w += (CHAR_EM[ch] ?? FALLBACK_EM) + TRACKING_EM;
  return w;
}

const SPACE_EM = (CHAR_EM[' '] ?? 0.2) + TRACKING_EM;

/**
 * Greedy line-breaking — the same algorithm the browser runs. `capacity` is the
 * line width in em. Returns each line's width, so the caller can see how full
 * the longest one is.
 */
function wrap(words, capacity) {
  const lines = [];
  let cur = -1;
  for (const w of words) {
    const ww = widthEm(w);
    if (cur < 0) cur = ww;
    else if (cur + SPACE_EM + ww <= capacity) cur += SPACE_EM + ww;
    else {
      lines.push(cur);
      cur = ww;
    }
  }
  if (cur >= 0) lines.push(cur);
  return lines;
}

/** The tightest capacity — and so the largest type — that still fits in `n` lines. */
function fitToLines(words, n) {
  let lo = Math.max(...words.map(widthEm));
  let hi = words.reduce((a, w) => a + widthEm(w) + SPACE_EM, 0);
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (wrap(words, mid).length <= n) hi = mid;
    else lo = mid;
  }
  const lines = wrap(words, hi);
  return lines.length === n ? { capacity: hi, lines } : null;
}

/**
 * The size at which `title` fills its measure.
 *
 * Returns a CSS length for `font-size`: `Ncqw`, a percentage of the containing
 * block's inline size, under a pixel floor for narrow screens where a
 * faithfully scaled composition would become unreadable.
 */
export function fitDisplay(title, { referenceMeasure = 1120 } = {}) {
  const words = String(title).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return { fontSize: `${FLOOR_PX}px`, lines: 1, px: FLOOR_PX };

  // More lines means tighter lines means bigger type. Walk down from the most
  // lines allowed and take the first option inside the size band; that is the
  // largest type that still reads as a headline.
  let chosen = null;
  for (let n = MAX_LINES; n >= 1; n--) {
    const fit = fitToLines(words, n);
    if (!fit) continue;
    const px = (referenceMeasure / fit.capacity);
    if (px <= TARGET_MAX_PX || n === 1) {
      chosen = { ...fit, px };
      break;
    }
  }

  /* 4% held back. The stack resolves to SF Pro here and to Segoe or Roboto
     elsewhere, and their advances differ by a percent or two — without the
     margin a headline fitted on one platform overflows on another. */
  const cqw = (100 / chosen.capacity) * 0.96;
  return {
    fontSize: `clamp(${FLOOR_PX}px, ${cqw.toFixed(3)}cqw, ${ABSOLUTE_MAX_PX}px)`,
    lines: chosen.lines.length,
    px: Math.round(chosen.px),
    fill: Math.max(...chosen.lines) / chosen.capacity,
  };
}
