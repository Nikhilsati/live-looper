import React from "react";
import { useLooperStore } from "../store/useLooperStore";
import { LevelMeter } from "@live-looper/ui";
import { TRACK_COLORS } from "./track/trackColors";

export const ChannelLevels: React.FC = () => {
  const { inputLevels } = useLooperStore();

  return (
    <div
      title="Input volume level meters for all 4 tracks"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 8px",
        height: 48,
      }}
    >
      <LevelMeter
        values={inputLevels}
        vertical
        variant="continuous"
        color={TRACK_COLORS.map((c) => c.accent)}
        style={{
          height: 16,
          width: 42,
          background: "transparent",
          border: "none",
          padding: 0,
          gap: 6,
        }}
      />
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

