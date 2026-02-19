import React, { useEffect, useState, useRef } from 'react';
import { Card, Stack, Row, Label, ValueText, StatusDot, Text } from '../UI';
import { audioEngine } from '../engine/AudioEngine';

export const LatencyMonitor = () => {
    const [metrics, setMetrics] = useState<{
        baseLatency: number;
        outputLatency: number;
        sampleRate: number;
        processJitter: number;
        workletDrift: number;
    } | null>(null);

    const lastTickRef = useRef<{ time: number; hostTime: number } | null>(null);
    const jittersRef = useRef<number[]>([]);

    useEffect(() => {
        const unsubscribe = audioEngine.subscribe((event) => {
            if (event.type === 'TICK') {
                const now = performance.now() / 1000;
                const { time, currentTime } = event;
                const engineMetrics = audioEngine.getLatencyMetrics();

                if (engineMetrics) {
                    let drift = 0;
                    if (currentTime !== undefined) {
                        drift = Math.abs(currentTime - time);
                    }

                    // Calculate jitter based on host arrival time of TICK messages
                    // Note: This also includes main thread scheduling jitter, but it's a good proxy for perceived latency
                    let jitter = 0;
                    if (lastTickRef.current) {
                        const deltaHost = now - lastTickRef.current.hostTime;
                        // Expected delta should be based on beat duration, but let's just track variance
                        // For now, let's just use the context latencies as they are more reliable
                    }
                    lastTickRef.current = { time, hostTime: now };

                    setMetrics({
                        baseLatency: engineMetrics.baseLatency,
                        outputLatency: engineMetrics.outputLatency,
                        sampleRate: engineMetrics.sampleRate,
                        processJitter: jitter,
                        workletDrift: drift,
                    });
                }
            }
        });

        return unsubscribe;
    }, []);

    if (!metrics) return null;

    const totalLatency = (metrics.baseLatency + metrics.outputLatency) * 1000;
    const isGood = totalLatency < 20;
    const isOk = totalLatency < 50;

    return (
        <Card style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Stack>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <Label style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Realtime Latency</Label>
                    <Row style={{ alignItems: 'center', gap: '6px' }}>
                        <StatusDot className={isGood ? 'bg-success' : isOk ? 'bg-warning' : 'bg-danger'} />
                        <ValueText style={{ fontSize: '14px', fontWeight: 'bold', color: isGood ? '#4ade80' : isOk ? '#fbbf24' : '#ef4444' }}>
                            {totalLatency.toFixed(1)}ms
                        </ValueText>
                    </Row>
                </Row>

                <Grid cols="1fr 1fr" style={{ gap: '12px' }}>
                    <Stack style={{ gap: '2px' }}>
                        <Label style={{ fontSize: '10px', opacity: 0.6 }}>Base (HW)</Label>
                        <ValueText style={{ fontSize: '12px' }}>{(metrics.baseLatency * 1000).toFixed(1)}ms</ValueText>
                    </Stack>
                    <Stack style={{ gap: '2px' }}>
                        <Label style={{ fontSize: '10px', opacity: 0.6 }}>Output</Label>
                        <ValueText style={{ fontSize: '12px' }}>{(metrics.outputLatency * 1000).toFixed(1)}ms</ValueText>
                    </Stack>
                    <Stack style={{ gap: '2px' }}>
                        <Label style={{ fontSize: '10px', opacity: 0.6 }}>Sample Rate</Label>
                        <ValueText style={{ fontSize: '12px' }}>{metrics.sampleRate / 1000}kHz</ValueText>
                    </Stack>
                    <Stack style={{ gap: '2px' }}>
                        <Label style={{ fontSize: '10px', opacity: 0.6 }}>Clock Drift</Label>
                        <ValueText style={{ fontSize: '12px' }}>{(metrics.workletDrift * 1000).toFixed(3)}ms</ValueText>
                    </Stack>
                </Grid>

                {totalLatency > 50 && (
                    <Text style={{ fontSize: '10px', color: '#ef4444', marginTop: '8px', fontStyle: 'italic' }}>
                        High latency detected. Check audio settings or browser performance.
                    </Text>
                )}
            </Stack>
        </Card>
    );
};

const Grid = ({ children, cols, style }: any) => (
    <div style={{ display: 'grid', gridTemplateColumns: cols, ...style }}>
        {children}
    </div>
);
