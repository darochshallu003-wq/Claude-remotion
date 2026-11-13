#!/bin/sh
# One command: plates -> picture (1920x1080, 24 fps, silent) -> poster.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/root/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
"$LIB/.venv/bin/python" "$HERE/tools/plates.py"
cd "$LIB"
node core/render/events.mjs "$HERE"
node core/render/readcheck.mjs "$HERE" || true
node core/render/video.mjs "$HERE" --fps 24 --out "$HERE/out/video.mp4"
# silent film: a silent stereo track keeps players and platforms happy
ffmpeg -y -loglevel error -i "$HERE/out/video.mp4" -f lavfi -i anullsrc=r=48000:cl=stereo -shortest \
  -c:v copy -c:a aac -b:a 64k -movflags +faststart "$HERE/dahi-microscope.mp4"
ffmpeg -y -loglevel error -i "$HERE/dahi-microscope.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
echo "done: $HERE/dahi-microscope.mp4"
