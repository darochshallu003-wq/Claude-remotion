import { Composition } from "remotion";
import { CucumberSalad, FPS, TOTAL_FRAMES } from "./CucumberSalad";
import { ONION_TOTAL_FRAMES, OnionExplainer } from "./onion/OnionExplainer";
import { HALDI_TOTAL_FRAMES, HaldiExplainer } from "./haldi/HaldiExplainer";
import { TAMRA_TOTAL_FRAMES, TamraExplainer } from "./tamra/TamraExplainer";
import { MITTI_TOTAL_FRAMES, MittiExplainer } from "./mitti/MittiExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CucumberSalad"
        component={CucumberSalad}
        // Graded slow-motion master from scripts/prepare_video.py
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="OnionExplainer"
        component={OnionExplainer}
        durationInFrames={ONION_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HaldiExplainer"
        component={HaldiExplainer}
        durationInFrames={HALDI_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TamraExplainer"
        component={TamraExplainer}
        durationInFrames={TAMRA_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MittiExplainer"
        component={MittiExplainer}
        durationInFrames={MITTI_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
