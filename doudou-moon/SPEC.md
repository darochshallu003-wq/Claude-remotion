# Doudou and the Moon — SPEC

GOAL:    a child (and the parent beside them) feels the forest go quiet with Doudou and is sleepy by "Goodnight, little one".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~258 s (14 scenes; each scene = its narration + 1.4 s breath). Narrated: the voice is the clock.
         Voice: Kokoro af_heart (local), speed 0.86, 0.55 s between sentences, 1.3 s between the goodnights.

LOOK:    cut-paper diorama at night. Every shape is a flat paper layer with a hard shadow copy
         offset 0,8 px at 28% #0b1620 (no blur, no glow). Paper fibre texture over everything
         (seeded noise PNG, multiply, 45%).
         Night ground: sky #27455f, far hills #2f5570, mid #2c5c5b, near #1e3b3a, grass #36583c.
         Moon paper #f6e9bf, moonlight paper #efe2b2 at 70-85%.
         Accent amber #f4b740 — only the firefly, the moon candy and the morning sun.
         Morning ground: wall #f1dcb6, sky #bfe3ea, greens #7fae6a.
         Doudou: fur #a8693f, muzzle #f1d6ad, pyjamas #8fa9d0, slippers #d9a0ae, scarf #f3e4b0.
         Type: Nunito 800, title 92 px, end lines 64 px, ink #f6e9bf on night. Only two text moments:
         the opening title and the four goodnights (the narration carries every other word).
OBJECTS: Doudou (round brown bear, cream muzzle, blue pyjamas, reads as a teddy bear at 1/4 frame height);
         the moon (a face on a cream disc, a cookie-bite missing top-right until s07);
         bed with quilt and pillow; window onto the forest; owl, stream with stones, dew on leaves;
         firefly (amber tail); old oak with a dark hollow; moon candy (wrapped round sweet);
         moon boat (crescent hull); rabbit, squirrel, bird asleep.
MOTION:  arrivals expo.out / power4.out 0.6-1.2 s; camera power2.inOut 3-8 s; exits power3.in.
         Bedtime tempo: nothing faster than 0.4 s except a blink (0.07 s close, 0.09 s open).
         Character acting: blink every 3-4 s, idle breath 4 s per cycle, head leads, arms follow 0.12 s later.
SHOTS:   one per scene (see tools/timing.json for every sentence time). Seams: dip cut (scene ends with a
         0.5 s darken to 55%), iris from the moon, colour flood into morning, and hard cuts on moving camera.
BANNED:  dark navy void with small floating things; glow / bloom / particles as decoration; purple-blue
         gradients; text that repeats the narration (except the closing goodnights); everything fading
         and sliding up; titles that drift after landing; scenes crossfading into each other.
QA:      t=1 title + bedroom readable; moon with bite clearly a moon; firefly reads as a bug with a light;
         candy reads as a sweet; morning reads as morning; last frame holds the sleeping forest + moon.
