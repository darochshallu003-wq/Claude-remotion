import type { Beat } from "../explainer/Explainer";

// "Why did Indians store water in copper pots (tamra jal)?" — one entry per
// scene. `seconds` is set from the voiceover clips by scripts/vo_timing.py.
// Questions (ending in "?") are voiced by a second, asking voice.
//
// Sources: Sudha V.B.P. et al., "Storing drinking-water in copper pots kills
// contaminating diarrhoeagenic bacteria", J Health Popul Nutr 30(1), 2012:
// water spiked with V. cholerae, Salmonella Typhi/Paratyphi, Shigella and
// E. coli held 16 h in copper pots yielded no recoverable bacteria, with
// copper levels within WHO limits. US EPA registered antimicrobial copper
// alloys in 2008.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 2.8;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 9.08,
    enter: "fade",
    vo: "दादी-नानी के घर में पानी हमेशा तांबे के लोटे में ही क्यों रखा जाता था? ये सिर्फ़ परंपरा नहीं थी… ये एक invisible water purifier था।",
  },
  {
    id: "tradition",
    seconds: 6.83,
    enter: "wipe",
    vo: "आयुर्वेद में इसे कहते हैं ताम्र जल। पानी रात भर तांबे के बर्तन में रखा जाता है, और सुबह पिया जाता है।",
  },
  {
    id: "past",
    seconds: 7.21,
    enter: "iris",
    vo: "पुराने ज़माने में न filter थे, न RO. और गंदे पानी से फैलती थीं हैज़ा, typhoid और दस्त जैसी बीमारियाँ।",
  },
  {
    id: "ask",
    seconds: 3.27,
    enter: "cut",
    vo: "तो क्या तांबा सच में पानी को साफ़ कर सकता है?",
  },
  {
    id: "study",
    seconds: 10.57,
    enter: "wipe",
    vo: "2012 में भारतीय scientists ने यही test किया। उन्होंने पानी में जानबूझकर हैज़ा, typhoid और E. coli जैसे bacteria मिलाए… और उसे तांबे के बर्तन में रख दिया।",
  },
  {
    id: "result",
    seconds: 6.47,
    enter: "cut",
    vo: "सोलह घंटे बाद नतीजा? तांबे वाले पानी में एक भी ज़िंदा bacteria नहीं मिला। बिल्कुल ज़ीरो।",
  },
  {
    id: "how",
    seconds: 1.74,
    enter: "iris",
    vo: "पर ये होता कैसे है?",
  },
  {
    id: "ions",
    seconds: 9.71,
    enter: "cut",
    vo: "तांबे के बर्तन से बहुत थोड़े copper ions पानी में घुलते हैं। ये ions bacteria की दीवार को तोड़ देते हैं… और अंदर के DNA तक को नुक़सान पहुँचाते हैं।",
  },
  {
    id: "effect",
    seconds: 5.51,
    enter: "wipe",
    vo: "Science में इसे कहते हैं oligodynamic effect. यानी थोड़ी सी धातु, पर बड़ा असर।",
  },
  {
    id: "hospital",
    seconds: 9.95,
    enter: "iris",
    vo: "और आज? 2008 में अमेरिका की EPA ने तांबे को antimicrobial surface माना। अब कई hospitals में दरवाज़ों के handles तांबे के लगाए जा रहे हैं।",
  },
  {
    id: "safe",
    seconds: 5.96,
    enter: "wipe",
    vo: "और घबराइए मत। उस study में पानी में घुला copper, WHO की safe limit के अंदर ही था।",
  },
  {
    id: "caution",
    seconds: 11.75,
    enter: "cut",
    vo: "पर ध्यान रहे, नींबू पानी या juice जैसी खट्टी चीज़ें तांबे में कभी मत रखिए। ये बहुत ज़्यादा copper घोल देती हैं। और तांबा chemical गंदगी नहीं हटाता, ये filter की जगह नहीं ले सकता।",
  },
  {
    id: "howto",
    seconds: 9.99,
    enter: "wipe",
    vo: "तो सही तरीका क्या है? साफ़ पानी, साफ़ तांबे का बर्तन, रात भर रखिए, सुबह पीजिए। और बर्तन को हफ़्ते में एक बार नींबू और नमक से साफ़ कर लीजिए।",
  },
  {
    id: "cta",
    seconds: 8.39,
    enter: "iris",
    vo: "हमारे बुज़ुर्गों के पास microscope नहीं था… पर उनका लोटा एक purifier था। आपके घर में तांबे का बर्तन है? Comment में बताइए।",
  },
];
