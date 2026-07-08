import { useState } from "react";
import {
  MicrophoneIcon,
  MixerIcon,
  SettingsIcon,
} from "@live-looper/icons";
import { useLooperStore } from "../../store";
import {
  Card,
  Row,
  Button,
  Waveform,
  Stack,
  Label,
  Slider,
} from "@live-looper/ui";
import { TRACK_COLORS } from "./trackColors";

// ─── Live Track Pad ────────────────────────────────────────────────────────
export const LiveTrackPad = ({ onOpenFX }: { onOpenFX: (id: "live") => void }) => {
  const { mode, liveTrack, setLiveTrackState, isPlaying } = useLooperStore();
  const isLive = mode === "live";

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        padding: "24px 12px",
        position: "relative",
        background: isLive ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.02)",
        border: isLive
          ? `1px solid rgba(234, 179, 8, 0.4)`
          : "1px dashed rgba(234, 179, 8, 0.2)",
        boxShadow: liveTrack.isMuted
          ? "none"
          : "inset 0 0 20px rgba(234, 179, 8, 0.05)",
      }}
    >
      <Stack style={{ alignItems: "center", gap: 12 }}>
        <button
          onClick={() => setLiveTrackState({ isMuted: !liveTrack.isMuted })}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: liveTrack.isMuted
              ? "rgba(255,255,255,0.05)"
              : "rgba(234, 179, 8, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${liveTrack.isMuted ? "rgba(255,255,255,0.1)" : "rgba(234, 179, 8, 0.5)"}`,
            transition: "all 0.2s ease",
            cursor: "pointer",
            padding: 0,
            outline: "none",
          }}
          title={liveTrack.isMuted ? "Unmute Live Input" : "Mute Live Input"}
        >
          <MicrophoneIcon
            size={20}
            style={{
              color: liveTrack.isMuted ? "rgba(255,255,255,0.3)" : "#eab308",
            }}
          />
        </button>
        <Stack style={{ gap: 4, alignItems: "center" }}>
          <Label
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.05em",
              color: liveTrack.isMuted ? "rgba(255,255,255,0.4)" : "#eab308",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            LIVE
            <br />
            INPUT
          </Label>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              textAlign: "center",
            }}
          >
            {liveTrack.isMuted ? "MUTED" : isPlaying ? "MONITOR" : "IDLE"}
          </span>
        </Stack>
      </Stack>

      {/* Input / Output Gain Sliders (Vertical Side-by-Side) */}
      <Row style={{ gap: 16, width: "100%", justifyContent: "center", alignItems: "center", marginTop: 8, height: 140 }}>
        {/* IN Slider */}
        <Stack
          onDoubleClick={() => {
            setLiveTrackState({ inputGain: 1.0 });
          }}
          title="Double-click to reset input gain to 100%"
          style={{ alignItems: "center", gap: 6, height: "100%", cursor: "pointer" }}
        >
          <span style={{ fontSize: 9, opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>
            {Math.round((liveTrack.inputGain ?? 1.0) * 100)}%
          </span>
          <div style={{ height: 90, width: 20, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <Slider
              min="0"
              max="1.5"
              step="0.05"
              value={liveTrack.inputGain ?? 1.0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLiveTrackState({ inputGain: val });
              }}
              style={{
                position: "absolute",
                transform: "rotate(-90deg)",
                width: 90,
                height: 20,
                margin: 0,
                "--ui-color-primary-light": "#eab308",
              } as any}
            />
          </div>
          <Label style={{ fontSize: 9, opacity: 0.6 }}>IN</Label>
        </Stack>

        {/* OUT Slider */}
        <Stack
          onDoubleClick={() => {
            setLiveTrackState({ outputGain: 1.0 });
          }}
          title="Double-click to reset output gain to 100%"
          style={{ alignItems: "center", gap: 6, height: "100%", cursor: "pointer" }}
        >
          <span style={{ fontSize: 9, opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>
            {Math.round((liveTrack.outputGain ?? 1.0) * 100)}%
          </span>
          <div style={{ height: 90, width: 20, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <Slider
              min="0"
              max="1.5"
              step="0.05"
              value={liveTrack.outputGain ?? 1.0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLiveTrackState({ outputGain: val });
              }}
              style={{
                position: "absolute",
                transform: "rotate(-90deg)",
                width: 90,
                height: 20,
                margin: 0,
                "--ui-color-primary-light": "#eab308",
              } as any}
            />
          </div>
          <Label style={{ fontSize: 9, opacity: 0.6 }}>OUT</Label>
        </Stack>
      </Row>

      {!isLive && (
        <Stack style={{ width: "100%", marginTop: 24 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenFX("live")}
            style={{ height: 40, borderRadius: 12, width: "100%" }}
            title="Live Input Settings"
          >
            <MixerIcon size={18} />
          </Button>
        </Stack>
      )}
    </Card>
  );
};
