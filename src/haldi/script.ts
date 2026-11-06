import type { Beat } from "../explainer/Explainer";

// "Why did Dadi add black pepper to haldi doodh?" — one entry per scene.
// `seconds` is set from the voiceover clips by scripts/vo_timing.py haldi.
//
// Sources: Shoba G. et al., "Influence of piperine on the pharmacokinetics
// of curcumin in animals and human volunteers", Planta Medica 64(4), 1998
// (St. John's Medical College, Bangalore): 2 g curcumin alone gave very low
// serum levels; with 20 mg piperine bioavailability rose by 2000%.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 2.8;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.27,
    enter: "fade",
    vo: "हल्दी को superfood कहते हैं… पर एक problem है। आपका शरीर इसे लगभग absorb ही नहीं करता।",
  },
  {
    id: "dadi",
    seconds: 5.63,
    enter: "cut",
    vo: "फिर भी दादी, हल्दी वाले दूध में हमेशा एक चुटकी काली मिर्च डालती थीं। आख़िर क्यों?",
  },
  {
    id: "curcumin",
    seconds: 7.28,
    enter: "wipe",
    vo: "हल्दी की असली ताक़त है curcumin, इसी से हल्दी का पीला रंग आता है। पर हल्दी में ये सिर्फ़ लगभग तीन percent होता है।",
  },
  {
    id: "problem",
    seconds: 8.67,
    enter: "cut",
    vo: "और जो थोड़ा curcumin पेट तक पहुँचता है… उसे liver और आंतें तुरंत तोड़कर बाहर निकाल देती हैं। Blood तक पहुँचता है — ना के बराबर।",
  },
  {
    id: "twist",
    seconds: 2.58,
    enter: "iris",
    vo: "यहीं entry होती है काली मिर्च की।",
  },
  {
    id: "piperine",
    seconds: 9.2,
    enter: "cut",
    vo: "काली मिर्च में होता है piperine, वही जो इसे तीखा बनाता है। ये liver के इस safai process को धीमा कर देता है… ताकि curcumin ज़्यादा देर टिक सके।",
  },
  {
    id: "study",
    seconds: 11.22,
    enter: "wipe",
    vo: "1998 में Bangalore के scientists ने इसे test किया, और ये study Planta Medica journal में छपी। लोगों को दो gram curcumin दिया गया। अकेले — blood में लगभग कुछ नहीं दिखा।",
  },
  {
    id: "result",
    seconds: 7.16,
    enter: "cut",
    vo: "फिर साथ में सिर्फ़ बीस milligram piperine मिलाया… और absorption बढ़ गया, दो हज़ार percent! यानी बीस गुना।",
  },
  {
    id: "milk",
    seconds: 6.92,
    enter: "iris",
    vo: "और दूध ही क्यों? क्योंकि curcumin पानी में नहीं, fat में घुलता है। दूध या घी का fat इसमें मदद करता है।",
  },
  {
    id: "tadka",
    seconds: 7.69,
    enter: "cut",
    vo: "और ध्यान दीजिए — हम हल्दी को हमेशा घी या तेल के तड़के में डालते हैं। यानी fat वाली trick, हमारी रसोई में पहले से है।",
  },
  {
    id: "trikatu",
    seconds: 7.88,
    enter: "wipe",
    vo: "आयुर्वेद में काली मिर्च, पीपली और सोंठ का मिश्रण, त्रिकटु, सदियों से दूसरी जड़ी-बूटियों का असर बढ़ाने के लिए इस्तेमाल होता आया है।",
  },
  {
    id: "latte",
    seconds: 4.52,
    enter: "iris",
    vo: "आज यही नुस्खा, दुनिया भर के cafés में turmeric latte बनकर बिक रहा है।",
  },
  {
    id: "recipe",
    seconds: 7.23,
    enter: "wipe",
    vo: "तो सही तरीका क्या है? एक cup गर्म दूध, आधा चम्मच हल्दी, एक चुटकी काली मिर्च… और चाहें तो थोड़ा सा घी।",
  },
  {
    id: "caution",
    seconds: 9.66,
    enter: "cut",
    vo: "बस एक बात याद रखें: piperine कुछ दवाइयों का असर भी बदल सकता है। Supplements लेने हों, तो पहले doctor से पूछें। दूध में एक चुटकी काफ़ी है।",
  },
  {
    id: "cta",
    seconds: 8.19,
    enter: "iris",
    vo: "दादी के पास lab नहीं था… पर नुस्खा पूरा science वाला था। आपके घर में हल्दी दूध में काली मिर्च डलती है? Comment में बताइए।",
  },
];
