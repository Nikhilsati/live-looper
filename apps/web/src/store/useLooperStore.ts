import { create } from 'zustand';
import { FXBuilder } from '@live-looper/types';
import type {
    EngineState, TrackState, SectionConfig, FXState, Mode,
    ProjectRecord, EngineEvent, LiveTrackState, FXPreset
} from '@live-looper/types';
import { DEFAULT_SECTIONS, DEFAULT_BPM, audioEngine } from '@live-looper/audio-engine';
import { modeController } from '@live-looper/mode-controller';
import { db, projectService, exportService, presetService } from '@live-looper/storage';
import { sessionRecorder } from './SessionRecorder';
import { uiAlert } from './useDialogStore';
interface LooperStore extends EngineState {
    projectList: ProjectRecord[];
    currentProject: ProjectRecord | null;
    // I/O state
    availableInputs: MediaDeviceInfo[];
    availableOutputs: MediaDeviceInfo[];
    inputDeviceId: string | null;
    outputDeviceId: string | null;
    performerOutputDeviceId: string | null;
    // Actions
    fetchProjects: () => Promise<void>;
    createNewProject: (name: string) => Promise<string>;
    loadProject: (id: string) => Promise<void>;
    loadDemoData: () => Promise<void>;
    closeProject: () => void;
    deleteProject: (id: string) => Promise<void>;
    exportProject: (id: string) => Promise<void>;
    importProject: (file: File) => Promise<void>;
    
    // FX Presets
    fxPresets: FXPreset[];
    fetchFXPresets: () => Promise<void>;
    saveFXPreset: (name: string, type: 'chain' | 'module', fxState: any, moduleType?: string) => Promise<void>;
    deleteFXPreset: (id: string) => Promise<void>;
    importFXPreset: (file: File) => Promise<void>;
    exportFXPreset: (id: string) => Promise<void>;

    setMode: (mode: Mode) => Promise<void>;
    setIsPlaying: (v: boolean) => void;
    startPlayback: () => Promise<void>;
    stopPlayback: () => void;
    updateTick: (tick: { bar: number, beat: number, sectionIndex: number, sectionProgress: number }) => void;
    setTrackState: (trackId: number, state: Partial<TrackState>) => void;
    setCurrentSection: (index: number) => void;
    setQueuedSection: (index: number | null) => void;
    setSections: (sections: SectionConfig[]) => void;
    setBpm: (bpm: number) => void;
    addSection: (name: string) => Promise<void>;
    renameSection: (sectionId: string, newName: string) => Promise<void>;
    deleteSection: (sectionId: string) => Promise<void>;
    reorderSections: (sectionIds: string[]) => Promise<void>;
    carryForwardTrack: (trackIndex: number, fromSectionId: string, toSectionId: string, enabled: boolean) => Promise<void>;
    setTrackFX: (trackId: number, fx: Partial<FXState>) => void;
    // Latency Actions
    calibrateLatency: () => void;
    setCompensation: (samples: number) => void;
    setLastHitOffset: (ms: number) => void;
    handleEngineEvent: (event: EngineEvent) => void;
    deleteLayer: (layerId: string) => Promise<void>;
    setSolo: (trackId: number) => void;
    toggleTrackRecording: (trackId: number) => void;
    togglePlayback: () => Promise<void>;
    // I/O Actions
    refreshDevices: () => Promise<void>;
    setInputDevice: (deviceId: string) => Promise<void>;
    setOutputDevice: (deviceId: string) => Promise<void>;
    setPerformerOutputDevice: (deviceId: string) => Promise<void>;
    showLayers: boolean;
    setShowLayers: (v: boolean) => void;
    showDevInspector: boolean;
    setShowDevInspector: (v: boolean) => void;
    metronomeOn: boolean;
    setMetronomeOn: (v: boolean) => void;
    smartSnapEnabled: boolean;
    setSmartSnapEnabled: (v: boolean) => void;
    dualOutputMode: boolean;
    setDualOutputMode: (v: boolean) => void;
    liveTrack: LiveTrackState;
    setLiveTrackState: (state: Partial<LiveTrackState>) => void;
    engineCrashed: boolean;
    setEngineCrashed: (v: boolean) => void;
    // Multi-channel I/O
    channelMapping: (string | null)[];
    trackChannelConfig: { [trackId: number]: { mode: 'mono' | 'stereo' } };
    inputLevels: number[];
    setChannelMapping: (trackId: number, deviceId: string | null) => Promise<void>;
    setTrackChannelMode: (trackId: number, mode: 'mono' | 'stereo') => Promise<void>;
}

