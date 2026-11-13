// Dahi · Under the Microscope — a 10 s silent film.
// One continuous camera through one real micrograph ("Yogurt Bacteria.jpg", Andreacise, CC BY 4.0).
// Every pixel of the specimen is the photo (tools/plates.py); every number is computed from it.
import { clamp, lerp, seg, ss, eio, eo } from '/core/lib.js';
import { T, DUR, CAPS } from './timeline.js';

const W = 1920, H = 1080, M = 64;
window.DUR = DUR;
const j = async f => (await fetch(f)).json();
const P = await j('assets/plates/plates.json');
const CFG = await j('config.json');
const MPP = P.mpp;                                                 // µm per level-0 px (estimated: FACTS.md)
const D = P.disc, CI = P.circle, PT = P.points;

const loadImg = src => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('missing ' + src)); im.src = src; });
const IM = {};
await Promise.all([...P.plates.map(async p => { IM[p.name] = await loadImg(p.file); }), (async () => { IM.counted = await loadImg(CI.overlay.file); })()]);
await Promise.all(Object.values(IM).map(im => im.decode()));
await Promise.all(['300 40px BC', '400 40px BC', '400 20px PM', '500 20px PM', '400 20px BS', '500 20px BS', '400 40px IS', 'italic 400 40px IS']
  .map(f => document.fonts.load(f, 'Dahi µm×0')));

// ------------------------------------------------------------------ canvases
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const base = mk(W + 2 * M, H + 2 * M), bx = base.getContext('2d');
const tmp = mk(W, H), tx = tmp.getContext('2d');
const snap = mk(W, H), sx = snap.getContext('2d');
for (const c of [ctx, bx, tx, sx]) { c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; }

// ------------------------------------------------------------------ camera: similarity keys, log-spiral interpolation
const cmul = (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
const cdiv = (p, q) => { const d = q[0] * q[0] + q[1] * q[1]; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; };
const csub = (p, q) => [p[0] - q[0], p[1] - q[1]], cadd = (p, q) => [p[0] + q[0], p[1] + q[1]];
function key(t, p, s, fovUm, rollDeg, ease = 'eio') {
  const k = W * MPP / fovUm, th = rollDeg * Math.PI / 180;
  const a = [k * Math.cos(th), k * Math.sin(th)];
  return { t, a, b: csub(s, cmul(a, p)), lk: Math.log(k), th, ease };
}
const DC = [D.cx, D.cy];
const ROD = PT.rod, CC = [CI.cx, CI.cy];
const R = CFG.roll, F = CFG.fov;
const KEYS = [
  key(T.open, DC, [1255, 548], F.open, R.open, 'lin'),
  key(T.dive, DC, [1215, 556], F.open * 0.86, R.open + 5),
  key(T.land, ROD, [900, 470], F.land, R.land, 'lin'),
  key(T.med, ROD, [900, 470], F.land * 0.95, R.land + 0.8),
  key(T.circ, CC, [1010, 500], F.count, R.count, 'lin'),
  key(T.climb, CC, [1010, 500], F.count * 0.965, R.count + 0.6),
  key(T.end + 0.2, DC, [1255, 548], F.open * 1.04, R.end, 'lin'),
  key(DUR, DC, [1255, 548], F.open * 1.08, R.end + 1.2),
];
const EASE = { lin: u => u, eio: u => eio(u) };
function camAt(t) {
  let i = 0; while (i < KEYS.length - 2 && t >= KEYS[i + 1].t) i++;
  const k1 = KEYS[i], k2 = KEYS[i + 1];
  const u = EASE[k1.ease](clamp((t - k1.t) / (k2.t - k1.t), 0, 1));
  const A = cdiv(k2.a, k1.a), B = csub(k2.b, cmul(A, k1.b));
  const lA = k2.lk - k1.lk, tA = k2.th - k1.th;
  const Au = [Math.exp(lA * u) * Math.cos(tA * u), Math.exp(lA * u) * Math.sin(tA * u)];
  let a, b;
  if (Math.hypot(A[0] - 1, A[1]) < 1e-9) { a = k1.a; b = cadd(k1.b, [B[0] * u, B[1] * u]); }
  else { const zs = cdiv(B, csub([1, 0], A)); a = cmul(Au, k1.a); b = cadd(cmul(Au, csub(k1.b, zs)), zs); }
  return { a, b, k: Math.hypot(a[0], a[1]), th: Math.atan2(a[1], a[0]) };
}
const toS = (c, p) => cadd(cmul(c.a, p), c.b);
const fovOf = c => W * MPP / c.k;

// ------------------------------------------------------------------ plates (the same photo at three levels)
const PL = Object.fromEntries(P.plates.map(p => [p.name, p]));
const ORDER = ['a4', 'a2', 'c1'];
const FULL = 1.45, NONE = 2.2;
function plateAlpha(c, name) {
  if (name === 'a4') return 1;
  const r = 1 / (c.k * PL[name].s);
  return 1 - ss(seg(r, FULL, NONE));
}
function activeLevel(c) { let best = 'a4'; for (const n of ORDER) if (plateAlpha(c, n) >= 1) best = n; return best; }
const OBJ = [];                                                    // level changes, sampled at 1/96 s
{ let prev = activeLevel(camAt(0));
  for (let t = 1 / 96; t < DUR; t += 1 / 96) { const lv = activeLevel(camAt(t)); if (lv !== prev) { OBJ.push({ t: +t.toFixed(4), from: prev, to: lv, up: ORDER.indexOf(lv) > ORDER.indexOf(prev) }); prev = lv; } } }
const pulse = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));

