import { CloudArrowDownIcon } from "@phosphor-icons/react";
import {
  PlayIcon,
  StopIcon,
  MetronomeIcon,
  MicrophoneIcon,
  RecordIcon,
  PauseIcon,
  HeadphonesIcon,
  MixerIcon,
  WaveformIcon,
  LoopIcon,
  UndoIcon,
  EraserIcon,
  CaretRightIcon,
  XIcon,
  LayersIcon,
  ActivityIcon,
  DebugIcon,
  SettingsIcon,
  SaveIcon,
} from "@live-looper/icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { audioEngine } from "@live-looper/audio-engine";
import { useLooperStore } from "../store/useLooperStore";
import { useSessionStore } from "../store/useSessionStore";
import {
  Card,
  Stack,
  Row,
  Button,
  ButtonGroup,
  Label,
  ValueText,
  Badge,
  Heading,
  Grid,
  Switch,
  Waveform,
  Modal,
} from "@live-looper/ui";
import { TrackFX } from "./TrackFX";
import { LatencyMonitor } from "./LatencyMonitor";
import { db } from "@live-looper/storage";
import { SessionManager } from "./SessionManager";
import { InputChannelSelector } from "./InputChannelSelector";
import { ChannelLevels } from "./ChannelLevels";
import type { LayerRecord } from "@live-looper/types";

const ICON_SIZE = 22;
const MAX_LAYER_INDICATOR_BARS = 4;
const ERASE_HOLD_MS = 600;

// ─── Per-Track Color Palette ──────────────────────────────────────────────────
// Each track gets a distinct hue so your eyes can find it in < 100ms.
export const TRACK_COLORS = [
  // Track 0 — Violet (purple)
  {
    idle: "rgba(124, 58, 237, 0.10)",
    haudio: "rgba(124, 58, 237, 0.15)",
    border: "#7c3aed",
    borderHasAudio: "#a78bfa",
    glow: "glow-violet",
    accent: "#a78bfa",
    progressFill: "rgba(167, 139, 250, 0.08)",
  },
  // Track 1 — Cyan (teal)
  {
    idle: "rgba(8, 145, 178, 0.10)",
    haudio: "rgba(8, 145, 178, 0.15)",
    border: "#0891b2",
    borderHasAudio: "#22d3ee",
    glow: "glow-cyan",
    accent: "#22d3ee",
    progressFill: "rgba(34, 211, 238, 0.08)",
  },
  // Track 2 — Amber (warm)
  {
    idle: "rgba(217, 119, 6, 0.10)",
    haudio: "rgba(217, 119, 6, 0.15)",
    border: "#d97706",
    borderHasAudio: "#fbbf24",
    glow: "glow-amber",
    accent: "#fbbf24",
    progressFill: "rgba(251, 191, 36, 0.08)",
  },
  // Track 3 — Rose (red-pink)
  {
    idle: "rgba(225, 29, 72, 0.10)",
    haudio: "rgba(225, 29, 72, 0.15)",
    border: "#e11d48",
    borderHasAudio: "#fb7185",
    glow: "glow-rose",
    accent: "#fb7185",
    progressFill: "rgba(251, 113, 133, 0.08)",
  },
] as const;

// ─── Layer Indicator (clickable toggle) ──────────────────────────────────────
const LayerIndicator = ({
  count,
  accent,
  onClick,
}: {
  count: number;
  accent: string;
  onClick: () => void;
}) => {
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      title={`View ${count} layer${count !== 1 ? "s" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        gap: 3,
        alignItems: "center",
        padding: "5px 3px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 4,
        border: `1px solid ${accent}40`,
        marginLeft: 4,
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = `${accent}18`;
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}80`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
      }}
    >
      {Array.from({ length: MAX_LAYER_INDICATOR_BARS }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 2.5,
            borderRadius: 1,
            background: i <= count - 1 ? accent : "rgba(255,255,255,0.12)",
            boxShadow: i <= count - 1 ? `0 0 8px ${accent}80` : "none",
            transition: "all 0.2s ease",
          }}
        />
      ))}
      {count > MAX_LAYER_INDICATOR_BARS && (
        <span
          style={{ fontSize: 9, color: accent, fontWeight: 900, marginTop: -2 }}
        >
          +
        </span>
      )}
    </button>
  );
};

// ─── Layers Drawer (inline, expands at the bottom of the track card) ──────────
interface LayerEntry {
  record: LayerRecord;
  waveform: number[];
}

