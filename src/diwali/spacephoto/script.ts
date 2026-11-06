import type { Shot } from "../kit";

// Ep 12: The viral "India on Diwali from space" photo. It is a multi-year
// composite of US DMSP night-lights data (coloured by NOAA's Chris Elvidge to
// show when city lights appeared, i.e. growth), not Diwali night. NASA says
// Diwali's extra light is likely imperceptible from space. NASA released a
// real VIIRS (Suomi NPP) night image around Diwali in November 2012.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 7.86,
    enter: "fade",
    vo: "ये photo आपने WhatsApp पर ज़रूर देखी होगी: NASA ने दिखाया, दिवाली की रात भारत ऐसा दिखता है। पर ये सच नहीं है।",
    tag: "FACT CHECK · FIG. 01",
    setup: "Diwali from space?",
    punch: "Fake hai!",
    punchColor: "#FF6A5A",
    punchSize: 150,
    layout: { type: "hero", art: "nightFake", size: 560, stamp: "Fake" },
  },
  {
    id: "what",
    seconds: 6.92,
    enter: "wipe",
    vo: "असल में ये अमेरिकी satellites के, कई सालों के data को जोड़कर बनाई गई image है। एक रात की photo नहीं।",
    tag: "TRUTH · FIG. 02",
    setup: "Asal mein:",
    punch: "Kai saalon ka data",
    layout: { type: "hero", art: "satellite", size: 600, pills: ["US DMSP SATELLITES", "EK RAAT NAHI, KAI SAAL"] },
  },
  {
    id: "colours",
    seconds: 8.43,
    enter: "cut",
    vo: "और ये रंग? ये पटाखों के रंग नहीं हैं। ये दिखाते हैं कि कौनसे शहर की रोशनी, किस साल पहली बार दिखी। यानी शहरों का बढ़ना।",
    dark: false,
    tag: "TRUTH · FIG. 03",
    setup: "Aur ye rang?",
    punch: "Saal ka code",
    layout: { type: "type", art: "nightFake", text: "RANG = KIS SAAL ROSHNI DIKHI. PATAKHE NAHI.", caption: "शहरों के बढ़ने का नक्शा" },
  },
  {
    id: "nasa",
    seconds: 5.84,
    enter: "iris",
    vo: "NASA ख़ुद कह चुका है: दिवाली की extra रोशनी, अंतरिक्ष से शायद पहचान में ही नहीं आती।",
    tag: "NASA SAYS · FIG. 04",
    setup: "NASA ka kehna:",
    punch: "Diwali dikhti nahi",
    layout: { type: "hero", art: "globe", size: 460, caption: "रोशनी बहुत बिखरी, बहुत हल्की" },
  },
  {
    id: "real",
    seconds: 8.51,
    enter: "wipe",
    vo: "2012 में NASA ने दिवाली के आस-पास भारत की असली night image जारी की थी। वो इतनी रंगीन नहीं, बस पीली-सफ़ेद रोशनी।",
    tag: "REAL · FIG. 05",
    setup: "Asli image:",
    punch: "Itni rangeen nahi",
    layout: { type: "vs", left: { art: "nightFake", title: "Viral", ok: false }, right: { art: "nightReal", title: "Asli · 2012", ok: true } },
  },
  {
    id: "tips",
    seconds: 7.26,
    enter: "cut",
    vo: "तो forward करने से पहले: image को reverse search करो, source देखो, और PIB fact check पर एक बार check करो।",
    dark: false,
    tag: "HOW TO · FIG. 06",
    setup: "Forward se pehle",
    punch: "Check karo",
    layout: {
      type: "list",
      items: [
        { art: "emoji:🔍", title: "Reverse search", sub: "इमेज कहाँ से आई?" },
        { art: "emoji:📰", title: "Source dekho", sub: "किसने कहा?" },
        { art: "emoji:✅", title: "Fact check", sub: "PIB, बड़े fact-checkers" },
      ],
    },
  },
  {
    id: "cta",
    seconds: 5.65,
    enter: "iris",
    vo: "ये photo आपको इस साल कितनी बार आई? Comment करो, और ये reel उसी group में भेज दो!",
    tag: "YOUR TURN · FIG. 07",
    setup: "Is saal kitni baar",
    punch: "Aayi ye photo?",
    layout: { type: "cta", ask: "ये reel उसी ग्रुप में भेजो 😄", wish: "सच्ची दिवाली", english: "HAPPY DIWALI!" },
  },
];
