import type { Shot } from "../kit";

// Ep 9: Diya science. Capillary action lifts oil up the cotton wick (same
// physics as paper towels and, partly, water in plants); the flame burns oil
// vapour, not the wick; soaking clay diyas in water first so they absorb
// less oil is a common household tip.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 5.99,
    enter: "fade",
    vo: "दीये में तेल नीचे है, और लौ ऊपर। तो बाती तक तेल चढ़ता कैसे है? Gravity के उलटा?",
    tag: "DIYA · FIG. 01",
    setup: "Tel neeche, lau upar",
    punch: "Kaise?",
    punchSize: 150,
    layout: { type: "hero", art: "wick", size: 640, glow: true },
  },
  {
    id: "capillary",
    seconds: 7.11,
    enter: "wipe",
    vo: "जवाब है capillary action। रुई के धागों के बीच बहुत पतली जगहें होती हैं, और तेल उन्हीं में ऊपर चढ़ जाता है।",
    dark: false,
    tag: "PHYSICS · FIG. 02",
    setup: "Jawab:",
    punch: "Capillary action",
    layout: { type: "hero", art: "wick", size: 620, pills: ["PATLI NALIYAN", "TEL UPAR CHADHTA"] },
  },
  {
    id: "same",
    seconds: 5.87,
    enter: "cut",
    vo: "यही science tissue paper में पानी फैलाता है, और पौधों में पानी ऊपर चढ़ाने में मदद करता है।",
    dark: false,
    tag: "SAME SCIENCE · FIG. 03",
    setup: "Yahi science",
    punch: "Har jagah",
    layout: { type: "cards", items: [{ art: "emoji:🧻", title: "टिशू पेपर" }, { art: "emoji:🌱", title: "पौधे" }, { art: "diya", title: "दीया" }] },
  },
  {
    id: "vapour",
    seconds: 7.02,
    enter: "iris",
    vo: "और मज़ेदार बात: असल में बाती नहीं जलती। जलती है तेल की भाप। बाती बस उसे ऊपर पहुँचाने का रास्ता है।",
    tag: "FUN FACT · FIG. 04",
    setup: "Baati nahi jalti!",
    punch: "Tel ki bhaap jalti",
    layout: { type: "type", art: "diya", text: "TEL → BAATI → GARMI → BHAAP → LAU", caption: "बाती = सिर्फ़ रास्ता" },
  },
  {
    id: "oil",
    seconds: 9.11,
    enter: "wipe",
    vo: "घी या सरसों का तेल? घी को पूजा में पवित्र माना जाता है, और सरसों का तेल सस्ता और हर घर में आसानी से मिलता है। दोनों से दीया जलता है।",
    dark: false,
    tag: "FUEL · FIG. 05",
    setup: "Ghee ya",
    punch: "Sarson ka tel?",
    layout: { type: "vs", left: { art: "emoji:🧈", title: "Ghee", sub: "पूजा में पवित्र" }, right: { art: "emoji:🫙", title: "Sarson", sub: "सस्ता, आसान" }, caption: "दोनों चलते हैं" },
  },
  {
    id: "tips",
    seconds: 10.09,
    enter: "cut",
    vo: "तीन काम के tips: नए दीये जलाने से पहले कुछ घंटे पानी में भिगो दो, ताकि वो तेल कम सोखें। बाती छोटी रखो, धुआँ कम होगा। और दीये पर्दों से दूर रखो।",
    dark: false,
    tag: "TIPS · FIG. 06",
    setup: "3 kaam ke",
    punch: "Tips",
    layout: {
      type: "list",
      items: [
        { art: "emoji:💧", title: "Pehle bhigo do", sub: "तेल कम सोखेगा" },
        { art: "wick", title: "Baati chhoti", sub: "धुआँ कम" },
        { art: "emoji:🪟", title: "Pardon se door", sub: "सुरक्षा पहले" },
      ],
    },
  },
  {
    id: "cta",
    seconds: 4.47,
    enter: "iris",
    vo: "आप इस दिवाली कितने दीये जलाओगे? Comment करो। शुभ दीपावली!",
    tag: "YOUR TURN · FIG. 07",
    setup: "Is Diwali",
    punch: "Kitne diye?",
    layout: { type: "cta", ask: "आप कितने दीये जलाओगे?", wish: "शुभ दीपावली", english: "HAPPY DIWALI!" },
  },
];
