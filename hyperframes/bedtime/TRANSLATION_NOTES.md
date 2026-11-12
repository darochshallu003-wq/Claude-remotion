# परी और जुगनू — HyperFrames port

Ported from the Remotion composition `BedtimeStory` (`src/bedtime/`) by
`scripts/bedtime_to_hyperframes.py`. From now on, the HTML in this folder is the
source. Rerunning the script overwrites edits.

## Level: native

All 9 scenes, the captions and the end card are plain HTML/SVG with GSAP. Every
element can be edited in the HyperFrames desktop app.

| Part | File | What you can change |
| --- | --- | --- |
| Scenes `title` … `sleep` | `compositions/<id>.html` | art, positions, colours, motion timing |
| Captions (22 lines, one group per line) | `compositions/captions.html` | text, timing, style |
| End card | `compositions/outro.html` | `goodnight`, `sweetDreams`, `handle` variables |
| Voices, lullaby | `index.html` `<audio>` clips, `assets/` | volume, timing |

## What changed in translation

- **Continuous motion.** Remotion computed twinkle, bobbing, wing flaps,
  swaying, drifting and Jugnu's circling as `sin(frame)` on every frame. Here
  they are GSAP yoyo tweens with a bounded repeat count. The motion is the same,
  but each loop is at a slightly different point in its cycle at any given moment.
- **Talking mouths.** These used to follow a sine of the frame. Now the open
  mouth opens and closes about every 0.11 s for exactly the span of that
  character's line, taken from `story.json`.
- **Stars.** Remotion's seeded random positions are now positions from a seeded
  Python generator. The pattern is different but just as dense. Twinkle is done
  in three star groups instead of per star.
- **Blinks dropped.** The occasional blink of Pari and Jugnu is gone.
- **Pari's eyes in the awake scene.** Her eyes sweep left and right using a
  translate on the pupils, not the original look-vector math.
- **Lullaby fade-out.** It now uses `data-fade-out="2"`, not Remotion's volume
  ramp.
- **First frame.** The first frame is black and fades into the title over
  1 s, as in the original. `check` warns `first_frame_empty`; that fade is
  deliberate for a bedtime video.
- **Fonts.** Tiro Devanagari Hindi is shipped in `assets/fonts` (SIL OFL).
  Poppins is bundled with HyperFrames.

## Frame-by-frame comparison

`hyperframes diff ../../out/bedtime-story.mp4 . --at <29 times>` compared every
scene and both sides of each cut. The comparison passed:

- mean SSIM 0.972 (pass ≥ 0.92)
- 5th percentile 0.944 (pass ≥ 0.85)
- worst-cell 5th percentile 0.819 (pass ≥ 0.75)

The worst cells are where looping motion sits at a different point in its cycle:
Pari's waving arm and her mouth mid-word (44 s, 46 s, 69 s), and a caption
during the crossfade at 84 s.
