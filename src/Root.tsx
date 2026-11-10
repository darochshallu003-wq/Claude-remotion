import { Composition } from "remotion";
import { CucumberSalad, FPS, TOTAL_FRAMES } from "./CucumberSalad";
import { ONION_TOTAL_FRAMES, OnionExplainer } from "./onion/OnionExplainer";
import { HALDI_TOTAL_FRAMES, HaldiExplainer } from "./haldi/HaldiExplainer";
import { TAMRA_TOTAL_FRAMES, TamraExplainer } from "./tamra/TamraExplainer";
import { SHABARI_TOTAL_FRAMES, ShabariReel } from "./shabari/ShabariReel";
import { PHOTO_TOTAL_FRAMES, PhotoExplainer } from "./photo/PhotoExplainer";
import { KREBS_TOTAL_FRAMES, KrebsExplainer } from "./krebs/KrebsExplainer";
import { FRIDGE_TOTAL_FRAMES, FridgeExplainer } from "./fridge/FridgeExplainer";
import { TV_TOTAL_FRAMES, TvExplainer } from "./tv/TvExplainer";

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
        id="ShabariReel"
        component={ShabariReel}
        durationInFrames={SHABARI_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PhotoExplainer"
        component={PhotoExplainer}
        durationInFrames={PHOTO_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KrebsExplainer"
        component={KrebsExplainer}
        durationInFrames={KREBS_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FridgeExplainer"
        component={FridgeExplainer}
        durationInFrames={FRIDGE_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TvExplainer"
        component={TvExplainer}
        durationInFrames={TV_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
