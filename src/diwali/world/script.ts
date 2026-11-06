import type { Shot } from "../kit";

// Ep 16: Diwali around the world. Nepal's five-day Tihar: Kag (crow), Kukur
// (dog; dogs as Yama's messengers), Gai Tihar + Laxmi Puja, Govardhan /
// Mha Puja, Bhai Tika. Public holiday in Mauritius, Fiji, Singapore,
// Trinidad and Tobago, Suriname, Sri Lanka and most Malaysian states.
// Indian indentured labourers (girmitiya) carried the festival abroad.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 6.25,
    enter: "fade",
    vo: "एक देश, जहाँ दिवाली पर कुत्तों की पूजा होती है। और कई देश, जहाँ दिवाली सरकारी छुट्टी है।",
    tag: "WORLD · FIG. 01",
    setup: "Diwali par",
    punch: "Kutton ki pooja?",
    layout: { type: "hero", art: "dog", size: 560, glow: true },
  },
  {
    id: "tihar",
    seconds: 5.53,
    enter: "wipe",
    vo: "नेपाल में दिवाली को तिहार कहते हैं। पाँच दिन का त्योहार, और दूसरा दिन, कुकुर तिहार।",
    dark: false,
    tag: "NEPAL · FIG. 02",
    setup: "Nepal mein:",
    punch: "Tihar",
    layout: { type: "hero", art: "emoji:🇳🇵", size: 320, pills: ["5 DIN KA TYOHAAR", "DIN 2: KUKUR TIHAR"] },
  },
  {
    id: "kukur",
    seconds: 8.0,
    enter: "cut",
    vo: "कुत्तों को गेंदे की माला पहनाई जाती है, तिलक लगता है, और ख़ास खाना मिलता है। क्योंकि कुत्ते को यमराज का दूत माना जाता है।",
    tag: "KUKUR TIHAR · FIG. 03",
    setup: "Mala, tilak, khana",
    punch: "Yam ke doot",
    layout: { type: "hero", art: "dog", size: 560, caption: "कुकुर तिहार", stamp: "Good boy!" },
  },
  {
    id: "days",
    seconds: 7.21,
    enter: "iris",
    vo: "और बाकी दिन? कौवों के लिए काग तिहार, फिर गाय और लक्ष्मी पूजा, फिर गोवर्धन पूजा, और आख़िर में भाई टीका।",
    dark: false,
    tag: "5 DAYS · FIG. 04",
    setup: "Tihar ke",
    punch: "5 din",
    layout: {
      type: "list",
      items: [
        { art: "emoji:🐦", title: "Kag Tihar", sub: "कौवे" },
        { art: "dog", title: "Kukur Tihar", sub: "कुत्ते" },
        { art: "emoji:🐄", title: "Gai + Laxmi", sub: "गाय और लक्ष्मी" },
        { art: "mountain", title: "Govardhan", sub: "गोवर्धन पूजा" },
        { art: "thali", title: "Bhai Tika", sub: "भाई-बहन" },
      ],
    },
  },
  {
    id: "holiday",
    seconds: 8.58,
    enter: "wipe",
    vo: "और दिवाली सरकारी छुट्टी है: मॉरीशस, फ़िजी, सिंगापुर, त्रिनिदाद और टोबैगो, सूरीनाम, श्रीलंका, और मलेशिया के ज़्यादातर हिस्सों में।",
    tag: "HOLIDAY · FIG. 05",
    setup: "Sarkari chhutti:",
    punch: "Kai desh",
    layout: {
      type: "cards",
      items: [
        { art: "emoji:🇲🇺", title: "मॉरीशस" },
        { art: "emoji:🇫🇯", title: "फ़िजी" },
        { art: "emoji:🇸🇬", title: "सिंगापुर" },
        { art: "emoji:🇹🇹", title: "त्रिनिदाद" },
        { art: "emoji:🇸🇷", title: "सूरीनाम" },
        { art: "emoji:🇱🇰", title: "श्रीलंका" },
      ],
    },
  },
  {
    id: "why",
    seconds: 6.9,
    enter: "cut",
    vo: "क्यों? क्योंकि सौ साल से भी पहले, गिरमिटिया मज़दूर बनकर गए लाखों भारतीय, अपने साथ दिवाली भी ले गए।",
    dark: false,
    tag: "HISTORY · FIG. 06",
    setup: "Kyun?",
    punch: "Girmitiya",
    layout: { type: "type", art: "emoji:🚢", text: "GHAR CHHOOTA, PAR DIYA SAATH GAYA.", caption: "गिरमिटिया मज़दूरों की विरासत" },
  },
  {
    id: "cta",
    seconds: 4.83,
    enter: "iris",
    vo: "आप ये reel कौनसे देश से देख रहे हो? Comment में बताओ! Happy Diwali!",
    tag: "YOUR TURN · FIG. 07",
    setup: "Aap kahan se",
    punch: "Dekh rahe ho?",
    layout: { type: "cta", ask: "कौनसे देश से देख रहे हो? 🌍", wish: "शुभ दीपावली", english: "HAPPY DIWALI, WORLD!" },
  },
];
