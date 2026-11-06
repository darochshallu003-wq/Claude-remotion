import type { Shot } from "../kit";

// Ep 6: Firecracker colours come from metal salts: strontium red, barium
// green, sodium yellow, copper blue, aluminium/magnesium white. Copper's
// blue emitter (CuCl) breaks down when the flame gets too hot, which is why
// a good blue is the hardest firework colour.

export const HAS_VOICEOVER = true;

export const SCRIPT: Shot[] = [
  {
    id: "hook",
    seconds: 5.43,
    enter: "fade",
    vo: "आसमान में लाल, हरा, सुनहरा… पर नीला पटाखा बहुत कम दिखता है। ऐसा क्यों?",
    tag: "PATAKHE · FIG. 01",
    setup: "Laal, hara, sunehra…",
    punch: "Neela kahan hai?",
    layout: { type: "hero", art: "anar", size: 460, glow: true },
  },
  {
    id: "metal",
    seconds: 6.73,
    enter: "wipe",
    vo: "पटाखे का रंग, बारूद से नहीं, धातु से आता है। हर धातु गर्म होकर, अपना एक ख़ास रंग छोड़ती है।",
    dark: false,
    tag: "CHEMISTRY · FIG. 02",
    setup: "Rang aata hai",
    punch: "Dhaatu se",
    layout: { type: "type", art: "anar", text: "HAR METAL KA APNA RANG. JAISE FINGERPRINT.", caption: "बारूद = धमाका, धातु = रंग" },
  },
  {
    id: "redgreen",
    seconds: 3.49,
    enter: "cut",
    vo: "लाल रंग के लिए स्ट्रॉन्शियम। और हरे के लिए बेरियम।",
    tag: "COLOURS · FIG. 03",
    setup: "Laal aur hara",
    punch: "Sr + Ba",
    layout: { type: "cards", items: [{ art: "red", title: "स्ट्रॉन्शियम", sub: "Sr · LAAL" }, { art: "green", title: "बेरियम", sub: "Ba · HARA" }] },
  },
  {
    id: "yellowwhite",
    seconds: 5.84,
    enter: "cut",
    vo: "पीला सोडियम से, वही जो नमक में होता है। और सफ़ेद चमक, एल्युमिनियम या मैग्नीशियम से।",
    tag: "COLOURS · FIG. 04",
    setup: "Peela aur safed",
    punch: "Na + Al/Mg",
    layout: { type: "cards", items: [{ art: "yellow", title: "सोडियम", sub: "Na · PEELA" }, { art: "white", title: "एल्युमिनियम", sub: "Al / Mg · SAFED" }] },
  },
  {
    id: "blue",
    seconds: 9.08,
    enter: "iris",
    vo: "और नीला, कॉपर से। पर दिक़्क़त ये है: नीला रंग देने वाला कॉपर कंपाउंड, ज़्यादा गर्मी में टूट जाता है। आग थोड़ी तेज़ हुई… और नीला ग़ायब।",
    tag: "THE PROBLEM · FIG. 05",
    setup: "Neela = copper",
    punch: "Par garmi se tootta",
    layout: { type: "vs", left: { art: "blue", title: "Sahi garmi", sub: "नीला ✓", ok: true }, right: { art: "white", title: "Zyada garmi", sub: "नीला ग़ायब", ok: false } },
  },
  {
    id: "hardest",
    seconds: 4.59,
    enter: "cut",
    vo: "इसीलिए नीला, पटाखा बनाने वालों के लिए सबसे मुश्किल रंग माना जाता है।",
    tag: "THE PROBLEM · FIG. 06",
    setup: "Isliye neela",
    punch: "Sabse mushkil",
    punchColor: "#5BA0FF",
    layout: { type: "hero", art: "blue", size: 480, stamp: "Rare!" },
  },
  {
    id: "kitchen",
    seconds: 7.14,
    enter: "wipe",
    vo: "और इसका सबूत आपकी रसोई में है: गैस की नीली लौ पर थोड़ा नमक गिरे, तो लौ पीली हो जाती है। वो सोडियम है।",
    dark: false,
    tag: "TRY AT HOME · FIG. 07",
    setup: "Saboot rasoi mein:",
    punch: "Namak = peeli lau",
    layout: { type: "vs", left: { art: "blue", title: "Gas ki lau", sub: "नीली" }, right: { art: "yellow", title: "+ Chutki namak", sub: "पीली!" }, caption: "नमक का सोडियम = पीला रंग" },
  },
  {
    id: "recap",
    seconds: 6.13,
    enter: "cut",
    vo: "तो याद रखिए: लाल स्ट्रॉन्शियम, हरा बेरियम, पीला सोडियम, और नीला, सबसे नखरे वाला, कॉपर।",
    dark: false,
    tag: "RECAP · FIG. 08",
    setup: "Cheat sheet:",
    punch: "Rang = dhaatu",
    layout: {
      type: "list",
      items: [
        { art: "red", title: "Laal · Strontium" },
        { art: "green", title: "Hara · Barium" },
        { art: "yellow", title: "Peela · Sodium" },
        { art: "blue", title: "Neela · Copper", sub: "सबसे मुश्किल" },
      ],
    },
  },
  {
    id: "cta",
    seconds: 7.04,
    enter: "iris",
    vo: "आपको कौनसा रंग सबसे अच्छा लगता है? Comment करो। और पटाखे जलाओ, तो दूरी और पानी की बाल्टी के साथ।",
    tag: "YOUR TURN · FIG. 09",
    setup: "Aapka favourite",
    punch: "Kaunsa rang?",
    layout: { type: "cta", ask: "दूरी रखो · पानी की बाल्टी पास रखो", wish: "सुरक्षित दीपावली", english: "HAPPY & SAFE DIWALI!" },
  },
];
