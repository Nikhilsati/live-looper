import { useState, useEffect, useCallback } from "react";
import { LayersIcon, XIcon } from "@live-looper/icons";
import { useLooperStore } from "../../store";
import { db } from "@live-looper/storage";
import { audioEngine } from "@live-looper/audio-engine";
import type { LayerRecord } from "@live-looper/types";

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
