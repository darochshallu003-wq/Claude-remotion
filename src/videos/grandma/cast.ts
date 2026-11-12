// The Goodbye Money cast as lit flat sprites in the 3D world (pool / actor / lighting machinery from the
// cartoon-3d-short skill's bridge short). Each frame every character asks for a drawing (a key + a draw call); the
// pool keeps one canvas per distinct drawing. Characters are yaw-only billboards shaded by cardShade(); standing ones
// get a soft multiply contact blob. Effects and inserts are unlit cards. All on the NOINK layer.
import * as THREE from "three";
import {
  Pen, bodyFront, fxBurst, fxShadow, fxContact, Outfit, Expr, FrontOpts, SideOpts, bodySide, Item,
  GRANDMA, GRANDMA2, GRANDKID, DRIVER, MUM, insertHandshake, insertBagTop, insertHandBack, insertTiffin, insertWad,
  fxCoin, fxThought, fxRangoli, fxKite, fxExhaust,
} from "./toon";
import { FPS, V3, smooth, clamp01, GRAN, KIDP, TAXI0, TREE, BAGS, GRAN8, COIN_Z0, taxiAt, camAt } from "./story";
import { NOINK } from "./ink";
import { cardShade, blobMaterial, CARD_K } from "./cardshade";

// ---------------- canvas pool ----------------
type Entry = { cv: HTMLCanvasElement; tex: THREE.CanvasTexture; w: number; h: number };
export type Req = { key: string; w: number; h: number; k: number; draw: (p: Pen) => void; tex?: THREE.CanvasTexture };
const makeEntry = (w: number, h: number): Entry => {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return { cv, tex, w, h };
};
export class Pool {
  private live = new Map<string, Entry>();
  private free: Entry[] = [];
  private reqs: Req[] = [];
  req(key: string, w: number, h: number, k: number, draw: (p: Pen) => void) {
    const r: Req = { key: `${w}x${h}|${key}`, w, h, k, draw };
    this.reqs.push(r);
    return r;
  }
  flush() {
    const want = new Map<string, Req[]>();
    for (const r of this.reqs) { const l = want.get(r.key); if (l) l.push(r); else want.set(r.key, [r]); }
    for (const [key, e] of this.live) if (!want.has(key)) { this.live.delete(key); this.free.push(e); }
    for (const [key, rs] of want) {
      let e = this.live.get(key);
      if (!e) {
        const r = rs[0], i = this.free.findIndex((x) => x.w === r.w && x.h === r.h);
        e = i >= 0 ? this.free.splice(i, 1)[0] : makeEntry(r.w, r.h);
        const g = e.cv.getContext("2d")!;
        g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, e.w, e.h); g.setTransform(r.k, 0, 0, r.k, 0, 0);
        r.draw(new Pen(g));
        e.tex.needsUpdate = true;
        this.live.set(key, e);
      }
      for (const r of rs) r.tex = e.tex;
    }
    this.reqs = [];
  }
}

// ---------------- sprite meshes ----------------
const blank = (() => { const c = document.createElement("canvas"); c.width = c.height = 2; return new THREE.CanvasTexture(c); })();
export const SU = 0.00216; // metres per design unit: 1000 units = 2.16 m
const BODY = (() => { const g = new THREE.PlaneGeometry(600 * SU, 1000 * SU); g.translate(0, (975 - 500) * SU, 0); return g; })();
const CARD = new THREE.PlaneGeometry(1, 1);
/** world roots that hold actors (to find the scene's sun when world.ts does not pass it) */
const ROOTS = new Set<THREE.Object3D>();

/** lit flat character: cardShade() material, receives shadows (dims to the bright floor only), casts its silhouette
 *  when world.ts says so (golden). Drawn after the contact blobs (renderOrder 1). */
