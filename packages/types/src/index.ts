/// <reference path="./oat.d.ts" />
export interface SongConfig {
    songId: string;
    name: string;
    bpm: number;
    timeSignature: '4/4';
    key: string;
    sections: SectionConfig[];
}

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
}

export interface LayerRecord {
    id: string;
    projectId: string;
    trackId: string;
    sectionId: string;
    audioBlobId: string;
    gain: number;
    order: number;
}

export interface AudioBlobRecord {
    id: string;
    projectId: string;
    blob: Blob;   // WAV
    sampleRate: number;
    channels: number;
    lengthSamples: number;
}
