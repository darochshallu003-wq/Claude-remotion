// How a tsunami crosses an ocean — a 10-second silent film in the Ukiyo-e style.
// Four beats: the wave (flash-forward, frame 0 = thumbnail) → paper wash → the quake print → the open-sea triptych (long pan)
// → the shore print (the wave slows, grows, breaks the border). Every frame is a pure function of t.
import { clamp, lerp, seg, ss, eio, eo, ei, hash, mulberry, vnoise, TAU } from '/core/lib.js';
import { W, H, FR, PAL, TX, mk, buildTextures, inkify, stampLayer, drawSeal, sealCanvas, rgba, mix, poly, smooth, carve, bokashi, kasumi } from './print.js';
import { sea, wave, foam, claw } from './wave.js';

const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const QS = new URLSearchParams(location.search);
const NOSUB = QS.has('nosub');

await document.fonts.load('400 40px Yuji', '津波THE QUAKE');
await document.fonts.load('500 40px Shippori', 'Aa'); await document.fonts.load('700 40px Shippori', 'Aa');
buildTextures();

// —————————————————— timeline (single source of truth) ——————————————————
export const DUR = 10;
const T = {
  wash: [.78, 1.0],            // the opening print floods back to paper
  s1: 1.0,                     // quake print starts printing
  print1: [1.0, 1.08, 1.16, 1.26], REVEAL: .3,
  jolt: 1.62,                  // the seafloor snaps up
  s2: 3.95, slideEnd: 4.45,    // scroll slide into the triptych, then the long pan
  s3: 6.85, grown: 8.7,        // cut to the shore; the wave slows and grows until 8.7
  tilt: [8.35, 9.35], seal: 9.25,
};
const SUBS = [
  { t0: 1.15, t1: 4.05, text: 'A quake heaves up the sea' },
  { t0: 4.10, t1: 6.95, text: 'Deep sea: low, jet-fast' },
  { t0: 7.00, t1: 10.0, text: 'Near shore: slows, grows tall' },
];
const q8 = t => Math.floor(t * 8 + 1e-6) / 8, q12 = t => Math.floor(t * 12 + 1e-6) / 12;
const REG = [[0, 0], [2.2, -1.3], [-1.8, 1.9], [1.5, 2.2]];
const SHIFT = [[4, -5], [-6, 4], [5, 5], [-5, -4]];
const CREAM = '#f3e7c6', SEA = { a: '#8db0c6', b: PAL.prusL, c: PAL.ai, d: PAL.prus, e: PAL.prusD, f: '#0f2344' };

// —————————————————— helpers ——————————————————
const cache = new Map();
function cached(key, draw, ink = {}, w = W, h = H) {
  if (cache.has(key)) return cache.get(key);
  const c = mk(w, h); draw(c.getContext('2d'));
  const hk = hash(key.length * 7.3 + key.charCodeAt(0) + key.charCodeAt(key.length - 1));
  inkify(c, { speck: ink.speck ?? .3, grain: ink.grain ?? 0, gx: hk * 400 - 200, baren: ink.baren ?? .3, bx: (hk - .5) * 300, by: (hash(hk) - .5) * 200 });
  cache.set(key, c); return c;
}
// one colour block, printed with registration offset; rev < 1 = still being printed (baren reveal)
const BL = mk();
function block(dst, g, rev, fn) {
  if (rev <= 0) return;
  const x = BL.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H); fn(x);
  if (rev >= 1) dst.drawImage(BL, REG[g][0], REG[g][1]); else stampLayer(dst, BL, rev, REG[g], SHIFT[g]);
}
// texture a live colour layer (drawn into BL) like a printed block
function liveInk(grain = .14, baren = .25, speck = .3, ox = 0) {
  const x = BL.getContext('2d'); x.save();
  x.globalCompositeOperation = 'source-atop'; x.globalAlpha = grain; x.drawImage(TX.grain, ox % W, 0); x.drawImage(TX.grain, ox % W - W, 0);
  x.globalCompositeOperation = 'destination-out'; x.globalAlpha = baren; x.drawImage(TX.baren, 0, 0);
  x.globalAlpha = speck; x.drawImage(TX.speck, 0, 0, W, H); x.restore();
}
function border(x, r = FR) {
  x.strokeStyle = PAL.sumi; x.lineWidth = 3.4; x.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
  x.lineWidth = 1.2; x.strokeRect(r.x0 - 9, r.y0 - 9, r.x1 - r.x0 + 18, r.y1 - r.y0 + 18);
}
const clipRect = (x, r) => { x.beginPath(); x.rect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); x.clip(); };
// vertical view cartouche, English set sideways; a pale-blue tab with the wave character at the top
function vsize(text, size = 34) { ctx.save(); ctx.font = `400 ${size}px Yuji`; const tw = ctx.measureText(text).width; ctx.restore(); return { w: Math.round(size * 1.95), h: tw + 46 + 52 }; }
function vcart(x, cx, y0, text, size = 34) {
  x.save(); x.font = `400 ${size}px Yuji`;
  const { w, h } = vsize(text, size), tab = 52, x0 = cx - w / 2;
  x.fillStyle = CREAM; x.fillRect(x0, y0, w, h); x.fillStyle = PAL.skyL; x.fillRect(x0, y0, w, tab);
  x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.strokeRect(x0, y0, w, h); x.lineWidth = 1.2; x.strokeRect(x0 + 5, y0 + 5, w - 10, h - 10);
  x.lineWidth = 1.5; x.beginPath(); x.moveTo(x0 + 5, y0 + tab); x.lineTo(x0 + w - 5, y0 + tab); x.stroke();
  x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '400 30px Yuji'; x.fillText('波', cx, y0 + tab / 2 + 2);
  x.font = `400 ${size}px Yuji`; x.translate(cx, y0 + tab + (h - tab) / 2); x.rotate(Math.PI / 2); x.fillText(text, 0, 3);
  x.restore();
  return { x0, y0, w, h };
}
// world → screen
const toS = (M, X, Y) => [M[0] * X + M[2] * Y + M[4], M[1] * X + M[3] * Y + M[5]];
function camMatrix(c) { const z = c.z; return [z, 0, 0, z, W / 2 - z * c.cx, H / 2 - z * c.cy]; }
function mount(M, x0, x1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#161a22'; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(...M);
  ctx.fillStyle = PAL.mount; ctx.fillRect(x0, -430, x1 - x0, 1940);
  ctx.globalAlpha = .55; ctx.globalCompositeOperation = 'multiply';
  for (let X = x0; X < x1; X += W) for (let Y = -430; Y < 1510; Y += H) ctx.drawImage(TX.paper, X, Y);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = PAL.mountD; ctx.fillRect(x0, -430, x1 - x0, 34); ctx.fillRect(x0, 1476, x1 - x0, 34);
  ctx.restore();
}

