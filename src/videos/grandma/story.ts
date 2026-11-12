// Timeline of "The Goodbye Money": 15 shots timed to the narration words (public/grandma/words.json, frames at
// 30 fps), the taxi's motion and the camera grammar of the cartoon-3d-short skill: continuous slow push-ins,
// symmetric smootherstep glides of 18-40 f, hard cuts on big reframes, 7-frame flip kicks on impacts.
// World layout: one lane along z (road |x| < 3.5), Grandma's house on the left (front wall at x = -6.5, door at z = 0),
// the taxi parked at x = 1.6 facing -z (it drives off toward -z, into the sunset).
export const FPS = 30;
export const TOTAL = 2100;
export const D0 = 0; // ground height (the template's house() builder places walls on y = D0)
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;

// ---------------- places ----------------
export const DOOR: V3 = [-6.5, 0, 0];          // Grandma's front door (in the wall plane)
export const GRAN: V3 = [-5.55, 0, 0.15];      // Grandma on her doorstep
export const KIDP: V3 = [-4.35, 0, 0.55];      // the grandkid facing her
export const TAXI0: V3 = [1.6, 0, 2.0];        // parked taxi centre
export const TREE: V3 = [5.0, 0, -15];         // neem tree by the far kerb (a neighbour grandma peeks from behind it)
export const BAGS: V3 = [1.1, 0, 4.7];         // bags at the taxi's boot

// ---------------- taxi motion ----------------
// parked until "The car pulls away" (1002 f), then accelerates down the lane toward -z; shots inside the drive use
// their own clock (cruising at 7 m/s) so the background slides past without the taxi leaving the houses.
export const GO = 1002 / FPS;
export const taxiZ = (id: number, t: number) => {
  if (id <= 8 || id === 15) return TAXI0[2];
  if (id === 9) { const u = Math.max(0, t - GO); return TAXI0[2] - Math.min(0.9 * u * u, 7 * u - 13.6); }
  // cruise shots (10, 11, 13, 14): steady drive past the lane's houses
  const t0: Record<number, number> = { 10: 1088, 11: 1170, 13: 1582, 14: 1775, 12: 0 };
  return -40 - 7 * (t - (t0[id] ?? 0) / FPS);
};
export const taxiAt = (id: number, t: number): V3 => [TAXI0[0], 0, taxiZ(id, t)];

// ---------------- shots ----------------
export type Light = "day" | "golden";
export type ShotDef = { id: number; a: number; b: number; light: Light };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 152, light: "day" },        // hook: Grandma feeds you / tries to pay you
  { id: 2, a: 152, b: 257, light: "golden" },   // Sunday evening, bags packed, the car is running
  { id: 3, a: 257, b: 462, light: "golden" },   // grandmas of the lane, one peeking from behind the neem tree
  { id: 4, a: 462, b: 612, light: "golden" },   // the handshake + note insert
  { id: 5, a: 612, b: 705, light: "golden" },   // "No, Grandma." give it back
  { id: 6, a: 705, b: 785, light: "golden" },   // refuse once: shirt pocket
  { id: 7, a: 785, b: 872, light: "golden" },   // refuse twice: bag, between the socks
  { id: 8, a: 872, b: 1000, light: "golden" },  // refuse three times: the driver, with instructions
  { id: 9, a: 1000, b: 1088, light: "golden" }, // the car pulls away, you wave, you won
  { id: 10, a: 1088, b: 1170, light: "golden" }, // the driver gives it back
  { id: 11, a: 1170, b: 1335, light: "golden" }, // unluckily: the lunch box
  { id: 12, a: 1335, b: 1582, light: "golden" }, // why 501: zero ends, one begins
  { id: 13, a: 1582, b: 1775, light: "golden" }, // a tiny loan, a library book, come back
  { id: 14, a: 1775, b: 1895, light: "golden" }, // the one rupee was your ticket home
  { id: 15, a: 1895, b: TOTAL, light: "day" },   // next month: 1001
];
/** crossfades (frames) at place/time changes; a white 4-frame flash after the hook */
export const XFADE: Record<number, number> = { 10: 8, 11: 8, 13: 8, 15: 12 };
export const FLASH_AT = 152;

