import { Play, Square, Music2, Mic, Volume2, VolumeX, Undo2, Trash2, ChevronRight, Sliders } from 'lucide-react';
import { useState } from 'react';
import { audioEngine } from '@live-looper/audio-engine';
import { useLooperStore } from '../store/useLooperStore';
import { Card, Button, Label, ValueText, Badge, Slider, Row, Grid, Heading, Stack, Waveform } from '@live-looper/ui';
import { TrackFX } from './TrackFX';

const ICON_SIZE = 22;

// ─── Layer Dots ────────────────────────────────────────────────────────────────
const LayerDots = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
        <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
                <div key={i} style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: i === count - 1 ? '#a78bfa' : 'rgba(255,255,255,0.25)',
                }} />
            ))}
            {count > 6 && <span style={{ fontSize: 9, color: '#666' }}>+{count - 6}</span>}
        </div>
    );
};

// ─── Track Pad ─────────────────────────────────────────────────────────────────
const TrackPad = ({ trackId, onOpenFX }: { trackId: number, onOpenFX: (id: number) => void }) => {
    const { tracks, sectionProgress, bpm, sections, currentSectionIndex, isPlaying, lastHitOffset, setLastHitOffset } = useLooperStore();
    const track = tracks[trackId];
    const [showHit, setShowHit] = useState(false);

    const handleArm = () => {
        if (isPlaying && !track.isRecording) {
            const currentSection = sections[currentSectionIndex];
            if (currentSection) {
                const sectionLengthMs = (60 / bpm) * 4 * currentSection.lengthInBars * 1000;
                // Calculate offset from quantization boundary
                let offset = 0;
                if (sectionProgress > 0.5) {
                    offset = (sectionProgress - 1.0) * sectionLengthMs; // Early (-)
                } else {
                    offset = sectionProgress * sectionLengthMs; // Late (+)
                }
                setLastHitOffset(offset);
                setShowHit(true);
                setTimeout(() => setShowHit(false), 2000);
            }
        }
        audioEngine.armTrack(trackId);
        useLooperStore.getState().setTrackState(trackId, { isRecording: !track.isRecording });
    };
    const handleMute = () => {
        audioEngine.toggleMute(trackId);
        useLooperStore.getState().setTrackState(trackId, { isMuted: !track.isMuted });
    };
    const handleUndo = () => {
        audioEngine.undoLayer(trackId);
        const newCount = Math.max(0, track.layerCount - 1);
        useLooperStore.getState().setTrackState(trackId, { layerCount: newCount, hasAudio: newCount > 0 });
    };
    const handleClear = () => {
        audioEngine.clearTrack(trackId);
        useLooperStore.getState().setTrackState(trackId, { isRecording: false, hasAudio: false, waveformData: [], layerCount: 0 });
    };

    const isOverdubbing = track.isRecording && track.hasAudio;
    const padColor = track.isRecording
        ? (isOverdubbing ? '#7c3aed' : '#dc2626')
        : track.hasAudio ? '#16a34a' : 'rgba(255,255,255,0.06)';

    const padBorder = track.isRecording
        ? `2px solid ${isOverdubbing ? '#a78bfa' : '#f87171'}`
        : track.hasAudio ? '2px solid #4ade80' : '1px solid rgba(255,255,255,0.05)';

    const statusLabel = track.isRecording
        ? (isOverdubbing ? 'OVERDUB' : 'REC')
        : track.hasAudio ? 'LOOP' : 'EMPTY';

    const statusColor = track.isRecording
        ? (isOverdubbing ? '#f87171' : '#f87171')
        : track.hasAudio ? '#4ade80' : '#374151';

    return (
        <Card style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minWidth: 0,
            padding: '20px 16px',
            flex: 1,
            position: 'relative'
        }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Label style={{ fontSize: 14, fontWeight: 700 }}>TRACK {trackId + 1}</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {showHit && isPlaying && (
                        <div style={{
                            position: 'absolute',
                            top: 12,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: lastHitOffset > 0 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.9)',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            zIndex: 10,
                            animation: 'fadeInOut 2s forwards'
                        }}>
                            HIT: {lastHitOffset > 0 ? '+' : ''}{Math.round(lastHitOffset)}ms
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenFX(trackId)}
                        style={{ padding: '4px', opacity: 0.6 }}
                    >
                        <Sliders size={16} />
                    </Button>
                    <LayerDots count={track.layerCount} />
                    <ValueText color={statusColor} style={{ fontSize: 11, fontWeight: 800 }}>{statusLabel}</ValueText>
                </div>
            </Row>

            {/* Main pad */}
            <Button
                onClick={handleArm}
                style={{
                    background: padColor,
                    border: padBorder,
                    height: 140,
                    width: '100%',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: track.isRecording ? '0 0 20px rgba(220, 38, 38, 0.3)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {track.isRecording
                    ? <Mic size={48} style={{ animation: 'pulse 0.7s ease-in-out infinite alternate' }} />
                    : track.hasAudio
                        ? <Play size={48} />
                        : <Mic size={44} color="rgba(255,255,255,0.2)" />
                }
            </Button>

            {/* Bottom controls */}
            <Row style={{ gap: 10 }}>
                <Button
                    onClick={handleMute}
                    size="md"
                    variant={track.isMuted ? 'warning' : undefined}
                    style={{ flex: 1, height: 60, borderRadius: 16 }}
                >
                    {track.isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </Button>
                <Button
                    onClick={handleUndo}
                    disabled={track.layerCount === 0}
                    size="md"
                    style={{ flex: 1, height: 60, borderRadius: 16, opacity: track.layerCount === 0 ? 0.2 : 1 }}
                >
                    <Undo2 size={24} />
                </Button>
                <Button
                    onClick={handleClear}
                    disabled={!track.hasAudio && !track.isRecording}
                    size="md"
                    style={{ flex: 0.6, height: 60, borderRadius: 16, opacity: (!track.hasAudio && !track.isRecording) ? 0.2 : 0.6 }}
                >
                    <Trash2 size={20} />
                </Button>
            </Row>

            <Waveform data={track.waveformData} progress={sectionProgress} height={40} />
        </Card>
    );
};


// ─── Section Progress Ring ─────────────────────────────────────────────────────
const ProgressRing = ({ progress, bar, beat }: { progress: number; bar: number; beat: number }) => {
    const r = 48;
    const circ = 2 * Math.PI * r;
    const dash = circ * progress;
    return (
        <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
            <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                <circle
                    cx="65" cy="65" r={r} fill="none"
                    stroke="#a78bfa" strokeWidth="8"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dasharray 0.05s linear',
                        filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.4))'
                    }}
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'monospace', color: 'white', lineHeight: 1 }}>
                    {bar}
                </div>
                <div style={{ fontSize: 16, color: '#a78bfa', fontWeight: 600, fontFamily: 'monospace', marginTop: -4 }}>
                    .{beat}
                </div>
            </div>
        </div>
    );
};