// —————————————————— small fishing boat (rowers hunched, oars down) ——————————————————
function boat(x, cx, cy, len, ang, t8, seed, n = 5) {
  const R = mulberry(seed);
  x.save(); x.translate(cx, cy); x.rotate(ang); x.scale(len / 150, len / 150); len = 150;
  const L = len / 2, hull = [[-L, -10], [-L * .55, 2], [0, 6], [L * .6, 3], [L * 1.04, -16], [L * .9, -4], [L * .55, 10], [0, 15], [-L * .6, 12], [-L * 1.02, -4]];
  // rowers: indigo backs bent forward, paper heads, oars
  for (let i = 0; i < n; i++) {
    const px = -L * .65 + i * (L * 1.25 / (n - 1)), lean = Math.sin(t8 * 5.5 + i * .9) * .18;
    x.save(); x.translate(px, -2); x.rotate(-.35 + lean);
    x.strokeStyle = PAL.sumi; x.lineWidth = 1.8; x.beginPath(); x.moveTo(-4, -6); x.lineTo(-30, 9); x.stroke();   // oar, slanted back into the hull
    x.fillStyle = '#2c4a70'; x.beginPath(); x.ellipse(0, -7, 6.5, 9, 0, 0, TAU); x.fill(); x.lineWidth = 1.4; x.stroke();
    x.fillStyle = PAL.white; x.beginPath(); x.arc(-4, -17, 4.2, 0, TAU); x.fill(); x.stroke();
    x.restore();
  }
  x.fillStyle = '#c9d6dc'; x.beginPath(); smooth(x, hull, true); x.fill();
  x.strokeStyle = PAL.sumi; x.lineWidth = 2.4; x.lineJoin = 'round'; x.beginPath(); smooth(x, hull, true); x.stroke();
  x.lineWidth = 1.3; x.beginPath(); x.moveTo(-L * .8, 2); x.quadraticCurveTo(0, 10, L * .85, -2); x.stroke();
  x.restore();
}

