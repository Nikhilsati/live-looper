/**
 * useUIStore — purely presentational UI toggles.
 *
 * Owns: showLayers, showDevInspector, metronomeOn, smartSnapEnabled,
 *       dualOutputMode, engineCrashed.
 */
import { create } from "zustand";
import { db } from "@live-looper/storage";
import { audioEngine } from "@live-looper/audio-engine";

export interface UIState {
  showLayers: boolean;
  showDevInspector: boolean;
  metronomeOn: boolean;
  smartSnapEnabled: boolean;
  dualOutputMode: boolean;
  engineCrashed: boolean;

  // Actions
  setShowLayers: (v: boolean) => void;
  setShowDevInspector: (v: boolean) => void;
  setMetronomeOn: (v: boolean) => void;
  setSmartSnapEnabled: (v: boolean) => void;
  setDualOutputMode: (v: boolean) => void;
  setEngineCrashed: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  showLayers: true,
  showDevInspector: false,
  metronomeOn: true,
  smartSnapEnabled: true,
  dualOutputMode: localStorage.getItem("looper_dual_output") === "true",
  engineCrashed: false,

  setShowLayers: (v) => {
    set({ showLayers: v });
    import("./useLooperStore").then(({ useLooperStore }) => {
      const { currentProject } = useLooperStore.getState();
      if (!currentProject?.id) return;
      const newSettings = { ...(currentProject.settings ?? {}), showLayers: v };
      db.projects.update(currentProject.id, {
        settings: newSettings,
        updatedAt: Date.now(),
      });
    });
  },

  setShowDevInspector: (v) => set({ showDevInspector: v }),

  setMetronomeOn: (v) => {
    set({ metronomeOn: v });
    audioEngine.setMetronome(v);
    import("./useLooperStore").then(({ useLooperStore }) => {
      const { currentProject } = useLooperStore.getState();
      if (!currentProject?.id) return;
      const newSettings = {
        ...(currentProject.settings ?? {}),
        metronomeOn: v,
      };
      db.projects.update(currentProject.id, {
        settings: newSettings,
        updatedAt: Date.now(),
      });
    });
  },

  setSmartSnapEnabled: (v) => {
    set({ smartSnapEnabled: v });
    audioEngine.setSmartSnapEnabled(v);
    import("./useLooperStore").then(({ useLooperStore }) => {
      const { currentProject } = useLooperStore.getState();
      if (!currentProject?.id) return;
      const newSettings = {
        ...(currentProject.settings ?? {}),
        smartSnapEnabled: v,
      };
      db.projects.update(currentProject.id, {
        settings: newSettings,
        updatedAt: Date.now(),
      });
    });
  },

  setDualOutputMode: (v) => {
    localStorage.setItem("looper_dual_output", String(v));
    set({ dualOutputMode: v });
    audioEngine.setDualOutputMode(v);
  },

  setEngineCrashed: (v) => set({ engineCrashed: v }),
}));