const MiniWaveform = ({ data, accent }: { data: number[]; accent: string }) => {
  if (!data.length)
    return (
      <div
        style={{
          height: 32,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 6,
        }}
      />
    );
  const max = Math.max(...data, 0.01);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        height: 32,
        flex: 1,
      }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(6, (v / max) * 100)}%`,
            background: accent,
            opacity: 0.5 + (v / max) * 0.5,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
};

export const LayersDrawer = ({
  trackId,
  accent,
  onClose,
}: {
  trackId: number;
  accent: string;
  onClose: () => void;
}) => {
  const { currentProject, sections, currentSectionIndex } = useLooperStore();
  const [layers, setLayers] = useState<LayerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionName = sections[currentSectionIndex]?.name ?? "Section";

  const loadLayers = useCallback(async () => {
    if (!currentProject?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const trackRecord = await db.tracks
        .where({ projectId: currentProject.id })
        .filter((t: any) => t.order === trackId)
        .first();
      if (!trackRecord) {
        setLoading(false);
        return;
      }

      const sectionRecord = await db.sections
        .where({ projectId: currentProject.id })
        .filter((s: any) => s.order === currentSectionIndex)
        .first();
      if (!sectionRecord) {
        setLoading(false);
        return;
      }

      const rawLayers = await db.layers
        .where({
          projectId: currentProject.id,
          trackId: trackRecord.id,
          sectionId: sectionRecord.id,
        })
        .filter((l: any) => !l.deletedAt)
        .sortBy("order");

      const ctx: BaseAudioContext = audioEngine.context ?? new AudioContext();
      const entries: LayerEntry[] = await Promise.all(
        rawLayers.map(async (layer): Promise<LayerEntry> => {
          try {
            const blobRecord = await db.audioBlobs.get(layer.audioBlobId);
            if (!blobRecord) return { record: layer, waveform: [] };
            const ab = await blobRecord.blob.arrayBuffer();
            const decoded = await ctx.decodeAudioData(ab);
            const raw = decoded.getChannelData(0);
            const points = 60;
            const step = Math.max(1, Math.floor(raw.length / points));
            const waveform: number[] = [];
            for (let p = 0; p < points; p++) {
              const start = p * step;
              let sum = 0;
              for (let s = start; s < start + step && s < raw.length; s++)
                sum += raw[s] * raw[s];
              waveform.push(Math.sqrt(sum / step));
            }
            return { record: layer, waveform };
          } catch {
            return { record: layer, waveform: [] };
          }
        }),
      );
      setLayers(entries);
    } catch (e) {
      console.error("LayersDrawer: error loading layers", e);
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id, trackId, currentSectionIndex]);

  useEffect(() => {
    loadLayers();
  }, [loadLayers]);

  return (
    <div
      style={{
        marginTop: 4,
        borderTop: `1px solid ${accent}25`,
        paddingTop: 10,
        animation: "fadeIn 0.18s ease",
      }}
    >
      {/* Drawer header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <LayersIcon size={14} style={{ color: accent }} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: accent,
              textTransform: "uppercase",
            }}
          >
            {loading
              ? "Loading…"
              : `${layers.length} Layer${layers.length !== 1 ? "s" : ""}`}
          </span>
          <span
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.25)",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            · {sectionName}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.3)",
            cursor: "pointer",
            padding: 4,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
          }
          title="Collapse layers"
        >
          <XIcon size={14} />
        </button>
      </div>

      {/* Layer rows — newest on top */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {loading ? (
          <div
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.25)",
              fontSize: 11,
            }}
          >
            Decoding audio…
          </div>
        ) : layers.length === 0 ? (
          <div
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.25)",
              fontSize: 11,
              gap: 6,
            }}
          >
            <LayersIcon size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
            No layers
          </div>
        ) : (
          [...layers].reverse().map((entry, revIdx) => {
            const layerNum = layers.length - revIdx;
            return (
              <div
                key={entry.record.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                }}
              >
                {/* Layer number badge */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                  }}
                >
                  {layerNum}
                </div>

                {/* Waveform */}
                <MiniWaveform data={entry.waveform} accent={accent} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─── Track Behavior State Badge ────────────────────────────────────────────────
const StateBadge = ({ state }: { state: "idle" | "armed" | "recording" | "playing" | "muted" | "overdubbing" }) => {
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
    color = "#a78bfa";
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

// ─── Track Behavior Layer Row Summary ──────────────────────────────────────────
const LayerRow = ({
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
  let borderStyle: React.CSSProperties = {};

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

// ─── Track Pad ─────────────────────────────────────────────────────────────────
export const TrackPad = ({
  trackId,
  onOpenFX,
}: {
  trackId: number;
  onOpenFX: (id: number) => void;
}) => {
  const {
    tracks,
    sectionProgress,
    bpm,
    sections,
    currentSectionIndex,
    isPlaying,
    lastHitOffset,
    mode,
    toggleTrackRecording,
    setSolo,
    showLayers,
    setShowLayers,
  } = useLooperStore();
  const track = tracks[trackId];
  const isLive = mode === "live";
  const [showHit, setShowHit] = useState(false);
  const [eraseProgress, setEraseProgress] = useState(0); // 0–1 for hold progress
  const eraseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eraseAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const palette = TRACK_COLORS[trackId] ?? TRACK_COLORS[0];

  const prevIsArmed = useRef(track.isArmed);

  useEffect(() => {
    if (track.isArmed && !prevIsArmed.current) {
      setShowHit(true);
      const timer = setTimeout(() => setShowHit(false), 2000);
      return () => clearTimeout(timer);
    }
    prevIsArmed.current = track.isArmed;
  }, [track.isArmed]);

  // Section-scoped layer count — queried from DB so it's always accurate
  const [sectionLayerCount, setSectionLayerCount] = useState(0);
  useEffect(() => {
    const { currentProject } = useLooperStore.getState();
    if (!currentProject?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const trackRecord = await db.tracks
          .where({ projectId: currentProject.id })
          .filter((t: any) => t.order === trackId)
          .first();
        if (!trackRecord || cancelled) return;
        const sectionRecord = await db.sections
          .where({ projectId: currentProject.id })
          .filter((s: any) => s.order === currentSectionIndex)
          .first();
        if (!sectionRecord || cancelled) return;
        const count = await db.layers
          .where({
            projectId: currentProject.id,
            trackId: trackRecord.id,
            sectionId: sectionRecord.id,
          })
          .filter((l: any) => !l.deletedAt)
          .count();
        if (!cancelled) setSectionLayerCount(count);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [trackId, currentSectionIndex, track.layerCount, track.hasAudio]);

  const handleArm = () => {
    toggleTrackRecording(trackId);
  };
  const handleMute = () => {
    useLooperStore
      .getState()
      .setTrackState(trackId, { isMuted: !track.isMuted });
  };
  const handleSolo = () => {
    useLooperStore.getState().setSolo(trackId);
  };
  const handleUndo = () => {
    audioEngine.undoLayer(trackId);
    const newCount = Math.max(0, track.layerCount - 1);
    useLooperStore
      .getState()
      .setTrackState(trackId, { layerCount: newCount, hasAudio: newCount > 0 });
  };
  const handleClear = () => {
    audioEngine.clearTrack(trackId);
    useLooperStore.getState().setTrackState(trackId, {
      isRecording: false,
      hasAudio: false,
      waveformData: [],
      layerCount: 0,
    });
  };

  // Long-press erase logic (Live mode)
  const startEraseHold = useCallback(() => {
    if (!track.hasAudio && !track.isRecording) return;
    const start = Date.now();
    setEraseProgress(0);
    eraseAnimRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setEraseProgress(Math.min(1, elapsed / ERASE_HOLD_MS));
    }, 16);
    eraseTimerRef.current = setTimeout(() => {
      cancelEraseHold();
      handleClear();
    }, ERASE_HOLD_MS);
  }, [track.hasAudio, track.isRecording]);

  const cancelEraseHold = useCallback(() => {
    if (eraseTimerRef.current) {
      clearTimeout(eraseTimerRef.current);
      eraseTimerRef.current = null;
    }
    if (eraseAnimRef.current) {
      clearInterval(eraseAnimRef.current);
      eraseAnimRef.current = null;
    }
    setEraseProgress(0);
  }, []);

  useEffect(() => () => cancelEraseHold(), []);

  // --- Visual state derivation ---
  let currentState: "idle" | "armed" | "recording" | "playing" | "muted" | "overdubbing" = "idle";
  if (track.isArmed) {
    currentState = "armed";
  } else if (track.isRecording) {
    currentState = track.hasAudio ? "overdubbing" : "recording";
  } else if (track.isMuted) {
    currentState = "muted";
  } else if (track.hasAudio) {
    currentState = "playing";
  } else {
    currentState = "idle";
  }

  let cardBorder = isLive ? `1px solid ${palette.border}30` : "1px solid rgba(255,255,255,0.08)";
  let cardAnimation = "none";
  let cardBg = isLive ? "rgba(0,0,0,0.4)" : "var(--card)";

  if (currentState === "idle") {
    cardBorder = "1.5px solid #2d2d4a";
  } else if (currentState === "armed") {
    cardBorder = "1.5px solid #7c3aed";
    cardAnimation = "armed-blink 1.1s ease-in-out infinite";
  } else if (currentState === "recording") {
    cardBorder = "1.5px solid #dc2626";
    cardAnimation = "record-pulse 1.2s ease-in-out infinite";
  } else if (currentState === "playing") {
    cardBorder = "1.5px solid #7c3aed";
    cardAnimation = "playing-border 2.5s ease-in-out infinite";
  } else if (currentState === "muted") {
    cardBorder = "1.5px solid #3a3a5c";
  } else if (currentState === "overdubbing") {
    cardBorder = "1.5px solid #d97706";
    cardAnimation = "overdub-pulse 1s ease-in-out infinite";
  }

  let padBg = "#1e1e30";
  let padBorder = "1.5px solid #2d2d4a";
  let padAnimation = "none";
  let padOpacity = 1;

  if (currentState === "idle") {
    padBg = "#1a1a2e";
    padBorder = "1.5px solid #2d2d4a";
  } else if (currentState === "armed") {
    padBg = "#2d1a4a";
    padBorder = "1.5px solid #7c3aed";
    padAnimation = "armed-blink 1.1s ease-in-out infinite";
  } else if (currentState === "recording") {
    padBg = "#2a1010";
    padBorder = "1.5px solid #dc2626";
  } else if (currentState === "playing") {
    padBg = "rgba(124, 58, 237, 0.15)";
    padBorder = "2px solid #7c3aed";
  } else if (currentState === "muted") {
    padBg = "#1c1c2a";
    padBorder = "1.5px solid #2a2a42";
    padOpacity = 0.6;
  } else if (currentState === "overdubbing") {
    padBg = "#1f1508";
    padBorder = "1.5px solid #d97706";
  }

  const eraseDisabled = !track.hasAudio && !track.isRecording;

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        padding: isLive ? "24px 20px" : "20px 16px",
        flex: 1,
        position: "relative",
        background: cardBg,
        border: cardBorder,
        animation: cardAnimation,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Header row */}
      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Stack style={{ gap: 4 }}>
          <Label
            style={{
              fontSize: isLive ? 18 : 14,
              fontWeight: 800,
              letterSpacing: isLive ? "0.05em" : "normal",
              color: palette.accent,
            }}
          >
            TRACK {trackId + 1}
          </Label>
          <StateBadge state={currentState} />
        </Stack>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {showHit && isPlaying && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  lastHitOffset > 0
                    ? "rgba(239, 68, 68, 0.9)"
                    : "rgba(34, 197, 94, 0.9)",
                color: "white",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "10px",
                fontWeight: "bold",
                zIndex: 10,
                animation: "fadeInOut 2s forwards",
              }}
            >
              HIT: {lastHitOffset > 0 ? "+" : ""}
              {Math.round(lastHitOffset)}ms
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Per-track Input Selector (Compact) */}
            <InputChannelSelector trackId={trackId} />

            {!isLive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenFX(trackId)}
                style={{ padding: "4px", opacity: 0.6 }}
                title="Configure track effects and mix"
              >
                <MixerIcon size={14} />
              </Button>
            )}
          </div>

          {/* Erase button: top-right in Live mode, separated + hold-to-fire */}
          {isLive && (
            <div style={{ position: "relative" }}>
              {/* Hold-progress ring */}
              {eraseProgress > 0 && (
                <svg
                  width={32}
                  height={32}
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: "rotate(-90deg)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                >
                  <circle
                    cx={16}
                    cy={16}
                    r={14}
                    fill="none"
                    stroke="rgba(239,68,68,0.3)"
                    strokeWidth={2.5}
                  />
                  <circle
                    cx={16}
                    cy={16}
                    r={14}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    strokeDasharray={`${2 * Math.PI * 14 * eraseProgress} ${2 * Math.PI * 14}`}
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <Button
                size="sm"
                disabled={eraseDisabled}
                onMouseDown={startEraseHold}
                onMouseUp={cancelEraseHold}
                onMouseLeave={cancelEraseHold}
                onTouchStart={startEraseHold}
                onTouchEnd={cancelEraseHold}
                title={
                  eraseDisabled ? "No audio to erase" : "Hold to clear loop"
                }
                style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                  borderRadius: 10,
                  opacity: eraseDisabled
                    ? 0.18
                    : eraseProgress > 0
                      ? 0.8
                      : 0.32,
                  background:
                    eraseProgress > 0 ? "rgba(239,68,68,0.15)" : "transparent",
                  border: "1px solid rgba(239,68,68,0.3)",
                  flexShrink: 0,
                  transition: "opacity 0.15s, background 0.15s",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <EraserIcon size={14} />
              </Button>
            </div>
          )}

          <LayerIndicator
            count={sectionLayerCount}
            accent={palette.accent}
            onClick={() => setShowLayers(true)}
          />
        </div>
      </Row>

      {/* Main pad — styled according to mockup */}
      <Button
        onClick={handleArm}
        title={
          track.isArmed
            ? "Disarm recording"
            : currentState === "overdubbing"
              ? "Track recording (overdub)"
              : currentState === "recording"
                ? "Track recording"
                : track.hasAudio
                  ? "Arm track for recording / overdub"
                  : "Arm track for recording"
        }
        style={{
          background: padBg,
          border: padBorder,
          animation: padAnimation,
          opacity: padOpacity,
          height: isLive ? 220 : 140,
          width: "100%",
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Progress Background (Live Mode) */}
        {isLive && isPlaying && track.hasAudio && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${sectionProgress * 100}%`,
              background: palette.progressFill,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        {/* Content based on behavior state */}
        {currentState === "idle" && (
          <div style={{ color: "#3a3a5c", fontSize: 32, zIndex: 1, userSelect: "none" }}>
            &#9654;
          </div>
        )}

        {currentState === "armed" && (
          <div
            style={{
              color: "#7c3aed",
              fontSize: 15,
              textAlign: "center",
              padding: "0 10px",
              lineHeight: 1.4,
              fontWeight: 600,
              zIndex: 1,
              animation: "armed-blink 1.1s ease-in-out infinite",
            }}
          >
            Waiting for bar end
          </div>
        )}

        {currentState === "recording" && (
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ "--primary-light": "#dc2626", width: "100%", padding: "0 12px" } as any}>
              <Waveform
                data={[0.2, 0.4, 0.3, 0.6, 0.25, 0.5, 0.2, 0.45, 0.35, 0.3, 0.55, 0.18, 0.4, 0.33, 0.5, 0.22, 0.42, 0.28, 0.35, 0.2]}
                progress={sectionProgress}
                height={isLive ? 180 : 100}
                bars={sections[currentSectionIndex]?.lengthInBars}
                variant={isLive ? "minimal" : undefined}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#dc2626",
                animation: "armed-blink 0.8s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {currentState === "playing" && (
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
            <div style={{ "--primary-light": palette.accent, width: "100%", padding: "0 12px" } as any}>
              <Waveform
                data={track.waveformData}
                progress={sectionProgress}
                height={isLive ? 180 : 100}
                bars={sections[currentSectionIndex]?.lengthInBars}
                variant={isLive ? "minimal" : undefined}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: "-8%",
                height: "100%",
                width: "16%",
                background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.25), transparent)",
                animation: "sweep 2s linear infinite",
                borderRadius: 4,
                pointerEvents: "none",
              }}
            />
          </div>
        )}

        {currentState === "muted" && (
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
            <div style={{ "--primary-light": "#4a4a6a", width: "100%", padding: "0 12px", opacity: 0.3 } as any}>
              <Waveform
                data={track.waveformData}
                progress={sectionProgress}
                height={isLive ? 180 : 100}
                bars={sections[currentSectionIndex]?.lengthInBars}
                variant={isLive ? "minimal" : undefined}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 8,
                right: 12,
                fontSize: 11,
                color: "#4a4a6a",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              MUTED
            </div>
          </div>
        )}

        {currentState === "overdubbing" && (
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
            {/* Background waveform layer */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", opacity: 0.4, padding: "0 12px" }}>
              <Waveform
                data={track.waveformData}
                progress={sectionProgress}
                height={isLive ? 180 : 100}
                bars={sections[currentSectionIndex]?.lengthInBars}
                variant={isLive ? "minimal" : undefined}
              />
            </div>
            {/* Overlay active overdub layer in amber */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", opacity: 0.8, padding: "0 12px", "--primary-light": "#d97706" } as any}>
              <Waveform
                data={track.waveformData}
                progress={sectionProgress}
                height={isLive ? 180 : 100}
                bars={sections[currentSectionIndex]?.lengthInBars}
                variant={isLive ? "minimal" : undefined}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                fontSize: 10,
                fontWeight: 700,
                color: "#d97706",
                letterSpacing: "0.06em",
              }}
            >
              +DUB
            </div>
            <div
              style={{
                position: "absolute",
                left: "-8%",
                height: "100%",
                width: "16%",
                background: "linear-gradient(90deg, transparent, rgba(217,119,6,0.25), transparent)",
                animation: "sweep 1.8s linear infinite",
                borderRadius: 4,
                pointerEvents: "none",
              }}
            />
          </div>
        )}
      </Button>

      {/* Bottom controls — M/S pill + Undo */}
      <Row style={{ gap: 10 }}>
        {/* M / S — joined segmented control */}
        <ButtonGroup style={{ flex: 1, height: 60 }}>
          <Button
            id={`track-${trackId}-mute-btn`}
            onClick={handleMute}
            size="md"
            variant={track.isMuted ? "active-warning" : "outline"}
            title={track.isMuted ? "Unmute track" : "Mute track"}
            style={{
              flex: 1,
              height: "100%",
              ...(track.isMuted
                ? {
                  background: "#3a2a5e",
                  color: "#c084fc",
                  borderColor: "#7c3aed",
                  boxShadow: "0 0 10px rgba(124, 58, 237, 0.4)",
                }
                : {}),
            }}
          >
            M
          </Button>
          <Button
            id={`track-${trackId}-solo-btn`}
            onClick={handleSolo}
            size="md"
            variant={track.isSoloed ? "active-primary" : "outline"}
            title={track.isSoloed ? "Clear solo" : "Solo this track"}
            style={{ flex: 1, height: "100%" }}
          >
            S
          </Button>
        </ButtonGroup>
        <Button
          onClick={handleUndo}
          disabled={track.layerCount === 0}
          size="md"
          title={
            track.layerCount === 0 ? "No layers to undo" : "Undo last layer"
          }
          style={{
            flex: 1,
            height: 60,
            borderRadius: 16,
            opacity: track.layerCount === 0 ? 0.2 : 1,
          }}
        >
          <UndoIcon size={22} />
        </Button>
        {/* Erase in bottom row for non-Live modes only */}
        {!isLive && (
          <Button
            onClick={handleClear}
            disabled={!track.hasAudio && !track.isRecording}
            size="md"
            title={
              !track.hasAudio && !track.isRecording
                ? "No audio to erase"
                : "Clear loop"
            }
            style={{
              flex: 0.6,
              height: 60,
              borderRadius: 16,
              opacity: !track.hasAudio && !track.isRecording ? 0.2 : 0.6,
            }}
          >
            <EraserIcon size={22} />
          </Button>
        )}
      </Row>

      {/* Planning-mode waveform strip — only shown outside Live mode */}
      {!isLive && !track.hasAudio && (
        <Waveform
          data={track.waveformData}
          progress={sectionProgress}
          height={40}
          bars={sections[currentSectionIndex]?.lengthInBars}
        />
      )}

      {/* Layer Row Summary */}
      {!showLayers && (track.layerCount > 0 || currentState === "recording" || currentState === "overdubbing") && (
        <LayerRow
          state={currentState}
          layerCount={sectionLayerCount}
          accent={palette.accent}
        />
      )}

      {/* Layers Drawer — expands inline at the bottom of the card */}
      {showLayers && (
        <LayersDrawer
          trackId={trackId}
          accent={palette.accent}
          onClose={() => setShowLayers(false)}
        />
      )}
    </Card>
  );

};