// ══════════════════ PRINT A · "Near the shore" (opening flash-forward and the last beat) ══════════════════
const HZ3 = 628;   // sea() draws its first row 12 px under this
const shoreSky = () => cached('s3sky', x => {
  bokashi(x, 0, FR.y0, W, 300, PAL.prus, .9, 0, { rough: 26, seed: 4 });
  bokashi(x, 0, 380, W, 640, PAL.skyL, 0, .85, { rough: 22, seed: 7 });
  kasumi(x, 520, 300, 1000, 30, PAL.skyL, .9); kasumi(x, 1500, 210, 760, 24, PAL.skyL, .7); kasumi(x, 260, 540, 620, 22, PAL.white, .8);
}, { grain: .035, baren: .38 });
const shoreLand = () => cached('s3land', x => {
  // a low headland with a fishing village, far away: pale blue, grey key line
  const top = []; for (let X = 30; X <= 640; X += 20) top.push([X, 618 - 26 * Math.exp(-Math.pow((X - 200) / 140, 2)) - 10 * Math.exp(-Math.pow((X - 430) / 90, 2)) + (vnoise(X * .03) - .5) * 6]);
  x.fillStyle = '#7f98b0'; x.beginPath(); smooth(x, top.concat([[640, 646], [30, 646]]), true); x.fill();
  const R = mulberry(8);
  for (let i = 0; i < 9; i++) {  // roofs
    const rx = 250 + i * 34 + R() * 10, ry = 626 + R() * 6, rw = 22 + R() * 8;
    x.fillStyle = PAL.prusD; x.beginPath(); poly(x, [[rx - rw / 2, ry], [rx - rw / 2 + 5, ry - 9], [rx + rw / 2 - 5, ry - 9], [rx + rw / 2, ry]]); x.fill();
  }
  for (let i = 0; i < 6; i++) { // pine pads
    const px = 120 + i * 40 + R() * 12, py = 600 - 20 * Math.exp(-Math.pow((px - 200) / 140, 2));
    x.strokeStyle = PAL.greyD; x.lineWidth = 1.6; x.beginPath(); x.moveTo(px, py + 18); x.lineTo(px + 2, py - 6); x.stroke();
    x.fillStyle = '#3d5a70'; x.beginPath(); x.ellipse(px + 2, py - 8, 11, 4, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(px - 3, py, 9, 3.4, 0, 0, TAU); x.fill();
  }
  x.strokeStyle = PAL.grey; x.lineWidth = 1.6; x.beginPath(); smooth(x, top); x.stroke();
}, { grain: .12, baren: .2 });

// wave state per time: mirror axis A (screen x of the wave's own origin), scale k, rise
function waveState(t) {
  if (t < T.s3) return { A: 1960, k: .8, rise: .9 };
  const u = seg(t, T.s3, T.grown);
  return { A: lerp(2710, 2045, eo(u)) - 14 * Math.max(0, t - T.grown), k: .95, rise: lerp(.18, 1, ss(u)) };
}
function withWave(x, s, fn) { x.save(); x.translate(s.A, 742); x.scale(-s.k, s.k); x.translate(0, -742); fn(x); x.restore(); }
const BOATS = [[372, 792, 205, 3], [585, 812, 225, 5], [790, 782, 190, 11]];
function boatsS3(x, t) {
  const t8 = q8(t);
  BOATS.forEach(([bx, by, len, sd], i) => {
    const bob = Math.sin(t8 * 3.1 + i * 2.1) * 5, tilt = Math.sin(t8 * 2.6 + i * 1.3) * .06 + (t >= T.s3 ? -.08 * ss(seg(t, 7.6, 8.8)) : 0);
    boat(x, bx, by + bob, len, tilt, t8, sd);
  });
}
function titleSlip(x) {
  const x0 = 104, y0 = 92, w = 596, h = 214;
  x.fillStyle = CREAM; x.fillRect(x0, y0, w, h); x.fillStyle = PAL.skyL; x.fillRect(x0, y0 + h - 40, w, 40);
  x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.strokeRect(x0, y0, w, h); x.lineWidth = 1.2; x.strokeRect(x0 + 6, y0 + 6, w - 12, h - 12);
  x.lineWidth = 1.5; x.beginPath(); x.moveTo(x0 + 6, y0 + h - 40); x.lineTo(x0 + w - 6, y0 + h - 40); x.stroke();
  x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '700 64px Shippori'; x.fillText('How a tsunami', x0 + w / 2, y0 + 58); x.fillText('crosses an ocean', x0 + w / 2, y0 + 126);
  x.font = '500 20px Shippori'; x.fillText('T H R E E   P R I N T S   ·   O N E   W A V E', x0 + w / 2, y0 + h - 19);
  return { x0, y0, w, h };
}
const SC = mk();
function shoreSheet(t) {
  const x = SC.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0);
  x.drawImage(TX.paper, 0, 0);
  x.save(); clipRect(x, FR);
  x.drawImage(shoreSky(), REG[1][0], REG[1][1]);
  x.drawImage(shoreLand(), REG[2][0], REG[2][1]);
  block(x, 1, 1, b => { sea(b, q12(t) * 2.2, 0, 'far', HZ3, false); liveInk(.1, .22, .25); }); // the sea is live (chop), textured like a block
  const s = waveState(t);
  withWave(x, s, w => { const G = wave(w, q12(t), s.rise, 0); s.G = G; });
  block(x, 1, 1, b => { sea(b, q12(t) * 2.2, 0, 'near', HZ3, false); liveInk(.1, .22, .25); });
  boatsS3(x, t);
  withWave(x, s, w => foam(w, s.G, q12(t), s.rise, 0, { open: 1, hold: 0 }));
  x.restore();
  border(x);
  if (t < T.s3) { const b = titleSlip(x); drawSeal(x, '津波', b.x0 + b.w + 58, b.y0 + b.h - 40, 76, 1, { seed: 9 }); }
  else { const b = vcart(x, 150, 74, 'NEAR THE SHORE'); drawSeal(x, '津波', 150, b.y0 + b.h + 52, 66, clamp((t - T.seal) / .2), { seed: 9 }); }
  x.drawImage(TX.fiber, 0, 0);
  return s;
}

