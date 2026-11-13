// How old is this tree? — a vertical (1080×1920) 10-second silent film in the Ukiyo-e style.
// The log (frame 0 = thumbnail) → wash → "year by year": the rings print one a year, a seasons inset beside them
// → handscroll slide → "counting": a pointer counts the dark rings from the pith out, 1…12 → back to the log, pull back.
import { clamp, lerp, seg, ss, eio, eo, hash, mulberry, vnoise, TAU } from '/core/lib.js';
import { W, H, FR, PAL, TX, mk, buildTextures, stampLayer, drawSeal, sealCanvas, rgba, mix, poly, smooth, carve, bokashi, kasumi } from './print.js';

const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const QS = new URLSearchParams(location.search);
const NOSUB = QS.has('nosub');
await document.fonts.load('400 40px Yuji', '年輪THE');
await document.fonts.load('500 40px Shippori', 'Aa'); await document.fonts.load('700 40px Shippori', 'Aa');
buildTextures();

// —————————————————— timeline ——————————————————
export const DUR = 10;
const T = {
  wash: [.78, 1.0], s1: 1.0, print1: [1.0, 1.08, 1.16, 1.26], REVEAL: .3,
  grow: [1.45, .2],              // year 1 starts at 1.45, one year per 0.2 s → 12 years by 3.85
  s2: 3.95, slideEnd: 4.5, count: [4.55, .16],   // ring k counted at 4.55 + k·0.16
  s3: 6.85, pull: [6.85, 9.0], seal: 9.25,
};
const SUBS = [
  { t0: 1.15, t1: 4.05, text: 'One ring grows each year' },
  { t0: 4.10, t1: 6.95, text: 'Count dark rings, centre out' },
  { t0: 7.00, t1: 10.0, text: '12 rings = 12 years old' },
];
const q8 = t => Math.floor(t * 8 + 1e-6) / 8, q12 = t => Math.floor(t * 12 + 1e-6) / 12;
const REG = [[0, 0], [2.2, -1.3], [-1.8, 1.9], [1.5, 2.2]];
const SHIFT = [[4, -5], [-6, 4], [5, 5], [-5, -4]];
const CREAM = '#f3e7c6', SUB_Y = H - 480;
const WOOD = { early: '#e8cf98', earlyC: '#dcb878', late: '#7a5634', lateD: '#5e4129', bark: '#4a3424', barkL: '#6e5038', inner: '#b08456' };
const GREEN = { l: '#b5c07a', m: '#8aa152', d: '#50703c', pine: '#3e5a3a' };

// —————————————————— helpers ——————————————————
const cache = new Map();
function cached(key, draw, ink = {}) {
  if (cache.has(key)) return cache.get(key);
  const c = mk(); draw(c.getContext('2d'));
  const x = c.getContext('2d'), hk = hash(key.length * 7.3 + key.charCodeAt(0) + key.charCodeAt(key.length - 1));
  x.save();
  if (ink.grain) { x.globalCompositeOperation = 'source-atop'; x.globalAlpha = ink.grain; x.drawImage(TX.grain, hk * 200 - 100, 0); }
  x.globalCompositeOperation = 'destination-out'; x.globalAlpha = ink.baren ?? .3; x.drawImage(TX.baren, (hk - .5) * 200, (hash(hk) - .5) * 300);
  x.globalAlpha = ink.speck ?? .3; x.drawImage(TX.speck, 0, 0, W, H); x.restore();
  cache.set(key, c); return c;
}
const BL = mk();
function block(dst, g, rev, fn) {
  if (rev <= 0) return;
  const x = BL.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H); fn(x);
  if (rev >= 1) dst.drawImage(BL, REG[g][0], REG[g][1]); else stampLayer(dst, BL, rev, REG[g], SHIFT[g]);
}
function liveInk(grain = .05, baren = .2, speck = .25) {
  const x = BL.getContext('2d'); x.save();
  x.globalCompositeOperation = 'source-atop'; x.globalAlpha = grain; x.drawImage(TX.grain, 0, 0);
  x.globalCompositeOperation = 'destination-out'; x.globalAlpha = baren; x.drawImage(TX.baren, 0, 0);
  x.globalAlpha = speck; x.drawImage(TX.speck, 0, 0, W, H); x.restore();
}
function border(x, r = FR) {
  x.strokeStyle = PAL.sumi; x.lineWidth = 3.4; x.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
  x.lineWidth = 1.2; x.strokeRect(r.x0 - 9, r.y0 - 9, r.x1 - r.x0 + 18, r.y1 - r.y0 + 18);
}
const clipRect = (x, r) => { x.beginPath(); x.rect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); x.clip(); };
function vsize(text, size = 36) { ctx.save(); ctx.font = `400 ${size}px Yuji`; const tw = ctx.measureText(text).width; ctx.restore(); return { w: Math.round(size * 1.95), h: tw + 46 + 54 }; }
function vcart(x, cx, y0, text, size = 36) {
  x.save(); const { w, h } = vsize(text, size), tab = 54, x0 = cx - w / 2;
  x.fillStyle = CREAM; x.fillRect(x0, y0, w, h); x.fillStyle = GREEN.l; x.fillRect(x0, y0, w, tab);
  x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.strokeRect(x0, y0, w, h); x.lineWidth = 1.2; x.strokeRect(x0 + 5, y0 + 5, w - 10, h - 10);
  x.lineWidth = 1.5; x.beginPath(); x.moveTo(x0 + 5, y0 + tab); x.lineTo(x0 + w - 5, y0 + tab); x.stroke();
  x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '400 32px Yuji'; x.fillText('木', cx, y0 + tab / 2 + 2);
  x.font = `400 ${size}px Yuji`; x.translate(cx, y0 + tab + (h - tab) / 2); x.rotate(Math.PI / 2); x.fillText(text, 0, 3);
  x.restore(); return { x0, y0, w, h };
}
const toS = (M, X, Y) => [M[0] * X + M[2] * Y + M[4], M[1] * X + M[3] * Y + M[5]];
function camMatrix(c) { const z = c.z; return [z, 0, 0, z, W / 2 - z * c.cx, H / 2 - z * c.cy]; }
function mount(M, x0, x1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#161a22'; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(...M); const y0 = -520, y1 = H + 520;
  ctx.fillStyle = PAL.mount; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.globalAlpha = .55; ctx.globalCompositeOperation = 'multiply';
  for (let X = x0; X < x1; X += W) for (let Y = y0; Y < y1; Y += H) ctx.drawImage(TX.paper, X, Y);
  ctx.restore();
}

