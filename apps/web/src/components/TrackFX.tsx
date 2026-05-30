import React from "react";
import { createPortal } from "react-dom";
import { useLooperStore } from "../store/useLooperStore";
import { Card, Row, Heading, Switch, Button, Knob } from "@live-looper/ui";
import {
  XIcon,
  SlidersIcon,
  TrashIcon,
  FloppyDiskIcon,
  DownloadSimpleIcon,
  UploadSimpleIcon,
  FilePlusIcon,
} from "@phosphor-icons/react";
import {
  ListIcon,
  PowerIcon,
  NoiseGateIcon,
  EffectEqIcon,
  CompressorIcon,
  DriveIcon,
  ChorusIcon,
  PhaserIcon,
  TremoloIcon,
  DelayIcon,
  ReverbIcon,
} from "@live-looper/icons";
import type { FXState } from "@live-looper/types";

interface TrackFXProps {
  trackId: number | "live";
  onClose?: () => void;
  fullSize?: boolean;
}

const PresetMenu = ({
  type,
  moduleType,
  currentFxState,
  onLoad,
}: {
  type: "chain" | "module";
  moduleType?: string;
  currentFxState: any;
  onLoad: (fxState: any) => void;
}) => {
  const {
    fxPresets,
    saveFXPreset,
    deleteFXPreset,
    exportFXPreset,
    importFXPreset,
  } = useLooperStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [menuPos, setMenuPos] = React.useState({ top: 0, left: 0 });

  const presets = fxPresets.filter(
    (p) => p.type === type && (type === "chain" || p.moduleType === moduleType),
  );

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Default alignment is left-aligned with button. Adjust if it goes offscreen right
      let leftPos = rect.left;
      if (leftPos + 170 > window.innerWidth) {
        leftPos = window.innerWidth - 180;
      }
      setMenuPos({ top: rect.bottom + 4, left: leftPos });
    }
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true); // Use capture phase to catch scrolls in any scrollable container
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const handleSave = () => {
    const name = prompt("Enter preset name:");
    if (name) {
      saveFXPreset(name, type, currentFxState, moduleType);
      setIsOpen(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importFXPreset(file);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        className="ghost small"
        onClick={toggleMenu}
        style={{
          padding: "4px",
          height: 24,
          width: 24,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.05)",
        }}
        title="Presets"
      >
        <ListIcon
          size={14}
          style={{ color: isOpen ? "var(--primary, #a881ff)" : "inherit" }}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="card"
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              width: 170,
              padding: "8px 4px",
              zIndex: 9999, // Ensure it's above everything
              background: "rgba(20, 18, 24, 0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              borderRadius: 8,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            {/* Top Actions Row */}
            <Row style={{ justifyContent: "space-evenly", padding: "0 4px" }}>
              <Button
                variant="ghost"
                style={{
                  flexDirection: "column",
                  gap: 4,
                  padding: "4px 8px",
                  height: "auto",
                  background: "transparent",
                }}
                onClick={handleSave}
                title="Save current configuration as a preset"
              >
                <FloppyDiskIcon size={16} weight="regular" />
                <span
                  style={{
                    fontSize: 10,
                    opacity: 0.8,
                    letterSpacing: "0.02em",
                  }}
                >
                  Save
                </span>
              </Button>
              <Button
                variant="ghost"
                style={{
                  flexDirection: "column",
                  gap: 4,
                  padding: "4px 8px",
                  height: "auto",
                  background: "transparent",
                }}
                onClick={() => fileInputRef.current?.click()}
                title="Import preset from a JSON file"
              >
                <UploadSimpleIcon size={16} weight="regular" />
                <span
                  style={{
                    fontSize: 10,
                    opacity: 0.8,
                    letterSpacing: "0.02em",
                  }}
                >
                  Import
                </span>
              </Button>
              <Button
                variant="ghost"
                style={{
                  flexDirection: "column",
                  gap: 4,
                  padding: "4px 8px",
                  height: "auto",
                  background: "transparent",
                }}
                onClick={handleSave}
                title="Create a new blank preset"
              >
                <FilePlusIcon size={16} weight="regular" />
                <span
                  style={{
                    fontSize: 10,
                    opacity: 0.8,
                    letterSpacing: "0.02em",
                  }}
                >
                  New
                </span>
              </Button>
            </Row>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImport}
              style={{ display: "none" }}
            />

            {presets.length > 0 && (
              <>
                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.06)",
                    margin: "2px 10px",
                  }}
                />
                <div
                  style={{
                    maxHeight: 180,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {presets.map((p) => {
                    const isActive =
                      JSON.stringify(p.fxState) ===
                      JSON.stringify(currentFxState);
                    return (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 8px",
                          borderRadius: 6,
                          cursor: "pointer",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.04)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                        onClick={() => {
                          onLoad(p.fxState);
                          setIsOpen(false);
                        }}
                      >
                        <Row
                          style={{
                            alignItems: "center",
                            gap: 8,
                            overflow: "hidden",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              color: isActive
                                ? "#a881ff"
                                : "rgba(255,255,255,0.85)",
                            }}
                          >
                            {p.name}
                          </span>
                        </Row>
                        <Row
                          style={{ gap: 2 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            style={{
                              padding: 4,
                              height: "auto",
                              background: "transparent",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              exportFXPreset(p.id);
                            }}
                            title="Export preset to file"
                          >
                            <DownloadSimpleIcon size={12} color="#a881ff" />
                          </Button>
                          <Button
                            variant="ghost"
                            style={{
                              padding: 4,
                              height: "auto",
                              background: "transparent",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFXPreset(p.id);
                            }}
                            title="Delete preset"
                          >
                            <TrashIcon size={12} color="#ff6b6b" />
                          </Button>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

// ─── Per-module color palette ─────────────────────────────────────────────────
const COLORS = {
  noiseGate: "#4ade80", // green
  eq: "#818cf8", // indigo
  compressor: "#facc15", // yellow
  drive: "#f97316", // orange
  chorus: "#c084fc", // violet
  phaser: "#34d399", // emerald
  tremolo: "#fbbf24", // amber
  delay: "#38bdf8", // sky
  reverb: "#f472b6", // pink
  pan: "#94a3b8", // slate
} as const;

export const TrackFX = ({ trackId, onClose, fullSize }: TrackFXProps) => {
  const isLive = trackId === "live";
  const track = useLooperStore((state) =>
    isLive ? state.liveTrack : state.tracks[trackId as number],
  );
  const setTrackFX = useLooperStore((state) => state.setTrackFX);
  const setLiveTrackState = useLooperStore((state) => state.setLiveTrackState);

  if (!track) return null;

  const { fx } = track;

  const updateFX = (section: keyof FXState, params: any) => {
    if (isLive) {
      setLiveTrackState({
        fx: { ...fx, [section]: { ...(fx as any)[section], ...params } },
      });
    } else {
      setTrackFX(trackId as number, {
        [section]: { ...(fx as any)[section], ...params },
      });
    }
  };

  const updatePan = (val: number) => {
    if (isLive) setLiveTrackState({ fx: { ...fx, pan: val } });
    else setTrackFX(trackId as number, { pan: val });
  };

  return (
    <Card
      className="fx-panel"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: fullSize ? "none" : "1060px",
        flex: fullSize ? 1 : undefined,
        padding: "20px 20px 16px",
        background: "var(--background)",
        border: "1px solid var(--border)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Row
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Row style={{ alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              padding: "8px",
              borderRadius: "10px",
              display: "flex",
            }}
          >
            <SlidersIcon size={16} style={{ color: "var(--primary)" }} />
          </div>
          <Heading
            style={{
              fontSize: "14px",
              margin: 0,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            {isLive ? "Live Track" : `Track ${(trackId as number) + 1}`} ·
            Pedalboard
          </Heading>
        </Row>
        <Row style={{ alignItems: "center", gap: 8 }}>
          <PresetMenu
            type="chain"
            currentFxState={fx}
            onLoad={(state) => {
              if (isLive) setLiveTrackState({ fx: state });
              else setTrackFX(trackId as number, state);
            }}
          />
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              title="Close Pedalboard"
              style={{
                padding: "6px",
                borderRadius: "50%",
                width: 36,
                height: 36,
              }}
            >
              <XIcon size={16} />
            </Button>
          )}
        </Row>
      </Row>

      {/* Rack */}
      <div
        className="fx-rack"
        style={{
          flexWrap: fullSize ? "wrap" : undefined,
          flex: fullSize ? 1 : undefined,
          alignContent: fullSize ? "flex-start" : undefined,
        }}
      >
        {/* ── Noise Gate — single column ── */}
        <FxModule
          name="Noise GT"
          color={COLORS.noiseGate}
          enabled={fx.noiseGate.enabled}
          onToggle={(v) => updateFX("noiseGate", { enabled: v })}
          icon={<NoiseGateIcon size={12} />}
          cols="1fr"
          moduleWidth={96}
          knobGap={12}
          moduleType="noiseGate"
          currentFxState={fx.noiseGate}
          onLoadPreset={(state) => updateFX("noiseGate", state)}
        >
          <Knob
            color={COLORS.noiseGate}
            size={52}
            label="Thresh"
            unit="dB"
            value={fx.noiseGate.threshold}
            min={-80}
            max={0}
            step={1}
            onChange={(v) => updateFX("noiseGate", { threshold: v })}
            title="Noise Gate Threshold: audio levels below this will be silenced (double-click to reset)"
          />
          <Knob
            color={COLORS.noiseGate}
            size={52}
            label="Atk"
            unit="s"
            value={fx.noiseGate.attack}
            min={0.001}
            max={0.5}
            step={0.001}
            onChange={(v) => updateFX("noiseGate", { attack: v })}
            title="Noise Gate Attack Time: how fast the gate opens (double-click to reset)"
          />
          <Knob
            color={COLORS.noiseGate}
            size={52}
            label="Rel"
            unit="s"
            value={fx.noiseGate.release}
            min={0.01}
            max={2.0}
            step={0.01}
            onChange={(v) => updateFX("noiseGate", { release: v })}
            title="Noise Gate Release Time: how fast the gate closes (double-click to reset)"
          />
        </FxModule>

        {/* ── EQ 3-Band — single column ── */}
        <FxModule
          name="EQ 3B"
          color={COLORS.eq}
          enabled={true}
          alwaysOn
          icon={<EffectEqIcon size={12} />}
          cols="1fr"
          moduleWidth={96}
          knobGap={12}
          moduleType="eq"
          currentFxState={fx.eq}
          onLoadPreset={(state) => updateFX("eq", state)}
        >
          <Knob
            color={COLORS.eq}
            size={52}
            label="Low"
            unit="dB"
            value={fx.eq.low}
            min={-12}
            max={12}
            step={0.1}
            onChange={(v) => updateFX("eq", { low: v })}
            title="Low Frequency EQ Gain (double-click to reset)"
          />
          <Knob
            color={COLORS.eq}
            size={52}
            label="Mid"
            unit="dB"
            value={fx.eq.mid}
            min={-12}
            max={12}
            step={0.1}
            onChange={(v) => updateFX("eq", { mid: v })}
            title="Mid Frequency EQ Gain (double-click to reset)"
          />
          <Knob
            color={COLORS.eq}
            size={52}
            label="High"
            unit="dB"
            value={fx.eq.high}
            min={-12}
            max={12}
            step={0.1}
            onChange={(v) => updateFX("eq", { high: v })}
            title="High Frequency EQ Gain (double-click to reset)"
          />
        </FxModule>

        {/* ── Compressor — single column (vertical, per user request) ── */}
        <FxModule
          name="Comp"
          color={COLORS.compressor}
          enabled={true}
          alwaysOn
          icon={<CompressorIcon size={12} />}
          cols="1fr"
          moduleWidth={96}
          knobGap={12}
          moduleType="compressor"
          currentFxState={fx.compressor}
          onLoadPreset={(state) => updateFX("compressor", state)}
        >
          <Knob
            color={COLORS.compressor}
            size={52}
            label="Thresh"
            unit="dB"
            value={fx.compressor.threshold}
            min={-60}
            max={0}
            step={1}
            onChange={(v) => updateFX("compressor", { threshold: v })}
            title="Compressor Threshold: signal levels above this will be compressed (double-click to reset)"
          />
          <Knob
            color={COLORS.compressor}
            size={52}
            label="Ratio"
            unit=":1"
            value={fx.compressor.ratio}
            min={1}
            max={20}
            step={0.1}
            onChange={(v) => updateFX("compressor", { ratio: v })}
            title="Compression Ratio: slope of compression curve (double-click to reset)"
          />
          <Knob
            color={COLORS.compressor}
            size={52}
            label="Gain"
            unit="dB"
            value={fx.compressor.gain}
            min={0}
            max={24}
            step={1}
            onChange={(v) => updateFX("compressor", { gain: v })}
            title="Compressor Makeup Gain: amplifies the output signal (double-click to reset)"
          />
        </FxModule>

        {/* ── Drive — single column, 2 params ── */}
        <FxModule
          name="Drive"
          color={COLORS.drive}
          enabled={fx.drive.enabled}
          onToggle={(v) => updateFX("drive", { enabled: v })}
          icon={<DriveIcon size={12} />}
          cols="1fr"
          moduleWidth={96}
          knobGap={12}
          moduleType="drive"
          currentFxState={fx.drive}
          onLoadPreset={(state) => updateFX("drive", state)}
        >
          <Knob
            color={COLORS.drive}
            size={52}
            label="Amt"
            value={fx.drive.amount}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateFX("drive", { amount: v })}
            title="Overdrive Saturation Amount (double-click to reset)"
          />
          <Knob
            color={COLORS.drive}
            size={52}
            label="Tone"
            value={fx.drive.tone}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateFX("drive", { tone: v })}
            title="Overdrive Tone: controls brightness/warmth (double-click to reset)"
          />
        </FxModule>

        {/* ── Chorus / Doubler — 2-col ── */}
        <FxModule
          name="Chorus"
          color={COLORS.chorus}
          enabled={fx.chorus?.enabled ?? false}
          onToggle={(v) => updateFX("chorus", { enabled: v })}
          icon={<ChorusIcon size={12} />}
          cols="1fr 1fr"
          moduleWidth={152}
          knobGap={14}
          moduleType="chorus"
          currentFxState={fx.chorus}
          onLoadPreset={(state) => updateFX("chorus", state)}
          footer={
            <div className="fx-module-footer">
              <span className="fx-mini-label">Mode</span>
              <div className="fx-mini-btn-row">
                {([1, 2] as const).map((v) => (
                  <button
                    key={v}
                    className={`fx-mini-btn${(fx.chorus?.voices ?? 1) === v ? " active" : ""}`}
                    style={
                      { "--module-color": COLORS.chorus } as React.CSSProperties
                    }
                    onClick={() => updateFX("chorus", { voices: v })}
                    title={v === 1 ? "Standard Chorus Mode" : "Doubler Mode"}
                  >
                    {v === 1 ? "CHR" : "DBL"}
                  </button>
                ))}
              </div>
            </div>
          }
        >
          <Knob
            color={COLORS.chorus}
            size={50}
            label="Rate"
            unit="Hz"
            value={fx.chorus?.rate ?? 0.5}
            min={0.1}
            max={5}
            step={0.05}
            onChange={(v) => updateFX("chorus", { rate: v })}
            title="Chorus Modulation LFO Rate (double-click to reset)"
          />
          <Knob
            color={COLORS.chorus}
            size={50}
            label="Depth"
            value={fx.chorus?.depth ?? 0.4}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateFX("chorus", { depth: v })}
            title="Chorus Modulation Depth (double-click to reset)"
          />
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Knob
              color={COLORS.chorus}
              size={50}
              label="Mix"
              value={fx.chorus?.mix ?? 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => updateFX("chorus", { mix: v })}
              title="Chorus Dry/Wet Mix (double-click to reset)"
            />
          </div>
        </FxModule>

        {/* ── Phaser — 2-col ── */}
        <FxModule
          name="Phaser"
          color={COLORS.phaser}
          enabled={fx.phaser?.enabled ?? false}
          onToggle={(v) => updateFX("phaser", { enabled: v })}
          icon={<PhaserIcon size={12} />}
          cols="1fr 1fr"
          moduleWidth={152}
          knobGap={14}
          moduleType="phaser"
          currentFxState={fx.phaser}
          onLoadPreset={(state) => updateFX("phaser", state)}
          footer={
            <div className="fx-module-footer">
              <span className="fx-mini-label">Stages</span>
              <div className="fx-mini-btn-row">
                {([2, 4] as const).map((s) => (
                  <button
                    key={s}
                    className={`fx-mini-btn${(fx.phaser?.stages ?? 4) === s ? " active" : ""}`}
                    style={
                      { "--module-color": COLORS.phaser } as React.CSSProperties
                    }
                    onClick={() => updateFX("phaser", { stages: s })}
                    title={`${s} Stages Phaser Mode`}
                  >
                    {s}st
                  </button>
                ))}
              </div>
            </div>
          }
        >
          <Knob
            color={COLORS.phaser}
            size={50}
            label="Rate"
            unit="Hz"
            value={fx.phaser?.rate ?? 0.5}
            min={0.1}
            max={5}
            step={0.05}
            onChange={(v) => updateFX("phaser", { rate: v })}
            title="Phaser Modulation LFO Rate (double-click to reset)"
          />
          <Knob
            color={COLORS.phaser}
            size={50}
            label="Depth"
            value={fx.phaser?.depth ?? 0.5}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateFX("phaser", { depth: v })}
            title="Phaser Modulation Depth (double-click to reset)"
          />
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Knob
              color={COLORS.phaser}
              size={50}
              label="Fdbk"
              value={fx.phaser?.feedback ?? 0.5}
              min={0}
              max={0.9}
              step={0.01}
              onChange={(v) => updateFX("phaser", { feedback: v })}
              title="Phaser Feedback Amount (double-click to reset)"
            />
          </div>
        </FxModule>

        {/* ── Tremolo — 2-col ── */}
        <FxModule
          name="Tremolo"
          color={COLORS.tremolo}
          enabled={fx.tremolo?.enabled ?? false}
          onToggle={(v) => updateFX("tremolo", { enabled: v })}
          icon={<TremoloIcon size={12} />}
          cols="1fr 1fr"
          moduleWidth={160}
          knobGap={14}
          moduleType="tremolo"
          currentFxState={fx.tremolo}
          onLoadPreset={(state) => updateFX("tremolo", state)}
          footer={
            <div className="fx-module-footer">
              <span className="fx-mini-label">Mode</span>
              <div className="fx-mini-btn-row">
                <button
                  className={`fx-mini-btn${!fx.tremolo?.sync ? " active" : ""}`}
                  style={
                    { "--module-color": COLORS.tremolo } as React.CSSProperties
                  }
                  onClick={() => updateFX("tremolo", { sync: false })}
                  title="Set rate in Hertz (Hz)"
                >
                  FREE
                </button>
                <button
                  className={`fx-mini-btn${fx.tremolo?.sync ? " active" : ""}`}
                  style={
                    { "--module-color": COLORS.tremolo } as React.CSSProperties
                  }
                  onClick={() =>
                    updateFX("tremolo", { sync: true, rate: 0.25 })
                  }
                  title="Sync rate to project tempo (BPM)"
                >
                  SYNC
                </button>
              </div>
            </div>
          }
        >
          {fx.tremolo?.sync ? (
            <Knob
              color={COLORS.tremolo}
              size={50}
              label="Rate"
              unit=""
              value={fx.tremolo?.rate ?? 0.25}
              min={0.25}
              max={1}
              step={0.25}
              onChange={(v) => updateFX("tremolo", { rate: v })}
              title="Tremolo Sync Rate: fractions of a bar (double-click to reset)"
            />
          ) : (
            <Knob
              color={COLORS.tremolo}
              size={50}
              label="Rate"
              unit="Hz"
              value={fx.tremolo?.rate ?? 5.0}
              min={0.1}
              max={20}
              step={0.1}
              onChange={(v) => updateFX("tremolo", { rate: v })}
              title="Tremolo Modulation LFO Rate (double-click to reset)"
            />
          )}
          <Knob
            color={COLORS.tremolo}
            size={50}
            label="Depth"
            value={fx.tremolo?.depth ?? 0.5}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateFX("tremolo", { depth: v })}
            title="Tremolo Modulation Depth (double-click to reset)"
          />
        </FxModule>

        {/* ── Delay — 3-col, wide with generous gap (user: keep layout, more gap) ── */}
        <FxModule
          name="Delay"
          color={COLORS.delay}
          enabled={fx.delay.enabled}
          onToggle={(v) => updateFX("delay", { enabled: v })}
          icon={<DelayIcon size={12} />}
          cols="1fr 1fr 1fr"
          moduleWidth={192}
          knobGap={18}
          moduleType="delay"
          currentFxState={fx.delay}
          onLoadPreset={(state) => updateFX("delay", state)}
          footer={
            <div className="fx-module-footer">
              <span className="fx-mini-label">Mode</span>
              <div className="fx-mini-btn-row">
                {(["mono", "pingpong"] as const).map((m) => (
                  <button
                    key={m}
                    className={`fx-mini-btn${fx.delay.mode === m ? " active" : ""}`}
                    style={
                      { "--module-color": COLORS.delay } as React.CSSProperties
                    }
                    onClick={() => updateFX("delay", { mode: m })}
                    title={
                      m === "mono" ? "Mono Delay" : "Ping Pong Delay (stereo)"
                    }
                  >
                    {m === "mono" ? "MNO" : "PNG"}
                  </button>
                ))}
              </div>
              <span className="fx-mini-label" style={{ marginTop: 4 }}>
                Sync
              </span>
              <div className="fx-mini-btn-row">
                {[0.25, 0.5, 0.75, 1].map((t) => (
                  <button
                    key={t}
                    className={`fx-mini-btn${fx.delay.time === t ? " active" : ""}`}
                    style={
                      { "--module-color": COLORS.delay } as React.CSSProperties
                    }
                    onClick={() => updateFX("delay", { time: t })}
                    title={`Sync delay to ${t === 0.25 ? "quarter" : t === 0.5 ? "half" : t === 0.75 ? "three-quarter" : "whole"} beat`}
                  >
                    {t === 0.25
                      ? "¼"
                      : t === 0.5
                        ? "½"
                        : t === 0.75
                          ? "¾"
                          : "1"}
                  </button>
                ))}
              </div>
            </div>
          }
        >
          <Knob
            color={COLORS.delay}
            size={52}
            label="Time"
            unit="s"
            value={fx.delay.time}
            min={0.125}
            max={2}
            step={0.001}
            onChange={(v) => updateFX("delay", { time: v })}
            title="Delay Time (double-click to reset)"
          />
          <Knob
            color={COLORS.delay}
            size={52}
            label="Fdbk"
            value={fx.delay.feedback}
            min={0}
            max={0.9}
            step={0.01}
            onChange={(v) => updateFX("delay", { feedback: v })}
            title="Delay Feedback / Repeat Amount (double-click to reset)"
          />
          <Knob
            color={COLORS.delay}
            size={52}
            label="Filt"
            value={fx.delay.filter}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateFX("delay", { filter: v })}
            title="Delay Bandpass Filter cutoff (double-click to reset)"
          />
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Knob
              color={COLORS.delay}
              size={52}
              label="Mix"
              value={fx.delay.mix}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => updateFX("delay", { mix: v })}
              title="Delay Dry/Wet Mix (double-click to reset)"
            />
          </div>
        </FxModule>

        {/* ── Reverb — 2-col (Mix|Size / PreD|Damp) ── */}
        <FxModule
          name="Reverb"
          color={COLORS.reverb}
          enabled={fx.reverb.enabled}
          onToggle={(v) => updateFX("reverb", { enabled: v })}
          icon={<ReverbIcon size={12} />}
          cols="1fr 1fr"
          moduleWidth={152}
          knobGap={14}
          moduleType="reverb"
          currentFxState={fx.reverb}
          onLoadPreset={(state) => updateFX("reverb", state)}
        >
          <Knob
            color={COLORS.reverb}
            size={50}
            label="Mix"
            value={fx.reverb.mix}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateFX("reverb", { mix: v })}
            title="Reverb Dry/Wet Mix (double-click to reset)"
          />
          <Knob
            color={COLORS.reverb}
            size={50}
            label="Size"
            unit="s"
            value={fx.reverb.size}
            min={0.1}
            max={5}
            step={0.1}
            onChange={(v) => updateFX("reverb", { size: v })}
            title="Reverb Room Size / Decay Time (double-click to reset)"
          />
          <Knob
            color={COLORS.reverb}
            size={50}
            label="PreD"
            unit="ms"
            value={fx.reverb.predelay}
            min={0}
            max={100}
            step={1}
            onChange={(v) => updateFX("reverb", { predelay: v })}
            title="Reverb Pre-Delay Time (double-click to reset)"
          />
          <Knob
            color={COLORS.reverb}
            size={50}
            label="Damp"
            value={fx.reverb.damping}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateFX("reverb", { damping: v })}
            title="Reverb High Frequency Damping (double-click to reset)"
          />
        </FxModule>
      </div>
    </Card>
  );
};