// ══════════════════ PRINT B · "The quake" (a cut-away: sky, sea, seabed) ══════════════════
const SURF = 300, FX = 1000;                      // sea surface, fault top
const faultX = y => FX - (y - 745) * .38;
const bedTop = X => 768 + (vnoise(X * .012 + 3) - .5) * 26 + (vnoise(X * .05) - .5) * 8;
function lift(t) {   // right seabed block, px (negative = up): anticipation dip, snap, settle
  if (t < 1.52) return 0;
  if (t < T.jolt) return 5 * ss(seg(t, 1.52, T.jolt));
  if (t < 1.69) return lerp(5, -60, eo(seg(t, T.jolt, 1.69)));
  return lerp(-60, -50, ss(seg(t, 1.69, 1.86)));
}
function dome(X, t) {   // height of the sea surface bulge above the uplift; it splits into two swells running outward
  if (t < T.jolt) return 0;
  const a1 = 62 * ss(seg(t, T.jolt + .02, 2.08)), k = ss(seg(t, 2.1, 2.7)), d = Math.max(0, t - 2.1) * 310, sg = 250 + d * .15;
  const one = Math.exp(-Math.pow((X - FX) / 250, 2));
  const two = Math.exp(-Math.pow((X - FX - d) / sg, 2)) + Math.exp(-Math.pow((X - FX + d) / sg, 2));
  return a1 * (one * (1 - k) + two * .62 * k);
}
const surfY = (X, t) => SURF - dome(X, t) + Math.sin(X * .045 + q12(t) * 7) * 2.6 + Math.sin(X * .013 - q12(t) * 3) * 2;
const quakeSky = () => cached('s1sky', x => {
  bokashi(x, 0, FR.y0, W, 210, PAL.prus, .85, 0, { rough: 24, seed: 12 });
  bokashi(x, 0, 140, W, 300, PAL.skyL, 0, .85, { rough: 18, seed: 13 });
  kasumi(x, 640, 150, 900, 26, PAL.skyL, .9); kasumi(x, 1420, 236, 820, 22, PAL.white, .75);
}, { grain: .035, baren: .38 });
const quakeSea = () => cached('s1sea', x => {
  const stops = [[170, SEA.a], [380, SEA.b], [470, SEA.c], [560, SEA.d], [650, SEA.e], [730, SEA.f]];
  stops.forEach(([y, c], i) => { x.fillStyle = c; x.fillRect(0, y + (i ? 70 : 0), W, H); if (i) bokashi(x, 0, y, W, y + 70, c, 0, 1, { rough: 20, seed: 20 + i }); });
  // banded current lines, left as paper, very faint
  const R = mulberry(3);
  for (let k = 0; k < 16; k++) {
    const y = 360 + k * 26 + R() * 10; x.strokeStyle = rgba(PAL.white, .12 + (k < 5 ? .12 : 0)); x.lineWidth = 1.6;
    let X = R() * 200; while (X < W) { const len = 120 + R() * 260; x.beginPath(); x.moveTo(X, y + Math.sin(X * .01) * 4); x.quadraticCurveTo(X + len / 2, y - 5, X + len, y + Math.sin((X + len) * .01) * 4); x.stroke(); X += len + 40 + R() * 120; }
  }
}, { grain: .09, baren: .3 });
function bedBlock(right) {
  return cached(right ? 's1bedR' : 's1bedL', x => {
    x.save(); x.beginPath();
    const top = []; for (let X = 0; X <= W; X += 12) top.push([X, bedTop(X)]);
    const f0 = faultX(745), f1 = faultX(1140);
    if (right) poly(x, [[f0, 745]].concat(top.filter(p => p[0] > f0), [[W, 1140], [f1, 1140]]));
    else poly(x, top.filter(p => p[0] < f0).concat([[f0, 745], [f1, 1140], [0, 1140]]));
    x.clip();
    const cols = ['#33465c', '#26364a', '#3d5168', '#1c2a3d', '#2c3f57'];
    for (let k = -2; k < 12; k++) {   // parallel slanted strata
      x.fillStyle = cols[(k + 10) % 5]; x.beginPath();
      const y0 = 770 + k * 40, pts = []; for (let X = 0; X <= W; X += 40) pts.push([X, y0 + X * .05 + (vnoise(X * .02 + k) - .5) * 10]);
      poly(x, pts.concat([[W, 1300], [0, 1300]])); x.fill();
      x.strokeStyle = rgba('#8da2bd', .55); x.lineWidth = 1.6; x.beginPath(); smooth(x, pts); x.stroke();
    }
    // pebbles and rock lumps along the top
    const R = mulberry(right ? 41 : 42);
    for (let i = 0; i < 40; i++) { const X = R() * W, Y = bedTop(X) + 4 + R() * 10; x.fillStyle = '#4b6078'; x.strokeStyle = PAL.sumi; x.lineWidth = 1.4; x.beginPath(); x.ellipse(X, Y, 8 + R() * 14, 5 + R() * 6, 0, 0, TAU); x.fill(); x.stroke(); }
    x.restore();
    x.fillStyle = PAL.sumi; const top2 = []; for (let X = 0; X <= W; X += 24) top2.push([X, bedTop(X)]);
    carve(x, right ? top2.filter(p => p[0] > faultX(745)) : top2.filter(p => p[0] < faultX(745)), 3.6, { taper: [.02, .02], seed: right ? 5 : 6 });
    carve(x, [[faultX(745), 745], [faultX(900), 900], [faultX(1140), 1140]], 3.4, { taper: [.05, 0], seed: 7 });
  }, { grain: .12, baren: .2, speck: .25 }, W, 1160);
}
function quakeSheet(t) {
  const x = SC.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0);
  x.drawImage(TX.paper, 0, 0);
  const rv = g => clamp((t - T.print1[g]) / T.REVEAL), t8 = q8(t), t12 = q12(t);
  x.save(); clipRect(x, FR);
  // key block first: the frame line and the sea-surface line (border is drawn outside the clip, below)
  block(x, 1, rv(1), b => {
    b.drawImage(quakeSky(), 0, 0);
    // the sea, live: clip to the moving surface
    const pts = []; for (let X = 0; X <= W; X += 16) pts.push([X, surfY(X, t)]);
    b.save(); b.beginPath(); smooth(b, pts.concat([[W, H], [0, H]]), true); b.clip(); b.drawImage(quakeSea(), 0, 0);
    // pressure rings from the fault, left as paper
    for (let k = 0; k < 3; k++) {
      const r = (t12 - T.jolt - k * .22) * 520; if (r <= 0) continue; const a = clamp(1 - r / 760) * .55;
      b.strokeStyle = rgba(PAL.white, a); b.lineWidth = 3; b.beginPath(); b.arc(FX, 770, r, Math.PI + .2, TAU - .2); b.stroke();
    }
    // bubbles rising from the fault
    for (let i = 0; i < 16; i++) {
      const ts = T.jolt + .04 + i * .09, age = t12 - ts; if (age < 0) continue;
      const y = 760 - age * (300 + hash(i) * 160); if (y < surfY(FX, t) + 12) continue;
      const X = FX + (hash(i + 9) - .5) * 120 + Math.sin(age * 9 + i) * 8, r = 3 + hash(i + 3) * 5;
      b.fillStyle = PAL.white; b.strokeStyle = PAL.prusD; b.lineWidth = 1.3; b.beginPath(); b.arc(X, y, r, 0, TAU); b.fill(); b.stroke();
    }
    b.restore();
    b.fillStyle = PAL.prusD; carve(b, pts, 3.2, { taper: [0, 0], seed: 3, jit: .3 });
    // small foam on the bulge(s)
    const hs = []; for (let X = 60; X < W; X += 30) { const d = dome(X, t), dl = dome(X - 30, t), dr = dome(X + 30, t); if (d > 24 && d >= dl && d >= dr) hs.push([X, d]); }
    hs.forEach(([X, d], j) => { const y = surfY(X, t), s = clamp((d - 20) / 30); for (let k = -1; k <= 1; k++) claw(b, X + k * 14, y + 2, -Math.PI / 2 + k * .6 + Math.sin(t12 * 9 + k) * .1, 22 * s + 6, 9, k < 0 ? -.5 : .5, { lw: 1.6 }); });
  });
  // the seabed: left block holds, right block jolts up along the fault
  block(x, 2, rv(2), b => {
    b.drawImage(bedBlock(false), 0, 0);
    b.drawImage(bedBlock(true), 0, lift(t));
    // quake rays at the hypocentre, left as paper
    if (t >= T.jolt && t < 2.4) {
      const u = seg(t12, T.jolt, 2.4), cx = faultX(900), cy = 900 + lift(t) * .5;
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * TAU + .13, r0 = 26 + u * 40, r1 = r0 + (48 + hash(i + Math.floor(t12 * 12)) * 60) * (1 - u * .6);
        b.fillStyle = rgba(PAL.paper, .9 * (1 - u)); carve(b, [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]], 7, { taper: [.1, .9], seed: i, per: 3 });
      }
    }
  });
  // figures block: a lone fishing boat riding the bulge
  block(x, 3, rv(3), b => {
    const X = 430, y = surfY(X, t), sl = (surfY(X + 30, t) - surfY(X - 30, t)) / 60;
    boat(b, X, y - 6 + Math.sin(t8 * 3) * 2, 120, Math.atan(sl) * .8, t8, 21, 4);
  });
  x.restore();
  block(x, 0, rv(0), b => border(b));
  let cb = null; block(x, 3, rv(3), b => { cb = vcart(b, 1650, 80, 'THE QUAKE'); });
  x.drawImage(TX.fiber, 0, 0);
  return cb;
}

