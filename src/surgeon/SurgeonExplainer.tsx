import { makeExplainer } from "../explainer/Explainer";
import { SCENES } from "./scenes";
import { HAS_VOICEOVER, OUTRO_SECONDS, SCRIPT } from "./script";

const explainer = makeExplainer({
  script: SCRIPT,
  scenes: SCENES,
  voDir: "surgeon/vo",
  hasVoiceover: HAS_VOICEOVER,
  outroSeconds: OUTRO_SECONDS,
});

export const SurgeonExplainer = explainer.Component;
export const SURGEON_TOTAL_FRAMES = explainer.totalFrames;
