#!/bin/sh
# One-command rebuild: renders the silent film, the poster (frame 0) and the subtitles.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/root/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
cd "$LIB"
node core/render/readcheck.mjs "$HERE"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video.mp4"
# silent film: no audio track; re-wrap for streaming
ffmpeg -y -loglevel error -i "$HERE/out/video.mp4" -c copy -movflags +faststart "$HERE/tsunami.mp4"
node core/render/still.mjs "$HERE" 0 --q nosub=1 --out "$HERE/out/poster"
cp "$HERE/out/poster/t_0.jpg" "$HERE/poster.jpg"
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/cues.json" "$HERE/tsunami.srt"
echo "done: $HERE/tsunami.mp4"