// ══════════════════ PRINT C · "The open sea" (a triptych: three sheets, one sea) ══════════════════
const PW = 1280, PG = 30, PANES = [-200 - PW, -200 - 2 * PW - PG, -200 - 3 * PW - 2 * PG];   // x0 of each pane, right → left
const PX0 = PANES[2], PXW = 3 * PW + 2 * PG, HZ2 = 470;
const paneFrame = x0 => ({ x0: x0 + 28, y0: FR.y0, x1: x0 + PW - 28, y1: FR.y1 });
const panSky = () => cached('s2sky', x => {
  bokashi(x, 0, FR.y0, PXW, 260, PAL.prus, .9, 0, { rough: 26, seed: 31 });
  bokashi(x, 0, 280, PXW, HZ2, PAL.skyL, 0, .8, { rough: 22, seed: 33 });
  [[600, 330, 1100, 26], [1900, 280, 900, 22], [2900, 360, 1300, 30], [3500, 250, 700, 20]].forEach(([cx, cy, w, h]) => kasumi(x, cx, cy, w, h, PAL.skyL, .9));
  [[1400, 420, 800, 18], [3000, 430, 600, 16]].forEach(([cx, cy, w, h]) => kasumi(x, cx, cy, w, h, PAL.white, .8));
}, { grain: .035, baren: .38 }, PXW, H);
const panLand = () => cached('s2land', x => {
  // far coasts on the horizon at both ends: the origin (right) and the shore ahead (left)
  const isle = (a, b, hgt, seed) => {
    const pts = []; for (let X = a; X <= b; X += 18) { const u = (X - a) / (b - a); pts.push([X, HZ2 - hgt * Math.pow(Math.sin(u * Math.PI), .7) * (.75 + .25 * vnoise(X * .02 + seed))]); }
    x.fillStyle = '#8fa6ba'; x.beginPath(); poly(x, pts.concat([[b, HZ2 + 4], [a, HZ2 + 4]])); x.fill();
    x.strokeStyle = PAL.grey; x.lineWidth = 1.5; x.beginPath(); smooth(x, pts); x.stroke();
  };
  isle(40, 520, 34, 1); isle(560, 760, 16, 2); isle(PXW - 620, PXW - 200, 22, 3);
}, { grain: .12, baren: .2 }, PXW, H);
const swellX = t => -600 - 1317 * (t - T.slideEnd);
const swell = (X, t) => 40 * Math.exp(-Math.pow((X - swellX(t)) / 380, 2)) - 6 * Math.exp(-Math.pow((X - swellX(t) - 520) / 300, 2));
function openRows(x, xa, xb, t) {
  const tq = q12(t) * 2.2;
  for (let r = 0; r < 10; r++) {
    const u = r / 9, y = HZ2 + 6 + 560 * Math.pow(u, 1.45), sc = .25 + u * 1.1, wl = 200 * sc, amp = 9 * sc;
    const drift = (tq * 24 * sc + r * 71) % wl, pts = [];
    for (let X = Math.floor((xa - 2 * wl) / wl) * wl + drift; X < xb + wl; X += wl / 8) {
      const p = (((X - drift) / wl) % 1 + 1) % 1;
      pts.push([X, y - amp * Math.pow(Math.abs(Math.sin(p * Math.PI)), 3.2) - swell(X, t) * (.8 + .2 * u)]);
    }
    const g = x.createLinearGradient(0, y - 40, 0, y + 120 * sc); g.addColorStop(0, mix(PAL.prusL, PAL.prus, u * .6)); g.addColorStop(1, PAL.prus);
    x.fillStyle = g; x.beginPath(); poly(x, pts.concat([[xb + wl, y + 200 * sc], [xa - wl * 2, y + 200 * sc]])); x.fill();
    x.strokeStyle = rgba(PAL.sky, .5); x.lineWidth = 1 + sc * 1.3;
    x.beginPath(); smooth(x, pts.map(([a, b]) => [a + 8 * sc, b + 10 * sc])); x.stroke();
    x.strokeStyle = PAL.prusD; x.lineWidth = 1.3 + sc * 1.2; x.beginPath(); smooth(x, pts); x.stroke();
    // the swell's crest: a long low ridge marked by thin paper-white lines (no breaking foam: it is low out here)
    if (r >= 2) {
      const sx = swellX(t), seg2 = pts.filter(p => Math.abs(p[0] - sx) < 300);
      if (r >= 4 && seg2.length > 2) { const pk = seg2.reduce((a, b) => b[1] < a[1] ? b : a); for (let k = 0; k < 3; k++) claw(x, pk[0] - 10 * sc + k * 11 * sc, pk[1] + 1, -1.9 + k * .45 + Math.sin(tq * 6 + k + r) * .12, 16 * sc, 7 * sc, -.9, { lw: 1.2 + sc * .4 }); }
      for (let j = 1; j < seg2.length; j++) { const m = (seg2[j][0] + seg2[j - 1][0]) / 2, a = Math.exp(-Math.pow((m - sx) / 240, 2)); x.strokeStyle = rgba(PAL.white, .9 * a); x.lineWidth = (1.6 + sc) * (.4 + .6 * a); x.beginPath(); x.moveTo(seg2[j - 1][0], seg2[j - 1][1] + 3 * sc); x.lineTo(seg2[j][0], seg2[j][1] + 3 * sc); x.stroke(); }
    }
  }
}
function jet(x, px, py, s) {   // a small jet in grey key line, nose left, with a long contrail
  const g = x.createLinearGradient(px + 100 * s, 0, px + 900 * s, 0); g.addColorStop(0, rgba(PAL.white, .85)); g.addColorStop(1, rgba(PAL.white, 0));
  x.strokeStyle = g; x.lineCap = 'round';
  [[-4, 3], [4, 3]].forEach(([dy, lw]) => { x.lineWidth = lw * s; x.beginPath(); x.moveTo(px + 104 * s, py + dy * s); x.lineTo(px + 900 * s, py + dy * s * 2.2); x.stroke(); });
  const body = [[px, py], [px + 14 * s, py - 6 * s], [px + 100 * s, py - 5 * s], [px + 112 * s, py - 2 * s], [px + 112 * s, py + 3 * s], [px + 14 * s, py + 6 * s]];
  const wingN = [[px + 40 * s, py + 3 * s], [px + 74 * s, py + 36 * s], [px + 84 * s, py + 36 * s], [px + 64 * s, py + 3 * s]];
  const wingF = [[px + 44 * s, py - 4 * s], [px + 70 * s, py - 24 * s], [px + 78 * s, py - 24 * s], [px + 64 * s, py - 4 * s]];
  const fin = [[px + 92 * s, py - 4 * s], [px + 106 * s, py - 28 * s], [px + 113 * s, py - 28 * s], [px + 110 * s, py - 2 * s]];
  x.fillStyle = PAL.white; x.strokeStyle = PAL.greyD; x.lineWidth = 2; x.lineJoin = 'round';
  [wingF, fin, body, wingN].forEach(p => { x.beginPath(); poly(x, p); x.fill(); x.stroke(); });
  x.strokeStyle = PAL.grey; x.lineWidth = 1.2; for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(px + (22 + i * 9) * s, py - 1.5 * s, 1.2 * s, 0, TAU); x.stroke(); }
}
const PC = mk(PW, H);
function paneSheet(i, t) {
  const x0 = PANES[i], x = PC.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0);
  x.drawImage(TX.paper, -(i * 310), 0);
  x.save(); x.translate(-x0, 0);
  const fr = paneFrame(x0); clipRect(x, fr);
  x.drawImage(panSky(), PX0 + REG[1][0], REG[1][1]); x.drawImage(panLand(), PX0 + REG[2][0], REG[2][1]);
  openRows(x, x0, x0 + PW, t);
  x.save(); x.beginPath(); x.rect(x0, HZ2 - 60, PW, H); x.clip(); x.globalCompositeOperation = 'source-atop'; x.globalAlpha = .08; x.drawImage(TX.grain, x0, 0); x.restore();
  // a fishing boat, lifted gently as the swell runs under it
  const bx = -2150; if (bx > x0 - 200 && bx < x0 + PW + 200) {
    const t8 = q8(t); boat(x, bx, 760 - swell(bx, t) * .9 + Math.sin(t8 * 3) * 2, 130, -(swell(bx + 40, t) - swell(bx - 40, t)) / 160, t8, 33, 4);
  }
  const sx = swellX(t); if (sx > x0 - 1000 && sx < x0 + PW + 200) jet(x, sx - 40, 196, 1);
  x.restore();
  border(x, { x0: 28, y0: FR.y0, x1: PW - 28, y1: FR.y1 });
  let cb = null; if (i === 0) cb = vcart(x, PW - 120, 74, 'THE OPEN SEA');
  x.drawImage(TX.fiber, 0, 0);
  return cb;
}

