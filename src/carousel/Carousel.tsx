import React from "react";
import { Composition, Series } from "remotion";
import { SLIDES } from "./slides";
import { CTA_FRAMES, FPS, H, SLIDE_FRAMES, W } from "./theme";

// "Give Claude one topic. Get a finished reel." — a 9-slide animated
// Instagram carousel (4:5). Each slide renders as its own MP4 for the
// carousel post; ClaudeCarouselReel chains them into one video.

const lengthOf = (i: number) => (i === SLIDES.length - 1 ? CTA_FRAMES : SLIDE_FRAMES);
const REEL_FRAMES = SLIDES.reduce((sum, _, i) => sum + lengthOf(i), 0);

const Reel: React.FC = () => (
  <Series>
    {SLIDES.map((S, i) => (
      <Series.Sequence key={i} durationInFrames={lengthOf(i)}>
        <S />
      </Series.Sequence>
    ))}
  </Series>
);

export const CarouselCompositions: React.FC = () => (
  <>
    {SLIDES.map((S, i) => (
      <Composition
        key={i}
        id={`ClaudeCarousel${String(i + 1).padStart(2, "0")}`}
        component={S}
        durationInFrames={lengthOf(i)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
    <Composition id="ClaudeCarouselReel" component={Reel} durationInFrames={REEL_FRAMES} fps={FPS} width={W} height={H} />
  </>
);
