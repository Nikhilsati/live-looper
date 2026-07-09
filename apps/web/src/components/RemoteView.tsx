import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  RemoteClient,
  WebRTCTransport,
  HTTPSignalingChannel,
} from "@live-looper/remote";
import type {
  RemoteConnectionStatus,
  RemoteSyncState,
  RemoteCommandType,
} from "@live-looper/types";
import { UndoIcon, SettingsIcon, MicrophoneIcon, MicrophoneOffIcon } from "@live-looper/icons";

/** Track accent colors matching the desktop app. */
const TRACK_COLORS = [
  { solid: "#818cf8", name: "indigo", bg: "rgba(129, 140, 248, 0.15)" },
  { solid: "#22d3ee", name: "cyan", bg: "rgba(34, 211, 238, 0.15)" },
  { solid: "#fbbf24", name: "amber", bg: "rgba(251, 191, 36, 0.15)" },
  { solid: "#f472b6", name: "pink", bg: "rgba(244, 114, 182, 0.15)" },
];

const ANIMATIONS = `
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
@keyframes connecting-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000;
}

/* Custom vertical slider */
input[type=range][orient=vertical] {
  appearance: slider-vertical;
  width: 8px;
  height: 100%;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
/* Horizontal slider basic resets */
input[type=range].h-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
}
input[type=range].h-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: currentColor;
  cursor: pointer;
}
`;

