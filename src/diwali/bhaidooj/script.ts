import type { Shot } from "../kit";

// Ep 5: Bhai Dooj / Yama Dwitiya. Yama and Yamuna, children of Surya; the
// visit on Kartik Shukla Dwitiya and Yama's boon, per the popular legend.
// Regional names: Bhau Beej, Bhai Phonta, Bhai Tika (Nepal).

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 7.26,
    enter: "fade",
    vo: "धनतेरस पर जिस यमराज से बचने के लिए दीया जलाते हैं… भाई दूज पर वही यमराज, एक प्यार करने वाले भाई हैं।",
    tag: "BHAI DOOJ · FIG. 01",
    setup: "Wahi Yamraj…",
    punch: "Ek pyaara bhai",
    layout: { type: "hero", art: "thali", size: 640, caption: "यम द्वितीया", glow: true },
  },
  {
    id: "siblings",
    seconds: 4.57,
    enter: "wipe",
    vo: "यम और यमुना, सूर्य देव की संतान हैं। यानी, भाई और बहन।",
    dark: false,
    tag: "STORY · FIG. 02",
    setup: "Surya dev ke bachche",
    punch: "Yam + Yamuna",
    layout: { type: "vs", left: { art: "emoji:🐃", title: "Yama", sub: "भाई" }, right: { art: "emoji:🌊", title: "Yamuna", sub: "बहन" }, caption: "सूर्य देव की संतान" },
  },
  {
    id: "invite",
    seconds: 4.83,
    enter: "cut",
    vo: "यमुना बार-बार भाई को घर बुलाती थीं। पर यम, अपने काम में व्यस्त रहते।",
    dark: false,
    tag: "STORY · FIG. 03",
    setup: "Behen ka invite…",
    punch: "Bhai busy",
    layout: { type: "type", art: "emoji:✉️", text: "BHAIYA, GHAR KAB AAOGE?  ...  SEEN.", caption: "हर साल वही कहानी 😄" },
  },
  {
    id: "visit",
    seconds: 7.81,
    enter: "iris",
    vo: "आख़िरकार, कार्तिक शुक्ल द्वितीया को यम बहन के घर पहुँचे। यमुना ने तिलक लगाया, आरती उतारी, और प्यार से खाना खिलाया।",
    tag: "THE VISIT · FIG. 04",
    setup: "Kartik Shukla Dwitiya",
    punch: "Bhai aaya!",
    layout: {
      type: "list",
      items: [
        { art: "thali", title: "Tilak", sub: "रोली और चावल" },
        { art: "diya", title: "Aarti", sub: "दीये से" },
        { art: "laddoo", title: "Bhojan", sub: "प्यार से खाना" },
      ],
    },
  },
  {
    id: "boon",
    seconds: 7.16,
    enter: "wipe",
    vo: "ख़ुश होकर यम ने वरदान दिया: जो भाई इस दिन बहन के घर जाकर तिलक करवाएगा, उसे अकाल मृत्यु का डर नहीं होगा।",
    tag: "VARDAAN · FIG. 05",
    setup: "Yam ka vardaan:",
    punch: "Akaal mrityu nahi",
    layout: { type: "hero", art: "diya", size: 360, pills: ["BEHEN KE GHAR JAO", "TILAK KARWAO"], stamp: "Vardaan", glow: true },
  },
  {
    id: "names",
    seconds: 6.99,
    enter: "iris",
    vo: "इसीलिए इसे यम द्वितीया भी कहते हैं। महाराष्ट्र में भाऊबीज, बंगाल में भाई फोंटा, और नेपाल में भाई टीका।",
    dark: false,
    tag: "NAMES · FIG. 06",
    setup: "Ek tyohaar,",
    punch: "Kai naam",
    layout: {
      type: "cards",
      items: [
        { art: "thali", title: "यम द्वितीया" },
        { art: "diya", title: "भाऊबीज" },
        { art: "laddoo", title: "भाई फोंटा" },
        { art: "emoji:🏔️", title: "भाई टीका" },
      ],
    },
  },
  {
    id: "cta",
    seconds: 5.17,
    enter: "iris",
    vo: "अपने भाई या बहन को tag करो, जो हर साल गिफ़्ट माँगते हैं! Happy Bhai Dooj!",
    tag: "YOUR TURN · FIG. 07",
    setup: "Bhai ya behen ko",
    punch: "Tag karo!",
    layout: { type: "cta", ask: "उन्हें tag करो जो गिफ़्ट माँगते हैं 😄", wish: "शुभ भाई दूज", english: "HAPPY BHAI DOOJ!" },
  },
];