function focus(t) {
  let g = 0;
  for (const e of OBJ) g += 2.2 * pulse(t, e.t + 0.03, 0.075);      // a breath at each level change
  g += 2.6 * pulse(t, (T.dive + T.land) / 2, 0.16);                 // the dive passes through focus once
  g += 1.6 * pulse(t, (T.climb + T.end) / 2, 0.14);
  const soft = 2.6 * ss(seg(t, T.land - 0.3, T.land - 0.05)) * (t < T.land + 0.95 ? 1 : 0);
  const front = lerp(-300, W + 520, eio(seg(t, T.land - 0.05, T.land + 0.85)));
  return { g, soft, front };
}

// ------------------------------------------------------------------ the specimen
function drawSpecimen(c, t) {
  bx.setTransform(1, 0, 0, 1, 0, 0);
  // the bench: graphite under a slow pool of light
  const lx = lerp(420, 900, ss(seg(t, 0, DUR))) + M, ly = 330 + M;
  const g = bx.createRadialGradient(lx, ly, 40, lx, ly, 1500);
  g.addColorStop(0, '#2a3036'); g.addColorStop(0.5, '#15191c'); g.addColorStop(1, '#0b0d0f');
  bx.fillStyle = g; bx.fillRect(0, 0, base.width, base.height);
  const set = () => bx.setTransform(c.a[0], c.a[1], -c.a[1], c.a[0], c.b[0] + M, c.b[1] + M);
  const rr0 = D.r * 0.995;
  // the field stop casts a soft dark halo on the bench
  set(); bx.save();
  const sh = bx.createRadialGradient(D.cx, D.cy, rr0 * 0.96, D.cx, D.cy, rr0 * 1.16);
  sh.addColorStop(0, 'rgba(0,0,0,0.65)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  bx.fillStyle = sh; bx.beginPath(); bx.arc(D.cx, D.cy, rr0 * 1.16, 0, 2 * Math.PI); bx.fill(); bx.restore();
  // the field: the photo inside the eyepiece's field stop, finest plate last
  set(); bx.save(); bx.beginPath(); bx.arc(D.cx, D.cy, rr0, 0, 2 * Math.PI); bx.clip();
  for (const n of ORDER) {
    const p = PL[n], al = plateAlpha(c, n); if (al <= 0.002) continue;
    bx.globalAlpha = al; bx.drawImage(IM[n], p.x, p.y, p.w * p.s, p.h * p.s);
  }
  bx.globalAlpha = 1;
  // counted pixels: revealed behind the scan front, then kept as a faint trace
  const st = countState(t);
  if (st.alpha > 0.002) {
    const o = CI.overlay; bx.save();
    bx.beginPath(); bx.arc(CI.cx, CI.cy, CI.r, 0, 2 * Math.PI); bx.clip();
    if (st.front < 1) {
      const th = CFG.count_roll_deg * Math.PI / 180, ux = Math.cos(th), uy = -Math.sin(th), d = (st.front * 2 - 1) * CI.r;
      const px = CI.cx + ux * d, py = CI.cy + uy * d, L = CI.r * 3;
      bx.beginPath(); bx.moveTo(px - uy * L, py + ux * L); bx.lineTo(px + uy * L, py - ux * L);
      bx.lineTo(px + uy * L - ux * L, py - ux * L - uy * L); bx.lineTo(px - uy * L - ux * L, py + ux * L - uy * L); bx.closePath(); bx.clip();
    }
    bx.globalAlpha = st.alpha; bx.drawImage(IM.counted, o.x, o.y, o.w * o.s, o.h * o.s); bx.restore();
  }
  // the field stop's own falloff (the eyepiece edge is optics, not a frame)
  const vf = bx.createRadialGradient(D.cx, D.cy, rr0 * 0.9, D.cx, D.cy, rr0);
  vf.addColorStop(0, 'rgba(26,22,18,0)'); vf.addColorStop(0.7, 'rgba(26,22,18,0.12)'); vf.addColorStop(1, 'rgba(14,12,10,0.62)');
  bx.fillStyle = vf; bx.fillRect(D.cx - rr0, D.cy - rr0, 2 * rr0, 2 * rr0);
  bx.restore();
  set(); bx.save(); bx.beginPath(); bx.arc(D.cx, D.cy, rr0, 0, 2 * Math.PI);
  bx.lineWidth = 2.2 / c.k; bx.strokeStyle = 'rgba(255,255,255,0.10)'; bx.stroke(); bx.restore();
  bx.setTransform(1, 0, 0, 1, 0, 0);
}

function composite(c, t) {
  const { g, soft, front } = focus(t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = (g + soft) > 0.25 ? `blur(${(g + soft).toFixed(2)}px)` : 'none';
  ctx.drawImage(base, -M, -M);
  ctx.filter = 'none';
  if (soft > 0.25) {                                               // the focal plane sweeps across: sharp behind the front
    tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, W, H);
    tx.filter = g > 0.25 ? `blur(${g.toFixed(2)}px)` : 'none'; tx.drawImage(base, -M, -M); tx.filter = 'none';
    tx.globalCompositeOperation = 'destination-in';
    const ang = 12 * Math.PI / 180, dx = Math.cos(ang), dy = Math.sin(ang), band = 240;
    const gr = tx.createLinearGradient(front - dx * band, H / 2 - dy * band, front + dx * band, H / 2 + dy * band);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    tx.fillStyle = gr; tx.fillRect(0, 0, W, H); tx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tmp, 0, 0);
  }
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.15);
  vg.addColorStop(0, 'rgba(14,16,20,0)'); vg.addColorStop(1, 'rgba(14,16,20,0.2)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  sx.drawImage(cv, 0, 0);
}

