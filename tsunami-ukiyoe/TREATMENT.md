# How a tsunami crosses an ocean — treatment

Style: Ukiyo-e (Lemo-Opuscar `ukiyoe`). 10.0 s, 1920×1080, 24 fps. **Silent** (the brief asks for a silent film): no voice, no score, no foley. The facts arrive as printed cartouches (burned in, also exported as `.srt`).

## Facts (only these)

1. An undersea earthquake lifts the seafloor and pushes up the water above it.
2. In the deep ocean the wave is low but travels about as fast as a jet plane.
3. Near the coast it slows down and grows tall.

On-screen wording, shortened so each can be read in under 3 s (≈ letters ÷ 15 + 1.5 s):

1. "The seafloor jolts. The sea heaves up." → shortened to **"A quake heaves up the sea"**, with the picture showing the seafloor block lifting under it.
2. **"Deep sea: low, jet-fast"**, with a small jet drawn in the sky keeping pace with the swell.
3. **"Near shore: slows, grows tall"**.

## Three candidate structures

- **A. Straight handscroll.** One long scroll read right → left: quake print, open ocean, coast. Clear, but frame 0 would be the quiet quake print, a weak thumbnail.
- **B. Alternate impressions.** One key block of a single bay, reprinted three times (calm, swell, wave). Strong grammar, but it can't show the open ocean crossing, which is the point of the title.
- **C. Flash-forward, then the journey.** Open on the finished great-wave print (the thumbnail), its foam floods the sheet back to blank paper, then the story runs from the cause: quake print → a long pan across the open ocean → the wave building at the coast, ending back on the opening print, now breaking out of its border.

**Chosen: C.** Frame 0 must be the best frame; the wave is the best frame. The flash-forward is a hook (what is this, how does it get here?), the paper-wash transition is a native move (paper is the white), and the ending bookends the opening with one change: this time the wave is too big for the sheet and breaks the border.

## Logline and arc

A small bump on the seafloor becomes, an ocean later, a wave too big for its own print.
Setup: the earthquake heaves up the sea. Turn: out on the open ocean the bump is low and nearly invisible, but it races a jet. Ending: at the coast it slows, rises and curls over the fishing boats, out through the print's border.

## Benchmark

- Hiroshige's *Hundred Famous Views*: extreme foreground cropping, small figures dwarfed by nature. **Learn:** cropping, scale. **Don't take:** any composition.
- The anime *Mononoke* (2007): print texture alive in motion, flat layers sliding. **Learn:** layers that slide while the paper stays still. **Don't take:** characters, designs.
- Not *The Great Wave off Kanagawa*: our wave rises on the right and curls leftward toward a low shore with a village, no mountain, three rowing boats in front of it; the claws, crest shape and composition are our own.

## Shot list

| # | Time | Print | Framing | Camera | Why |
|---|---|---|---|---|---|
| 0 | 0.00–1.00 | "The Wave at the Shore" (flash-forward) | wide, full sheet, wave filling the right two-thirds | very slow push-in (1.00 → 1.04) | the thumbnail; foam claws twitch at 12 fps from frame 0 |
| — | 0.78–1.00 | wash | — | push continues | foam floods the sheet to blank paper (paper is the white) |
| 1 | 1.00–3.95 | "The Seafloor Jolts" (cutaway) | wide, flat horizontal strata: sky, sea bands, seabed | blocks print in, then slow push toward the bulge (1.00 → 1.12) | cause first; the bulge is the subject, the push narrows on it |
| 2 | 3.95–6.85 | "Crossing the Open Sea" (a triptych-long sheet) | wide | handscroll slide right → left across the whole sheet, accelerating, then a long even pan | the crossing; the low swell outruns a fishing boat and keeps pace with a little jet |
| 3 | 6.85–10.00 | "Near the Shore" | wide → the wave fills the frame | slow push-in + tilt up as the wave rises; at about 8.6 the crest breaks the border into the mount | slows, grows tall; the frame itself can't hold it |

Four camera moves: push-in, printing reveal + push, long handscroll pan, push + tilt past the border. Transitions: paper wash, printing reveal, handscroll slide, a hard cut on the swell's travel (match cut: it leaves S2 left, the same swell enters S3).

## Beat sheet

- 0.00 Frame 0: the finished wave print, title cartouche "How a tsunami crosses an ocean", red seal. Foam claws twitch, spray drifts, boats bob (8 fps).
- 1.15 Foam fingers spread across the sheet; 1.40 the sheet is blank paper.
- 1.40–1.80 Quake print prints in block by block (key line, blues, seabed, sky bokashi).
- 1.90 The seabed block jolts up (anticipation dip, snap, settle) along a fault; the sea's surface bulges above it, ripple bands spread. Subtitle 1 prints in at 1.55.
- 3.0–4.3 Bulge spreads into two low swells moving outward; push-in continues.
- 4.30 Scroll slide right → left through the mounting gap into the open-sea sheet. Subtitle 2 at 4.45.
- 4.5–7.1 Long pan: a low swell (barely higher than the chop) travels left faster than the camera; a fishing boat lifts gently as it passes; a small jet in grey key line crosses the pale sky at the swell's speed.
- 7.15 Cut: the coast print. Subtitle 3 at 7.25. The swell slows (it visibly decelerates), the water draws back from the shore, the wave rises and curls; foam claws build.
- 8.9 The crest breaks out of the border into the mount; boats dwarfed below.
- 9.3 Red seal stamps beside the title cartouche. 9.3–10.0 the crest hangs, foam clawing (moving, no static hold).

## Cue map

Silent film: no music. The picture still keeps a 120 bpm grid (0.5 s beats) for its cuts: cuts at 1.40 (≈ beat 3), 4.30, 7.15; seal on 9.30. Motion steps: figures and boats at 8 fps, water and foam at 12 fps, camera on ones.

## Sound design

Silent at the user's request. If a scored version is wanted later: shime-daiko heartbeat under the quake, a shakuhachi breath across the open sea, hyōshigi accelerating into the wave, absolute silence (*ma*) at the border break, one bell on the seal.

## Titles and subtitles

- View cartouche (vertical cream slip, thick + thin border, pale tab with the series title, view title in Yuji Syuku), one per print; the opening and closing prints carry the film's title.
- Subtitle = a horizontal cream cartouche with a small red seal at its left, Shippori Mincho 500, centred near the bottom, printed in with the reveal mask; ground lines and boats are kept above its ~150 px.
- The red seal is the only red in the film.

## As built

Final timings live in `main.js` (`T`, `SUBS`): cold open 0–1.0 s (wash 0.78–1.0), quake 1.0–3.95 s (jolt 1.62), scroll slide 3.95–4.45 s then the triptych pan to 6.85 s, shore 6.85–10.0 s (wave fully grown 8.7, tilt 8.35–9.35, seal 9.25). Subtitles 1.15–4.05, 4.10–6.95, 7.00–10.0 s. The beat sheet above is the plan; where it differs, `main.js` wins.
