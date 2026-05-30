/**
 * useTransportStore — transport & clock state.
 *
 * Owns: isPlaying, bpm, currentBar, currentBeat, sectionProgress,
 *       currentSectionIndex, queuedSectionIndex, startPlayback, stopPlayback, setBpm.
 */
import { create } from "zustand";
import { modeController } from "@live-looper/mode-controller";
import { sessionRecorder } from "./SessionRecorder";
import { db } from "@live-looper/storage";
import { audioEngine, DEFAULT_BPM } from "@live-looper/audio-engine";

export interface TransportState {
  isPlaying: boolean;
  bpm: number;
  currentBar: number;
  currentBeat: number;
  sectionProgress: number;
  currentSectionIndex: number;
  queuedSectionIndex: number | null;

  // Actions
  setIsPlaying: (v: boolean) => void;
  setBpm: (bpm: number) => void;
  updateTick: (tick: {
    bar: number;
    beat: number;
    sectionIndex: number;
    sectionProgress: number;
  }) => void;
  setQueuedSection: (index: number | null) => void;
  togglePlayback: () => Promise<void>;
}

export const useTransportStore = create<TransportState>((set, get) => ({
  isPlaying: false,
  bpm: DEFAULT_BPM,
  currentBar: 1,
  currentBeat: 1,
  sectionProgress: 0,
  currentSectionIndex: 0,
  queuedSectionIndex: null,

  setIsPlaying: (isPlaying) => {
    if (
      !modeController.isActionAllowed(
        isPlaying ? "start-transport" : "stop-transport",
      )
    )
      return;
    set({ isPlaying });
  },

  setBpm: (bpm) => {
    if (!modeController.isActionAllowed("change-tempo")) return;
    sessionRecorder.logEvent("SET_BPM", { bpm });
    set({ bpm });
    // Persist via dynamic import to avoid circular dep with useLooperStore
    import("./useLooperStore").then(({ useLooperStore }) => {
      const projectId = useLooperStore.getState().currentProject?.id;
      if (projectId) db.projects.update(projectId, { bpm });
    });
  },

  updateTick: ({ bar, beat, sectionIndex, sectionProgress }) =>
    set({
      currentBar: bar,
      currentBeat: beat,
      currentSectionIndex: sectionIndex,
      sectionProgress,
    }),

  setQueuedSection: (index) => {
    if (!modeController.isActionAllowed("trigger-section")) return;
    set({ queuedSectionIndex: index });
  },

  togglePlayback: async () => {
    // Delegate to useLooperStore which coordinates engine + session
    const { useLooperStore } = await import("./useLooperStore");
    const { isPlaying, startPlayback, stopPlayback } =
      useLooperStore.getState();
    if (isPlaying) stopPlayback();
    else await startPlayback();
  },
}));
