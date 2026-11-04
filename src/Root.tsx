import { Composition } from "remotion";
import { CucumberSalad, FPS, TOTAL_FRAMES } from "./CucumberSalad";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CucumberSalad"
      component={CucumberSalad}
      // Graded slow-motion master from scripts/prepare_video.py
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
