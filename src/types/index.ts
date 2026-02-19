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

export interface TrackState {
    isMuted: boolean;
    isRecording: boolean;
    hasAudio: boolean;    // has audio in current section
    layerCount: number;
    waveformData: number[];
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