// —————————————————— camera ——————————————————
function hermite(t, k) {   // keys [t, x, v]
  for (let i = 0; i < k.length - 1; i++) {
    const [t0, p0, m0] = k[i], [t1, p1, m1] = k[i + 1]; if (t > t1 && i < k.length - 2) continue;
    const d = t1 - t0, u = clamp((t - t0) / d), u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * d * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * d * m1;
  }
}
const PAN_V = -858;
function camera(t) {
  if (t < T.s1) return { cx: 960, cy: lerp(540, 532, t), z: lerp(1, 1.028, ss(t / T.s1)) };
  if (t < T.s2) {
    const u = ss(seg(t, 1.5, 3.85)), c = { cx: 960, cy: lerp(540, 520, u), z: lerp(1, 1.1, u) };
    const sh = 1 - seg(t, T.jolt, 1.98); if (t >= T.jolt && sh > 0) { const f = Math.floor(t * 24); c.cx += (hash(f) - .5) * 16 * sh; c.cy += (hash(f + 77) - .5) * 12 * sh; }
    return c;
  }
  if (t < T.s3) {
    const u = seg(t, T.s2, T.slideEnd);
    const cx = hermite(t, [[T.s2, 960, 0], [T.slideEnd, -1120, PAN_V], [T.s3, -1120 + PAN_V * (T.s3 - T.slideEnd), PAN_V]]);
    return { cx, cy: lerp(520, 540, eio(u)), z: lerp(1.1, 1, eio(u)) - .05 * Math.sin(Math.PI * u) };
  }
  const p = ss(seg(t, T.s3, T.tilt[0])), q = eio(seg(t, ...T.tilt)), r = seg(t, T.tilt[1], DUR);
  return { cx: lerp(lerp(960, 1000, p), 1000, q), cy: lerp(lerp(540, 556, p), 424, q) - 10 * r, z: lerp(lerp(1, 1.04, p), .92, q) - .015 * r };
}

