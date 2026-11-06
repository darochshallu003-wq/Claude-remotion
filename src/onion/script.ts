// The OnionExplainer script: one entry per scene, in order.
//
// `vo` is the Hinglish voiceover line for the scene. `seconds` is how long
// the scene lasts; until a voiceover is recorded these are estimates from
// the line length, and once it is recorded each one should be set to that
// line's audio duration (plus a short breath). Animations inside a scene
// are cued as fractions of its length, so they stay in step either way.
//
// `enter` is the transition into the scene.

import type { Beat } from "../explainer/Explainer";

// Set by scripts/vo_timing.py once public/onion/vo/<scene id>.mp3 exist.
export const HAS_VOICEOVER = true;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.15,
    enter: "fade",
    vo: "Onion काटते वक़्त आप रोते हो… पर सच ये है — आप sad नहीं हो। आप पर attack हो रहा है।",
  },
  {
    id: "weapon",
    seconds: 7.07,
    enter: "cut",
    vo: "हर प्याज़ के अंदर एक छुपा हुआ chemical weapon है। और वो तभी active होता है, जब आपका चाकू अंदर जाता है।",
  },
  {
    id: "rooms",
    seconds: 11.29,
    enter: "wipe",
    vo: "प्याज़ के हर cell में दो chemicals, अलग-अलग कमरों में बंद रहते हैं। एक तरफ़ sulfur वाले compounds… दूसरी तरफ़ एक enzyme। जब तक cell सही-सलामत है, ये दोनों कभी नहीं मिलते।",
  },
  {
    id: "knife",
    seconds: 7.23,
    enter: "cut",
    vo: "लेकिन जैसे ही चाकू चलता है… दीवारें टूटती हैं, दोनों मिल जाते हैं, और एक chemical reaction शुरू हो जाता है।",
  },
  {
    id: "twist",
    seconds: 3.42,
    enter: "iris",
    vo: "पर रुकिए… सिर्फ़ इस reaction से आँसू नहीं आते।",
  },
  {
    id: "discovery",
    seconds: 11.24,
    enter: "wipe",
    vo: "सालों तक scientists को लगा कि tear gas अपने-आप बन जाती है। फिर 2002 में, Japan की एक team ने एक दूसरा enzyme खोज निकाला — जिसका एक ही काम है: tear gas बनाना।",
  },
  {
    id: "gas",
    seconds: 9.85,
    enter: "iris",
    vo: "इस gas का नाम है — syn-propanethial-S-oxide. ये हवा में उड़कर, करीब तीस seconds में आपकी आँखों तक पहुँचती है… और वहाँ की nerves को irritate करती है।",
  },
  {
    id: "eyes",
    seconds: 10.47,
    enter: "cut",
    vo: "आँखें तुरंत alert हो जाती हैं। Tear glands आँसुओं की बाढ़ ला देती हैं, ताकि gas धुल जाए। यानी ये आँसू दुख के नहीं… ये आपकी आँखों का fire extinguisher हैं।",
  },
  {
    id: "garlic",
    seconds: 7.91,
    enter: "wipe",
    vo: "और इसका सबूत क्या है? लहसुन। लहसुन में पहला enzyme है, पर दूसरा नहीं। इसलिए smell तेज़… पर आँसू ज़ीरो।",
  },
  {
    id: "ignobel",
    seconds: 9.39,
    enter: "cut",
    vo: "ये खोज इतनी अनोखी थी कि इसे 2013 में Ig Nobel Prize मिला — ऐसी research के लिए, जो पहले हँसाती है, फिर सोचने पर मजबूर करती है।",
  },
  {
    id: "why",
    seconds: 6.68,
    enter: "iris",
    vo: "पर प्याज़ ऐसा करता क्यों है? Self-defence. जो भी जानवर इसे काटे, उसके मुँह पर सीधा tear gas।",
  },
  {
    id: "tips",
    seconds: 10.14,
    enter: "wipe",
    vo: "तो आँसुओं से बचें कैसे? प्याज़ को तीस minute fridge में रखिए। तेज़ चाकू use कीजिए। जड़ वाला हिस्सा सबसे last में काटिए। और पास में पंखा चला दीजिए।",
  },
  {
    id: "cta",
    seconds: 7.59,
    enter: "iris",
    vo: "और अगर फिर भी आँसू आएँ… तो याद रखिए, वो प्याज़ अपनी जान बचा रहा था। आपकी trick क्या है? Comment में बताइए।",
  },
];

/** Fade-to-black outro with "Thanks for watching!" after the last scene. */
export const OUTRO_SECONDS = 2.8;
