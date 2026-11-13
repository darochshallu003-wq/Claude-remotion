import type { Beat } from "../explainer/Explainer";

// "System Design · 01 — Tatkal at 10:00 AM". A story-led system-design reel:
// one everyday moment (booking a Tatkal ticket the second it opens) is used
// to walk through the four ideas that stop a flash-sale system from selling
// one seat twice. `seconds` is set from the voiceover clips by
// scripts/vo_timing.py tatkal. Questions are voiced by a second voice.
//
// Facts: AC-class Tatkal booking opens at 10:00 and non-AC at 11:00, a day
// before the journey. The numbers on screen (10 lakh users, 300 seats) are
// illustrative interview numbers, not official figures.

export const HAS_VOICEOVER = true;
export const OUTRO_SECONDS = 3.5;

export const SCRIPT: Beat[] = [
  {
    id: "hook",
    seconds: 8.63,
    enter: "fade",
    vo: "सुबह के नौ बजकर उनसठ मिनट। दस बजे AC तत्काल खुलेगा। आपकी उँगली तैयार है… और आपके साथ, दस लाख लोगों की भी।",
  },
  {
    id: "ask",
    seconds: 7.86,
    enter: "wipe",
    vo: "Interview में यही सवाल आता है। एक train, तीन सौ seats, और एक ही minute में दस लाख लोग। आप system कैसे बनाओगे?",
  },
  {
    id: "crash",
    seconds: 7.35,
    enter: "iris",
    vo: "सबको सीधा database पर भेज दिया, तो database वहीं बैठ जाएगा। लाखों requests एक साथ, और सबको timeout.",
  },
  {
    id: "queue",
    seconds: 10.07,
    enter: "wipe",
    vo: "तो पहले सबको line में लगाओ। हर user को एक token मिलता है, और अंदर उतने ही लोग जाते हैं जितने server संभाल सके। इसे कहते हैं virtual waiting room.",
  },
  {
    id: "hold",
    seconds: 13.11,
    enter: "iris",
    vo: "आप अंदर आए, seat चुनी, B4 की बत्तीस नंबर। Payment में दो मिनट लगेंगे। तब तक ये seat किसी और को क्यों नहीं मिलती? क्योंकि वो lock हो गई है, पाँच मिनट के timer के साथ। इसे कहते हैं TTL.",
  },
  {
    id: "expire",
    seconds: 6.18,
    enter: "cut",
    vo: "Payment नहीं किया? Timer ख़त्म, lock हटा, और seat वापस line में खड़े अगले इंसान के पास।",
  },
  {
    id: "race",
    seconds: 8.1,
    enter: "wipe",
    vo: "पर एक पेच है। अगर ठीक उसी millisecond पर दो लोग एक ही seat पर click कर दें तो? दोनों को लगेगा seat उनकी है।",
  },
  {
    id: "cas",
    seconds: 9.08,
    enter: "iris",
    vo: "इसलिए seat सिर्फ़ एक शर्त पर बदलती है, अगर वो अभी भी खाली है। पहला जीतता है, दूसरे को साफ़ मना। इसे कहते हैं compare-and-set.",
  },
  {
    id: "pay",
    seconds: 12.66,
    enter: "wipe",
    vo: "और payment पर network अटका, आपने घबराकर दो बार Pay दबा दिया तो? हर payment के साथ एक unique key जाती है। वही key दोबारा आई, तो पैसा दोबारा नहीं कटता। इसे कहते हैं idempotency key.",
  },
  {
    id: "recap",
    seconds: 11.41,
    enter: "iris",
    vo: "तो पूरा design: बाहर waiting room, अंदर seat पर timer वाला lock, हर seat पर compare-and-set, और payment पर idempotency key. चार परतें, और एक भी seat दो बार नहीं बिकती।",
  },
  {
    id: "cta",
    seconds: 6.85,
    enter: "wipe",
    vo: "अब system आपका है। Lock का timer दस मिनट रखोगे, या दो मिनट? Comment में जवाब दो, वजह के साथ।",
  },
];
