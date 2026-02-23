import { create } from 'zustand';
import type { EngineState, TrackState, SectionConfig, FXState, Mode, ProjectRecord } from '@live-looper/types';
import { DEFAULT_SECTIONS, DEFAULT_BPM, audioEngine } from '@live-looper/audio-engine';
import { modeController } from '@live-looper/mode-controller';
import { db, projectService, exportService } from '@live-looper/storage';

interface LooperStore extends EngineState {
    projectList: ProjectRecord[];
    currentProject: ProjectRecord | null;
    // Actions
    fetchProjects: () => Promise<void>;
    createNewProject: (name: string) => Promise<string>;
    loadProject: (id: string) => Promise<void>;
    closeProject: () => void;
    deleteProject: (id: string) => Promise<void>;
    exportProject: (id: string) => Promise<void>;
    importProject: (file: File) => Promise<void>;
    setMode: (mode: Mode) => Promise<void>;
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
    mode: 'planning',
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
    projectList: [],
    currentProject: null,

    fetchProjects: async () => {
        const projects = await db.projects.orderBy('updatedAt').reverse().toArray();
        set({ projectList: projects });
    },

    createNewProject: async (name) => {
        if (!modeController.isActionAllowed('add-section')) return ""; // Basic check
        const id = await audioEngine.createNewProject(name);
        await get().fetchProjects();
        return id;
    },

    loadProject: async (id) => {
        // Reset current tracks before loading to avoid flicker/stale data
        set({
            tracks: [defaultTrack(), defaultTrack(), defaultTrack(), defaultTrack()],
            isPlaying: false
        });
        await audioEngine.loadProject(id);
        const project = await db.projects.get(id);
        set({ currentProject: project || null });
    },

    closeProject: () => {
        audioEngine.stop();
        localStorage.removeItem('looper_current_project_id');
        set({
            currentProject: null,
            isPlaying: false,
            tracks: [defaultTrack(), defaultTrack(), defaultTrack(), defaultTrack()]
        });
    },

    deleteProject: async (id) => {
        if (get().currentProject?.id === id) {
            set({ currentProject: null });
        }
        await projectService.deleteProject(id);
        await get().fetchProjects();
    },

    exportProject: async (id) => {
        await exportService.exportProject(id);
    },

    importProject: async (file) => {
        const id = await exportService.importProject(file);
        await get().fetchProjects();
        await get().loadProject(id);
    },

    setMode: async (targetMode) => {
        const state = get();
        const { success, error, snapshot } = await modeController.transitionTo(targetMode, state);
        if (success) {
            set({ mode: targetMode });
            audioEngine.setMode(targetMode);
            if (targetMode === 'live' && snapshot) {
                audioEngine.enterLiveMode(snapshot);
            }
        } else if (error) {
            alert(error);
        }
    },

    setIsPlaying: (isPlaying) => {
        if (!modeController.isActionAllowed(isPlaying ? 'start-transport' : 'stop-transport')) return;
        set({ isPlaying });
    },

    setBpm: (bpm) => {
        if (!modeController.isActionAllowed('change-tempo')) {
            // Re-sync with actual BPM if blocked
            return;
        }
        set({ bpm });
    },

    setSections: (sections) => {
        if (!modeController.isActionAllowed('add-section')) return;
        set({ sections });
    },

    setCurrentSection: (index) => {
        if (!modeController.isActionAllowed('trigger-section')) return;
        set({ currentSectionIndex: index, queuedSectionIndex: null });
    },

    setQueuedSection: (index) => {
        if (!modeController.isActionAllowed('trigger-section')) return;
        set({ queuedSectionIndex: index });
    },

    updateTick: (bar, beat, sectionIndex, sectionProgress) =>
        set({ currentBar: bar, currentBeat: beat, currentSectionIndex: sectionIndex, sectionProgress }),

    setTrackState: (trackId, state) => {
        const action = state.isRecording ? 'record' : state.hasAudio === false ? 'clear-track' : 'modify-track';
        if (!modeController.isActionAllowed(action)) return;

        set(prev => {
            const newTracks = [...prev.tracks];
            if (newTracks[trackId]) newTracks[trackId] = { ...newTracks[trackId], ...state };
            return { tracks: newTracks };
        });
    },

    setTrackFX: (trackId, fx) => {
        if (!modeController.isActionAllowed('modify-fx-config')) return;
        set(prev => {
            const newTracks = [...prev.tracks];
            if (newTracks[trackId]) {
                newTracks[trackId] = {
                    ...newTracks[trackId],
                    fx: { ...newTracks[trackId].fx, ...fx }
                };
            }
            return { tracks: newTracks };
        });
    },

    calibrateLatency: () => {
        if (get().mode === 'live') return;
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
            case 'PROJECT_LOADED':
                set({
                    bpm: event.payload.project.bpm,
                    sections: event.payload.sections,
                    tracks: event.payload.tracks.map((t: any, i: number) => {
                        const count = event.payload.layerCounts?.[i] || 0;
                        return {
                            ...defaultTrack(),
                            isMuted: t.muted,
                            fx: t.fx || defaultTrack().fx,
                            hasAudio: count > 0,
                            layerCount: count
                        };
                    })
                });
                break;
        }
    },
}));

// Initialize compensation from localStorage
const savedComp = localStorage.getItem('looper_rtl_samples');
if (savedComp) {
    useLooperStore.getState().setCompensation(parseInt(savedComp, 10));
}

// Resume last project
const lastProjectId = localStorage.getItem('looper_current_project_id');
if (lastProjectId) {
    useLooperStore.getState().loadProject(lastProjectId);
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

            // Persist FX to DB
            const projectId = state.currentProject?.id;
            if (projectId) {
                db.tracks.where({ projectId, order: i }).first().then(t => {
                    if (t) db.tracks.update(t.id, { fx: track.fx });
                });
            }
        }

        // Sync Mute state to DB
        if (track.isMuted !== prevTrack?.isMuted) {
            const projectId = state.currentProject?.id;
            if (projectId) {
                db.tracks.where({ projectId, order: i }).first().then(t => {
                    if (t) db.tracks.update(t.id, { muted: track.isMuted });
                });
            }
        }
    });

    // Sync Playing state
    if (state.isPlaying !== prevState.isPlaying) {
        if (state.isPlaying) audioEngine.start();
        else audioEngine.stop();
    }
});
