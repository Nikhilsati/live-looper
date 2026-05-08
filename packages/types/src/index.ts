/// <reference path="./oat.d.ts" />


export interface SectionConfig {
    index: number;
    name: string;
    lengthInBars: number;
    trackLinks: boolean[]; // length 4 — which tracks play in this section
}

export interface EQSettings {
    low: number;
    mid: number;
    midFreq: number;
    high: number;
}

export interface CompressorSettings {
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
    gain: number;
}

export interface DriveSettings {
    amount: number;
    tone: number;     // 0–1: 0 = dark/rolled-off, 1 = full bright
    enabled: boolean;
}

export interface DelaySettings {
    time: number; // in beats
    feedback: number;
    mix: number;
    mode: 'mono' | 'pingpong';
    filter: number; // 0–1: brightness of feedback path (0 = dark/muffled, 1 = bright/open)
    enabled: boolean;
}

export interface ReverbSettings {
    mix: number;
    size: number;       // impulse duration in seconds (0.1–5)
    predelay: number;   // pre-delay in ms (0–100)
    damping: number;    // 0 = dark, 1 = bright (maps to lowpass cutoff)
    enabled: boolean;
}

export interface NoiseGateSettings {
    threshold: number;
    attack: number;
    release: number;
    enabled: boolean;
}

export interface ChorusSettings {
    rate: number;    // LFO rate in Hz (0.1–5)
    depth: number;   // LFO depth 0–1 (maps to delay time variation)
    mix: number;     // wet/dry blend 0–1
    voices: 1 | 2;  // 1 = classic chorus, 2 = stereo doubler
    enabled: boolean;
}

export interface PhaserSettings {
    rate: number;      // LFO rate in Hz (0.1–5)
    depth: number;     // sweep depth 0–1
    feedback: number;  // resonance/intensity 0–0.9
    stages: 2 | 4;    // number of allpass stages
    enabled: boolean;
}

export interface TremoloSettings {
    rate: number;      // LFO rate in Hz (0.1-20), or beat fraction (0.25, 0.5, 1, etc.) when sync=true
    depth: number;     // modulation depth 0-1
    sync: boolean;     // sync rate to bpm
    enabled: boolean;
}

export interface FXState {
    eq: EQSettings;
    compressor: CompressorSettings;
    drive: DriveSettings;
    chorus: ChorusSettings;
    phaser: PhaserSettings;
    tremolo: TremoloSettings;
    delay: DelaySettings;
    reverb: ReverbSettings;
    noiseGate: NoiseGateSettings;
    pan: number;
}

export interface Track {
    isMuted: boolean;
    fx: FXState;
}

export interface TrackState extends Track {
    isSoloed: boolean;
    isRecording: boolean;
    isArmed: boolean;    // pending recording at next section boundary
    hasAudio: boolean;    // has audio in current section
    layerCount: number;
    waveformData: number[];
}

export interface LiveTrackState extends Track {
}

export type Mode = 'planning' | 'practice' | 'live';

export interface QuantizationSettings {
    snapToGrid: boolean;
    gridResolution: number;
}

export interface FrozenProjectSnapshot {
    sections: SectionConfig[];
    tracks: TrackState[];
    liveTrack: LiveTrackState;
    bpm: number;
    quantization: QuantizationSettings;
}

export interface EngineState {
    isPlaying: boolean;
    bpm: number;
    currentBar: number;
    currentBeat: number;
    sectionProgress: number;     // 0–1 within current section loop
    currentSectionIndex: number;
    queuedSectionIndex: number | null;
    sections: SectionConfig[];
    tracks: TrackState[];
    liveTrack: LiveTrackState;
    mode: Mode;
    // Performance & Latency Suite
    latencyMeasuredSamples: number;
    latencyCompensationSamples: number;
    isCalibratingLatency: boolean;
    jitter: number;
    lastHitOffset: number; // ms offset from quantization boundary
}

// Storage Interfaces
export interface ProjectRecord {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    bpm: number;
    timeSignature: string;
    masterLengthSamples: number;
    schemaVersion: number;
    appVersion: string;
    settings?: {
        metronomeOn?: boolean;
        showLayers?: boolean;
        smartSnapEnabled?: boolean;
        liveTrack?: LiveTrackState;
    };
}

export interface TrackRecord {
    id: string;
    projectId: string;
    name: string;
    order: number;
    color: string;
    muted: boolean;
    solo: boolean;
    fx?: FXState;
}

export interface SectionRecord {
    id: string;
    projectId: string;
    name: string;
    order: number;
    lengthSamples: number;
    lengthInBars?: number; // Preferred source of truth; lengthSamples is a fallback
}

export interface LayerRecord {
    id: string;
    projectId: string;
    trackId: string;
    sectionId: string;
    audioBlobId: string;
    rawAudioBlobId?: string;
    gain: number;
    order: number;
    /** Timestamp (ms) when this layer was soft-deleted (undo). Null/undefined = active. */
    deletedAt?: number | null;
}

export interface AudioBlobRecord {
    id: string;
    projectId: string;
    blob: Blob;   // WAV
    sampleRate: number;
    channels: number;
    lengthSamples: number;
}

export type ConfigPayload = {
    sampleRate: number;
    bpm: number;
    sections: SectionConfig[];
    latencySamples: number;
    smartSnapEnabled?: boolean;
    quantization?: QuantizationSettings;
};

