import type { Beat } from "../explainer/Explainer";

// "सर्दी में दही क्यों नहीं जमता?" — kraft-style short with the illustrated
// cast. `seconds` is set from the voiceover clips by scripts/vo_timing.py
// dahi. Questions are voiced by a second, asking voice.
//
// Facts: dahi is set by lactic acid bacteria (Lactobacillus and relatives)
// that ferment lactose into lactic acid; falling pH makes casein coagulate
// into a gel. Cultures work best around 30-45 °C, slow down in the cold and
// die in milk that is too hot; refrigeration pauses them, which is why dahi
// keeps in the fridge. Home jaman is "back-slopped" from the previous batch.
// A teaspoon of fresh dahi carries on the order of a billion live bacteria.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 2.8;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.18,
    enter: "fade",
    vo: "गर्मी में रात भर में दही जम जाता है… पर सर्दी में सुबह तक दूध ही पड़ा रहता है। ऐसा क्यों?",
  },
  {
    id: "jaman",
    seconds: 7.67,
    enter: "cut",
    vo: "क्योंकि दही हम नहीं बनाते, इसे बनाते हैं bacteria! जामन की एक छोटी सी चम्मच में, अरबों ज़िंदा bacteria होते हैं।",
  },
  {
    id: "acid",
    seconds: 7.71,
    enter: "iris",
    vo: "ये bacteria दूध की चीनी, यानी lactose खाते हैं, और बनाते हैं lactic acid. दही का खट्टापन यहीं से आता है।",
  },
  {
    id: "net",
    seconds: 7.55,
    enter: "wipe",
    vo: "जैसे-जैसे acid बढ़ता है, दूध का protein casein आपस में जुड़कर एक जाल बना लेता है… और दूध, दही बन जाता है।",
  },
  {
    id: "cold",
    seconds: 11.0,
    enter: "iris",
    vo: "तो ठंड से दिक्कत क्या है? ये bacteria तीस से पैंतालीस degree की गर्माहट में सबसे तेज़ काम करते हैं। ठंड में ये सुस्त पड़ जाते हैं, बिल्कुल रज़ाई में दुबके हम लोगों की तरह।",
  },
  {
    id: "hot",
    seconds: 6.01,
    enter: "cut",
    vo: "और बहुत गर्म दूध में जामन डाला, तो bacteria मर ही जाते हैं। दूध बस गुनगुना होना चाहिए।",
  },
  {
    id: "twist",
    seconds: 6.54,
    enter: "iris",
    vo: "Plot twist! यही वजह है कि fridge में रखा दही ख़राब नहीं होता। ठंड bacteria को pause कर देती है।",
  },
  {
    id: "khandaan",
    seconds: 10.02,
    enter: "wipe",
    vo: "और आपके घर का जामन? वो पिछली बार के दही से आता है, और वो उससे पिछली बार के… यानी bacteria का पूरा खानदान, सालों से आपकी रसोई में पल रहा है!",
  },
  {
    id: "tips",
    seconds: 11.17,
    enter: "wipe",
    vo: "तो सर्दी में दही जमाएँ कैसे? दूध गुनगुना रखिए, एक चम्मच जामन मिलाइए, बर्तन को casserole में रखिए या कपड़े में लपेट दीजिए। या फिर oven में सिर्फ़ light जलाकर रख दीजिए।",
  },
  {
    id: "cta",
    seconds: 6.39,
    enter: "iris",
    vo: "आपके घर में सर्दी में दही जमाने का क्या जुगाड़ है? Comment में बताइए, और ये video मम्मी को ज़रूर भेजिए!",
  },
];
