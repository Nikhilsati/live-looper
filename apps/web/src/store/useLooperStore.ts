import { create } from 'zustand';
import type { EngineState, TrackState, SectionConfig, FXState } from '@live-looper/types';
import { DEFAULT_SECTIONS, DEFAULT_BPM, audioEngine } from '@live-looper/audio-engine';

interface LooperStore extends EngineState {
    // Actions
    setIsPlaying: (v: boolean) => void;
    updateTick: (bar: number, beat: number, sectionIndex: number, sectionProgress: number) => void;
    setTrackState: (trackId: number, state: Partial<TrackState>) => void;
    setCurrentSection: (index: number) => void;
    setQueuedSection: (index: number | null) => void;
    setSections: (sections: SectionConfig[]) => void;
    setBpm: (bpm: number) => void;
    setTrackFX: (trackId: number, fx: Partial<FXState>) => void;
    // Latency Actions
    calibrateLatency: () => void;
    setCompensation: (samples: number) => void;
    setLastHitOffset: (ms: number) => void;
    handleEngineEvent: (event: any) => void;
}

const defaultTrack = (): TrackState => ({
    isMuted: false,
    isRecording: false,
    hasAudio: false,
    layerCount: 0,
    waveformData: [],
    fx: {
        eq: { low: 0, mid: 0, midFreq: 1000, high: 0 },
        compressor: { threshold: -24, ratio: 4, attack: 0.003, release: 0.25, gain: 0 },
        drive: { amount: 0, enabled: false },
        delay: { time: 0.5, feedback: 0.3, mix: 0, enabled: false },
        reverb: { mix: 0, enabled: false },
        pan: 0,
    }
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
    latencyMeasuredSamples: 0,
    latencyCompensationSamples: 0,
    isCalibratingLatency: false,
    jitter: 0,
    lastHitOffset: 0,

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

    setTrackFX: (trackId, fx) => set(prev => {
        const newTracks = [...prev.tracks];
        if (newTracks[trackId]) {
            newTracks[trackId] = {
                ...newTracks[trackId],
                fx: { ...newTracks[trackId].fx, ...fx }
            };
        }
        return { tracks: newTracks };
    }),

    calibrateLatency: () => {
        set({ isCalibratingLatency: true });
        audioEngine.runRTLTest();
    },

    setCompensation: (samples) => {
        set({ latencyCompensationSamples: samples });
        audioEngine.setLatencyCompensation(samples);
    },

    setLastHitOffset: (ms) => set({ lastHitOffset: ms }),

    handleEngineEvent: (event) => {
        const { setTrackState, updateTick, setCurrentSection } = get();
        switch (event.type) {
            case 'TICK':
                updateTick(event.bar, event.beat, event.sectionIndex ?? 0, event.sectionProgress ?? 0);
                set({ jitter: event.jitter || 0 });
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
                break;
            case 'RTL_MEASURED':
                set({
                    latencyMeasuredSamples: event.samples,
                    latencyCompensationSamples: event.samples, // Auto-apply measured as default
                    isCalibratingLatency: false
                });
                audioEngine.setLatencyCompensation(event.samples);
                break;
            case 'RTL_TIMEOUT':
                set({ isCalibratingLatency: false });
                alert('Latency Calibration Timed Out. Ensure Output is looped to Input.');
                break;
        }
    },
}));

// Initialize compensation from localStorage
const savedComp = localStorage.getItem('looper_rtl_samples');
if (savedComp) {
    useLooperStore.getState().setCompensation(parseInt(savedComp, 10));
}

// Subscribe to store changes to update the audio engine
useLooperStore.subscribe((state, prevState) => {
    // Sync BPM
    if (state.bpm !== prevState.bpm) {
        audioEngine.setBpm(state.bpm);
    }

    // Sync Track FX
    state.tracks.forEach((track, i) => {
        const prevTrack = prevState.tracks[i];
        if (track.fx !== prevTrack?.fx || state.bpm !== prevState.bpm) {
            audioEngine.updateFX(i, track.fx, state.bpm);
        }
    });

    // Sync Playing state
    if (state.isPlaying !== prevState.isPlaying) {
        if (state.isPlaying) audioEngine.start();
        else audioEngine.stop();
    }
});
