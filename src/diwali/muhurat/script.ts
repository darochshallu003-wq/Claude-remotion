import type { Shot } from "../kit";

// Ep 14: Muhurat trading. A special one-hour session on Diwali; commonly
// dated to 1957 at BSE and 1992 at NSE; marks the start of Samvat, the
// traders' new account year. Timing is set by exchange circular each year.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 6.73,
    enter: "fade",
    vo: "Stock market तो दिवाली की छुट्टी पर बंद रहता है… फिर भी उसी दिन, सिर्फ़ एक घंटे के लिए खुलता है। क्यों?",
    tag: "MARKET · FIG. 01",
    setup: "Chhutti ke din bhi",
    punch: "Market khula?",
    layout: { type: "hero", art: "chart", size: 640, glow: true },
  },
  {
    id: "what",
    seconds: 4.62,
    enter: "wipe",
    vo: "इसे मुहूर्त ट्रेडिंग कहते हैं। शुभ मुहूर्त में, एक घंटे का ख़ास session।",
    tag: "MUHURAT · FIG. 02",
    setup: "Muhurat trading:",
    punch: "Sirf 1 ghanta",
    layout: { type: "number", to: 1, label: "GHANTE KA KHAAS SESSION", art: "chart" },
  },
  {
    id: "why",
    seconds: 6.1,
    enter: "cut",
    vo: "क्योंकि कई व्यापारियों के लिए, दिवाली से हिसाब-किताब का नया साल, यानी नया संवत, शुरू होता है।",
    dark: false,
    tag: "WHY · FIG. 03",
    setup: "Kyunki Diwali =",
    punch: "Naya samvat",
    layout: { type: "hero", art: "ledger", size: 360, pills: ["NAYA SAAL", "NAYA HISAAB-KITAAB"] },
  },
  {
    id: "history",
    seconds: 6.63,
    enter: "iris",
    vo: "BSE में ये परंपरा 1957 से मानी जाती है, और NSE में 1992 से।",
    dark: false,
    tag: "HISTORY · FIG. 04",
    setup: "Kab se?",
    punch: "1957 se",
    layout: { type: "vs", left: { art: "chart", title: "BSE", sub: "1957 से" }, right: { art: "chart", title: "NSE", sub: "1992 से" } },
  },
  {
    id: "bohni",
    seconds: 7.3,
    enter: "wipe",
    vo: "ज़्यादातर लोग इसमें बड़ा दाँव नहीं लगाते। बस शुभ शुरुआत के लिए थोड़ा सा निवेश। जैसे दुकान की पहली बोहनी।",
    tag: "MINDSET · FIG. 05",
    setup: "Bada daav nahi,",
    punch: "Shubh bohni",
    layout: { type: "type", art: "coins", text: "BOHNI = PEHLI KAMAI = SHUBH SHURUAAT", caption: "थोड़ा सा, शगुन के लिए" },
  },
  {
    id: "note",
    seconds: 5.98,
    enter: "cut",
    vo: "पर याद रहे: मुहूर्त शुभ हो सकता है, पर market की कोई guarantee नहीं। निवेश, सोच-समझकर।",
    tag: "NOTE · FIG. 06",
    setup: "Yaad rahe:",
    punch: "No guarantee",
    punchColor: "#FF6A5A",
    layout: { type: "hero", art: "chart", size: 560, pills: ["NOT FINANCIAL ADVICE", "SOCH-SAMAJHKAR NIVESH"] },
  },
  {
    id: "cta",
    seconds: 5.12,
    enter: "iris",
    vo: "आप इस बार मुहूर्त ट्रेडिंग करेंगे? Comment करो। शुभ दीपावली, और शुभ लाभ!",
    tag: "YOUR TURN · FIG. 07",
    setup: "Is baar aap",
    punch: "Trade karoge?",
    layout: { type: "cta", ask: "मुहूर्त ट्रेडिंग: हाँ या ना?", wish: "शुभ लाभ", english: "HAPPY DIWALI!" },
  },
];
