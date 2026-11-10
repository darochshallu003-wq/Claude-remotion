import type { Beat } from "../explainer/Explainer";

// "How does a TV screen work?" — one entry per scene. `seconds` is set from
// the voiceover clips by scripts/vo_timing.py. Questions (ending in "?") are
// voiced by a second, asking voice.
//
// Facts: pixels are made of red, green and blue subpixels whose light adds
// (R+G = yellow, R+G+B = white, all off = black); an 8-bit panel gives each
// channel 256 levels, 256^3 ≈ 1.67 crore colours; 4K UHD = 3840 × 2160 =
// 8,294,400 pixels (× 3 ≈ 2.49 crore subpixels); LCD ("LED") TVs use a
// white LED backlight, two crossed polarisers and liquid crystals that
// twist or untwist with voltage, plus a colour filter; OLED subpixels emit
// their own light and switch fully off for black; screens refresh 60+
// times a second.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 2.8;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.66,
    enter: "fade",
    vo: "TV पे करोड़ों रंग दिखते हैं… पर असल में ये सिर्फ़ तीन रंगों का खेल है। कैसे? चलो zoom करते हैं।",
  },
  {
    id: "pixels",
    seconds: 11.41,
    enter: "iris",
    vo: "TV की picture लाखों छोटे-छोटे dots से बनी होती है, जिन्हें pixels कहते हैं। और हर pixel के अंदर तीन और छोटी lights होती हैं: red, green और blue. इन्हें subpixels कहते हैं।",
  },
  {
    id: "mixing",
    seconds: 11.39,
    enter: "wipe",
    vo: "अब magic देखो। Red और green light मिलें, तो yellow दिखता है। तीनों पूरे जलें, तो white. और तीनों बंद, तो black. हर subpixel की brightness बदलकर, TV करोड़ों रंग बना लेता है।",
  },
  {
    id: "numbers",
    seconds: 12.47,
    enter: "iris",
    vo: "एक 4K TV में होते हैं 3840 गुणा 2160, यानी करीब 83 लाख pixels. और हर एक में तीन subpixels, मतलब ढाई करोड़ छोटी lights, जो एक साथ control होती हैं।",
  },
  {
    id: "lcd",
    seconds: 16.67,
    enter: "wipe",
    vo: "पर LED TV में ये lights खुद नहीं जलतीं। पीछे होती है LED backlight, जो white light देती है। उसके आगे liquid crystals होते हैं, जो voltage मिलने पर मुड़ते हैं, और दो polarizers के बीच light को रोकते या जाने देते हैं। फिर color filter से red, green और blue बनता है।",
  },
  {
    id: "oled",
    seconds: 10.79,
    enter: "iris",
    vo: "OLED TV में backlight होती ही नहीं। यहाँ हर subpixel खुद अपनी light बनाता है। Black दिखाना हो, तो pixel पूरा बंद। इसीलिए OLED का black एकदम असली black होता है।",
  },
  {
    id: "motion",
    seconds: 10.11,
    enter: "wipe",
    vo: "और picture हिलती कैसे है? Screen एक second में साठ या उससे ज़्यादा बार नई picture बनाती है। हमारी आँखें इन तेज़ frames को जोड़कर smooth motion देखती हैं।",
  },
  {
    id: "tryit",
    seconds: 11.77,
    enter: "iris",
    vo: "खुद देखना है? Phone की screen पर पानी की एक छोटी सी बूँद डालो। वो magnifying glass बन जाएगी, और आपको red, green, blue subpixels दिख जाएँगे। बाद में screen साफ़ कर देना।",
  },
  {
    id: "cta",
    seconds: 4.07,
    enter: "iris",
    vo: "आपके घर में LED TV है या OLED? Comment में बताइए।",
  },
];
