# FACTS — Dahi, under the microscope

Every claim and number on screen, with its source or how it was measured.

## The specimen

- **Image**: "Yogurt Bacteria.jpg" by Andreacise, Wikimedia Commons, CC BY 4.0
  (https://commons.wikimedia.org/wiki/File:Yogurt_Bacteria.jpg). File page wording:
  *"Yogurt bacteria observed under optical microscope at 100x magnification"*, dated 2023-11-09,
  Wiki Science Competition 2023 (Italy).
- **Copy used**: Wikimedia's 1920 × 2560 px rendition. The 3000 × 4000 original could not be
  downloaded from this build machine (Wikimedia rate limit, HTTP 429). `tools/plates.py` picks
  up `src/Yogurt_Bacteria_orig.jpg` automatically if it is placed there, and every number below
  is recomputed by `sh build.sh`.
- The specimen is **yogurt**, a dahi-type cultured milk. The film says "yogurt smear" on screen.
  It doesn't claim that this smear was taken from dahi.
- **Stain**: shown as "blue stain". The file page doesn't name the stain, so the film doesn't either.
- Nothing on the specimen is drawn, retouched or generated. Plates are the photo, downsampled,
  with one global grade: the glass is normalised to #F4F1EC, and the stain gets slight density and chroma.

## Captions (general facts)

| On screen | Basis |
|---|---|
| Rods and beads: lactic acid bacteria. | Yogurt is defined by fermentation with *Lactobacillus delbrueckii* subsp. *bulgaricus* (rod-shaped) and *Streptococcus thermophilus* (round cells in pairs and chains): Codex Alimentarius, Standard for Fermented Milks CXS 243-2003, §2.1 and Annex. Both are lactic acid bacteria. Rods and round cells are both visible in the micrograph. |
| They turn milk sugar into acid. | Lactic acid bacteria ferment lactose (milk sugar) to lactic acid: CXS 243-2003; any dairy microbiology text (e.g. Tamime & Robinson, *Yoghurt: Science and Technology*). |
| Acid sets milk protein into a gel. | As the pH falls toward casein's isoelectric point (~pH 4.6), casein micelles aggregate into a gel; that is the set of dahi/yogurt (Tamime & Robinson; Lucey, *J. Dairy Sci.* 2004, "Formation and physical properties of milk protein gels"). |

## Measurements (all computed by `tools/plates.py` from the copy used)

- **Scale (marked ≈ on screen)**: the file carries no pixel size, so it is estimated two ways:
  1. **Field stop**: the eyepiece's circular field stop was detected (radius 767.7 px). A 100×
     objective with a field-number-18 eyepiece shows a 180 µm field, giving **0.117 µm/px**.
     **This value is used.**
  2. **Cross-check from beads**: the median equivalent diameter of 483 isolated round blobs is
     5.41 px. Taking a typical coccus of 0.8 µm gives 0.148 µm/px, within ~25% of (1).
  So every µm value on screen carries "≈", and should be read as ±25%.
- **Rod**: "≈ 7 µm" is the end-to-end distance between the two hand-picked rod ends in
  `config.json` (59.6 px × 0.117 µm/px = 7.0 µm).
- **Field of view and scale bar**: frame width in px × 0.117 µm/px, with the bar picked from
  a 1-2-5 sequence.
- **"Stained share of circle 5.4%"**: within a circle 30 µm across (r = 128 px, centre in
  `assets/plates/plates.json`), a pixel is counted when its stain density
  (glass grey − pixel luminance, after the grade) is above 0.18. 2,805 of 51,473 px are counted,
  which is 5.4%. This describes this circle of this photo at this threshold, nothing more.
- **"100× objective"**: from the file page ("100x magnification"). "view N×" is the on-screen
  zoom relative to the opening frame. It is a digital zoom into the same photo, not an objective change.
