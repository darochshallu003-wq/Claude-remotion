import type { Shot } from "../kit";

// Ep 11: The pre-Diwali clean. The belief (Lakshmi enters clean, lit homes)
// and the practical reading commonly given: Diwali follows the monsoon, so
// homes have damp, mould and insects; cleaning, whitewash (chuna) and airing
// bedding in the sun ready the house for winter.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 7.26,
    enter: "fade",
    vo: "दिवाली से पहले पूरे घर की सफ़ाई क्यों? सिर्फ़ लक्ष्मी जी के स्वागत के लिए… या इसके पीछे कोई practical वजह भी है?",
    tag: "SAFAI · FIG. 01",
    setup: "Diwali ki safai:",
    punch: "Sirf parampara?",
    layout: { type: "hero", art: "jhadu", size: 520, glow: true },
  },
  {
    id: "belief",
    seconds: 3.8,
    enter: "wipe",
    vo: "मान्यता है, कि लक्ष्मी साफ़ और रोशन घर में ही आती हैं।",
    dark: false,
    tag: "BELIEF · FIG. 02",
    setup: "Manyata:",
    punch: "Saaf ghar = Lakshmi",
    layout: { type: "hero", art: "lotus", size: 460, caption: "साफ़ और रोशन घर" },
  },
  {
    id: "timing",
    seconds: 4.69,
    enter: "cut",
    vo: "पर timing देखिए: दिवाली आती है, बारिश का मौसम ख़त्म होने के ठीक बाद।",
    dark: false,
    tag: "TIMING · FIG. 03",
    setup: "Timing dekhiye:",
    punch: "Monsoon ke baad",
    layout: { type: "vs", left: { art: "emoji:🌧️", title: "Monsoon", sub: "जुलाई–सितंबर" }, right: { art: "diya", title: "Diwali", sub: "अक्टूबर–नवंबर" } },
  },
  {
    id: "damp",
    seconds: 4.14,
    enter: "iris",
    vo: "महीनों की नमी से दीवारों पर सीलन, फफूँद, और कोनों में कीड़े।",
    dark: false,
    tag: "PROBLEM · FIG. 04",
    setup: "Mahino ki nami:",
    punch: "Seelan + keede",
    layout: { type: "hero", art: "damp", size: 680 },
  },
  {
    id: "fix",
    seconds: 9.63,
    enter: "wipe",
    vo: "तो सफ़ाई, पुताई, और चूना। चूना दीवारों को कीटाणुओं और फफूँद से बचाने में मदद करता है। और गद्दे-रज़ाइयाँ धूप में, ताकि सर्दी से पहले सब तैयार।",
    dark: false,
    tag: "SOLUTION · FIG. 05",
    setup: "Isliye:",
    punch: "Safai + putai",
    layout: {
      type: "list",
      items: [
        { art: "jhadu", title: "Safai", sub: "कोने-कोने" },
        { art: "emoji:🖌️", title: "Putai / chuna", sub: "सीलन और फफूँद पर" },
        { art: "emoji:☀️", title: "Dhoop", sub: "गद्दे और रज़ाई" },
      ],
    },
  },
  {
    id: "smart",
    seconds: 5.22,
    enter: "iris",
    vo: "यानी त्योहार के बहाने, मौसम बदलने की तैयारी। बड़ों का पुराना smart system।",
    tag: "SMART · FIG. 06",
    setup: "Tyohaar ke bahane",
    punch: "Mausam ki taiyari",
    layout: { type: "hero", art: "diyas", size: 900, stamp: "Smart!", glow: true },
  },
  {
    id: "cta",
    seconds: 4.64,
    enter: "iris",
    vo: "आपके घर में दिवाली की सफ़ाई का सबसे मुश्किल काम कौनसा है? Comment करो!",
    tag: "YOUR TURN · FIG. 07",
    setup: "Safai ka sabse",
    punch: "Mushkil kaam?",
    layout: { type: "cta", ask: "सबसे मुश्किल सफ़ाई का काम?", wish: "शुभ दीपावली", english: "HAPPY DIWALI!" },
  },
];
