import type { Shot } from "../kit";

// Ep 4: Govardhan Puja and the 56 bhog. Govardhan lila from the Bhagavata
// Purana (10th canto); the 8 meals x 7 days explanation is the popular
// tradition behind chhappan bhog. Annakut on the day after Diwali.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 5.86,
    enter: "fade",
    vo: "छप्पन भोग में… छप्पन ही क्यों? पचपन या साठ क्यों नहीं? जवाब एक पहाड़ में छिपा है।",
    tag: "GOVARDHAN · FIG. 01",
    setup: "Chhappan bhog",
    punch: "56 hi kyun?",
    punchSize: 150,
    layout: { type: "hero", art: "laddoo", size: 520, glow: true },
  },
  {
    id: "indra",
    seconds: 9.66,
    enter: "wipe",
    vo: "गोकुल के लोग हर साल बारिश के लिए इंद्र की पूजा करते थे। बाल कृष्ण ने कहा: पूजा करो गोवर्धन पर्वत की, जो हमारी गायों को घास और पानी देता है।",
    dark: false,
    tag: "STORY · FIG. 02",
    setup: "Krishna ka sawaal:",
    punch: "Pooja kiski?",
    layout: { type: "vs", left: { art: "emoji:🌩️", title: "Indra", sub: "बारिश के देवता", ok: false }, right: { art: "mountain", title: "Govardhan", sub: "घास, पानी, गायें", ok: true } },
  },
  {
    id: "storm",
    seconds: 4.66,
    enter: "cut",
    vo: "इंद्र नाराज़ हुए, और गोकुल पर सात दिन तक मूसलाधार बारिश बरसा दी।",
    tag: "STORY · FIG. 03",
    setup: "Indra naraaz…",
    punch: "Toofan!",
    layout: { type: "number", to: 7, label: "DIN MOOSLADHAR BAARISH", art: "emoji:⛈️" },
  },
  {
    id: "lift",
    seconds: 7.11,
    enter: "iris",
    vo: "तब कृष्ण ने गोवर्धन पर्वत को अपनी छोटी उंगली पर उठा लिया, और पूरा गोकुल सात दिन उसके नीचे सुरक्षित रहा।",
    tag: "STORY · FIG. 04",
    setup: "Chhoti ungli par",
    punch: "Poora parvat",
    layout: { type: "hero", art: "mountain", size: 600, caption: "गोवर्धनधारी", glow: true },
  },
  {
    id: "math",
    seconds: 7.47,
    enter: "wipe",
    vo: "अब हिसाब: कहते हैं यशोदा माँ कृष्ण को दिन में आठ बार खाना खिलाती थीं। उन सात दिनों में कृष्ण ने कुछ नहीं खाया।",
    dark: false,
    tag: "THE MATH · FIG. 05",
    setup: "Ab hisaab:",
    punch: "8 baar khana",
    layout: { type: "type", art: "emoji:🍽️", text: "ROZ 8 BAAR KHANA  x  7 DIN BHOOKE  =  ?", caption: "यशोदा माँ का हिसाब" },
  },
  {
    id: "answer",
    seconds: 4.83,
    enter: "cut",
    vo: "आठ गुणा सात… छप्पन! तो बारिश थमने पर, छप्पन पकवान एक साथ।",
    tag: "THE MATH · FIG. 06",
    setup: "8 x 7 =",
    punch: "Chhappan bhog!",
    layout: { type: "number", from: 0, to: 56, label: "PAKWAAN · EK SAATH", art: "laddoo" },
  },
  {
    id: "annakut",
    seconds: 10.09,
    enter: "wipe",
    vo: "इसीलिए दिवाली के अगले दिन अन्नकूट बनता है: अनाज और पकवानों का पहाड़, गोवर्धन के रूप में। और कई घरों में गोबर से गोवर्धन बनाकर, गायों की पूजा होती है।",
    dark: false,
    tag: "TODAY · FIG. 07",
    setup: "Diwali ke agle din",
    punch: "Annakut",
    layout: {
      type: "cards",
      items: [
        { art: "laddoo", title: "अन्नकूट" },
        { art: "mountain", title: "गोवर्धन" },
        { art: "emoji:🐄", title: "गौ पूजा" },
      ],
    },
  },
  {
    id: "cta",
    seconds: 4.76,
    enter: "iris",
    vo: "आपके घर अन्नकूट में क्या-क्या बनता है? Comment करो। शुभ गोवर्धन पूजा!",
    tag: "YOUR TURN · FIG. 08",
    setup: "Aapke annakut mein",
    punch: "Kya banta hai?",
    layout: { type: "cta", ask: "अन्नकूट में आपका फ़ेवरेट पकवान?", wish: "शुभ गोवर्धन पूजा", english: "HAPPY GOVARDHAN PUJA!" },
  },
];
