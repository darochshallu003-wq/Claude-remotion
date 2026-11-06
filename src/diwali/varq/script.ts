import type { Shot } from "../kit";

// Ep 10: Silver varq. Pure silver beaten into leaf; traditionally between
// animal-gut layers, banned by FSSAI from 1 Aug 2016 (stay lifted 2018);
// FSSAI norms: 999/1000 fineness, up to 2.8 g per sq m. Aluminium fakes;
// the finger-rub test (silver crumbles to powder, aluminium balls up) is the
// one FSSAI's household adulteration guide describes.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 5.27,
    enter: "fade",
    vo: "मिठाई पर ये चमकती परत… क्या सच में चाँदी है? और हाँ, आप उसे खा रहे हैं!",
    tag: "VARQ · FIG. 01",
    setup: "Mithai par chamak:",
    punch: "Asli chaandi?",
    layout: { type: "hero", art: "kaju", size: 560, stamp: "Chaandi!", glow: true },
  },
  {
    id: "real",
    seconds: 5.55,
    enter: "wipe",
    vo: "हाँ, असली वर्क़ शुद्ध चाँदी का होता है। इतना पतला, कि हाथ लगाते ही टूट जाता है।",
    dark: false,
    tag: "WHAT · FIG. 02",
    setup: "Haan, asli varq =",
    punch: "Shuddh chaandi",
    layout: { type: "hero", art: "varq", size: 620, pills: ["HAATH LAGAO, TOOT JAYE"] },
  },
  {
    id: "how",
    seconds: 5.7,
    enter: "cut",
    vo: "इसे बनाने के लिए, चाँदी के टुकड़े को परतों के बीच रखकर, घंटों हथौड़े से पीटा जाता है।",
    dark: false,
    tag: "HOW · FIG. 03",
    setup: "Kaise banta hai?",
    punch: "Ghanton hathoda",
    layout: { type: "hero", art: "varq", size: 620, pills: ["CHAANDI KA TUKDA", "PARTON KE BEECH", "GHANTON PITAI"] },
  },
  {
    id: "ban",
    seconds: 9.95,
    enter: "iris",
    vo: "पहले ये परतें जानवरों की आँतों से बनती थीं। इसलिए 2016 में FSSAI ने जानवरों से बने वर्क़ पर रोक लगा दी। अब ये मशीनों से बनता है।",
    tag: "RULE · FIG. 04",
    setup: "2016 · FSSAI:",
    punch: "Animal varq ban",
    layout: { type: "vs", left: { art: "emoji:🐂", title: "Pehle", sub: "जानवरों की आँत", ok: false }, right: { art: "emoji:⚙️", title: "Ab", sub: "मशीन", ok: true } },
  },
  {
    id: "norm",
    seconds: 7.59,
    enter: "wipe",
    vo: "FSSAI का नियम: चाँदी 999 शुद्धता वाली हो, और वज़न, एक square metre में 2.8 gram तक।",
    dark: false,
    tag: "STANDARD · FIG. 05",
    setup: "FSSAI standard:",
    punch: "999 shuddh",
    layout: { type: "number", to: 999, label: "SHUDDHATA · 999 / 1000", caption: "2.8 ग्राम प्रति वर्ग मीटर तक" },
  },
  {
    id: "fake",
    seconds: 5.43,
    enter: "cut",
    vo: "दिक़्क़त: कुछ लोग चाँदी की जगह एल्युमिनियम की परत लगा देते हैं, जो खाने लायक़ नहीं।",
    tag: "THE FAKE · FIG. 06",
    setup: "Dhokha:",
    punch: "Aluminium varq",
    punchColor: "#FF6A5A",
    layout: { type: "vs", left: { art: "varq", title: "Chaandi", ok: true }, right: { art: "emoji:🥫", title: "Aluminium", ok: false } },
  },
  {
    id: "test",
    seconds: 8.46,
    enter: "wipe",
    vo: "Test कैसे करें? थोड़ा सा वर्क़ उंगलियों में मसलें। असली चाँदी पाउडर बनकर ग़ायब हो जाती है। एल्युमिनियम, छोटी सी गोली बन जाता है।",
    dark: false,
    tag: "HOME TEST · FIG. 07",
    setup: "Ghar par test:",
    punch: "Ungli se maslo",
    layout: {
      type: "list",
      items: [
        { art: "emoji:🤏", title: "Ungliyon mein maslo", sub: "थोड़ा सा वर्क़" },
        { art: "varq", title: "Powder = chaandi", sub: "ग़ायब हो जाए ✓" },
        { art: "emoji:⚪", title: "Goli = aluminium", sub: "मत खाओ ✗" },
      ],
    },
  },
  {
    id: "cta",
    seconds: 5.43,
    enter: "iris",
    vo: "आपको वर्क़ वाली मिठाई पसंद है, या बिना वर्क़ की? Comment करो। शुभ दीपावली!",
    tag: "YOUR TURN · FIG. 08",
    setup: "Varq wali ya",
    punch: "Bina varq?",
    layout: { type: "cta", ask: "वर्क़ वाली या बिना वर्क़?", wish: "शुभ दीपावली", english: "HAPPY DIWALI!" },
  },
];