const defaultTrack = (): TrackState => ({
    isMuted: false,
    isSoloed: false,
    isRecording: false,
    isArmed: false,
    hasAudio: false,
    layerCount: 0,
    waveformData: [],
    fx: new FXBuilder().build()
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
    liveTrack: {
        isMuted: false,
        fx: defaultTrack().fx,
    },
    latencyMeasuredSamples: 0,
    latencyCompensationSamples: 0,
    isCalibratingLatency: false,
    jitter: 0,
    lastHitOffset: 0,
    projectList: [],
    currentProject: null,
    // I/O state
    availableInputs: [],
    availableOutputs: [],
    inputDeviceId: null,
    outputDeviceId: null,
    performerOutputDeviceId: null,
    engineCrashed: false,
    channelMapping: [null, null, null, null],
    trackChannelConfig: {
        0: { mode: 'stereo' },
        1: { mode: 'stereo' },
        2: { mode: 'stereo' },
        3: { mode: 'stereo' }
    },
    inputLevels: [0, 0, 0, 0],
    
    fxPresets: [],
    fetchFXPresets: async () => {
        let presets = await db.fxPresets.toArray();
        if (presets.length === 0) {
            // Seed default presets
            await presetService.savePreset('Basic Ping Pong', 'module', { time: 0.5, feedback: 0.4, mix: 0.3, mode: 'pingpong', filter: 0.8, enabled: true }, 'delay');
            await presetService.savePreset('Slapback', 'module', { time: 0.125, feedback: 0.1, mix: 0.4, mode: 'mono', filter: 0.5, enabled: true }, 'delay');
            await presetService.savePreset('Dream Ambient', 'module', { time: 1.0, feedback: 0.8, mix: 0.6, mode: 'pingpong', filter: 0.3, enabled: true }, 'delay');
            
            await presetService.savePreset('Large Hall', 'module', { mix: 0.4, size: 3.5, predelay: 20, damping: 0.4, enabled: true }, 'reverb');
            await presetService.savePreset('Small Room', 'module', { mix: 0.2, size: 0.8, predelay: 5, damping: 0.8, enabled: true }, 'reverb');
            await presetService.savePreset('Endless Cave', 'module', { mix: 0.8, size: 5.0, predelay: 50, damping: 0.1, enabled: true }, 'reverb');

            await presetService.savePreset('Heavy Distortion', 'module', { amount: 0.8, tone: 0.7, enabled: true }, 'drive');
            await presetService.savePreset('Light Crunch', 'module', { amount: 0.3, tone: 0.5, enabled: true }, 'drive');
            await presetService.savePreset('Tape Crunch', 'module', { amount: 0.6, tone: 0.2, enabled: true }, 'drive');

            await presetService.savePreset('Vocal Doubler', 'module', { rate: 0.5, depth: 0.2, mix: 0.5, voices: 2, enabled: true }, 'chorus');
            await presetService.savePreset('Deep Swirl', 'module', { rate: 1.5, depth: 0.8, mix: 0.7, voices: 1, enabled: true }, 'chorus');
            
            await presetService.savePreset('Scooped Mids', 'module', { low: 3, mid: -5, high: 4 }, 'eq');
            await presetService.savePreset('Bass Boost', 'module', { low: 6, mid: 0, high: 0 }, 'eq');
            await presetService.savePreset('Airy Highs', 'module', { low: -2, mid: 0, high: 6 }, 'eq');
            
            await presetService.savePreset('Aggressive Squeeze', 'module', { threshold: -30, ratio: 8, gain: 6 }, 'compressor');
            await presetService.savePreset('Subtle Polish', 'module', { threshold: -15, ratio: 2, gain: 2 }, 'compressor');

            // Pedalboard Presets (Chains)
            await presetService.savePreset('Blues Lead', 'chain', new FXBuilder()
                .withDrive({ amount: 0.3, tone: 0.6, enabled: true })
                .withEQ({ low: 2, mid: 4, high: 2 })
                .withReverb({ mix: 0.2, size: 1.0, enabled: true })
                .withCompressor({ threshold: -15, ratio: 2, gain: 2 })
                .build());

            await presetService.savePreset('Dreamy Clean', 'chain', new FXBuilder()
                .withEQ({ low: 2, mid: 0, high: 4 })
                .withChorus({ rate: 0.4, depth: 0.5, mix: 0.4, enabled: true })
                .withDelay({ time: 0.5, feedback: 0.4, mix: 0.3, mode: 'pingpong', enabled: true })
                .withReverb({ mix: 0.5, size: 4.0, enabled: true })
                .withCompressor({ threshold: -20, ratio: 3, gain: 2 })
                .build());

            await presetService.savePreset('80s Shred', 'chain', new FXBuilder()
                .withDrive({ amount: 0.8, tone: 0.7, enabled: true })
                .withEQ({ low: 4, mid: -6, high: 5 })
                .withChorus({ rate: 0.5, depth: 0.3, mix: 0.3, voices: 2, enabled: true })
                .withDelay({ time: 0.125, feedback: 0.2, mix: 0.2, mode: 'mono', enabled: true })
                .withReverb({ mix: 0.2, size: 1.5, enabled: true })
                .build());

            await presetService.savePreset('Surf Rock', 'chain', new FXBuilder()
                .withEQ({ low: 0, mid: 0, high: 6 })
                .withReverb({ mix: 0.7, size: 3.0, damping: 0.8, enabled: true })
                .withTremolo({ rate: 6, depth: 0.8, enabled: true })
                .build());

            await presetService.savePreset('Ambient Swells', 'chain', new FXBuilder()
                .withEQ({ low: 2, mid: 0, high: 2 })
                .withChorus({ rate: 0.2, depth: 0.6, mix: 0.4, enabled: true })
                .withDelay({ time: 0.75, feedback: 0.7, mix: 0.5, filter: 0.4, enabled: true })
                .withReverb({ mix: 0.8, size: 5.0, enabled: true })
                .build());

            await presetService.savePreset('Funk Rhythm', 'chain', new FXBuilder()
                .withEQ({ low: -4, mid: -2, high: 6 })
                .withChorus({ rate: 1.0, depth: 0.2, mix: 0.2, enabled: true })
                .withCompressor({ threshold: -30, ratio: 8, gain: 4 })
                .build());

            presets = await db.fxPresets.toArray();
        }
        set({ fxPresets: presets });
    },
    saveFXPreset: async (name, type, fxState, moduleType) => {
        await presetService.savePreset(name, type, fxState, moduleType);
        await get().fetchFXPresets();
    },
    deleteFXPreset: async (id) => {
        await presetService.deletePreset(id);
        await get().fetchFXPresets();
    },
    importFXPreset: async (file) => {
        await presetService.importPreset(file);
        await get().fetchFXPresets();
    },
    exportFXPreset: async (id) => {
        await presetService.exportPreset(id);
    },

    setEngineCrashed: (v) => set({ engineCrashed: v }),
    // UI State
    showLayers: true,
    setShowLayers: (v) => {
        const { currentProject } = get();
        const newSettings = { ...(currentProject?.settings ?? {}), showLayers: v };
        set({
            showLayers: v,
            currentProject: currentProject ? { ...currentProject, settings: newSettings } : null,
        });
        if (currentProject?.id) {
            db.projects.update(currentProject.id, { settings: newSettings, updatedAt: Date.now() });
        }
    },
    showDevInspector: false,
    setShowDevInspector: (v) => set({ showDevInspector: v }),
    metronomeOn: true,
    setMetronomeOn: (v) => {
        const { currentProject } = get();
        const newSettings = { ...(currentProject?.settings ?? {}), metronomeOn: v };
        set({
            metronomeOn: v,
            currentProject: currentProject ? { ...currentProject, settings: newSettings } : null,
        });
        if (currentProject?.id) {
            db.projects.update(currentProject.id, { settings: newSettings, updatedAt: Date.now() });
        }
    },
    smartSnapEnabled: true,
    setSmartSnapEnabled: (v) => {
        const { currentProject } = get();
        const newSettings = { ...(currentProject?.settings ?? {}), smartSnapEnabled: v };
        set({
            smartSnapEnabled: v,
            currentProject: currentProject ? { ...currentProject, settings: newSettings } : null,
        });
        if (currentProject?.id) {
            db.projects.update(currentProject.id, { settings: newSettings, updatedAt: Date.now() });
        }
    },
    dualOutputMode: localStorage.getItem('looper_dual_output') === 'true',
    setDualOutputMode: (v) => {
        localStorage.setItem('looper_dual_output', String(v));
        set({ dualOutputMode: v });
    },
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

    loadDemoData: async () => {
        set({
            tracks: [defaultTrack(), defaultTrack(), defaultTrack(), defaultTrack()],
            isPlaying: false
        });
        await audioEngine.loadDemoData();
        // audioEngine.loadDemoData creates a new project and calls loadProject
        // internally, which emits PROJECT_LOADED. We still need to sync
        // currentProject and the project list in the store.
        const projects = await db.projects.orderBy('updatedAt').reverse().toArray();
        const lastProject = projects[0] ?? null;
        set({ projectList: projects, currentProject: lastProject });
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

    addSection: async (name: string) => {
        const { currentProject, loadProject } = get();
        if (!currentProject?.id) return;
        await projectService.addSection(currentProject.id, name);
        await loadProject(currentProject.id);
    },

    renameSection: async (sectionId: string, newName: string) => {
        const { currentProject, loadProject } = get();
        if (!currentProject?.id) return;
        await projectService.updateSectionName(currentProject.id, sectionId, newName);
        await loadProject(currentProject.id);
    },

    deleteSection: async (sectionId: string) => {
        const { currentProject, loadProject } = get();
        if (!currentProject?.id) return;
        await projectService.deleteSection(sectionId);
        await loadProject(currentProject.id);
    },

    reorderSections: async (sectionIds: string[]) => {
        const { currentProject, loadProject } = get();
        if (!currentProject?.id) return;
        await projectService.reorderSections(currentProject.id, sectionIds);
        await loadProject(currentProject.id);
    },

    carryForwardTrack: async (trackIndex: number, fromSectionId: string, toSectionId: string, enabled: boolean) => {
        const { currentProject, loadProject } = get();
        if (!currentProject?.id) return;
        await projectService.carryForwardTrack(currentProject.id, trackIndex, fromSectionId, toSectionId, enabled);
        await loadProject(currentProject.id);
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
            uiAlert(error);
        }
    },

    setIsPlaying: (isPlaying) => {
        if (!modeController.isActionAllowed(isPlaying ? 'start-transport' : 'stop-transport')) return;
        set({ isPlaying });
    },

    startPlayback: async () => {
        const { sections, bpm, setIsPlaying } = get();
        if (!modeController.isActionAllowed('start-transport')) return;

        sessionRecorder.logEvent('PLAY');

        await audioEngine.init(sections, bpm);
        audioEngine.start();
        setIsPlaying(true);
    },

    stopPlayback: () => {
        const { setIsPlaying } = get();
        if (!modeController.isActionAllowed('stop-transport')) return;

        sessionRecorder.logEvent('STOP');

        audioEngine.stop();
        setIsPlaying(false);
    },

    setBpm: (bpm) => {
        if (!modeController.isActionAllowed('change-tempo')) {
            return;
        }
        sessionRecorder.logEvent('SET_BPM', { bpm });
        set({ bpm });
        const projectId = get().currentProject?.id;
        if (projectId) {
            db.projects.update(projectId, { bpm });
        }
    },

    setSections: (sections) => {
        if (!modeController.isActionAllowed('add-section')) return;
        set({ sections });
    },

    setCurrentSection: (index) => {
        if (!modeController.isActionAllowed('trigger-section')) return;
        sessionRecorder.logEvent('SECTION_CHANGE', { index });
        set({ currentSectionIndex: index, queuedSectionIndex: null });
    },

    setQueuedSection: (index) => {
        if (!modeController.isActionAllowed('trigger-section')) return;
        set({ queuedSectionIndex: index });
    },

    updateTick: ({ bar, beat, sectionIndex, sectionProgress }) =>
        set({ currentBar: bar, currentBeat: beat, currentSectionIndex: sectionIndex, sectionProgress }),

    setTrackState: (trackId, state) => {
        const action = state.isRecording ? 'record' : state.hasAudio === false ? 'clear-track' : 'modify-track';
        if (state.isRecording !== undefined && !modeController.isActionAllowed(action)) return;

        if (state.isArmed !== undefined) {
            sessionRecorder.logEvent('ARM_TRACK', { trackId, isArmed: state.isArmed });
        }
        if (state.isMuted !== undefined) {
            sessionRecorder.logEvent('MUTE_TRACK', { trackId, isMuted: state.isMuted });
        }
        if (state.hasAudio === false && state.layerCount === 0) {
            sessionRecorder.logEvent('CLEAR_TRACK', { trackId });
        }

        set(prev => {
            const newTracks = [...prev.tracks];
            if (newTracks[trackId]) newTracks[trackId] = { ...newTracks[trackId], ...state };
            return { tracks: newTracks };
        });
    },

    setTrackFX: (trackId, fx) => {
        if (!modeController.isActionAllowed('modify-fx-config')) return;
        sessionRecorder.logEvent('SET_TRACK_FX', { trackId, fx });
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

    setLiveTrackState: (state) => {
        if (state.isMuted !== undefined) {
            sessionRecorder.logEvent('MUTE_LIVE_TRACK', { isMuted: state.isMuted });
        }
        if (state.fx !== undefined) {
            sessionRecorder.logEvent('SET_LIVE_TRACK_FX', { fx: state.fx });
        }

        set(prev => {
            const newLiveTrack = { ...prev.liveTrack, ...state };
            if (state.isMuted !== undefined) {
                audioEngine.setLiveTrackMute(state.isMuted);
            }
            if (state.fx !== undefined) {
                audioEngine.updateLiveTrackFX(state.fx, prev.bpm);
            }

            // Persist
            const projectId = prev.currentProject?.id;
            if (projectId) {
                db.projects.update(projectId, {
                    settings: {
                        ...(prev.currentProject?.settings ?? {}),
                        liveTrack: newLiveTrack
                    }
                });
            }

            return { liveTrack: newLiveTrack };
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

    deleteLayer: async (layerId) => {
        const { currentProject, loadProject } = get();
        if (!currentProject?.id) return;
        await projectService.deleteLayer(layerId);
        await loadProject(currentProject.id);
    },

    handleEngineEvent: (event: EngineEvent) => {
        const { setTrackState, updateTick, setCurrentSection } = get();
        switch (event.type) {
            case 'TICK':
                updateTick({
                    bar: event.currentBar,
                    beat: event.currentBeat,
                    sectionIndex: event.sectionIndex ?? 0,
                    sectionProgress: event.sectionProgress ?? 0
                });
                set({ jitter: event.jitter || 0, inputLevels: event.inputLevels || [0, 0, 0, 0] });
                break;
            case 'RECORD_STOP':
                setTrackState(event.trackId, {
                    isRecording: false,
                    isArmed: false,
                    hasAudio: true,
                    waveformData: event.waveformData ?? [],
                    layerCount: event.layerCount ?? 1,
                });
                break;
            case 'ENGINE_CRASHED':
                set({ engineCrashed: true });
                uiAlert("Audio Engine Crashed. Please reload the page.");
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
                set({
                    isCalibratingLatency: false
                });
                uiAlert('Latency Calibration Timed Out. Ensure Output is looped to Input.');
                break;
            case 'PROJECT_LOADED': {
                const { project, tracks, sections, layerCounts, waveformDataMap } = event.payload;
                const savedSettings = project.settings ?? {};
                const metronomeOn = savedSettings.metronomeOn ?? true;
                const showLayers = savedSettings.showLayers ?? true;
                const smartSnapEnabled = savedSettings.smartSnapEnabled ?? true;
                const channelMapping = savedSettings.channelMapping ?? [null, null, null, null];
                const trackChannelConfig = savedSettings.trackChannelConfig ?? {
                    0: { mode: 'stereo' },
                    1: { mode: 'stereo' },
                    2: { mode: 'stereo' },
                    3: { mode: 'stereo' }
                };

                set({
                    bpm: project.bpm,
                    sections,
                    currentProject: project,
                    metronomeOn,
                    showLayers,
                    smartSnapEnabled,
                    channelMapping,
                    trackChannelConfig,
                    liveTrack: event.payload.liveTrack,
                    tracks: tracks.map((t: any, i: number) => {
                        const count = layerCounts?.[i] || 0;
                        return {
                            ...defaultTrack(),
                            isMuted: t.muted ?? false,
                            isSoloed: t.solo ?? false,
                            fx: new FXBuilder(t.fx).build(),
                            hasAudio: count > 0,
                            layerCount: count,
                            waveformData: waveformDataMap?.[i] ?? [],
                        };
                    })
                });
                // Restore saved metronome state — setMetronome is idempotent (no-op if unchanged).
                audioEngine.setMetronome(metronomeOn);
                // Re-apply any persisted solo isolation to the audio engine
                const newTracks = get().tracks;
                const soloedIds = newTracks.map((t, i) => t.isSoloed ? i : -1).filter(i => i !== -1);
                if (soloedIds.length > 0) {
                    audioEngine.applySolo(soloedIds, newTracks.map(t => t.isMuted));
                }

                // Apply multi-channel input settings
                audioEngine.initInputs(channelMapping);
                Object.entries(trackChannelConfig).forEach(([trackId, config]) => {
                    audioEngine.setTrackChannelMode(Number(trackId), config.mode);
                });

                // Re-apply persisted Live Track mute state
                if (event.payload.liveTrack) {
                    audioEngine.setLiveTrackMute(event.payload.liveTrack.isMuted);
                }
                break;
            }
        }
    },

    setSolo: (trackId) => {
        const { tracks } = get();
        if (!tracks[trackId]) return;

        sessionRecorder.logEvent('SOLO_TRACK', { trackId, isSoloed: !tracks[trackId].isSoloed });

        // Simply toggle this track's solo — other tracks are unaffected
        set(prev => ({
            tracks: prev.tracks.map((t, i) => i === trackId ? { ...t, isSoloed: !t.isSoloed } : t)
        }));

        const updatedTracks = get().tracks;
        const soloedIds = updatedTracks.map((t, i) => t.isSoloed ? i : -1).filter(i => i !== -1);
        audioEngine.applySolo(soloedIds, updatedTracks.map(t => t.isMuted));

        // Persist solo flag for every track
        const projectId = get().currentProject?.id;
        if (projectId) {
            updatedTracks.forEach((t, i) => {
                db.tracks.where({ projectId, order: i }).first().then(rec => {
                    if (rec) db.tracks.update(rec.id, { solo: t.isSoloed });
                });
            });
        }
    },

    toggleTrackRecording: (trackId) => {
        const { isPlaying, sections, currentSectionIndex, sectionProgress, bpm, setLastHitOffset, tracks, setTrackState } = get();
        const track = tracks[trackId];
        if (!track) return;

        if (isPlaying && !track.isRecording) {
            const currentSection = sections[currentSectionIndex];
            if (currentSection) {
                const sectionLengthMs = (60 / bpm) * 4 * currentSection.lengthInBars * 1000;
                let offset = 0;
                if (sectionProgress > 0.5) {
                    offset = (sectionProgress - 1.0) * sectionLengthMs;
                } else {
                    offset = sectionProgress * sectionLengthMs;
                }
                setLastHitOffset(offset);

                setTrackState(trackId, { isArmed: true });
                // Fallback: auto-clear after 1.5× section length
                setTimeout(() => {
                    const currentTrack = get().tracks[trackId];
                    if (currentTrack?.isArmed) {
                        setTrackState(trackId, { isArmed: false });
                    }
                }, sectionLengthMs * 1.5);
            }
        } else if (track.isRecording) {
            setTrackState(trackId, { isArmed: false });
        }

        audioEngine.armTrack(trackId);
        setTrackState(trackId, { isRecording: !track.isRecording });
    },

    togglePlayback: async () => {
        const { isPlaying, startPlayback, stopPlayback } = get();
        if (isPlaying) stopPlayback();
        else await startPlayback();
    },

    refreshDevices: async () => {
        const { inputs, outputs } = await audioEngine.enumerateDevices();
        set({ availableInputs: inputs, availableOutputs: outputs });

        // Subscribe to hardware changes once
        if (!navigator.mediaDevices.ondevicechange) {
            navigator.mediaDevices.ondevicechange = async () => {
                const updated = await audioEngine.enumerateDevices();
                set({ availableInputs: updated.inputs, availableOutputs: updated.outputs });
            };
        }
    },

    setInputDevice: async (deviceId: string) => {
        await audioEngine.setInputDevice(deviceId);
        set({ inputDeviceId: deviceId });
    },

    setOutputDevice: async (deviceId: string) => {
        await audioEngine.setOutputDevice(deviceId);
        set({ outputDeviceId: deviceId });
    },

    setPerformerOutputDevice: async (deviceId: string) => {
        await audioEngine.setPerformerOutputDevice(deviceId);
        set({ performerOutputDeviceId: deviceId });
    },

    setChannelMapping: async (trackId: number, deviceId: string | null) => {
        const { channelMapping, currentProject } = get();
        const newMapping = [...channelMapping];
        newMapping[trackId] = deviceId;
        set({ channelMapping: newMapping });
        
        // Update engine
        await audioEngine.initInputs(newMapping);

        // Persist to project settings
        if (currentProject?.id) {
            const newSettings = { ...(currentProject.settings ?? {}), channelMapping: newMapping };
            db.projects.update(currentProject.id, { settings: newSettings });
        }
    },

    setTrackChannelMode: async (trackId: number, mode: 'mono' | 'stereo') => {
        const { trackChannelConfig, currentProject } = get();
        const newConfig = { ...trackChannelConfig, [trackId]: { mode } };
        set({ trackChannelConfig: newConfig });

        // Update engine
        audioEngine.setTrackChannelMode(trackId, mode);

        // Persist to project settings
        if (currentProject?.id) {
            const newSettings = { ...(currentProject.settings ?? {}), trackChannelConfig: newConfig };
            db.projects.update(currentProject.id, { settings: newSettings });
        }
    },
}));

(globalThis as any).looperStore = useLooperStore;


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

// Initialize dual output from state
audioEngine.setDualOutputMode(useLooperStore.getState().dualOutputMode);

useLooperStore.subscribe((state, prevState) => {
    // Sync BPM
    if (state.bpm !== prevState.bpm) {
        audioEngine.setBpm(state.bpm);
    }

    // Sync Smart Snap
    if (state.smartSnapEnabled !== prevState.smartSnapEnabled) {
        audioEngine.setSmartSnapEnabled(state.smartSnapEnabled);
    }

    // Sync Dual Output Mode
    if (state.dualOutputMode !== prevState.dualOutputMode) {
        audioEngine.setDualOutputMode(state.dualOutputMode);
    }

    // Sync Section config (lengthInBars, name) to DB
    if (state.sections !== prevState.sections) {
        const projectId = state.currentProject?.id;
        if (projectId) {
            state.sections.forEach((section, i) => {
                const prev = prevState.sections[i];
                if (section.lengthInBars !== prev?.lengthInBars || section.name !== prev?.name) {
                    db.sections.where({ projectId, order: i }).first().then(s => {
                        if (s) db.sections.update(s.id, { lengthInBars: section.lengthInBars, name: section.name });
                    });
                }
            });
        }
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

        // Sync Mute state to audio engine + DB
        if (track.isMuted !== prevTrack?.isMuted) {
            // Only drive the worklet if no solo is active — when a solo is on,
            // applySolo controls mute isolation; the flag is persisted and will
            // be restored correctly when solo is cleared.
            const hasSolo = state.tracks.some(t => t.isSoloed);
            if (!hasSolo) {
                audioEngine.setMute(i, track.isMuted);
            }
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
