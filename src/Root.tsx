import { Composition } from "remotion";
import { CucumberSalad, FPS, TOTAL_FRAMES } from "./CucumberSalad";
import { ONION_TOTAL_FRAMES, OnionExplainer } from "./onion/OnionExplainer";
import { HALDI_TOTAL_FRAMES, HaldiExplainer } from "./haldi/HaldiExplainer";
import { TAMRA_TOTAL_FRAMES, TamraExplainer } from "./tamra/TamraExplainer";
import { MITTI_TOTAL_FRAMES, MittiExplainer } from "./mitti/MittiExplainer";
import { CastSheet } from "./dev/CastSheet";
import { DAHI_TOTAL_FRAMES, DahiExplainer } from "./dahi/DahiExplainer";
import { GRANDMA_FRAMES, GrandmaShort, DadiShort, GrandmaEnShort, framesOf } from "./videos/grandma/Grandma";

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
      <Composition
        id="DahiExplainer"
        component={DahiExplainer}
        durationInFrames={DAHI_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="CastSheet" component={CastSheet} durationInFrames={1} fps={30} width={1080} height={1300} />
      {/* The Goodbye Money: cartoon-3d-short skill (three.js world, 2D cast); voice + mix are muxed after render */}
      <Composition
        id="GrandmaShort"
        component={GrandmaShort}
        durationInFrames={GRANDMA_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="DadiShort" component={DadiShort} durationInFrames={framesOf("dadi")} fps={30} width={1080} height={1920} />
      <Composition id="GrandmaEnShort" component={GrandmaEnShort} durationInFrames={framesOf("grandma_en")} fps={30} width={1080} height={1920} />
    </>
  );
};