export type WorkletMessage =
    | { type: 'CONFIG'; payload: ConfigPayload }
    | { type: 'START' }
    | { type: 'STOP' }
    | { type: 'RTL_TEST' }
    | { type: 'SET_LATENCY'; payload: Pick<ConfigPayload, 'latencySamples'> }
    | { type: 'ARM_TRACK'; payload: { trackId: number } }
    | { type: 'MUTE_TRACK'; payload: { trackId: number } }
    | { type: 'MUTE_METRONOME' }
    | { type: 'UNDO_LAYER'; payload: { trackId: number } }
    | { type: 'CLEAR_TRACK'; payload: { trackId: number } }
    | { type: 'CLEAR_ALL_TRACKS' }
    | { type: 'QUEUE_SECTION'; payload: { sectionIndex: number } }
    | { type: 'SET_BPM'; payload: Pick<ConfigPayload, 'bpm'> }
    | { type: 'SET_BUFFER'; payload: { trackId: number; sectionIndex: number; buffer: Float32Array } }
    | { type: 'SET_MODE'; payload: { mode: Mode } }
    | { type: 'ENTER_LIVE_MODE'; payload: { snapshot: FrozenProjectSnapshot } }
    | { type: 'SET_SMART_SNAP'; payload: { enabled: boolean } };

export type WorkletEvent =
    | ({ type: 'TICK' } & Pick<EngineState, 'currentBar' | 'currentBeat' | 'sectionProgress' | 'jitter'> & { sectionIndex: number })
    | { type: 'RECORD_STOP'; trackId: number; sectionIndex: number; buffer: Float32Array; rawBuffer?: Float32Array; waveformData: number[]; layerCount: number }
    | { type: 'TRACK_CLEARED'; trackId: number }
    | { type: 'SECTION_CHANGE'; sectionIndex: number }
    | { type: 'RTL_MEASURED'; samples: number }
    | { type: 'RTL_TIMEOUT' }
    | { type: 'UNDO_LAYER'; trackId: number; sectionIndex?: number };

export type EngineEvent =
    | WorkletEvent
    | { type: 'ENGINE_CRASHED'; }
    | {
        type: 'PROJECT_LOADED';
        payload: {
            project: ProjectRecord;
            tracks: TrackRecord[];
            sections: SectionConfig[];
            layerCounts: Record<number, number>;
            waveformDataMap: Record<number, number[]>;
            liveTrack: LiveTrackState;
        };
    };

export class FXBuilder {
    private state: FXState;
    constructor(initialState?: Partial<FXState>) {
        this.state = {
            eq: { low: 0, mid: 0, midFreq: 1000, high: 0 },
            compressor: { threshold: -24, ratio: 4, attack: 0.003, release: 0.25, gain: 0 },
            drive: { amount: 0, tone: 1, enabled: false },
            chorus: { rate: 0.5, depth: 0.4, mix: 0.5, voices: 1, enabled: false },
            phaser: { rate: 0.5, depth: 0.5, feedback: 0.5, stages: 4, enabled: false },
            tremolo: { rate: 5, depth: 0.5, sync: false, enabled: false },
            delay: { time: 0.5, feedback: 0.3, mix: 0, mode: 'mono', filter: 1, enabled: false },
            reverb: { mix: 0, size: 1.5, predelay: 0, damping: 1, enabled: false },
            noiseGate: { threshold: -50, attack: 0.01, release: 0.1, enabled: false },
            pan: 0,
        };

        if (initialState) {
            this.merge(initialState);
        }
    }

    withEQ(eq: Partial<EQSettings>) { Object.assign(this.state.eq, eq); return this; }
    withCompressor(comp: Partial<CompressorSettings>) { Object.assign(this.state.compressor, comp); return this; }
    withDrive(drive: Partial<DriveSettings>) { Object.assign(this.state.drive, drive); return this; }
    withChorus(chorus: Partial<ChorusSettings>) { Object.assign(this.state.chorus, chorus); return this; }
    withPhaser(phaser: Partial<PhaserSettings>) { Object.assign(this.state.phaser, phaser); return this; }
    withTremolo(tremolo: Partial<TremoloSettings>) { Object.assign(this.state.tremolo, tremolo); return this; }
    withDelay(delay: Partial<DelaySettings>) { Object.assign(this.state.delay, delay); return this; }
    withReverb(reverb: Partial<ReverbSettings>) { Object.assign(this.state.reverb, reverb); return this; }
    withNoiseGate(gate: Partial<NoiseGateSettings>) { Object.assign(this.state.noiseGate, gate); return this; }
    withPan(pan: number) { this.state.pan = pan; return this; }

    merge(partial: Partial<FXState>) {
        if (partial.eq) Object.assign(this.state.eq, partial.eq);
        if (partial.compressor) Object.assign(this.state.compressor, partial.compressor);
        if (partial.drive) Object.assign(this.state.drive, partial.drive);
        if (partial.chorus) Object.assign(this.state.chorus, partial.chorus);
        if (partial.phaser) Object.assign(this.state.phaser, partial.phaser);
        if (partial.tremolo) Object.assign(this.state.tremolo, partial.tremolo);
        if (partial.delay) Object.assign(this.state.delay, partial.delay);
        if (partial.reverb) Object.assign(this.state.reverb, partial.reverb);
        if (partial.noiseGate) Object.assign(this.state.noiseGate, partial.noiseGate);
        if (partial.pan !== undefined) this.state.pan = partial.pan;
        return this;
    }

    build(): FXState {
        // Return a deep clone to prevent reference mutations
        return JSON.parse(JSON.stringify(this.state));
    }
}
