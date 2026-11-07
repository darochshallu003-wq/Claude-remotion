import { makeReel } from "../reel/Reel";
import { TEACHERS } from "../reel/kit";
import { SCENES } from "./scenes";
import { OUTRO_SECONDS, SCRIPT } from "./script";
import WORDS from "./words.json";

const reel = makeReel({
  script: SCRIPT,
  scenes: SCENES,
  project: "glass",
  words: WORDS,
  teacher: TEACHERS.male,
  outroSeconds: OUTRO_SECONDS,
});

export const GlassExplainer = reel.Component;
export const GLASS_TOTAL_FRAMES = reel.totalFrames;
