#!/bin/bash
# usage: scripts/cartoon/render_chunks.sh <CompId> <version>   e.g. DadiShort dadi
# Renders the composition at 1080x1920 in ~300-frame chunks (skips finished chunks), concatenates them and muxes the
# version's mix (out/grandma/audio_<version>/mix.wav) -> out/grandma/<version>_final.mp4
set -e
cd "$(dirname "$0")/../.."
COMP=$1; V=$2
TOTAL=$(python3 -c "import re,json;print(json.loads(re.search(r'= (\{.*\});',open('src/videos/grandma/warps.ts').read()).group(1))['$V']['total'])")
D=out/grandma/chunks_$V; mkdir -p $D
for ((a=0; a<TOTAL; a+=300)); do
  b=$((a+299)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  f=$D/c_$(printf %04d $a).mp4
  [ -s "$f" ] && continue
  COMP=$COMP node scripts/cartoon/render.mjs "$f.tmp.mp4" 1 "$a-$b" 2>&1 | grep -E "^done|Error" | tail -2
  mv "$f.tmp.mp4" "$f" && echo "$V chunk $a-$b ok $(date +%T)"
done
ls $D/c_*.mp4 | sed "s#^#file '$PWD/#; s#\$#'#" > $D/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $D/list.txt -c copy $D/video.mp4
ffmpeg -v error -y -i $D/video.mp4 -i out/grandma/audio_$V/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest out/grandma/${V}_final.mp4
echo "$V final ready $(date +%T)"
