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
    enabled: boolean;
}

export interface DelaySettings {
    time: number; // in beats
    feedback: number;
    mix: number;
    enabled: boolean;
}

export interface ReverbSettings {
    mix: number;
    enabled: boolean;
}

export interface FXState {
    eq: EQSettings;
    compressor: CompressorSettings;
    drive: DriveSettings;
    delay: DelaySettings;
    reverb: ReverbSettings;
    pan: number;
}

export interface TrackState {
    isMuted: boolean;
    isRecording: boolean;
    isArmed: boolean;    // pending recording at next section boundary
    hasAudio: boolean;    // has audio in current section
    layerCount: number;
    waveformData: number[];
    fx: FXState;
}

export type Mode = 'planning' | 'practice' | 'live';

export interface QuantizationSettings {
    snapToGrid: boolean;
    gridResolution: number;
}

export interface FrozenProjectSnapshot {
    sections: SectionConfig[];
    tracks: TrackState[];
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
    | { type: 'ENTER_LIVE_MODE'; payload: { snapshot: FrozenProjectSnapshot } };

export type WorkletEvent =
    | ({ type: 'TICK' } & Pick<EngineState, 'currentBar' | 'currentBeat' | 'sectionProgress' | 'jitter'> & { sectionIndex: number })
    | { type: 'RECORD_STOP'; trackId: number; sectionIndex: number; buffer: Float32Array; waveformData: number[]; layerCount: number }
    | { type: 'TRACK_CLEARED'; trackId: number }
    | { type: 'SECTION_CHANGE'; sectionIndex: number }
    | { type: 'RTL_MEASURED'; samples: number }
    | { type: 'RTL_TIMEOUT' }
    | { type: 'UNDO_LAYER'; trackId: number; sectionIndex?: number };

export type EngineEvent =
    | WorkletEvent
    | {
        type: 'PROJECT_LOADED';
        payload: {
            project: ProjectRecord;
            tracks: TrackRecord[];
            sections: SectionConfig[];
            layerCounts: Record<number, number>;
            waveformDataMap: Record<number, number[]>;
        };
    };