export class Actor {
  mesh: THREE.Mesh; mat: THREE.MeshLambertMaterial; dmat: THREE.MeshDepthMaterial; r: Req | null = null;
  constructor(parent: THREE.Object3D, geo: THREE.BufferGeometry = BODY) {
    this.mat = cardShade(new THREE.MeshLambertMaterial({ map: blank, alphaTest: 0.5, side: THREE.DoubleSide }));
    this.mat.alphaToCoverage = false; // A2C + MSAA left 1 px sky-depth seams on blurred far cards (POST)
    this.dmat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: blank, alphaTest: 0.5, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.customDepthMaterial = this.dmat;
    // rim width is in output pixels: tell the card shader the render height (1920 = 1080 x 1920 frame)
    this.mesh.onBeforeRender = (r) => { const rt = r.getRenderTarget(); CARD_K.uPx.value = (rt ? rt.height : r.domElement.height) / 1920; };
    this.mesh.castShadow = false; this.mesh.receiveShadow = true; this.mesh.visible = false;
    this.mesh.rotation.order = "YXZ"; this.mesh.renderOrder = 1; this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
    ROOTS.add(parent);
  }
  bind() { const t = this.r?.tex; if (t) { this.mat.map = t; this.dmat.map = t; } }
}
/** unlit effect card: hard cut-out (ink drawings), soft see-through (dust, mist) or a multiply ground blob */
export class Fx {
  mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; soft: THREE.MeshBasicMaterial; blob: THREE.MeshBasicMaterial; r: Req | null = null;
  constructor(parent: THREE.Object3D) {
    this.mat = new THREE.MeshBasicMaterial({ map: blank, alphaTest: 0.5, side: THREE.DoubleSide });
    this.mat.alphaToCoverage = false; // A2C + MSAA left 1 px sky-depth seams on blurred far cards (POST)
    this.soft = new THREE.MeshBasicMaterial({ map: blank, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    this.blob = blobMaterial(blank);
    this.mesh = new THREE.Mesh(CARD, this.mat);
    this.mesh.visible = false; this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
  }
  use(soft: boolean) { this.mesh.material = soft ? this.soft : this.mat; }
  bind() {
    const t = this.r?.tex;
    if (!t) return;
    if (this.r!.key.includes("|blob|")) {
      // no mipmaps: at grazing views the mip chain averages the blob with its white surround and it fades out
      if (t.generateMipmaps) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; }
      this.blob.map = t; this.mesh.material = this.blob; this.mesh.renderOrder = 0.5;
    }
    else { this.mat.map = t; this.soft.map = t; this.mesh.renderOrder = 0; }
  }
}

// ---------------- placements ----------------
export type Place = {
  key: string; draw: (p: Pen) => void; x: number; y: number; z: number;
  scale?: number; mirror?: boolean; yaw?: number; geo?: "body" | "swing"; roll?: number; size?: [number, number, number];
};
export type FxPlace = { key: string; cw: number; ch: number; draw: (p: Pen) => void; x: number; y: number; z: number; w: number; h: number; flat?: boolean; rot?: number; soft?: boolean };
/** sun = world direction TOWARD the sun (optional: when absent the scene's shadow-casting light is used) */
export type CamInfo = { pos: THREE.Vector3; right: THREE.Vector3; sun?: THREE.Vector3 };

const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const q = (v: number, n = 120) => Math.round(v * n) / n;
/** head-shape seed: 7 shapes, so marching soldiers in step still share canvases */
const seedOf = (i: number) => ((i * 5 + 3) % 7) + 1;
/** drawing resolution by distance: [canvas w, h, scale from the 600 x 1000 design]; sized for the 1440 x 2560 final */
const tier = (d: number): [number, number, number] =>
  d < 3.2 ? [1800, 3000, 3.0] : d < 6.5 ? [1080, 1800, 1.8] : d < 16 ? [480, 800, 0.8] : [240, 400, 0.4];

// ---------------- light ----------------
const SUN = new THREE.Vector3(0.5, 0.75, -0.4).normalize();
const tmp = new THREE.Vector3();
let LNAME: "day" | "golden" = "day";
const sunOf = (root: THREE.Object3D) => {
  let s: THREE.DirectionalLight | null = null;
  root.traverse((o) => { if (!s && o instanceof THREE.DirectionalLight && o.castShadow) s = o; });
  return s as THREE.DirectionalLight | null;
};
/** the sun of the world that is calling: the attached root whose sun target sits on this camera's view axis */
const findSun = (cam: CamInfo, out: THREE.Vector3) => {
  if (cam.sun) return out.copy(cam.sun).normalize();
  let best: THREE.DirectionalLight | null = null, err = Infinity;
  for (const r of ROOTS) {
    if (!r.parent) continue;
    const s = sunOf(r);
    if (!s) continue;
    const d = tmp.copy(s.target.position).sub(cam.pos), e = Math.abs(d.dot(cam.right)) / (d.length() || 1);
    if (e < err) { err = e; best = s; }
  }
  return best ? out.copy(best.position).sub(best.target.position).normalize() : out;
};
/** canvas angle the sun comes FROM on an upright card facing the camera, in 45-degree steps (small texture cache) */
const light2D = (cam: CamInfo, mirror: boolean) => {
  const sx = SUN.dot(cam.right) * (mirror ? -1 : 1), sy = -SUN.y;
  return Math.round(Math.atan2(sy, sx) / (Math.PI / 4)) * (Math.PI / 4);
};

/** front / side view and mirroring for someone at (x, z) walking along (dx, dz); fs = foreshortening of the walk */
const viewOf = (cam: CamInfo, x: number, z: number, dx: number, dz: number) => {
  const tx = cam.pos.x - x, tz = cam.pos.z - z, tl = Math.hypot(tx, tz) || 1;
  const c = (tx * dx + tz * dz) / tl;
  return { side: c < 0.57, mirror: dx * cam.right.x + dz * cam.right.z < 0, fs: Math.round(Math.sqrt(Math.max(0, 1 - c * c)) * 20) / 20 };
};

// ---------------- life: blinks and reaction timing ----------------
/** reference expression and action changes land 0-3 f before the word onset */
const LEAD = 2 / FPS;
/** eyelid 0 open .. 1 shut. Reference: gaps 0.5-2.3 s, 4-frame blink half / shut / shut / half, plus a blink across
 *  every expression swap (the shut frames hide the swap) */
const LID = [0.5, 1, 1, 0.5];
const lidAt = (t: number, i: number, swaps: number[] = []) => {
  const f = Math.round(t * FPS);
  for (const ts of swaps) { const k = f - Math.round((ts - LEAD) * FPS) + 1; if (k >= 0 && k < 4) return LID[k]; }
  let s = Math.round(-60 * hh(i, 9));
  for (let n = 0; s <= f && n < 400; n++) {
    const k = f - s;
    if (k >= 0 && k < 4) return LID[k];
    s += Math.round(15 + 54 * hh(i * 31 + n, 13)); // next blink 0.5-2.3 s later
  }
  return 0;
};
const fkey = (o: object) => JSON.stringify(o, (_k, v) => (typeof v === "number" ? q(v) : v));

type Who = { i: number; o: Outfit; okey: string };
/** one character drawing in the 600 x 1000 design space, sized by distance, lit from the scene's sun */
const person = (cam: CamInfo, who: Who, x: number, y: number, z: number, view: { side: boolean; mirror: boolean }, fo: FrontOpts, so: SideOpts, scale = 1): Place & { tierKey: string } => {
  const d = cam.pos.distanceTo(tmp.set(x, y + 1.2, z)) / scale;
  const [w, h, k] = tier(d);
  const mirror = view.side && view.mirror, light = light2D(cam, mirror), seed = seedOf(who.i);
  const f2: FrontOpts = { ...fo, light, seed }, s2: SideOpts = { ...so, light, seed };
  const key = view.side ? `S|${who.okey}|${fkey(s2)}` : `F|${who.okey}|${fkey(f2)}`;
  return {
    key, x, y, z, scale, mirror, tierKey: `${w}`,
    draw: (p) => (view.side ? bodySide(p, who.o, s2) : bodyFront(p, who.o, f2)),
    size: [w, h, k],
  };
};

/** ground shadow under a standing / sitting card (review rounds 2-4), multiply, blue-violet: a TIGHT contact pool right under
 *  the feet (~.5 on screen at the core) so nobody floats, plus by day (cards cast no real shadow) a lighter soft tail
 *  stretched AWAY from the sun, length ~1.6 m / tan(sun elevation), capped. Golden: world.ts casts real card shadows. */
const CONTACT: Record<"day" | "golden", [number, number, number]> = { day: [0.2, 0.21, 0.33], golden: [0.24, 0.2, 0.33] };
const TAIL: [number, number, number] = [0.42, 0.44, 0.62];
const toSrgb = (v: number) => { const c = clamp01(v); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
const hexOf = (c: [number, number, number], k: number) => "#" + c.map((v) => Math.round(255 * toSrgb(1 - (1 - v) * k)).toString(16).padStart(2, "0")).join("");
const blob = (out: Stage, x: number, y: number, z: number, sc = 1, k = 1) => {
  const hl = Math.hypot(SUN.x, SUN.z) || 1, ox = -SUN.x / hl, oz = -SUN.z / hl, rot = Math.atan2(-ox, -oz);
  if (LNAME === "day") {
    const el = Math.asin(Math.min(0.99, Math.max(0.1, SUN.y)));
    const len = Math.min(2.4, Math.max(0.5, 1.6 / Math.tan(el))) * sc, h = len + 0.55 * sc, c = 0.3 * h; // feet at v = .2 of the card
    const tc = hexOf(TAIL, k);
    out.fx.push({ key: `blob|shadow|${tc}`, cw: 128, ch: 256, draw: (p) => fxShadow(p, tc), x: x + ox * c, y: y + 0.018, z: z + oz * c,
      w: 0.72 * sc, h, flat: true, rot });
  }
  const cc = hexOf(CONTACT[LNAME], k);
  out.fx.push({ key: `blob|contact|${cc}`, cw: 128, ch: 128, draw: (p) => fxContact(p, cc), x: x + ox * 0.03 * sc, y: y + 0.022, z: z + oz * 0.03 * sc,
    w: 0.52 * sc, h: 0.4 * sc, flat: true, rot });
};

// ---------------- staging helpers ----------------
export type Stage = { places: Place[]; fx: FxPlace[] };
const F = (t: number) => t * FPS;
/** on/after word frame w (reactions lead the word by LEAD) */
const at = (t: number, w: number) => F(t) >= w - LEAD * FPS;
/** screen side of `to` seen from `from`: +1 right, -1 left */
const sideOf = (cam: CamInfo, from: V3, to: V3) => Math.sign((to[0] - from[0]) * cam.right.x + (to[2] - from[2]) * cam.right.z) || 1;
const SEAT_Y = 0.42, SEAT_S = 0.93; // seated passengers: shoulders clear the window line (0.98 m), heads under the roof
type Pose = { expr: Expr; reach?: number; item?: Item; wave?: number; tilt?: number; headTilt?: number; look?: number; mode?: FrontOpts["mode"]; pocket?: boolean };
/** a front-view character at p, turned toward `toward` (3/4 facing + card mirrored so a reaching arm points there) */
const who = (cam: CamInfo, out: Stage, i: number, o: Outfit, okey: string, p: V3, pose: Pose, t: number, toward?: V3, scale = 1, shadow = true) => {
  const s = toward ? sideOf(cam, p, toward) : 0;
  const mirror = s < 0 && (pose.reach !== undefined || pose.item !== undefined || pose.wave !== undefined);
  const facing = (s === 0 ? 0 : mirror ? 1 : s) as -1 | 0 | 1;
  const fo: FrontOpts = { mode: pose.mode ?? "stand", expr: pose.expr, reach: pose.reach, item: pose.item, wave: pose.wave, tilt: pose.tilt,
    headTilt: pose.headTilt, look: pose.look ?? 0, pocket: pose.pocket, blink: pose.expr === "whistle" ? 0 : lidAt(t, i), facing };
  const pl = person(cam, { i, o, okey }, p[0], p[1], p[2], { side: false, mirror: false }, fo, {}, scale);
  out.places.push({ ...pl, mirror });
  if (shadow && p[1] < 0.05) blob(out, p[0], p[1], p[2], scale);
};
/** an unlit card at a world point (faces the camera) */
const card = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, rot = 0, soft = false) =>
  out.fx.push({ key, cw, ch, draw, x: p[0], y: p[1], z: p[2], w, h: (w * ch) / cw, rot, soft });
/** an insert card at the shot camera's look point, nudged 0.1 m toward the lens */
const insert = (id: number, f: number, out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, w: number) => {
  const c = camAt(id, f), d = [c.pos[0] - c.look[0], c.pos[1] - c.look[1], c.pos[2] - c.look[2]], l = Math.hypot(...d);
  card(out, key, cw, ch, draw, [c.look[0] + (d[0] / l) * 0.1, c.look[1] + (d[1] / l) * 0.1, c.look[2] + (d[2] / l) * 0.1], w);
};
const burst = (out: Stage, t: number, w: number, p: V3, size = 0.5) => {
  const u = (F(t) - w) / 6;
  if (u >= 0 && u < 1) card(out, `burst${q(u, 30)}`, 500, 500, (pp) => fxBurst(pp, q(u, 30)), p, size);
};
const kitesAt = (t: number, out: Stage) => {
  ([[-30, 34, -90, "#e74c3c"], [24, 40, -120, "#f1c40f"], [-60, 46, -150, "#2e86de"], [40, 30, -70, "#27ae60"]] as const).forEach(([x, y, z, c], i) => {
    const wob = Math.sin(t * 1.3 + i * 2);
    card(out, `kite${c}${q(wob, 8)}`, 300, 420, (p) => fxKite(p, c, q(wob, 8)), [x + 1.5 * wob, y + 0.8 * Math.sin(t * 0.9 + i), z], 3.2, 0.2 * wob);
  });
};
const rangoli = (out: Stage) => out.fx.push({ key: "rangoli", cw: 600, ch: 600, draw: fxRangoli, x: -4.9, y: 0.012, z: 0.25, w: 1.5, h: 1.5, flat: true });
/** passengers in the taxi: driver front right, the kid back left, Mum back right */
const inTaxi = (id: number, t: number, cam: CamInfo, out: Stage, kid: Pose | null, driver: Pose = { expr: "neutral" }, mum: Pose = { expr: "smile_closed" }) => {
  const [tx, , tz] = taxiAt(id, t);
  who(cam, out, 20, DRIVER, "drv", [tx + 0.38, SEAT_Y, tz - 0.38], { mode: "sit", ...driver }, t, undefined, SEAT_S, false);
  who(cam, out, 21, MUM, "mum", [tx + 0.38, SEAT_Y, tz + 0.62], { mode: "sit", ...mum }, t, undefined, SEAT_S, false);
  if (kid) who(cam, out, 10, GRANDKID, "kid", [tx - 0.36, SEAT_Y, tz + 0.62], { mode: "sit", ...kid }, t, [tx - 3, 1, tz], SEAT_S, false);
};
const exhaust = (id: number, t: number, out: Stage) => {
  const [tx, , tz] = taxiAt(id, t);
  for (let k = 0; k < 3; k++) {
    const u = (t * 1.4 + k / 3) % 1;
    card(out, `exh${q(u, 20)}`, 300, 300, (p) => fxExhaust(p, q(u, 20)), [tx - 0.55 - 0.25 * u, 0.3 + 0.35 * u, tz + 2.15 + 0.9 * u], 0.5 + 0.6 * u, 0, true);
  }
};

// ---------------- shots ----------------
export const stage = (id: number, t: number, cam: CamInfo, light: "day" | "golden"): Stage => {
  const out: Stage = { places: [], fx: [] }, f = F(t);
  LNAME = light;
  findSun(cam, SUN);
  const doorstep = id <= 9 || id === 12 || id === 15;
  if (doorstep) rangoli(out);
  if (light === "golden" && id <= 9) kitesAt(t, out);
  switch (id) {
    case 1: { // Grandma with the plate, then the folded note (sly)
      const note = at(t, 75);
      who(cam, out, 1, GRANDMA, "gran", GRAN, note ? { expr: at(t, 113) ? "grin" : "smile", reach: 0.25, item: "note", look: 1 } : { expr: "smile_closed", item: "plate" }, t);
      break;
    }
    case 2: {
      who(cam, out, 1, GRANDMA, "gran", GRAN, { expr: "smile" }, t, KIDP);
      who(cam, out, 10, GRANDKID, "kid", [2.7, 0, 5.6], { expr: "neutral" }, t, BAGS);
      inTaxi(id, t, cam, out, null, { expr: "neutral" });
      exhaust(id, t, out);
      break;
    }
    case 3: { // the lane's grandmas, each at her door with a note ready; one peeks from behind the neem tree
      [-8.5, -17, -25.5, -34].forEach((z, i) =>
        who(cam, out, 30 + i, GRANDMA2[i % 4], `g2_${i}`, [-5.6, 0, z], { expr: i % 2 ? "smile_closed" : "smile", reach: 0.55 + 0.1 * Math.sin(t * 2 + i), item: "note" }, t, [0, 1, z]));
      who(cam, out, 34, GRANDMA2[1], "g2_peek", [TREE[0] + 0.35, 0, TREE[2] - 0.15], { expr: at(t, 430) ? "stern" : "neutral", tilt: -9, item: "note", reach: 0.2 }, t, [0, 1, TREE[2] + 3]);
      break;
    }
    case 4: case 5: case 6: case 15: { // the doorstep exchange (15 = next month, day)
      let g: Pose = { expr: "smile" }, k: Pose = { expr: "smile_closed" };
      if (id === 4) { g = { expr: "smile", reach: at(t, 491) ? 0.85 : 0.3, item: "note" }; k = { expr: "smile", reach: at(t, 491) ? 0.7 : undefined }; }
      if (id === 5) {
        const shake = f < 660 && f >= 630 ? Math.sin((f - 630) * 0.9) * 7 : 0;
        k = at(t, 671) ? { expr: "nervous", reach: 0.85, item: "note" } : { expr: at(t, 636) ? "nervous" : "neutral", headTilt: shake };
        g = at(t, 671) ? { expr: "smile_closed", reach: 0.6 } : { expr: "smile", reach: 0.4 };
      }
      if (id === 6) { g = { expr: "whistle" }; k = { expr: at(t, 741) ? "neutral" : "smile", look: at(t, 741) ? -1 : 0, pocket: at(t, 741) }; }
      if (id === 15) {
        k = at(t, 2036) ? { expr: "neutral", item: "wad", reach: 0.3 } : at(t, 1948) ? { expr: "smile", reach: 0.9, item: "coin" } : { expr: "smile_closed" };
        g = at(t, 2016) ? { expr: "laugh", reach: 0.4 } : at(t, 1995) ? { expr: "smile_closed", reach: 0.5, item: "coin" } : { expr: "smile" };
      }
      who(cam, out, 1, GRANDMA, "gran", GRAN, g, t, KIDP);
      who(cam, out, 10, GRANDKID, "kid", KIDP, k, t, GRAN);
      if (id === 4 && f >= 516) insert(4, f, out, "ins_hand" + q(clamp01((f - 516) / 20), 20), 900, 640, (p) => insertHandshake(p, q(clamp01((f - 516) / 20), 20)), 0.62);
      if (id === 15 && f >= 2021 && f < 2048) insert(15, f, out, "ins_wad" + q(clamp01((f - 2021) / 14), 20), 900, 640, (p) => insertWad(p, q(clamp01((f - 2021) / 14), 20)), 0.62);
      if (id === 15) burst(out, t, 2060, [KIDP[0] + 0.1, 1.25, KIDP[2] + 0.25], 0.55);
      if (id <= 6) { inTaxi(id, t, cam, out, null); exhaust(id, t, out); }
      break;
    }
    case 7: {
      who(cam, out, 10, GRANDKID, "kid", [0.35, 0, 5.3], { expr: at(t, 814) ? "nervous" : "neutral", look: -1 }, t, GRAN);
      who(cam, out, 1, GRANDMA, "gran", GRAN, { expr: "whistle" }, t, KIDP);
      inTaxi(id, t, cam, out, null); exhaust(id, t, out);
      // the open bag seen from above: socks with the note between them, lying in the bag's open top
      { const k = q(clamp01((f - 830) / 12), 20);
        out.fx.push({ key: "bagTop" + k, cw: 700, ch: 440, draw: (p) => insertBagTop(p, k), x: BAGS[0], y: 0.632, z: BAGS[2], w: 0.68, h: 0.42, flat: true }); }
      break;
    }
    case 8: { // Grandma at the driver's window with the note
      const [tx, , tz] = TAXI0;
      who(cam, out, 1, GRANDMA, "gran", GRAN8, { expr: at(t, 957) ? "grin" : "smile", reach: at(t, 922) ? 0.8 : 0.35, item: at(t, 935) ? undefined : "note", tilt: 6 }, t, [tx + 0.4, 1, tz - 0.4]);
      const nod = f >= 962 && f < 985 ? 8 * Math.sin((f - 962) * 0.55) : 0;
      inTaxi(id, t, cam, out, { expr: "nervous" }, { expr: at(t, 957) ? "stern" : "neutral", item: at(t, 935) ? "note" : undefined, reach: at(t, 935) ? 0.25 : undefined, headTilt: nod });
      exhaust(id, t, out);
      who(cam, out, 10, GRANDKID, "kid_out", [0.3, 0, -3.2], { expr: "nervous" }, t, GRAN8);
      break;
    }
    case 9: {
      who(cam, out, 1, GRANDMA, "gran", GRAN, { expr: "smile", wave: Math.sin(t * 8) }, t, [1, 1, -6]);
      inTaxi(id, t, cam, out, { expr: at(t, 1061) ? "grin" : "smile", wave: at(t, 1039) ? Math.sin(t * 9) : undefined }, { expr: "neutral" });
      exhaust(id, t, out);
      break;
    }
    case 10: {
      inTaxi(id, t, cam, out, { expr: at(t, 1146) ? "smile_closed" : "smile" }, { expr: "stern", reach: 0.5 });
      if (f >= 1125) insert(10, f, out, "ins_back" + q(clamp01((f - 1125) / 16), 20), 900, 640, (p) => insertHandBack(p, q(clamp01((f - 1125) / 16), 20)), 0.62);
      break;
    }
    case 11: {
      const kidE: Expr = at(t, 1290) ? "shock" : at(t, 1196) ? "smile" : "smile_closed";
      inTaxi(id, t, cam, out, { expr: kidE, item: "tiffin", reach: 0.15 }, { expr: "neutral" });
      if (f >= 1223 && f < 1290) {
        const k = q(clamp01((f - 1240) / 14), 20);
        insert(11, f, out, "ins_tiffin" + k, 900, 700, (p) => insertTiffin(p, k), 0.66);
        const c = camAt(11, f);
        burst(out, t, 1255, [c.look[0], c.look[1] + 0.05, c.look[2]], 0.5);
      }
      break;
    }
    case 12: {
      if (f < 1405) {
        who(cam, out, 1, GRANDMA, "gran", GRAN, { expr: "smile_closed", reach: 0.45, item: "coin" }, t, [1, 1, 3]);
        for (const w of [1363, 1443]) burst(out, t, w, [GRAN[0] + 0.5, 0.98, GRAN[2] + 0.45], 0.3);
      } else {
        // the zero rolls in from the left and topples flat ("ending"); the one stands and rolls away ("beginning")
        const z0 = COIN_Z0, R = 0.28;
        if (f < 1541) {
          const u = clamp01((f - 1405) / 95), x = -1.7 + 1.9 * (1 - (1 - u) ** 2);
          const fall = clamp01((f - 1500) / 21), wob = Math.sin((f - 1480) * 0.7) * (1 - fall) * 0.3 * (f > 1480 ? 1 : 0);
          if (fall < 1) card(out, `coin0`, 400, 400, (p) => fxCoin(p, 0), [x, R * (1 - fall * 0.85), z0], 2 * R * (1 - 0.6 * fall), -x / R + wob);
          else out.fx.push({ key: "coin0", cw: 400, ch: 400, draw: (p) => fxCoin(p, 0), x, y: 0.015, z: z0, w: 2 * R, h: 2 * R, flat: true });
        } else {
          out.fx.push({ key: "coin0", cw: 400, ch: 400, draw: (p) => fxCoin(p, 0), x: 0.2, y: 0.015, z: z0, w: 2 * R, h: 2 * R, flat: true });
          const u = Math.max(0, f - 1556) / 30, dz = 1.2 * u * u + 0.8 * u;
          card(out, "coin1", 400, 400, (p) => fxCoin(p, 1), [0.0, R, z0 - 1.2 - dz], 2 * R, -dz / R);
          burst(out, t, 1544, [0.0, R + 0.25, z0 - 1.2], 0.45);
        }
      }
      break;
    }
    case 13: {
      inTaxi(id, t, cam, out, { expr: at(t, 1730) ? "smile_closed" : "smile", item: "coin", reach: 0.3, look: -1 }, { expr: "neutral" });
      const [tx, , tz] = taxiAt(id, t), kind = at(t, 1730) ? 1 : 0, pop = q(smooth((f - (kind ? 1730 : 1648)) / 8), 10);
      if (f >= 1648) card(out, `thought${kind}${pop}`, 600, 520, (p) => fxThought(p, kind, Math.max(0.3, pop)), [tx - 0.45, 1.85, tz + 0.75], 0.85);
      break;
    }
    case 14: {
      inTaxi(id, t, cam, out, { expr: "smile_closed", item: "coin", reach: 1, look: -1 }, { expr: "neutral" });
      if (f >= 1833) {
        const c = camAt(14, f), d = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]], l = Math.hypot(...d);
        // the coin sits low-left of frame so the sun shows above-right of it
        const cp: V3 = [c.pos[0] + (d[0] / l) * 0.75 - 0.07, c.pos[1] + (d[1] / l) * 0.75 - 0.13, c.pos[2] + (d[2] / l) * 0.75];
        card(out, "coin1g", 400, 400, (p) => fxCoin(p, 1, 1), cp, 0.2);
        burst(out, t, 1866, [cp[0] - 0.01, cp[1] + 0.02, cp[2] + 0.01], 0.3);
      }
      break;
    }
  }
  return out;
};
export { FPS };
