#!/usr/bin/env python3
"""Synthesize a soft, royalty-free 22s bed (warm pad chords + light pulse) as WAV. Stdlib only."""
import math
import struct
import sys
import wave

SR = 44100
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 22.0
OUT = sys.argv[1] if len(sys.argv) > 1 else "music.wav"
BPM = 96
BEAT = 60 / BPM

# Am – F – C – G, two bars each (Hz, three-note voicings)
CHORDS = [(220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (130.81, 196.0, 261.63), (196.0, 246.94, 293.66)]
BAR = 4 * BEAT


def sample(t):
    chord = CHORDS[int(t / (2 * BAR)) % len(CHORDS)]
    pad = sum(math.sin(2 * math.pi * f * t) + 0.3 * math.sin(2 * math.pi * 2 * f * t) for f in chord) / 6
    beat_t = t % BEAT
    pulse = math.sin(2 * math.pi * 55 * beat_t) * math.exp(-beat_t * 14) * 0.9
    hat_t = (t + BEAT / 2) % BEAT
    hat = (math.sin(t * 91234.5) * math.sin(t * 7773.1)) * math.exp(-hat_t * 60) * 0.12
    env = min(1, t / 1.5) * min(1, (DUR - t) / 1.5)
    return (0.55 * pad + pulse + hat) * env * 0.35


with wave.open(OUT, "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    frames = bytearray()
    for i in range(int(SR * DUR)):
        v = max(-1, min(1, sample(i / SR)))
        frames += struct.pack("<h", int(v * 32000))
    w.writeframes(bytes(frames))
print(OUT)