// ─── FxModule helper ─────────────────────────────────────────────────────────

interface FxModuleProps {
  name: string;
  color: string;
  enabled: boolean;
  children: React.ReactNode;
  onToggle?: (v: boolean) => void;
  alwaysOn?: boolean;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  /** CSS grid-template-columns value e.g. "1fr" or "1fr 1fr" */
  cols?: string;
  /** Module card width in px */
  moduleWidth?: number;
  /** Gap between knobs in px */
  knobGap?: number;
  // For Presets
  moduleType?: keyof FXState;
  currentFxState?: any;
  onLoadPreset?: (state: any) => void;
}

const FxModule = ({
  name,
  color,
  enabled,
  children,
  onToggle,
  alwaysOn,
  icon,
  footer,
  cols = "1fr",
  moduleWidth = 120,
  knobGap = 10,
  moduleType,
  currentFxState,
  onLoadPreset,
}: FxModuleProps) => {
  const isOn = alwaysOn || enabled;
  return (
    <div
      className={`fx-module ${isOn ? "enabled" : "disabled"}`}
      style={
        {
          "--module-color": color,
          flex: `0 0 ${moduleWidth}px`,
        } as React.CSSProperties
      }
    >
      {/* Top Controls (Toggle & Presets) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 24,
        }}
      >
        <div>
          {moduleType && currentFxState && onLoadPreset && (
            <PresetMenu
              type="module"
              moduleType={moduleType}
              currentFxState={currentFxState}
              onLoad={onLoadPreset}
            />
          )}
        </div>
        <div>
          {!alwaysOn && onToggle && (
            <button
              className="ghost small"
              onClick={() => onToggle(!enabled)}
              style={{
                padding: "4px",
                height: 24,
                width: 24,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: enabled ? "transparent" : "rgba(255,255,255,0.05)",
                color: enabled ? color : "rgba(255,255,255,0.4)",
                filter: enabled ? `drop-shadow(0 0 4px ${color})` : "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
                border: "none",
              }}
              title={enabled ? "Bypass Module" : "Enable Module"}
            >
              <PowerIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Knob grid — layout driven by cols prop */}
      <div
        className="fx-knob-grid"
        style={{
          gridTemplateColumns: cols,
          gap: knobGap,
        }}
      >
        {children}
      </div>

      {/* Optional footer (mode/sync buttons) */}
      {footer}

      {/* Bottom Branding (Icon & Name) */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span style={{ color, opacity: isOn ? 0.85 : 0.4 }}>{icon}</span>
        <span className="fx-module-name">{name}</span>
      </div>
    </div>
  );
};
