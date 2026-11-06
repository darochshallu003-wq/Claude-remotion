import { Composition } from "remotion";
import { CucumberSalad, FPS, TOTAL_FRAMES } from "./CucumberSalad";
import { ONION_TOTAL_FRAMES, OnionExplainer } from "./onion/OnionExplainer";
import { HALDI_TOTAL_FRAMES, HaldiExplainer } from "./haldi/HaldiExplainer";
import { EPISODES } from "./diwali/episodes";
import { DHANTERAS_TOTAL_FRAMES, DhanterasExplainer } from "./dhanteras/DhanterasExplainer";

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
        id="DhanterasExplainer"
        component={DhanterasExplainer}
        durationInFrames={DHANTERAS_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {EPISODES.map((e) => (
        <Composition key={e.id} id={e.id} component={e.Component} durationInFrames={e.totalFrames} fps={30} width={1080} height={1920} />
      ))}
    </>
  );
};
