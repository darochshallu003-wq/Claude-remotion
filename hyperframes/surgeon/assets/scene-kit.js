// Shared tween helpers for the kraft explainer scenes. Each returns the
// timeline so calls chain; all positions are seconds on the scene's clock.
window.kraft = {
  header(tl, sel) {
    tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
    tl.fromTo(sel + " .rule", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0);
  },
  headline(tl, sel, dark) {
    tl.fromTo(sel + " .setup", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" }, 0.13);
    tl.fromTo(sel + " .punch", { opacity: 0, y: 40, color: dark ? "#5b5f70" : "#b9ad95" }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.3)" }, 0.4);
    tl.to(sel + " .punch", { color: "#D0312D", duration: 0.47, ease: "none" }, 0.4);
  },
  pop(tl, sel, at, from = {}) {
    const to = { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" };
    if ("x" in from) to.x = 0;
    if ("y" in from) to.y = 0;
    if ("rotation" in from) to.rotation = from.rotation;
    tl.fromTo(sel, { opacity: 0, scale: 0.85, ...from }, to, at);
  },
  fadeIn(tl, sel, at) {
    tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" }, at);
  },
  stamp(tl, sel, at, rot = -9) {
    tl.fromTo(sel, { opacity: 0, scale: 2.4, rotation: rot, xPercent: -50, yPercent: -50 }, { opacity: 0.92, scale: 1, rotation: rot, xPercent: -50, yPercent: -50, duration: 0.35, ease: "back.out(2)" }, at);
  },
  tag(tl, sel, at, rot = -2) {
    tl.fromTo(sel, { scale: 0, rotation: rot }, { scale: 1, rotation: rot, duration: 0.4, ease: "back.out(2.2)" }, at);
  },
  float(tl, sel, amp, dur) {
    // gentle idle bob for the whole scene; finite, seek-safe
    const n = Math.max(1, Math.round(dur / 2.1));
    tl.fromTo(sel, { y: -amp }, { y: amp, duration: dur / n, ease: "sine.inOut", yoyo: true, repeat: n - 1 }, 0);
  },
  enter(tl, wrap, kind) {
    if (kind === "iris") tl.fromTo(wrap, { clipPath: "circle(0% at 50% 55%)" }, { clipPath: "circle(120% at 50% 55%)", duration: 0.467, ease: "power3.inOut" }, 0);
    if (kind === "wipe") {
      tl.fromTo(wrap, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.467, ease: "power3.inOut" }, 0);
      tl.fromTo(wrap + "-line", { y: 0, opacity: 1 }, { y: 1920, duration: 0.467, ease: "power3.inOut" }, 0);
      tl.set(wrap + "-line", { opacity: 0 }, 0.467);
    }
    if (kind === "fade") tl.fromTo(wrap, { opacity: 0 }, { opacity: 1, duration: 0.467, ease: "power2.inOut" }, 0);
  },
};
