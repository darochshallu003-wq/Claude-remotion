import type { Beat } from "../explainer/Explainer";

// "Photosynthesis" for Class 10 (CBSE, NCERT Science ch. "Life Processes"),
// one entry per scene. `seconds` is set from the voiceover clips by
// scripts/vo_timing.py. Questions (ending in "?") are voiced by a second,
// asking voice.
//
// Facts follow NCERT Class 10 Science, "Life Processes" (Nutrition in
// plants): the three events of photosynthesis, guard cells opening the
// stomatal pore when water flows in, the equation
// 6CO2 + 12H2O → C6H12O6 + 6O2 + 6H2O (chlorophyll, sunlight), and desert
// plants taking up CO2 at night.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 2.6;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 7.16,
    enter: "fade",
    vo: "Plants के पास न kitchen है, न Swiggy. फिर ये अपना खाना लाते कहाँ से हैं? जवाब है, photosynthesis.",
  },
  {
    id: "define",
    seconds: 11.91,
    enter: "wipe",
    vo: "Photosynthesis वो process है जिसमें green plants, sunlight की मदद से, carbon dioxide और पानी से अपना खाना, यानी carbohydrate, बनाते हैं। इसे autotrophic nutrition कहते हैं।",
  },
  {
    id: "inputs",
    seconds: 7.93,
    enter: "cut",
    vo: "इसके लिए चार चीज़ें चाहिए। Sunlight, पानी जो roots से आता है, हवा से carbon dioxide, और green pigment, chlorophyll.",
  },
  {
    id: "where",
    seconds: 8.7,
    enter: "iris",
    vo: "ये सब होता है leaf के अंदर। Leaf की cells में छोटे-छोटे green dots होते हैं, जिन्हें chloroplasts कहते हैं। इन्हीं में chlorophyll होता है।",
  },
  {
    id: "stomata",
    seconds: 13.28,
    enter: "wipe",
    vo: "पर carbon dioxide अंदर जाती कैसे है? Leaf की surface पर tiny pores होते हैं, जिन्हें stomata कहते हैं। Guard cells में पानी जाता है तो वो फूलकर pore खोल देती हैं, और पानी निकलने पर pore बंद हो जाता है।",
  },
  {
    id: "absorb",
    seconds: 5.84,
    enter: "cut",
    vo: "अब असली काम, तीन steps में। Step one: chlorophyll, light energy को absorb करता है।",
  },
  {
    id: "split",
    seconds: 10.55,
    enter: "wipe",
    vo: "Step two: ये light energy, chemical energy में बदल जाती है, और पानी के molecules टूटकर hydrogen और oxygen में split हो जाते हैं। यही oxygen हवा में छोड़ी जाती है।",
  },
  {
    id: "reduce",
    seconds: 9.25,
    enter: "wipe",
    vo: "Step three: carbon dioxide reduce होकर carbohydrate, यानी glucose, बनाती है। और extra glucose, starch बनकर leaf में store हो जाता है।",
  },
  {
    id: "equation",
    seconds: 9.06,
    enter: "iris",
    vo: "तो पूरी equation हुई: six CO2 plus twelve H2O, sunlight और chlorophyll की मौजूदगी में, बनाते हैं glucose, six O2 और six H2O.",
  },
  {
    id: "tip",
    seconds: 12.99,
    enter: "wipe",
    vo: "Board exam tip: desert plants दिन में पानी बचाने के लिए stomata बंद रखते हैं। वो रात में carbon dioxide लेते हैं, और दिन में उससे खाना बनाते हैं। यानी तीनों steps का एक के तुरंत बाद होना ज़रूरी नहीं।",
  },
  {
    id: "cta",
    seconds: 7.88,
    enter: "iris",
    vo: "तो याद रखो: light absorb, water split, carbon dioxide reduce. ये video save कर लो, exam से पहले काम आएगी।",
  },
];
