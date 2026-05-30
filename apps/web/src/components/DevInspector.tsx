import React, { useEffect, useState, useCallback, useRef } from "react";
import { db } from "@live-looper/storage";
import { audioEngine } from "@live-looper/audio-engine";
import { useLooperStore } from "../store/useLooperStore";
import { uiConfirm } from "../store/useDialogStore";
import type {
  ProjectRecord,
  TrackRecord,
  SectionRecord,
  LayerRecord,
  AudioBlobRecord,
} from "@live-looper/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DBSnapshot {
  project: ProjectRecord | null;
  tracks: TrackRecord[];
  sections: SectionRecord[];
  layers: LayerRecord[];
  audioBlobs: AudioBlobRecord[];
  fetchedAt: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const shortId = (id: string) => `${id.slice(0, 6)}…${id.slice(-4)}`;
const bytes = (n: number) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
};
const sec = (samples: number, sr: number) =>
  sr > 0 ? `${(samples / sr).toFixed(2)} s` : "—";
const fmtDate = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "medium",
  });

// ─── Sub-components ────────────────────────────────────────────────────────────

const Tag: React.FC<{ color: string; children: React.ReactNode }> = ({
  color,
  children,
}) => (
  <span
    style={{
      display: "inline-block",
      background: color,
      color: "#0d0d0d",
      fontSize: 10,
      fontWeight: 700,
      padding: "1px 6px",
      borderRadius: 4,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </span>
);

const KV: React.FC<{
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
    <span
      style={{ color: "#6b7280", fontSize: 11, minWidth: 130, flexShrink: 0 }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: mono
          ? '"JetBrains Mono", "Fira Code", monospace'
          : undefined,
        fontSize: 12,
        color: "#e5e7eb",
        wordBreak: "break-all",
      }}
    >
      {value ?? "—"}
    </span>
  </div>
);

const SectionBlock: React.FC<{
  title: string;
  accent: string;
  children: React.ReactNode;
}> = ({ title, accent, children }) => (
  <div
    style={{
      border: `1px solid ${accent}44`,
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 12,
    }}
  >
    <div
      style={{
        background: `${accent}18`,
        padding: "6px 12px",
        borderBottom: `1px solid ${accent}33`,
      }}
    >
      <span
        style={{
          color: accent,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </div>
    <div
      style={{
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {children}
    </div>
  </div>
);

// ─── Play Button ──────────────────────────────────────────────────────────────

interface PlayBtnProps {
  isPlaying: boolean;
  isLoading: boolean;
  disabled: boolean;
  onPlay: () => void;
  onStop: () => void;
}

const PlayBtn: React.FC<PlayBtnProps> = ({
  isPlaying,
  isLoading,
  disabled,
  onPlay,
  onStop,
}) => {
  if (isLoading) {
    return (
      <span
        style={{
          fontSize: 10,
          color: "#6b7280",
          padding: "3px 8px",
          display: "inline-block",
          minWidth: 52,
          textAlign: "center",
        }}
      >
        ⟳ …
      </span>
    );
  }

  return (
    <button
      onClick={isPlaying ? onStop : onPlay}
      disabled={disabled && !isPlaying}
      title={isPlaying ? "Stop" : "Play this layer"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 5,
        fontSize: 10,
        fontFamily: "inherit",
        fontWeight: 700,
        cursor: "pointer",
        border: isPlaying
          ? "1px solid rgba(52,211,153,0.6)"
          : "1px solid rgba(139,92,246,0.4)",
        background: isPlaying
          ? "rgba(52,211,153,0.12)"
          : "rgba(139,92,246,0.12)",
        color: isPlaying ? "#34d399" : "#a78bfa",
        transition: "all 0.15s ease",
        opacity: disabled && !isPlaying ? 0.35 : 1,
        minWidth: 52,
        justifyContent: "center",
        // Pulse ring while playing
        boxShadow: isPlaying ? "0 0 0 2px rgba(52,211,153,0.25)" : "none",
      }}
    >
      {isPlaying ? "■ Stop" : "▶ Play"}
    </button>
  );
};

// ─── Dual Waveform Viewer ──────────────────────────────────────────────────

interface DualWaveformViewerProps {
  blob: AudioBlobRecord;
  rawBlob?: AudioBlobRecord;
  bpm: number;
  timeSignature: string;
}

const DualWaveformViewer: React.FC<DualWaveformViewerProps> = ({
  blob,
  rawBlob,
  bpm,
  timeSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [amp, setAmp] = useState(1);
  const [audioData, setAudioData] = useState<{
    raw: Float32Array | null;
    snapped: Float32Array | null;
  } | null>(null);

  // Effect 1: Decode Audio
  useEffect(() => {
    let mounted = true;
    async function fetchAudio() {
      setLoading(true);
      setError(null);
      try {
        const ctx = audioEngine.context || new AudioContext();

        // Decode both
        const arrayBuffer = await blob.blob.arrayBuffer();
        const decodedBlob = await ctx.decodeAudioData(arrayBuffer);
        const blobData = decodedBlob.getChannelData(0);

        let rawData: Float32Array | null = null;
        if (rawBlob) {
          const rawArrayBuffer = await rawBlob.blob.arrayBuffer();
          const decodedRawBlob = await ctx.decodeAudioData(rawArrayBuffer);
          rawData = decodedRawBlob.getChannelData(0);
        }

        if (mounted) {
          setAudioData({ raw: rawData, snapped: blobData });
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to decode waveforms", err);
        if (mounted) {
          setError("Failed to render audio viewer");
          setLoading(false);
        }
      }
    }
    fetchAudio();
    return () => {
      mounted = false;
    };
  }, [blob, rawBlob]);

  // Effect 2: Draw to Canvas
  useEffect(() => {
    if (!audioData || !canvasRef.current || loading) return;

    const canvas = canvasRef.current;
    const cCtx = canvas.getContext("2d");
    if (!cCtx) return;

    const width = canvas.width; // This will be 800 * zoom
    const height = canvas.height;
    const midY = height / 2;

    cCtx.clearRect(0, 0, width, height);

    // Draw subdivision grid lines first
    const [beatsPerBarStr] = timeSignature.split("/");
    const beatsPerBar = parseInt(beatsPerBarStr, 10) || 4;
    const samplesPerQuarter = blob.sampleRate * (60 / bpm);

    if (samplesPerQuarter > 0 && blob.lengthSamples > 0) {
      const pixelsPerQuarter = width * (samplesPerQuarter / blob.lengthSamples);
      const totalThirtySecondNotes = Math.ceil(
        (blob.lengthSamples / samplesPerQuarter) * 8,
      );

      for (let i = 0; i <= totalThirtySecondNotes; i++) {
        const isBar = i % (beatsPerBar * 8) === 0;
        const isQuarter = i % 8 === 0;
        const isEighth = i % 4 === 0;
        const isSixteenth = i % 2 === 0;

        // Opacity scale as per 1 > 1/4 > 1/8 > 1/16 > 1/32
        if (isBar) cCtx.fillStyle = "rgba(255, 255, 255, 0.35)";
        else if (isQuarter) cCtx.fillStyle = "rgba(255, 255, 255, 0.15)";
        else if (isEighth) cCtx.fillStyle = "rgba(255, 255, 255, 0.08)";
        else if (isSixteenth) cCtx.fillStyle = "rgba(255, 255, 255, 0.04)";
        else cCtx.fillStyle = "rgba(255, 255, 255, 0.02)";

        const x = Math.floor((i / 8) * pixelsPerQuarter);
        if (x > width) break;
        const w = isBar ? 2 : 1;
        cCtx.fillRect(x, 0, w, height);
      }
    }

    // Helper to draw
    const drawBuffer = (data: Float32Array, color: string, alpha: number) => {
      const step = Math.ceil(data.length / width);
      cCtx.fillStyle = color;
      cCtx.globalAlpha = alpha;

      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        const start = i * step;
        const end = Math.min(start + step, data.length);
        for (let j = start; j < end; j++) {
          const val = data[j];
          if (val < min) min = val;
          if (val > max) max = val;
        }

        const yMax = midY - max * amp * midY;
        const yMin = midY - min * amp * midY;
        cCtx.fillRect(i, yMax, 1, Math.max(1, yMin - yMax));
      }
    };

    // Draw raw in background (red-ish)
    if (audioData.raw) {
      drawBuffer(audioData.raw, "#f87171", 0.5);
    }

    // Draw snapped in front (green-ish)
    if (audioData.snapped) {
      drawBuffer(audioData.snapped, "#34d399", 0.8);
    }
  }, [
    audioData,
    zoom,
    amp,
    bpm,
    timeSignature,
    blob.sampleRate,
    blob.lengthSamples,
    loading,
  ]);

  return (
    <div
      style={{
        padding: 12,
        background: "rgba(0,0,0,0.2)",
        borderRadius: 8,
        marginTop: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: 10,
          color: "#9ca3af",
        }}
      >
        <span style={{ fontWeight: 700 }}>Waveform Comparison</span>
        <div style={{ display: "flex", gap: 12 }}>
          {rawBlob && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  background: "#f87171",
                  borderRadius: "50%",
                }}
              />
              Raw (Unquantized)
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                background: "#34d399",
                borderRadius: "50%",
              }}
            />
            Snapped
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginBottom: 4,
          width: "max-content",
          marginLeft: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 4,
            padding: "2px 4px",
          }}
        >
          <span style={{ fontSize: 10, color: "#9ca3af", marginRight: 4 }}>
            Gain:
          </span>
          <button
            disabled={amp <= 0.5}
            onClick={() => setAmp((a) => Math.max(0.5, a - 0.5))}
            title="Decrease waveform amplitude height"
            style={{
              background: "transparent",
              border: "none",
              color: amp > 0.5 ? "#d1d5db" : "#4b5563",
              cursor: amp > 0.5 ? "pointer" : "default",
              padding: "0 4px",
              fontSize: 12,
            }}
          >
            -
          </button>
          <span
            style={{
              width: 30,
              textAlign: "center",
              fontSize: 10,
              color: "#9ca3af",
              lineHeight: "18px",
            }}
          >
            {amp}x
          </span>
          <button
            disabled={amp >= 10}
            onClick={() => setAmp((a) => Math.min(10, a + 0.5))}
            title="Increase waveform amplitude height"
            style={{
              background: "transparent",
              border: "none",
              color: amp < 10 ? "#d1d5db" : "#4b5563",
              cursor: amp < 10 ? "pointer" : "default",
              padding: "0 4px",
              fontSize: 12,
            }}
          >
            +
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 4,
            padding: "2px 4px",
          }}
        >
          <span style={{ fontSize: 10, color: "#9ca3af", marginRight: 4 }}>
            Zoom:
          </span>
          <button
            disabled={zoom <= 1}
            onClick={() => setZoom((z) => Math.max(1, z - 1))}
            title="Decrease waveform zoom"
            style={{
              background: "transparent",
              border: "none",
              color: zoom > 1 ? "#d1d5db" : "#4b5563",
              cursor: zoom > 1 ? "pointer" : "default",
              padding: "0 4px",
              fontSize: 12,
            }}
          >
            -
          </button>
          <span
            style={{
              width: 30,
              textAlign: "center",
              fontSize: 10,
              color: "#9ca3af",
              lineHeight: "18px",
            }}
          >
            {zoom}x
          </span>
          <button
            disabled={zoom >= 10}
            onClick={() => setZoom((z) => Math.min(10, z + 1))}
            title="Increase waveform zoom"
            style={{
              background: "transparent",
              border: "none",
              color: zoom < 10 ? "#d1d5db" : "#4b5563",
              cursor: zoom < 10 ? "pointer" : "default",
              padding: "0 4px",
              fontSize: 12,
            }}
          >
            +
          </button>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: 100,
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 4,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              zIndex: 10,
            }}
          >
            Processing audio for visualization…
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ef4444",
              zIndex: 10,
            }}
          >
            {error}
          </div>
        )}
        <div style={{ width: 800 * zoom, height: "100%" }}>
          <canvas
            ref={canvasRef}
            width={800 * zoom}
            height={100}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              opacity: loading ? 0.3 : 1,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const DevInspector: React.FC = () => {
  const {
    currentProject,
    tracks: storeTracksState,
    sections,
    bpm,
    mode,
    showDevInspector,
  } = useLooperStore();
  const [snap, setSnap] = useState<DBSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  // Playback state
  const [playingLayerId, setPlayingLayerId] = useState<string | null>(null);
  const [loadingLayerId, setLoadingLayerId] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(null);

  const stopCurrent = useCallback(() => {
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch (_) {
        /* already stopped */
      }
      source.disconnect();
    });
    activeSourcesRef.current = [];
    setPlayingLayerId(null);
    setPlayingTrackId(null);
  }, []);

  // Stop playback when panel closes
  useEffect(() => {
    if (!showDevInspector) stopCurrent();
  }, [showDevInspector, stopCurrent]);

  const playLayer = useCallback(
    async (playId: string, blob: AudioBlobRecord) => {
      // Stop whatever is currently playing first
      stopCurrent();

      setLoadingLayerId(playId);
      try {
        // Reuse the engine's AudioContext so we share the same output device
        // and don't need to create a separate context.
        let ctx = audioEngine.context;
        if (!ctx) {
          // Engine hasn't been initialised yet — create a temporary context.
          ctx = new AudioContext();
        }
        if (ctx.state === "suspended") await ctx.resume();

        const arrayBuffer = await blob.blob.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);

        source.onended = () => {
          // Only clear if this specific source is still the active one
          if (activeSourcesRef.current.includes(source)) {
            // Small delay to ensure all sources finished if we had multiple
            setPlayingLayerId(null);
          }
        };

        source.start(0);
        activeSourcesRef.current = [source];
        setPlayingLayerId(playId);
      } catch (e) {
        console.error("[DevInspector] Failed to play layer", e);
        setPlayingLayerId(null);
      } finally {
        setLoadingLayerId(null);
      }
    },
    [stopCurrent],
  );

  const playTrack = useCallback(
    async (trackId: string, layers: LayerRecord[]) => {
      stopCurrent();
      setLoadingTrackId(trackId);
      try {
        const trackBlobs =
          snap?.audioBlobs.filter((b) =>
            layers.some((l) => l.audioBlobId === b.id),
          ) || [];

        if (trackBlobs.length === 0) return;

        let ctx = audioEngine.context;
        if (!ctx) ctx = new AudioContext();
        if (ctx.state === "suspended") await ctx.resume();

        // Decode all buffers
        const buffers = await Promise.all(
          trackBlobs.map(async (b) => {
            const arrayBuffer = await b.blob.arrayBuffer();
            return ctx!.decodeAudioData(arrayBuffer);
          }),
        );

        const sources: AudioBufferSourceNode[] = buffers.map((buffer) => {
          const source = ctx!.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx!.destination);
          return source;
        });

        // Set up onended for the first source to clear state
        if (sources.length > 0) {
          sources[0].onended = () => {
            if (
              activeSourcesRef.current.length > 0 &&
              activeSourcesRef.current[0] === sources[0]
            ) {
              setPlayingTrackId(null);
            }
          };
        }

        sources.forEach((source) => source.start(0));
        activeSourcesRef.current = sources;
        setPlayingTrackId(trackId);
      } catch (e) {
        console.error("[DevInspector] Failed to play track", e);
        setPlayingTrackId(null);
      } finally {
        setLoadingTrackId(null);
      }
    },
    [stopCurrent, snap?.audioBlobs],
  );

  // ── Snapshot fetching ──────────────────────────────────────────────────────

  const fetchSnapshot = useCallback(async () => {
    if (!currentProject?.id) return;
    setLoading(true);
    try {
      const projectId = currentProject.id;
      const [project, tracks, sects, rawLayers, blobs] = await Promise.all([
        db.projects.get(projectId),
        db.tracks.where({ projectId }).sortBy("order"),
        db.sections.where({ projectId }).sortBy("order"),
        db.layers.where({ projectId }).toArray(),
        db.audioBlobs.where({ projectId }).toArray(),
      ]);

      // Sort layers by: track order → section order → layer.order (overdub index)
      // so the table reflects the true recording sequence.
      const trackOrderMap = new Map(tracks.map((t) => [t.id, t.order]));
      const sectionOrderMap = new Map(sects.map((s) => [s.id, s.order]));
      const layers = [...rawLayers].sort((a, b) => {
        const tA = trackOrderMap.get(a.trackId) ?? 999;
        const tB = trackOrderMap.get(b.trackId) ?? 999;
        if (tA !== tB) return tA - tB;
        const sA = sectionOrderMap.get(a.sectionId) ?? 999;
        const sB = sectionOrderMap.get(b.sectionId) ?? 999;
        if (sA !== sB) return sA - sB;
        return a.order - b.order;
      });

      setSnap({
        project: project ?? null,
        tracks,
        sections: sects,
        layers,
        audioBlobs: blobs,
        fetchedAt: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  // Auto-refresh when panel is open
  useEffect(() => {
    if (showDevInspector) {
      fetchSnapshot();
      const interval = setInterval(fetchSnapshot, 3000);
      return () => clearInterval(interval);
    }
  }, [showDevInspector, fetchSnapshot]);

  // Only render in planning mode and when toggled on
  if (mode !== "planning" || !showDevInspector) return null;

  const totalBlobSize =
    snap?.audioBlobs.reduce((acc, b) => acc + b.lengthSamples * 2, 0) ?? 0;

  return (
    <div style={{ marginTop: 24 }}>
      {/* ── Panel ── */}
      <div
        id="dev-inspector-panel"
        style={{
          marginTop: 12,
          background: "#0d0f14",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 12,
          padding: 20,
          fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          fontSize: 12,
          color: "#d1d5db",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scanline texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            borderRadius: 12,
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#6366f1", fontSize: 13, fontWeight: 700 }}>
                ◈ LIVE LOOPER · DEV INSPECTOR
              </span>
              <Tag color="#facc15">PLANNING MODE</Tag>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {(playingLayerId || playingTrackId) && (
                <span
                  style={{
                    color: "#34d399",
                    fontSize: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    animation: "none",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#34d399",
                      boxShadow: "0 0 6px #34d399",
                    }}
                  />
                  PLAYING {playingTrackId ? "TRACK" : "LAYER"}
                </span>
              )}
              {snap && (
                <span style={{ color: "#4b5563", fontSize: 10 }}>
                  fetched {fmtDate(snap.fetchedAt)}
                </span>
              )}
              <button
                onClick={fetchSnapshot}
                disabled={loading}
                title="Refresh Dev Inspector snapshot from IndexedDB"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  borderRadius: 6,
                  color: "#a5b4fc",
                  fontSize: 11,
                  fontFamily: "inherit",
                  padding: "3px 10px",
                  cursor: "pointer",
                }}
              >
                {loading ? "⟳ …" : "↺ Refresh"}
              </button>
            </div>
          </div>

          {!currentProject ? (
            <div style={{ color: "#6b7280", padding: 20, textAlign: "center" }}>
              No project loaded. Open a project to inspect.
            </div>
          ) : !snap ? (
            <div style={{ color: "#6b7280", padding: 20, textAlign: "center" }}>
              {loading
                ? "Loading IndexedDB snapshot…"
                : "Click Refresh to load snapshot."}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {/* ── Left Column ── */}
              <div>
                <SectionBlock title="📁 Project · IndexedDB" accent="#6366f1">
                  <KV label="id" value={snap.project?.id} mono />
                  <KV label="name" value={snap.project?.name} />
                  <KV label="bpm" value={`${snap.project?.bpm} BPM`} />
                  <KV
                    label="timeSignature"
                    value={snap.project?.timeSignature}
                  />
                  <KV
                    label="schemaVersion"
                    value={snap.project?.schemaVersion}
                  />
                  <KV label="appVersion" value={snap.project?.appVersion} />
                  <KV
                    label="smartSnapEnabled"
                    value={
                      snap.project?.settings?.smartSnapEnabled
                        ? "true"
                        : "false"
                    }
                  />
                  <KV
                    label="createdAt"
                    value={
                      snap.project ? fmtDate(snap.project.createdAt) : undefined
                    }
                  />
                  <KV
                    label="updatedAt"
                    value={
                      snap.project ? fmtDate(snap.project.updatedAt) : undefined
                    }
                  />
                  <KV
                    label="masterLengthSamples"
                    value={snap.project?.masterLengthSamples}
                  />
                </SectionBlock>

                <SectionBlock title="⚡ Store State · Zustand" accent="#f59e0b">
                  <KV label="mode" value={<Tag color="#facc15">{mode}</Tag>} />
                  <KV label="bpm" value={`${bpm} BPM`} />
                  <KV label="sections.length" value={sections.length} />
                  {sections.map((s, i) => (
                    <KV
                      key={i}
                      label={`  section[${i}] ${s.name}`}
                      value={`${s.lengthInBars} bars`}
                    />
                  ))}
                  {storeTracksState.map((t, i) => (
                    <KV
                      key={i}
                      label={`  track[${i}]`}
                      value={
                        <span>
                          {t.hasAudio ? (
                            <Tag color="#4ade80">audio</Tag>
                          ) : (
                            <Tag color="#374151">empty</Tag>
                          )}{" "}
                          {t.isMuted && <Tag color="#ef4444">muted</Tag>}
                          {t.isRecording && <Tag color="#f87171">REC</Tag>}{" "}
                          layers: {t.layerCount}
                        </span>
                      }
                    />
                  ))}
                </SectionBlock>
              </div>

              {/* ── Right Column ── */}
              <div>
                <SectionBlock
                  title={`🎛  Tracks · ${snap.tracks.length}`}
                  accent="#10b981"
                >
                  {snap.tracks.map((t) => {
                    const trackLayers = snap.layers.filter(
                      (l) => l.trackId === t.id,
                    );
                    const activeLayers = trackLayers.filter(
                      (l) => !l.deletedAt,
                    );
                    return (
                      <div
                        key={t.id}
                        style={{
                          padding: "8px 10px",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 6,
                          border: `1px solid ${t.color}33`,
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: t.color,
                              flexShrink: 0,
                              display: "inline-block",
                            }}
                          />
                          <span
                            style={{
                              color: "#f9fafb",
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {t.name}
                          </span>
                          {t.muted && <Tag color="#ef4444">muted</Tag>}
                          {t.solo && <Tag color="#f59e0b">solo</Tag>}

                          <div
                            style={{
                              marginLeft: "auto",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <PlayBtn
                              isPlaying={playingTrackId === t.id}
                              isLoading={loadingTrackId === t.id}
                              disabled={
                                !!playingLayerId ||
                                (!!playingTrackId && playingTrackId !== t.id) ||
                                activeLayers.length === 0
                              }
                              onPlay={() => playTrack(t.id, activeLayers)}
                              onStop={stopCurrent}
                            />
                            <span style={{ color: "#6b7280", fontSize: 10 }}>
                              {trackLayers.length} layer
                              {trackLayers.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <div style={{ color: "#6b7280", fontSize: 10 }}>
                          id: {shortId(t.id)}
                        </div>
                      </div>
                    );
                  })}
                </SectionBlock>

                <SectionBlock
                  title={`📐 Sections · ${snap.sections.length}`}
                  accent="#3b82f6"
                >
                  {snap.sections.map((s) => {
                    const sectionLayers = snap.layers.filter(
                      (l) => l.sectionId === s.id,
                    );
                    return (
                      <div
                        key={s.id}
                        style={{
                          padding: "8px 10px",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 6,
                          border: "1px solid rgba(59,130,246,0.2)",
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ color: "#f9fafb", fontWeight: 700 }}>
                            {s.name}
                          </span>
                          <Tag color="#60a5fa">
                            {s.lengthInBars ?? "?"} bars
                          </Tag>
                          <span
                            style={{
                              color: "#6b7280",
                              fontSize: 10,
                              marginLeft: "auto",
                            }}
                          >
                            {sectionLayers.length} layer
                            {sectionLayers.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <KV
                          label="lengthSamples"
                          value={
                            s.lengthSamples > 0
                              ? s.lengthSamples.toLocaleString()
                              : "not set"
                          }
                        />
                        <div style={{ color: "#6b7280", fontSize: 10 }}>
                          id: {shortId(s.id)}
                        </div>
                      </div>
                    );
                  })}
                </SectionBlock>
              </div>

              {/* ── Full-width: Layers + Blobs ── */}
              <div style={{ gridColumn: "1 / -1" }}>
                <SectionBlock
                  title={`🎵 Layers · ${snap.layers.length} · Audio Blobs · ${snap.audioBlobs.length} · Total ~${bytes(totalBlobSize)}`}
                  accent="#8b5cf6"
                >
                  {snap.layers.length === 0 ? (
                    <span style={{ color: "#6b7280" }}>
                      No layers recorded yet.
                    </span>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: 11,
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              color: "#6b7280",
                              textAlign: "left",
                              borderBottom: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            <th style={{ padding: "4px 8px" }}>play</th>
                            <th style={{ padding: "4px 8px" }}>layer id</th>
                            <th style={{ padding: "4px 8px" }}>track</th>
                            <th style={{ padding: "4px 8px" }}>section</th>
                            <th style={{ padding: "4px 8px" }}>order</th>
                            <th style={{ padding: "4px 8px" }}>gain</th>
                            <th style={{ padding: "4px 8px" }}>blob id</th>
                            <th style={{ padding: "4px 8px" }}>sr</th>
                            <th style={{ padding: "4px 8px" }}>samples</th>
                            <th style={{ padding: "4px 8px" }}>duration</th>
                            <th style={{ padding: "4px 8px" }}>est. size</th>
                            <th style={{ padding: "4px 8px" }}>actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snap.layers.map((layer) => {
                            const blob = snap.audioBlobs.find(
                              (b) => b.id === layer.audioBlobId,
                            );
                            const rawBlob = layer.rawAudioBlobId
                              ? snap.audioBlobs.find(
                                  (b) => b.id === layer.rawAudioBlobId,
                                )
                              : undefined;
                            const track = snap.tracks.find(
                              (t) => t.id === layer.trackId,
                            );
                            const section = snap.sections.find(
                              (s) => s.id === layer.sectionId,
                            );
                            const estimatedSize =
                              (blob ? blob.lengthSamples * 2 : 0) +
                              (rawBlob ? rawBlob.lengthSamples * 2 : 0);
                            const isThisPlaying = playingLayerId === layer.id;
                            const isThisPlayingRaw =
                              playingLayerId === `${layer.id}-raw`;
                            const isThisLoading = loadingLayerId === layer.id;
                            const isThisLoadingRaw =
                              loadingLayerId === `${layer.id}-raw`;
                            const isAnotherPlaying =
                              (!!playingLayerId &&
                                !isThisPlaying &&
                                !isThisPlayingRaw) ||
                              !!playingTrackId;

                            return (
                              <React.Fragment key={layer.id}>
                                <tr
                                  style={{
                                    borderBottom:
                                      "1px solid rgba(255,255,255,0.04)",
                                    color: "#d1d5db",
                                    background:
                                      isThisPlaying || isThisPlayingRaw
                                        ? "rgba(52,211,153,0.06)"
                                        : "transparent",
                                    transition: "background 0.2s",
                                  }}
                                >
                                  {/* Play / Stop button */}
                                  <td
                                    style={{
                                      padding: "5px 8px",
                                      display: "flex",
                                      gap: 4,
                                    }}
                                  >
                                    <PlayBtn
                                      isPlaying={isThisPlaying}
                                      isLoading={isThisLoading}
                                      disabled={isAnotherPlaying || !blob}
                                      onPlay={() =>
                                        blob && playLayer(layer.id, blob)
                                      }
                                      onStop={stopCurrent}
                                    />
                                    {rawBlob && (
                                      <div
                                        style={{ marginLeft: 4 }}
                                        title="Play Raw (Unsnapped)"
                                      >
                                        <PlayBtn
                                          isPlaying={isThisPlayingRaw}
                                          isLoading={isThisLoadingRaw}
                                          disabled={
                                            isAnotherPlaying || !rawBlob
                                          }
                                          onPlay={() =>
                                            rawBlob &&
                                            playLayer(
                                              `${layer.id}-raw`,
                                              rawBlob,
                                            )
                                          }
                                          onStop={stopCurrent}
                                        />
                                      </div>
                                    )}
                                  </td>

                                  <td
                                    style={{
                                      padding: "5px 8px",
                                      color: "#a78bfa",
                                      fontFamily: "monospace",
                                    }}
                                  >
                                    {shortId(layer.id)}
                                    {layer.deletedAt && (
                                      <div style={{ marginTop: 2 }}>
                                        <Tag color="#ef4444">UNDO-ED</Tag>
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ padding: "5px 8px" }}>
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                      }}
                                    >
                                      {track && (
                                        <span
                                          style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            background: track.color,
                                            display: "inline-block",
                                          }}
                                        />
                                      )}
                                      {track?.name ?? shortId(layer.trackId)}
                                    </span>
                                  </td>
                                  <td style={{ padding: "5px 8px" }}>
                                    {section?.name ?? shortId(layer.sectionId)}
                                  </td>
                                  <td
                                    style={{
                                      padding: "5px 8px",
                                      color: "#6b7280",
                                    }}
                                  >
                                    {layer.order}
                                  </td>
                                  <td style={{ padding: "5px 8px" }}>
                                    {layer.gain.toFixed(2)}
                                  </td>
                                  <td
                                    style={{
                                      padding: "5px 8px",
                                      color: "#7c3aed",
                                      fontFamily: "monospace",
                                    }}
                                  >
                                    <div>
                                      {blob ? (
                                        shortId(blob.id)
                                      ) : (
                                        <span style={{ color: "#ef4444" }}>
                                          missing!
                                        </span>
                                      )}
                                    </div>
                                    {layer.rawAudioBlobId && (
                                      <div
                                        style={{
                                          marginTop: 2,
                                          color: "#f59e0b",
                                        }}
                                        title="Raw Audio Blob"
                                      >
                                        {rawBlob ? (
                                          shortId(rawBlob.id)
                                        ) : (
                                          <span style={{ color: "#ef4444" }}>
                                            missing raw!
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td
                                    style={{
                                      padding: "5px 8px",
                                      color: "#6b7280",
                                    }}
                                  >
                                    {blob?.sampleRate ?? "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "5px 8px",
                                      color: "#6b7280",
                                    }}
                                  >
                                    {blob?.lengthSamples.toLocaleString() ??
                                      "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "5px 8px",
                                      color: "#34d399",
                                    }}
                                  >
                                    {blob
                                      ? sec(blob.lengthSamples, blob.sampleRate)
                                      : "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "5px 8px",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    {blob ? bytes(estimatedSize) : "—"}
                                  </td>
                                  <td style={{ padding: "5px 8px" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                      <button
                                        onClick={() =>
                                          setExpandedLayerId(
                                            expandedLayerId === layer.id
                                              ? null
                                              : layer.id,
                                          )
                                        }
                                        title={
                                          expandedLayerId === layer.id
                                            ? "Hide waveform comparison"
                                            : "Show waveform comparison"
                                        }
                                        style={{
                                          background:
                                            expandedLayerId === layer.id
                                              ? "rgba(99,102,241,0.2)"
                                              : "rgba(255,255,255,0.05)",
                                          border:
                                            expandedLayerId === layer.id
                                              ? "1px solid rgba(99,102,241,0.4)"
                                              : "1px solid rgba(255,255,255,0.1)",
                                          borderRadius: 4,
                                          color:
                                            expandedLayerId === layer.id
                                              ? "#a5b4fc"
                                              : "#d1d5db",
                                          fontSize: 10,
                                          padding: "2px 6px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {expandedLayerId === layer.id
                                          ? "Hide View"
                                          : "View"}
                                      </button>
                                      <button
                                        onClick={async () => {
                                          const confirmed = await uiConfirm(
                                            `Are you sure you want to PERMANENTLY delete layer ${layer.id} and its audio blob? This cannot be undone.`,
                                            "Permanent Deletion",
                                            {
                                              danger: true,
                                              confirmText: "Delete",
                                            },
                                          );
                                          if (confirmed) {
                                            useLooperStore
                                              .getState()
                                              .deleteLayer(layer.id);
                                          }
                                        }}
                                        title="Permanently delete this layer from database"
                                        style={{
                                          background: "rgba(239, 68, 68, 0.1)",
                                          border:
                                            "1px solid rgba(239, 68, 68, 0.3)",
                                          borderRadius: 4,
                                          color: "#ef4444",
                                          fontSize: 10,
                                          padding: "2px 6px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                {expandedLayerId === layer.id && blob && (
                                  <tr>
                                    <td
                                      colSpan={12}
                                      style={{
                                        padding: "0 8px 8px 8px",
                                        borderBottom:
                                          "1px solid rgba(255,255,255,0.04)",
                                      }}
                                    >
                                      <DualWaveformViewer
                                        blob={blob}
                                        rawBlob={rawBlob}
                                        bpm={snap.project?.bpm || bpm}
                                        timeSignature={
                                          snap.project?.timeSignature || "4/4"
                                        }
                                      />
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionBlock>
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: 8,
              paddingTop: 8,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "#374151",
              fontSize: 10,
              textAlign: "right",
            }}
          >
            live-looper-db · IndexedDB · auto-refreshes every 3s while open ·
            layer playback via Web Audio API
          </div>
        </div>
      </div>
    </div>
  );
};
