#!/bin/sh
# One-command rebuild of the vertical (1080x1920) film: silent, poster (frame 0) and subtitles.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/root/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
cd "$LIB"
node core/render/readcheck.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --size 1080x1920 --out "$HERE/out/video.mp4"
ffmpeg -y -loglevel error -i "$HERE/out/video.mp4" -c copy -movflags +faststart "$HERE/tree-rings.mp4"
node core/render/still.mjs "$HERE" 0 --q nosub=1 --size 1080x1920 --out "$HERE/out/poster"
cp "$HERE/out/poster/t_0.jpg" "$HERE/poster.jpg"
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/cues.json" "$HERE/tree-rings.srt"
echo "done: $HERE/tree-rings.mp4"
