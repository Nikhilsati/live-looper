import React, { useRef, useState } from "react";
import { useLooperStore } from "../../store";
import { Stack, Label, Row, Button } from "@live-looper/ui";

export const BackingTrackAdvancedPanel: React.FC = () => {
  const {
    bpm,
    backingTrackDuration,
    backingTrackTrimStart = 0,
    backingTrackTrimEnd = backingTrackDuration,
    backingTrackWaveform,
    backingTrackProgress,
    isPlaying,
    updateBackingTrackSettings,
  } = useLooperStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<"start" | "end" | null>(null);

  const formatTimeFull = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00.000";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };

  React.useEffect(() => {
    if (!isDragging || !backingTrackDuration) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const seconds = pos * backingTrackDuration;

      if (isDragging === "start") {
        const newStart = Math.min(seconds, backingTrackTrimEnd - 0.05);
        updateBackingTrackSettings({ trimStart: Math.max(0, newStart) });
      } else {
        const newEnd = Math.max(seconds, backingTrackTrimStart + 0.05);
        updateBackingTrackSettings({ trimEnd: Math.min(backingTrackDuration, newEnd) });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches[0].clientX;
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const seconds = pos * backingTrackDuration;

      if (isDragging === "start") {
        const newStart = Math.min(seconds, backingTrackTrimEnd - 0.05);
        updateBackingTrackSettings({ trimStart: Math.max(0, newStart) });
      } else {
        const newEnd = Math.max(seconds, backingTrackTrimStart + 0.05);
        updateBackingTrackSettings({ trimEnd: Math.min(backingTrackDuration, newEnd) });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, backingTrackDuration, backingTrackTrimStart, backingTrackTrimEnd, updateBackingTrackSettings]);

  const handleMouseDown = (type: "start" | "end") => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleTouchStart = (type: "start" | "end") => (e: React.TouchEvent) => {
    setIsDragging(type);
  };

  return (
    <Stack
      style={{
        width: "100%",
        paddingTop: 20,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        gap: 20,
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* Visual Range Trimmer Slider */}
      <Stack style={{ gap: 8 }}>
        <Label style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Visual Range Trimmer
        </Label>
        
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: 48,
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 12,
            position: "relative",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {/* Detailed Waveform Background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              opacity: 0.25,
              pointerEvents: "none",
              height: "100%",
            }}
          >
            {(backingTrackWaveform && backingTrackWaveform.length > 0
              ? backingTrackWaveform.filter((_, i) => i % 1.5 === 0).slice(0, 130)
              : Array.from({ length: 130 }).map((_, idx) => (Math.sin(idx * 0.15) * 0.4 + 0.5) * 0.5)
            ).map((val, idx) => {
              const height = backingTrackWaveform && backingTrackWaveform.length > 0
                ? Math.max(4, val * 38) // container is 48px high
                : Math.max(4, val * 38);
              return (
                <div
                  key={idx}
                  style={{
                    width: 2.5,
                    height: `${height}px`,
                    background: "rgba(255, 255, 255, 0.4)",
                    borderRadius: 1.5,
                  }}
                />
              );
            })}
          </div>

          {/* Shaded Left Trimmed Area */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${(backingTrackTrimStart / (backingTrackDuration || 1)) * 100}%`,
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "grayscale(100%)",
              pointerEvents: "none",
            }}
          />

          {/* Highlighted Active Trim Zone */}
          <div
            style={{
              position: "absolute",
              left: `${(backingTrackTrimStart / (backingTrackDuration || 1)) * 100}%`,
              width: `${((backingTrackTrimEnd - backingTrackTrimStart) / (backingTrackDuration || 1)) * 100}%`,
              top: 0,
              bottom: 0,
              background: "linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
              borderLeft: "2px solid #6366f1",
              borderRight: "2px solid #a855f7",
              pointerEvents: "none",
            }}
          />

          {/* Shaded Right Trimmed Area */}
          <div
            style={{
              position: "absolute",
              left: `${(backingTrackTrimEnd / (backingTrackDuration || 1)) * 100}%`,
              right: 0,
              top: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "grayscale(100%)",
              pointerEvents: "none",
            }}
          />

          {/* Playhead Line */}
          {isPlaying && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${backingTrackProgress * 100}%`,
                width: 2,
                background: "#ffffff",
                boxShadow: "0 0 10px #ffffff, 0 0 5px #6366f1",
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Start Drag Handle */}
          <div
            onMouseDown={handleMouseDown("start")}
            onTouchStart={handleTouchStart("start")}
            style={{
              position: "absolute",
              left: `calc(${(backingTrackTrimStart / (backingTrackDuration || 1)) * 100}% - 8px)`,
              top: 0,
              bottom: 0,
              width: 16,
              background: "#6366f1",
              borderRadius: "4px 0 0 4px",
              cursor: "ew-resize",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
              zIndex: 15,
            }}
          >
            <div style={{ display: "flex", gap: 2 }}>
              <div style={{ width: 1.5, height: 12, background: "rgba(255, 255, 255, 0.6)" }} />
              <div style={{ width: 1.5, height: 12, background: "rgba(255, 255, 255, 0.6)" }} />
            </div>
          </div>

          {/* End Drag Handle */}
          <div
            onMouseDown={handleMouseDown("end")}
            onTouchStart={handleTouchStart("end")}
            style={{
              position: "absolute",
              left: `calc(${(backingTrackTrimEnd / (backingTrackDuration || 1)) * 100}% - 8px)`,
              top: 0,
              bottom: 0,
              width: 16,
              background: "#a855f7",
              borderRadius: "0 4px 4px 0",
              cursor: "ew-resize",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
              zIndex: 15,
            }}
          >
            <div style={{ display: "flex", gap: 2 }}>
              <div style={{ width: 1.5, height: 12, background: "rgba(255, 255, 255, 0.6)" }} />
              <div style={{ width: 1.5, height: 12, background: "rgba(255, 255, 255, 0.6)" }} />
            </div>
          </div>
        </div>
      </Stack>

      {/* Time Inputs & Metrics */}
      <Row style={{ alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        {/* Trim Start Input */}
        <Stack style={{ gap: 4, width: 150 }}>
          <Label style={{ fontSize: 10, fontWeight: 700, opacity: 0.6 }}>Trim Start</Label>
          <Row style={{ alignItems: "center", gap: 6 }}>
            <input
              type="number"
              min={0}
              max={Math.max(0, Math.floor(backingTrackTrimEnd * 1000) - 50)}
              value={Math.round(backingTrackTrimStart * 1000)}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  const newStart = Math.min(val / 1000, backingTrackTrimEnd - 0.05);
                  updateBackingTrackSettings({ trimStart: Math.max(0, newStart) });
                }
              }}
              style={{
                width: 80,
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                padding: "6px 8px",
                color: "white",
                fontFamily: "monospace",
                fontSize: 12,
                textAlign: "center",
                outline: "none",
              }}
            />
            <span style={{ fontSize: 11, opacity: 0.5 }}>ms</span>
          </Row>
          <span style={{ fontSize: 9, fontFamily: "monospace", opacity: 0.4 }}>
            {formatTimeFull(backingTrackTrimStart)}
          </span>
        </Stack>

        {/* Duration Display in Center */}
        <Stack style={{ alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#818cf8" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace" }}>
              {((backingTrackTrimEnd - backingTrackTrimStart) * 1000).toFixed(0)} ms
            </span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.5 }}>
            {((backingTrackTrimEnd - backingTrackTrimStart) * 1000 / ((60 / bpm) * 1000 * 4)).toFixed(2)} Bars (~{bpm} BPM)
          </span>
        </Stack>

        {/* Trim End Input */}
        <Stack style={{ gap: 4, width: 150, alignItems: "flex-end" }}>
          <Label style={{ fontSize: 10, fontWeight: 700, opacity: 0.6 }}>Trim End</Label>
          <Row style={{ alignItems: "center", gap: 6 }}>
            <input
              type="number"
              min={Math.floor(backingTrackTrimStart * 1000) + 50}
              max={Math.floor(backingTrackDuration * 1000)}
              value={Math.round(backingTrackTrimEnd * 1000)}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  const newEnd = Math.max(val / 1000, backingTrackTrimStart + 0.05);
                  updateBackingTrackSettings({ trimEnd: Math.min(backingTrackDuration, newEnd) });
                }
              }}
              style={{
                width: 80,
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                padding: "6px 8px",
                color: "white",
                fontFamily: "monospace",
                fontSize: 12,
                textAlign: "center",
                outline: "none",
              }}
            />
            <span style={{ fontSize: 11, opacity: 0.5 }}>ms</span>
          </Row>
          <span style={{ fontSize: 9, fontFamily: "monospace", opacity: 0.4 }}>
            {formatTimeFull(backingTrackTrimEnd)}
          </span>
        </Stack>
      </Row>

      {/* Timing adjustments (Nudge & Grid Alignment Helper) */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        {/* Nudge Buttons */}
        <Stack style={{ gap: 6 }}>
          <Label style={{ fontSize: 10, fontWeight: 700, opacity: 0.5 }}>Nudge Start Point</Label>
          <Row style={{ gap: 4 }}>
            {[-10, -1, 1, 10].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => {
                  const newStart = backingTrackTrimStart + amount / 1000;
                  const clampedStart = Math.max(0, Math.min(newStart, backingTrackTrimEnd - 0.01));
                  updateBackingTrackSettings({ trimStart: clampedStart });
                }}
                style={{
                  height: 28,
                  minWidth: 44,
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 6,
                  padding: "0 6px",
                  background: "rgba(255, 255, 255, 0.02)",
                }}
              >
                {amount > 0 ? `+${amount}` : amount}ms
              </Button>
            ))}
          </Row>
        </Stack>

        {/* Grid Presets */}
        <Stack style={{ gap: 6, alignItems: "flex-end" }}>
          <Label style={{ fontSize: 10, fontWeight: 700, opacity: 0.5 }}>Align to BPM Grid</Label>
          <Row style={{ gap: 4 }}>
            <Button
              variant="outline"
              onClick={() => {
                const beatMs = (60 / bpm) * 1000;
                const curStartMs = backingTrackTrimStart * 1000;
                const nearestBeatMs = Math.round(curStartMs / beatMs) * beatMs;
                updateBackingTrackSettings({ trimStart: Math.max(0, nearestBeatMs / 1000) });
              }}
              style={{
                height: 28,
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 6,
                padding: "0 10px",
                background: "rgba(99, 102, 241, 0.05)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                color: "#818cf8",
              }}
              title="Snap trim start to nearest metronome beat"
            >
              Snap Start to Beat
            </Button>
            
            {[1, 2, 4, 8, 16].map((bars) => {
              const beatMs = (60 / bpm) * 1000;
              const barMs = beatMs * 4;
              const targetDurationSec = (bars * barMs) / 1000;
              const isPossible = backingTrackTrimStart + targetDurationSec <= backingTrackDuration;

              return (
                <Button
                  key={bars}
                  variant="outline"
                  disabled={!isPossible}
                  onClick={() => {
                    updateBackingTrackSettings({ trimEnd: backingTrackTrimStart + targetDurationSec });
                  }}
                  style={{
                    height: 28,
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 6,
                    padding: "0 8px",
                    background: "rgba(255, 255, 255, 0.02)",
                    opacity: isPossible ? 1 : 0.3,
                  }}
                >
                  {bars} Bar{bars > 1 ? "s" : ""}
                </Button>
              );
            })}
          </Row>
        </Stack>
      </Row>
    </Stack>
  );
};
