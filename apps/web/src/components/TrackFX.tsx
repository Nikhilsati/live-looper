import { useLooperStore } from '../store/useLooperStore';
import { Card, Stack, Row, Label, ValueText, Slider, Button, Grid, Heading, Switch } from '@live-looper/ui';
import { X, Activity, Zap, Clock, Speaker, Sliders } from 'lucide-react';
import type { FXState } from '@live-looper/types';

interface TrackFXProps {
    trackId: number;
    onClose: () => void;
}

export const TrackFX = ({ trackId, onClose }: TrackFXProps) => {
    const track = useLooperStore(state => state.tracks[trackId]);
    const setTrackFX = useLooperStore(state => state.setTrackFX);

    if (!track) return null;

    const { fx } = track;

    const updateFX = (section: keyof FXState, params: any) => {
        setTrackFX(trackId, { [section]: { ...(fx as any)[section], ...params } });
    };

    return (
        <Card className="fx-panel" style={{
            position: 'relative',
            width: '100%',
            maxWidth: '640px',
            padding: '28px',
            background: 'var(--background)',
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            boxSizing: 'border-box'
        }}>
            <Stack style={{ gap: '28px' }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Row style={{ alignItems: 'center', gap: '16px' }}>
                        <div style={{ background: 'var(--secondary)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                            <Sliders size={20} style={{ color: 'var(--primary)' }} />
                        </div>
                        <Heading style={{ fontSize: '22px', margin: 0 }}>Track {trackId + 1} Master FX</Heading>
                    </Row>
                    <Button onClick={onClose} variant="ghost" style={{ padding: '8px', borderRadius: '50%', width: 44, height: 44 }}>
                        <X size={20} />
                    </Button>
                </Row>

                <Grid cols="1fr 1fr" style={{ gap: '24px' }}>
                    {/* EQ Section */}
                    <Card style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                        <Stack style={{ gap: '16px' }}>
                            <Row style={{ alignItems: 'center', gap: '8px' }}>
                                <Activity size={16} style={{ color: 'var(--primary)' }} />
                                <Label style={{ fontWeight: 800 }}>EQ (3-Band)</Label>
                            </Row>
                            <Stack style={{ gap: '14px' }}>
                                <ControlSlider label="Low" value={fx.eq.low} min={-12} max={12} step={0.1} unit="dB" onChange={(v: number) => updateFX('eq', { low: v })} />
                                <ControlSlider label="Mid" value={fx.eq.mid} min={-12} max={12} step={0.1} unit="dB" onChange={(v: number) => updateFX('eq', { mid: v })} />
                                <ControlSlider label="High" value={fx.eq.high} min={-12} max={12} step={0.1} unit="dB" onChange={(v: number) => updateFX('eq', { high: v })} />
                            </Stack>
                        </Stack>
                    </Card>

                    {/* Compressor Section */}
                    <Card style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                        <Stack style={{ gap: '16px' }}>
                            <Row style={{ alignItems: 'center', gap: '8px' }}>
                                <Speaker size={16} style={{ color: 'var(--success)' }} />
                                <Label style={{ fontWeight: 800 }}>Dynamics (Comp)</Label>
                            </Row>
                            <Stack style={{ gap: '14px' }}>
                                <ControlSlider label="Thresh" value={fx.compressor.threshold} min={-60} max={0} step={1} unit="dB" onChange={(v: number) => updateFX('compressor', { threshold: v })} />
                                <ControlSlider label="Ratio" value={fx.compressor.ratio} min={1} max={20} step={0.1} unit=":1" onChange={(v: number) => updateFX('compressor', { ratio: v })} />
                                <ControlSlider label="Gain" value={fx.compressor.gain} min={0} max={24} step={1} unit="dB" onChange={(v: number) => updateFX('compressor', { gain: v })} />
                            </Stack>
                        </Stack>
                    </Card>

                    {/* Drive Section */}
                    <Card style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                        <Stack style={{ gap: '16px' }}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Row style={{ alignItems: 'center', gap: '8px' }}>
                                    <Zap size={16} style={{ color: 'var(--warning)' }} />
                                    <Label style={{ fontWeight: 800 }}>Drive</Label>
                                </Row>
                                <Switch checked={fx.drive.enabled} onChange={(v) => updateFX('drive', { enabled: v })} />
                            </Row>
                            <ControlSlider label="Amount" value={fx.drive.amount} min={0} max={1} step={0.01} unit="" onChange={(v: number) => updateFX('drive', { amount: v })} />
                        </Stack>
                    </Card>

                    {/* Delay Section */}
                    <Card style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                        <Stack style={{ gap: '16px' }}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Row style={{ alignItems: 'center', gap: '8px' }}>
                                    <Clock size={16} style={{ color: 'var(--accent)' }} />
                                    <Label style={{ fontWeight: 800 }}>Delay</Label>
                                </Row>
                                <Switch checked={fx.delay.enabled} onChange={(v) => updateFX('delay', { enabled: v })} />
                            </Row>
                            <Stack style={{ gap: '12px' }}>
                                <ControlSlider label="Feedback" value={fx.delay.feedback} min={0} max={0.9} step={0.01} unit="" onChange={(v: number) => updateFX('delay', { feedback: v })} />
                                <ControlSlider label="Mix" value={fx.delay.mix} min={0} max={1} step={0.01} unit="" onChange={(v: number) => updateFX('delay', { mix: v })} />
                                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Label style={{ fontSize: '11px', opacity: 0.7 }}>SYNC</Label>
                                    <Row style={{ gap: '4px' }}>
                                        {[0.25, 0.5, 0.75, 1].map(t => (
                                            <Button key={t} size="sm" variant={fx.delay.time === t ? 'primary' : 'ghost'} style={{ padding: '4px 8px', fontSize: '10px', minWidth: 36 }} onClick={() => updateFX('delay', { time: t })}>
                                                {t === 0.25 ? '1/4' : t === 0.5 ? '1/2' : t === 0.75 ? '3/4' : '1n'}
                                            </Button>
                                        ))}
                                    </Row>
                                </Row>
                            </Stack>
                        </Stack>
                    </Card>

                    {/* Reverb Section */}
                    <Card style={{ padding: '16px', gridColumn: 'span 2', background: 'rgba(255,255,255,0.02)' }}>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Row style={{ alignItems: 'center', gap: '12px' }}>
                                <Activity size={16} style={{ color: '#ec4899' }} />
                                <Label style={{ fontWeight: 800 }}>Reverb</Label>
                            </Row>
                            <Row style={{ gap: '24px', flex: 1, marginLeft: '48px', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <ControlSlider label="" value={fx.reverb.mix} min={0} max={1} step={0.01} unit="Mix" onChange={(v: number) => updateFX('reverb', { mix: v })} />
                                </div>
                                <Switch checked={fx.reverb.enabled} onChange={(v) => updateFX('reverb', { enabled: v })} />
                            </Row>
                        </Row>
                    </Card>

                    {/* Pan & Utiltiy */}
                    <Card style={{ padding: '16px', gridColumn: 'span 2', background: 'rgba(255,255,255,0.02)' }}>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Row style={{ alignItems: 'center', gap: '12px' }}>
                                <Speaker size={16} />
                                <Label style={{ fontWeight: 800 }}>Stereo Pan</Label>
                            </Row>
                            <div style={{ flex: 1, marginLeft: '48px' }}>
                                <ControlSlider label="" value={fx.pan} min={-1} max={1} step={0.01} unit="" onChange={(v: number) => setTrackFX(trackId, { pan: v })} />
                            </div>
                            <Row style={{ width: '60px', justifyContent: 'center' }}>
                                <ValueText style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                    {fx.pan < 0 ? `L${Math.abs(Math.round(fx.pan * 100))}` : fx.pan > 0 ? `R${Math.round(fx.pan * 100)}` : 'C'}
                                </ValueText>
                            </Row>
                        </Row>
                    </Card>
                </Grid>
            </Stack>
        </Card>
    );
};

interface ControlSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    onChange: (val: number) => void;
}

const ControlSlider = ({ label, value, min, max, step, unit, onChange }: ControlSliderProps) => (
    <Stack style={{ gap: '6px' }}>
        <Row style={{ justifyContent: 'space-between' }}>
            <Label style={{ fontSize: '11px', opacity: 0.6 }}>{label}</Label>
            <ValueText style={{ fontSize: '11px', fontWeight: 600 }}>
                {typeof value === 'number' ? value.toFixed(unit === ':1' || label === 'Amount' || label === 'Mix' ? 2 : 1) : value}
                <span style={{ opacity: 0.5, marginLeft: 2 }}>{unit}</span>
            </ValueText>
        </Row>
        <Slider value={value} min={min} max={max} step={step} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value))} />
    </Stack>
);
