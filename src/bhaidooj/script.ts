import type { Beat } from "../explainer/Explainer";

// "भाई दूज के दिन सिर्फ़ टीका?" — ~35 s kraft-style short with the illustrated
// cast. `seconds` is set from the voiceover clips by scripts/vo_timing.py
// bhaidooj. Questions are voiced by a second, asking voice.
//
// The hook is a cold open: the sister's line is asked by the question
// voice, then Yamraj crashes in. No slow intro before the story.
//
// Facts: Bhai Dooj (Yama Dwitiya) falls on Kartik Shukla Dwitiya, two days
// after Diwali. In the best-known legend Yama visits his sister Yamuna
// (Yami), who welcomes him with tilak and a meal cooked by her; pleased, he
// grants that a brother who receives tilak from his sister on this day need
// not fear an untimely death. In the south the day is called Bhagini Hasta
// Bhojanam ("a meal from the sister's hand").

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.97,
    enter: "cut",
    vo: "रुको, भाई दूज पर सिर्फ़ टीका लगवाकर भाग रहे हो? इस दिन की असली कहानी… यमराज से जुड़ी है!",
  },
  {
    id: "kahani",
    seconds: 6.83,
    enter: "iris",
    vo: "बरसों बाद, यमराज अपनी बहन यमुना के घर पहुँचे। यमुना ने टीका लगाया, और अपने हाथ से खाना खिलाया।",
  },
  {
    id: "vardaan",
    seconds: 6.44,
    enter: "wipe",
    vo: "खुश होकर यमराज ने वरदान दिया: इस दिन जो भाई बहन से टीका करवाए, उसे अकाल मृत्यु का डर नहीं।",
  },
  {
    id: "twist",
    seconds: 8.24,
    enter: "iris",
    vo: "Plot twist! असली hero टीका नहीं, खाना है। दक्षिण में इस दिन को कहते हैं भगिनी हस्त भोजनम्, यानी बहन के हाथ का खाना।",
  },
  {
    id: "cta",
    seconds: 5.82,
    enter: "iris",
    vo: "तो इस बार टीके के बाद, बहन के घर खाना पक्का! ये video अपने भाई या बहन को भेजो।",
  },
];