// —————————————————— the cross-section (one engine for every print) ——————————————————
// ring widths: wet years wide, dry years narrow; RS = outer edge of each ring as a fraction of the wood radius
const RW = [1.25, 1.4, 1.15, .85, 1.45, 1.1, .55, .65, 1.2, 1.0, .75, .9], NR = RW.length;
const RS = []; { let s = 0; const tot = RW.reduce((a, b) => a + b); RW.forEach(w => { s += w / tot; RS.push(s); }); }
const LATE = .26;   // the dark latewood is the outer quarter of each ring
const shapeR = (f, a) => f * (1 + (.03 * Math.sin(2 * a + .7) + .02 * Math.sin(3 * a + 1.9) + .012 * Math.sin(5 * a + .3)) * Math.min(1, f * 2.2));
// ring centres drift from the pith (off-centre, as real trees are) toward the disc centre
const ringPt = (D, f, a) => { const px = D.cx + D.R * .07, py = D.cy - D.R * .05, cx = lerp(px, D.cx, f), cy = lerp(py, D.cy, f), r = D.R * shapeR(f, a); return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
const ringPath = (D, f) => { const p = []; for (let i = 0; i < 120; i++) p.push(ringPt(D, f, i / 120 * TAU)); return p; };
function fillRing(x, D, f, col) { if (f <= .002) return; x.fillStyle = col; x.beginPath(); smooth(x, ringPath(D, f), true); x.fill(); }
// D = {cx, cy, R (wood radius), bark}; n = years grown (float 0…12)
function disc(x, D, n, { cracks = false } = {}) {
  const k0 = Math.min(NR, Math.ceil(n - 1e-6)), g = n - Math.floor(n), full = Math.floor(n);
  let outer = 0;
  if (n > 0) { const a = k0 > 1 ? RS[k0 - 2] : 0, b = RS[k0 - 1], gg = k0 <= full ? 1 : g; outer = a + (b - a) * Math.min(1, gg / .74 * (1 - LATE)) + (gg > .74 ? (b - a) * LATE * (gg - .74) / .26 : 0); }
  const fOut = Math.max(outer, .04);
  // bark: a dark rim, fissured, around the current outer edge
  const bw = D.bark * (.4 + .6 * clamp(n / 4));
  { const p = ringPath(D, fOut).map(([px, py]) => { const dx = px - D.cx, dy = py - D.cy, d = Math.hypot(dx, dy) || 1; return [px + dx / d * bw, py + dy / d * bw]; });
    x.fillStyle = WOOD.bark; x.beginPath(); smooth(x, p, true); x.fill();
    x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.beginPath(); smooth(x, p, true); x.stroke();
    x.strokeStyle = WOOD.barkL; x.lineWidth = 2; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU + hash(i) * .1, [qx, qy] = ringPt(D, fOut, a), dx = qx - D.cx, dy = qy - D.cy, d = Math.hypot(dx, dy) || 1; x.beginPath(); x.moveTo(qx + dx / d * bw * .25, qy + dy / d * bw * .25); x.lineTo(qx + dx / d * bw * .85, qy + dy / d * bw * .85); x.stroke(); }
    fillRing(x, D, fOut + bw / D.R * .25, WOOD.inner); }
  // rings, outer → inner: each ring = dark latewood edge, then pale earlywood inside it
  for (let k = k0 - 1; k >= 0; k--) {
    const a = k ? RS[k - 1] : 0, b = RS[k], gg = k < full ? 1 : g, w = b - a;
    const early = a + w * (1 - LATE) * Math.min(1, gg / .74);
    if (gg > .74) { const lo = a + w * (1 - LATE) + w * LATE * clamp((gg - .74) / .26); fillRing(x, D, lo, k % 2 ? WOOD.late : WOOD.lateD); }
    fillRing(x, D, early, mix(WOOD.early, WOOD.earlyC, 1 - k / NR));
    if (gg > .74) { x.strokeStyle = rgba(PAL.sumi, .55); x.lineWidth = 1.5; x.beginPath(); smooth(x, ringPath(D, Math.min(b, a + w * (1 - LATE) + w * LATE * clamp((gg - .74) / .26))), true); x.stroke(); }
  }
  // pith
  const [px, py] = ringPt(D, 0, 0); x.fillStyle = WOOD.lateD; x.beginPath(); x.arc(px, py, Math.max(3, D.R * .018), 0, TAU); x.fill();
  if (cracks) { x.fillStyle = rgba(PAL.sumi, .8); [[.6, .7], [2.6, .45], [4.4, .55]].forEach(([a, l]) => { const p0 = ringPt(D, 1.02, a), p1 = ringPt(D, 1 - l, a + .04); carve(x, [p0, [lerp(p0[0], p1[0], .5) + 4, lerp(p0[1], p1[1], .5)], p1], 5, { taper: [0, .9], seed: a * 10 }); }); }
  x.strokeStyle = PAL.sumi; x.lineWidth = 2.6; x.beginPath(); smooth(x, ringPath(D, fOut), true); x.stroke();
  return fOut;
}
// the counting ray: where it crosses the outer edge of the dark band of ring k
const RAY = -1.0;
const crossPt = (D, k) => ringPt(D, RS[k] - .004, RAY);
function counted(x, D, t, upto, size = 26, big = false) {
  const [p0x, p0y] = ringPt(D, 0, 0), end = ringPt(D, 1.0, RAY), m = upto >= NR ? 1 : upto > 0 ? RS[Math.floor(upto) - 1] : 0;
  const tip = upto <= 0 ? [p0x, p0y] : upto >= NR ? end : crossPt(D, Math.floor(upto) - 1);
  // the ray, drawn as far as the count has reached
  x.strokeStyle = PAL.sumi; x.lineWidth = Math.max(2, size * .1); x.setLineDash([size * .5, size * .3]); x.beginPath(); x.moveTo(p0x, p0y); x.lineTo(tip[0], tip[1]); x.stroke(); x.setLineDash([]);
  const nx = Math.cos(RAY + Math.PI / 2), ny = Math.sin(RAY + Math.PI / 2);
  for (let k = 0; k < Math.floor(upto); k++) {
    const [cx, cy] = crossPt(D, k), side = k % 2 ? 1 : -1, last = k === NR - 1 && big, r = (last ? size * 1.5 : size * .78), off = (last ? r + 10 : r + 6) * side;
    const age = t - (T.count[0] + k * T.count[1]), s = big ? lerp(1.5, 1, ss(clamp(age / .12))) : 1;
    x.save(); x.translate(cx + nx * off, cy + ny * off); x.scale(s, s);
    x.fillStyle = CREAM; x.strokeStyle = PAL.sumi; x.lineWidth = 2; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill(); x.stroke();
    x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 ${last ? size * 1.6 : size}px Shippori`; x.fillText(String(k + 1), 0, 2);
    x.restore();
    x.fillStyle = PAL.sumi; x.beginPath(); x.arc(cx, cy, Math.max(3, size * .16), 0, TAU); x.fill();
  }
  return tip;
}

// —————————————————— landscape pieces ——————————————————
function mountains(x, base, cols) {
  cols.forEach(([col, y, amp, seed]) => {
    const p = []; for (let X = -20; X <= W + 20; X += 20) p.push([X, y - amp * (.55 + .45 * Math.sin(X * .006 + seed)) * (.7 + .3 * vnoise(X * .01 + seed)) - amp * .5 * Math.max(0, Math.sin(X * .0035 + seed * 2))]);
    x.fillStyle = col; x.beginPath(); smooth(x, p.concat([[W + 20, base], [-20, base]]), true); x.fill();
    x.strokeStyle = rgba(PAL.greyD, .6); x.lineWidth = 1.6; x.beginPath(); smooth(x, p); x.stroke();
  });
}
function pine(x, bx, by, h, s = 1, t8 = 0, sway = 0) {   // flat needle pads on a leaning trunk
  const lean = sway * Math.sin(t8 * 2.4 + bx) * .02;
  x.fillStyle = WOOD.lateD; carve(x, [[bx, by], [bx + 6 * s, by - h * .5], [bx - 4 * s + lean * h, by - h]], 12 * s, { taper: [0, .7], seed: bx });
  const R = mulberry(Math.floor(bx * 7 + by));
  for (let i = 0; i < 5; i++) {
    const u = .35 + i * .15, py = by - h * u, px = bx + (R() - .5) * 24 * s + lean * h * u, w = (110 - i * 14) * s * (.8 + R() * .4), hh = 30 * s;
    x.fillStyle = i % 2 ? GREEN.pine : GREEN.d; x.beginPath(); x.ellipse(px + (i % 2 ? 20 : -20) * s, py, w / 2, hh / 2, 0, 0, TAU); x.fill();
    x.strokeStyle = PAL.sumi; x.lineWidth = 1.6; x.beginPath(); x.ellipse(px + (i % 2 ? 20 : -20) * s, py, w / 2, hh / 2, 0, Math.PI, TAU); x.stroke();
    x.strokeStyle = rgba(GREEN.l, .7); x.lineWidth = 1.2; for (let k = -3; k <= 3; k++) { x.beginPath(); x.moveTo(px + (i % 2 ? 20 : -20) * s + k * w * .12, py - hh * .1); x.lineTo(px + (i % 2 ? 20 : -20) * s + k * w * .14, py - hh * .45); x.stroke(); }
  }
}
function grass(x, X0, X1, y, n, seed, t8) {
  const R = mulberry(seed);
  for (let i = 0; i < n; i++) {
    const gx = X0 + R() * (X1 - X0), gy = y + R() * 60, h = 20 + R() * 30, sw = Math.sin(t8 * 3 + i) * 4;
    x.strokeStyle = i % 3 ? GREEN.d : GREEN.pine; x.lineWidth = 2.2; x.lineCap = 'round';
    for (let k = -1; k <= 1; k++) { x.beginPath(); x.moveTo(gx + k * 4, gy); x.quadraticCurveTo(gx + k * 8, gy - h * .6, gx + k * 12 + sw, gy - h); x.stroke(); }
  }
}

// ══════════════════ PRINT A · "The fallen cedar" (thumbnail and ending) ══════════════════
const LOG = { cx: 470, cy: 1040, R: 270, bark: 30 };
const TITLE = { x0: 110, y0: 116, w: 860, h: 320 };
const logSky = () => cached('Asky', x => {
  bokashi(x, 0, FR.y0, W, 520, PAL.prus, .82, 0, { rough: 26, seed: 4 });
  bokashi(x, 0, 520, W, 760, PAL.beniP, 0, .45, { rough: 22, seed: 7 });
  kasumi(x, 420, 560, 760, 28, PAL.skyL, .85); kasumi(x, 700, 690, 520, 22, PAL.white, .8);
  mountains(x, 900, [['#a9bccb', 760, 120, 1], ['#7f98b0', 820, 90, 4]]);
  kasumi(x, 540, 830, 1100, 40, PAL.white, .85);
}, { grain: .03, baren: .38 });
const logGround = () => cached('Aground', x => {
  // two hills, flat layered greens
  const hill = (y, amp, col, seed) => { const p = []; for (let X = -20; X <= W + 20; X += 20) p.push([X, y - amp * Math.sin(X * .003 + seed) - 10 * vnoise(X * .02 + seed)]); x.fillStyle = col; x.beginPath(); smooth(x, p.concat([[W + 20, H], [-20, H]]), true); x.fill(); x.strokeStyle = PAL.sumi; x.lineWidth = 2; x.beginPath(); smooth(x, p); x.stroke(); };
  hill(930, 30, GREEN.l, 1); hill(1180, 40, GREEN.m, 2.3); hill(1420, 26, GREEN.d, 4.1);
  bokashi(x, 0, 1180, W, 1300, GREEN.d, .0, .35, { rough: 18, seed: 9 });
  // a woodcutter's path: parallel slanted strokes
  x.strokeStyle = rgba('#c9a45c', .8); x.lineWidth = 3; for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(140 + i * 30, 1760 + i * 8); x.lineTo(260 + i * 34, 1700 + i * 6); x.stroke(); }
}, { grain: .025, baren: .3 });
function logSide(x) {   // the log as a flat cylinder: far end = the same circle shifted back up-right, straight edges between
  const { cx, cy, R, bark } = LOG, Rb = R + bark, dx = 330, dy = -165, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const a0 = [cx + nx * Rb, cy + ny * Rb], a1 = [cx - nx * Rb, cy - ny * Rb];
  x.fillStyle = WOOD.bark; x.beginPath(); x.arc(cx + dx, cy + dy, Rb, 0, TAU); x.fill();
  x.beginPath(); poly(x, [a0, [a0[0] + dx, a0[1] + dy], [a1[0] + dx, a1[1] + dy], a1]); x.fill();
  x.save(); x.beginPath(); x.arc(cx + dx, cy + dy, Rb, 0, TAU); poly(x, [a0, [a0[0] + dx, a0[1] + dy], [a1[0] + dx, a1[1] + dy], a1]); x.clip();
  x.strokeStyle = WOOD.barkL; x.lineWidth = 3;
  for (let i = 0; i < 16; i++) { const u = i / 15 * 2 - 1, px = cx + nx * Rb * u, py = cy + ny * Rb * u; x.beginPath(); x.moveTo(px, py); x.lineTo(px + dx * 1.02, py + dy * 1.02 + Math.sin(i * 1.7) * 5); x.stroke(); }
  x.restore();
  x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.beginPath(); x.moveTo(a0[0], a0[1]); x.lineTo(a0[0] + dx, a0[1] + dy); x.moveTo(a1[0], a1[1]); x.lineTo(a1[0] + dx, a1[1] + dy); x.stroke();
  const ang = Math.atan2(dy, dx); x.beginPath(); x.arc(cx + dx, cy + dy, Rb, ang - Math.PI / 2, ang + Math.PI / 2); x.stroke();
  // an axe left in the top of the log
  const ax = a1[0] + dx * .45, ay = a1[1] + dy * .45 + 8;
  x.fillStyle = PAL.greyL; x.beginPath(); poly(x, [[ax - 26, ay + 10], [ax + 30, ay + 4], [ax + 36, ay - 34], [ax - 30, ay - 30]]); x.fill(); x.strokeStyle = PAL.sumi; x.lineWidth = 2.4; x.stroke();
  x.fillStyle = WOOD.inner; carve(x, [[ax, ay - 28], [ax + 40, ay - 130], [ax + 70, ay - 220]], 13, { taper: [0, .1], seed: 3 });
  x.strokeStyle = PAL.sumi; x.lineWidth = 1.6; x.beginPath(); x.moveTo(ax - 6, ay - 26); x.lineTo(ax + 63, ay - 222); x.stroke();
}
function stump(x, sx, sy, rx, t8) {   // the stump the log came from: rings seen from above, bark below
  const ry = rx * .32, hh = 90;
  x.fillStyle = WOOD.bark; x.beginPath(); x.moveTo(sx - rx, sy); x.lineTo(sx - rx - 14, sy + hh); x.quadraticCurveTo(sx, sy + hh + ry * 1.4, sx + rx + 14, sy + hh); x.lineTo(sx + rx, sy); x.closePath(); x.fill();
  x.strokeStyle = WOOD.barkL; x.lineWidth = 2.4; for (let i = -4; i <= 4; i++) { x.beginPath(); x.moveTo(sx + i * rx * .22, sy + ry * Math.sqrt(1 - Math.pow(i / 4.6, 2))); x.lineTo(sx + i * rx * .25, sy + hh + ry * .9 * Math.sqrt(1 - Math.pow(i / 4.6, 2))); x.stroke(); }
  x.strokeStyle = PAL.sumi; x.lineWidth = 2.6; x.beginPath(); x.moveTo(sx - rx, sy); x.lineTo(sx - rx - 14, sy + hh); x.quadraticCurveTo(sx, sy + hh + ry * 1.4, sx + rx + 14, sy + hh); x.lineTo(sx + rx, sy); x.stroke();
  x.save(); x.translate(sx, sy); x.scale(1, ry / rx); disc(x, { cx: 0, cy: 0, R: rx * .9, bark: rx * .1 }, NR); x.restore();
  const R = mulberry(77); for (let i = 0; i < 14; i++) { const px = sx - 300 + R() * 520, py = sy + hh + 10 + R() * 120; x.fillStyle = i % 2 ? WOOD.early : WOOD.inner; x.save(); x.translate(px, py); x.rotate(R() * 3); x.fillRect(-9, -4, 18, 8); x.strokeStyle = PAL.sumi; x.lineWidth = 1.2; x.strokeRect(-9, -4, 18, 8); x.restore(); }
}
function titleSlip(x) {
  const { x0, y0, w, h } = TITLE;
  x.fillStyle = CREAM; x.fillRect(x0, y0, w, h); x.fillStyle = GREEN.l; x.fillRect(x0, y0 + h - 52, w, 52);
  x.strokeStyle = PAL.sumi; x.lineWidth = 3.4; x.strokeRect(x0, y0, w, h); x.lineWidth = 1.3; x.strokeRect(x0 + 7, y0 + 7, w - 14, h - 14);
  x.lineWidth = 1.6; x.beginPath(); x.moveTo(x0 + 7, y0 + h - 52); x.lineTo(x0 + w - 7, y0 + h - 52); x.stroke();
  x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '700 104px Shippori'; x.fillText('How old is', x0 + w / 2, y0 + 92); x.fillText('this tree?', x0 + w / 2, y0 + 196);
  x.font = '500 26px Shippori'; x.fillText('C O U N T   T H E   R I N G S', x0 + w / 2, y0 + h - 25);
}
const SC = mk();
function logSheet(t) {
  const x = SC.getContext('2d'), t8 = q8(t); x.setTransform(1, 0, 0, 1, 0, 0);
  x.drawImage(TX.paper, 0, 0);
  x.save(); clipRect(x, FR);
  x.drawImage(logSky(), REG[1][0], REG[1][1]);
  x.drawImage(logGround(), REG[2][0], REG[2][1]);
  block(x, 2, 1, b => { pine(b, 150, 960, 260, .6, t8, 1); pine(b, 250, 950, 200, .5, t8, 1); liveInk(.04, .2, .2); });
  // a pair of birds crossing the sky, stepping at 8 fps
  { const bx = 200 + q8(t + 10) * 70 % 900, by = 600 - 20 * Math.sin(q8(t) * 2); x.strokeStyle = PAL.sumi; x.lineWidth = 2.4; [[0, 0], [46, 18]].forEach(([dx, dy], i) => { const f = Math.sin(q8(t) * 18 + i * 2) * 8; x.beginPath(); x.moveTo(bx + dx - 16, by + dy - f); x.quadraticCurveTo(bx + dx - 6, by + dy - 4, bx + dx, by + dy); x.quadraticCurveTo(bx + dx + 6, by + dy - 4, bx + dx + 16, by + dy - f); x.stroke(); }); }
  block(x, 3, 1, b => { logSide(b); disc(b, LOG, NR, { cracks: true }); liveInk(.04, .18, .2); });
  if (t >= T.s3) { const u = clamp((t - T.s3) / .01); if (u > 0) counted(x, LOG, 99, NR, 17, false); }
  block(x, 3, 1, b => { stump(b, 760, 1520, 150, t8); liveInk(.04, .18, .2); });
  grass(x, 60, 1000, 1330, 26, 5, t8); grass(x, 80, 1000, 1640, 22, 6, t8);
  x.restore();
  border(x);
  if (t < T.s3) { titleSlip(x); drawSeal(x, '年輪', TITLE.x0 + TITLE.w - 60, TITLE.y0 + TITLE.h + 72, 86, 1, { seed: 9 }); }
  else { const b = vcart(x, 960, 74, 'THE FALLEN CEDAR'); drawSeal(x, '年輪', 960, b.y0 + b.h + 56, 72, clamp((t - T.seal) / .2), { seed: 9 }); }
  x.drawImage(TX.fiber, 0, 0);
}

// ══════════════════ PRINT B · "Year by year" (rings print one per year; a seasons inset) ══════════════════
const DB = { cx: 540, cy: 700, R: 320, bark: 26 };
const INSET = { x0: 300, y0: 1090, x1: 780, y1: 1380 };
const years = t => clamp((q12(t) - T.grow[0]) / T.grow[1], 0, NR);
const bSky = () => cached('Bsky', x => {
  bokashi(x, 0, FR.y0, W, 380, PAL.prus, .7, 0, { rough: 24, seed: 12 });
  kasumi(x, 300, 300, 700, 26, PAL.skyL, .8); kasumi(x, 800, 1500, 600, 26, PAL.skyL, .7);
  bokashi(x, 0, 1450, W, FR.y1, '#c9a45c', 0, .55, { rough: 20, seed: 14 });
}, { grain: .03, baren: .38 });
function insetScene(x, t) {
  const r = INSET, n = years(t), yr = Math.floor(n), ph = n - yr, late = ph > .74;   // the sky flips: spring (pale green) → late summer (ochre)
  x.save(); clipRect(x, r);
  x.fillStyle = PAL.paper; x.fillRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
  bokashi(x, r.x0, r.y0, r.x1, r.y0 + 170, late ? '#cf9f4a' : '#b5c07a', .85, 0, { rough: 10, seed: 3 });
  const gy = r.y1 - 60;
  x.fillStyle = GREEN.m; x.beginPath(); smooth(x, [[r.x0 - 10, gy + 6], [r.x0 + 160, gy - 12], [r.x1 - 120, gy - 4], [r.x1 + 10, gy + 10], [r.x1 + 10, r.y1 + 10], [r.x0 - 10, r.y1 + 10]], true); x.fill();
  x.strokeStyle = PAL.sumi; x.lineWidth = 2; x.beginPath(); smooth(x, [[r.x0 - 10, gy + 6], [r.x0 + 160, gy - 12], [r.x1 - 120, gy - 4], [r.x1 + 10, gy + 10]]); x.stroke();
  const g = Math.min(NR, n + .3), h = 40 + g * 15, s = .22 + g * .045;   // the tree grows with the years
  pine(x, (r.x0 + r.x1) / 2, gy - 6, h, s, q8(t), 1);
  if (!late && n > 0 && n < NR) for (let i = 0; i < 6; i++) { const bx = r.x0 + 40 + hash(i + yr * 7) * 400, by = r.y0 + 40 + hash(i * 3 + yr) * 140; x.fillStyle = PAL.beniP; x.beginPath(); x.arc(bx, by, 4, 0, TAU); x.fill(); }   // spring petals
  x.restore();
  x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); x.lineWidth = 1.2; x.strokeRect(r.x0 + 6, r.y0 + 6, r.x1 - r.x0 - 12, r.y1 - r.y0 - 12);
  // the year, as a tally slip on the inset's corner
  const lbl = n <= 0 ? '' : `YEAR ${Math.min(NR, yr + (ph > 0 ? 1 : 0))}`;
  if (lbl) { x.fillStyle = CREAM; x.fillRect(r.x0 + 14, r.y0 + 14, 150, 42); x.strokeStyle = PAL.sumi; x.lineWidth = 2; x.strokeRect(r.x0 + 14, r.y0 + 14, 150, 42); x.fillStyle = PAL.sumi; x.font = '700 26px Shippori'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(lbl, r.x0 + 89, r.y0 + 37); }
}
function yearSheet(t) {
  const x = SC.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0);
  x.drawImage(TX.paper, 0, 0);
  const rv = g => clamp((t - T.print1[g]) / T.REVEAL);
  x.save(); clipRect(x, FR);
  block(x, 1, rv(1), b => b.drawImage(bSky(), 0, 0));
  block(x, 2, rv(2), b => { disc(b, DB, Math.max(.35, years(t))); liveInk(.04, .18, .2); });
  block(x, 3, rv(3), b => insetScene(b, t));
  x.restore();
  block(x, 0, rv(0), b => border(b));
  block(x, 3, rv(3), b => vcart(b, 950, 84, 'YEAR BY YEAR'));
  x.drawImage(TX.fiber, 0, 0);
}

// ══════════════════ PRINT C · "Counting" (the cut face fills the sheet) ══════════════════
const XC = -1100;   // this sheet sits left of print B on the scroll
const DC = { cx: 520, cy: 860, R: 400, bark: 40 };
function countSheet(t) {
  const x = SC.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0);
  x.drawImage(TX.paper, -60, 0);
  x.save(); clipRect(x, FR);
  x.fillStyle = rgba('#c9a45c', .35); x.fillRect(0, 0, W, H);
  bokashi(x, 0, FR.y0, W, 300, PAL.prus, .55, 0, { rough: 24, seed: 21 });
  block(x, 2, 1, b => { disc(b, DC, NR, { cracks: true }); liveInk(.04, .18, .2); });
  const up = clamp((t - T.count[0]) / T.count[1] + 1e-6, 0, NR);
  const tip = counted(x, DC, t, Math.floor(up), 28, true);
  // the pointer: a thin bamboo stick from the lower left, its tip on the ring being counted
  const tip2 = Math.floor(up) > 0 ? tip : ringPt(DC, 0, 0), base = [tip2[0] - 520, tip2[1] + 700];
  x.fillStyle = '#c9a45c'; carve(x, [base, [lerp(base[0], tip2[0], .5), lerp(base[1], tip2[1], .5)], tip2], 12, { taper: [0, .6], seed: 4 });
  x.strokeStyle = PAL.sumi; x.lineWidth = 1.8; x.beginPath(); x.moveTo(base[0] + 6, base[1]); x.lineTo(tip2[0], tip2[1]); x.stroke();
  for (let i = 1; i < 5; i++) { const u = i / 5, px = lerp(base[0], tip2[0], u), py = lerp(base[1], tip2[1], u); x.beginPath(); x.moveTo(px - 6, py - 3); x.lineTo(px + 6, py + 3); x.stroke(); }   // bamboo nodes
  x.restore();
  border(x);
  vcart(x, 960, 84, 'COUNTING');
  x.drawImage(TX.fiber, 0, 0);
}

// —————————————————— camera ——————————————————
function hermite(t, k) {
  for (let i = 0; i < k.length - 1; i++) {
    const [t0, p0, m0] = k[i], [t1, p1, m1] = k[i + 1]; if (t > t1 && i < k.length - 2) continue;
    const d = t1 - t0, u = clamp((t - t0) / d), u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * d * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * d * m1;
  }
}
const ZA = 1.69;
function camera(t) {
  if (t < T.s1) return { cx: 540, cy: lerp(960, 975, t), z: lerp(1, 1.03, ss(t / T.s1)) };
  if (t < T.s2) { const u = ss(seg(t, 1.4, 3.9)); return { cx: 540, cy: 960, z: lerp(1, 1.05, u) }; }
  if (t < T.s3) {
    const u = seg(t, T.s2, T.slideEnd), p = ss(seg(t, T.slideEnd, T.s3));
    const cx = hermite(t, [[T.s2, 540, 0], [T.slideEnd, XC + 540, 0], [T.s3, XC + 540, 0]]);
    // after the slide: push along the counting ray, toward the bark
    return { cx: cx + 60 * p, cy: lerp(960, 850, p), z: lerp(1.05, 1, eio(u)) - .05 * Math.sin(Math.PI * u) + .1 * p };
  }
  // back on the log: start close on its cut face (matching the counting close-up), pull back to the whole print
  const u = eio(seg(t, ...T.pull)), r = seg(t, T.pull[1], DUR);
  return { cx: lerp(LOG.cx + 40, 540, u), cy: lerp(LOG.cy - 20, 960, u), z: lerp(ZA, 1, u) - .015 * r };
}

// —————————————————— subtitles ——————————————————
function subBox(s) { ctx.font = '500 46px Shippori'; const tw = ctx.measureText(s.text).width, w = tw + 156, h = 82; return { x0: (W - w) / 2, y0: SUB_Y, w, h }; }
function subtitle(t) {
  const s = SUBS.find(s => t >= s.t0 - .05 && t < s.t1 + (s.t1 >= DUR ? 1 : 0)); if (!s) return;
  const a = clamp((t - s.t0 + .05) / .22), fo = s.t1 >= DUR ? 1 : 1 - clamp((t - (s.t1 - .2)) / .2);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const { x0, y0, w, h } = subBox(s); ctx.globalAlpha = fo;
  const x = BL.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
  x.fillStyle = 'rgba(243,231,198,.96)'; x.fillRect(x0, y0, w, h);
  x.strokeStyle = PAL.sumi; x.lineWidth = 2.6; x.strokeRect(x0, y0, w, h); x.lineWidth = 1; x.strokeRect(x0 + 5, y0 + 5, w - 10, h - 10);
  x.fillStyle = PAL.sumi; x.textAlign = 'left'; x.textBaseline = 'middle'; x.font = '500 46px Shippori'; x.fillText(s.text, x0 + 100, y0 + h / 2 + 2);
  const sc = sealCanvas('木', 44, { seed: 17, col: GREEN.d }); x.drawImage(sc, x0 + 30, y0 + h / 2 - sc.height / 2);
  if (a >= 1) ctx.drawImage(BL, 0, 0); else stampLayer(ctx, BL, a, [0, 0], [4, -3]);
  ctx.restore();
}

// —————————————————— render ——————————————————
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const cam = camera(t), M = camMatrix(cam);
  if (t < T.s1 || t >= T.s3) {
    mount(M, -400, W + 400);
    logSheet(t); ctx.setTransform(...M); ctx.drawImage(SC, 0, 0); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t < T.s1) { const u = seg(t, ...T.wash); if (u > 0) stampLayer(ctx, TX.paper, u, [0, 0], [0, 0]); }
  } else {
    mount(M, XC - 300, W + 300);
    const half = W / 2 / cam.z + 40;
    if (cam.cx + half > 0) { yearSheet(t); ctx.setTransform(...M); ctx.drawImage(SC, 0, 0); }
    if (t >= T.s2 && cam.cx - half < XC + W) { countSheet(t); ctx.setTransform(...M); ctx.drawImage(SC, XC, 0); }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  if (!NOSUB) subtitle(t);
}
window.render = render;
window.DUR = DUR;
window.EV = [];   // silent film
window.TEXTS = t => {
  const out = [], M = camMatrix(camera(t)), box = (b, id, text, pass) => { const [a0, b0] = toS(M, b.x0, b.y0), [a1, b1] = toS(M, b.x0 + b.w, b.y0 + b.h); out.push({ id, text, x0: a0, y0: b0, x1: a1, y1: b1, pass }); };
  if (t < T.wash[1]) box(TITLE, 'title', 'How old is this tree?', true);   // the thumbnail's title
  if (t >= T.print1[3] && t < T.s2) { const v = vsize('YEAR BY YEAR'); box({ x0: 950 - v.w / 2, y0: 84, ...v }, 'v1', 'YEAR BY YEAR'); }
  if (t >= T.slideEnd && t < T.s3) { const v = vsize('COUNTING'); box({ x0: XC + 960 - v.w / 2, y0: 84, ...v }, 'v2', 'COUNTING'); }
  if (t >= T.s3) { const v = vsize('THE FALLEN CEDAR'); box({ x0: 960 - v.w / 2, y0: 74, ...v }, 'v3', 'THE FALLEN CEDAR', true); }   // revealed by the pull-back; the caption carries the fact
  return out;
};
window.SUBS = SUBS;
window.READY = true;
