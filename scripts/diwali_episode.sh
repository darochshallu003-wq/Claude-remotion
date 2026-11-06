#!/usr/bin/env bash
# Voice, time and render one Diwali-series episode.
# Usage: scripts/diwali_episode.sh <slug> <CompositionId> [--no-render]
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/vo_tts.py "diwali/$1" hi-IN-MadhurNeural +18% 0.15 </dev/null
python3 scripts/vo_timing.py "diwali/$1" 0.08
if [ "${3:-}" != "--no-render" ]; then
  mkdir -p out/diwali
  npx remotion render src/index.ts "$2" "out/diwali/$1.mp4" --browser-executable=/opt/pw-browsers/chromium --log=error
fi
