import { useState, useRef, useEffect, useCallback } from "react";
import {
  MicrophoneIcon,
  RecordIcon,
  UndoIcon,
  EraserIcon,
  LayersIcon,
  ActivityIcon,
  SettingsIcon,
  MixerIcon,
} from "@live-looper/icons";
import { audioEngine } from "@live-looper/audio-engine";
import { useLooperStore } from "../../store";
import { useSessionStore } from "../../store/useSessionStore";
import {
  Card,
  Row,
  Button,
  ButtonGroup,
  Waveform,
  Label,
  Stack,
} from "@live-looper/ui";
import { TRACK_COLORS } from "./trackColors";
import { LayerIndicator } from "./LayerIndicator";
import { LayerRow } from "./LayerRow";
import { LayersDrawer } from "./LayersDrawer";
import { db } from "@live-looper/storage";
import { StateBadge } from "./StateBadge";
import { InputChannelSelector } from "../InputChannelSelector";


export const ERASE_HOLD_MS = 600;

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
  const cardBg = isLive ? "rgba(0,0,0,0.4)" : "var(--card)";

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
