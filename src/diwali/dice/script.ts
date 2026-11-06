import type { Shot } from "../kit";

// Ep 17: Why cards/dice on Diwali night. Popular legend: Shiva and Parvati
// played chausar on Kartik Amavasya and Parvati blessed those who play that
// night with prosperity. Counterpoint: the Mahabharata dice game. Gambling
// for money is an offence under most Indian state laws.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 5.6,
    enter: "fade",
    vo: "दिवाली की रात कई घरों में ताश की बाज़ी लगती है। इसके पीछे भी एक पौराणिक कहानी है।",
    tag: "TAASH · FIG. 01",
    setup: "Diwali ki raat",
    punch: "Taash kyun?",
    layout: { type: "hero", art: "dice", size: 560, glow: true },
  },
  {
    id: "story",
    seconds: 6.08,
    enter: "wipe",
    vo: "कहते हैं, कार्तिक अमावस्या की रात, शिव और पार्वती ने चौसर खेला। यानी पासों का खेल।",
    tag: "KAHANI · FIG. 02",
    setup: "Shiv + Parvati",
    punch: "Chausar",
    layout: { type: "hero", art: "dice", size: 540, caption: "कार्तिक अमावस्या की रात" },
  },
  {
    id: "blessing",
    seconds: 6.97,
    enter: "cut",
    vo: "पार्वती जीतीं, और उन्होंने आशीर्वाद दिया: जो इस रात पासे खेलेगा, उसके घर पूरे साल समृद्धि रहेगी।",
    dark: false,
    tag: "KAHANI · FIG. 03",
    setup: "Parvati jeeti,",
    punch: "Aashirvaad diya",
    layout: { type: "type", art: "coins", text: "JO IS RAAT KHELEGA, USKE GHAR SAAL BHAR SAMRIDDHI.", caption: "लोक कथा" },
  },
  {
    id: "shagun",
    seconds: 4.28,
    enter: "iris",
    vo: "इसीलिए कुछ जगह, दिवाली की रात ताश खेलना शगुन माना जाता है।",
    tag: "PARAMPARA · FIG. 04",
    setup: "Isliye kuch jagah",
    punch: "Taash = shagun",
    layout: { type: "hero", art: "emoji:🃏", size: 340, pills: ["PARIVAAR KE SAATH", "SHAGUN KE LIYE"] },
  },
  {
    id: "mahabharat",
    seconds: 5.94,
    enter: "wipe",
    vo: "पर दूसरी तरफ़ महाभारत भी है, जहाँ जुए में युधिष्ठिर ने राज्य, भाई, और सब कुछ हार दिया।",
    dark: false,
    tag: "DOOSRA PEHLU · FIG. 05",
    setup: "Doosri taraf:",
    punch: "Mahabharat",
    layout: { type: "vs", left: { art: "dice", title: "Chausar", sub: "शिव-पार्वती · शगुन", ok: true }, right: { art: "dice", title: "Dyut", sub: "युधिष्ठिर · सब हारे", ok: false } },
  },
  {
    id: "law",
    seconds: 7.57,
    enter: "cut",
    vo: "और याद रखिए: भारत के ज़्यादातर राज्यों में, पैसों वाला जुआ क़ानूनन अपराध है। शगुन के लिए खेलो, दाँव के लिए नहीं।",
    tag: "NOTE · FIG. 06",
    setup: "Yaad rakho:",
    punch: "Shagun, daav nahi",
    punchColor: "#FF6A5A",
    layout: { type: "hero", art: "emoji:⚖️", size: 320, pills: ["PAISON KA JUA = APRAADH", "MAZE KE LIYE KHELO"] },
  },
  {
    id: "cta",
    seconds: 5.05,
    enter: "iris",
    vo: "आपके घर दिवाली पर कौनसा game खेला जाता है? Comment करो। शुभ दीपावली!",
    tag: "YOUR TURN · FIG. 07",
    setup: "Aapke ghar ka",
    punch: "Diwali game?",
    layout: { type: "cta", ask: "दिवाली पर आपका फ़ेवरेट गेम?", wish: "शुभ दीपावली", english: "HAPPY DIWALI!" },
  },
];
