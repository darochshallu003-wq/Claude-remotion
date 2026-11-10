import type { Beat } from "../explainer/Explainer";

// "Krebs cycle" for NEET (NCERT Class 11 Biology, "Respiration in Plants"),
// one entry per scene. `seconds` is set from the voiceover clips by
// scripts/vo_timing.py.
//
// Facts: NCERT Class 11 ch. "Respiration in Plants" (link reaction by
// pyruvate dehydrogenase; citric acid as first product; two successive
// decarboxylations to alpha-ketoglutaric acid and succinyl-CoA; GTP by
// substrate-level phosphorylation; FADH2 at succinate -> fumarate; summary
// equation incl. the link reaction). Enzyme names are the standard set
// used in NEET: citrate synthase, aconitase, isocitrate dehydrogenase,
// alpha-ketoglutarate dehydrogenase, succinyl-CoA synthetase, succinate
// dehydrogenase (bound to the inner mitochondrial membrane), fumarase,
// malate dehydrogenase.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 2.8;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 9.66,
    enter: "fade",
    vo: "Glucose से energy निकालने का सबसे important हिस्सा है Krebs cycle. NEET में इससे हर साल सवाल आते हैं। तो चलो, इसे एक बार में clear करते हैं।",
  },
  {
    id: "where",
    seconds: 10.02,
    enter: "iris",
    vo: "Glycolysis के बाद pyruvate, mitochondria में जाता है। Krebs cycle होता है mitochondrial matrix में। इसे TCA cycle या citric acid cycle भी कहते हैं।",
  },
  {
    id: "link",
    seconds: 14.24,
    enter: "wipe",
    vo: "पहले link reaction. Pyruvate, यानी तीन carbon, pyruvate dehydrogenase की मदद से oxidative decarboxylation से गुज़रता है। एक CO2 निकलता है, एक NADH बनता है, और बनता है acetyl CoA, यानी दो carbon.",
  },
  {
    id: "entry",
    seconds: 15.25,
    enter: "wipe",
    vo: "अब cycle शुरू। Acetyl CoA, चार carbon वाले oxaloacetic acid से जुड़ता है, enzyme है citrate synthase. बनता है citric acid, छह carbon. यही Krebs cycle का first product है। फिर aconitase इसे isocitrate में बदल देता है।",
  },
  {
    id: "first",
    seconds: 8.17,
    enter: "cut",
    vo: "अब isocitrate dehydrogenase. एक CO2 निकलता है, एक NADH बनता है, और बचता है alpha-ketoglutaric acid, पाँच carbon.",
  },
  {
    id: "second",
    seconds: 6.87,
    enter: "cut",
    vo: "फिर alpha-ketoglutarate dehydrogenase. एक और CO2, एक और NADH, और बनता है succinyl CoA, चार carbon.",
  },
  {
    id: "energy",
    seconds: 11.0,
    enter: "cut",
    vo: "अब succinyl CoA synthetase. Succinyl CoA से succinic acid बनता है, और साथ में एक GTP, जो ATP में बदल जाता है। इसे substrate level phosphorylation कहते हैं।",
  },
  {
    id: "regen",
    seconds: 17.87,
    enter: "cut",
    vo: "अब OAA वापस बनाना है। Succinate dehydrogenase से fumarate बनता है, और एक FADH2. ये अकेला enzyme है जो inner mitochondrial membrane पर होता है। फिर fumarase से malate, और malate dehydrogenase से oxaloacetic acid, साथ में एक और NADH. Cycle complete!",
  },
  {
    id: "score",
    seconds: 9.71,
    enter: "iris",
    vo: "तो एक turn में: दो CO2, तीन NADH, एक FADH2 और एक ATP. एक glucose से दो pyruvate बनते हैं, इसलिए ये cycle दो बार चलता है।",
  },
  {
    id: "tip",
    seconds: 16.04,
    enter: "wipe",
    vo: "NEET tip: NCERT की equation में link reaction भी जुड़ा है। इसलिए एक pyruvate से बनते हैं three CO2, four NADH, एक FADH2 और एक ATP. और ये NADH और FADH2, electron transport system में जाकर ढेर सारा ATP बनाते हैं।",
  },
  {
    id: "cta",
    seconds: 9.08,
    enter: "iris",
    vo: "Recap: citrate, isocitrate, alpha-ketoglutarate, succinyl CoA, succinate, fumarate, malate, OAA. ये video save कर लो, NEET से पहले काम आएगी।",
  },
];
