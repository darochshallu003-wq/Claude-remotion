// "उल्टे पैर" (Backward Feet): an original village horror-comedy short.
// Bhola the milkman follows footprints home on a full-moon night and forgets
// that a chudail's feet point backwards.
//
// Each line is voiced to public/ultepair/vo/<id>.mp3 by
// scripts/story_tts.py, which also writes the clip lengths to ./timing.ts.

export type Speaker = "N" | "B" | "D" | "W"; // narrator, Bhola, Dadi, witch (Kamla)

export type Line = { id: string; who: Speaker; text: string };

export type SceneDef = {
  id: string;
  /** seconds of picture before the first line starts */
  lead: number;
  /** seconds of picture after the last line ends */
  tail: number;
  lines: Line[];
};

export const STORY: SceneDef[] = [
  {
    id: "title",
    lead: 1.6,
    tail: 1.4,
    lines: [{ id: "t1", who: "N", text: "आज की कहानी... उल्टे पैर।" }],
  },
  {
    id: "fields",
    lead: 1.0,
    tail: 0.4,
    lines: [
      { id: "f1", who: "N", text: "रामपुर गाँव में एक बात मशहूर थी। पूनम की रात, इमली वाले खेत से कोई नहीं गुज़रता।" },
      { id: "f2", who: "N", text: "पर भोला दूधवाला, किसी की नहीं सुनता था।" },
      { id: "f3", who: "B", text: "अरे, भूत-वूत कुछ नहीं होता! दूध देर से पहुँचा, तो सरपंच जी मेरा भूत बना देंगे!" },
    ],
  },
  {
    id: "prints",
    lead: 0.4,
    tail: 0.6,
    lines: [
      { id: "p1", who: "N", text: "आधे रास्ते पर, भोला को मिट्टी में पैरों के निशान दिखे।" },
      { id: "p2", who: "B", text: "अरे वाह! कोई गाँव की तरफ़ गया है। इन्हीं के पीछे चलता हूँ।" },
      { id: "p3", who: "N", text: "पर भोला एक बात भूल गया था... चुड़ैल के पैर, उल्टे होते हैं।" },
    ],
  },
  {
    id: "tree",
    lead: 0.6,
    tail: 0.3,
    lines: [
      { id: "r1", who: "N", text: "निशान गाँव की तरफ़ नहीं... सीधे इमली के पेड़ की तरफ़ जा रहे थे।" },
      { id: "r2", who: "W", text: "भोला... रुक जा... भोला..." },
      { id: "r3", who: "B", text: "क-क-कौन है? रमेश, मज़ाक मत कर!" },
    ],
  },
  {
    id: "scare",
    lead: 0.5,
    tail: 0.3,
    lines: [
      { id: "s1", who: "W", text: "मुझे... वो चाहिए!" },
      { id: "s2", who: "B", text: "बचाओ! बचाओ!" },
    ],
  },
  {
    id: "chase",
    lead: 0.3,
    tail: 0.5,
    lines: [
      { id: "c1", who: "N", text: "भोला ऐसा भागा, कि उसकी चप्पल खेत में ही रह गई।" },
      { id: "c2", who: "W", text: "रुक जा भोला! मुझे बस वो चाहिए!" },
      { id: "c3", who: "B", text: "जान ले लो, पर दूध मत लेना! आज का पूरा हिसाब बाकी है!" },
    ],
  },
  {
    id: "dadi",
    lead: 0.3,
    tail: 0.4,
    lines: [
      { id: "d1", who: "N", text: "भागते-भागते भोला, सीधा दादी के आँगन में जा गिरा।" },
      { id: "d2", who: "D", text: "क्या हुआ रे? आधी रात को क्यों चिल्ला रहा है?" },
      { id: "d3", who: "B", text: "दादी! पीछे... चुड़ैल!" },
      { id: "d4", who: "D", text: "चुड़ैल? अरे... ये तो कमला है!" },
    ],
  },
  {
    id: "twist",
    lead: 0.3,
    tail: 0.5,
    lines: [
      { id: "w1", who: "D", text: "कमला! फिर से लोगों को डरा रही है?" },
      { id: "w2", who: "W", text: "माफ़ करना दादी... सौ साल से चाय नहीं पी। बस थोड़ा सा दूध माँग रही थी।" },
      { id: "w3", who: "D", text: "तो प्यार से माँग! चल बैठ, मैं चाय बनाती हूँ।" },
    ],
  },
  {
    id: "end",
    lead: 0.4,
    tail: 2.2,
    lines: [
      { id: "e1", who: "N", text: "उस रात के बाद, भोला हर पूनम, इमली के पेड़ के नीचे एक लोटा दूध रख आता है।" },
      { id: "e2", who: "N", text: "और कहते हैं... अब उस पेड़ से चाय की खुशबू आती है।" },
      { id: "e3", who: "N", text: "आपके गाँव में भी ऐसी कोई कहानी है? कमेंट में ज़रूर बताइए।" },
    ],
  },
];
