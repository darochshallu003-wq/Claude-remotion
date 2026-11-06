import type { Shot } from "../kit";

// Ep 15: Bahi khata and chopda pujan. For many trading communities,
// especially in Gujarat, the day after Diwali is the new year (Bestu Varas);
// new ledgers are worshipped on Diwali. Shubh and Labh are popularly held to
// be Ganesha's sons. The red cloth is described as auspicious.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 6.37,
    enter: "fade",
    vo: "लाल कपड़े वाली बही-खाता, और उस पर लिखा शुभ-लाभ। दिवाली पर व्यापारी नई बही क्यों शुरू करते हैं?",
    tag: "BAHI KHATA · FIG. 01",
    setup: "Laal bahi,",
    punch: "Nayi kyun?",
    layout: { type: "hero", art: "ledger", size: 380, glow: true },
  },
  {
    id: "newyear",
    seconds: 7.28,
    enter: "wipe",
    vo: "क्योंकि कई व्यापारी परिवारों के लिए, ख़ासकर गुजरात में, दिवाली साल का आख़िरी दिन है। और अगले दिन, नया साल।",
    dark: false,
    tag: "NEW YEAR · FIG. 02",
    setup: "Diwali =",
    punch: "Saal ka aakhri din",
    layout: { type: "vs", left: { art: "diya", title: "Diwali", sub: "पुराना साल ख़त्म" }, right: { art: "ledger", title: "Agla din", sub: "नया साल · बेसतु वरस" } },
  },
  {
    id: "chopda",
    seconds: 7.23,
    enter: "cut",
    vo: "दिवाली पर होता है चोपड़ा पूजन: नई बही पर शुभ-लाभ लिखा जाता है, और लक्ष्मी-गणेश के साथ, उसकी पूजा होती है।",
    dark: false,
    tag: "RITUAL · FIG. 03",
    setup: "Chopda pujan:",
    punch: "Bahi ki pooja",
    layout: {
      type: "list",
      items: [
        { art: "ledger", title: "Nayi bahi", sub: "लाल कपड़े में" },
        { art: "emoji:✍️", title: "Shubh-Labh", sub: "पहले पन्ने पर" },
        { art: "diya", title: "Pooja", sub: "लक्ष्मी-गणेश के साथ" },
      ],
    },
  },
  {
    id: "shubhlabh",
    seconds: 4.81,
    enter: "iris",
    vo: "और शुभ-लाभ? लोक मान्यता में, ये गणेश जी के दो बेटों के नाम हैं।",
    tag: "SHUBH LABH · FIG. 04",
    setup: "Shubh-Labh =",
    punch: "Ganesh ji ke bete",
    layout: { type: "vs", left: { art: "emoji:✨", title: "Shubh", sub: "अच्छाई" }, right: { art: "coins", title: "Labh", sub: "मुनाफ़ा" }, caption: "लोक मान्यता" },
  },
  {
    id: "motto",
    seconds: 4.95,
    enter: "cut",
    vo: "मतलब: मुनाफ़ा कमाओ, पर अच्छाई के साथ। Business का सबसे पुराना motto।",
    tag: "MOTTO · FIG. 05",
    setup: "Matlab:",
    punch: "Labh, par shubh",
    layout: { type: "hero", art: "coins", size: 340, stamp: "Motto", glow: true },
  },
  {
    id: "today",
    seconds: 5.6,
    enter: "wipe",
    vo: "आज भी कई दुकानों में, laptop और software के साथ-साथ, लाल बही की पूजा होती है।",
    dark: false,
    tag: "TODAY · FIG. 06",
    setup: "Aaj bhi",
    punch: "Laptop + bahi",
    layout: { type: "vs", left: { art: "emoji:💻", title: "Software" }, right: { art: "ledger", title: "Laal bahi" }, caption: "दोनों की पूजा" },
  },
  {
    id: "cta",
    seconds: 4.54,
    enter: "iris",
    vo: "आपके घर या दुकान में चोपड़ा पूजन होता है? Comment करो। शुभ लाभ!",
    tag: "YOUR TURN · FIG. 07",
    setup: "Aapke yahan",
    punch: "Chopda pujan?",
    layout: { type: "cta", ask: "आपके यहाँ चोपड़ा पूजन होता है?", wish: "शुभ लाभ", english: "HAPPY NEW YEAR & DIWALI!" },
  },
];
