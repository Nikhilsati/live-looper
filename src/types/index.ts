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
}