export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
/** layers to draw at frame f: base shot, plus the next shot fading in during a crossfade */
export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (const s of SHOTS) {
    const x = XFADE[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  return [{ id: shotAt(f).id, alpha: 1 }];
};

// ---------------- camera ----------------
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
type Shot = Partial<Cam> & { pos: V3; look: V3 };
type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };
/** reference camera ease: symmetric smootherstep */
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
const mixC = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3, look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k, roll: a.roll + (b.roll - a.roll) * k,
});
const full = (c: Shot): Cam => ({ fov: 40, roll: 0, ...c });
const run = (keys: Key[], f: number) => {
  let cur = full(keys[0].s(f));
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? full(k.s(f)) : mixC(cur, full(k.s(f)), glide((f - k.f) / (k.dur ?? 24)));
  }
  return cur;
};
const T = (f: number) => f / FPS;
/** push-in factor since f0: the subject grows ~rate per frame; `punch` raises it (8 f soft edges) for the first n frames */
const pushK = (f: number, f0: number, rate: number, punch = 0, n = 35) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
/** dolly push: camera slides toward the look point by factor k */
const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });
/** a framing that rides with the taxi: offsets relative to the taxi centre */
const onTaxi = (id: number, f: number, pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot => {
  const tz = taxiZ(id, T(f)), tx = TAXI0[0];
  return dolly([tx + pos[0], pos[1], tz + pos[2]], [tx + look[0], look[1], tz + look[2]], k, rest);
};

// eye heights: standing adult eyes ~1.55 m, grandma ~1.35 m, a seated passenger's eyes ~1.15 m
const GE = 1.38, KE = 1.62;

// shot 1 (day): Grandma at her door with a plate of parathas -> close-up with the folded note (punch on "pay")
const S1a = (f: number) => dolly([-2.2, 1.45, 2.4], [GRAN[0], 1.15, GRAN[2]], pushK(f, 0, 0.0025), { fov: 40, roll: -0.03 });
const S1b = (f: number) => dolly([-3.55, 1.38, 1.25], [GRAN[0], GE - 0.05, GRAN[2]], pushK(f, 75, 0.002, 0.006, 32), { fov: 36, roll: 0.035 });
// shot 2 (golden): high wide down the lane -> bags at the boot -> taxi rear, exhaust puffing
const S2a = (f: number) => dolly([4.5, 7.5, 16], [-1.5, 1.2, -4], pushK(f, 152, 0.0022), { fov: 44 });
const S2b = (f: number) => dolly([-0.6, 0.75, 7.6], [BAGS[0], 0.45, BAGS[2]], pushK(f, 193, 0.003), { fov: 38, roll: 0.03 });
const S2c = (f: number) => dolly([-1.4, 1.2, 8.8], [TAXI0[0], 0.75, TAXI0[2] + 1.0], pushK(f, 221, 0.0025), { fov: 40, roll: -0.03 });
// shot 3: glide past the lane's grandmas at their doors -> the one peeking from behind the neem tree
const S3a = (f: number) => { const u = (f - 257) / 142; return { pos: [-0.6, 1.5, -5.6 - 19 * u] as V3, look: [-5.6, 1.1, -8.4 - 19 * u] as V3, fov: 42, roll: -0.02 }; };
const S3b = (f: number) => dolly([TREE[0] - 3.2, 1.45, TREE[2] + 2.2], [TREE[0] - 0.55, 1.36, TREE[2] + 0.25], pushK(f, 399, 0.002, 0.006, 35), { fov: 34, roll: 0.04 });
// shot 4: the doorstep two-shot -> the handshake insert (hands card)
const mid = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
const DUO = mid(GRAN, KIDP);
const S4a = (f: number) => dolly([DUO[0] + 0.3, 1.5, DUO[2] + 4.6], [DUO[0], 1.2, DUO[2]], pushK(f, 462, 0.0022), { fov: 40 });
const S4b = (f: number) => dolly([DUO[0] + 0.15, 1.05, DUO[2] + 1.6], [DUO[0], 1.0, DUO[2] + 0.55], pushK(f, 516, 0.002, 0.005, 30), { fov: 34, roll: -0.04 });
// shot 5: the kid says no (CU) -> two-shot, the note goes back
const S5a = (f: number) => dolly([KIDP[0] - 1.6, 1.6, KIDP[2] + 1.8], [KIDP[0], KE - 0.05, KIDP[2]], pushK(f, 612, 0.0025, 0.006, 30), { fov: 36, roll: 0.035 });
const S5b = (f: number) => dolly([DUO[0] - 0.2, 1.4, DUO[2] + 3.8], [DUO[0], 1.25, DUO[2]], pushK(f, 671, 0.0025), { fov: 40, roll: -0.02 });
// shot 6: kid MS from Grandma's side -> the shirt pocket insert
const S6a = (f: number) => dolly([KIDP[0] - 2.4, 1.55, KIDP[2] + 2.6], [KIDP[0] - 0.4, 1.35, KIDP[2]], pushK(f, 705, 0.0025), { fov: 40, roll: 0.03 });
const S6b = (f: number) => dolly([KIDP[0] - 0.35, 1.12, KIDP[2] + 1.3], [KIDP[0] - 0.05, 1.0, KIDP[2]], pushK(f, 758, 0.002, 0.005, 25), { fov: 34, roll: -0.04 });
// shot 7: kid at the boot -> open bag insert (socks + note)
const S7a = (f: number) => dolly([-1.6, 1.5, 9.2], [0.55, 1.05, 5.0], pushK(f, 785, 0.0025), { fov: 40, roll: -0.03 });
const S7b = (f: number) => dolly([BAGS[0] - 0.35, 1.85, BAGS[2] + 1.35], [BAGS[0], 0.62, BAGS[2]], pushK(f, 830, 0.002, 0.005, 25), { fov: 36, roll: 0.04 });
// shot 8: the driver's window, Grandma leaning in -> closer on the driver ("with instructions")
// (right-hand drive: the driver's window is on the +x side, so Grandma walks round to the kerb side)
export const GRAN8: V3 = [3.05, 0, TAXI0[2] - 1.35];
const S8a = (f: number) => dolly([5.3, 1.6, TAXI0[2] + 2.3], [2.55, 1.15, TAXI0[2] - 0.95], pushK(f, 872, 0.0022), { fov: 42 });
const S8b = (f: number) => dolly([4.3, 1.4, TAXI0[2] + 1.3], [2.0, 1.25, TAXI0[2] - 0.45], pushK(f, 940, 0.002, 0.006, 30), { fov: 36, roll: 0.04 });
// shot 9: from behind Grandma, the taxi pulls away -> side tracking, kid waving -> CU "You won."
const S9a = (f: number) => dolly([-2.6, 1.55, 8.6], [1.3, 0.95, taxiZ(9, T(f)) - 1.5], pushK(f, 1000, 0.002), { fov: 42 });
const S9b = (f: number) => onTaxi(9, f, [-4.6, 1.3, 1.6], [-0.4, 1.1, 0.6], pushK(f, 1039, 0.002), { fov: 38, roll: -0.03 });
const S9c = (f: number) => onTaxi(9, f, [-2.3, 1.25, 1.05], [-0.4, 1.15, 0.65], pushK(f, 1061, 0.002, 0.006, 25), { fov: 34, roll: 0.035 });
// shot 10: riding alongside: the driver hands it back (insert inside the car)
const S10a = (f: number) => onTaxi(10, f, [-3.6, 1.35, -0.9], [0.0, 1.05, 0.1], pushK(f, 1088, 0.0025), { fov: 40, roll: 0.03 });
const S10b = (f: number) => onTaxi(10, f, [-1.25, 1.42, 0.5], [0.0, 1.27, 0.15], pushK(f, 1125, 0.002, 0.005, 25), { fov: 34, roll: -0.035 });
// shot 11: kid with the lunch box -> open box insert (kick on "one") -> kid CU shock
const S11a = (f: number) => onTaxi(11, f, [-3.2, 1.3, 1.6], [-0.4, 1.0, 0.7], pushK(f, 1170, 0.0025), { fov: 40 });
const S11b = (f: number) => onTaxi(11, f, [-1.35, 1.5, 0.95], [-0.42, 1.2, 0.72], pushK(f, 1223, 0.002, 0.006, 32), { fov: 34, roll: 0.04 });
const S11c = (f: number) => onTaxi(11, f, [-2.1, 1.22, 1.0], [-0.4, 1.17, 0.7], pushK(f, 1290, 0.003, 0.007, 25), { fov: 34, roll: -0.04 });
// shot 12: Grandma at her door with the extra coin -> ground level: a zero rolls in and topples -> a one rolls away
const S12a = (f: number) => dolly([-3.2, 1.35, 2.3], [GRAN[0], GE - 0.1, GRAN[2]], pushK(f, 1335, 0.0022, 0.005, 30), { fov: 38, roll: 0.03 });
export const COIN_Z0 = -6;
const S12b = (f: number) => dolly([-1.6, 0.42, COIN_Z0 + 3.4], [0.2, 0.3, COIN_Z0 - 0.5], pushK(f, 1405, 0.0025), { fov: 40, roll: -0.03 });
const S12c = (f: number) => dolly([0.9, 0.38, COIN_Z0 + 2.2], [0.0, 0.32, COIN_Z0 - 2.5], pushK(f, 1541, 0.002), { fov: 40, roll: 0.03 });
// shot 13: the kid holding the coin, a thought bubble (library book -> Grandma's door)
const S13a = (f: number) => onTaxi(13, f, [-3.0, 1.45, 1.4], [-0.35, 1.35, 0.6], pushK(f, 1582, 0.0025), { fov: 40, roll: 0.02 });
const S13b = (f: number) => onTaxi(13, f, [-2.4, 1.45, 1.15], [-0.35, 1.4, 0.6], pushK(f, 1730, 0.002, 0.006, 30), { fov: 38, roll: -0.035 });
// shot 14: the coin held up to the sunset -> the coin against the sun
const S14a = (f: number) => onTaxi(14, f, [-2.6, 1.3, 1.6], [-0.35, 1.25, 0.6], pushK(f, 1775, 0.0025), { fov: 38, roll: 0.03 });
const S14b = (f: number) => onTaxi(14, f, [-1.2, 1.12, 1.5], [-0.75, 1.3, -1.0], pushK(f, 1833, 0.002, 0.005, 30), { fov: 34, roll: -0.03 });
// shot 15 (day): next month at the door -> Grandma CU -> the wad insert -> the final two-shot
const S15a = (f: number) => dolly([DUO[0] + 0.6, 1.55, DUO[2] + 5.2], [DUO[0], 1.2, DUO[2]], pushK(f, 1895, 0.0022), { fov: 40 });
const S15b = (f: number) => dolly([-4.1, 1.38, 2.7], [GRAN[0], GE - 0.05, GRAN[2]], pushK(f, 1989, 0.0025, 0.006, 25), { fov: 36, roll: 0.035 });
const S15c = (f: number) => dolly([DUO[0] + 0.15, 1.05, DUO[2] + 1.55], [DUO[0], 1.0, DUO[2] + 0.55], pushK(f, 2021, 0.002, 0.005, 20), { fov: 34, roll: -0.04 });
const S15d = (f: number) => dolly([DUO[0] + 0.2, 1.45, DUO[2] + 3.4], [DUO[0], 1.3, DUO[2]], pushK(f, 2048, 0.003), { fov: 38, roll: 0.02 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: S1a }, { f: 75, cut: true, s: S1b }],
  2: [{ f: 152, s: S2a }, { f: 193, cut: true, s: S2b }, { f: 221, cut: true, s: S2c }],
  3: [{ f: 257, s: S3a }, { f: 399, cut: true, s: S3b }],
  4: [{ f: 462, s: S4a }, { f: 516, cut: true, s: S4b }],
  5: [{ f: 612, s: S5a }, { f: 671, cut: true, s: S5b }],
  6: [{ f: 705, s: S6a }, { f: 758, cut: true, s: S6b }],
  7: [{ f: 785, s: S7a }, { f: 830, cut: true, s: S7b }],
  8: [{ f: 872, s: S8a }, { f: 928, dur: 26, s: S8b }],
  9: [{ f: 1000, s: S9a }, { f: 1039, cut: true, s: S9b }, { f: 1061, cut: true, s: S9c }],
  10: [{ f: 1084, s: S10a }, { f: 1125, cut: true, s: S10b }],
  11: [{ f: 1166, s: S11a }, { f: 1223, cut: true, s: S11b }, { f: 1290, cut: true, s: S11c }],
  12: [{ f: 1335, s: S12a }, { f: 1405, cut: true, s: S12b }, { f: 1541, cut: true, s: S12c }],
  13: [{ f: 1578, s: S13a }, { f: 1718, dur: 24, s: S13b }],
  14: [{ f: 1775, s: S14a }, { f: 1833, cut: true, s: S14b }],
  15: [{ f: 1889, s: S15a }, { f: 1989, cut: true, s: S15b }, { f: 2021, cut: true, s: S15c }, { f: 2048, cut: true, s: S15d }],
};

