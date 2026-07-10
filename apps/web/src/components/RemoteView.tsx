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

/* ── Metro tile colors ── */
const TRACK_COLORS = [
  "#818cf8", // indigo
  "#22d3ee", // cyan
  "#fbbf24", // amber
  "#f472b6", // pink
];

const CSS = `
@keyframes pulse-rec { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes spin { to{transform:rotate(360deg)} }
*{box-sizing:border-box;margin:0;padding:0}
html,body{margin:0;padding:0;overflow-x:hidden;background:#000}
:root{--app-h:100dvh}
@supports not (height:100dvh){:root{--app-h:100vh}}

input[type=range].vol{
  -webkit-appearance:none;appearance:none;
  width:100%;height:3px;background:rgba(255,255,255,.15);border-radius:2px;outline:none;
}
input[type=range].vol::-webkit-slider-thumb{
  -webkit-appearance:none;appearance:none;
  width:14px;height:14px;border-radius:50%;background:currentColor;cursor:pointer;
}
`;

function haptic(p: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(p);
}

/* ── Tile: a single tappable Metro-style block ── */
const Tile: React.FC<{
  bg?: string; color?: string; accent?: string;
  flex?: number | string; onClick?: () => void;
  style?: React.CSSProperties; children: React.ReactNode;
}> = ({ bg = "rgba(255,255,255,0.04)", color = "#fff", accent, flex = 1, onClick, style, children }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end",
      flex, background: bg, color, border: "none", borderRadius: 0, padding: 10,
      cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden",
      fontFamily: "Inter, system-ui, sans-serif", textAlign: "left",
      WebkitTapHighlightColor: "transparent", userSelect: "none",
      ...style,
    }}
  >
    {children}
    {accent && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: accent }} />}
  </button>
);

