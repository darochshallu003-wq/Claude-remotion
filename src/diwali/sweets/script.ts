import type { Shot } from "../kit";

// Ep 13: Kaju katli vs soan papdi. Cashew is native to Brazil and was
// brought to India (Goa) by the Portuguese in the 16th century; India is one
// of the world's largest cashew producers and processors. Soan papdi is made
// by repeatedly pulling sugar syrup with gram flour and ghee into flaky
// strands; with no khoya it keeps longer than milk sweets.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 5.67,
    enter: "fade",
    vo: "दिवाली की दो मशहूर मिठाइयाँ: एक सबको चाहिए… और दूसरी, सब आगे बढ़ा देते हैं।",
    tag: "MITHAI · FIG. 01",
    setup: "Diwali ka sabse bada",
    punch: "Mithai muqabla",
    layout: { type: "vs", left: { art: "kaju", title: "Kaju katli", sub: "सबको चाहिए" }, right: { art: "soan", title: "Soan papdi", sub: "सब आगे बढ़ाते 😄" } },
  },
  {
    id: "twist",
    seconds: 4.02,
    enter: "wipe",
    vo: "काजू कटली का सबसे दिलचस्प fact: काजू भारत का है ही नहीं!",
    tag: "KAJU · FIG. 02",
    setup: "Twist:",
    punch: "Kaju Indian nahi!",
    layout: { type: "hero", art: "kaju", size: 520, stamp: "Videshi!" },
  },
  {
    id: "origin",
    seconds: 5.07,
    enter: "cut",
    vo: "काजू का पेड़ ब्राज़ील से है। सोलहवीं सदी में पुर्तगाली इसे गोवा लेकर आए।",
    dark: false,
    tag: "HISTORY · FIG. 03",
    setup: "Kaju ka safar:",
    punch: "Brazil → Goa",
    layout: { type: "type", art: "globe", text: "BRAZIL → PORTUGUESE JAHAZ → GOA · 1500s", caption: "सोलहवीं सदी" },
  },
  {
    id: "today",
    seconds: 5.65,
    enter: "iris",
    vo: "और आज भारत, दुनिया के सबसे बड़े काजू उगाने और process करने वाले देशों में से एक है।",
    tag: "TODAY · FIG. 04",
    setup: "Aur aaj Bharat:",
    punch: "Kaju superpower",
    layout: { type: "hero", art: "kaju", size: 460, pills: ["TOP UGAANE WALE DESH", "TOP PROCESSING DESH"] },
  },
  {
    id: "soan",
    seconds: 8.41,
    enter: "wipe",
    vo: "अब सोन पापड़ी। ये बनती है चीनी की चाशनी को बेसन और घी के साथ, बार-बार खींचकर। इसीलिए इसमें धागों जैसी परतें होती हैं।",
    dark: false,
    tag: "SOAN · FIG. 05",
    setup: "Soan papdi:",
    punch: "Dhaagon ki mithai",
    layout: { type: "hero", art: "soan", size: 520, pills: ["CHAASHNI + BESAN + GHEE", "KHEENCHO, MODO, DOHRAO"] },
  },
  {
    id: "meme",
    seconds: 7.02,
    enter: "cut",
    vo: "और ये इंटरनेट की सबसे बड़ी meme मिठाई है: वो डिब्बा जो घर-घर घूमकर, कभी-कभी वापस आपके पास आ जाता है।",
    tag: "MEME · FIG. 06",
    setup: "Internet ki",
    punch: "Meme mithai",
    layout: { type: "type", art: "soan", text: "AAPKA GHAR → PADOSI → RISHTEDAAR → AAPKA GHAR 🔁", caption: "सोन पापड़ी का सफ़र 😄" },
  },
  {
    id: "defend",
    seconds: 6.85,
    enter: "wipe",
    vo: "पर सोन पापड़ी के बचाव में: इसमें खोया नहीं होता। इसलिए ये खोये वाली मिठाइयों से कहीं ज़्यादा दिन टिकती है।",
    dark: false,
    tag: "DEFENCE · FIG. 07",
    setup: "Soan papdi ke",
    punch: "Bachaav mein",
    layout: {
      type: "list",
      items: [
        { art: "soan", title: "Soan papdi", sub: "सूखी, ज़्यादा दिन चलती" },
        { art: "emoji:🥛", title: "Khoye wali", sub: "जल्दी ख़राब, फ़्रिज ज़रूरी" },
      ],
    },
  },
  {
    id: "cta",
    seconds: 4.47,
    enter: "iris",
    vo: "तो बताओ, आप Team काजू कटली हो, या Team सोन पापड़ी? Comment करो!",
    tag: "YOUR TURN · FIG. 08",
    setup: "Team kaju katli",
    punch: "Ya soan papdi?",
    layout: { type: "cta", ask: "आपकी टीम? कमेंट में लिखो", wish: "मीठी दिवाली", english: "HAPPY DIWALI!" },
  },
];
