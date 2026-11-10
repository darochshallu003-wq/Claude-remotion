import type { Beat } from "../explainer/Explainer";

// "What happens if you switch the fridge off at night?" — one entry per
// scene. `seconds` is set from the voiceover clips by scripts/vo_timing.py.
// Questions (ending in "?") are voiced by a second, asking voice.
//
// Sources: USDA FSIS food-safety guidance — an unopened refrigerator keeps
// food safely cold for about 4 hours without power; the "danger zone" is
// 40–140 °F (≈4–60 °C), where bacteria can double in as little as 20
// minutes; perishables above 40 °F for over 2 hours should be discarded;
// keep the fridge at or below 40 °F (≈4 °C). The bill figures are an
// estimate for a typical ~250 L Indian fridge using under 1 kWh a day,
// and are presented as an estimate ("andaazan").

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 2.8;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.44,
    enter: "fade",
    vo: "रात को fridge बंद करके बिजली बचाते हो? रुको। इससे बचत कम, और नुक़सान ज़्यादा हो सकता है।",
  },
  {
    id: "works",
    seconds: 11.91,
    enter: "wipe",
    vo: "पहले समझो fridge चलता कैसे है। अंदर का thermostat temperature check करता है, और ज़रूरत पड़ने पर ही compressor चालू होता है। रात में door कोई नहीं खोलता, इसलिए compressor वैसे भी कम चलता है।",
  },
  {
    id: "timeline",
    seconds: 10.88,
    enter: "iris",
    vo: "अब fridge बंद किया। अगर door बंद रहे, तो अंदर लगभग चार घंटे तक ही ठंडक safe रहती है। उसके बाद temperature पाँच degree से ऊपर चला जाता है, यानी danger zone में।",
  },
  {
    id: "bacteria",
    seconds: 10.86,
    enter: "cut",
    vo: "पाँच से साठ degree के बीच bacteria की party शुरू। कुछ bacteria हर बीस मिनट में double हो सकते हैं। Theory में एक bacteria, आठ घंटे में एक करोड़ से ज़्यादा बन सकता है।",
  },
  {
    id: "morning",
    seconds: 10.57,
    enter: "wipe",
    vo: "सुबह switch on किया, तो compressor को पूरा गरम fridge फिर से ठंडा करना पड़ता है। वो लगातार full power पर चलता है, और रात की बची बिजली का बड़ा हिस्सा यहीं खर्च हो जाता है।",
  },
  {
    id: "bill",
    seconds: 12.99,
    enter: "iris",
    vo: "अब हिसाब लगाओ। एक आम fridge दिन भर में लगभग एक unit से कम बिजली खाता है। रात को बंद करके असली बचत, अंदाज़न एक-दो रुपये रोज़। और एक बार दूध या सब्ज़ी ख़राब हुई, तो पूरे महीने की बचत गई।",
  },
  {
    id: "extras",
    seconds: 9.08,
    enter: "wipe",
    vo: "ऊपर से, direct cool fridge की बर्फ़ पिघलकर पानी टपकता है, अंदर बदबू बनती है, और बार-बार full load पर start होने से compressor पर भी ज़ोर पड़ता है।",
  },
  {
    id: "tips",
    seconds: 11.79,
    enter: "iris",
    vo: "बिजली सच में बचानी है? Temperature तीन-चार degree पर रखो, गरम खाना थोड़ा ठंडा होने दो, door की rubber seal check करो, fridge को दीवार से थोड़ा दूर रखो, और नया लो तो ज़्यादा star वाला लो।",
  },
  {
    id: "cta",
    seconds: 7.45,
    enter: "iris",
    vo: "तो fridge को चौबीस घंटे चलने दो, बस समझदारी से। आपके घर में रात को fridge कौन बंद करता है? Comment में बताइए।",
  },
];
