import React from "react";
import { useLooperStore } from "../store/useLooperStore";
import { TRACK_COLORS } from "./TrackControls";

export const ChannelLevels: React.FC = () => {
  const { inputLevels } = useLooperStore();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 8px",
        height: 48,
      }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "end", height: 16 }}>
        {inputLevels.map((level, i) => {
          const color = TRACK_COLORS[i]?.accent || "#fff";
          const height = Math.pow(level, 0.4) * 100;
          const isPeaking = level > 0.95;

          return (
            <div
              key={i}
              style={{
                width: 6,
                height: "100%",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: `${height}%`,
                  background: isPeaking ? "#ef4444" : color,
                  boxShadow: isPeaking
                    ? "0 0 8px #ef4444"
                    : `0 0 4px ${color}80`,
                  transition: "height 0.05s ease-out",
                }}
              />
            </div>
          );
        })}
      </div>
      <span
        style={{
          fontSize: 9,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.15)",
        }}
      >
        Monitor
      </span>
    </div>
  );
};
