import { create } from 'zustand';
import type { EngineState, TrackState, SectionConfig } from '../types';
import { DEFAULT_SECTIONS, DEFAULT_BPM } from '../engine/AudioEngine';

interface LooperStore extends EngineState {
    // Actions
    setIsPlaying: (v: boolean) => void;
    updateTick: (bar: number, beat: number, sectionIndex: number, sectionProgress: number) => void;
    setTrackState: (trackId: number, state: Partial<TrackState>) => void;
    setCurrentSection: (index: number) => void;
    setQueuedSection: (index: number | null) => void;
    setSections: (sections: SectionConfig[]) => void;
    setBpm: (bpm: number) => void;
    handleEngineEvent: (event: any) => void;
}

const defaultTrack = (): TrackState => ({
    isMuted: false,
    isRecording: false,
    hasAudio: false,
    layerCount: 0,
    waveformData: [],
});

export const useLooperStore = create<LooperStore>((set, get) => ({
    isPlaying: false,
    bpm: DEFAULT_BPM,
    currentBar: 1,
    currentBeat: 1,
    sectionProgress: 0,
    currentSectionIndex: 0,
    queuedSectionIndex: null,
    sections: DEFAULT_SECTIONS,
    tracks: [defaultTrack(), defaultTrack(), defaultTrack(), defaultTrack()],

    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setBpm: (bpm) => set({ bpm }),
    setSections: (sections) => set({ sections }),
    setCurrentSection: (index) => set({ currentSectionIndex: index, queuedSectionIndex: null }),
    setQueuedSection: (index) => set({ queuedSectionIndex: index }),

    updateTick: (bar, beat, sectionIndex, sectionProgress) =>
        set({ currentBar: bar, currentBeat: beat, currentSectionIndex: sectionIndex, sectionProgress }),

    setTrackState: (trackId, state) => set(prev => {
        const newTracks = [...prev.tracks];
        if (newTracks[trackId]) newTracks[trackId] = { ...newTracks[trackId], ...state };
        return { tracks: newTracks };
    }),

    handleEngineEvent: (event) => {
        const { setTrackState, updateTick, setCurrentSection } = get();
        switch (event.type) {
            case 'TICK':
                updateTick(event.bar, event.beat, event.sectionIndex ?? 0, event.sectionProgress ?? 0);
                break;
            case 'RECORD_STOP':
                setTrackState(event.trackId, {
                    isRecording: false,
                    hasAudio: true,
                    waveformData: event.waveformData ?? [],
                    layerCount: event.layerCount ?? 1,
                });
                break;
            case 'TRACK_CLEARED':
                setTrackState(event.trackId, { isRecording: false, hasAudio: false, waveformData: [], layerCount: 0 });
                break;
            case 'SECTION_CHANGE':
                setCurrentSection(event.sectionIndex);
                // Reset per-track hasAudio/layerCount for new section (they may have audio in other sections)
                // We don't reset — tracks keep their state; UI will show section-specific data when we add that
                break;
        }
    },
}));
