// Fridge Gang · Episode 1 · "Bijli Gayi!"
// Night. The gang is singing "Aloo kachaloo" when the power goes out. Bhindi's emergency torch,
// Aloo's scary story about the Garam Masala Monster, eyes in the crisper drawer... and the monster
// turns out to be Mirchi, a tiny chilli who was scared of the dark. The power comes back, Mummy
// opens the door, and the new girl has to learn the gang's one rule: when the light comes on, FREEZE.
//
// Marks: cast { who: [x, feetY, scale, flip] }. Lines: `say` is voiced (Devanagari + English),
// `cap` is the speech bubble (CAPS words take the speaker's colour). act(R, L) runs in the browser
// on the rig (engine/rig.js); L[n].start / L[n].end are seconds in the shot.
// Direct in vertical terms; `node engine/build.mjs ep01 --wide` re-frames every camera for 16:9.

const MID = 1186; // feet on the middle shelf
const MARKS = { aloo: [260, MID], tamatar: [520, MID], bhindi: [860, MID] };
const WIDE = [1.16, 562, 985]; // the whole gang on the middle shelf
const DRAWER = [1.3, 610, 1470]; // down into the crisper drawer

// The Garam Masala Monster, as a shadow on the back wall (drawn into the set, revealed by the torch).
const MONSTER = (p) => `<g transform="translate(330,800)"><g id="${p}-monster" opacity="0">
  <path fill="#120E24" fill-rule="evenodd" d="M-150,120 Q-172,20 -122,-60 L-160,-170 L-92,-96 Q-44,-126 0,-126 Q44,-126 92,-96
    L160,-170 L122,-60 Q172,20 150,120 L122,90 L100,132 L70,95 L40,132 L10,95 L-20,132 L-50,95 L-80,132 L-110,90 Z
    M-78,-44 L-28,-18 L-78,6 Z M78,-44 L28,-18 L78,6 Z
    M-64,38 L-44,62 L-24,40 L0,64 L24,40 L44,62 L64,38 Q0,88 -64,38 Z"/>
  <path fill="#120E24" d="M-130,10 Q-210,-10 -236,-70 L-250,-110 L-226,-84 L-232,-126 L-208,-90 L-196,-124 L-192,-80 Q-170,-40 -120,-30 Z"/>
  <path fill="#120E24" d="M130,10 Q210,-10 236,-70 L250,-110 L226,-84 L232,-126 L208,-90 L196,-124 L192,-80 Q170,-40 120,-30 Z"/>
</g></g>`;

// Mirchi's sneeze: a puff of red chilli dust.
const PUFF = (p) => `<g id="${p}-puff" opacity="0">
  <circle cx="0" cy="0" r="34" fill="#E2552D" opacity="0.85"/><circle cx="-30" cy="14" r="24" fill="#F08A24" opacity="0.85"/>
  <circle cx="26" cy="-18" r="22" fill="#D7263D" opacity="0.8"/><circle cx="-8" cy="-30" r="16" fill="#F08A24" opacity="0.8"/>
  <circle cx="34" cy="20" r="14" fill="#E2552D" opacity="0.8"/>
</g>`;

