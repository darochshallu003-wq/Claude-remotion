"""Build the slow-motion, colour-graded master for the CucumberSalad video.

Reads public/cucumber-salad.mp4 (720x1280, 30 fps) and writes:
  public/cucumber-salad-graded.mp4  1080x1920, 30 fps, video only
  src/timeline.json                 segment map used by the Remotion comp

Slow segments (speed < 1) are motion-interpolated (minterpolate) so they
play smoothly instead of repeating frames; fast segments (speed > 1) drop
frames to tighten long or repetitive stretches. Source ranges left out of
SEGMENTS are cut. Slow-segment edges sit on the clip's scene cuts so
interpolation never blends two different shots.

Usage: python3 scripts/prepare_video.py
"""

import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "cucumber-salad.mp4"
OUT = ROOT / "public" / "cucumber-salad-graded.mp4"
TIMELINE = ROOT / "src" / "timeline.json"
FPS = 30

# (start_frame, end_frame, speed) in source frames, end exclusive.
SEGMENTS = [
    (0, 74, 1.0),  # opening preview of the finished salad
    (74, 423, 1.6),  # peeling the cucumber into ribbons (long, repetitive)
    (423, 492, 1.5),  # showing and opening the yogurt cup
    (492, 509, 0.5),  # yogurt dropping into the bowl
    (509, 537, 1.0),  # salt from the shaker
    (537, 591, 0.5),  # pepper, chilli flakes and coriander falling in
    (591, 718, 1.3),  # mixing the dressing
    (718, 762, 0.5),  # cucumber ribbons sliding into the bowl
    (762, 885, 1.3),  # mixing in the cucumber
    (885, 902, 0.5),  # sesame seeds
    # 902-923 cut: nothing happens between the sesame and the pomegranate
    (923, 957, 0.5),  # pomegranate seeds
    (957, 1091, 1.5),  # mixing with chopsticks
    (1091, 1180, 1.0),  # final hero shot
]

GRADE = ",".join(
    [
        "hqdn3d=1.2:1.2:4:4",
        "scale=1080:1920:flags=lanczos",
        "eq=contrast=1.07:saturation=1.18:gamma=0.97:brightness=0.005",
        "vibrance=intensity=0.18",
        "colorbalance=rm=0.025:gm=0.01:bm=-0.03:rh=0.015:bh=-0.015",
        "unsharp=5:5:0.55:5:5:0.0",
    ]
)


def main() -> None:
    parts = []
    timeline = []
    out_frame = 0
    for i, (start, end, speed) in enumerate(SEGMENTS):
        chain = f"[0:v]trim=start_frame={start}:end_frame={end},setpts=PTS-STARTPTS"
        if speed < 1.0:
            chain += (
                f",minterpolate=fps={FPS / speed:g}:mi_mode=mci:mc_mode=aobmc"
                f":me_mode=bidir:vsbmc=1:scd=fdiff"
                f",setpts=PTS/{speed:g},fps={FPS}"
            )
        elif speed > 1.0:
            chain += f",setpts=PTS/{speed:g},fps={FPS}"
        parts.append(chain + f"[s{i}]")
        length = round((end - start) / speed)
        timeline.append(
            {
                "srcStart": start,
                "srcEnd": end,
                "speed": speed,
                "outStart": out_frame,
                "outEnd": out_frame + length,
            }
        )
        out_frame += length

    labels = "".join(f"[s{i}]" for i in range(len(SEGMENTS)))
    graph = ";".join(parts) + f";{labels}concat=n={len(SEGMENTS)}:v=1:a=0,{GRADE}[v]"

    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y", "-i", str(SRC),
            "-filter_complex", graph, "-map", "[v]",
            "-c:v", "libx264", "-preset", "slow", "-crf", "15",
            "-pix_fmt", "yuv420p", "-r", str(FPS), str(OUT),
        ],
        check=True,
    )
    TIMELINE.write_text(
        json.dumps({"fps": FPS, "totalFrames": out_frame, "segments": timeline}, indent=2)
        + "\n"
    )
    print(f"wrote {OUT.name}: {out_frame} frames ({out_frame / FPS:.2f} s)")


if __name__ == "__main__":
    main()