export const RemoteView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionCode = searchParams.get("session");
  const [status, setStatus] = useState<RemoteConnectionStatus>("disconnected");
  const [state, setState] = useState<RemoteSyncState | null>(null);
  const clientRef = useRef<RemoteClient | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastArmedTrackId, setLastArmedTrackId] = useState(0);
  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    const update = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      document.documentElement.style.setProperty("--app-h", `${window.innerHeight}px`);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => { window.removeEventListener("resize", update); window.removeEventListener("orientationchange", update); };
  }, []);

  useEffect(() => {
    if (state?.tracks) {
      const idx = state.tracks.findIndex(t => t.isArmed || t.isRecording);
      if (idx !== -1) setLastArmedTrackId(idx);
    }
  }, [state?.tracks]);

  useEffect(() => {
    if (!sessionCode) return;
    const signaling = new HTTPSignalingChannel(sessionCode, false, import.meta.env.VITE_SIGNAL_SERVER_URL);
    const transport = new WebRTCTransport();
    const client = new RemoteClient(transport);
    clientRef.current = client;
    client.on("connection-change", setStatus);
    client.on("state", setState);
    client.connect({ signaling, isInitiator: false }).catch(() => setStatus("error"));
    return () => { client.disconnect(); clientRef.current = null; };
  }, [sessionCode]);

  const send = (type: RemoteCommandType, payload?: Record<string, unknown>) => {
    haptic(15);
    clientRef.current?.sendCommand(type, payload);
  };

  const handleTapTempo = () => {
    const now = Date.now();
    let times = tapTimesRef.current;
    if (times.length > 0 && now - times[times.length - 1] > 2000) times = [];
    times.push(now);
    if (times.length > 4) times.shift();
    tapTimesRef.current = times;
    if (times.length > 1) {
      const intervals = times.slice(1).map((t, i) => t - times[i]);
      const bpm = Math.round(60000 / (intervals.reduce((a, b) => a + b, 0) / intervals.length));
      if (bpm >= 40 && bpm <= 300) send("SET_BPM", { bpm });
    }
    haptic([15, 30]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.warn(e));
    } else {
      document.exitFullscreen().catch(e => console.warn(e));
    }
  };

  // ── Loading / Error ──
  if (!sessionCode || status === "connecting" || status === "disconnected" || status === "error") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100vw", height: "var(--app-h, 100vh)", background: "#000", fontFamily: "Inter, system-ui, sans-serif", color: "#fff" }}>
        <style>{CSS}</style>
        {status === "error" ? (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 300 }}>connection failed</div>
          </>
        ) : (
          <>
            <div style={{ width: 36, height: 36, border: "2px solid rgba(255,255,255,0.1)", borderTop: "2px solid #818cf8", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 16 }} />
            <div style={{ fontSize: 14, fontWeight: 300, letterSpacing: "0.1em" }}>connecting…</div>
          </>
        )}
      </div>
    );
  }

  const tracks = state?.tracks ?? [];
  const bpm = state?.bpm ?? 120;
  const bar = state?.currentBar ?? 1;
  const beat = state?.currentBeat ?? 1;
  const liveMuted = state?.liveTrack?.isMuted ?? false;
  const isPlaying = state?.isPlaying ?? false;
  const G = 2; // gap between tiles in px

  // ── Portrait: vertical tile grid ──
  if (isPortrait) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "var(--app-h, 100vh)", overflowX: "hidden", background: "#000", color: "#fff", fontFamily: "Inter, system-ui, sans-serif", touchAction: "manipulation" }}>
        <style>{CSS}</style>

        {/* Status strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 10, fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>bar {bar} · beat {beat}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8" }}>{bpm}</span>
            <button onClick={toggleFullscreen} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", padding: "0 4px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                {isFullscreen ? (
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                ) : (
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 2x2 track grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: G, padding: `0 ${G}px`, overflow: "hidden" }}>
          {tracks.map((track, i) => {
            const c = TRACK_COLORS[i % TRACK_COLORS.length];
            const isRec = track.isRecording;
            const isArmed = track.isArmed;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: G, overflow: "hidden" }}>
                {/* Arm tile — big */}
                <Tile
                  flex={3} accent={c}
                  bg={isRec ? "rgba(239,68,68,0.15)" : isArmed ? `${c}25` : `${c}10`}
                  onClick={() => send("ARM_TRACK", { trackId: i })}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <span style={{ fontSize: 20, fontWeight: 100, color: c, position: "absolute", top: 6, left: 10 }}>
                    {i + 1}
                  </span>
                  {isRec ? (
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#ef4444", animation: "pulse-rec 1s infinite" }} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isArmed ? c : "rgba(255,255,255,0.1)"}><path d="M7 4v16l14-8L7 4z" /></svg>
                  )}
                  {track.layerCount > 0 && (
                    <span style={{ position: "absolute", top: 6, right: 10, fontSize: 10, fontWeight: 300, color: "rgba(255,255,255,0.3)" }}>×{track.layerCount}</span>
                  )}
                </Tile>
                {/* M / S row */}
                <div style={{ display: "flex", gap: G, flex: 2 }}>
                  <Tile
                    flex={1}
                    bg={track.isMuted ? "rgba(239,68,68,0.2)" : undefined}
                    onClick={() => send("MUTE_TRACK", { trackId: i })}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: track.isMuted ? "#fca5a5" : "rgba(255,255,255,0.3)" }}>M</span>
                  </Tile>
                  <Tile
                    flex={1}
                    bg={track.isSoloed ? "rgba(251,191,36,0.2)" : undefined}
                    onClick={() => send("SOLO_TRACK", { trackId: i })}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: track.isSoloed ? "#fcd34d" : "rgba(255,255,255,0.3)" }}>S</span>
                  </Tile>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transport row */}
        <div style={{ display: "flex", gap: G, padding: `${G}px ${G}px`, flexShrink: 0 }}>
          <Tile onClick={() => send("UNDO_LAYER", { trackId: lastArmedTrackId })} style={{ alignItems: "center", justifyContent: "center", padding: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#a78bfa" }}>UNDO</span>
          </Tile>
          <Tile onClick={() => send(isPlaying ? "STOP" : "PLAY")} bg={isPlaying ? "rgba(139,92,246,0.15)" : undefined} style={{ alignItems: "center", justifyContent: "center", padding: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: isPlaying ? "#a78bfa" : "#fff" }}>{isPlaying ? "STOP" : "PLAY"}</span>
          </Tile>
          <Tile onClick={() => { const n = Math.min((state?.sections.length ?? 1) - 1, (state?.currentSectionIndex ?? 0) + 1); send("SECTION_CHANGE", { sectionIndex: n }); }} style={{ alignItems: "center", justifyContent: "center", padding: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>NEXT</span>
          </Tile>
          <Tile onClick={() => send("MUTE_LIVE_TRACK")} bg={liveMuted ? "rgba(239,68,68,0.12)" : undefined} style={{ alignItems: "center", justifyContent: "center", padding: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: liveMuted ? "#fca5a5" : "rgba(255,255,255,0.5)" }}>MIC</span>
          </Tile>
        </div>
      </div>
    );
  }

  // ── Landscape: Metro tile grid ──
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "var(--app-h, 100vh)", overflowX: "hidden", background: "#000", color: "#fff", fontFamily: "Inter, system-ui, sans-serif", touchAction: "manipulation" }}>
      <style>{CSS}</style>

      {/* Top status — pure typographic */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "4px 10px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: 10, fontWeight: 300, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>live looper</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8" }}>{bpm}</span>
          <span style={{ fontSize: 10, fontWeight: 300, color: "rgba(255,255,255,0.35)" }}>bar {bar} · beat {beat}</span>
          <button onClick={toggleFullscreen} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", padding: "0 4px", cursor: "pointer", display: "flex", alignItems: "center", transform: "translateY(2px)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              {isFullscreen ? (
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              ) : (
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Main tile grid */}
      <div style={{ flex: 1, display: "flex", gap: G, padding: `0 ${G}px`, overflow: "hidden" }}>

        {/* Left column: Transport tiles stacked vertically */}
        <div style={{ display: "flex", flexDirection: "column", gap: G, width: 64, flexShrink: 0 }}>
          <Tile
            flex={2} onClick={() => send(isPlaying ? "STOP" : "PLAY")}
            bg={isPlaying ? "rgba(139,92,246,0.15)" : undefined}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#a78bfa"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M7 4v16l14-8L7 4z" /></svg>
            )}
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", marginTop: 4, color: isPlaying ? "#a78bfa" : "rgba(255,255,255,0.5)" }}>
              {isPlaying ? "STOP" : "PLAY"}
            </span>
          </Tile>
          <Tile flex={1} onClick={() => send("UNDO_LAYER", { trackId: lastArmedTrackId })} style={{ alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 300, color: "#a78bfa" }}>↩</span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", marginTop: 2, color: "#a78bfa" }}>UNDO</span>
          </Tile>
          <Tile
            flex={1}
            onClick={() => send("MUTE_LIVE_TRACK")}
            bg={liveMuted ? "rgba(239,68,68,0.12)" : undefined}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ fontSize: 12 }}>{liveMuted ? "🔇" : "🎤"}</span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", marginTop: 2, color: liveMuted ? "#fca5a5" : "rgba(255,255,255,0.5)" }}>MIC</span>
          </Tile>
        </div>

        {/* Track columns */}
        {tracks.map((track, i) => {
          const c = TRACK_COLORS[i % TRACK_COLORS.length];
          const isRec = track.isRecording;
          const isArmed = track.isArmed;

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", flex: 1, gap: G, overflow: "hidden" }}>
              {/* Arm/Record tile — large */}
              <Tile
                flex={3} accent={c}
                bg={isRec ? "rgba(239,68,68,0.15)" : isArmed ? `${c}25` : `${c}10`}
                onClick={() => send("ARM_TRACK", { trackId: i })}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {/* Track number — top-left typographic label */}
                <span style={{ position: "absolute", top: 6, left: 10, fontSize: 22, fontWeight: 100, color: c, lineHeight: 1 }}>
                  {i + 1}
                </span>

                {/* Status — top-right */}
                <span style={{ position: "absolute", top: 8, right: 10, fontSize: 9, fontWeight: 300, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
                  {isRec ? "REC" : isArmed ? "ARM" : track.hasAudio ? "PLAY" : "—"}
                  {track.layerCount > 0 && ` ×${track.layerCount}`}
                </span>

                {/* Center icon */}
                {isRec ? (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#ef4444", animation: "pulse-rec 1s infinite" }} />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={isArmed ? c : "rgba(255,255,255,0.08)"}><path d="M7 4v16l14-8L7 4z" /></svg>
                )}
              </Tile>

              {/* M / S — equal tiles side by side */}
              <div style={{ display: "flex", gap: G, flex: 2 }}>
                <Tile
                  flex={1}
                  bg={track.isMuted ? "rgba(239,68,68,0.2)" : undefined}
                  onClick={() => send("MUTE_TRACK", { trackId: i })}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: track.isMuted ? "#fca5a5" : "rgba(255,255,255,0.25)" }}>M</span>
                </Tile>
                <Tile
                  flex={1}
                  bg={track.isSoloed ? "rgba(251,191,36,0.2)" : undefined}
                  onClick={() => send("SOLO_TRACK", { trackId: i })}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: track.isSoloed ? "#fcd34d" : "rgba(255,255,255,0.25)" }}>S</span>
                </Tile>
              </div>

              {/* Volume — thin strip at bottom */}
              <div style={{ padding: "4px 6px", background: "rgba(255,255,255,0.02)", flexShrink: 0 }}>
                <input
                  type="range" className="vol" min="0" max="2" step="0.01"
                  value={track.outputGain ?? 1}
                  onChange={(e) => send("SET_OUTPUT_GAIN", { trackId: i, gain: parseFloat(e.target.value) })}
                  style={{ color: c } as any}
                />
              </div>
            </div>
          );
        })}

        {/* Right column: Next + Tap Tempo */}
        <div style={{ display: "flex", flexDirection: "column", gap: G, width: 56, flexShrink: 0 }}>
          <Tile
            flex={1}
            onClick={() => { const n = Math.min((state?.sections.length ?? 1) - 1, (state?.currentSectionIndex ?? 0) + 1); send("SECTION_CHANGE", { sectionIndex: n }); }}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M5 4v16l11-8L5 4zm12 0v16h2V4h-2z"/></svg>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", marginTop: 4, color: "rgba(255,255,255,0.5)" }}>NEXT</span>
          </Tile>
          <Tile
            flex={1}
            onClick={handleTapTempo}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ fontSize: 16 }}>👋</span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", marginTop: 4, color: "rgba(255,255,255,0.5)" }}>TAP</span>
          </Tile>
        </div>
      </div>

      {/* Bottom gutter — just breathing room */}
      <div style={{ height: G }} />
    </div>
  );
};
