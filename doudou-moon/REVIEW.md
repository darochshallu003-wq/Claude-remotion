# Doudou and the Moon — review notes

**Film:** 1920×1080, 30 fps, 258.4 s. 14 scenes, one per paragraph of the script. The full-quality render (116 MB, CRF 16) is in `renders/` and not committed. `doudou-and-the-moon.mp4` (35 MB, CRF 22) is the committed delivery copy.

## Creative calls
- The person's script is the story, used word for word as narration. No storyline alternatives were pitched.
- Look: a cut-paper diorama at night. Flat paper layers with hard shadow copies, a seeded paper-fibre texture, and one amber accent kept for the firefly, the moon candy and the morning sun. Morning (s12) is the only warm world.
- Narration: the local Kokoro voice `af_heart` at 0.86× speed. The person picked it over HeyGen. Each sentence is generated separately and joined with fixed pauses (0.55 s; 1.3 s between the goodnights), so every action is timed to its sentence (`tools/timing.json`).
- On-screen text appears only twice: the opening title and the four closing goodnights. Everything else is spoken, never captioned.
- Seams: a dip-cut at every scene end, a colour flood from night into morning (s12), and camera moves already running across the cuts.

## Measured vs. looked at
- `hyperframes check`: 0 errors and 0 warnings (lint, runtime, layout, motion, contrast, craft, audio).
- Contact sheets looked at: every scene's start and middle, every seam, plus spot frames at 0, 3, 7, 9.5, 14, 19, 60, 75, 160–171, 200, 215, 222 and 256 s.
- Measured on the delivery file: integrated loudness -17.1 LUFS, true peak -1.2 dBFS. That is a calm level for bedtime; raise it about 2 dB for social feeds.
- **Sound was measured, not heard.** Nobody has listened to the Kokoro narration. Pronunciation of "Doudou" should be checked by ear.
- **No music bed.** HeyGen's catalog needs a sign-in, and Openverse and Hugging Face (MusicGen) are blocked by this environment's network policy. To add one, put a track at `assets/bgm/bed.mp3` and add `<audio id="bgm" class="clip" src="assets/bgm/bed.mp3" data-start="0" data-duration="258.35" data-volume="0.14" data-fade-in="2" data-fade-out="5">` to `index.html`. At 0.14 it sits under the voice.

## Weakest shots
- s11 (turning into moonlight): the ribbon of light is a plain stroke. It could carry small paper stars along it.
- s04 (firefly): Doudou is cropped at the chest. This is on purpose for the close-up, but the firefly's "talking" is only a pulse.
- Doudou faces the camera even while walking (s03, s06). In this paper-puppet style that reads fine, but a side-view rig would sell the walk better.

## How to edit
Every scene file is generated. Change `tools/build.py` (scenes) or `tools/kit.py` (drawings), then run `python3 tools/build.py`. To change the narration, edit `tools/script.json` and run `python3 tools/vo.py` and then `python3 tools/build.py`: all timings follow the new voice.

## Remotion version
The same film is also a Remotion composition, `DoudouMoon` (`src/doudou/`, registered in `src/Root.tsx`).
- `tools/build.py` writes both outputs from one source: HyperFrames scenes go to `compositions/*.html`, and Remotion scene modules go to `src/doudou/scenes/*.ts` and `src/doudou/timing.ts`.
- `src/doudou/SceneHost.tsx` mounts a scene's cut-paper SVG and builds its GSAP timeline paused. On every frame it seeks the timeline to `useCurrentFrame() / fps`, so every frame is a pure function of time and parallel rendering is safe.
- Narration and texture are in `public/doudou/`. Nunito (SIL OFL) is in `public/doudou/fonts/`.
- Rendered: `doudou-and-the-moon-remotion.mp4` (51 MB; −17.1 LUFS, −1.3 dBFS peak, level-matched to the HyperFrames cut). The narration volume is now 1.4 in source, so future renders come out at the same level without post-gain.
- Render: `npx remotion render DoudouMoon out/doudou-moon-remotion.mp4`. In this cloud container, add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`, because Remotion's own Chrome download host is blocked.
- Change from the first cut: the star twinkle in s14 now staggers `from: "edges"` instead of `"random"`, so every render matches (both versions).
