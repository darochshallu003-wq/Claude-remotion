import { makeExplainer } from "../explainer/Explainer";
import { SCENES } from "./scenes";
import { HAS_VOICEOVER, OUTRO_SECONDS, SCRIPT } from "./script";

const explainer = makeExplainer({
  script: SCRIPT,
  scenes: SCENES,
  voDir: "tv/vo",
  hasVoiceover: HAS_VOICEOVER,
  outroSeconds: OUTRO_SECONDS,
});

export const TvExplainer = explainer.Component;
export const TV_TOTAL_FRAMES = explainer.totalFrames;
