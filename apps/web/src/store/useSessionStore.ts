import { create } from 'zustand';
import { type SessionRecord, type FrozenProjectSnapshot } from '@live-looper/types';
import { sessionService, db } from '@live-looper/storage';
import { audioEngine } from '@live-looper/audio-engine';
import { sessionRecorder } from './SessionRecorder';
import { useLooperStore } from './useLooperStore';
import { uiAlert } from './useDialogStore';

interface SessionState {
    isSessionArmed: boolean;
    isSessionRecording: boolean;
    isSessionReplaying: boolean;
    sessions: SessionRecord[];

    // Actions
    setIsSessionArmed: (v: boolean) => void;
    fetchSessions: (projectId: string) => Promise<void>;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    replaySession: (session: SessionRecord) => Promise<void>;
    stopReplay: () => void;
    deleteSession: (id: string) => Promise<void>;
    togglePlayback: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    isSessionArmed: true,
    isSessionRecording: false,
    isSessionReplaying: false,
    sessions: [],

    setIsSessionArmed: (v) => set({ isSessionArmed: v }),

    fetchSessions: async (projectId) => {
        const sessions = await sessionService.getSessionsForProject(projectId);
        set({ sessions });
    },

    startRecording: async () => {
        const looperStore = useLooperStore.getState();
        const snapshot: FrozenProjectSnapshot = {
            sections: JSON.parse(JSON.stringify(looperStore.sections)),
            tracks: JSON.parse(JSON.stringify(looperStore.tracks)),
            liveTrack: JSON.parse(JSON.stringify(looperStore.liveTrack)),
            bpm: looperStore.bpm,
            quantization: { snapToGrid: looperStore.smartSnapEnabled, gridResolution: 16 }
        };

        await sessionRecorder.start(snapshot);
        set({ isSessionRecording: true });
    },

    stopRecording: async () => {
        const looperStore = useLooperStore.getState();
        const result = await sessionRecorder.stop();

        if (result && looperStore.currentProject) {
            await sessionService.createSession(
                looperStore.currentProject.id,
                `Session ${new Date().toLocaleString()}`,
                result.durationMs,
                result.events,
                result.snapshot,
                result.audioBlob
            );
            uiAlert("Session saved successfully");
            get().fetchSessions(looperStore.currentProject.id);
        }

        set({ isSessionRecording: false, isSessionArmed: false });
    },

    replaySession: async (session) => {
        const looperStore = useLooperStore.getState();

        set({ isSessionReplaying: true });

        // Enforce snapshot state on looper store
        await looperStore.loadProject(session.projectId);

        // Directly update looper store state
        useLooperStore.setState({
            bpm: session.projectSnapshot.bpm,
            sections: session.projectSnapshot.sections,
            tracks: session.projectSnapshot.tracks,
            liveTrack: session.projectSnapshot.liveTrack,
            smartSnapEnabled: session.projectSnapshot.quantization.snapToGrid
        });

        // Sync Audio Engine
        audioEngine.setBpm(session.projectSnapshot.bpm);
        session.projectSnapshot.tracks.forEach((t, i) => {
            audioEngine.updateFX(i, t.fx, session.projectSnapshot.bpm);
            audioEngine.setMute(i, t.isMuted);
        });

        const soloedIds = session.projectSnapshot.tracks.map((t, i) => t.isSoloed ? i : -1).filter(i => i !== -1);
        if (soloedIds.length > 0) {
            audioEngine.applySolo(soloedIds, session.projectSnapshot.tracks.map(t => t.isMuted));
        }

        audioEngine.updateLiveTrackFX(session.projectSnapshot.liveTrack.fx, session.projectSnapshot.bpm);
        audioEngine.setLiveTrackMute(session.projectSnapshot.liveTrack.isMuted);
        audioEngine.setSmartSnapEnabled(session.projectSnapshot.quantization.snapToGrid);

        // Load and play live audio
        if (session.liveAudioBlobId) {
            const blobRecord = await db.audioBlobs.get(session.liveAudioBlobId);
            if (blobRecord) {
                await audioEngine.playLiveAudio(blobRecord.blob);
            }
        }

        // Start playback via looper store
        await looperStore.startPlayback();

        // Schedule Events
        session.events.forEach(event => {
            setTimeout(() => {
                if (!get().isSessionReplaying) return;

                const currentLooperStore = useLooperStore.getState();

                switch (event.type) {
                    case 'PLAY':
                        if (!currentLooperStore.isPlaying) currentLooperStore.startPlayback();
                        break;
                    case 'STOP':
                        if (currentLooperStore.isPlaying) currentLooperStore.stopPlayback();
                        break;
                    case 'ARM_TRACK':
                        currentLooperStore.setTrackState(event.payload.trackId, { isArmed: event.payload.isArmed });
                        break;
                    case 'MUTE_TRACK':
                        currentLooperStore.setTrackState(event.payload.trackId, { isMuted: event.payload.isMuted });
                        break;
                    case 'SOLO_TRACK':
                        if (currentLooperStore.tracks[event.payload.trackId].isSoloed !== event.payload.isSoloed) {
                            currentLooperStore.setSolo(event.payload.trackId);
                        }
                        break;
                    case 'SECTION_CHANGE':
                        currentLooperStore.setCurrentSection(event.payload.index);
                        break;
                    case 'SET_BPM':
                        currentLooperStore.setBpm(event.payload.bpm);
                        break;
                    case 'SET_TRACK_FX':
                        currentLooperStore.setTrackFX(event.payload.trackId, event.payload.fx);
                        break;
                    case 'SET_LIVE_TRACK_FX':
                        currentLooperStore.setLiveTrackState({ fx: event.payload.fx });
                        break;
                    case 'MUTE_LIVE_TRACK':
                        currentLooperStore.setLiveTrackState({ isMuted: event.payload.isMuted });
                        break;
                    case 'CLEAR_TRACK':
                        currentLooperStore.setTrackState(event.payload.trackId, { hasAudio: false, layerCount: 0, waveformData: [] });
                        audioEngine.clearTrack(event.payload.trackId);
                        break;
                }
            }, event.timestampMs);
        });

        // Auto-stop
        setTimeout(() => {
            if (get().isSessionReplaying) {
                get().stopReplay();
            }
        }, session.durationMs + 500);
    },

    stopReplay: () => {
        audioEngine.stopLiveAudio();
        useLooperStore.getState().stopPlayback();
        set({ isSessionReplaying: false });
    },

    deleteSession: async (id) => {
        await sessionService.deleteSession(id);
        const projectId = useLooperStore.getState().currentProject?.id;
        if (projectId) get().fetchSessions(projectId);
    },

    togglePlayback: async () => {
        const looperStore = useLooperStore.getState();
        const { isSessionArmed, isSessionRecording, startRecording, stopRecording } = get();

        if (looperStore.isPlaying) {
            if (isSessionRecording) {
                await stopRecording();
            }
            looperStore.stopPlayback();
        } else {
            if (isSessionArmed && !isSessionRecording) {
                await startRecording();
            }
            await looperStore.startPlayback();
        }
    }
}));
