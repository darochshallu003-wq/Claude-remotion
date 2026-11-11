import type { Beat } from "../explainer/Explainer";

// "भाई दूज के दिन सिर्फ़ टीका?" — kraft-style short with the illustrated
// cast. `seconds` is set from the voiceover clips by scripts/vo_timing.py
// bhaidooj. Questions are voiced by a second, asking voice.
//
// Facts: Bhai Dooj falls on Kartik Shukla Dwitiya, two days after Diwali,
// and closes the five-day festival; it is also called Yama Dwitiya. In the
// best-known legend Yama visits his sister Yamuna (Yami), who welcomes him
// with tilak, aarti and a meal cooked by her; pleased, he grants that a
// brother who receives tilak from his sister on this day need not fear an
// untimely death. A second legend has Krishna visiting Subhadra after
// defeating Narakasura. In the south the day is called Bhagini Hasta
// Bhojanam ("a meal from the sister's hand"); elsewhere Bhau Beej
// (Maharashtra), Bhai Phonta (Bengal) and Bhai Tika (Nepal, a seven-colour
// tika with makhamali / globe-amaranth garlands that do not wilt quickly).
// The Bengali chant: "ভাইয়ের কপালে দিলাম ফোঁটা, যমের দুয়ারে পড়ল কাঁটা".

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 6.37,
    enter: "fade",
    vo: "भाई दूज मतलब बस टीका लगाओ, मिठाई खाओ और gift लो? सच में, बस इतना ही?",
  },
  {
    id: "naam",
    seconds: 7.67,
    enter: "cut",
    vo: "इस दिन का एक और नाम है, यम द्वितीया। दिवाली के दो दिन बाद आता है, और पाँच दिन के त्योहार का आख़िरी दिन होता है।",
  },
  {
    id: "kahani",
    seconds: 8.91,
    enter: "iris",
    vo: "कहानी कहती है, यमराज बरसों बाद अपनी बहन यमुना से मिलने पहुँचे। यमुना ने टीका लगाया, आरती उतारी, और अपने हाथ से खाना खिलाया।",
  },
  {
    id: "vardaan",
    seconds: 6.99,
    enter: "wipe",
    vo: "खुश होकर यमराज ने वरदान दिया: जो भाई इस दिन बहन से टीका करवाएगा, उसे अकाल मृत्यु का डर नहीं रहेगा।",
  },
  {
    id: "twist",
    seconds: 8.89,
    enter: "iris",
    vo: "Plot twist! इस कहानी का असली hero टीका नहीं, खाना है। दक्षिण में इस दिन को कहते हैं भगिनी हस्त भोजनम्, यानी बहन के हाथ का खाना।",
  },
  {
    id: "krishna",
    seconds: 8.19,
    enter: "wipe",
    vo: "एक और कहानी में, नरकासुर को हराकर कृष्ण अपनी बहन सुभद्रा के पास पहुँचे, और सुभद्रा ने टीके और मिठाई से उनका स्वागत किया।",
  },
  {
    id: "naksha",
    seconds: 11.58,
    enter: "iris",
    vo: "और नाम हर जगह अलग। महाराष्ट्र में भाऊबीज, बंगाल में भाई फोंटा, और नेपाल में भाई टीका, जहाँ सात रंगों का टीका लगता है और ना मुरझाने वाले मखमली फूलों की माला पहनाई जाती है।",
  },
  {
    id: "kaanta",
    seconds: 8.31,
    enter: "wipe",
    vo: "बंगाल में बहनें टीका लगाते हुए कहती हैं: भाई के माथे पर फोंटा, यम के दरवाज़े पर काँटा! यानी, भाई की लंबी उम्र की दुआ।",
  },
  {
    id: "package",
    seconds: 9.3,
    enter: "wipe",
    vo: "तो इस बार सिर्फ़ टीका मत लगवाइए। बहन के घर जाइए, जैसे यमराज गए थे, साथ बैठकर उसके हाथ का खाना खाइए, और हाँ, gift तो बनता है!",
  },
  {
    id: "cta",
    seconds: 7.02,
    enter: "iris",
    vo: "आपके घर भाई दूज पर क्या special बनता है? Comment में बताइए, और ये video अपने भाई या बहन को ज़रूर भेजिए!",
  },
];
