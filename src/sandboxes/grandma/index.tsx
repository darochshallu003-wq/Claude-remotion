// Sandbox entry: renders only src/videos/grandma (the Goodbye Money short) for test stills.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { GrandmaShort, GRANDMA_FRAMES, DadiShort, GrandmaEnShort, framesOf } from "../../videos/grandma/Grandma";

const Root: React.FC = () => (
  <>
    <Composition id="GrandmaShort" component={GrandmaShort} durationInFrames={GRANDMA_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="DadiShort" component={DadiShort} durationInFrames={framesOf("dadi")} fps={30} width={1080} height={1920} />
    <Composition id="GrandmaEnShort" component={GrandmaEnShort} durationInFrames={framesOf("grandma_en")} fps={30} width={1080} height={1920} />
  </>
);
registerRoot(Root);
