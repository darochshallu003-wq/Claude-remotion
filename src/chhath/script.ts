import type { Beat } from "../explainer/Explainer";

// "छठ: डूबते सूरज को भी अर्घ्य" — festive explainer in the kraft format,
// with sunset and dawn scenes. `seconds` is set from the voiceover clips by
// scripts/vo_timing.py chhath. Questions are voiced by a second voice.
//
// Content: Chhath is a four-day worship of Surya and Chhathi Maiya, rooted
// in Bihar, Jharkhand, eastern Uttar Pradesh and Nepal's Terai, and now
// celebrated wherever that diaspora lives. Day 1 Nahay-Khay (bath, then a
// simple meal of kaddu-bhaat), day 2 Kharna (gur kheer and roti in the
// evening, after which the ~36-hour nirjala fast begins), day 3 Sandhya
// Arghya to the setting sun while standing in water, day 4 Usha Arghya to
// the rising sun, which ends the fast. Offerings are carried in bamboo soop
// and daura: thekua, sugarcane, bananas, coconut and seasonal produce, with
// clay diyas. No priest is required; devotees offer arghya themselves.
// Beliefs (gratitude for the day's light) are phrased as beliefs.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 7.64,
    enter: "fade",
    vo: "पूरी दुनिया उगते सूरज को सलाम करती है… पर एक पर्व ऐसा है, जिसमें डूबते सूरज की भी पूजा होती है। कौन सा?",
  },
  {
    id: "meaning",
    seconds: 9.13,
    enter: "iris",
    vo: "छठ! सूर्य देव और छठी मैया की पूजा। बिहार, झारखंड, पूर्वी उत्तर प्रदेश और नेपाल से निकला ये पर्व, आज दुनिया भर में मनाया जाता है।",
  },
  {
    id: "days",
    seconds: 7.81,
    enter: "wipe",
    vo: "चार दिन का पर्व। पहला दिन नहाय-खाय, स्नान के बाद सादा कद्दू-भात। दूसरा दिन खरना, शाम को गुड़ की खीर और रोटी।",
  },
  {
    id: "fast",
    seconds: 6.49,
    enter: "iris",
    vo: "और खरना के बाद शुरू होता है, करीब छत्तीस घंटे का निर्जला व्रत। न खाना, न पानी की एक बूँद।",
  },
  {
    id: "soop",
    seconds: 8.29,
    enter: "wipe",
    vo: "बाँस के सूप में सजते हैं ठेकुआ, गन्ना, केला, नारियल और मौसमी फल। साथ में मिट्टी के दीये। सब कुछ सीधा प्रकृति से।",
  },
  {
    id: "sandhya",
    seconds: 7.95,
    enter: "iris",
    vo: "तीसरे दिन शाम को, व्रती पानी में खड़े होकर डूबते सूरज को अर्घ्य देते हैं। मान्यता है, ये दिन भर की रोशनी के लिए शुक्रिया है।",
  },
  {
    id: "usha",
    seconds: 7.98,
    enter: "fade",
    vo: "और चौथे दिन भोर में, उगते सूरज को अर्घ्य देकर व्रत पूरा होता है। जो डूबता है उसे भी सम्मान, और जो उगता है उसे भी।",
  },
  {
    id: "twist",
    seconds: 5.46,
    enter: "iris",
    vo: "और सबसे ख़ास बात? छठ में पंडित ज़रूरी नहीं। बस आप, पानी, और सूरज।",
  },
  {
    id: "cta",
    seconds: 6.47,
    enter: "iris",
    vo: "आपके घर में छठ कौन करता है? Comment में बताइए। आप सबको छठ पूजा की ढेर सारी शुभकामनाएँ!",
  },
];
