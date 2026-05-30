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
        padding: "24px 8px",
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