// —————————————————— subtitles (screen space: a printed horizontal cartouche) ——————————————————
function subBox(s) { ctx.font = '500 42px Shippori'; const tw = ctx.measureText(s.text).width, w = tw + 150, h = 74; return { x0: (W - w) / 2, y0: H - 72 - h, w, h }; }
function subtitle(t) {
  const s = SUBS.find(s => t >= s.t0 - .05 && t < s.t1 + (s.t1 >= DUR ? 1 : 0)); if (!s) return;
  const a = clamp((t - s.t0 + .05) / .22), fo = s.t1 >= DUR ? 1 : 1 - clamp((t - (s.t1 - .2)) / .2);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const { x0, y0, w, h } = subBox(s);
  ctx.globalAlpha = fo;
  const x = BL.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
  x.fillStyle = 'rgba(243,231,198,.96)'; x.fillRect(x0, y0, w, h);
  x.strokeStyle = PAL.sumi; x.lineWidth = 2.6; x.strokeRect(x0, y0, w, h); x.lineWidth = 1; x.strokeRect(x0 + 5, y0 + 5, w - 10, h - 10);
  x.fillStyle = PAL.sumi; x.textAlign = 'left'; x.textBaseline = 'middle'; x.font = '500 42px Shippori'; x.fillText(s.text, x0 + 96, y0 + h / 2 + 2);
  const sc = sealCanvas('波', 40, { seed: 17, col: PAL.prus }); x.drawImage(sc, x0 + 30, y0 + h / 2 - sc.height / 2);
  if (a >= 1) ctx.drawImage(BL, 0, 0); else stampLayer(ctx, BL, a, [0, 0], [4, -3]);
  ctx.restore();
}

