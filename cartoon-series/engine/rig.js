// Fridge Gang rig. Inlined by engine/build.mjs into every scene's <script>, after RIG_DATA and SHOT.
// Everything is placed on one paused GSAP timeline at absolute seconds, so any frame can be
// seeked on its own. No clocks, no Math.random: randomness comes from a seeded PRNG.
/* global gsap, RIG_DATA, SHOT */
function makeRig(P, tl) {
  const { MOUTHS, BROWS, MOODS, CAST } = RIG_DATA;
  const $ = (id) => document.getElementById(P + "-" + id);
  // Canvas: 1080x1920 (vertical) or 1920x1080 (wide). Episodes are directed in vertical terms;
  // in wide, every camera move is re-framed for 16:9 (see R.cam).
  const W = SHOT.w, H = SHOT.h, WIDE = W > H;
  const R = { W, H, WIDE, tl, P, $, D: SHOT.dur, L: SHOT.lines, pos: {}, moods: {}, cams: [], looks: {}, blinkOff: {} };

  const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  R.rng = rng;
  const clampT = (t) => Math.max(0, Math.min(R.D - 0.001, t));

  // ---------- placement and movement ----------
  R.place = (who, x, y, s = 1, flip = false) => {
    R.pos[who] = [{ t: 0, x, y, s }];
    R.moods[who] = [[0, "normal"]];
    R.looks[who] = [];
    tl.set($(who), { x, y }, 0);
    tl.set($(who + "-sz"), { scaleX: flip ? -s : s, scaleY: s, svgOrigin: "0 0" }, 0);
    tl.set($(who + "-sq"), { scaleX: 1, scaleY: 1, rotation: 0, x: 0, y: 0, svgOrigin: "0 0" }, 0);
    tl.set($(who + "-pose"), { scaleX: 1, scaleY: 1, rotation: 0, svgOrigin: "0 0" }, 0);
    tl.set($(who + "-br"), { x: 0 }, 0);
    ["L", "R"].forEach((s2) => {
      const a = $(who + "-arm" + s2);
      tl.set(a, { rotation: 0, svgOrigin: a.dataset.sx + " " + a.dataset.sy }, 0);
      tl.set($(who + "-pup" + s2), { x: 0, y: 0 }, 0);
    });
    tl.set($(who + "-sweat"), { opacity: 0 }, 0);
    R.applyMood(who, 0, "normal", false);
  };
  const posAt = (who, t) => {
    const list = R.pos[who] || [{ x: 540, y: 1186, s: 1 }];
    let p = list[0];
    for (const q of list) if (q.t <= t) p = q;
    return p;
  };
  R.posAt = posAt;
  R.move = (who, t, x, y, dur = 0.5, ease = "power2.inOut") => {
    const s = posAt(who, t).s;
    tl.to($(who), { x, y, duration: dur, ease }, t);
    R.pos[who].push({ t: t + dur * 0.5, x, y, s });
  };
  // Squashes and hops share one group; a new one is skipped while another is still settling.
  const sqSpans = {};
  const sqOk = (who, a, b) => {
    const spans = (sqSpans[who] = sqSpans[who] || []);
    if (spans.some(([x, y]) => a < y && b > x)) return false;
    spans.push([a, b]);
    return true;
  };
  R.squash = (who, t, sx = 1.12, sy = 0.86, dur = 0.12) => {
    if (!sqOk(who, t, t + dur + 0.5)) return;
    const el = $(who + "-sq");
    tl.to(el, { scaleX: sx, scaleY: sy, duration: dur, ease: "power2.out", svgOrigin: "0 0" }, t);
    tl.to(el, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.4)", svgOrigin: "0 0" }, t + dur);
  };
  R.hop = (who, t, { x, y, h = 90, dur = 0.5 } = {}) => {
    const p = posAt(who, t);
    const tx = x ?? p.x, ty = y ?? p.y;
    const el = $(who), sq = $(who + "-sq");
    (sqSpans[who] = sqSpans[who] || []).push([t, t + 0.68 + dur]);
    tl.to(sq, { scaleX: 1.14, scaleY: 0.84, duration: 0.1, ease: "power2.out", svgOrigin: "0 0" }, t);
    tl.to(sq, { scaleX: 0.9, scaleY: 1.14, duration: 0.14, ease: "power2.out", svgOrigin: "0 0" }, t + 0.1);
    tl.to(el, { x: tx, duration: dur, ease: "none" }, t + 0.1);
    tl.to(el, { y: Math.min(p.y, ty) - h, duration: dur * 0.5, ease: "power2.out" }, t + 0.1);
    tl.to(el, { y: ty, duration: dur * 0.5, ease: "power2.in" }, t + 0.1 + dur * 0.5);
    tl.to(sq, { scaleX: 1, scaleY: 1, duration: dur * 0.3, ease: "sine.inOut", svgOrigin: "0 0" }, t + 0.24);
    tl.to(sq, { scaleX: 1.18, scaleY: 0.8, duration: 0.08, ease: "power2.out", svgOrigin: "0 0" }, t + 0.1 + dur);
    tl.to(sq, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.35)", svgOrigin: "0 0" }, t + 0.18 + dur);
    R.pos[who].push({ t: t + 0.1 + dur, x: tx, y: ty, s: p.s });
  };
  // Held poses live on their own group, so a squash or a hop never resets them.
  R.lean = (who, t, deg, dur = 0.35, ease = "back.out(1.8)") =>
    tl.to($(who + "-pose"), { rotation: deg, duration: dur, ease, svgOrigin: "0 0" }, t);
  R.stretch = (who, t, sx, sy, dur = 0.35, ease = "back.out(1.6)") =>
    tl.to($(who + "-pose"), { scaleX: sx, scaleY: sy, duration: dur, ease, svgOrigin: "0 0" }, t);
  // raise: 0 hangs down, 90 points out sideways, 160 is straight up.
  R.arm = (who, side, t, raise, dur = 0.3, ease = "back.out(2)") => {
    const a = $(who + "-arm" + side);
    tl.to(a, { rotation: side === "L" ? raise : -raise, duration: dur, ease, svgOrigin: a.dataset.sx + " " + a.dataset.sy }, t);
  };
  R.arms = (who, t, l, r, dur, ease) => { R.arm(who, "L", t, l, dur, ease); R.arm(who, "R", t + 0.05, r, dur, ease); };
  // A finite tremble on the breath group (x only, so it never fights the breath's scale).
  R.shake = (who, t, dur = 1, amp = 5) => {
    const n = Math.max(1, Math.floor(dur / 0.06));
    const el = $(who + "-br");
    tl.fromTo(el, { x: -amp }, { x: amp, duration: 0.06, ease: "none", yoyo: true, repeat: n - 1 }, t);
    tl.to(el, { x: 0, duration: 0.06 }, t + n * 0.06);
  };
  R.look = (who, t, dx, dy = 0, hold = 1.2) => {
    tl.to([$(who + "-pupL"), $(who + "-pupR")], { x: dx, y: dy, duration: 0.12, ease: "power2.out" }, t);
    (R.looks[who] = R.looks[who] || []).push([t, t + hold]);
  };
  R.sweat = (who, t, dur = 1.2) => {
    const el = $(who + "-sweat");
    tl.fromTo(el, { opacity: 0, y: 0 }, { opacity: 1, duration: 0.15 }, t);
    tl.to(el, { y: 40, duration: dur, ease: "power1.in" }, t + 0.15);
    tl.to(el, { opacity: 0, duration: 0.15 }, t + 0.15 + dur);
  };

  // ---------- face ----------
  const lidD = (lid, el) => {
    if (lid !== "half") return "M0,0";
    const rx = +el.dataset.rx + 3, ry = +el.dataset.ry + 3;
    return `M${-rx},-2 A${rx},${ry} 0 0 1 ${rx},-2 Z`;
  };
  R.applyMood = (who, t, mood, take = true) => {
    const [brow, mouth, lid] = MOODS[mood];
    tl.set([$(who + "-browL"), $(who + "-browR")], { attr: { d: BROWS[brow] } }, t);
    tl.set($(who + "-mouth"), { attr: { d: MOUTHS[mouth][0], fill: MOUTHS[mouth][1] ? "#5B1A1A" : "none" } }, t);
    tl.set($(who + "-lidL"), { attr: { d: lidD(lid, $(who + "-lidL")) } }, t);
    tl.set($(who + "-lidR"), { attr: { d: lidD(lid, $(who + "-lidR")) } }, t);
    if (take) R.squash(who, Math.max(0, t - 0.08), 1.06, 0.93, 0.08);
  };
  R.mood = (who, t, mood, take = true) => {
    R.moods[who].push([t, mood]);
    R.moods[who].sort((a, b) => a[0] - b[0]);
    R.applyMood(who, t, mood, take);
  };
  const moodAt = (who, t) => {
    let m = "normal";
    for (const [mt, mm] of R.moods[who] || []) if (mt <= t + 1e-6) m = mm;
    return m;
  };
  R.mouth = (who, t, shape) =>
    tl.set($(who + "-mouth"), { attr: { d: MOUTHS[shape][0], fill: MOUTHS[shape][1] ? "#5B1A1A" : "none" } }, t);
  R.noBlink = (who) => (R.blinkOff[who] = true);
  R.blink = (who, t) => {
    const els = [$(who + "-eyeL"), $(who + "-eyeR")];
    tl.to(els, { scaleY: 0.08, duration: 0.05, ease: "power1.in", svgOrigin: "0 0" }, t);
    tl.to(els, { scaleY: 1, duration: 0.09, ease: "power1.out", svgOrigin: "0 0" }, t + 0.06);
  };

  // ---------- camera, light, props ----------
  // Frames world point (cx, cy) at the centre of the canvas at scale s. In wide, a vertical framing
  // becomes a tighter one on the same subject: wide shots centre on the gang, and the view never
  // leaves the drawn set.
  const wideFrame = (s, cx, cy) => {
    if (RIG_DATA.WORLD === "door") return [s, 540, 760];
    const sw = s < 1.3 ? 1.38 : Math.max(1.38, s * 0.92);
    const cyw = s < 1.3 ? 900 : cy - 60;
    const hw = W / 2 / sw, hh = H / 2 / sw;
    return [sw, Math.max(-200 + hw, Math.min(1280 - hw, cx)), Math.max(-200 + hh, Math.min(2120 - hh, cyw))];
  };
  R.cam = (t, s, cx, cy, dur = 0, ease = "power3.inOut") => {
    if (WIDE) [s, cx, cy] = wideFrame(s, cx, cy);
    const v = { x: W / 2 - s * cx, y: H / 2 - s * cy, scale: s, svgOrigin: "0 0" };
    if (dur <= 0) tl.set($("cam"), v, t);
    else tl.to($("cam"), { ...v, duration: dur, ease }, t);
    R.cams.push({ t: t + dur, s, cx, cy });
    R.cams.sort((a, b) => a.t - b.t);
  };
  const camAt = (t) => {
    let c = { s: 1, cx: W / 2, cy: H / 2 };
    for (const k of R.cams) if (k.t <= t + 1e-6) c = k;
    return c;
  };
  R.toScreen = (x, y, t) => {
    const c = camAt(t);
    return [W / 2 + c.s * (x - c.cx), H / 2 + c.s * (y - c.cy), c.s];
  };
  R.light = (t, on) => {
    const el = $("dark");
    if (on) {
      tl.set(el, { opacity: 0.35 }, t);
      tl.set(el, { opacity: 0 }, t + 0.05);
      tl.set(el, { opacity: 0.22 }, t + 0.1);
      tl.set(el, { opacity: 0 }, t + 0.15);
    } else {
      tl.to(el, { opacity: 0.45, duration: 0.08, ease: "power1.in" }, t);
    }
  };
  R.lightAt0 = (on) => tl.set($("dark"), { opacity: on ? 0 : 0.45 }, 0);
  R.show = (id, t, v = 1) => tl.set($(id), { opacity: v }, t);
  R.to = (id, t, vars) => tl.to(typeof id === "string" ? $(id) : id, vars, t);
  R.fromTo = (id, t, from, to) => tl.fromTo(typeof id === "string" ? $(id) : id, from, to, t);
  R.set = (id, t, vars) => tl.set(typeof id === "string" ? $(id) : id, vars, t);
  // Title words that slam in one by one (a .slam element holding <span>s).
  R.slam = (id, t, hold = 1.4) => {
    const words = $(id).querySelectorAll("span");
    words.forEach((w, i) => {
      tl.fromTo(w, { scale: 2.4, opacity: 0, rotation: i % 2 ? 6 : -6 },
        { scale: 1, opacity: 1, rotation: i % 2 ? 2 : -2, duration: 0.22, ease: "back.out(2.5)" }, t + i * 0.12);
    });
    tl.to(words, { scale: 0.7, opacity: 0, duration: 0.16, ease: "power2.in", stagger: 0.03 }, t + hold);
  };

  // ---------- finish: breath, blinks, lip-sync, looks, bubbles, line boil ----------
  R.finish = () => {
    const cast = Object.keys(R.pos);
    cast.forEach((who, ci) => {
      const r = rng(1000 + ci * 77 + P.length * 13);
      // Idle breath, each character on its own period and phase.
      const per = 2.1 + r() * 0.9;
      const n = Math.max(1, Math.floor(R.D / (per / 2)));
      tl.fromTo($(who + "-br"), { scaleY: 1, scaleX: 1, svgOrigin: "0 0" },
        { scaleY: 1.03, scaleX: 0.99, duration: per / 2, ease: "sine.inOut", yoyo: true, repeat: n - 1, svgOrigin: "0 0" }, r() * 0.4);
      // Blinks every 2-4 s.
      if (!R.blinkOff[who]) for (let t = 0.6 + r() * 1.5; t < R.D - 0.3; t += 2 + r() * 2.2) R.blink(who, t);
    });
    // Lip-sync from the voice envelope (15 levels a second) and eyes on the speaker.
    R.L.forEach((ln) => {
      if (!R.pos[ln.who]) return;
      let last = null;
      ln.mouth.forEach((lv, k) => {
        const t = ln.start + k / 15;
        const shape = lv === 0 ? MOODS[moodAt(ln.who, t)][1] : lv === 1 ? "o" : ln.yell ? "yell" : "open";
        if (shape !== last) R.mouth(ln.who, clampT(t), shape);
        last = shape;
      });
      R.mouth(ln.who, clampT(ln.end + 0.02), MOODS[moodAt(ln.who, ln.end + 0.02)][1]);
      R.squash(ln.who, Math.max(0, ln.start - 0.05), 1.04, 0.96, 0.08);
      const sp = posAt(ln.who, ln.start);
      cast.forEach((o) => {
        if (o === ln.who) return;
        const busy = (R.looks[o] || []).some(([a, b]) => ln.start + 0.1 < b && ln.start + 0.1 >= a - 0.2);
        if (busy) return;
        const op = posAt(o, ln.start);
        const dx = Math.sign(sp.x - op.x) * 7;
        tl.to([$(o + "-pupL"), $(o + "-pupR")], { x: dx, y: -3, duration: 0.14, ease: "power2.out" }, ln.start + 0.1);
      });
    });
    // Speech bubbles, placed over the speaker's head as framed by the camera at that moment.
    R.L.forEach((ln) => {
      const b = $("b" + ln.i);
      if (!b) return;
      const inner = b.firstElementChild, tail = b.querySelector(".tail");
      const w = Math.min(820, inner.offsetWidth), h = inner.offsetHeight;
      let sx, sy;
      if (R.pos[ln.who]) {
        const p = posAt(ln.who, ln.start);
        const head = RIG_DATA.CAST[ln.who].headTop * p.s;
        [sx, sy] = R.toScreen(p.x, p.y + head, ln.start);
      } else {
        sx = W - 20; sy = H * 0.4; // off screen to the right: Mummy at the door
      }
      // Above the head; in wide, when there is no room above, beside the head instead.
      const top0 = WIDE ? 40 : 190, mx = WIDE ? 100 : 80;
      let bottom = Math.max(top0 + h, Math.min(H - (WIDE ? 80 : 620), sy - 40));
      let left = Math.max(mx, Math.min(W - mx - w, sx - w / 2));
      if (WIDE && sy - 40 - h < top0 && R.pos[ln.who]) {
        bottom = Math.min(H - 80, Math.max(top0 + h, sy + h * 0.6));
        left = sx > W / 2 ? Math.max(mx, sx - 110 - w) : Math.min(W - mx - w, sx + 110);
      }
      b.style.left = left + "px";
      b.style.top = bottom - h + "px";
      tail.style.left = Math.max(46, Math.min(w - 46, sx - left)) + "px";
      tl.fromTo(inner, { scale: 0.4, opacity: 0, transformOrigin: `${Math.max(46, Math.min(w - 46, sx - left))}px 100%` },
        { scale: 1, opacity: 1, duration: 0.26, ease: "back.out(2.2)" }, Math.max(0, ln.start - 0.06));
      const out = Math.min(R.D - 0.02, ln.end + ln.hold) - 0.14;
      tl.to(inner, { scale: 0.85, opacity: 0, duration: 0.12, ease: "power2.in" }, out);
    });
    // Hand-drawn line boil: re-seed the wobble filter 12 times a second.
    const turb = $("turb");
    for (let k = 0; k < Math.ceil(R.D * 12); k++) tl.set(turb, { attr: { seed: (k % 6) + 1 } }, k / 12);
  };
  return R;
}