// ─── Section Navigator ─────────────────────────────────────────────────────────
const SectionNavigator = () => {
    const { sections, currentSectionIndex, queuedSectionIndex, isPlaying } = useLooperStore();

    const handleQueue = (index: number) => {
        if (!isPlaying) return;
        if (index === currentSectionIndex) {
            useLooperStore.getState().setQueuedSection(null);
            audioEngine.queueSection(currentSectionIndex);
        } else {
            useLooperStore.getState().setQueuedSection(index);
            audioEngine.queueSection(index);
        }
    };

    return (
        <Row style={{ flexWrap: 'wrap', gap: 10 }}>
            {sections.map((sec) => {
                const isCurrent = sec.index === currentSectionIndex;
                const isQueued = sec.index === queuedSectionIndex;
                const variant = isCurrent ? 'active-primary' : (isQueued ? 'active-warning' : 'ghost');

                return (
                    <Button
                        key={sec.index}
                        onClick={() => handleQueue(sec.index)}
                        variant={variant}
                        disabled={!isPlaying}
                        style={{
                            padding: '12px 20px',
                            minWidth: 100,
                            height: 60,
                            fontSize: 14,
                            fontWeight: 700,
                            borderRadius: 16,
                            cursor: isPlaying ? 'pointer' : 'default',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isQueued && <ChevronRight size={16} />}
                            {sec.name}
                        </div>
                        <span style={{ fontSize: 10, opacity: 0.6 }}>{sec.lengthInBars} BARS</span>
                    </Button>
                );
            })}
        </Row>
    );

};

// ─── Metronome Button ──────────────────────────────────────────────────────────
const MetronomeButton = () => {
    const [on, setOn] = useState(true);
    return (
        <Button
            onClick={() => { audioEngine.toggleMetronome(); setOn(p => !p); }}
            size="sm"
            variant={on ? 'accent' : undefined}
            title={on ? 'Mute Metronome' : 'Unmute Metronome'}
        >
            <Music2 size={ICON_SIZE} />
        </Button>
    );
};

// ─── Transport Bar ─────────────────────────────────────────────────────────────
export const DebugControls = () => {
    const { isPlaying, currentBar, currentBeat, sectionProgress, sections, currentSectionIndex, bpm } = useLooperStore();
    const currentSection = sections[currentSectionIndex];
    const [showBpm, setShowBpm] = useState(false);

    const handleStart = async () => {
        await audioEngine.init(sections, bpm);
        audioEngine.start();
        useLooperStore.getState().setIsPlaying(true);
    };
    const handleStop = () => {
        audioEngine.stop();
        useLooperStore.getState().setIsPlaying(false);
    };

    const handleBpmChange = (newBpm: number) => {
        useLooperStore.getState().setBpm(newBpm);
        if (isPlaying) audioEngine.setBpm(newBpm);
    };

    return (
        <Card style={{
            width: '100%',
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)'
        }}>
            <Row style={{ gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Left: Progress & Info */}
                <Row style={{ gap: 24, alignItems: 'center' }}>
                    <ProgressRing progress={sectionProgress} bar={currentBar} beat={currentBeat} />
                    <Stack style={{ gap: 4 }}>
                        <Label style={{ opacity: 0.5, fontSize: 12 }}>CURRENT SECTION</Label>
                        <Heading style={{ fontSize: 24, margin: 0 }}>{currentSection?.name ?? 'Section'}</Heading>
                        <Badge variant={isPlaying ? 'live' : undefined} style={{ width: 'fit-content', marginTop: 4 }}>
                            {isPlaying ? '▶ LIVE PERFORMANCE' : '■ SESSION STOPPED'}
                        </Badge>
                    </Stack>
                </Row>

                {/* Center: Main Transport */}
                <Row style={{ gap: 16, background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 24 }}>
                    <Button
                        onClick={isPlaying ? handleStop : handleStart}
                        size="lg"
                        variant={isPlaying ? 'danger' : 'primary'}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            boxShadow: isPlaying ? '0 0 40px rgba(220, 38, 38, 0.25)' : '0 0 40px rgba(124, 58, 237, 0.25)'
                        }}
                    >
                        {isPlaying ? <Square size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" />}
                    </Button>

                    <Stack style={{ gap: 8 }}>
                        <MetronomeButton />
                        <Button
                            variant="ghost"
                            size="sm"
                            style={{ fontSize: 11, padding: '8px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)' }}
                            onClick={() => audioEngine.loadDemoData()}
                        >
                            LOAD DEMO
                        </Button>
                    </Stack>
                </Row>

                {/* Right: Section Navigation & BPM (De-prioritized) */}
                <div style={{ flex: 1, maxWidth: 400 }}>
                    {isPlaying ? (
                        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <Label style={{ display: 'block', marginBottom: 8, fontSize: 11, opacity: 0.5 }}>QUEUE NEXT</Label>
                            <SectionNavigator />
                        </div>
                    ) : (
                        <Row style={{ justifyContent: 'flex-end', gap: 12 }}>
                            <Stack style={{ alignItems: 'flex-end', gap: 4 }}>
                                <Label style={{ fontSize: 11, opacity: 0.5 }}>TEMPO</Label>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowBpm(!showBpm)}
                                    style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)' }}
                                >
                                    <ValueText style={{ fontSize: 24, fontWeight: 700 }}>{bpm}</ValueText>
                                    <Label style={{ marginLeft: 4, opacity: 0.6 }}>BPM</Label>
                                </Button>
                            </Stack>
                        </Row>
                    )}
                </div>
            </Row>

            {/* Expandable BPM Controls */}
            {showBpm && !isPlaying && (
                <div style={{
                    marginTop: 20, paddingTop: 20,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: 20,
                    animation: 'slideDown 0.2s ease-out'
                }}>
                    <Label style={{ minWidth: 60 }}>Adjust BPM</Label>
                    <Button onClick={() => handleBpmChange(bpm - 5)} style={{ width: 44, height: 44, borderRadius: 12, fontSize: 18 }}>-5</Button>
                    <Button onClick={() => handleBpmChange(bpm - 1)} style={{ width: 44, height: 44, borderRadius: 12, fontSize: 18 }}>-</Button>
                    <Slider
                        min={40} max={220} step={1}
                        value={bpm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleBpmChange(Number(e.target.value))}
                        style={{ flex: 1, height: 40 }}
                    />
                    <Button onClick={() => handleBpmChange(bpm + 1)} style={{ width: 44, height: 44, borderRadius: 12, fontSize: 18 }}>+</Button>
                    <Button onClick={() => handleBpmChange(bpm + 5)} style={{ width: 44, height: 44, borderRadius: 12, fontSize: 18 }}>+5</Button>
                </div>
            )}
        </Card >
    );
};


// ─── 4-column Track Horizontal Grid ─────────────────────────────────────────
export const TrackControls = () => {
    const [activeFXTrack, setActiveFXTrack] = useState<number | null>(null);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <Grid cols="repeat(4, 1fr)" style={{ width: '100%', gap: 16 }}>
                {[0, 1, 2, 3].map(id => (
                    <TrackPad
                        key={id}
                        trackId={id}
                        onOpenFX={(id) => setActiveFXTrack(id)}
                    />
                ))}
            </Grid>

            {activeFXTrack !== null && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2000,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={() => setActiveFXTrack(null)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <TrackFX
                            trackId={activeFXTrack}
                            onClose={() => setActiveFXTrack(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

