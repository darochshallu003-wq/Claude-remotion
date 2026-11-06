import type { Shot } from "../kit";

// Ep 8: Green crackers. Developed by CSIR-NEERI (Nagpur); SWAS, STAR and
// SAFAL formulations; reported ~30% lower particulate emissions; barium
// nitrate removed or reduced; green CSIR-NEERI logo and QR code on boxes.
// Less polluting, not pollution-free.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 5.27,
    enter: "fade",
    vo: "Green crackers! नाम सुनकर लगता है, बिल्कुल साफ़ पटाखे। पर क्या सच में?",
    tag: "GREEN · FIG. 01",
    setup: "Green crackers =",
    punch: "Saaf patakhe?",
    punchColor: "#7FD36A",
    layout: { type: "hero", art: "anar", size: 460, stamp: "Sach?", glow: true },
  },
  {
    id: "who",
    seconds: 5.55,
    enter: "wipe",
    vo: "इन्हें भारत की एक सरकारी lab, CSIR-NEERI, ने बनाया है। नागपुर में।",
    dark: false,
    tag: "ORIGIN · FIG. 02",
    setup: "Kisne banaya?",
    punch: "CSIR-NEERI",
    layout: { type: "type", art: "emoji:🧪", text: "CSIR-NEERI · NAGPUR · SARKARI LAB", caption: "भारत में विकसित" },
  },
  {
    id: "what",
    seconds: 6.51,
    enter: "cut",
    vo: "इनमें बेरियम नाइट्रेट जैसे ज़हरीले केमिकल हटाए या घटाए गए, और धूल दबाने वाले additives डाले गए।",
    dark: false,
    tag: "FORMULA · FIG. 03",
    setup: "Kya badla?",
    punch: "Kam zeher",
    layout: {
      type: "list",
      items: [
        { art: "green", title: "Barium nitrate", sub: "हटाया या घटाया" },
        { art: "emoji:💧", title: "Additives", sub: "धूल दबाने वाले" },
        { art: "anar", title: "Chhota shell", sub: "कम बारूद" },
      ],
    },
  },
  {
    id: "names",
    seconds: 3.27,
    enter: "iris",
    vo: "इनके तीन type हैं: SWAS, STAR और SAFAL।",
    tag: "TYPES · FIG. 04",
    setup: "Teen type:",
    punch: "SWAS · STAR · SAFAL",
    punchSize: 96,
    layout: { type: "cards", items: [{ art: "emoji:💨", title: "SWAS" }, { art: "emoji:⭐", title: "STAR" }, { art: "emoji:✅", title: "SAFAL" }] },
  },
  {
    id: "result",
    seconds: 3.18,
    enter: "cut",
    vo: "नतीजा? लगभग तीस प्रतिशत कम प्रदूषण।",
    tag: "RESULT · FIG. 05",
    setup: "Natija:",
    punch: "~30% kam",
    punchColor: "#7FD36A",
    layout: { type: "number", to: 30, prefix: "~", suffix: "%", label: "KAM PRADUSHAN (PM)" },
  },
  {
    id: "but",
    seconds: 7.02,
    enter: "wipe",
    vo: "पर ध्यान दीजिए: तीस प्रतिशत कम, मतलब बाक़ी प्रदूषण अब भी है। Green crackers कम गंदे हैं… साफ़ नहीं।",
    tag: "THE CATCH · FIG. 06",
    setup: "Par dhyaan do:",
    punch: "Kam gande, saaf nahi",
    layout: { type: "vs", left: { art: "smog", title: "Normal", sub: "100" }, right: { art: "smog", title: "Green", sub: "~70" }, caption: "प्रदूषण कम हुआ, ख़त्म नहीं" },
  },
  {
    id: "spot",
    seconds: 8.7,
    enter: "iris",
    vo: "असली green cracker पहचानें कैसे? डिब्बे पर हरा CSIR-NEERI logo, और QR code देखें। Scan करके check भी कर सकते हैं।",
    dark: false,
    tag: "HOW TO SPOT · FIG. 07",
    setup: "Pehchaan:",
    punch: "Logo + QR code",
    layout: { type: "hero", art: "emoji:📱", size: 360, pills: ["HARA CSIR-NEERI LOGO", "QR CODE SCAN KARO"] },
  },
  {
    id: "cta",
    seconds: 4.81,
    enter: "iris",
    vo: "आप इस बार green crackers लेंगे, या बिना पटाखे की दिवाली? Comment करो।",
    tag: "YOUR TURN · FIG. 08",
    setup: "Aap kya chunoge?",
    punch: "Green ya none?",
    layout: { type: "cta", ask: "ग्रीन पटाखे या बिना पटाखे?", wish: "हरी-भरी दिवाली", english: "HAPPY GREEN DIWALI!" },
  },
];
