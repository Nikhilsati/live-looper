export const StateBadge = ({ state }: { state: "idle" | "armed" | "recording" | "playing" | "muted" | "overdubbing" }) => {
  if (state === "playing") {
    return null;
  }

  let label = "Idle";
  let bg = "#1e1e30";
  let color = "#6b6b8a";
  let dotColor = "#3a3a5c";
  let animation = "none";

  if (state === "armed") {
    label = "Armed";
    bg = "#2d1a4a";
    color = "#c084fc";
    dotColor = "#c084fc";
    animation = "armed-blink 1.1s ease-in-out infinite";
  } else if (state === "recording") {
    label = "Recording";
    bg = "#3b0f0f";
    color = "#f87171";
    dotColor = "#dc2626";
    animation = "armed-blink 0.8s ease-in-out infinite";
  } else if (state === "overdubbing") {
    label = "Overdubbing";
    bg = "#2a1a00";
    color = "#fbbf24";
    dotColor = "#d97706";
    animation = "armed-blink 0.8s ease-in-out infinite";
  } else if (state === "playing") {
    label = "Playing";
    bg = "#1e1433";
    color = "#a78bfa"
    dotColor = "#7c3aed";
  } else if (state === "muted") {
    label = "Muted";
    bg = "#1e1e30";
    color = "#4a4a6a";
    dotColor = "#3a3a5c";
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: 5,
        background: bg,
        color: color,
        animation: animation,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: dotColor,
          animation: animation,
        }}
      />
      {label}
    </div>
  );
};
