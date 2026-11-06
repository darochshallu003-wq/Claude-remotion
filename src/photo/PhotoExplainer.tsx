import { makeExplainer } from "../explainer/Explainer";
import { Outro, SCENES } from "./scenes";
import { HAS_VOICEOVER, OUTRO_SECONDS, SCRIPT } from "./script";

const explainer = makeExplainer({
  script: SCRIPT,
  scenes: SCENES,
  voDir: "photo/vo",
  hasVoiceover: HAS_VOICEOVER,
  music: "photo/music.wav",
  outroSeconds: OUTRO_SECONDS,
  outro: Outro,
});

export const PhotoExplainer = explainer.Component;
export const PHOTO_TOTAL_FRAMES = explainer.totalFrames;
