import { makeExplainer } from "../explainer/Explainer";
import { SCENES } from "./scenes";
import { OUTRO_SECONDS, SCRIPT } from "./script";

const explainer = makeExplainer({
  script: SCRIPT,
  scenes: SCENES,
  voDir: "cooker/vo",
  hasVoiceover: true,
  outroSeconds: OUTRO_SECONDS,
});

export const CookerExplainer = explainer.Component;
export const COOKER_TOTAL_FRAMES = explainer.totalFrames;
