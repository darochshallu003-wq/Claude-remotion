import { makeExplainer } from "../explainer/Explainer";
import { SCENES } from "./scenes";
import { HAS_VOICEOVER, OUTRO_SECONDS, SCRIPT } from "./script";

const explainer = makeExplainer({
  script: SCRIPT,
  scenes: SCENES,
  voDir: "onion/vo",
  hasVoiceover: HAS_VOICEOVER,
  outroSeconds: OUTRO_SECONDS,
});

export const OnionExplainer = explainer.Component;
export const ONION_TOTAL_FRAMES = explainer.totalFrames;
