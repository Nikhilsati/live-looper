import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { audioEngine } from "@live-looper/audio-engine";
import { useLooperStore } from "../store/useLooperStore";
import { FXBuilder } from "@live-looper/audio-engine";
import { TrackFX } from "./TrackFX";
import { Tuner } from "./Tuner";
import { GuitarIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react";
import {
  MetronomeIcon,
  StopIcon,
  MicrophoneIcon,
  MixerIcon,
  MuteIcon,
  VolumeHighIcon,
  TempoIcon,
  ArrowLeftIcon,
  SettingsIcon,
} from "@live-looper/icons";
import { Button, LevelMeter } from "@live-looper/ui";
import { SettingsPopover } from "./SettingsPopover";

// VU Meter component removed in favor of shared LevelMeter component


// ─── BPM Tap Tempo ────────────────────────────────────────────────────────────
function useTapTempo(onBpm: (bpm: number) => void) {
  const tapsRef = useRef<number[]>([]);
  return useCallback(() => {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current.filter((t) => now - t < 3000), now];
    if (tapsRef.current.length >= 2) {
      const gaps = tapsRef.current
        .slice(1)
        .map((t, i) => t - tapsRef.current[i]);
      const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      const bpm = Math.round(60000 / avg);
      onBpm(Math.max(40, Math.min(220, bpm)));
    }
  }, [onBpm]);
}

