import React from 'react';
import { useLooperStore } from '../store/useLooperStore';
import { Card, Row, Heading, Switch, Button, Knob } from '@live-looper/ui';
import {
    XIcon, SlidersIcon, SpeakerSlashIcon, WaveformIcon,
    SpeakerHighIcon, LightningIcon, ClockIcon, WavesIcon,
    WaveTriangleIcon, CirclesFourIcon, ActivityIcon
} from '@phosphor-icons/react';
import type { FXState } from '@live-looper/types';

interface TrackFXProps {
    trackId: number | 'live';
    onClose?: () => void;
    fullSize?: boolean;
}

// ─── Per-module color palette ─────────────────────────────────────────────────
const COLORS = {
    noiseGate: '#4ade80',   // green
    eq: '#818cf8',   // indigo
    compressor: '#facc15',   // yellow
    drive: '#f97316',   // orange
    chorus: '#c084fc',   // violet
    phaser: '#34d399',   // emerald
    tremolo: '#fbbf24',  // amber
    delay: '#38bdf8',   // sky
    reverb: '#f472b6',   // pink
    pan: '#94a3b8',   // slate
} as const;

export const TrackFX = ({ trackId, onClose, fullSize }: TrackFXProps) => {
    const isLive = trackId === 'live';
    const track = useLooperStore(state => isLive ? state.liveTrack : state.tracks[trackId as number]);
    const setTrackFX = useLooperStore(state => state.setTrackFX);
    const setLiveTrackState = useLooperStore(state => state.setLiveTrackState);

    if (!track) return null;

    const { fx } = track;

    const updateFX = (section: keyof FXState, params: any) => {
        if (isLive) {
            setLiveTrackState({ fx: { ...fx, [section]: { ...(fx as any)[section], ...params } } });
        } else {
            setTrackFX(trackId as number, { [section]: { ...(fx as any)[section], ...params } });
        }
    };

    const updatePan = (val: number) => {
        if (isLive) setLiveTrackState({ fx: { ...fx, pan: val } });
        else setTrackFX(trackId as number, { pan: val });
    };

    return (
        <Card className="fx-panel" style={{
            position: 'relative',
            width: '100%',
            maxWidth: fullSize ? 'none' : '1060px',
            flex: fullSize ? 1 : undefined,
            padding: '20px 20px 16px',
            background: 'var(--background)',
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Row style={{ alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                        <SlidersIcon size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <Heading style={{ fontSize: '14px', margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>
                        {isLive ? 'Live Track' : `Track ${(trackId as number) + 1}`} · Effects Chain
                    </Heading>
                </Row>
                {onClose && (
                    <Button onClick={onClose} variant="ghost" style={{ padding: '6px', borderRadius: '50%', width: 36, height: 36 }}>
                        <XIcon size={16} />
                    </Button>
                )}
            </Row>

            {/* Rack */}
            <div className="fx-rack" style={{ flexWrap: fullSize ? 'wrap' : undefined, flex: fullSize ? 1 : undefined, alignContent: fullSize ? 'flex-start' : undefined }}>

                {/* ── Noise Gate — single column ── */}
                <FxModule
                    name="Noise GT"
                    color={COLORS.noiseGate}
                    enabled={fx.noiseGate.enabled}
                    onToggle={v => updateFX('noiseGate', { enabled: v })}
                    icon={<SpeakerSlashIcon size={10} />}
                    cols="1fr"
                    moduleWidth={96}
                    knobGap={12}
                >
                    <Knob color={COLORS.noiseGate} size={52} label="Thresh" unit="dB"
                        value={fx.noiseGate.threshold} min={-80} max={0} step={1}
                        onChange={v => updateFX('noiseGate', { threshold: v })} />
                    <Knob color={COLORS.noiseGate} size={52} label="Atk" unit="s"
                        value={fx.noiseGate.attack} min={0.001} max={0.5} step={0.001}
                        onChange={v => updateFX('noiseGate', { attack: v })} />
                    <Knob color={COLORS.noiseGate} size={52} label="Rel" unit="s"
                        value={fx.noiseGate.release} min={0.01} max={2.0} step={0.01}
                        onChange={v => updateFX('noiseGate', { release: v })} />
                </FxModule>

                {/* ── EQ 3-Band — single column ── */}
                <FxModule
                    name="EQ 3B"
                    color={COLORS.eq}
                    enabled={true}
                    alwaysOn
                    icon={<WaveformIcon size={10} />}
                    cols="1fr"
                    moduleWidth={96}
                    knobGap={12}
                >
                    <Knob color={COLORS.eq} size={52} label="Low" unit="dB"
                        value={fx.eq.low} min={-12} max={12} step={0.1}
                        onChange={v => updateFX('eq', { low: v })} />
                    <Knob color={COLORS.eq} size={52} label="Mid" unit="dB"
                        value={fx.eq.mid} min={-12} max={12} step={0.1}
                        onChange={v => updateFX('eq', { mid: v })} />
                    <Knob color={COLORS.eq} size={52} label="High" unit="dB"
                        value={fx.eq.high} min={-12} max={12} step={0.1}
                        onChange={v => updateFX('eq', { high: v })} />
                </FxModule>

                {/* ── Compressor — single column (vertical, per user request) ── */}
                <FxModule
                    name="Comp"
                    color={COLORS.compressor}
                    enabled={true}
                    alwaysOn
                    icon={<SpeakerHighIcon size={10} />}
                    cols="1fr"
                    moduleWidth={96}
                    knobGap={12}
                >
                    <Knob color={COLORS.compressor} size={52} label="Thresh" unit="dB"
                        value={fx.compressor.threshold} min={-60} max={0} step={1}
                        onChange={v => updateFX('compressor', { threshold: v })} />
                    <Knob color={COLORS.compressor} size={52} label="Ratio" unit=":1"
                        value={fx.compressor.ratio} min={1} max={20} step={0.1}
                        onChange={v => updateFX('compressor', { ratio: v })} />
                    <Knob color={COLORS.compressor} size={52} label="Gain" unit="dB"
                        value={fx.compressor.gain} min={0} max={24} step={1}
                        onChange={v => updateFX('compressor', { gain: v })} />
                </FxModule>

                {/* ── Drive — single column, 2 params ── */}
                <FxModule
                    name="Drive"
                    color={COLORS.drive}
                    enabled={fx.drive.enabled}
                    onToggle={v => updateFX('drive', { enabled: v })}
                    icon={<LightningIcon size={10} />}
                    cols="1fr"
                    moduleWidth={96}
                    knobGap={12}
                >
                    <Knob color={COLORS.drive} size={52} label="Amt"
                        value={fx.drive.amount} min={0} max={1} step={0.01}
                        onChange={v => updateFX('drive', { amount: v })} />
                    <Knob color={COLORS.drive} size={52} label="Tone"
                        value={fx.drive.tone} min={0} max={1} step={0.01}
                        onChange={v => updateFX('drive', { tone: v })} />
                </FxModule>

                {/* ── Chorus / Doubler — 2-col ── */}
                <FxModule
                    name="Chorus"
                    color={COLORS.chorus}
                    enabled={fx.chorus?.enabled ?? false}
                    onToggle={v => updateFX('chorus', { enabled: v })}
                    icon={<WaveTriangleIcon size={10} />}
                    cols="1fr 1fr"
                    moduleWidth={152}
                    knobGap={14}
                    footer={
                        <div className="fx-module-footer">
                            <span className="fx-mini-label">Mode</span>
                            <div className="fx-mini-btn-row">
                                {([1, 2] as const).map(v => (
                                    <button key={v}
                                        className={`fx-mini-btn${(fx.chorus?.voices ?? 1) === v ? ' active' : ''}`}
                                        style={{ '--module-color': COLORS.chorus } as React.CSSProperties}
                                        onClick={() => updateFX('chorus', { voices: v })}>
                                        {v === 1 ? 'CHR' : 'DBL'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    }
                >
                    <Knob color={COLORS.chorus} size={50} label="Rate" unit="Hz"
                        value={fx.chorus?.rate ?? 0.5} min={0.1} max={5} step={0.05}
                        onChange={v => updateFX('chorus', { rate: v })} />
                    <Knob color={COLORS.chorus} size={50} label="Depth"
                        value={fx.chorus?.depth ?? 0.4} min={0} max={1} step={0.01}
                        onChange={v => updateFX('chorus', { depth: v })} />
                    <Knob color={COLORS.chorus} size={50} label="Mix"
                        value={fx.chorus?.mix ?? 0.5} min={0} max={1} step={0.01}
                        onChange={v => updateFX('chorus', { mix: v })} />
                </FxModule>

                {/* ── Phaser — 2-col ── */}
                <FxModule
                    name="Phaser"
                    color={COLORS.phaser}
                    enabled={fx.phaser?.enabled ?? false}
                    onToggle={v => updateFX('phaser', { enabled: v })}
                    icon={<CirclesFourIcon size={10} />}
                    cols="1fr 1fr"
                    moduleWidth={152}
                    knobGap={14}
                    footer={
                        <div className="fx-module-footer">
                            <span className="fx-mini-label">Stages</span>
                            <div className="fx-mini-btn-row">
                                {([2, 4] as const).map(s => (
                                    <button key={s}
                                        className={`fx-mini-btn${(fx.phaser?.stages ?? 4) === s ? ' active' : ''}`}
                                        style={{ '--module-color': COLORS.phaser } as React.CSSProperties}
                                        onClick={() => updateFX('phaser', { stages: s })}>
                                        {s}st
                                    </button>
                                ))}
                            </div>
                        </div>
                    }
                >
                    <Knob color={COLORS.phaser} size={50} label="Rate" unit="Hz"
                        value={fx.phaser?.rate ?? 0.5} min={0.1} max={5} step={0.05}
                        onChange={v => updateFX('phaser', { rate: v })} />
                    <Knob color={COLORS.phaser} size={50} label="Depth"
                        value={fx.phaser?.depth ?? 0.5} min={0} max={1} step={0.01}
                        onChange={v => updateFX('phaser', { depth: v })} />
                    <Knob color={COLORS.phaser} size={50} label="Fdbk"
                        value={fx.phaser?.feedback ?? 0.5} min={0} max={0.9} step={0.01}
                        onChange={v => updateFX('phaser', { feedback: v })} />
                </FxModule>

                {/* ── Tremolo — 2-col ── */}
                <FxModule
                    name="Tremolo"
                    color={COLORS.tremolo}
                    enabled={fx.tremolo?.enabled ?? false}
                    onToggle={v => updateFX('tremolo', { enabled: v })}
                    icon={<ActivityIcon size={10} />}
                    cols="1fr 1fr"
                    moduleWidth={160}
                    knobGap={14}
                    footer={
                        <div className="fx-module-footer">
                            <span className="fx-mini-label">Mode</span>
                            <div className="fx-mini-btn-row">
                                <button className={`fx-mini-btn${!(fx.tremolo?.sync) ? ' active' : ''}`}
                                    style={{ '--module-color': COLORS.tremolo } as React.CSSProperties}
                                    onClick={() => updateFX('tremolo', { sync: false })}>
                                    FREE
                                </button>
                                <button className={`fx-mini-btn${fx.tremolo?.sync ? ' active' : ''}`}
                                    style={{ '--module-color': COLORS.tremolo } as React.CSSProperties}
                                    onClick={() => updateFX('tremolo', { sync: true, rate: 0.25 })}>
                                    SYNC
                                </button>
                            </div>
                        </div>
                    }
                >
                    {fx.tremolo?.sync ? (
                        <Knob color={COLORS.tremolo} size={50} label="Rate" unit=""
                            value={fx.tremolo?.rate ?? 0.25} min={0.25} max={1} step={0.25}
                            onChange={v => updateFX('tremolo', { rate: v })} />
                    ) : (
                        <Knob color={COLORS.tremolo} size={50} label="Rate" unit="Hz"
                            value={fx.tremolo?.rate ?? 5.0} min={0.1} max={20} step={0.1}
                            onChange={v => updateFX('tremolo', { rate: v })} />
                    )}
                    <Knob color={COLORS.tremolo} size={50} label="Depth"
                        value={fx.tremolo?.depth ?? 0.5} min={0} max={1} step={0.01}
                        onChange={v => updateFX('tremolo', { depth: v })} />
                </FxModule>

                {/* ── Delay — 3-col, wide with generous gap (user: keep layout, more gap) ── */}
                <FxModule
                    name="Delay"
                    color={COLORS.delay}
                    enabled={fx.delay.enabled}
                    onToggle={v => updateFX('delay', { enabled: v })}
                    icon={<ClockIcon size={10} />}
                    cols="1fr 1fr 1fr"
                    moduleWidth={192}
                    knobGap={18}
                    footer={
                        <div className="fx-module-footer">
                            <span className="fx-mini-label">Mode</span>
                            <div className="fx-mini-btn-row">
                                {(['mono', 'pingpong'] as const).map(m => (
                                    <button key={m}
                                        className={`fx-mini-btn${fx.delay.mode === m ? ' active' : ''}`}
                                        style={{ '--module-color': COLORS.delay } as React.CSSProperties}
                                        onClick={() => updateFX('delay', { mode: m })}>
                                        {m === 'mono' ? 'MNO' : 'PNG'}
                                    </button>
                                ))}
                            </div>
                            <span className="fx-mini-label" style={{ marginTop: 4 }}>Sync</span>
                            <div className="fx-mini-btn-row">
                                {[0.25, 0.5, 0.75, 1].map(t => (
                                    <button key={t}
                                        className={`fx-mini-btn${fx.delay.time === t ? ' active' : ''}`}
                                        style={{ '--module-color': COLORS.delay } as React.CSSProperties}
                                        onClick={() => updateFX('delay', { time: t })}>
                                        {t === 0.25 ? '¼' : t === 0.5 ? '½' : t === 0.75 ? '¾' : '1'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    }
                >
                    <Knob color={COLORS.delay} size={52} label="Time" unit="s"
                        value={fx.delay.time} min={0.125} max={2} step={0.001}
                        onChange={v => updateFX('delay', { time: v })} />
                    <Knob color={COLORS.delay} size={52} label="Fdbk"
                        value={fx.delay.feedback} min={0} max={0.9} step={0.01}
                        onChange={v => updateFX('delay', { feedback: v })} />
                    <Knob color={COLORS.delay} size={52} label="Filt"
                        value={fx.delay.filter} min={0} max={1} step={0.01}
                        onChange={v => updateFX('delay', { filter: v })} />
                    <Knob color={COLORS.delay} size={52} label="Mix"
                        value={fx.delay.mix} min={0} max={1} step={0.01}
                        onChange={v => updateFX('delay', { mix: v })} />
                </FxModule>

                {/* ── Reverb — 2-col (Mix|Size / PreD|Damp) ── */}
                <FxModule
                    name="Reverb"
                    color={COLORS.reverb}
                    enabled={fx.reverb.enabled}
                    onToggle={v => updateFX('reverb', { enabled: v })}
                    icon={<WavesIcon size={10} />}
                    cols="1fr 1fr"
                    moduleWidth={152}
                    knobGap={14}
                >
                    <Knob color={COLORS.reverb} size={50} label="Mix"
                        value={fx.reverb.mix} min={0} max={1} step={0.01}
                        onChange={v => updateFX('reverb', { mix: v })} />
                    <Knob color={COLORS.reverb} size={50} label="Size" unit="s"
                        value={fx.reverb.size} min={0.1} max={5} step={0.1}
                        onChange={v => updateFX('reverb', { size: v })} />
                    <Knob color={COLORS.reverb} size={50} label="PreD" unit="ms"
                        value={fx.reverb.predelay} min={0} max={100} step={1}
                        onChange={v => updateFX('reverb', { predelay: v })} />
                    <Knob color={COLORS.reverb} size={50} label="Damp"
                        value={fx.reverb.damping} min={0} max={1} step={0.01}
                        onChange={v => updateFX('reverb', { damping: v })} />
                </FxModule>

            </div>

            {/* Pan footer */}
            <div className="fx-pan-row">
                <Knob color={COLORS.pan} size={50} label="Pan"
                    value={fx.pan} min={-1} max={1} step={0.01}
                    onChange={updatePan} />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
                    {fx.pan < -0.005 ? `L${Math.abs(Math.round(fx.pan * 100))}` : fx.pan > 0.005 ? `R${Math.round(fx.pan * 100)}` : 'CENTER'}
                </span>
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
}

const FxModule = ({ name, color, enabled, children, onToggle, alwaysOn, icon, footer, cols = '1fr', moduleWidth = 120, knobGap = 10 }: FxModuleProps) => {
    const isOn = alwaysOn || enabled;
    return (
        <div
            className={`fx-module ${isOn ? 'enabled' : 'disabled'}`}
            style={{ '--module-color': color, flex: `0 0 ${moduleWidth}px` } as React.CSSProperties}
        >
            {/* Header row */}
            <div className="fx-module-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color, opacity: isOn ? 0.85 : 0.4 }}>{icon}</span>
                    <span className="fx-module-name">{name}</span>
                </div>
                {!alwaysOn && onToggle && (
                    <Switch checked={enabled} onChange={onToggle} />
                )}
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
        </div>
    );
};