// ─── Section Progress Ring ─────────────────────────────────────────────────────
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

// ─── Section Navigator ─────────────────────────────────────────────────────────
const SectionNavigator = () => {
  const { sections, currentSectionIndex, queuedSectionIndex, isPlaying } =
    useLooperStore();

  const handleQueue = (index: number) => {
    if (!isPlaying) return;
    if (index === currentSectionIndex) {
      useLooperStore.getState().setQueuedSection(null);
      audioEngine.queueSection(currentSectionIndex);
    } else {
      useLooperStore.getState().setQueuedSection(index);
      audioEngine.queueSection(index);
    }
  };

  return (
    <Row style={{ flexWrap: "wrap", gap: 10 }}>
      {sections.map((sec) => {
        const isCurrent = sec.index === currentSectionIndex;
        const isQueued = sec.index === queuedSectionIndex;
        const variant = isCurrent
          ? "active-primary"
          : isQueued
            ? "active-warning"
            : "ghost";

        return (
          <Button
            key={sec.index}
            onClick={() => handleQueue(sec.index)}
            variant={variant}
            disabled={!isPlaying}
            style={{
              padding: "12px 20px",
              minWidth: 100,
              height: 60,
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 16,
              cursor: isPlaying ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {isQueued && <CaretRightIcon size={16} />}
              {sec.name}
            </div>
            <span style={{ fontSize: 10, opacity: 0.6 }}>
              {sec.lengthInBars} BARS
            </span>
          </Button>
        );
      })}
    </Row>
  );
};

// ─── Metronome Button ──────────────────────────────────────────────────────────
export const MetronomeButton = () => {
  const { metronomeOn, setMetronomeOn } = useLooperStore();
  return (
    <Button
      onClick={() => {
        audioEngine.toggleMetronome();
        setMetronomeOn(!metronomeOn);
      }}
      size="sm"
      variant={metronomeOn ? "accent" : "outline"}
      title={metronomeOn ? "Mute Metronome" : "Unmute Metronome"}
    >
      <MetronomeIcon size={20} />
    </Button>
  );
};

// ─── Header Indications ───────────────────────────────────────────────────────
export const HeaderIndications = () => {
  const {
    currentBar,
    currentBeat,
    sectionProgress,
    sections,
    currentSectionIndex,
    isPlaying,
    mode,
  } = useLooperStore();
  const currentSection = sections[currentSectionIndex];
  const isLive = mode === "live";

  return (
    <Row
      style={{
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <Stack style={{ gap: 0 }}>
        <Heading style={{ fontSize: 18, margin: 0 }}>
          {currentSection?.name ?? "Section"}
        </Heading>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isPlaying ? "#4ade80" : "#374151",
              boxShadow: isPlaying ? "0 0 8px #4ade80" : "none",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              opacity: 0.5,
              letterSpacing: "0.05em",
            }}
          >
            {isPlaying ? "LIVE" : "STOPPED"}
          </span>
        </div>
      </Stack>

      {/* Beat/bar ring — full size in Live mode, scaled down otherwise */}
      {isLive ? (
        <ProgressRing
          progress={sectionProgress}
          bar={currentBar}
          beat={currentBeat}
        />
      ) : (
        <div
          style={{
            transform: "scale(0.5)",
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ProgressRing
            progress={sectionProgress}
            bar={currentBar}
            beat={currentBeat}
          />
        </div>
      )}
    </Row>
  );
};

// ─── BPM Edit Popup ───────────────────────────────────────────────────────────
export const BpmEditPopup = ({ onClose }: { onClose: () => void }) => {
  const { bpm, isPlaying } = useLooperStore();
  const bpmInputRef = useRef<HTMLInputElement>(null);

  const handleBpmChange = (newBpm: number) => {
    const clamped = Math.min(220, Math.max(40, newBpm));
    useLooperStore.getState().setBpm(clamped);
    if (isPlaying) audioEngine.setBpm(clamped);
  };

  const handleBpmInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) handleBpmChange(val);
  };

  return (
    <Modal onClose={onClose}>
      <Card
        style={{
          width: 360,
          padding: 24,
          background: "#1a1a1e",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Label style={{ fontSize: 12, opacity: 0.5 }}>ADJUST TEMPO</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            style={{ padding: 4 }}
          >
            <StopIcon size={16} />
          </Button>
        </div>

        <Row
          style={{ alignItems: "center", gap: 12, justifyContent: "center" }}
        >
          <Button
            onClick={() => handleBpmChange(bpm - 5)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            −5
          </Button>
          <Button
            onClick={() => handleBpmChange(bpm - 1)}
            style={{
              width: 40,
              height: 44,
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            −
          </Button>
          <div style={{ position: "relative" }}>
            <input
              data-testid="bpm-input"
              autoFocus
              ref={bpmInputRef}
              type="number"
              value={bpm}
              onChange={handleBpmInputChange}
              style={{
                width: "100%",
                height: 44,
                minWidth: 100,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "white",
                fontSize: 24,
                fontWeight: 800,
                textAlign: "center",
                fontFamily: "monospace",
                outline: "none",
              }}
            />
          </div>
          <Button
            onClick={() => handleBpmChange(bpm + 1)}
            style={{
              width: 40,
              height: 44,
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            +
          </Button>
          <Button
            data-testid="bpm-plus-5"
            onClick={() => handleBpmChange(bpm + 5)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            +5
          </Button>
        </Row>

        <Button
          variant="primary"
          onClick={onClose}
          style={{ height: 44, borderRadius: 12, fontWeight: 700 }}
        >
          DONE
        </Button>
      </Card>
    </Modal>
  );
};

// ─── Settings Popover (Load Demo + I/O Devices) ──────────────────────────────
import { SettingsPopover } from "./SettingsPopover";

// ─── Global Action Bar ────────────────────────────────────────────────────────
export const GlobalActionBar = () => {
  const {
    isPlaying,
    mode,
    sections,
    bpm,
    currentSectionIndex,
    queuedSectionIndex,
    showLayers,
    setShowLayers,
    showDevInspector,
    setShowDevInspector,
  } = useLooperStore();

  const {
    isSessionArmed,
    setIsSessionArmed,
    isSessionRecording,
    recordingDuration,
    togglePlayback,
    toggleRecording,
  } = useSessionStore();

  const [showBpmPopup, setShowBpmPopup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const isLive = mode === "live";

  const handleToggle = async () => {
    await togglePlayback();
  };

  const handleRecordClick = async () => {
    if (isPlaying) {
      await toggleRecording();
    } else {
      setIsSessionArmed(!isSessionArmed);
    }
  };

  const formatMs = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1100,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px",
          background: "rgba(13, 13, 15, 0.90)",
          backdropFilter: "blur(20px)",
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          minWidth: 520,
        }}
      >
        <ChannelLevels />
        <div
          style={{
            width: 1,
            height: 32,
            background: "rgba(255,255,255,0.08)",
            margin: "0 4px",
          }}
        />

        {/* ── Record Timer Overlay ── */}
        {isSessionRecording && (
          <div
            style={{
              position: "absolute",
              top: -40,
              left: 48,
              background: "rgba(239, 68, 68, 0.95)",
              color: "white",
              padding: "6px 14px",
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 900,
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "white",
                animation: "pulse 1s infinite",
              }}
            />
            REC {formatMs(recordingDuration)}
          </div>
        )}

        {/* ── Record Button ── */}
        <Button
          onClick={handleRecordClick}
          title={
            isSessionRecording
              ? "Stop Session Recording"
              : isSessionArmed
                ? "Disarm Session Recording"
                : "Arm Session Recording"
          }
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            flexShrink: 0,
            background: isSessionRecording
              ? "#ef4444"
              : isSessionArmed
                ? "rgba(239, 68, 68, 0.12)"
                : "transparent",
            border:
              isSessionArmed || isSessionRecording
                ? "2px solid #ef4444"
                : "2px solid rgba(255,255,255,0.08)",
            color: isSessionRecording
              ? "white"
              : isSessionArmed
                ? "#ef4444"
                : "rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: isSessionRecording
              ? "0 0 20px rgba(239, 68, 68, 0.4)"
              : "none",
            marginLeft: 4,
          }}
        >
          <RecordIcon size={24} />
        </Button>
        {/* ── Play / Stop — dominant element ── */}
        <Button
          data-testid="transport-button"
          onClick={handleToggle}
          variant={isPlaying ? "danger" : "primary"}
          title={
            isPlaying
              ? "Stop performance playback"
              : "Start performance playback"
          }
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            flexShrink: 0,
            boxShadow: isPlaying
              ? "0 0 28px rgba(220, 38, 38, 0.45)"
              : "0 0 28px rgba(124, 58, 237, 0.45)",
          }}
        >
          {isPlaying ? <StopIcon size={30} /> : <PlayIcon size={30} />}
        </Button>

        <div
          style={{
            width: 1,
            height: 40,
            background: "rgba(255,255,255,0.08)",
            margin: "0 4px",
          }}
        />

        {/* ── Secondary controls ── */}
        <Row style={{ gap: 8, alignItems: "center" }}>
          <MetronomeButton />

          {/* Tempo */}
          <Button
            data-testid="bpm-button"
            variant="ghost"
            onClick={() => setShowBpmPopup(true)}
            title="Change tempo (BPM)"
            style={{
              height: 48,
              padding: "0 16px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  opacity: 0.4,
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                TEMPO
              </span>
              <span
                data-testid="bpm-value"
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  fontFamily: "monospace",
                }}
              >
                {bpm} <span style={{ fontSize: 10, opacity: 0.5 }}>BPM</span>
              </span>
            </div>
          </Button>

          {/* ── Layers toggle ── */}
          <div
            style={{
              width: 1,
              height: 32,
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLayers(!showLayers)}
            title={showLayers ? "Hide layers" : "Show layers"}
            style={{
              width: 36,
              height: 36,
              padding: 0,
              borderRadius: 10,
              opacity: showLayers ? 1 : 0.5,
              background: showLayers ? "rgba(167,139,250,0.15)" : "transparent",
              border: showLayers
                ? "1px solid rgba(167,139,250,0.4)"
                : "1px solid transparent",
              color: showLayers ? "#a78bfa" : "inherit",
              transition: "all 0.2s ease",
            }}
          >
            <LayersIcon size={20} />
          </Button>

          {/* ── Performance toggle ── */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPerformance((p) => !p)}
            title={showPerformance ? "Hide Performance" : "Show Performance"}
            style={{
              width: 36,
              height: 36,
              padding: 0,
              borderRadius: 10,
              opacity: showPerformance ? 1 : 0.5,
              background: showPerformance
                ? "rgba(74,222,128,0.12)"
                : "transparent",
              border: showPerformance
                ? "1px solid rgba(74,222,128,0.35)"
                : "1px solid transparent",
              color: showPerformance ? "#4ade80" : "inherit",
              transition: "all 0.2s ease",
            }}
          >
            <ActivityIcon size={20} />
          </Button>

          {/* ── Dev Inspector toggle ── */}
          {mode === "planning" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDevInspector(!showDevInspector)}
              title={
                showDevInspector ? "Hide Dev Inspector" : "Show Dev Inspector"
              }
              style={{
                width: 36,
                height: 36,
                padding: 0,
                borderRadius: 10,
                opacity: showDevInspector ? 1 : 0.5,
                background: showDevInspector
                  ? "rgba(99,102,241,0.15)"
                  : "transparent",
                border: showDevInspector
                  ? "1px solid rgba(99,102,241,0.4)"
                  : "1px solid transparent",
                color: showDevInspector ? "#a5b4fc" : "inherit",
                transition: "all 0.2s ease",
              }}
            >
              <DebugIcon size={20} />
            </Button>
          )}

          {/* ── Settings gear ── */}
          <div style={{ position: "relative" }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings((p) => !p)}
              title="Settings"
              style={{
                width: 36,
                height: 36,
                padding: 0,
                borderRadius: 10,
                opacity: 0.5,
              }}
            >
              <SettingsIcon size={20} />
            </Button>
            {showSettings && (
              <SettingsPopover onClose={() => setShowSettings(false)} />
            )}
          </div>
        </Row>
      </div>
      {showBpmPopup && <BpmEditPopup onClose={() => setShowBpmPopup(false)} />}
      {showPerformance && <LatencyMonitor />}
    </>
  );
};

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

// ─── TrackControls (4 Columns + Live Track) ─────────────────────────────────
export const TrackControls = () => {
  const [activeFXTrack, setActiveFXTrack] = useState<number | null>(null);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        <div style={{ flex: "0 0 80px" }}>
          <LiveTrackPad
            onOpenFX={(id) => setActiveFXTrack(id as unknown as number)}
          />
        </div>

        {/* Visual Separator */}
        <div
          style={{
            width: 1,
            background: "rgba(255,255,255,0.06)",
            margin: "16px 0",
          }}
        />

        <div style={{ flex: 4 }}>
          <Grid cols="repeat(4, 1fr)" style={{ gap: 16, height: "100%" }}>
            {[0, 1, 2, 3].map((id) => (
              <TrackPad
                key={id}
                trackId={id}
                onOpenFX={(id) => setActiveFXTrack(id)}
              />
            ))}
          </Grid>
        </div>
      </div>

      {activeFXTrack !== null && (
        <Modal onClose={() => setActiveFXTrack(null)}>
          <TrackFX
            trackId={
              activeFXTrack === ("live" as unknown as number)
                ? "live"
                : activeFXTrack
            }
            onClose={() => setActiveFXTrack(null)}
          />
        </Modal>
      )}
    </div>
  );
};
