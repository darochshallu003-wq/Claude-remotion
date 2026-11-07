import type { Step } from "../reel/kit";

// "ठंडे गिलास पर बाहर पानी कहाँ से आता है?" — short whiteboard reel with the
// male teacher. `seconds` and words.json come from
// `python3 scripts/reel_tts.py glass hi-IN-MadhurNeural +15%`.
// Words wrapped in *stars* are highlighted in the captions.
//
// Facts: air always carries invisible water vapour; how much it can hold
// rises steeply with temperature. Air touching a cold glass cools below its
// dew point and the excess vapour condenses on the glass. Colouring the
// water doesn't colour the outside drops, so it isn't leaking. The same
// condensation drips from AC lines and forms morning dew, and humid air
// (e.g. Mumbai) gives far more of it.

export const OUTRO_SECONDS = 2.6;

export const SCRIPT: Step[] = [
  {
    id: "hook",
    seconds: 6.5,
    enter: "fade",
    title: "COLD |GLASS",
    vo: "ठंडे पानी का गिलास रखा, और बाहर *बूँदें* आ गईं! गिलास *लीक* हो रहा है? नहीं!",
  },
  {
    id: "leak",
    seconds: 7.82,
    enter: "cut",
    step: 1,
    title: "NOT A |LEAK",
    vo: "Step one. पानी में *रंग* डाल दो, फिर भी बाहर की बूँदें *साफ़* रहती हैं। ये पानी अंदर से नहीं आया।",
  },
  {
    id: "air",
    seconds: 7.96,
    enter: "cut",
    step: 2,
    title: "AIR HAS |WATER",
    vo: "Step two. हवा में हमेशा *भाप* होती है, जो दिखती नहीं। गर्म हवा *ज़्यादा* भाप पकड़ती है, ठंडी हवा *कम*।",
  },
  {
    id: "touch",
    seconds: 8.3,
    enter: "cut",
    step: 3,
    title: "COLD |TOUCH",
    vo: "Step three. गिलास को छूकर हवा *ठंडी* हो जाती है। इतनी भाप वो पकड़ नहीं पाती, और भाप बन जाती है *बूँदें*।",
  },
  {
    id: "trick",
    seconds: 8.42,
    enter: "cut",
    step: 4,
    title: "SAME |TRICK",
    vo: "Step four. यही है AC के पाइप से टपकता पानी, और सुबह घास पर *ओस*। Mumbai की उमस में बूँदें और भी *ज़्यादा*!",
  },
  {
    id: "cta",
    seconds: 6.52,
    enter: "cut",
    title: "NOW YOU |KNOW",
    vo: "तो गिलास पसीना छोड़े, तो समझ जाना, ये *हवा का पानी* है! Follow कीजिए *मिथ मिटाओ*!",
  },
];
