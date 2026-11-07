import type { Step } from "../reel/kit";

// "Pressure cooker में दाल इतनी जल्दी क्यों गलती है?" — a step-by-step
// whiteboard reel: a lab-coat teacher on graph paper, word-synced captions
// and numbered step headings. `seconds` and the caption word timings in
// words.json are written by scripts/reel_tts.py from the voiceover clips.
// Words wrapped in *stars* are highlighted in the captions (stars are not
// spoken).
//
// Facts: at sea level water boils at 100 °C and an open pot can't get
// hotter than that — extra heat only makes more steam. A domestic cooker's
// weight valve holds about 1 bar (15 psi) above atmosphere, ~2 atm absolute,
// where water boils at about 120 °C. Cooking reactions roughly double in
// rate per +10 °C, so ~4x faster at 120 °C. The weight on the vent lifts when
// pressure exceeds its setting — that's the whistle. Air pressure falls with
// altitude: water boils ~93 °C in Shimla (~2,200 m) and ~88 °C in Leh
// (~3,500 m), where dal barely softens without a cooker.

export const OUTRO_SECONDS = 3.2;


export const SCRIPT: Step[] = [
  {
    id: "hook",
    seconds: 9.91,
    enter: "fade",
    title: "PRESSURE |COOKER",
    vo: "पतीले में दाल गलने में *घंटा* लगता है… पर pressure cooker में बस *पंद्रह* मिनट। ऐसा क्या *जादू* है? चलिए, step by step समझते हैं।",
  },
  {
    id: "limit",
    seconds: 11.87,
    enter: "cut",
    step: 1,
    title: "THE 100° |LIMIT",
    vo: "Step one. खुले बर्तन में पानी *सौ* degree पर उबलता है। फिर आँच कितनी भी तेज़ कर दो, पानी सौ से *ऊपर* नहीं जाता। Extra गर्मी बस *भाप* बनाने में चली जाती है।",
  },
  {
    id: "lid",
    seconds: 11.51,
    enter: "cut",
    step: 2,
    title: "LOCK THE |STEAM",
    vo: "Step two. Cooker का ढक्कन भाप को *बाहर* नहीं जाने देता। अंदर pressure बढ़ता है, लगभग *दुगना*। और इतने pressure में पानी उबलता है, करीब *एक सौ बीस* degree पर।",
  },
  {
    id: "speed",
    seconds: 11.44,
    enter: "cut",
    step: 3,
    title: "+20° = |4X FAST",
    vo: "Step three. बीस degree छोटे लगते हैं, पर खाना पकना एक *chemical reaction* है। हर दस degree पर ये लगभग *दुगना* तेज़ होता है। यानी करीब *चार गुना* तेज़!",
  },
  {
    id: "whistle",
    seconds: 12.31,
    enter: "cut",
    step: 4,
    title: "THE |WHISTLE",
    vo: "Step four. और सीटी? ढक्कन पर रखा वज़न एक *safety valve* है। Pressure ज़्यादा होते ही भाप उसे *उठा* देती है, सीटी बजती है, और extra भाप *बाहर* निकल जाती है।",
  },
  {
    id: "mountain",
    seconds: 12.86,
    enter: "cut",
    step: 5,
    title: "GO |HIGHER",
    vo: "Step five, bonus! पहाड़ों पर हवा का pressure *कम* होता है। शिमला में पानी तिरानवे degree पर उबलता है, और *लेह* में सिर्फ़ *अठासी* पर। इसलिए वहाँ बिना cooker के दाल *गलती* ही नहीं।",
  },
  {
    id: "cta",
    seconds: 11.39,
    enter: "cut",
    title: "NOW YOU |KNOW",
    vo: "तो अगली बार सीटी बजे, तो याद रखना, ये *physics* की सीटी है! आपके घर में कितनी सीटी पर दाल बनती है? *Comment* में बताइए, और follow कीजिए *मिथ मिटाओ*!",
  },
];
