#!/usr/bin/env bash
# Render the V2–V5 motion cuts to mp4 (1080x1920, 30fps, h264 + AAC).
# usage: ./make_videos_v2.sh <fonts_dir> <scratch_dir> <ffmpeg> [only_name]
set -euo pipefail
FONTS=$1 SCRATCH=$2 FFMPEG=$3 ONLY=${4:-}
cd "$(dirname "$0")"
python3 motion_v2.py "$FONTS"
mkdir -p v2
python3 -c 'import json;[print(v["name"],v["seconds"]) for v in json.load(open("html/videos_v2.json"))]' |
while read -r name secs; do
  [ -n "$ONLY" ] && [ "$name" != "$ONLY" ] && continue
  frames="$SCRATCH/frames_$name"; rm -rf "$frames"; mkdir -p "$frames"
  NODE_PATH=$(npm root -g) node render_motion.js "$PWD/html/$name.html" "$frames" "$secs" 30
  python3 music.py "$SCRATCH/music_$name.wav" "$secs" >/dev/null
  "$FFMPEG" -nostdin -loglevel error -y -framerate 30 -i "$frames/f%04d.png" -i "$SCRATCH/music_$name.wav" \
    -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -shortest -movflags +faststart "v2/$name.mp4"
  echo "v2/$name.mp4"
done
