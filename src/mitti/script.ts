import type { Beat } from "../explainer/Explainer";

// "पहली बारिश की खुशबू कहाँ से आती है?" — petrichor, in the short
// nature-mystery format. `seconds` is set from the voiceover clips by
// scripts/vo_timing.py mitti. Questions are voiced by a second, asking voice.
//
// Sources: Bear & Thomas, "Nature of argillaceous odour", Nature 201, 1964
// (coined "petrichor"); geosmin from Streptomyces soil bacteria; human odour
// threshold ~5 parts per trillion; Joung & Buie, Nature Communications 6, 2015
// (MIT: raindrops on porous soil release aerosols); Becher et al., Nature
// Microbiology 5, 2020 (geosmin attracts springtails that spread Streptomyces
// spores); Kannauj "mitti attar" distilled from baked clay; geosmin gives
// beetroot its earthy taste.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.23,
    enter: "fade",
    vo: "पहली बारिश की वो खुशबू… जिसे सूँघते ही मन खुश हो जाता है। पर ये खुशबू आती कहाँ से है?",
  },
  {
    id: "not",
    seconds: 4.91,
    enter: "cut",
    vo: "मिट्टी से? बारिश से? नहीं… ये खुशबू बनाते हैं, bacteria!",
  },
  {
    id: "bacteria",
    seconds: 8.12,
    enter: "iris",
    vo: "मिट्टी में रहने वाले Streptomyces नाम के bacteria एक chemical बनाते हैं, geosmin. Greek में इसका मतलब है, धरती की खुशबू।",
  },
  {
    id: "name",
    seconds: 8.79,
    enter: "wipe",
    vo: "1964 में दो Australian scientists ने इस खुशबू को नाम दिया, petrichor. Petra यानी पत्थर, और ichor यानी देवताओं का खून।",
  },
  {
    id: "how",
    seconds: 10.35,
    enter: "iris",
    vo: "पर ये हवा में पहुँचती कैसे है? MIT के high-speed camera ने पकड़ा, बूँद सूखी मिट्टी पर गिरती है, छोटे बुलबुले बनते हैं, और फूटकर खुशबू हवा में उछाल देते हैं।",
  },
  {
    id: "nose",
    seconds: 7.23,
    enter: "wipe",
    vo: "और हमारी नाक इसके लिए superpower रखती है। एक trillion में सिर्फ़ पाँच हिस्से geosmin भी हो, तो हम सूँघ लेते हैं।",
  },
  {
    id: "twist",
    seconds: 9.63,
    enter: "iris",
    vo: "Plot twist! Bacteria ये खुशबू हमारे लिए नहीं बनाते… बल्कि springtails नाम के छोटे कीड़ों को बुलाने के लिए, जो उनके spores दूर-दूर तक फैला देते हैं।",
  },
  {
    id: "kannauj",
    seconds: 6.61,
    enter: "wipe",
    vo: "और कन्नौज में ये खुशबू सदियों से बोतल में बंद होती आई है। पकी हुई मिट्टी से बनता है, मिट्टी अत्तर।",
  },
  {
    id: "beet",
    seconds: 6.51,
    enter: "cut",
    vo: "लेकिन कुछ लोगों को यही geosmin ज़रा भी पसंद नहीं। चुकंदर का मिट्टी वाला स्वाद, इसी की वजह से है!",
  },
  {
    id: "cta",
    seconds: 6.66,
    enter: "iris",
    vo: "तो आप किस team में हो? और ये video उस दोस्त को भेजो, जो हर बारिश में कहता है, वाह, क्या खुशबू है!",
  },
];
