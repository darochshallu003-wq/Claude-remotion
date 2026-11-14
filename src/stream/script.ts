import type { Beat } from "../explainer/Explainer";

// "System Design · 02 — Padosi ka chhakka". Last ball of an India match:
// the neighbour shouts SIX before the ball is even bowled on your screen.
// Through that moment: how live streaming serves crores of viewers at once.
// `seconds` is set from the voiceover clips by scripts/vo_timing.py stream.
//
// Facts: live streams (HLS/DASH) are cut into short segments, typically
// 2-6 s, served from CDN edge caches; players switch between bitrate
// renditions as bandwidth changes; shorter segments lower latency but
// multiply requests (2 s vs 10 s = 5x). 3 crore viewers × 2 Mbps = 60 Tbps.
// Viewer numbers are illustrative.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 9.61,
    enter: "fade",
    vo: "आख़िरी ball, चार runs चाहिए। आप साँस रोककर देख रहे हैं… और तभी पड़ोस से आवाज़ आती है, छक्का! आपकी screen पर, ball अभी डली भी नहीं।",
  },
  {
    id: "ask",
    seconds: 7.26,
    enter: "zoom",
    vo: "उस पल आपके साथ तीन करोड़ लोग live देख रहे हैं। Interview का सवाल: ऐसा streaming system कैसे बनाओगे?",
  },
  {
    id: "crash",
    seconds: 10.23,
    enter: "whip",
    vo: "एक server से सबको video भेजो, तो हर किसी को दो Mbps चाहिए। तीन करोड़ गुणा दो, यानी साठ terabits हर second. कोई एक server ये नहीं झेल सकता।",
  },
  {
    id: "cdn",
    seconds: 11.0,
    enter: "zoom",
    vo: "इसलिए video की copies पहुँचाई जाती हैं देश भर के छोटे servers पर, आपके शहर के पास। Patna वाला Patna से देखता है, Chennai वाला Chennai से। इसे कहते हैं CDN.",
  },
  {
    id: "chunks",
    seconds: 10.57,
    enter: "whip",
    vo: "Live video को चार-चार second के टुकड़ों में काटा जाता है। आपके शहर का server हर टुकड़ा सिर्फ़ एक बार लाता है, और फिर लाखों लोगों को वही देता है। इसे कहते हैं caching.",
  },
  {
    id: "abr",
    seconds: 9.66,
    enter: "iris",
    vo: "आप train में हो, tunnel आया, network गिरा? Video रुकता नहीं, बस quality गिर जाती है, टेन-एटी पी से फ़ोर-एटी पी। इसे कहते हैं adaptive bitrate.",
  },
  {
    id: "herd",
    seconds: 10.55,
    enter: "whip",
    vo: "पर wicket गिरते ही, एक ही second में पचास लाख लोग app खोलते हैं। और उसी पल scorecard का cache expire हो गया, तो सारी requests सीधे main server पर। Server गया।",
  },
  {
    id: "coalesce",
    seconds: 10.09,
    enter: "zoom",
    vo: "Fix सीधा है। एक जैसी requests को रोक लो, main server तक सिर्फ़ एक जाए, और जवाब आते ही सबको एक साथ बाँट दो। इसे कहते हैं request coalescing.",
  },
  {
    id: "recap",
    seconds: 9.71,
    enter: "zoom",
    vo: "तो पूरा design: पास में CDN, टुकड़ों की caching, network के हिसाब से quality, और भीड़ के लिए request coalescing. तीन करोड़ लोग, और कोई buffering नहीं।",
  },
  {
    id: "cta",
    seconds: 11.39,
    enter: "iris",
    vo: "अब stream आपका है। टुकड़े दो second के रखोगे, या दस second के? छोटे टुकड़े, तो पड़ोसी से पहले छक्का दिखेगा, पर server पर पाँच गुना requests. Comment में बताओ, वजह के साथ।",
  },
];