// ─── Main View ───────────────────────────────────────────────────────────────
export const GuitarPracticeView: React.FC = () => {
  const navigate = useNavigate();
  const {
    liveTrack,
    setLiveTrackState,
    bpm,
    setBpm,
    metronomeOn,
    setMetronomeOn,
    inputDeviceId,
  } = useLooperStore();

  const [isRunning, setIsRunning] = useState(false);
  const [showFX, setShowFX] = useState(true);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [showBpmEdit, setShowBpmEdit] = useState(false);
  const [hasPermission, setHasPermission] = useState<
    "idle" | "granted" | "denied"
  >("idle");
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const analyserSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Ensure liveTrack has valid FX (works without a project loaded)
  useEffect(() => {
    if (!liveTrack?.fx) {
      setLiveTrackState({ fx: new FXBuilder().build(), isMuted: false });
    }
  }, []);

  // Build AnalyserNode tap on the microphone input after engine starts
  const buildAnalyser = useCallback(async () => {
    if (!audioEngine.context) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          ...(inputDeviceId ? { deviceId: { exact: inputDeviceId } } : {}),
        },
      });
      const ctx = audioEngine.context;
      const source = ctx.createMediaStreamSource(stream);
      const node = ctx.createAnalyser();
      node.fftSize = 1024;
      node.smoothingTimeConstant = 0.6;
      source.connect(node);
      if (audioEngine.liveTrackFX) {
        source.connect(audioEngine.liveTrackFX.input);
      }
      analyserSourceRef.current = source;
      analyserRef.current = node;
      setAnalyser(node);
      setHasPermission("granted");
    } catch {
      setHasPermission("denied");
    }
  }, [inputDeviceId]);

  const handleStart = useCallback(async () => {
    // Provide a dummy section with no tracks linked so the worklet doesn't process old loop data
    const dummySection = {
      id: "practice",
      index: 0,
      name: "Practice",
      lengthInBars: 4,
      trackLinks: [false, false, false, false],
    };
    await audioEngine.init([dummySection], bpm);
    audioEngine.updateLiveTrackFX(liveTrack.fx, bpm);
    audioEngine.clearAllTracks(); // Wipe any lingering audio buffers from the last open project
    audioEngine.start();
    setIsRunning(true);
    await buildAnalyser();
  }, [bpm, buildAnalyser, liveTrack.fx]);

  const handleStop = useCallback(() => {
    audioEngine.stop();
    // Tear down our read-only analyser tap
    if (analyserSourceRef.current) {
      analyserSourceRef.current.disconnect();
      analyserSourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    setAnalyser(null);
    setIsRunning(false);
  }, []);

  const handleBack = useCallback(() => {
    if (isRunning) handleStop();
    navigate("/");
  }, [isRunning, handleStop, navigate]);

  const handleMuteToggle = useCallback(() => {
    setLiveTrackState({ isMuted: !liveTrack.isMuted });
  }, [liveTrack.isMuted, setLiveTrackState]);

  const handleMetronomeToggle = useCallback(() => {
    setMetronomeOn(!metronomeOn);
  }, [metronomeOn, setMetronomeOn]);

  const handleBpmChange = useCallback(
    (delta: number) => {
      const next = Math.max(40, Math.min(220, bpm + delta));
      setBpm(next);
      if (isRunning) audioEngine.setBpm(next);
    },
    [bpm, setBpm, isRunning],
  );

  const tapTempo = useTapTempo((newBpm) => {
    setBpm(newBpm);
    if (isRunning) audioEngine.setBpm(newBpm);
  });

  // Rebuild analyser if input device changes while running
  useEffect(() => {
    if (isRunning && hasPermission === "granted") {
      buildAnalyser();
    }
  }, [inputDeviceId, isRunning]);

  // Unmount safety
  useEffect(
    () => () => {
      if (isRunning) audioEngine.stop();
    },
    [],
  );

  const isMuted = liveTrack?.isMuted ?? false;
  const beatDuration = 60 / bpm;

  useEffect(() => {
    if (audioEngine.masterBus && audioEngine.context) {
      audioEngine.masterBus.output.gain.setTargetAtTime(
        volume,
        audioEngine.context.currentTime,
        0.05,
      );
    }
  }, [volume, isRunning]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#070b0f",
        backgroundImage: `
                radial-gradient(ellipse 70% 40% at 30% -5%, rgba(16, 185, 129, 0.12), transparent),
                radial-gradient(ellipse 50% 30% at 85% 90%, rgba(6, 182, 212, 0.08), transparent)
            `,
        fontFamily: "'Inter', sans-serif",
        color: "rgba(255,255,255,0.9)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            variant="ghost"
            onClick={handleBack}
            data-testid="practice-exit-btn"
            title="Exit practice view and return to dashboard"
            style={{
              width: 44,
              height: 44,
              padding: 0,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeftIcon size={20} />
          </Button>

          {/* Icon + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              }}
            >
              <GuitarIcon size={22} color="white" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Guitar Practice
              </div>
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.45,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                Live pass-through
              </div>
            </div>
          </div>
        </div>

        {/* Status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: isRunning
              ? "rgba(16, 185, 129, 0.12)"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${isRunning ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 20,
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isRunning ? "#10b981" : "#374151",
              boxShadow: isRunning ? "0 0 10px rgba(16,185,129,0.7)" : "none",
              animation: isRunning
                ? `practice-pulse ${beatDuration}s ease-in-out infinite`
                : "none",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: isRunning ? "#10b981" : "rgba(255,255,255,0.3)",
            }}
          >
            {isRunning ? "LIVE" : "STOPPED"}
          </span>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "0 0 140px 0", // room for fixed bottom bar
        }}
      >
        {/* FX Rack — full inline, scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 28px 0",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "6px 10px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MixerIcon size={14} />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                  }}
                >
                  LIVE PEDALBOARD
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowFX((v) => !v)}
              title={
                showFX ? "Collapse Pedalboard panel" : "Expand Pedalboard panel"
              }
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                padding: "4px 8px",
                borderRadius: 6,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
              }
            >
              {showFX ? "Hide" : "Show"}
            </button>
          </div>

          {showFX && (
            <div
              style={{
                animation: "fadeIn 0.2s ease",
                display: "flex",
                flex: 1,
                gap: 16,
              }}
            >
              {/* Vertical IN Meter */}
              <div
                style={{
                  width: 80,
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "24px 0",
                  gap: 20,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.8)",
                    letterSpacing: "0.05em",
                  }}
                >
                  IN
                </span>

                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: 200,
                    width: "100%",
                    padding: "0 16px",
                  }}
                >
                  {hasPermission === "denied" ? (
                    <div
                      style={{
                        writingMode: "vertical-rl",
                        color: "#f87171",
                        fontSize: 10,
                        textAlign: "center",
                        letterSpacing: 2,
                      }}
                    >
                      DENIED
                    </div>
                  ) : (
                    <LevelMeter
                      analyser={isRunning ? analyser : null}
                      vertical
                      bars={28}
                      variant="segmented"
                      style={{ background: "transparent", border: "none", padding: 0 }}
                    />
                  )}
                </div>

                <div
                  title="Live Microphone Input levels"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background:
                      isRunning && hasPermission === "granted"
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(255,255,255,0.05)",
                    border: `1px solid ${
                      isRunning && hasPermission === "granted"
                        ? "rgba(16,185,129,0.4)"
                        : "rgba(255,255,255,0.1)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MicrophoneIcon
                    size={14}
                    color={
                      isRunning && hasPermission === "granted"
                        ? "#10b981"
                        : "rgba(255,255,255,0.3)"
                    }
                  />
                </div>
              </div>

              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Tuner analyser={isRunning ? analyser : null} />
                <TrackFX trackId="live" fullSize />
              </div>

              {/* Vertical Master Fader */}
              <div
                style={{
                  width: 80,
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "24px 0",
                  gap: 20,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.8)",
                    letterSpacing: "0.05em",
                  }}
                >
                  OUT
                </span>

                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: 200,
                  }}
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    title="Adjust master output volume"
                    style={
                      {
                        WebkitAppearance: "slider-vertical",
                        appearance: "slider-vertical",
                        width: 8,
                        height: "100%",
                        cursor: "pointer",
                        accentColor: "#10b981",
                      } as any
                    }
                  />
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "monospace",
                  }}
                >
                  {Math.round(volume * 100)}%
                </div>

                {/* Pan Slider placed here */}
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    gap: 8,
                    padding: "0 12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.6)",
                      textTransform: "uppercase",
                    }}
                  >
                    PAN
                  </span>
                  <input
                    type="range"
                    className="pan-slider"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={liveTrack?.fx?.pan ?? 0}
                    onChange={(e) =>
                      setLiveTrackState({
                        fx: {
                          ...liveTrack.fx,
                          pan: parseFloat(e.target.value),
                        },
                      })
                    }
                    onDoubleClick={() =>
                      setLiveTrackState({ fx: { ...liveTrack.fx, pan: 0 } })
                    }
                    title="Adjust master output pan (double-click to center)"
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {liveTrack?.fx?.pan < -0.005
                      ? `L${Math.abs(Math.round(liveTrack.fx.pan * 100))}`
                      : liveTrack?.fx?.pan > 0.005
                        ? `R${Math.round(liveTrack.fx.pan * 100)}`
                        : "C"}
                  </span>
                </div>

                {/* Mute Button */}
                <button
                  id="practice-mute-btn"
                  onClick={handleMuteToggle}
                  title={isMuted ? "Unmute output" : "Mute output"}
                  style={{
                    padding: 12,
                    marginTop: 8,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: `1px solid ${isMuted ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                    background: isMuted
                      ? "rgba(239,68,68,0.12)"
                      : "rgba(255,255,255,0.05)",
                    color: isMuted ? "#f87171" : "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isMuted ? (
                    <MuteIcon size={32} />
                  ) : (
                    <VolumeHighIcon size={32} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Fixed Bottom Transport Bar ──────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 28px",
          background: "rgba(7, 11, 15, 0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          zIndex: 100,
        }}
      >
        {/* Start / Stop */}
        <button
          id="practice-start-stop-btn"
          onClick={isRunning ? handleStop : handleStart}
          title={
            isRunning
              ? "Stop practice audio session"
              : "Start practice audio session (loads virtual pedalboard and tuner)"
          }
          style={{
            padding: "0 40px",
            height: 64,
            borderRadius: 18,
            border: "none",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "0.08em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            background: isRunning
              ? "rgba(239, 68, 68, 0.12)"
              : "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
            color: isRunning ? "#f87171" : "white",
            boxShadow: isRunning
              ? "0 0 0 1px rgba(239,68,68,0.3)"
              : "0 4px 24px rgba(16,185,129,0.35)",
          }}
        >
          {isRunning ? (
            <>
              <StopIcon size={22} /> STOP
            </>
          ) : (
            <>
              <GuitarIcon size={22} weight="fill" /> START PLAYING
            </>
          )}
        </button>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 40,
            background: "rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        />

        {/* BPM display + tap */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => handleBpmChange(-1)}
            title="Decrease tempo by 1 BPM"
            style={{
              width: 36,
              height: 64,
              borderRadius: "14px 0 0 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRight: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.09)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
          >
            <MinusIcon size={14} weight="bold" />
          </button>

          {/* Tap / display */}
          <button
            id="practice-tap-tempo-btn"
            onClick={tapTempo}
            title="Tap to set tempo"
            style={{
              width: 80,
              height: 64,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "monospace",
                lineHeight: 1,
              }}
            >
              {bpm}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.3)",
                marginTop: 2,
              }}
            >
              BPM · TAP
            </span>
          </button>

          <button
            onClick={() => handleBpmChange(1)}
            title="Increase tempo by 1 BPM"
            style={{
              width: 36,
              height: 64,
              borderRadius: "0 14px 14px 0",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderLeft: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.09)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
          >
            <PlusIcon size={14} weight="bold" />
          </button>
        </div>

        {/* Metronome */}
        <button
          id="practice-metronome-btn"
          onClick={handleMetronomeToggle}
          title={metronomeOn ? "Mute metronome" : "Enable metronome"}
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            border: `1px solid ${metronomeOn ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)"}`,
            background: metronomeOn
              ? "rgba(167,139,250,0.12)"
              : "rgba(255,255,255,0.05)",
            color: metronomeOn ? "#a78bfa" : "rgba(255,255,255,0.35)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
            boxShadow: metronomeOn ? "0 0 16px rgba(167,139,250,0.2)" : "none",
          }}
        >
          <MetronomeIcon
            size={24}
            style={
              {
                animation:
                  metronomeOn && isRunning
                    ? `metro-tick ${beatDuration}s ease-in-out infinite alternate`
                    : "none",
              } as React.CSSProperties
            }
          />
        </button>

        {/* Settings gear */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.1)",
              background: showSettings
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.05)",
              color: showSettings ? "white" : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            <SettingsIcon size={24} />
          </button>
          {showSettings && (
            <SettingsPopover
              onClose={() => setShowSettings(false)}
              showDemoOption={false}
              showSmartSnap={false}
              style={{
                bottom: "calc(100% + 16px)",
                right: 0,
                transform: "none",
              }}
            />
          )}
        </div>
      </div>

      {/* Scoped animations */}
      <style>{`
                @keyframes practice-pulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(16,185,129,0.6); }
                    50% { opacity: 0.6; box-shadow: 0 0 3px rgba(16,185,129,0.2); }
                }
                @keyframes metro-tick {
                    from { transform: rotate(-12deg); }
                    to   { transform: rotate(12deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                /* Hide the close button that TrackFX renders — we don't need it inline */
                .practice-fx-wrap .fx-panel > div:first-child button:last-child {
                    display: none;
                }
            `}</style>
    </div>
  );
};
