import type { Beat } from "../explainer/Explainer";

// "Surgeon wali paheli" — the classic father/son/surgeon riddle as a
// kraft-style short with the illustrated cast. `seconds` is set from the
// voiceover clips by scripts/vo_timing.py surgeon. Questions are voiced by a
// second, asking voice.
//
// Answer: the surgeon is the boy's mother (or, in a two-dad family, his
// other father). The riddle is a well-known demonstration of gender bias; a
// Boston University study is widely reported to have found only about 15%
// of people answer "mother".

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 7.35,
    enter: "fade",
    vo: "एक पहेली! एक पिता और उसका बेटा, एक भयानक car accident में फँस जाते हैं। पिता की वहीं मौत हो जाती है।",
  },
  {
    id: "hospital",
    seconds: 9.23,
    enter: "wipe",
    vo: "बेटे को तुरंत hospital ले जाया जाता है। Surgeon आता है, बच्चे को देखता है, और कहता है… मैं इसका operation नहीं कर सकता, ये मेरा बेटा है!",
  },
  {
    id: "think",
    seconds: 4.86,
    enter: "iris",
    vo: "पर पिता तो मर चुके हैं… तो ये कैसे हो सकता है? तीन second सोचिए।",
  },
  {
    id: "guesses",
    seconds: 5.99,
    enter: "cut",
    vo: "सौतेले पापा? भूत? गोद लेने वाले पापा? ज़्यादातर लोग यहीं अटक जाते हैं।",
  },
  {
    id: "reveal",
    seconds: 3.47,
    enter: "iris",
    vo: "जवाब बहुत simple है। Surgeon, बच्चे की माँ है!",
  },
  {
    id: "bias",
    seconds: 12.47,
    enter: "wipe",
    vo: "तो ये इतना मुश्किल क्यों लगा? क्योंकि surgeon सुनते ही दिमाग़ अपने आप एक आदमी की तस्वीर बना लेता है। इसे कहते हैं unconscious bias. एक study में, सिर्फ़ पंद्रह percent लोग ही सही जवाब दे पाए।",
  },
  {
    id: "twopapa",
    seconds: 4.95,
    enter: "iris",
    vo: "और हाँ, अगर बच्चे के दो पापा हों, तो surgeon उसके दूसरे पापा भी हो सकते हैं!",
  },
  {
    id: "cta",
    seconds: 6.03,
    enter: "wipe",
    vo: "आपने कितने second में solve किया? Comment में बताइए, और ये पहेली अपने दोस्तों से ज़रूर पूछिए!",
  },
];
