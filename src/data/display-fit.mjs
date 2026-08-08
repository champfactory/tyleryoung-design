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

/** Advance width per character, in em, measured at weight 620. */
const CHAR_EM = {" ": 0.19913,"!": 0.29378,"\"": 0.4463,"#": 0.58635,"$": 0.54404,"%": 0.96748,"&": 0.73595,"'": 0.24739,"(": 0.35839,")": 0.35839,"*": 0.407,"+": 0.63704,",": 0.30143,"-": 0.333,".": 0.30143,"/": 0.29835,"0": 0.579,"1": 0.57995,"2": 0.57995,"3": 0.57995,"4": 0.58091,"5": 0.579,"6": 0.57995,"7": 0.57995,"8": 0.57995,"9": 0.579,":": 0.33587,";": 0.33587,"<": 0.63704,"=": 0.63704,">": 0.63704,"?": 0.61291,"@": 0.99852,"A": 0.712,"B": 0.70913,"C": 0.72348,"D": 0.73017,"E": 0.67417,"F": 0.61152,"G": 0.79569,"H": 0.73639,"I": 0.28578,"J": 0.58856,"K": 0.701,"L": 0.57422,"M": 0.84956,"N": 0.73639,"O": 0.78422,"P": 0.67226,"Q": 0.78422,"R": 0.71965,"S": 0.66939,"T": 0.62348,"U": 0.72874,"V": 0.67565,"W": 0.956,"X": 0.69,"Y": 0.68139,"Z": 0.63782,"[": 0.34117,"\\": 0.29835,"]": 0.34117,"^": 0.63704,"_": 0.50913,"`": 0.21282,"a": 0.56082,"b": 0.59526,"c": 0.55221,"d": 0.59526,"e": 0.56561,"f": 0.31056,"g": 0.59426,"h": 0.58761,"i": 0.25491,"j": 0.25287,"k": 0.54839,"l": 0.25491,"m": 0.86704,"n": 0.58761,"o": 0.601,"p": 0.59526,"q": 0.59526,"r": 0.36556,"s": 0.54404,"t": 0.31965,"u": 0.58665,"v": 0.53256,"w": 0.76608,"x": 0.55126,"y": 0.53256,"z": 0.51104,"{": 0.39378,"|": 0.24661,"}": 0.39378,"~": 0.63704,"—": 1,"‘": 0.27991,"’": 0.27991,"“": 0.48313,"”": 0.48313};

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

  const cqw = 100 / chosen.capacity;
  return {
    fontSize: `clamp(${FLOOR_PX}px, ${cqw.toFixed(3)}cqw, ${ABSOLUTE_MAX_PX}px)`,
    lines: chosen.lines.length,
    px: Math.round(chosen.px),
    fill: Math.max(...chosen.lines) / chosen.capacity,
  };
}
