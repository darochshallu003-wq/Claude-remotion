import { makeReel } from "../reel/Reel";
import { TEACHERS } from "../reel/kit";
import { SCENES } from "./scenes";
import { OUTRO_SECONDS, SCRIPT } from "./script";
import WORDS from "./words.json";

const reel = makeReel({
  script: SCRIPT,
  scenes: SCENES,
  project: "cooker",
  words: WORDS,
  teacher: TEACHERS.female,
  outroSeconds: OUTRO_SECONDS,
});

export const CookerExplainer = reel.Component;
export const COOKER_TOTAL_FRAMES = reel.totalFrames;
