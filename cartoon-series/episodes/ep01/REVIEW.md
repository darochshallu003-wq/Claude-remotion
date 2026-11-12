# Episode 1 review

- **Calls made:** picked storyline C (Fridge Gang) with Hinglish voices, so the planned silent
  slapstick became short voiced lines over the same gags. Not built: A (Mitthu Bolta Hai) and B
  (Rasoi Ke Raaz), kept in `../../STORYLINES.md`.
- **Measured:** `hyperframes check` passes with 0 errors (lint, runtime, layout, motion, contrast,
  audio). Render: 67.3 s, 1080×1920, 30 fps, h264 + aac, −16.3 LUFS integrated. The sound was
  measured, not heard.
- **Looked at:** the 16 beat frames, every seam, and the lid and end card after fixes.
- **Warnings kept:** a few `line_unread` warnings come from one empty sample splitting a bubble that
  is actually up for about 2 s; six `gsap_tween_tail` overlaps between a hop and a squash on the
  same frame, which settle back to rest; `duplicate_audio_track` where two sound effects
  overlap on purpose.
- **No music bed yet:** music needs a HeyGen sign-in for the catalog
  (`npx hyperframes auth login`). Add one at ~0.14 volume under the voices.
- **Weakest shot:** s6 (celebration) is short and plain. With more time: a high-five between Bhindi
  and Aloo, and the raisin spot flying off Tamatar.
