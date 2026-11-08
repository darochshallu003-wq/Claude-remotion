import type { Beat } from "../explainer/Explainer";

// Voiceover for RamReturn, one line per beat of the map. Generate the clips
// with `python3 scripts/vo_tts.py ramayan`, then `python3 scripts/vo_timing.py
// ramayan` writes each clip's length into `seconds`; RamReturn stretches each
// beat of the animation to fit its line. The opening question is asked by the
// second voice.
//
// Story follows the Valmiki Ramayana (Yuddha Kanda): after Ravana's fall Ram
// flies home on the Pushpaka Vimana with Sita and Lakshman, pointing out Ram
// Setu, Kishkindha, Panchavati and Chitrakoot, halts at Bharadwaj's ashram in
// Prayag, and sends Hanuman ahead to Bharat, who had ruled from Nandigram with
// Ram's padukas on the throne. Diwali marks Ayodhya lighting lamps for his
// return.

export const HAS_VOICEOVER = true;

export const SCRIPT: Beat[] = [
  {
    id: "lanka",
    seconds: 7.4,
    enter: "fade",
    vo: "चौदह साल के वनवास के बाद श्री राम अयोध्या कैसे लौटे? लंका जीती जा चुकी थी, रावण का अंत हो गया था।",
  },
  {
    id: "setu",
    seconds: 7.43,
    enter: "cut",
    vo: "राम, सीता और लक्ष्मण पुष्पक विमान में उड़े, और सबसे पहले दिखा राम सेतु, जिसे वानर सेना ने पत्थरों से बनाया था।",
  },
  {
    id: "kishkindha",
    seconds: 3.73,
    enter: "cut",
    vo: "फिर किष्किंधा, हनुमान और सुग्रीव की वानर सेना का घर।",
  },
  {
    id: "panchavati",
    seconds: 6.11,
    enter: "cut",
    vo: "उसके बाद पंचवटी। यहीं से रावण सीता को उठा ले गया था, यहीं से ये कहानी शुरू हुई थी।",
  },
  {
    id: "chitrakoot",
    seconds: 6.08,
    enter: "cut",
    vo: "चित्रकूट, जहाँ लक्ष्मण ने उनकी कुटिया बनाई थी। और फिर प्रयाग में, भरद्वाज ऋषि का आश्रम।",
  },
  {
    id: "hanuman",
    seconds: 8.1,
    enter: "cut",
    vo: "यहाँ से हनुमान आगे उड़े, नंदीग्राम में भरत को खबर देने, जो चौदह साल से राम की खड़ाऊँ सिंहासन पर रखकर राज चला रहे थे।",
  },
  {
    id: "arrive",
    seconds: 2.99,
    enter: "cut",
    vo: "और फिर, पूरे चौदह साल बाद… अयोध्या!",
  },
  {
    id: "diwali",
    seconds: 6.47,
    enter: "cut",
    vo: "पूरी नगरी ने दीये जलाकर अपने राम का स्वागत किया। और उसी रात से, हम हर साल दिवाली मनाते हैं।",
  },
  {
    id: "rajya",
    seconds: 2.05,
    enter: "cut",
    vo: "और शुरू हुआ, राम राज्य।",
  },
  {
    id: "cta",
    seconds: 3.15,
    enter: "cut",
    vo: "आप सबको शुभ दीपावली! जय श्री राम!",
  },
];
