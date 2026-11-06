import { Composition } from "remotion";
import { CucumberSalad, FPS, TOTAL_FRAMES } from "./CucumberSalad";
import { ONION_TOTAL_FRAMES, OnionExplainer } from "./onion/OnionExplainer";
import { HALDI_TOTAL_FRAMES, HaldiExplainer } from "./haldi/HaldiExplainer";
import { TAMRA_TOTAL_FRAMES, TamraExplainer } from "./tamra/TamraExplainer";
import { calculateStoryMetadata, STORY_FPS, StoryReel } from "./storyreel/StoryReel";
import { niceTryKiddo } from "./storyreel/stories/niceTryKiddo";

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
        id="StoryReel"
        component={StoryReel}
        defaultProps={niceTryKiddo}
        // duration = shots + outro, worked out from the props
        calculateMetadata={calculateStoryMetadata}
        durationInFrames={1}
        fps={STORY_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
