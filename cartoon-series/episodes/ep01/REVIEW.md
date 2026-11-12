# Episode 1 review

- **Audience:** YouTube Kids. The first cut ended with Mummy ordering pizza (the veg "won" by
  avoiding being eaten) and a "follow karo, warna…" call to action under the @mythmitao handle.
  Now Mummy finds the raisin, everyone is fresh, and tonight is mix veg; the gang decides being
  together in one dish makes them superstars. The end card teases Episode 2 with no handle and no
  pressure line.
- **Formats:** one script, two builds: `wide/` (1920×1080) and the vertical root project (1080×1920).
- **Measured:** `hyperframes check` passes with 0 errors in both. Renders: 77.1 s, 30 fps, h264 +
  aac, −16.5 LUFS integrated, true peak −1.1 dBFS. The sound was measured, not heard.
- **Looked at:** the beat frames of both formats, the raisin pluck, the new s6 and both end cards.
- **Warnings kept:** a few `line_unread` warnings come from one empty sample splitting a bubble that
  is on screen for about 2 s; `gsap_tween_tail` where a hop and a squash overlap (they settle to rest);
  `duplicate_audio_track` where sound effects overlap on purpose.
- **No music bed yet:** needs a HeyGen sign-in for the catalog (`npx hyperframes auth login`).
- **Weakest spots:** in wide, the "TEAM FRIDGE GANG!" bubble sits over Tamatar mid-hop; the raisin
  is plucked off rather than seen travelling in the hand.
