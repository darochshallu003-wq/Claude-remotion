import type { Beat } from "../explainer/Explainer";

// "कील चुभी तो tetanus का injection क्यों?" — kraft-style short with the
// illustrated cast. `seconds` is set from the voiceover clips by
// scripts/vo_timing.py tetanus. Questions are voiced by a second voice.
//
// Facts: tetanus is caused by Clostridium tetani, an anaerobic bacterium
// whose spores survive for years in soil, dust and animal dung. Spores get
// in through wounds — deep puncture wounds are the classic risk — and
// germinate where there is little oxygen. Rust itself does not cause
// tetanus; a rusty nail is simply usually a dirty one. The bacteria release
// tetanospasmin, one of the most potent toxins known, which travels up the
// nerves and blocks the inhibitory signals (GABA, glycine) that let muscles
// relax, causing rigidity and spasms — classically starting at the jaw
// ("lockjaw"), then neck, back and breathing muscles. The vaccine is a
// toxoid (inactivated toxin) that trains the body to make antibodies.
// Surviving tetanus does not give immunity, because the amount of toxin is
// too small to trigger one. Protection fades: Td boosters every 10 years,
// and after a dirty or deep wound if the last dose was over 5 years ago.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.61,
    enter: "fade",
    vo: "पैर में कील चुभी, और घर में सबसे पहले यही सुनाई देता है: tetanus का injection लगवा लो! पर क्यों?",
  },
  {
    id: "rust",
    seconds: 4.91,
    enter: "cut",
    vo: "ज़्यादातर लोग सोचते हैं कि ज़ंग से tetanus होता है। पर ज़ंग तो बेकसूर है!",
  },
  {
    id: "villain",
    seconds: 7.52,
    enter: "iris",
    vo: "असली villain है एक bacteria, Clostridium tetani. इसके spores मिट्टी, धूल और गोबर में सालों तक सोए पड़े रहते हैं।",
  },
  {
    id: "deep",
    seconds: 8.39,
    enter: "wipe",
    vo: "गहरी चोट लगी, तो ये spores अंदर पहुँच जाते हैं। वहाँ oxygen नहीं होती, और इन्हें ठीक यही पसंद है। Spores जाग जाते हैं।",
  },
  {
    id: "toxin",
    seconds: 6.49,
    enter: "iris",
    vo: "जागते ही ये बनाते हैं एक ज़हर, tetanospasmin. ये दुनिया के सबसे ताक़तवर ज़हरों में से एक है।",
  },
  {
    id: "nerve",
    seconds: 7.43,
    enter: "wipe",
    vo: "ये ज़हर नसों के रास्ते फैलता है, और muscles का relax वाला signal ही बंद कर देता है। Muscles खिंचती चली जाती हैं।",
  },
  {
    id: "lockjaw",
    seconds: 7.31,
    enter: "cut",
    vo: "सबसे पहले जकड़ता है जबड़ा, इसलिए इसे lockjaw भी कहते हैं। फिर गर्दन, पीठ, और साँस लेने वाली muscles।",
  },
  {
    id: "vaccine",
    seconds: 8.75,
    enter: "iris",
    vo: "तो injection करता क्या है? इसमें वही ज़हर होता है, पर बिल्कुल बेअसर। शरीर उसे पहचानना सीख लेता है, और antibodies बना लेता है।",
  },
  {
    id: "shield",
    seconds: 5.31,
    enter: "wipe",
    vo: "फिर असली ज़हर आए, तो antibodies उसे नसों तक पहुँचने से पहले ही पकड़ लेती हैं।",
  },
  {
    id: "twist",
    seconds: 7.71,
    enter: "iris",
    vo: "Plot twist! Tetanus से बच भी गए, तो भी immunity नहीं मिलती। ज़हर इतना कम होता है कि शरीर उसे याद ही नहीं रखता।",
  },
  {
    id: "booster",
    seconds: 10.33,
    enter: "wipe",
    vo: "और injection का असर हमेशा नहीं रहता। हर दस साल में booster लगवाइए। और गहरी या गंदी चोट पर, अगर आख़िरी dose पाँच साल से पुराना है, तो डॉक्टर से मिलिए।",
  },
  {
    id: "cta",
    seconds: 6.54,
    enter: "iris",
    vo: "आपको आख़िरी बार tetanus का injection कब लगा था? Comment में बताइए, और ये video घर में सबको भेजिए!",
  },
];