function hapticFeedback(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

export const RemoteView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionCode = searchParams.get("session");

  const [status, setStatus] = useState<RemoteConnectionStatus>("disconnected");
  const [state, setState] = useState<RemoteSyncState | null>(null);
  const clientRef = useRef<RemoteClient | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);
  
  const [lastArmedTrackId, setLastArmedTrackId] = useState<number>(0);
  useEffect(() => {
    if (state?.tracks) {
      const activeIdx = state.tracks.findIndex(t => t.isArmed || t.isRecording);
      if (activeIdx !== -1) {
        setLastArmedTrackId(activeIdx);
      }
    }
  }, [state?.tracks]);

  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    if (!sessionCode) return;

    const signaling = new HTTPSignalingChannel(sessionCode, false);
    const transport = new WebRTCTransport();
    const client = new RemoteClient(transport);

    clientRef.current = client;

    client.on("connection-change", setStatus);
    client.on("state", setState);

    client.connect({ signaling, isInitiator: false }).catch((err) => {
      console.error("Connection failed", err);
      setStatus("error");
    });

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
  }, [sessionCode]);

  const sendCommand = (type: RemoteCommandType, payload?: Record<string, unknown>) => {
    hapticFeedback(15);
    clientRef.current?.sendCommand(type, payload);
  };

  const handleTapTempo = () => {
    const now = Date.now();
    let times = tapTimesRef.current;
    
    if (times.length > 0 && now - times[times.length - 1] > 2000) {
      times = [];
    }
    times.push(now);
    if (times.length > 4) times.shift();
    tapTimesRef.current = times;
    
    if (times.length > 1) {
      const intervals = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      if (bpm >= 40 && bpm <= 300) {
        sendCommand("SET_BPM", { bpm });
      }
    }
    hapticFeedback([15, 30]);
  };

  if (!sessionCode || status === "connecting" || status === "disconnected" || status === "error") {
    return (
      <div style={styles.centerRoot}>
        <style>{ANIMATIONS}</style>
        {status === "error" ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div style={styles.connectingText}>Connection Failed</div>
          </>
        ) : (
          <>
            <div style={styles.spinner} />
            <div style={styles.connectingText}>Connecting to Live Looper...</div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <style>{ANIMATIONS}</style>

      {/* ── Top Bar ── */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <div style={styles.statusDot} />
          <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginRight: 16 }}>CONNECTED</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Laptop &bull; Live Looper Studio</span>
        </div>
        
        <div style={styles.topRight}>
          <div style={styles.bpmPill}>{state?.bpm ?? 120} BPM</div>
          <div style={styles.timeInfo}>
            4/4 &bull; Bar {state?.currentBar ?? 1} &bull; Beat {state?.currentBeat ?? 1}
          </div>
          <button style={styles.iconBtn}>
            <SettingsIcon size={20} />
          </button>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div style={{ ...styles.mainArea, flexDirection: isPortrait ? "column" : "row", padding: isPortrait ? "16px" : "0 24px" }}>
        
        {/* Input Column */}
        <div style={{ ...styles.inputColumn, width: isPortrait ? "100%" : 80, flexDirection: isPortrait ? "row" : "column", padding: isPortrait ? "12px 20px" : "20px 8px" }}>
          <div style={{ display: "flex", flexDirection: isPortrait ? "row" : "column", alignItems: "center", gap: isPortrait ? 12 : 0 }}>
            <button 
              style={styles.micBtn}
              onClick={() => sendCommand("MUTE_LIVE_TRACK")}
            >
              {state?.liveTrack?.isMuted ? <MicrophoneOffIcon size={24} color="rgba(255,255,255,0.5)" /> : <MicrophoneIcon size={24} />}
            </button>
            
            <div style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginTop: isPortrait ? 0 : 8, letterSpacing: "0.05em" }}>
              INPUT<br />
              {state?.liveTrack?.isMuted ? "MUTED" : "ACTIVE"}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Faders */}
          <div style={{ ...styles.faderContainer, height: isPortrait ? "60px" : "160px", marginTop: isPortrait ? 0 : "20px", flexDirection: isPortrait ? "row" : "row" }}>
            <div style={{ ...styles.faderWrapper, flexDirection: isPortrait ? "row" : "column", gap: isPortrait ? 8 : 0 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: isPortrait ? 0 : 8 }}>
                {Math.round((state?.liveTrack?.inputGain ?? 1) * 100)}%
              </span>
              <input 
                {...{ orient: "vertical" }}
                type="range" 
                min="0" max="2" step="0.01"
                value={state?.liveTrack?.inputGain ?? 1}
                onChange={(e) => sendCommand("SET_INPUT_GAIN", { gain: parseFloat(e.target.value) })}
                style={{ ...styles.verticalSlider, accentColor: "#818cf8" } as any}
              />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: isPortrait ? 0 : 8 }}>IN</span>
            </div>
            
            <div style={{ ...styles.faderWrapper, flexDirection: isPortrait ? "row" : "column", gap: isPortrait ? 8 : 0, marginLeft: isPortrait ? 16 : 0 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: isPortrait ? 0 : 8 }}>
                {Math.round((state?.liveTrack?.outputGain ?? 1) * 100)}%
              </span>
              <input 
                {...{ orient: "vertical" }}
                type="range"
                min="0" max="2" step="0.01"
                value={state?.liveTrack?.outputGain ?? 1}
                onChange={(e) => sendCommand("SET_OUTPUT_GAIN", { gain: parseFloat(e.target.value) })}
                style={{ ...styles.verticalSlider, accentColor: "#818cf8" } as any}
              />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: isPortrait ? 0 : 8 }}>OUT</span>
            </div>
          </div>
        </div>

        {/* Tracks Grid */}
        <div style={isPortrait ? styles.tracksGridPortrait : styles.tracksGrid}>
          {state?.tracks.map((track, i) => {
            const color = TRACK_COLORS[i % TRACK_COLORS.length];
            const isRec = track.isRecording;
            const isArmed = track.isArmed;
            const stateText = isRec ? "Recording" : isArmed ? "Armed" : track.hasAudio ? "Playing" : "Idle";
            const stateDot = isRec ? "#ef4444" : isArmed ? "#ef4444" : track.hasAudio ? "#22c55e" : color.solid;

            return (
              <div key={i} style={styles.trackCard}>
                
                {/* Header */}
                <div style={styles.trackHeader}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: color.solid, fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>TRACK {i + 1}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>STEREO</span>
                      <span style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "2px" }}>•••</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: stateDot, animation: isRec ? "pulse-ring 1s infinite" : "none" }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{stateText}</span>
                  </div>
                </div>

                {/* Big Center Button */}
                <button 
                  style={{
                    ...styles.trackCenterBtn,
                    background: isRec ? "rgba(239,68,68,0.15)" : "rgba(30, 30, 40, 1)",
                    border: isRec ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                  onClick={() => sendCommand("ARM_TRACK", { trackId: i })}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={isRec ? "#ef4444" : "rgba(255,255,255,0.1)"}>
                    <path d="M7 4v16l14-8L7 4z" />
                  </svg>
                </button>

                {/* Bottom Controls */}
                <div style={styles.trackBottom}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button 
                      style={{ ...styles.msBtn, color: track.isMuted ? "#fca5a5" : "#fff", borderColor: track.isMuted ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)" }}
                      onClick={() => sendCommand("MUTE_TRACK", { trackId: i })}
                    >M</button>
                    <button 
                      style={{ ...styles.msBtn, color: track.isSoloed ? "#fcd34d" : "#fff", borderColor: track.isSoloed ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.1)" }}
                      onClick={() => sendCommand("SOLO_TRACK", { trackId: i })}
                    >S</button>
                  </div>
                  
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "flex-end", paddingLeft: 12 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                      {Math.round((track.outputGain ?? 1) * 100)}%
                    </span>
                    <input 
                      type="range" 
                      className="h-slider"
                      min="0" max="2" step="0.01"
                      value={track.outputGain ?? 1}
                      onChange={(e) => sendCommand("SET_OUTPUT_GAIN", { trackId: i, gain: parseFloat(e.target.value) })}
                      style={{ color: color.solid, accentColor: color.solid } as any}
                    />
                  </div>
                </div>

                {/* Color Bottom Border */}
                <div style={{ height: 4, width: "100%", background: color.solid, borderRadius: 2 }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Toolbar (Transport) ── */}
      <div style={styles.toolbar}>
        <button style={styles.toolBtn} onClick={() => sendCommand("UNDO_LAYER", { trackId: lastArmedTrackId })}>
          <UndoIcon size={24} color="#a78bfa" />
          <span style={{ ...styles.toolBtnText, color: "#a78bfa" }}>UNDO</span>
        </button>
        
        <div style={styles.toolDivider} />
        
        <button style={styles.toolBtn} onClick={() => sendCommand("STOP")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
          <span style={styles.toolBtnText}>STOP</span>
        </button>
        
        <button style={styles.toolBtn} onClick={() => sendCommand("PLAY")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M7 4v16l14-8L7 4z" /></svg>
          <span style={styles.toolBtnText}>PLAY</span>
        </button>
        
        <div style={styles.toolDivider} />
        
        <button 
          style={styles.toolBtn} 
          onClick={() => {
            const nextIdx = Math.min((state?.sections.length ?? 1) - 1, (state?.currentSectionIndex ?? 0) + 1);
            sendCommand("SECTION_CHANGE", { sectionIndex: nextIdx });
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M5 4v16l11-8L5 4zm12 0v16h2V4h-2z"/></svg>
          <span style={styles.toolBtnText}>NEXT</span>
        </button>

        <button style={styles.toolBtn} onClick={handleTapTempo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M10 10.5V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M6 14v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M18 11a6 6 0 0 1 1 12H9.5a6 6 0 0 1-5-3.3L2 14"/>
          </svg>
          <span style={styles.toolBtnText}>TAP TEMPO</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  centerRoot: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    background: "#09090b",
    fontFamily: "Inter, sans-serif",
  },
  spinner: {
    width: 48,
    height: 48,
    border: "3px solid rgba(139, 92, 246, 0.2)",
    borderTop: "3px solid #8b5cf6",
    borderRadius: "50%",
    animation: "connecting-spin 1s linear infinite",
    marginBottom: 24,
  },
  connectingText: { fontSize: 18, fontWeight: 600, color: "#fff" },
  root: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "#111113",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    touchAction: "none",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
  },
  topLeft: { display: "flex", alignItems: "center", gap: "8px" },
  topRight: { display: "flex", alignItems: "center", gap: "16px" },
  statusDot: { width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34, 197, 94, 0.5)" },
  bpmPill: { background: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc", padding: "6px 16px", borderRadius: "20px", fontSize: 14, fontWeight: 700 },
  timeInfo: { fontSize: 14, color: "rgba(255,255,255,0.7)" },
  iconBtn: { background: "rgba(255,255,255,0.05)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  
  mainArea: {
    display: "flex",
    flex: 1,
    padding: "0 24px",
    gap: "24px",
    overflow: "hidden",
  },
  inputColumn: {
    width: 80,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    background: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    padding: "20px 8px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  micBtn: {
    width: 56, height: 56, borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", cursor: "pointer",
  },
  faderContainer: { display: "flex", gap: "12px", height: "160px", marginTop: "20px" },
  faderWrapper: { display: "flex", flexDirection: "column" as const, alignItems: "center", height: "100%" },
  verticalSlider: {
    writingMode: "vertical-lr" as any,
    direction: "rtl" as any,
  },
  
  tracksGrid: {
    display: "flex",
    flex: 1,
    gap: "16px",
    overflowX: "auto" as const,
    paddingBottom: 8,
  },
  tracksGridPortrait: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    gap: "12px",
    flex: 1,
    overflowY: "auto" as const,
    paddingBottom: 8,
  },
  trackCard: {
    flex: 1,
    minWidth: 200,
    display: "flex",
    flexDirection: "column" as const,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    position: "relative" as const,
  },
  trackHeader: { marginBottom: 16 },
  trackCenterBtn: {
    flex: 1,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: 16,
    transition: "background 0.2s",
  },
  trackBottom: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  msBtn: {
    width: 36, height: 36,
    borderRadius: 8,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: 14, fontWeight: 700,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
  },
  
  toolbar: {
    height: 80,
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    padding: "0 24px",
  },
  toolBtn: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    opacity: 0.8,
  },
  toolBtnText: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  toolDivider: {
    width: 1, height: 40, background: "rgba(255,255,255,0.1)"
  }
};
