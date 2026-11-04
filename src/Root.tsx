import { Composition } from "remotion";
import { CucumberSalad, FPS } from "./CucumberSalad";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CucumberSalad"
      component={CucumberSalad}
      // Source clip: 720x1280, 30 fps, 39.33 s
      durationInFrames={Math.floor(39.33 * FPS)}
      fps={FPS}
      width={720}
      height={1280}
    />
  );
};
