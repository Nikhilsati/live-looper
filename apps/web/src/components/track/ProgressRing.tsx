import { useLooperStore } from "../../store";

export const ProgressRing = ({
  progress,
  bar,
  beat,
}: {
  progress: number;
  bar: number;
  beat: number;
}) => {
  const { sections, currentSectionIndex } = useLooperStore();
  const sectionLengthInBars = sections[currentSectionIndex]?.lengthInBars || 4;
  const totalBeats = sectionLengthInBars * 4;

  // Ticking behavior: snap the progress circle to the current beat to match the metronome
  const tickedProgress =
    totalBeats > 0 ? ((bar - 1) * 4 + (beat - 1)) / totalBeats : progress;

  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * tickedProgress;
  return (
    <div
      style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}
    >
      <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="9"
        />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.05s linear",
            filter: "drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            fontFamily: "monospace",
            color: "white",
            lineHeight: 1,
          }}
        >
          {bar}
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#a78bfa",
            fontWeight: 600,
            fontFamily: "monospace",
            marginTop: -4,
          }}
        >
          .{beat}
        </div>
      </div>
    </div>
  );
};
