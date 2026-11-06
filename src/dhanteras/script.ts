import type { Beat } from "../explainer/Explainer";

// "Dhanteras pe sona, bartan aur jhaadu kyun?" — one entry per scene.
// `seconds` is set from the voiceover clips by scripts/vo_timing.py dhanteras.
//
// Sources: the name and date follow the Hindu lunar calendar (Kartik Krishna
// Trayodashi; 6 Nov 2026, first of Diwali's five days). Dhanvantari rising
// from the Samudra Manthan with the amrit kalash is from the Bhagavata and
// Vishnu Puranas. The King Hima / Yama Deepam story is the popular folk
// legend behind the day. Ayurveda Day: observed on Dhanteras from 2016;
// Ministry of Ayush gazette (2025) fixed it to 23 September because
// Dhanteras moves between ~15 Oct and 12 Nov.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 2.8;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.13,
    enter: "fade",
    vo: "आज धनतेरस है। सब सोना, बर्तन… और झाड़ू खरीद रहे हैं। पर कभी सोचा है, क्यों?",
  },
  {
    id: "name",
    seconds: 8.6,
    enter: "cut",
    vo: "धनतेरस, यानी धन और तेरस। तेरस मतलब त्रयोदशी, कार्तिक कृष्ण पक्ष का तेरहवाँ दिन। और यहीं से शुरू होते हैं दिवाली के पाँच दिन।",
  },
  {
    id: "twist",
    seconds: 3.54,
    enter: "iris",
    vo: "पर twist ये है: यहाँ असली धन, पैसा था ही नहीं।",
  },
  {
    id: "manthan",
    seconds: 8.46,
    enter: "wipe",
    vo: "पुराणों के अनुसार, समुद्र मंथन से इसी दिन भगवान धन्वंतरि प्रकट हुए। हाथ में अमृत कलश लेकर। वो आयुर्वेद के देवता माने जाते हैं।",
  },
  {
    id: "health",
    seconds: 4.5,
    enter: "cut",
    vo: "यानी धनतेरस का पहला धन है, सेहत। पहला सुख, निरोगी काया।",
  },
  {
    id: "ayurveda",
    seconds: 11.46,
    enter: "wipe",
    vo: "इसीलिए 2016 से सरकार धनतेरस पर National Ayurveda Day मनाती थी। पर धनतेरस की तारीख हर साल बदलती है, तो 2025 से इसे 23 September पर fix कर दिया गया।",
  },
  {
    id: "bartan",
    seconds: 6.27,
    enter: "iris",
    vo: "और बर्तन? माना जाता है, धन्वंतरि के कलश की याद में, इस दिन नया बर्तन घर लाना शुभ है।",
  },
  {
    id: "hima",
    seconds: 7.62,
    enter: "wipe",
    vo: "अब सोने की कहानी। लोक कथा है, राजा हिम के बेटे की कुंडली में लिखा था, शादी के चौथे दिन साँप के काटने से मौत।",
  },
  {
    id: "gold",
    seconds: 8.12,
    enter: "cut",
    vo: "उस रात उसकी पत्नी ने दरवाज़े पर सोने-चाँदी का ढेर लगा दिया, चारों ओर दीये जलाए, और रात भर कहानियाँ और गीत सुनाती रही।",
  },
  {
    id: "yama",
    seconds: 7.88,
    enter: "cut",
    vo: "यमराज साँप बनकर आए, पर चमक से उनकी आँखें चौंधिया गईं। वो ढेर पर बैठकर सुनते रहे… और सुबह, खाली लौट गए।",
  },
  {
    id: "deep",
    seconds: 6.75,
    enter: "iris",
    vo: "इसीलिए आज भी धनतेरस की शाम, घर के बाहर दक्षिण दिशा में यम का दीया जलाया जाता है। यम दीपदान।",
  },
  {
    id: "jhadu",
    seconds: 6.2,
    enter: "wipe",
    vo: "और झाड़ू? झाड़ू को लक्ष्मी का रूप माना जाता है। नई झाड़ू, यानी घर से दरिद्रता की सफ़ाई।",
  },
  {
    id: "recap",
    seconds: 7.19,
    enter: "cut",
    vo: "तो याद रखिए: बर्तन, सेहत के लिए। सोना, सुरक्षा के लिए। झाड़ू, सफ़ाई के लिए। और दीया, यम के लिए।",
  },
  {
    id: "cta",
    seconds: 4.64,
    enter: "iris",
    vo: "आपने इस धनतेरस क्या खरीदा? Comment में बताइए। Happy Dhanteras!",
  },
];