// —————————————————— render ——————————————————
const LAST = {};
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const cam = camera(t), M = camMatrix(cam); LAST.M = M; LAST.boxes = {};
  if (t < T.s1 || t >= T.s3) {
    mount(M, -400, W + 400);
    const s = shoreSheet(t);
    ctx.setTransform(...M); ctx.drawImage(SC, 0, 0);
    // the crest breaks out through the top border into the mount
    if (s.rise > .93 && t >= T.s3) {
      ctx.save(); ctx.beginPath(); ctx.rect(FR.x0, -600, FR.x1 - FR.x0, FR.y0 + 603); ctx.clip();
      withWave(ctx, s, w => { const G = wave(w, q12(t), s.rise, 0); foam(w, G, q12(t), s.rise, 0, { open: 1, hold: 0 }); });
      ctx.restore();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t < T.s1) { // wash back to paper (the paper is the white)
      const u = seg(t, ...T.wash); if (u > 0) stampLayer(ctx, TX.paper, u, [0, 0], [0, 0]);
    }
  } else {
    mount(M, PANES[2] - 300, W + 300);
    const half = W / 2 / cam.z + 40;
    if (cam.cx + half > 0) { LAST.boxes.quake = quakeSheet(t); ctx.setTransform(...M); ctx.drawImage(SC, 0, 0); }
    if (t >= T.s2) PANES.forEach((x0, i) => {
      if (x0 > cam.cx + half || x0 + PW < cam.cx - half) return;
      const cb = paneSheet(i, t); ctx.setTransform(...M); ctx.drawImage(PC, x0, 0); if (cb) LAST.boxes.open = { ...cb, x0: cb.x0 + x0 };
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  if (!NOSUB) subtitle(t);
}
window.render = render;
window.DUR = DUR;
window.EV = [];   // silent film: no sound events
window.TEXTS = t => {
  const out = [], M = camMatrix(camera(t)), box = (b, id, text, pass) => {
    const [a0, b0] = toS(M, b.x0, b.y0), [a1, b1] = toS(M, b.x0 + b.w, b.y0 + b.h); out.push({ id, text, x0: a0, y0: b0, x1: a1, y1: b1, pass });
  };
  // the title is the thumbnail and the video's own title: shown at frame 0, not timed
  if (t < T.wash[1]) box({ x0: 104, y0: 92, w: 596, h: 214 }, 'title', 'How a tsunami crosses an ocean', true);
  if (t >= T.print1[3] && t < T.s2 + .25) { const v = vsize('THE QUAKE'); box({ x0: 1650 - v.w / 2, y0: 80, ...v }, 'v1', 'THE QUAKE'); }
  if (t >= T.s2 && t < T.s3) out.push({ id: 'v2', text: 'THE OPEN SEA', x0: 0, y0: 0, x1: 10, y1: 10, pass: true });   // passed by in the pan
  if (t >= T.s3) { const v = vsize('NEAR THE SHORE'); box({ x0: 150 - v.w / 2, y0: 74, ...v }, 'v3', 'NEAR THE SHORE'); }
  return out;
};
window.SUBS = SUBS;
window.READY = true;