export default {
  title: "Bijli Gayi!",

  helpers: (R) => {
    R.wide = (t, dur = 0, ease) => R.cam(t, 1.16, 562, 985, dur, ease);
    R.lookAll = (t, dx, dy, hold = 1.5, who = ["aloo", "tamatar", "bhindi"]) =>
      who.forEach((w, i) => R.pos[w] && R.look(w, t + i * 0.06, dx, dy, hold));
    // Bhindi holds the torch in her left hand and points it.
    R.hold = (t, tx, ty, r = 150, dur = 0.45, ease = "power2.inOut") => {
      const [gx, gy] = R.handPos("bhindi", "L", 70);
      R.aim(t, gx, gy, tx, ty, r, dur, ease);
    };
    R.handAt = (t, x, y) => R.set("hand", t, { x, y, opacity: 1 });
    R.handTo = (t, x, y, dur = 0.5, ease = "power3.out") => R.to("hand", t, { x, y, duration: dur, ease });
  },

  shots: [
    {
      id: "s1",
      name: "gaana",
      cast: { ...MARKS },
      lead: 0.35,
      tail: 2.6,
      lines: [
        { who: "tamatar", cap: "Aloo kachaloo beta kahaan gaye the?", say: "आलू कचालू बेटा कहाँ गए थे?" },
        { who: "bhindi", gap: 0.15, cap: "Baingan ki tokri mein so rahe the!", say: "बैंगन की टोकरी में सो रहे थे!" },
        { who: "aloo", gap: 0.3, cap: "Main kisi TOKRI mein nahi soya.", say: "मैं किसी टोकरी में नहीं सोया।" },
        { who: "tamatar", gap: 3.6, cap: "Ye… kya hua?", say: "ये… क्या हुआ?" },
        { who: "aloo", gap: 0.35, cap: "BIJLI GAYI.", say: "बिजली गई।" },
      ],
      html: `
  <div id="s1-title" class="slam" style="top: 330px"><span>BIJLI</span><span>GAYI!</span></div>
  <div id="s1-sub" class="ep-sub"><span>Fridge Gang · Episode 1</span></div>`,
      css: `
#root .ep-sub { position: absolute; left: 0; width: 100%; top: 520px; text-align: center; z-index: 6;
  font-family: "Nunito", sans-serif; font-weight: 900; font-size: 50px; color: #2A1B14; }
#root .ep-sub span { display: inline-block; padding: 12px 40px; background: #F6C445; border: 6px solid #2A1B14; border-radius: 40px; }`,
      cssWide: `
#root .slam { top: 120px !important; }
#root .ep-sub { top: 300px; }`,
      act: (R, L) => {
        R.wide(0);
        // The sing-song: Tamatar and Bhindi dance at Aloo, who is not amused.
        R.mood("tamatar", 0, "happy", false);
        R.mood("bhindi", 0, "happy", false);
        R.mood("aloo", 0, "sleepy", false);
        R.arms("tamatar", 0.1, 150, 60, 0.25);
        R.hop("tamatar", 0.5, { h: 50, dur: 0.36 });
        R.arms("tamatar", 1.0, 60, 150, 0.25);
        R.hop("tamatar", 1.45, { h: 50, dur: 0.36 });
        R.arms("tamatar", L[0].end, 0, 0, 0.3);
        R.arms("bhindi", L[1].start, 160, 40, 0.25);
        R.lean("bhindi", L[1].start, -10, 0.3);
        R.hop("bhindi", L[1].start + 0.6, { h: 50, dur: 0.36 });
        R.arms("bhindi", L[1].start + 1.1, 40, 160, 0.25);
        R.lean("bhindi", L[1].start + 1.1, 10, 0.3);
        R.lean("bhindi", L[1].end + 0.1, 0, 0.3);
        R.arms("bhindi", L[1].end + 0.1, 0, 0, 0.3);
        R.mood("aloo", L[2].start - 0.2, "angry");
        R.arms("aloo", L[2].start, 90, 90, 0.3);
        R.arms("aloo", L[2].end + 0.2, 0, 0, 0.4, "power2.out");
        // The power dies. Silence. Six eyes blink in the dark, one pair at a time.
        const tB = L[2].end + 1.1;
        R.blackout(tB, true);
        ["tamatar", "bhindi", "aloo"].forEach((w) => R.noBlink(w));
        R.mood("tamatar", tB + 0.6, "shock", false);
        R.mood("bhindi", tB + 0.6, "shock", false);
        R.mood("aloo", tB + 0.6, "normal", false);
        R.blink("tamatar", tB + 1.0);
        R.blink("bhindi", tB + 1.45);
        R.blink("aloo", tB + 1.9);
        R.look("tamatar", tB + 1.2, -7, 0, 0.6);
        R.look("tamatar", tB + 1.8, 7, 0, 0.6);
        R.look("bhindi", tB + 1.6, 0, -8, 1.2);
        R.blink("tamatar", L[4].end + 0.5);
        R.slam("title", L[4].end + 0.2, 2.2);
        R.fromTo("sub", L[4].end + 0.55, { opacity: 0, scale: 0.6, rotation: -4 },
          { opacity: 1, scale: 1, rotation: -2, duration: 0.3, ease: "back.out(2.4)" });
        R.to("sub", L[4].end + 2.3, { opacity: 0, scale: 0.8, duration: 0.15, ease: "power2.in" });
      },
      sfx: (L) => [["pop", 0.62, 0.25], ["pop", 1.57, 0.25], ["glitch-3", L[2].end + 1.05, 0.5],
        ["impact-bass-1", L[4].end + 0.22, 0.45]],
    },

    {
      id: "s2",
      name: "torch",
      cast: { ...MARKS },
      lead: 0.6,
      tail: 0.7,
      lines: [
        { who: "bhindi", cap: "Ghabrao mat! Mere paas hai… EMERGENCY TORCH!", say: "घबराओ मत! मेरे पास है… emergency torch!" },
        { who: "tamatar", gap: 0.35, cap: "AAAAH! BHOOT!", say: "आआआह! भूत!", yell: true },
        { who: "aloo", gap: 0.35, cap: "Main hoon. ALOO.", say: "मैं हूँ। आलू।" },
        { who: "tamatar", gap: 0.5, cap: "Mujhe darr nahi lagta! Bas… thodi GARMI lag rahi hai.", say: "मुझे डर नहीं लगता! बस… थोड़ी गर्मी लग रही है।" },
      ],
      act: (R, L) => {
        R.blackoutAt0();
        R.wide(0);
        R.mood("tamatar", 0, "scared", false);
        R.mood("aloo", 0, "sleepy", false);
        R.mood("bhindi", 0, "sly", false);
        // Bhindi digs out a torch... click: straight onto Aloo's face, looming in the dark.
        const tC = L[0].end - 0.15;
        R.arm("bhindi", "L", 0.4, 70, 0.3);
        R.torchOn(0.55, true);
        R.hold(0, 300, 1040, 140, 0);
        R.beamOn(tC, true);
        R.mood("aloo", tC, "sly", false);
        R.look("aloo", tC, 0, 0, 3);
        R.mood("tamatar", L[1].start - 0.08, "shock");
        R.hop("tamatar", L[1].start, { h: 140, dur: 0.55 });
        R.shake("tamatar", L[1].start + 0.7, 0.8, 5);
        R.mood("aloo", L[2].start, "sleepy");
        // Bhindi swings the torch over to Tamatar, who is very brave and very sweaty.
        R.hold(L[2].end + 0.15, 520, 1060, 150, 0.4);
        R.mood("tamatar", L[3].start - 0.1, "happy");
        R.arms("tamatar", L[3].start, 95, 95, 0.3);
        R.mood("tamatar", L[3].start + 1.5, "scared");
        R.sweat("tamatar", L[3].start + 1.6, 1.3);
        R.arms("tamatar", L[3].start + 1.6, 0, 0, 0.4, "power2.out");
      },
      sfx: (L) => [["click", L[0].end - 0.17, 0.6], ["impact-bass-2", L[1].start, 0.3], ["whoosh-short", L[2].end + 0.12, 0.3]],
    },

    {
      id: "s3",
      name: "kahani",
      cast: { ...MARKS },
      svgBack: MONSTER("s3"),
      lead: 0.5,
      tail: 1.0,
      lines: [
        { who: "aloo", cap: "Toh suno… ek DARAWNI kahani.", say: "तो सुनो… एक डरावनी कहानी।" },
        { who: "aloo", gap: 0.5, cap: "Is fridge mein rehta hai… GARAM MASALA MONSTER!", say: "इस fridge में रहता है… गरम मसाला monster!", yell: true },
        { who: "aloo", gap: 0.45, cap: "Jo uske paas jaaye… uski aankhon mein AANSOO aa jaate hain!", say: "जो उसके पास जाए… उसकी आँखों में आँसू आ जाते हैं!" },
        { who: "aloo", gap: 0.55, cap: "Aur woh rehta hai… NEECHE… crisper drawer mein.", say: "और वो रहता है… नीचे… crisper drawer में।" },
      ],
      act: (R, L) => {
        R.blackoutAt0();
        R.torchOn(0, true);
        R.beamOn(0, true);
        R.arm("bhindi", "L", 0, 70, 0.001);
        R.mood("aloo", 0, "sly", false);
        R.mood("tamatar", 0, "scared", false);
        R.mood("bhindi", 0, "normal", false);
        R.cam(0, 1.3, 430, 930);
        R.hold(0, 520, 1060, 150, 0);
        // Aloo asks for the torch on the wall behind him... and puts his hands up.
        R.hold(L[0].end, 330, 760, 260, 0.6);
        R.arms("aloo", L[1].start - 0.3, 160, 160, 0.35);
        R.fromTo("monster", L[1].start + 0.3, { opacity: 0, scale: 0.25, svgOrigin: "0 130" },
          { opacity: 0.92, scale: 1, duration: 1.1, ease: "power2.in", svgOrigin: "0 130" });
        R.cam(L[1].start + 0.3, 1.5, 330, 830, 1.2, "power2.in");
        R.mood("tamatar", L[1].end - 0.5, "shock");
        R.mood("bhindi", L[1].end - 0.5, "scared");
        // The scared two huddle together.
        R.cam(L[2].start, 1.3, 620, 930, 0.5);
        R.walk("tamatar", L[2].start + 0.2, 720, 0.6);
        R.shake("tamatar", L[2].start + 0.9, 2.2, 4);
        R.shake("bhindi", L[2].start + 1.0, 2.1, 3);
        R.lean("bhindi", L[2].start + 0.8, -12, 0.4);
        R.arm("tamatar", "R", L[2].start + 0.8, 120, 0.3);
        R.arms("aloo", L[2].end, 0, 0, 0.5, "power2.out");
        R.to("monster", L[3].start + 0.4, { opacity: 0, scale: 0.6, duration: 0.6, ease: "power2.in", svgOrigin: "0 130" });
        R.wide(L[3].start, 0.6);
        // Everyone slowly looks down.
        R.lookAll(L[3].start + 1.0, 0, 9, 4);
        R.lean("tamatar", L[3].start + 1.2, 6, 0.6, "power2.inOut");
      },
      sfx: (L) => [["riser", L[1].start - 0.6, 0.35], ["impact-bass-1", L[1].end - 0.75, 0.5], ["whoosh-short", L[0].end, 0.25]],
    },

    {
      id: "s4",
      name: "aankhein",
      cast: { aloo: [260, MID], tamatar: [720, MID], bhindi: [860, MID], mirchi: [520, 1560, 0.9] },
      front: ["mirchi"],
      lead: 1.3,
      tail: 0.2,
      lines: [
        { who: "tamatar", cap: "Wahan… kuch NAHI hai. Hai na?", say: "वहाँ… कुछ नहीं है। है ना?" },
        { who: "bhindi", gap: 2.0, cap: "Sab theek hai. Sirf KAHANI thi.", say: "सब ठीक है। सिर्फ़ कहानी थी।" },
        { who: "mirchi", gap: 2.6, cap: "Hello…?", say: "Hello…?" },
        { who: "tamatar", gap: 0.4, cap: "AAAAAAH!", say: "आआआआआह!", yell: true },
      ],
      act: (R, L) => {
        R.blackoutAt0();
        R.torchOn(0, true);
        R.beamOn(0, true);
        R.noBlink("mirchi");
        R.arm("bhindi", "L", 0, 70, 0.001);
        R.lean("bhindi", 0, -12, 0.001);
        R.mood("tamatar", 0, "scared", false);
        R.mood("bhindi", 0, "scared", false);
        R.mood("aloo", 0, "sly", false);
        R.lookAll(0, 0, 9, 3);
        R.set("mirchi", 0, { opacity: 0 });
        R.set(["mirchi-eyeL", "mirchi-eyeR"].map((id) => R.$(id)), 0, { scaleY: 0.08, svgOrigin: "0 0" });
        R.hold(0, 520, 1060, 150, 0);
        // 1. The torch goes down into the drawer: leaves, a lemon, nothing else.
        R.wide(0);
        R.cam(0.3, ...[1.3, 610, 1470], 0.8);
        R.hold(0.3, 610, 1480, 190, 0.8);
        // 2. Bhindi points it back up at Tamatar... and in the dark drawer, two eyes open.
        const tUp = L[0].end + 0.3;
        R.hold(tUp, 700, 1060, 150, 0.4);
        R.set("mirchi", tUp + 0.5, { opacity: 1 });
        R.to(["mirchi-eyeL", "mirchi-eyeR"].map((id) => R.$(id)), tUp + 0.9, { scaleY: 1, duration: 0.12, svgOrigin: "0 0" });
        R.blink("mirchi", tUp + 1.9);
        R.look("mirchi", tUp + 1.3, 0, -8, 3);
        // 3. Back down: the drawer is empty again.
        const tDn = L[1].end + 0.45;
        R.set("mirchi", tDn + 0.1, { opacity: 0 });
        R.hold(tDn, 610, 1480, 190, 0.35, "power3.out");
        // 4. Cut to the gang. Two new eyes, right next to Tamatar.
        const tCut = tDn + 1.2;
        R.wide(tCut);
        R.hold(tCut, 610, 1480, 190, 0);
        R.set("mirchi", tCut, { x: 470, y: 1186, opacity: 1 });
        R.posAt("mirchi", 0).x = 470;
        R.posAt("mirchi", 0).y = 1186;
        R.look("mirchi", tCut, 7, -6, 3);
        R.look("tamatar", tCut + 0.6, -5, 0, 0.6);
        R.look("tamatar", tCut + 1.3, -9, 0, 3);
        R.mood("tamatar", L[3].start - 0.1, "shock");
        // 5. SCREAM. Tamatar hides behind skinny Bhindi, Aloo faints, the torch goes flying.
        const tS = L[3].start;
        R.mood("bhindi", tS, "shock");
        R.mouth("bhindi", tS + 0.05, "yell");
        R.mood("mirchi", tS, "shock");
        R.mouth("mirchi", tS + 0.05, "yell");
        R.mouth("aloo", tS + 0.05, "yell");
        R.hop("tamatar", tS + 0.05, { x: 880, h: 120, dur: 0.55 });
        R.faint("aloo", tS + 0.4);
        R.arms("mirchi", tS + 0.1, 170, 170, 0.2);
        R.shake("mirchi", tS + 0.3, 1.2, 4);
        R.arm("bhindi", "L", tS + 0.1, 0, 0.2);
        R.lean("bhindi", tS + 0.1, 0, 0.2);
        R.stretch("bhindi", tS + 0.3, 0.9, 1.08, 0.3);
        R.aim(tS + 0.15, 760, 900, 200, 700, 180, 0.3, "power1.out");
        R.aim(tS + 0.45, 790, 1100, 940, 820, 180, 0.3, "none");
        R.aim(tS + 0.75, 800, 1168, 470, 1070, 150, 0.35, "bounce.out");
      },
      sfx: (L) => [["whoosh-short", 0.3, 0.3], ["whoosh-short", L[0].end + 0.3, 0.25], ["whoosh-short", L[1].end + 0.45, 0.3],
        ["impact-bass-1", L[3].start, 0.45], ["whoosh", L[3].start + 0.15, 0.35], ["click", L[3].start + 1.05, 0.5]],
    },

    {
      id: "s5",
      name: "mirchi",
      cast: { aloo: [260, MID], tamatar: [880, MID], bhindi: [860, MID], mirchi: [470, MID, 0.9] },
      lead: 0.6,
      tail: 0.8,
      svg: PUFF("s5"),
      lines: [
        { who: "mirchi", cap: "Darro mat… main monster nahi hoon. Main MIRCHI hoon.", say: "डरो मत… मैं monster नहीं हूँ। मैं मिर्ची हूँ।" },
        { who: "mirchi", gap: 0.4, cap: "Andhere mein… mujhe akele DARR lag raha tha.", say: "अँधेरे में… मुझे अकेले डर लग रहा था।" },
        { who: "tamatar", gap: 0.55, cap: "Tum… Garam Masala MONSTER nahi ho?", say: "तुम… गरम मसाला monster नहीं हो?" },
        { who: "mirchi", gap: 0.9, cap: "Main toh bas… THODI SI teekhi hoon.", say: "मैं तो बस… थोड़ी सी तीखी हूँ।" },
        { who: "mirchi", gap: 0.3, cap: "Aa… aa… ACHHOO!", say: "आ… आ… आच्छू!", yell: true },
        { who: "tamatar", gap: 0.5, cap: "THODI SI?!", say: "थोड़ी सी?!", yell: true },
        { who: "aloo", gap: 0.4, cap: "Monster… gaya kya?", say: "Monster… गया क्या?" },
      ],
      act: (R, L) => {
        R.blackoutAt0();
        R.torchOn(0, true);
        R.beamOn(0, true);
        R.aim(0, 800, 1168, 470, 1070, 150, 0);
        R.wide(0);
        R.lean("aloo", 0, -24, 0.001);
        R.stretch("aloo", 0, 1.18, 0.72, 0.001);
        R.mood("aloo", 0, "shock", false);
        R.set(["aloo-lidL", "aloo-lidR"].map((id) => R.$(id)), 0.001, { attr: { d: "M-30,-2 A30,30 0 0 1 30,-2 A30,30 0 0 1 -30,-2 Z" } });
        R.stretch("bhindi", 0, 0.9, 1.08, 0.001);
        R.mood("bhindi", 0, "scared", false);
        R.set(["bhindi-lidL", "bhindi-lidR"].map((id) => R.$(id)), 0, { attr: { d: "M-24,-2 A24,30 0 0 1 24,-2 A24,30 0 0 1 -24,-2 Z" } });
        R.mood("tamatar", 0, "scared", false);
        R.shake("tamatar", 0, 1.2, 4);
        R.mood("mirchi", 0, "scared", false);
        R.arms("mirchi", 0, 170, 170, 0.001);
        // Mirchi lowers her hands: she's tiny and she's scared too.
        R.arms("mirchi", 0.3, 20, 20, 0.5, "power2.out");
        R.mood("mirchi", L[0].start, "sad");
        R.look("mirchi", L[0].start, 6, -4, 4);
        R.cam(L[0].start, 1.45, 600, 1010, 0.6);
        // Bhindi opens her eyes; Tamatar peeks out and waddles over.
        R.mood("bhindi", L[1].start + 0.3, "normal");
        R.stretch("bhindi", L[1].start + 0.3, 1, 1, 0.4);
        R.mood("tamatar", L[1].end - 0.2, "normal");
        R.walk("tamatar", L[2].start - 0.3, 640, 0.7);
        R.mood("mirchi", L[3].start, "happy");
        // The sneeze.
        const tA = L[4].end - 0.35;
        R.stretch("mirchi", L[4].start, 0.92, 1.12, 0.5, "power1.in");
        R.lean("mirchi", L[4].start, -10, 0.5, "power1.in");
        R.stretch("mirchi", tA, 1.15, 0.85, 0.08, "power3.out");
        R.lean("mirchi", tA, 14, 0.08, "power3.out");
        R.stretch("mirchi", tA + 0.15, 1, 1, 0.5, "elastic.out(1, 0.4)");
        R.lean("mirchi", tA + 0.15, 0, 0.5, "elastic.out(1, 0.4)");
        R.fromTo("puff", tA, { opacity: 0, x: 520, y: 990, scale: 0.3 },
          { opacity: 1, x: 600, y: 980, scale: 1.4, duration: 0.35, ease: "power3.out" });
        R.to("puff", tA + 0.5, { opacity: 0, scale: 2, duration: 0.6 });
        R.mood("tamatar", tA + 0.1, "sad");
        R.shake("tamatar", tA + 0.1, 0.6, 6);
        R.sweat("tamatar", tA + 0.25, 0.8);
        R.sweat("tamatar", tA + 1.3, 0.8);
        R.arms("tamatar", L[5].start, 150, 150, 0.25);
        R.hop("tamatar", L[5].start + 0.05, { h: 60, dur: 0.4 });
        R.arms("tamatar", L[5].end + 0.3, 0, 0, 0.4);
        // Bhindi laughs; Aloo comes round.
        R.mood("bhindi", L[5].start + 0.2, "happy");
        R.wide(L[6].start - 0.4, 0.5);
        R.getUp("aloo", L[6].start - 0.3, "sleepy");
        R.look("aloo", L[6].start, 0, -6, 2);
      },
      sfx: (L) => [["pop", L[4].end - 0.33, 0.6], ["whoosh-short", L[4].end - 0.35, 0.3]],
    },

    {
      id: "s6",
      name: "dosti",
      cast: { aloo: [260, MID], tamatar: [640, MID], bhindi: [860, MID], mirchi: [470, MID, 0.9] },
      lead: 0.5,
      tail: 0.4,
      lines: [
        { who: "bhindi", cap: "Mirchi, tum hamare SAATH raho na!", say: "मिर्ची, तुम हमारे साथ रहो ना!" },
        { who: "mirchi", gap: 0.35, cap: "SACHCHI?!", say: "सच्ची?!", yell: true },
        { who: "aloo", gap: 0.4, cap: "Theek hai. Par agli kahani… FUNNY wali.", say: "ठीक है। पर अगली कहानी… funny वाली।" },
        { who: "tamatar", gap: 1.6, cap: "BIJLI AA GAYI!", say: "बिजली आ गई!", yell: true },
      ],
      act: (R, L) => {
        R.blackoutAt0();
        R.torchOn(0, true);
        R.beamOn(0, true);
        R.aim(0, 800, 1168, 470, 1060, 170, 0);
        R.wide(0);
        R.mood("mirchi", 0, "happy", false);
        R.mood("aloo", 0, "sleepy", false);
        R.mood("bhindi", L[0].start, "happy");
        R.arm("bhindi", "L", L[0].start + 0.2, 90, 0.3);
        R.mood("mirchi", L[1].start - 0.1, "shock");
        R.hop("mirchi", L[1].start, { h: 110, dur: 0.5 });
        R.mood("mirchi", L[1].end + 0.1, "happy");
        R.arm("bhindi", "L", L[1].end, 0, 0.3);
        R.arm("aloo", "R", L[2].start + 0.2, 90, 0.3);
        R.arm("aloo", "R", L[2].end, 0, 0.3);
        // Power's back. The night light sputters on and the cold comes back.
        const tP = L[2].end + 0.5;
        R.blackout(tP, false);
        R.beamOn(tP + 0.5, false);
        R.lookAll(tP + 0.1, 0, -9, 1.2, ["aloo", "tamatar", "bhindi", "mirchi"]);
        ["tamatar", "bhindi", "mirchi", "aloo"].forEach((w, i) => {
          R.mood(w, L[3].start - 0.1 + i * 0.05, "happy");
          R.arms(w, L[3].start + i * 0.06, 160, 160, 0.25);
          R.hop(w, L[3].start + 0.05 + i * 0.08, { h: w === "aloo" ? 40 : 110, dur: 0.5 });
        });
      },
      sfx: (L) => [["pop", L[1].start + 0.6, 0.3], ["glitch-3", L[2].end + 0.48, 0.35], ["impact-bass-1", L[3].start + 0.1, 0.3]],
    },

    {
      id: "s7",
      name: "freeze",
      cast: { aloo: [260, MID], tamatar: [640, MID], bhindi: [860, MID], mirchi: [470, MID, 0.9] },
      light: "off",
      lead: 1.15,
      tail: 1.0,
      lines: [
        { who: "bhindi", cap: "Mirchi… FREEZE!", say: "मिर्ची… freeze!" },
        { who: "mummy", gap: 1.2, cap: "Arre! Mera TORCH yahaan kaise aaya?", say: "अरे! मेरा torch यहाँ कैसे आया?" },
        { who: "mirchi", gap: 1.1, cap: "Wow! Ye toh MAZEDAAR game hai!", say: "वाह! ये तो मज़ेदार game है!" },
        { who: "aloo", gap: 0.35, cap: "Fridge Gang mein… SWAGAT hai.", say: "Fridge Gang में… स्वागत है।" },
      ],
      act: (R, L) => {
        R.wide(0);
        R.torchOn(0, true);
        R.aim(0, 800, 1168, 470, 1060, 170, 0);
        ["tamatar", "bhindi", "mirchi", "aloo"].forEach((w) => R.mood(w, 0, "happy", false));
        ["tamatar", "bhindi", "aloo"].forEach((w) => R.noBlink(w));
        R.arms("tamatar", 0, 160, 160, 0.001);
        R.arms("bhindi", 0, 160, 160, 0.001);
        R.arms("aloo", 0, 150, 150, 0.001);
        R.arms("mirchi", 0, 160, 160, 0.001);
        // The door opens: the gang freezes on the spot. Mirchi doesn't know the rule.
        R.light(0.35, true);
        R.mood("tamatar", 0.38, "shock", false);
        R.mood("bhindi", 0.38, "shock", false);
        R.mood("aloo", 0.38, "shock", false);
        R.lean("tamatar", 0.38, -8, 0.05);
        R.lean("bhindi", 0.38, 9, 0.05);
        R.arm("mirchi", "R", 0.5, 160, 0.2);
        R.arm("mirchi", "R", 0.75, 110, 0.2);
        R.arm("mirchi", "R", 1.0, 160, 0.2);
        R.hop("mirchi", 0.5, { h: 50, dur: 0.36 });
        R.look("mirchi", 0.5, 9, -9, 1.6);
        R.look("bhindi", L[0].start - 0.2, -9, 0, 1.5);
        R.mood("mirchi", L[0].end + 0.05, "shock");
        R.arm("mirchi", "L", L[0].end + 0.05, 95, 0.12);
        R.arm("mirchi", "R", L[0].end + 0.05, 170, 0.12);
        R.lean("mirchi", L[0].end + 0.05, -14, 0.12);
        R.noBlink("mirchi");
        // Mummy's hand finds the torch and takes it.
        const tH = L[0].end + 0.3;
        R.handAt(0, 640, 1110);
        R.handTo(tH, -40, 1110, 0.6, "power2.out");
        R.to("torch", L[1].end + 0.2, { x: "+=660", y: "-=40", duration: 0.45, ease: "power3.in" });
        R.handTo(L[1].end + 0.2, 620, 1070, 0.45, "power3.in");
        R.light(L[1].end + 0.8, false);
        // Unfreeze.
        const tU = L[1].end + 1.0;
        ["tamatar", "bhindi", "aloo", "mirchi"].forEach((w, i) => {
          R.mood(w, tU + i * 0.06, "happy");
          R.arms(w, tU + i * 0.06, 0, 0, 0.4, "power2.out");
          R.lean(w, tU + i * 0.06, 0, 0.4);
        });
        R.hop("mirchi", L[2].start + 0.1, { h: 80, dur: 0.44 });
        R.walk("tamatar", L[3].start, 600, 0.5);
        R.walk("aloo", L[3].start + 0.1, 340, 0.6);
        R.arms("aloo", L[3].start + 0.8, 120, 120, 0.3);
        R.mood("aloo", L[3].start + 0.2, "sleepy");
      },
      sfx: (L) => [["click", 0.33, 0.5], ["whoosh-short", L[0].end + 0.3, 0.3], ["whoosh-short", L[1].end + 0.2, 0.3],
        ["impact-bass-2", L[1].end + 0.78, 0.3]],
    },

    {
      id: "s8",
      name: "end card",
      world: "door",
      lead: 0.5,
      tail: 2.6,
      lines: [{ who: "tamatar", noBubble: true, cap: "Agle episode mein milte hain!", say: "अगले episode में मिलते हैं!" }],
      html: `
  <div id="s8-logo" class="magnets">
    <span class="m c1">F</span><span class="m c2">R</span><span class="m c3">I</span><span class="m c4">D</span><span class="m c5">G</span><span class="m c1">E</span>
    <br /><span class="m c3">G</span><span class="m c5">A</span><span class="m c2">N</span><span class="m c4">G</span>
  </div>
  <div id="s8-note" class="note">
    <div class="n1">Agla episode:</div>
    <div class="n2">FRIDGE KA RAJA!</div>
  </div>`,
      css: `
#root { background: #8FD3C1; }
#root .magnets { position: absolute; left: 0; top: 330px; width: 100%; text-align: center; z-index: 6; }
#root .magnets .m { display: inline-block; font-family: "Archivo Black", sans-serif; font-size: 150px; line-height: 1.1;
  margin: 0 4px; -webkit-text-stroke: 9px #2A1B14; paint-order: stroke fill; text-shadow: 0 10px 0 rgba(42,27,20,0.35); }
#root .m.c1 { color: #E8402E; } #root .m.c2 { color: #F6C445; } #root .m.c3 { color: #5DAA3C; }
#root .m.c4 { color: #3D8BE0; } #root .m.c5 { color: #F08A24; }
#root .note { position: absolute; left: 50%; margin-left: -330px; top: 790px; width: 660px; padding: 36px 40px; background: #FFF27A;
  border: 6px solid #2A1B14; box-shadow: 0 14px 0 rgba(42,27,20,0.25); z-index: 6; color: #2A1B14;
  font-family: "Nunito", sans-serif; text-align: center; }
#root .note .n1 { font-weight: 800; font-size: 46px; line-height: 1.1; }
#root .note .n2 { font-family: "Archivo Black", sans-serif; font-size: 64px; line-height: 1.1; margin-top: 12px; color: #D7263D; }`,
      cssWide: `
#root .magnets { top: 140px; }
#root .magnets .m { font-size: 112px; -webkit-text-stroke: 8px #2A1B14; }
#root .note { top: 560px; }`,
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
