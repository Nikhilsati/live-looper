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
import { useLooperStore } from "../store";
import { useSessionStore } from "../store/useSessionStore";
import { ModeSwitcher } from "./ModeSwitcher";
import { can } from "@live-looper/mode-controller";
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

import { TRACK_COLORS } from "./track/trackColors";
import { TrackPad } from "./track/TrackPad";
import { LiveTrackPad } from "./track/LiveTrackPad";
import { ProgressRing } from "./track/ProgressRing";

export const ICON_SIZE = 22;
export const MAX_LAYER_INDICATOR_BARS = 4;




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
        {can("record-session", mode) && isSessionRecording && (
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
        {can("record-session", mode) && (
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
        )}
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
          {!isLive && (
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
          )}
        </Row>

      </div>
      {showBpmPopup && <BpmEditPopup onClose={() => setShowBpmPopup(false)} />}
      {showPerformance && <LatencyMonitor />}
    </>
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