// impact kicks: offset flips sign every frame, decays to 0 in 7 f (start on the first frame at/after the event)
const KICKS: [number, number][] = [[516 / FPS, 0.5], [964 / FPS, 0.5], [1255 / FPS, 1.0], [1521 / FPS, 0.6], [2060 / FPS, 1.0]];
export const kickAt = (t: number) => {
  let a = 0;
  for (const [t0, g] of KICKS) {
    const n = Math.floor((t - t0) * FPS + 1e-6);
    if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5;
  }
  return a;
};
export const camAt = (id: number, f: number): Cam => {
  const c = run(CAMS[id], f), a = kickAt(T(f));
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a;
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};

// ---------------- lens: depth of field ----------------
/** cInf = blur-disc radius in px at 1080x1920 for things at infinity (0 = all sharp); focus = world point, else the
 *  camera look point. DOF on close-ups / inserts / mediums (~1/3 of screen time), wides stay sharp. */
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 10 }, { f: 75, cInf: 13 },
  { f: 152, cInf: 0 }, { f: 193, cInf: 12 }, { f: 221, cInf: 8 },
  { f: 257, cInf: 0 }, { f: 399, cInf: 13 },
  { f: 462, cInf: 9 }, { f: 516, cInf: 15 },
  { f: 612, cInf: 13 }, { f: 671, cInf: 9 },
  { f: 705, cInf: 10 }, { f: 758, cInf: 15 },
  { f: 785, cInf: 7 }, { f: 830, cInf: 14 },
  { f: 872, cInf: 8 }, { f: 928, dur: 26, cInf: 12 },
  { f: 1000, cInf: 0 }, { f: 1039, cInf: 8 }, { f: 1061, cInf: 12 },
  { f: 1088, cInf: 8 }, { f: 1125, cInf: 14 },
  { f: 1170, cInf: 8 }, { f: 1223, cInf: 15 }, { f: 1290, cInf: 13 },
  { f: 1335, cInf: 12 }, { f: 1405, cInf: 10 }, { f: 1541, cInf: 10 },
  { f: 1582, cInf: 9 }, { f: 1718, dur: 24, cInf: 11 },
  { f: 1775, cInf: 10 }, { f: 1833, cInf: 14 },
  { f: 1895, cInf: 6 }, { f: 1989, cInf: 13 }, { f: 2021, cInf: 15 }, { f: 2048, cInf: 9 },
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};

/** near framing objects (none yet: kept for the template's world contract) */
export type Fg = { a: number; b: number; kit: string; pos: V3; s?: number; yaw?: number };
export const FOREGROUND: Fg[] = [];
