// Fridge Gang · Episode 1 · "Sabzi Kaun Banega?"
// Sunday. Mummy is going to cook a sabzi. Tamatar, Aloo and Bhindi fake being rotten so she
// picks none of them... but Mummy finds the raisin stuck on Tamatar: they're all fresh, and
// tonight is MIX VEG. Turns out being cooked together is the best plan of all. Then a pizza moves in.
//
// Marks: cast { who: [x, feetY, scale, flip] }. Lines: `say` is voiced (Devanagari + English),
// `cap` is the speech bubble (CAPS words are highlighted in the speaker's colour).
// act(R, L) runs in the browser on the rig (engine/rig.js); L[n].start / L[n].end are seconds in
// the shot. sfx(L) returns [name, seconds, volume] from the bundled sound effects.

const MID = 1186; // feet on the middle shelf
const MARKS = { aloo: [292, MID], tamatar: [578, MID], bhindi: [832, MID] };

export default {
  title: "Sabzi Kaun Banega?",

  // Shared moves, attached to the rig in every shot.
  helpers: (R) => {
    // Disguises from "Operation Sadda Hua", kept on from shot s4 onwards.
    R.rotten = (t = 0, d = 0.001) => {
      R.set("tamatar-extra", t, { opacity: 1 });
      R.stretch("tamatar", t, 1.06, 0.94, d);
      R.lean("bhindi", t, 13, d);
      R.stretch("bhindi", t, 0.96, 0.9, d);
      R.mood("bhindi", t, "droop", false);
      R.mood("aloo", t, "sleepy", false);
      R.mood("tamatar", t, "sad", false);
      R.$("aloo-extra").querySelectorAll(".sprout").forEach((el) => R.set(el, t, { scale: 1 }));
    };
    // Mummy saw through it: the disguises drop (Aloo's sprouts stay, he really is sprouting).
    R.busted = (t = 0, d = 0.001) => {
      R.set("tamatar-extra", t, { opacity: 0 });
      R.stretch("tamatar", t, 1, 1, d);
      R.lean("bhindi", t, 0, d);
      R.stretch("bhindi", t, 1, 1, d);
      R.mood("bhindi", t, "normal", false);
      R.mood("tamatar", t, "normal", false);
    };
    R.fresh = () => {
      R.set("tamatar-extra", 0, { opacity: 0 });
      R.set("aloo-extra", 0, { opacity: 0 });
    };
    R.handAt = (t, x, y) => R.set("hand", t, { x, y, opacity: 1 });
    R.handTo = (t, x, y, dur = 0.5, ease = "power3.out") => R.to("hand", t, { x, y, duration: dur, ease });
  },

  shots: [
    {
      id: "s1",
      name: "freeze",
      cast: { ...MARKS },
      lead: 1.9,
      tail: 3.1,
      lines: [{ who: "tamatar", cap: "Phew… bach gaye!", say: "फ़्यू… बच गए!" }],
      html: `
  <div id="s1-title" class="slam" style="top: 250px"><span>FRIDGE</span><br /><span>GANG</span></div>
  <div id="s1-sub" class="ep-sub"><span>Episode 1 · Sabzi Kaun Banega?</span></div>`,
      css: `
#root .ep-sub span { display: inline-block; padding: 14px 40px; background: #F6C445; border: 6px solid #2A1B14; border-radius: 40px; }
#root .ep-sub { position: absolute; left: 0; width: 100%; top: 610px; text-align: center; z-index: 6;
  font-family: "Nunito", sans-serif; font-weight: 900; font-size: 50px; color: #2A1B14; }
`,
      act: (R, L) => {
        R.fresh();
        ["aloo", "tamatar", "bhindi"].forEach((w) => R.noBlink(w));
        R.cam(0, 1.16, 562, 985);
        // Frozen mid-dance when the light came on.
        R.mood("tamatar", 0, "shock", false); R.arms("tamatar", 0, 150, 120, 0.001); R.lean("tamatar", 0, -9, 0.001);
        R.mood("aloo", 0, "shock", false); R.arms("aloo", 0, 105, 35, 0.001); R.lean("aloo", 0, 10, 0.001);
        R.mood("bhindi", 0, "shock", false); R.arms("bhindi", 0, 30, 165, 0.001); R.lean("bhindi", 0, 12, 0.001);
        R.look("tamatar", 0, 6, -6, 1.6); R.look("aloo", 0, 7, -7, 1.6); R.look("bhindi", 0, -2, -8, 1.6);
        // Mummy takes the water bottle.
        R.handAt(0, 520, 390);
        R.handTo(0.3, -30, 390, 0.5);
        R.to("bottle", 1.0, { x: 560, duration: 0.42, ease: "power3.in" });
        R.handTo(1.0, 530, 390, 0.42, "power3.in");
        R.light(1.45, false);
        // Unfreeze: everyone breathes out at once, then not quite at once.
        [["tamatar", 1.62], ["aloo", 1.74], ["bhindi", 1.68]].forEach(([w, t]) => {
          R.mood(w, t, "normal");
          R.arms(w, t, 0, 0, 0.4, "power2.out");
          R.lean(w, t, 0, 0.5, "elastic.out(1, 0.5)");
          R.stretch(w, t, 1.1, 0.88, 0.16, "power2.out");
          R.stretch(w, t + 0.16, 1, 1, 0.5, "elastic.out(1, 0.4)");
        });
        R.arm("tamatar", "R", L[0].start - 0.1, 150, 0.3);
        R.arm("tamatar", "R", L[0].end + 0.1, 0, 0.35, "power2.inOut");
        R.mood("tamatar", L[0].start + 0.3, "happy");
        // Title.
        R.slam("title", L[0].end + 0.25, 2.5);
        R.fromTo("sub", L[0].end + 0.6, { opacity: 0, scale: 0.6, rotation: -4 },
          { opacity: 1, scale: 1, rotation: -2, duration: 0.3, ease: "back.out(2.4)" });
        R.to("sub", L[0].end + 2.7, { opacity: 0, scale: 0.8, duration: 0.15, ease: "power2.in" });
      },
      sfx: (L) => [["whoosh-short", 0.32, 0.35], ["whoosh-short", 1.0, 0.3], ["impact-bass-2", 1.43, 0.3],
        ["impact-bass-1", L[0].end + 0.27, 0.45], ["pop", L[0].end + 0.62, 0.5]],
    },

    {
      id: "s2",
      bottle: false,
      name: "sunday",
      cast: { ...MARKS },
      light: "off",
      lead: 0.45,
      tail: 0.6,
      lines: [
        { who: "tamatar", cap: "Guys… aaj SUNDAY hai!", say: "Guys… आज Sunday है!" },
        { who: "tamatar", gap: 0.3, cap: "Mummy sabzi banayengi… aur sabse pehle MUJHE uthayengi!", say: "Mummy सब्ज़ी बनाएँगी… और सबसे पहले मुझे उठाएँगी!" },
        { who: "aloo", gap: 0.45, cap: "Toh? Main toh har sabzi mein hota hoon. CHILL.", say: "तो? मैं तो हर सब्ज़ी में होता हूँ। Chill." },
        { who: "bhindi", gap: 0.35, cap: "Chill nahi. PLAN chahiye.", say: "Chill नहीं। Plan चाहिए।" },
      ],
      act: (R, L) => {
        R.fresh();
        R.cam(0, 1.16, 562, 985);
        R.mood("tamatar", 0.15, "scared");
        R.shake("tamatar", 0.2, L[0].end - 0.2, 4);
        R.sweat("tamatar", 0.5, 1.4);
        R.arms("tamatar", L[1].start, 160, 160, 0.3);
        R.hop("tamatar", L[1].start + 0.9, { h: 60, dur: 0.42 });
        R.arm("tamatar", "L", L[1].end - 1.3, 40, 0.25);
        R.arm("tamatar", "R", L[1].end - 1.3, 0, 0.3, "power2.out");
        R.arm("tamatar", "L", L[1].end + 0.2, 0, 0.4, "power2.out");
        R.mood("aloo", L[2].start - 0.4, "sleepy");
        R.mouth("aloo", L[2].start - 0.35, "open");
        R.mouth("aloo", L[2].start - 0.05, "flat");
        R.arms("aloo", L[2].start - 0.3, 155, 155, 0.5, "power2.out");
        R.lean("aloo", L[2].start - 0.3, 8, 0.6, "power2.out");
        R.mood("bhindi", L[3].start - 0.25, "sly");
        R.lean("bhindi", L[3].start - 0.2, -10, 0.4);
        R.arm("bhindi", "L", L[3].start + 0.1, 85, 0.25);
        R.cam(L[3].start - 0.1, 1.22, 680, 900, 0.55);
      },
      sfx: (L) => [["pop", L[1].start + 1.45, 0.3]],
    },

    {
      id: "s3",
      bottle: false,
      name: "plan",
      cast: { ...MARKS },
      light: "off",
      lead: 0.35,
      tail: 1.9,
      lines: [
        { who: "bhindi", cap: "Jo sabse bekaar dikhega… use koi nahi UTHAYEGA.", say: "जो सबसे बेकार दिखेगा… उसे कोई नहीं उठाएगा।" },
        { who: "tamatar", gap: 0.35, cap: "Matlab… hum KHARAB ban jaayein?!", say: "मतलब… हम ख़राब बन जाएँ?!" },
        { who: "bhindi", gap: 0.3, cap: "Bilkul. Operation…", say: "बिल्कुल। Operation… सड़ा हुआ!", yell: true },
      ],
      html: `<div id="s3-op" class="slam" style="top: 560px"><span>OPERATION</span><br /><span>SADDA</span><span>HUA!</span></div>`,
      act: (R, L) => {
        R.fresh();
        R.cam(0, 1.42, 725, 880);
        R.mood("bhindi", 0, "sly", false);
        R.lean("bhindi", 0, -10, 0.001);
        R.mood("tamatar", 0, "scared", false);
        R.arm("bhindi", "R", L[0].start + 0.2, 150, 0.3);
        R.arm("bhindi", "R", L[0].end - 0.2, 20, 0.35, "power2.out");
        R.look("bhindi", L[0].start + 0.9, -8, 0, 0.5);
        R.look("bhindi", L[0].start + 1.4, 8, 0, 0.5);
        R.look("bhindi", L[0].start + 1.9, -6, 2, 1);
        R.lean("tamatar", L[0].start + 1.0, 7, 0.5, "power2.out");
        R.lean("bhindi", L[0].end - 0.6, -16, 0.5, "power2.inOut");
        R.lean("tamatar", L[1].start - 0.1, 0, 0.3);
        R.mood("tamatar", L[1].start - 0.1, "shock");
        R.hop("tamatar", L[1].start, { h: 50, dur: 0.38 });
        R.cam(L[1].start - 0.05, 1.42, 650, 900, 0.4);
        R.mood("bhindi", L[2].start, "happy");
        R.lean("bhindi", L[2].start, 0, 0.3);
        R.arms("bhindi", L[2].end - 0.95, 160, 160, 0.25, "back.out(2.5)");
        R.cam(L[2].end - 0.95, 1.16, 562, 985, 0.35, "power3.out");
        R.mood("tamatar", L[2].end - 0.7, "happy");
        R.arms("tamatar", L[2].end - 0.7, 150, 150, 0.25);
        R.mood("aloo", L[2].end - 0.5, "sleepy");
        R.slam("op", L[2].end - 0.9, 1.9);
      },
      sfx: (L) => [["impact-bass-1", L[2].end - 0.86, 0.5], ["whoosh-short", L[2].end - 0.98, 0.3]],
    },

    {
      id: "s4",
      bottle: false,
      name: "disguise",
      cast: { ...MARKS },
      light: "off",
      lead: 0.85,
      tail: 0.6,
      lines: [
        { who: "tamatar", cap: "Dekho! Main toh SADD gaya!", say: "देखो! मैं तो सड़ गया!" },
        { who: "bhindi", gap: 1.45, cap: "Aur main… murjha gayi.", say: "और मैं… मुरझा गई।" },
        { who: "aloo", gap: 1.5, cap: "Main toh… ALREADY ug raha hoon.", say: "मैं तो… already उग रहा हूँ।" },
      ],
      act: (R, L) => {
        R.fresh();
        const sprouts = R.$("aloo-extra").querySelectorAll(".sprout");
        const base = ["-40 -286", "20 -292", "80 -276"];
        sprouts.forEach((el, i) => R.set(el, 0, { scale: 0, svgOrigin: base[i] }));
        R.set("aloo-extra", 0, { opacity: 1 });
        // A. Tamatar scrunches up and a rotten spot appears.
        R.cam(0, 1.75, 578, 1020);
        R.mood("tamatar", 0.2, "angry");
        R.stretch("tamatar", 0.25, 1.14, 0.84, 0.3, "power2.in");
        R.fromTo("tamatar-extra", 0.62, { opacity: 0 }, { opacity: 1, duration: 0.06 });
        R.stretch("tamatar", 0.62, 1.06, 0.94, 0.4, "elastic.out(1, 0.4)");
        R.mood("tamatar", L[0].start - 0.05, "happy");
        R.arms("tamatar", L[0].start, 95, 95, 0.3);
        R.arms("tamatar", L[0].end + 0.2, 0, 0, 0.3, "power2.out");
        // B. Bhindi wilts.
        const tB = L[0].end + 0.95;
        R.cam(tB, 1.5, 820, 900);
        R.mood("bhindi", tB + 0.1, "droop");
        R.lean("bhindi", tB + 0.15, 13, 0.8, "power2.inOut");
        R.stretch("bhindi", tB + 0.15, 0.96, 0.9, 0.8, "power2.inOut");
        // C. Aloo does nothing; sprouts appear anyway.
        const tC = L[1].end + 0.75;
        R.cam(tC, 1.55, 300, 990);
        R.mood("aloo", tC, "sleepy", false);
        R.mood("tamatar", tC, "sad", false);
        sprouts.forEach((el, i) =>
          R.fromTo(el, tC + 0.15 + i * 0.18, { scale: 0, svgOrigin: base[i] }, { scale: 1, duration: 0.3, ease: "back.out(3)", svgOrigin: base[i] }));
      },
      sfx: (L) => {
        const tC = L[1].end + 0.75;
        return [["pop", 0.64, 0.55], ["pop", tC + 0.19, 0.4], ["pop", tC + 0.37, 0.45], ["pop", tC + 0.55, 0.5]];
      },
    },

    {
      id: "s5",
      bottle: false,
      name: "door",
      cast: { ...MARKS },
      light: "off",
      lead: 3.55,
      tail: 1.1,
      lines: [
        { who: "mummy", cap: "Arre! Saari sabzi KHARAB ho gayi?!", say: "अरे! सारी सब्ज़ी ख़राब हो गई?!" },
        { who: "mummy", gap: 1.2, cap: "Ek minute… ye toh KISHMISH hai!", say: "एक मिनट… ये तो किशमिश है!" },
        { who: "mummy", gap: 0.45, cap: "Sab FRESH hain! Shaam ko banegi… MIX VEG!", say: "सब fresh हैं! शाम को बनेगी… mix veg!" },
      ],
      act: (R, L) => {
        R.rotten(0);
        R.cam(0, 1.16, 562, 985);
        ["aloo", "tamatar", "bhindi"].forEach((w) => R.noBlink(w));
        R.light(0.45, true);
        R.handAt(0, 620, 860);
        R.handTo(0.85, -280, 860, 0.9, "power2.out");
        R.look("tamatar", 1.2, 4, -9, 1.4);
        R.sweat("tamatar", 1.35, 1.2);
        R.shake("tamatar", 1.3, 1.0, 3);
        R.handTo(2.15, -575, 800, 0.6, "power2.inOut");
        R.handTo(2.85, -575, 880, 0.12, "power2.in");
        R.squash("aloo", 2.95, 1.16, 0.82, 0.08);
        R.handTo(3.05, -470, 790, 0.3, "back.out(2)");
        R.look("aloo", 3.0, 0, -8, 2.5);
        R.look("bhindi", L[0].start + 0.3, 9, -2, 2);
        // The hand finds the raisin on Tamatar's cheek and plucks it off.
        const tP = L[0].end + 0.25;
        R.handTo(tP, -100, 1070, 0.5, "power2.inOut");
        R.look("tamatar", tP + 0.2, 6, -4, 2.5);
        R.shake("tamatar", tP + 0.3, 0.5, 4);
        R.handTo(tP + 0.75, -100, 1088, 0.08, "power2.in");
        R.set("tamatar-extra", tP + 0.83, { opacity: 0 });
        R.stretch("tamatar", tP + 0.83, 1, 1, 0.4, "elastic.out(1, 0.4)");
        R.mood("tamatar", tP + 0.85, "shock");
        R.handTo(tP + 0.9, -60, 960, 0.3, "power2.out");
        // Busted. Everyone gives up the act while Mummy decides.
        R.mood("bhindi", L[2].start + 0.2, "shock");
        R.lean("bhindi", L[2].start + 0.25, 0, 0.4, "back.out(2)");
        R.stretch("bhindi", L[2].start + 0.25, 1, 1, 0.4, "back.out(2)");
        R.mood("aloo", L[2].start + 0.4, "shock");
        R.handTo(L[2].end + 0.1, 700, 760, 0.4, "power3.in");
        R.light(L[2].end + 0.6, false);
      },
      sfx: (L) => [["click", 0.4, 0.5], ["whoosh-short", 0.85, 0.3], ["pop", 2.97, 0.35], ["pop", L[0].end + 1.1, 0.55],
        ["whoosh-short", L[2].end + 0.1, 0.3], ["impact-bass-2", L[2].end + 0.58, 0.3]],
    },

    {
      id: "s6",
      bottle: false,
      name: "together",
      cast: { ...MARKS },
      light: "off",
      lead: 0.45,
      tail: 0.6,
      lines: [
        { who: "tamatar", cap: "Mix veg… matlab hum TEENO saath?!", say: "Mix veg… मतलब हम तीनों साथ?!" },
        { who: "bhindi", gap: 0.35, cap: "Teeno saath? Phir toh hum SUPERSTAR!", say: "तीनों साथ? फिर तो हम superstar!" },
        { who: "tamatar", gap: 0.3, cap: "TEAM FRIDGE GANG!", say: "Team… Fridge Gang!", yell: true },
        { who: "aloo", gap: 0.35, cap: "Maine bola tha… CHILL.", say: "मैंने बोला था… chill." },
      ],
      act: (R, L) => {
        R.rotten(0);
        R.busted(0);
        R.mood("aloo", 0, "shock", false);
        R.cam(0, 1.16, 562, 985);
        R.mood("tamatar", 0.1, "shock");
        R.look("tamatar", L[0].start + 0.6, -7, 0, 0.8);
        R.look("tamatar", L[0].start + 1.2, 7, 0, 0.8);
        R.mood("bhindi", L[1].start, "happy");
        R.arms("bhindi", L[1].start + 0.6, 150, 150, 0.25);
        R.hop("bhindi", L[1].end - 0.5, { h: 70, dur: 0.44 });
        R.mood("tamatar", L[1].end - 0.2, "happy");
        R.mood("aloo", L[2].start - 0.3, "happy");
        R.arms("tamatar", L[2].start, 165, 165, 0.25);
        R.hop("tamatar", L[2].start + 0.05, { h: 120, dur: 0.5 });
        R.arms("aloo", L[2].start + 0.12, 150, 150, 0.3);
        R.hop("aloo", L[2].start + 0.2, { h: 40, dur: 0.36 });
        R.hop("bhindi", L[2].start + 0.1, { h: 90, dur: 0.48 });
        R.mood("aloo", L[3].start - 0.3, "sleepy");
        R.arms("aloo", L[3].start - 0.2, 155, 155, 0.45, "power2.out");
        R.arms("tamatar", L[3].start, 0, 0, 0.4, "power2.out");
        R.arms("bhindi", L[3].start + 0.1, 0, 0, 0.4, "power2.out");
        R.mood("bhindi", L[3].start + 0.4, "sly");
        R.look("bhindi", L[3].start + 0.4, -5, -9, 1.5);
      },
      sfx: (L) => [["pop", L[1].end - 0.05, 0.3], ["impact-bass-1", L[2].start + 0.05, 0.35]],
    },

    {
      id: "s7",
      bottle: false,
      name: "pizza",
      cast: { ...MARKS, pizza: [813, 860, 0.78] },
      clip: { pizza: [0, 0, 1080, 556] },
      light: "off",
      lead: 3.7,
      tail: 1.6,
      lines: [
        { who: "pizza", cap: "Hello… naye PADOSIYO.", say: "Hello… नए पड़ोसियो।" },
        { who: "tamatar", gap: 0.45, cap: "Ye… KAUN hai?", say: "ये… कौन है?" },
      ],
      act: (R, L) => {
        R.rotten(0);
        R.busted(0);
        R.noBlink("pizza");
        R.cam(0, 1.16, 562, 985);
        R.mood("pizza", 0, "cool", false);
        R.set("bottle", 0, { opacity: 0 });
        // Mummy slides a pizza box into the bottle's empty spot.
        R.light(0.35, true);
        R.set("box", 0, { x: 1450, y: 556, opacity: 1 });
        R.handAt(0, 640, 450);
        R.to("box", 0.55, { x: 813, duration: 0.55, ease: "power3.out" });
        R.handTo(0.55, -40, 450, 0.55);
        R.handTo(1.3, 640, 450, 0.4, "power3.in");
        R.light(1.75, false);
        ["aloo", "tamatar", "bhindi"].forEach((w, i) => R.look(w, 0.9 + i * 0.08, 8, -9, 6));
        // The lid lifts by itself.
        R.mood("tamatar", 2.2, "scared");
        R.shake("tamatar", 2.25, 1.0, 3);
        R.cam(2.2, 1.35, 720, 720, 1.2, "power2.inOut");
        R.to("lid", 2.65, { y: -520, x: -260, rotation: -200, duration: 0.6, ease: "power2.out", svgOrigin: "0 -78" });
        R.to("lid", 3.0, { opacity: 0, duration: 0.25 });
        R.to("pizza", 2.85, { y: 548, duration: 0.55, ease: "back.out(1.6)" });
        R.posAt("pizza", 0).y = 548;
        R.arm("pizza", "R", L[0].start + 0.1, 150, 0.3);
        R.arm("pizza", "R", L[0].end, 20, 0.4, "power2.out");
        ["aloo", "tamatar", "bhindi"].forEach((w, i) => R.mood(w, 3.25 + i * 0.07, "shock"));
        R.cam(L[1].start - 0.15, 1.16, 562, 985);
        R.mood("tamatar", L[1].start - 0.1, "scared");
      },
      sfx: (L) => [["click", 0.3, 0.5], ["whoosh-short", 0.55, 0.35], ["impact-bass-2", 1.72, 0.3], ["riser", 1.25, 0.35],
        ["impact-bass-1", 3.35, 0.45]],
    },

    {
      id: "s8",
      name: "end card",
      world: "door",
      lead: 0.5,
      tail: 1.6,
      lines: [{ who: "tamatar", noBubble: true, cap: "Ye naya padosi kaun hai? Agle episode mein milte hain!", say: "ये नया पड़ोसी कौन है? अगले episode में मिलते हैं!" }],
      html: `
  <div id="s8-logo" class="magnets">
    <span class="m c1">F</span><span class="m c2">R</span><span class="m c3">I</span><span class="m c4">D</span><span class="m c5">G</span><span class="m c1">E</span>
    <br /><span class="m c3">G</span><span class="m c5">A</span><span class="m c2">N</span><span class="m c4">G</span>
  </div>
  <div id="s8-note" class="note">
    <div class="n1">Episode 2 jaldi aa raha hai…</div>
    <div class="n2">Naya padosi kaun hai?</div>
  </div>`,
      css: `
#root { background: #8FD3C1; }
#root .magnets { position: absolute; left: 0; top: 330px; width: 100%; text-align: center; z-index: 6; }
#root .magnets .m { display: inline-block; font-family: "Archivo Black", sans-serif; font-size: 150px; line-height: 1.1;
  margin: 0 4px; -webkit-text-stroke: 9px #2A1B14; paint-order: stroke fill; text-shadow: 0 10px 0 rgba(42,27,20,0.35); }
#root .m.c1 { color: #E8402E; } #root .m.c2 { color: #F6C445; } #root .m.c3 { color: #5DAA3C; }
#root .m.c4 { color: #3D8BE0; } #root .m.c5 { color: #F08A24; }
#root .note { position: absolute; left: 50%; margin-left: -370px; top: 780px; width: 740px; padding: 40px 44px; background: #FFF27A;
  border: 6px solid #2A1B14; box-shadow: 0 14px 0 rgba(42,27,20,0.25); z-index: 6; color: #2A1B14;
  font-family: "Nunito", sans-serif; text-align: center; }
#root .note .n1 { font-weight: 900; font-size: 46px; line-height: 1.1; }
#root .note .n2 { font-weight: 800; font-size: 44px; line-height: 1.15; margin-top: 20px; }
`,
      cssWide: `
#root .magnets { top: 140px; }
#root .magnets .m { font-size: 112px; -webkit-text-stroke: 8px #2A1B14; }
#root .note { top: 560px; width: 660px; margin-left: -330px; }`,
      act: (R, L) => {
        R.cam(0, 1, 540, 960);
        const ms = R.$("logo").querySelectorAll(".m");
        ms.forEach((m, i) => R.fromTo(m, 0.15 + i * 0.09,
          { y: -260, rotation: i % 2 ? 14 : -12, opacity: 0, scale: 1.3 },
          { y: 0, rotation: ((i * 37) % 9) - 4, opacity: 1, scale: 1, duration: 0.32, ease: "back.out(2.2)" }));
        R.fromTo("note", 1.2, { opacity: 0, rotation: -10, scale: 0.7, y: 40 },
          { opacity: 1, rotation: -3, scale: 1, y: 0, duration: 0.4, ease: "back.out(2)" });
      },
      sfx: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ["pop", 0.42 + i * 0.09, 0.25 + (i % 3) * 0.08]).concat([["whoosh-short", 1.15, 0.3]]),
    },
  ],
};
