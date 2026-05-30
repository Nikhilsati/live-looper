import type { CSSProperties } from "react";

export const LayerRow = ({
  state,
  layerCount,
  accent,
}: {
  state: "idle" | "armed" | "recording" | "playing" | "muted" | "overdubbing";
  layerCount: number;
  accent: string;
}) => {
  let label = `${layerCount} Layer${layerCount !== 1 ? "s" : ""}`;
  let labelColor = "rgba(255,255,255,0.4)";
  let waveColor = "#7c3aed";
  let isRecordingState = false;
  let isOverdubState = false;
  let opacity = 1;
  let borderStyle: CSSProperties = {};

  if (state === "recording") {
    label = "+Layer";
    labelColor = "#f87171";
    waveColor = "#dc2626";
    isRecordingState = true;
    borderStyle = { border: "0.5px solid #dc2626" };
  } else if (state === "overdubbing") {
    label = "+Layer";
    labelColor = "#d97706";
    waveColor = "#d97706";
    isOverdubState = true;
    borderStyle = { border: "0.5px solid #d97706" };
  } else if (state === "armed") {
    opacity = 0.4;
  } else if (state === "muted") {
    opacity = 0.4;
    labelColor = "#4a4a6a";
  } else if (state === "playing") {
    borderStyle = { border: "0.5px solid #7c3aed" };
  }

  // Static mockup heights for mini-wave bars
  const miniHeights = [6, 10, 8, 14, 7, 12, 9, 5, 11, 8];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
        paddingTop: 6,
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        fontSize: 11,
        color: labelColor,
        opacity: opacity,
      }}
    >
      <span style={{ fontWeight: 500, minWidth: 44 }}>{label}</span>
      <div
        style={{
          flex: 1,
          height: 24,
          background: "#1e1433",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          ...borderStyle,
        }}
      >
        {/* Sweep progress indicator for active states */}
        {(isRecordingState || isOverdubState || state === "playing") && (
          <div
            style={{
              position: "absolute",
              left: "-8%",
              height: "100%",
              width: "16%",
              background: `linear-gradient(90deg, transparent, ${isRecordingState
                ? "rgba(220,38,38,0.3)"
                : isOverdubState
                  ? "rgba(217,119,6,0.3)"
                  : "rgba(124,58,237,0.3)"
                }, transparent)`,
              animation: `sweep ${isRecordingState ? "1.4s" : isOverdubState ? "1.8s" : "2s"
                } linear infinite`,
              borderRadius: 4,
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {miniHeights.map((h, idx) => (
            <div
              key={idx}
              style={{
                width: 2,
                height: h,
                background: waveColor,
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
