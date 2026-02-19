import { useState, useEffect } from 'react';
import { Card, Stack, Row, Label, ValueText, StatusDot, Text, Button, Grid } from '../UI';
import { useLooperStore } from '../store/useLooperStore';
import { Activity, Zap, RefreshCw, AlertCircle } from 'lucide-react';

export const LatencyMonitor = () => {
    const {
        latencyMeasuredSamples,
        latencyCompensationSamples,
        isCalibratingLatency,
        jitter
    } = useLooperStore();
    const calibrateLatency = useLooperStore(state => state.calibrateLatency);

    // We'll keep a small history of jitter for a simple trend line if needed
    const [jitterHistory, setJitterHistory] = useState<number[]>([]);

    useEffect(() => {
        if (jitter > 0) {
            setJitterHistory(prev => [...prev.slice(-20), jitter * 1000]);
        }
    }, [jitter]);

    const sampleRate = 44100; // Fallback or get from context
    const measuredMs = (latencyMeasuredSamples / sampleRate) * 1000;
    const compensationMs = (latencyCompensationSamples / sampleRate) * 1000;

    const isStable = jitter * 1000 < 2; // Under 2ms jitter is great

    return (
        <Card style={{
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            width: '100%'
        }}>
            <Stack style={{ gap: '16px' }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Row style={{ alignItems: 'center', gap: '8px' }}>
                        <Activity size={18} className="text-accent" />
                        <Heading style={{ fontSize: '16px', margin: 0 }}>Engine Performance</Heading>
                    </Row>
                    <StatusDot className={isStable ? 'bg-success' : 'bg-warning'} />
                </Row>

                <Grid cols="1fr 1fr" style={{ gap: '20px' }}>
                    {/* Latency Section */}
                    <Stack style={{ gap: '12px' }}>
                        <Stack style={{ gap: '4px' }}>
                            <Label style={{ fontSize: '11px', opacity: 0.6 }}>ROUND-TRIP LATENCY (RTL)</Label>
                            <Row style={{ alignItems: 'baseline', gap: '4px' }}>
                                <ValueText style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    {measuredMs > 0 ? measuredMs.toFixed(1) : '--'}
                                </ValueText>
                                <Label style={{ fontSize: '10px' }}>ms</Label>
                            </Row>
                            <Label style={{ fontSize: '10px', opacity: 0.5 }}>
                                Compensation: -{compensationMs.toFixed(1)}ms
                            </Label>
                        </Stack>

                        <Button
                            variant={isCalibratingLatency ? 'active-warning' : 'outline'}
                            size="sm"
                            onClick={calibrateLatency}
                            disabled={isCalibratingLatency}
                            style={{ gap: '8px', fontSize: '11px', height: '32px' }}
                        >
                            {isCalibratingLatency ? (
                                <RefreshCw size={14} className="animate-spin" />
                            ) : (
                                <Zap size={14} />
                            )}
                            {isCalibratingLatency ? 'CALIBRATING...' : 'CALIBRATE RTL'}
                        </Button>
                    </Stack>

                    {/* Jitter & Stability Section */}
                    <Stack style={{ gap: '12px' }}>
                        <Stack style={{ gap: '4px' }}>
                            <Label style={{ fontSize: '11px', opacity: 0.6 }}>PROCESS JITTER</Label>
                            <Row style={{ alignItems: 'baseline', gap: '4px' }}>
                                <ValueText style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: isStable ? 'var(--success)' : 'var(--warning)'
                                }}>
                                    {(jitter * 1000).toFixed(3)}
                                </ValueText>
                                <Label style={{ fontSize: '10px' }}>ms</Label>
                            </Row>
                        </Stack>

                        {/* Sparkline */}
                        <div style={{ height: '32px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <svg width="100%" height="100%" viewBox="0 0 100 32" preserveAspectRatio="none">
                                <polyline
                                    fill="none"
                                    stroke="var(--accent)"
                                    strokeWidth="1.5"
                                    points={jitterHistory.map((v, i) => `${(i / 20) * 100},${32 - Math.min(32, v * 10)}`).join(' ')}
                                />
                            </svg>
                        </div>
                    </Stack>
                </Grid>

                {measuredMs === 0 && (
                    <Row style={{
                        gap: '8px',
                        padding: '10px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                        <AlertCircle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                        <Text style={{ fontSize: '10px', color: 'var(--warning)', margin: 0, lineHeight: 1.4 }}>
                            <strong>Calibration Required:</strong> Place your microphone near your speaker and hit Calibrate for sample-accurate loops.
                        </Text>
                    </Row>
                )}
            </Stack>
        </Card>
    );
};

const Heading = ({ children, style }: any) => (
    <h3 style={{ color: 'white', fontWeight: 600, ...style }}>{children}</h3>
);
