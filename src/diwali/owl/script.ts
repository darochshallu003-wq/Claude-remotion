import type { Shot } from "../kit";

// Ep 3: Why Lakshmi rides an owl, and why she is worshipped with Ganesh.
// The owl readings are traditional interpretations, presented as such.
// Owls are protected in India (Wildlife Protection Act, 1972); trade in them
// is reported to rise around Diwali.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 7.74,
    enter: "fade",
    vo: "लक्ष्मी जी धन की देवी हैं… पर उनकी सवारी है उल्लू। वही उल्लू, जिसे हम बेवकूफ़ी की गाली मानते हैं। ऐसा क्यों?",
    tag: "LAKSHMI · FIG. 01",
    setup: "Lakshmi ji ki sawari:",
    punch: "Ullu?!",
    punchSize: 150,
    layout: { type: "hero", art: "owl", size: 440, caption: "उलूक · लक्ष्मी वाहन", glow: true },
  },
  {
    id: "night",
    seconds: 7.79,
    enter: "wipe",
    vo: "पहला कारण: उल्लू अंधेरे में भी देख सकता है। और लक्ष्मी पूजा होती है अमावस्या की रात, जब सबसे ज़्यादा अंधेरा होता है।",
    tag: "REASON 1 · FIG. 02",
    setup: "Reason 1:",
    punch: "Andhere mein dekhta hai",
    layout: { type: "vs", left: { art: "emoji:🌑", title: "Amavasya", sub: "घना अंधेरा" }, right: { art: "owl", title: "Ullu", sub: "फिर भी देखता है" } },
  },
  {
    id: "farm",
    seconds: 7.02,
    enter: "cut",
    vo: "दूसरा: उल्लू खेतों में चूहे खाता है। किसान के लिए उल्लू मतलब अनाज की रक्षा। और अनाज ही असली धन था।",
    dark: false,
    tag: "REASON 2 · FIG. 03",
    setup: "Reason 2:",
    punch: "Anaaj ka rakshak",
    layout: { type: "hero", art: "emoji:🌾", size: 380, pills: ["ULLU = CHOOHON KA DUSHMAN", "ANAAJ BACHA = DHAN BACHA"] },
  },
  {
    id: "lesson",
    seconds: 8.96,
    enter: "iris",
    vo: "और एक मान्यता ये भी है: जो पैसे के पीछे अंधा होकर दौड़ता है, वो उल्लू बन जाता है। लक्ष्मी उस पर सवार रहती हैं, वो लक्ष्मी पर नहीं।",
    tag: "REASON 3 · FIG. 04",
    setup: "Ek seekh:",
    punch: "Paise ke peeche andha",
    layout: { type: "type", art: "coins", text: "JO DHAN KA GHULAM, WOH ULLU. LAKSHMI USKI SAWARI KARTI HAIN.", caption: "एक लोक-मान्यता" },
  },
  {
    id: "ganesh",
    seconds: 7.79,
    enter: "wipe",
    vo: "अब दूसरा सवाल: दिवाली पर लक्ष्मी के साथ गणेश क्यों? क्योंकि गणेश बुद्धि के देवता हैं। और बिना बुद्धि के, धन टिकता नहीं।",
    dark: false,
    tag: "PUJA · FIG. 05",
    setup: "Lakshmi ke saath",
    punch: "Ganesh kyun?",
    layout: { type: "vs", left: { art: "coins", title: "Lakshmi", sub: "धन" }, right: { art: "emoji:🐘", title: "Ganesh", sub: "बुद्धि" }, caption: "धन + बुद्धि = टिकाऊ समृद्धि" },
  },
  {
    id: "order",
    seconds: 4.64,
    enter: "cut",
    vo: "इसीलिए पूजा में पहले गणेश, फिर लक्ष्मी। पहले समझ… फिर पैसा।",
    dark: false,
    tag: "PUJA · FIG. 06",
    setup: "Isliye pehle",
    punch: "Ganesh, phir Lakshmi",
    layout: {
      type: "list",
      items: [
        { art: "emoji:🐘", title: "1 · Ganesh", sub: "पहले समझ" },
        { art: "coins", title: "2 · Lakshmi", sub: "फिर पैसा" },
      ],
    },
  },
  {
    id: "protect",
    seconds: 9.51,
    enter: "iris",
    vo: "और एक ज़रूरी बात: भारत में उल्लू संरक्षित पक्षी है। दिवाली के आस-पास अंधविश्वास में इनकी तस्करी बढ़ जाती है। उल्लू पकड़ना या बेचना, अपराध है।",
    tag: "NOTE · FIG. 07",
    setup: "Zaroori baat:",
    punch: "Ullu protected hai",
    punchColor: "#7FD36A",
    layout: { type: "hero", art: "owl", size: 380, pills: ["WILDLIFE PROTECTION ACT", "PAKADNA / BECHNA = APRAADH"] },
  },
  {
    id: "cta",
    seconds: 4.62,
    enter: "iris",
    vo: "ये बात आपको पहले पता थी? Comment में बताइए। शुभ दीपावली!",
    tag: "YOUR TURN · FIG. 08",
    setup: "Pata tha?",
    punch: "Comment karo!",
    layout: { type: "cta", ask: "ये बात आपको पता थी?", wish: "शुभ दीपावली", english: "HAPPY DIWALI!" },
  },
];
