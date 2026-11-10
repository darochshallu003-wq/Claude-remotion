import { makeExplainer } from "../explainer/Explainer";
import { SCENES } from "./scenes";
import { HAS_VOICEOVER, OUTRO_SECONDS, SCRIPT } from "./script";

// Music: the series' "science documentary" bed (public/onion/music.wav).
const explainer = makeExplainer({
  script: SCRIPT,
  scenes: SCENES,
  voDir: "krebs/vo",
  hasVoiceover: HAS_VOICEOVER,
  outroSeconds: OUTRO_SECONDS,
});

export const KrebsExplainer = explainer.Component;
export const KREBS_TOTAL_FRAMES = explainer.totalFrames;
