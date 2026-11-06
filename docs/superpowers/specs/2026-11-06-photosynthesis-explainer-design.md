# Photosynthesis explainer — design

## Intent
A vertical (1080×1920) motion-graphics explainer of photosynthesis for
Class 10 students (CBSE, NCERT Science "Life Processes"), in the
"neo-brutal UI" style of a reference ad: cream grid paper, thick black
outlines with hard shadows, punchy green/orange/yellow fills, tagged
headlines, sparkles, and an app window ("Leaf.app") whose contents tell
each beat. Hinglish voiceover; on-screen terms stay in English (exam words).

## Approaches
- **Reuse the explainer engine (chosen).** `makeExplainer` + the existing
  `vo_tts.py` / `vo_timing.py` voiceover pipeline; add a new visual kit.
- A separate engine: would duplicate scene chaining, voiceover timing and
  music ducking for no gain.

## Scenes (one voiceover clip each)
hook · define · inputs · where · stomata · absorb (step 1) · split (step 2) ·
reduce (step 3) · equation · tip (desert plants) · cta (recap + save).
Equation as NCERT writes it: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O
(sunlight, chlorophyll).

## As built
- `src/photo/kit.tsx` UI kit, `art.tsx` science drawings, `scenes.tsx`,
  `script.ts`, `PhotoExplainer.tsx`; composition `PhotoExplainer` (~107 s).
- `makeExplainer` gained an optional `outro` component (default unchanged).
- Voice: `python3 scripts/vo_tts.py photo` then `vo_timing.py photo`
  (edge-tts, hi-IN-MadhurNeural + SwaraNeural for questions).
- Music: `scripts/photo_music.py` → `public/photo/music.wav`.
