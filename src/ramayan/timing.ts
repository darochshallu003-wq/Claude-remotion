import { SCRIPT } from "./script";

// The animation in RamReturn is authored on a fixed 28 s "internal" timeline.
// Each voiceover line belongs to one beat of that timeline; when a line is
// longer than its beat, the beat is stretched by slowing only its calm
// windows (a leg of the flight, or the hold after a medallion has popped),
// so springs and pops keep their snap. `warp` maps an output frame to an
// internal frame; `unwarp` goes the other way (used to place sound).

export const FPS = 30;

type BeatPlan = { id: string; start: number; end: number; slow: [number, number, number][] };

// [windowStart, windowEnd, weight] in internal frames
const PLAN: BeatPlan[] = [
  { id: "lanka", start: 0, end: 80, slow: [[34, 52, 1]] },
  { id: "setu", start: 80, end: 150, slow: [[80, 120, 1], [120, 150, 2]] },
  { id: "kishkindha", start: 150, end: 255, slow: [[225, 255, 1]] },
  { id: "panchavati", start: 255, end: 340, slow: [[255, 305, 1], [310, 340, 2]] },
  { id: "chitrakoot", start: 340, end: 448, slow: [[340, 400, 1], [400, 410, 1], [432, 448, 1]] },
  { id: "hanuman", start: 448, end: 525, slow: [[448, 495, 1], [500, 525, 2]] },
  { id: "arrive", start: 525, end: 575, slow: [[525, 575, 1]] },
  { id: "diwali", start: 575, end: 665, slow: [[618, 665, 1]] },
  { id: "rajya", start: 665, end: 762, slow: [[665, 690, 1]] },
  { id: "cta", start: 762, end: 840, slow: [[790, 840, 1]] },
];

const END_HOLD = 30; // let the end card breathe after the last line

// piecewise-linear segments: internal [a,b] -> output length
type Seg = { a: number; b: number; out: number };
const SEGS: Seg[] = [];
export const VO_STARTS: { id: string; at: number }[] = [];
let outCursor = 0;
for (const beat of PLAN) {
  const line = SCRIPT.find((s) => s.id === beat.id);
  const need = Math.round((line?.seconds ?? 0) * FPS) + (beat.id === "lanka" ? 6 : 0) + (beat.id === "cta" ? END_HOLD : 0);
  const extra = Math.max(0, need - (beat.end - beat.start));
  const totalWeight = beat.slow.reduce((s, w) => s + (w[1] - w[0]) * w[2], 0);
  VO_STARTS.push({ id: beat.id, at: outCursor + (beat.id === "lanka" ? 6 : 0) });
  let t = beat.start;
  for (const [a, b, w] of beat.slow) {
    if (a > t) {
      SEGS.push({ a: t, b: a, out: a - t });
      outCursor += a - t;
    }
    const out = b - a + (extra * (b - a) * w) / totalWeight;
    SEGS.push({ a, b, out });
    outCursor += out;
    t = b;
  }
  if (beat.end > t) {
    SEGS.push({ a: t, b: beat.end, out: beat.end - t });
    outCursor += beat.end - t;
  }
}

export const TOTAL_FRAMES = Math.ceil(outCursor);
export const INTERNAL_END = PLAN[PLAN.length - 1].end;

export const warp = (frame: number) => {
  let o = 0;
  for (const s of SEGS) {
    if (frame < o + s.out) return s.a + ((frame - o) / s.out) * (s.b - s.a);
    o += s.out;
  }
  return INTERNAL_END;
};

export const unwarp = (internal: number) => {
  let o = 0;
  for (const s of SEGS) {
    if (internal <= s.b) return Math.round(o + ((internal - s.a) / (s.b - s.a)) * s.out);
    o += s.out;
  }
  return TOTAL_FRAMES;
};
