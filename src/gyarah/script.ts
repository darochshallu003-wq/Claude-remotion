import type { Beat } from "../explainer/Explainer";

// "11:11 पर wish — universe का sign?" — kraft-style myth-buster made for
// 11/11/2026. `seconds` is set from the voiceover clips by
// scripts/vo_timing.py gyarah.
//
// Facts: a 24-hour clock shows 11:11 for one minute in 1,440 and a 12-hour
// clock for two (1 in 720). People glance at clocks dozens of times a day,
// so landing on 11:11 now and then is expected. Repeating digits are
// visually salient, so hits get noticed and remembered while the thousands
// of "10:47"s are forgotten — confirmation bias, and the frequency
// illusion (Baader-Meinhof phenomenon, named by Arnold Zwicky in 2005):
// once a pattern is on your mind, you start spotting it everywhere.
// 11 November is also National Education Day in India (Maulana Abul Kalam
// Azad's birthday) and, in Europe, Armistice Day: the First World War
// ended at the 11th hour of the 11th day of the 11th month, 1918.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 7.21,
    enter: "fade",
    vo: "आपने भी notice किया है? Phone उठाओ, और घड़ी में ग्यारह बजकर ग्यारह मिनट! क्या ये universe का कोई sign है?",
  },
  {
    id: "math",
    seconds: 8.77,
    enter: "cut",
    vo: "Maths देखिए। दिन में चौदह सौ चालीस मिनट होते हैं, और ग्यारह ग्यारह उनमें से सिर्फ़ एक। पर हम दिन में पचास से ज़्यादा बार phone देखते हैं।",
  },
  {
    id: "chance",
    seconds: 5.03,
    enter: "iris",
    vo: "तो कभी-कभार ग्यारह ग्यारह पर नज़र पड़ना कोई चमत्कार नहीं, ये तो होना ही था!",
  },
  {
    id: "memory",
    seconds: 9.51,
    enter: "wipe",
    vo: "असली खेल दिमाग का है। दस सैंतालीस, चार बाईस, हज़ारों बार देखे, पर कुछ याद नहीं। ग्यारह ग्यारह एक बार दिखा, और दिमाग ने save कर लिया।",
  },
  {
    id: "bias",
    seconds: 8.77,
    enter: "iris",
    vo: "इसे कहते हैं confirmation bias. और एक बार कोई चीज़ दिमाग में बैठ जाए, तो वो हर जगह दिखने लगती है। ये है frequency illusion.",
  },
  {
    id: "today",
    seconds: 8.55,
    enter: "wipe",
    vo: "पर आज की तारीख़ सच में ख़ास है! ग्यारह नवंबर, यानी ग्यारह ग्यारह। आज National Education Day है, मौलाना आज़ाद का जन्मदिन।",
  },
  {
    id: "cta",
    seconds: 7.69,
    enter: "iris",
    vo: "तो आज ग्यारह बजकर ग्यारह मिनट पर wish ज़रूर माँगिए, बस मेहनत भी साथ में कीजिए! Comment में बताइए, आपकी wish क्या है?",
  },
];
