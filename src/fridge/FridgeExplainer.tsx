import { makeExplainer } from "../explainer/Explainer";
import { SCENES } from "./scenes";
import { HAS_VOICEOVER, OUTRO_SECONDS, SCRIPT } from "./script";

const explainer = makeExplainer({
  script: SCRIPT,
  scenes: SCENES,
  voDir: "fridge/vo",
  hasVoiceover: HAS_VOICEOVER,
  outroSeconds: OUTRO_SECONDS,
});

export const FridgeExplainer = explainer.Component;
export const FRIDGE_TOTAL_FRAMES = explainer.totalFrames;