// ------------------------------------------------------------------ the count
const S1 = T.reading - 0.2;
function countState(t) {
  const front = clamp((t - T.scan) / (S1 - T.scan), 0, 1);
  let alpha = front > 0 ? lerp(1.0, 0.82, ss(seg(t, S1, S1 + 0.7))) : 0;
  alpha *= 1 - ss(seg(t, T.climb + 0.3, T.end));
  return { alpha, front: t < T.scan ? 0 : front, drawn: ss(seg(t, T.circ, T.circ + 0.35)) };
}
function shareAt(t) {
  const f = clamp((t - T.scan) / (S1 - T.scan), 0, 1), cum = CI.cum, x = f * (cum.length - 1), i = Math.floor(x);
  if (f >= 1) return CI.share * 100;
  return 100 * lerp(cum[i], cum[Math.min(i + 1, cum.length - 1)], x - i);
}

// ------------------------------------------------------------------ drawing kit
const AMB = 'rgb(255,186,84)', AMB_D = 'rgb(150,92,0)', INK = 'rgb(24,27,31)', WT = 'rgb(248,247,244)';
let TX = [];
function reg(id, text, x0, y0, x1, y1) { TX.push({ id, text, x0, y0, x1, y1 }); }
function text(s, x, y, font, color, { align = 'left', alpha = 1, halo = null, id = null, full = null, pass = false } = {}) {
  if (alpha <= 0.003) return 0;
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  if (halo) { ctx.shadowColor = halo; ctx.shadowBlur = 8; }
  ctx.fillStyle = color; ctx.fillText(s, x, y);
  if (halo) { ctx.shadowBlur = 0; ctx.fillText(s, x, y); }
  const m = ctx.measureText(s), w = m.width; ctx.restore();
  if (id && alpha > 0.5) {
    const x0 = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
    reg(id, full ?? s, x0, y - m.actualBoundingBoxAscent, x0 + w, y + m.actualBoundingBoxDescent);
    if (pass) TX[TX.length - 1].pass = true;
  }
  return w;
}
function line(pts, color, halo, w = 1.6, alpha = 1) {
  if (alpha <= 0.003) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
  if (halo) { ctx.strokeStyle = halo; ctx.lineWidth = w + 3; ctx.stroke(); }
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function panel(x, y, w, h, alpha = 1, r = 14) {
  if (alpha <= 0.003) return;
  ctx.save(); ctx.globalAlpha = alpha;
  rr(ctx, x, y, w, h, r); ctx.clip();
  ctx.filter = 'blur(18px)'; ctx.drawImage(snap, 0, 0); ctx.filter = 'none';
  ctx.fillStyle = 'rgba(12,14,17,0.74)'; ctx.fillRect(x, y, w, h);
  ctx.restore();
  ctx.save(); ctx.globalAlpha = alpha * 0.9; rr(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r);
  ctx.strokeStyle = 'rgba(255,255,255,0.13)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
const fmtLen = v => `${v} µm`;
const NICE = [100, 50, 20, 10, 5, 2, 1];
const niceFor = fov => NICE.find(v => v / (fov / W) <= 230);

// ------------------------------------------------------------------ instruments (bottom-left) and source (top-right)
function instruments(c, t) {
  const a = 1;
  const fov = fovOf(c), upp = fov / W, v = niceFor(fov);
  let ts = t; while (ts > 0 && niceFor(fovOf(camAt(ts - 1 / 96))) === v) ts -= 1 / 96;
  const vPrev = ts > 0 ? niceFor(fovOf(camAt(ts - 1 / 96))) : v;
  const sw = ss(seg(t, ts, ts + 0.18));
  const L = lerp(vPrev / upp, v / upp, sw);
  const x0 = 56, y0 = 842, pw = 400, ph = 184;
  panel(x0, y0, pw, ph, a);
  const xb = x0 + 26, yb = y0 + 82;
  line([[xb, yb - 10], [xb, yb], [xb + L, yb], [xb + L, yb - 10]], WT, null, 2, a);
  line([[xb + L / 2, yb], [xb + L / 2, yb - 5]], WT, null, 1.3, a);
  if (vPrev !== v && sw < 1) text('≈ ' + fmtLen(vPrev), xb, y0 + 56 - 14 * sw, '300 44px BC', WT, { alpha: a * (1 - sw) * (1 - sw) });
  text('≈ ' + fmtLen(v), xb, y0 + 56 + (vPrev !== v ? 14 * (1 - sw) : 0), '300 44px BC', WT, { alpha: a * (vPrev !== v ? sw : 1), id: 'sb', full: '≈ ' + fmtLen(v) });
  text('field', xb, y0 + 124, '400 20px BS', 'rgba(248,247,244,0.7)', { alpha: a });
  text(`≈ ${Math.round(fov)} µm`, xb + 56, y0 + 124, '400 20px PM', WT, { alpha: a, id: 'fov', full: '≈ 100 µm' });
  // zoom into the eyepiece view; the nosepiece glyph turns a quarter at every plate change
  const zoom = F.ref / fov;
  let last = null; for (const e of OBJ) if (e.t <= t) last = e;
  const flash = last ? 1 - ss(seg(t, last.t, last.t + 0.6)) : 0;
  const col = flash > 0 ? `rgb(${[248, 247, 244].map((x, i) => Math.round(lerp(x, [255, 186, 84][i], flash))).join(',')})` : WT;
  const lw = text(`100× objective · view ${zoom.toFixed(1)}×`, xb + 30, y0 + 158, '500 20px PM', col, { alpha: a });
  let turns = 0; for (const e of OBJ) if (e.t <= t) turns += (e.up ? 1 : -1) * eo(seg(t, e.t, e.t + 0.28));
  const ix = xb + 9, iy = y0 + 151, ang = turns * Math.PI / 2;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(ix, iy, 9, 0, 2 * Math.PI); ctx.stroke();
  for (let i = 0; i < 4; i++) { const q = ang + i * Math.PI / 2; ctx.beginPath(); ctx.arc(ix + Math.cos(q) * 5.5, iy + Math.sin(q) * 5.5, i === 0 ? 2.6 : 1.6, 0, 2 * Math.PI); ctx.fill(); }
  ctx.restore();
  // source credit, top right
  const cr = 'Yogurt smear · photo Andreacise · CC BY 4.0';
  ctx.save(); ctx.font = '400 20px PM'; const cw = Math.ceil(ctx.measureText(cr).width) + 44; ctx.restore();
  panel(W - 56 - cw, 40, cw, 46, a, 12);
  text(cr, W - 56 - cw / 2, 70, '400 20px PM', 'rgba(248,247,244,0.82)', { align: 'center', alpha: a, id: 'credit', full: cr });
}

// ------------------------------------------------------------------ captions: frosted strip, one line, never wrapped
const CAPF = '500 34px BS';
function captions(t) {
  for (const q of CAPS) {
    if (t < q.t0 - 0.12 || t >= q.t1 + 0.1) continue;
    const a = (q.t0 <= 0.4 ? 1 : ss(seg(t, q.t0 - 0.12, q.t0 + 0.08))) * (q.t1 >= DUR ? 1 : 1 - ss(seg(t, q.t1 - 0.06, q.t1 + 0.1)));
    ctx.save(); ctx.font = CAPF; const w = ctx.measureText(q.text).width + 64; ctx.restore();
    const x = W / 2 + 60 - w / 2, y = 966 + 8 * (1 - eo(seg(t, q.t0 - 0.12, q.t0 + 0.2))) * (q.t0 <= 0.4 ? 0 : 1);
    panel(x, y, w, 70, a, 14);
    text(q.text, W / 2 + 60, y + 47, CAPF, WT, { align: 'center', alpha: a, id: q.id });
  }
}
window.SUBCHECK = (() => {
  const c = document.createElement('canvas').getContext('2d'); c.font = CAPF;
  const cues = CAPS.map(q => ({ id: q.id, text: q.text, w: Math.round(c.measureText(q.text).width), ok: c.measureText(q.text).width <= 1100 }));
  return { safe: 1100, cues, ok: cues.every(q => q.ok) };
})();

// ------------------------------------------------------------------ title: frame 0 is the thumbnail
function title(t, end = false) {
  const t0 = end ? T.end : -1;
  const a = end ? ss(seg(t, t0, t0 + 0.35)) : 1 - ss(seg(t, T.title, T.title + 0.45));
  if (a <= 0.003) return;
  const lift = end ? 0 : -18 * ss(seg(t, T.title, T.title + 0.45));
  const x = 96, y = 300 + lift, pw = 560, ph = 330;
  panel(x, y, pw, ph, a, 18);
  const w = end ? eo(seg(t, t0 + 0.05, t0 + 0.7)) : 1;              // the end title is written on: a wipe across
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, 40 + (pw - 40) * w, ph); ctx.clip();
  text('Dahi', x + 44, y + 150, '400 150px IS', WT, { alpha: a, id: end ? 'et1' : 't1' });
  text('under the microscope', x + 50, y + 206, 'italic 400 46px IS', 'rgba(248,247,244,0.88)', { alpha: a, id: end ? 'et2' : 't2' });
  ctx.restore();
  const rl = end ? eo(seg(t, t0 + 0.3, t0 + 0.9)) : 1;
  line([[x + 50, y + 236], [x + 50 + 440 * rl, y + 236]], AMB, null, 2, a);
  if (!end) text('yogurt smear · blue stain · 100× objective', x + 50, y + 284, '400 20px PM', 'rgba(248,247,244,0.72)', { alpha: a, id: 't3', pass: true });
  else text('yogurt smear · blue stain · 100× objective', x + 50, y + 284, '400 20px PM', 'rgba(248,247,244,0.72)', { alpha: a * ss(seg(t, t0 + 0.5, t0 + 0.9)), id: 'et3', pass: true });
}

// ------------------------------------------------------------------ fact 1: a rod sized, a bead ringed
function rodMarks(c, t) {
  const a = ss(seg(t, T.dim - 0.05, T.dim + 0.2)) * (1 - ss(seg(t, T.circ + 0.05, T.circ + 0.35)));
  if (a <= 0.003) return;
  let s0 = toS(c, PT.rod_a), s1 = toS(c, PT.rod_b);
  if (s0[0] > s1[0]) [s0, s1] = [s1, s0];
  const ang = Math.atan2(s1[1] - s0[1], s1[0] - s0[0]);
  let nx = Math.sin(ang), ny = -Math.cos(ang); if (ny > 0) { nx = -nx; ny = -ny; }   // the line sits above the rod
  const off = 34, p0 = [s0[0] + nx * off, s0[1] + ny * off], p1 = [s1[0] + nx * off, s1[1] + ny * off];
  const mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
  const grow = eo(seg(t, T.dim, T.dim + 0.45));
  const e0 = [lerp(mid[0], p0[0], grow), lerp(mid[1], p0[1], grow)], e1 = [lerp(mid[0], p1[0], grow), lerp(mid[1], p1[1], grow)];
  const halo = 'rgba(255,253,250,0.85)';
  line([e0, e1], INK, halo, 2, a);
  if (grow > 0.98) for (const p of [p0, p1]) line([[p[0] - nx * 12, p[1] - ny * 12], [p[0] + nx * 8, p[1] + ny * 8]], INK, halo, 2, a);
  const len = Math.hypot(PT.rod_b[0] - PT.rod_a[0], PT.rod_b[1] - PT.rod_a[1]) * MPP;
  const ta = a * ss(seg(t, T.dim + 0.3, T.dim + 0.55));
  ctx.save(); ctx.translate(mid[0] + nx * 16, mid[1] + ny * 16); ctx.rotate(ang);
  text(`≈ ${len.toFixed(0)} µm`, 0, -10, '400 54px BC', AMB_D, { align: 'center', alpha: ta, halo });
  text('rod', 0, -70, '500 26px BS', INK, { align: 'center', alpha: ta, halo });
  ctx.restore();
  if (ta > 0.5) { const q = [mid[0] + nx * 60, mid[1] + ny * 60]; reg('rodv', `≈ ${len.toFixed(0)} µm`, q[0] - 90, q[1] - 40, q[0] + 90, q[1] + 30); reg('rodl', 'rod', q[0] - 40, q[1] - 80, q[0] + 40, q[1] - 40); }
  // the beads: an arc drawn round one cluster
  const b = toS(c, PT.bead), br = CFG.bead_ring_um / MPP * c.k;
  const d = eio(seg(t, T.arc, T.arc + 0.4));
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(b[0], b[1], br, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * d);
  ctx.strokeStyle = halo; ctx.lineWidth = 5; ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  const g = eo(seg(t, T.arc + 0.25, T.arc + 0.55));
  const q0 = [b[0] + br * 0.71, b[1] + br * 0.71], el = [q0[0] + 50 * g, q0[1] + 60 * g], en = [el[0] + 46 * g, el[1]];
  line([q0, el, en], INK, halo, 1.6, a);
  text('beads', en[0] + 10, en[1] + 9, '500 26px BS', INK, { alpha: a * ss(seg(t, T.arc + 0.45, T.arc + 0.7)), halo, id: 'beads' });
}

// ------------------------------------------------------------------ fact 2: counting the colour (the showpiece)
function counting(c, t) {
  const st = countState(t);
  const show = st.drawn * (1 - ss(seg(t, T.climb + 0.05, T.climb + 0.4)));
  if (show <= 0.003) return;
  const s = toS(c, CC), rad = CI.r * c.k, halo = 'rgba(10,8,10,0.5)';
  ctx.save(); ctx.globalAlpha = show; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(s[0], s[1], rad, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * st.drawn);
  ctx.strokeStyle = 'rgba(255,253,250,0.85)'; ctx.lineWidth = 6; ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const an = -Math.PI / 2 + i * Math.PI / 2; if (st.drawn < (i + 1) / 4) continue;
    ctx.beginPath(); ctx.moveTo(s[0] + Math.cos(an) * rad, s[1] + Math.sin(an) * rad); ctx.lineTo(s[0] + Math.cos(an) * (rad + 14), s[1] + Math.sin(an) * (rad + 14));
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
  }
  ctx.restore();
  if (t > T.scan && t < S1 + 0.15) {                                // the scan front
    const f = clamp((t - T.scan) / (S1 - T.scan), 0, 1), x = s[0] - rad + 2 * rad * f;
    const h = Math.sqrt(Math.max(0, rad * rad - (x - s[0]) ** 2));
    ctx.save(); ctx.globalAlpha = 1 - ss(seg(t, S1, S1 + 0.15)); ctx.shadowColor = AMB; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.moveTo(x, s[1] - h); ctx.lineTo(x, s[1] + h); ctx.strokeStyle = AMB; ctx.lineWidth = 2.6; ctx.stroke(); ctx.restore();
  }
  // the reading: a frosted panel on the circle's right, joined by a leader
  const ra = ss(seg(t, T.scan - 0.1, T.scan + 0.2)) * (1 - ss(seg(t, T.climb + 0.02, T.climb + 0.35)));
  if (ra <= 0.003) return;
  const pw = 360, ph = 168, px = s[0] + rad + 60, py = s[1] - ph / 2 - 20;
  line([[s[0] + rad + 4, s[1] - 20], [px, s[1] - 20]], INK, 'rgba(255,253,250,0.8)', 1.6, ra);
  panel(px, py, pw, ph, ra);
  const v = shareAt(t), done = t >= S1;
  const pop = done ? 1 + 0.07 * Math.exp(-(t - S1) * 9) * Math.sin((t - S1) * 30) : 1;
  text('stained share of circle', px + 24, py + 40, '500 23px BS', 'rgba(248,247,244,0.86)', { alpha: ra, id: 'rl' });
  ctx.save(); ctx.translate(px + 24, py + 114); ctx.scale(pop, pop);
  text(v.toFixed(1) + '%', 0, 0, '400 80px BC', done ? AMB : 'rgba(255,186,84,0.62)', { alpha: ra });
  ctx.restore();
  if (ra > 0.5) reg('rv', (CI.share * 100).toFixed(1) + '%', px + 24, py + 56, px + 220, py + 116);
  text(`${CI.counted.toLocaleString('en-US')} / ${CI.total.toLocaleString('en-US')} px`, px + 24, py + 148, '400 20px PM', 'rgba(248,247,244,0.66)', { alpha: ra * ss(seg(t, S1 - 0.1, S1 + 0.2)), id: 'rp', pass: true });
}

// ------------------------------------------------------------------ events (silent film: cues only, for the checks)
window.EV = [
  ...OBJ.map(e => ({ t: e.t, type: 'objective', up: e.up })),
  { t: T.dive, type: 'dive' }, { t: T.land, type: 'land' }, { t: T.circ, type: 'circle' },
  { t: T.scan, type: 'scan' }, { t: S1, type: 'reading' }, { t: T.climb, type: 'climb' }, { t: T.end, type: 'title' },
];
window.TEXTS = t => { window.render(t); return TX; };
window.render = t => {
  TX = [];
  const c = camAt(t);
  drawSpecimen(c, t);
  composite(c, t);
  rodMarks(c, t);
  counting(c, t);
  instruments(c, t);
  title(t, false);
  title(t, true);
  captions(t);
};
window.CAM = { camAt, fovOf, OBJ, KEYS, toW: (t, q) => { const c = camAt(t); return cdiv(csub(q, c.b), c.a); } };
window.render(0);
window.READY = true;
