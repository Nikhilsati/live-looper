import React, { useEffect, useRef, useState } from "react";
import { Card } from "@live-looper/ui";

interface TunerProps {
  analyser: AnalyserNode | null;
}

const NOTE_STRINGS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function getNote(frequency: number) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function getFrequency(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function autoCorrelate(buf: Float32Array, sampleRate: number) {
  let rms = 0;
  for (let i = 0; i < buf.length; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / buf.length);
  if (rms < 0.01) return -1; // Not enough signal

  let r1 = 0,
    r2 = buf.length - 1,
    thres = 0.2;
  for (let i = 0; i < buf.length / 2; i++)
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  for (let i = 1; i < buf.length / 2; i++)
    if (Math.abs(buf[buf.length - i]) < thres) {
      r2 = buf.length - i;
      break;
    }

  const newBuf = buf.slice(r1, r2);
  const size = newBuf.length;

  const c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] = c[i] + newBuf[j] * newBuf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1,
    maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;
  const x1 = c[T0 - 1],
    x2 = c[T0],
    x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export const Tuner: React.FC<TunerProps> = ({ analyser }) => {
  const [pitch, setPitch] = useState<number>(-1);
  const [note, setNote] = useState<string>("-");
  const [cents, setCents] = useState<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser) {
      setPitch(-1);
      setNote("-");
      setCents(0);
      return;
    }

    const buf = new Float32Array(2048);
    const sampleRate = analyser.context.sampleRate;

    const updatePitch = () => {
      analyser.getFloatTimeDomainData(buf);
      const freq = autoCorrelate(buf, sampleRate);

      if (freq > -1) {
        const noteNum = getNote(freq);
        const targetFreq = getFrequency(noteNum);
        const c = Math.floor(
          (1200 * Math.log(freq / targetFreq)) / Math.log(2),
        );

        setPitch(freq);
        setNote(NOTE_STRINGS[noteNum % 12]);
        setCents(c);
      } else {
        setPitch(-1);
      }
      rafRef.current = requestAnimationFrame(updatePitch);
    };

    rafRef.current = requestAnimationFrame(updatePitch);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  const isTuned = Math.abs(cents) <= 10 && pitch !== -1;

  return (
    <Card
      className="tuner-panel"
      style={{
        width: "100%",
        padding: "16px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        background: isTuned ? "rgba(16, 185, 129, 0.05)" : "var(--background)",
        border: isTuned
          ? "1px solid rgba(16, 185, 129, 0.2)"
          : "1px solid var(--border)",
        transition: "all 0.2s ease",
        flexShrink: 0,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
          }}
        >
          Chromatic Tuner
        </span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "monospace",
            color:
              pitch > -1 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
          }}
        >
          {pitch > -1 ? `${pitch.toFixed(1)} Hz` : "--- Hz"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Gauge Left */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color:
              cents < -10 && pitch !== -1 ? "#facc15" : "rgba(255,255,255,0.2)",
          }}
        >
          ♭
        </div>

        <div
          style={{
            width: 240,
            height: 6,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 3,
            position: "relative",
          }}
        >
          {/* Center Mark */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: -4,
              bottom: -4,
              width: 2,
              background: "rgba(255,255,255,0.2)",
            }}
          />
          {/* Indicator */}
          {pitch !== -1 && (
            <div
              style={{
                position: "absolute",
                left: `calc(50% + ${(Math.max(-50, Math.min(50, cents)) / 50) * 50}%)`,
                top: -4,
                bottom: -4,
                width: 4,
                marginLeft: -2,
                background: isTuned
                  ? "#10b981"
                  : cents < 0
                    ? "#facc15"
                    : "#ef4444",
                borderRadius: 2,
                boxShadow: `0 0 10px ${isTuned ? "#10b981" : cents < 0 ? "#facc15" : "#ef4444"}`,
                transition: "left 0.1s ease-out",
              }}
            />
          )}
        </div>

        {/* Gauge Right */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color:
              cents > 10 && pitch !== -1 ? "#ef4444" : "rgba(255,255,255,0.2)",
          }}
        >
          ♯
        </div>
      </div>

      <div
        style={{
          fontSize: 42,
          fontWeight: 800,
          lineHeight: 1,
          color:
            pitch === -1
              ? "rgba(255,255,255,0.1)"
              : isTuned
                ? "#10b981"
                : "white",
        }}
      >
        {pitch === -1 ? "-" : note}
      </div>
    </Card>
  );
};
