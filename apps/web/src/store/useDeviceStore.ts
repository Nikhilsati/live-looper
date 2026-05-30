/**
 * useDeviceStore — audio I/O device management.
 *
 * Owns: availableInputs, availableOutputs, inputDeviceId, outputDeviceId,
 *       performerOutputDeviceId, channelMapping, trackChannelConfig, inputLevels.
 */
import { create } from "zustand";
import { TRACK_COUNT } from "@live-looper/types";
import { audioEngine } from "@live-looper/audio-engine";
import { db } from "@live-looper/storage";

export interface DeviceState {
  availableInputs: MediaDeviceInfo[];
  availableOutputs: MediaDeviceInfo[];
  inputDeviceId: string | null;
  outputDeviceId: string | null;
  performerOutputDeviceId: string | null;
  channelMapping: (string | null)[];
  trackChannelConfig: { [trackId: number]: { mode: "mono" | "stereo" } };
  inputLevels: number[];

  // Actions
  refreshDevices: () => Promise<void>;
  setInputDevice: (deviceId: string) => Promise<void>;
  setOutputDevice: (deviceId: string) => Promise<void>;
  setPerformerOutputDevice: (deviceId: string) => Promise<void>;
  setChannelMapping: (
    trackId: number,
    deviceId: string | null,
  ) => Promise<void>;
  setTrackChannelMode: (
    trackId: number,
    mode: "mono" | "stereo",
  ) => Promise<void>;
  setInputLevels: (levels: number[]) => void;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  availableInputs: [],
  availableOutputs: [],
  inputDeviceId: null,
  outputDeviceId: null,
  performerOutputDeviceId: null,
  channelMapping: Array(TRACK_COUNT).fill(null),
  trackChannelConfig: Object.fromEntries(
    Array.from({ length: TRACK_COUNT }, (_, i) => [
      i,
      { mode: "stereo" as const },
    ]),
  ),
  inputLevels: Array(TRACK_COUNT).fill(0),

  setInputLevels: (levels) => set({ inputLevels: levels }),

  refreshDevices: async () => {
    const { inputs, outputs } = await audioEngine.enumerateDevices();
    set({ availableInputs: inputs, availableOutputs: outputs });

    if (!navigator.mediaDevices.ondevicechange) {
      navigator.mediaDevices.ondevicechange = async () => {
        const updated = await audioEngine.enumerateDevices();
        set({
          availableInputs: updated.inputs,
          availableOutputs: updated.outputs,
        });
      };
    }
  },

  setInputDevice: async (deviceId) => {
    await audioEngine.setInputDevice(deviceId);
    set({ inputDeviceId: deviceId });
  },

  setOutputDevice: async (deviceId) => {
    await audioEngine.setOutputDevice(deviceId);
    set({ outputDeviceId: deviceId });
  },

  setPerformerOutputDevice: async (deviceId) => {
    await audioEngine.setPerformerOutputDevice(deviceId);
    set({ performerOutputDeviceId: deviceId });
  },

  setChannelMapping: async (trackId, deviceId) => {
    const { channelMapping } = get();
    const newMapping = [...channelMapping];
    newMapping[trackId] = deviceId;
    set({ channelMapping: newMapping });
    await audioEngine.initInputs(newMapping);

    import("./useLooperStore").then(({ useLooperStore }) => {
      const { currentProject } = useLooperStore.getState();
      if (!currentProject?.id) return;
      const newSettings = {
        ...(currentProject.settings ?? {}),
        channelMapping: newMapping,
      };
      db.projects.update(currentProject.id, { settings: newSettings });
    });
  },

  setTrackChannelMode: async (trackId, mode) => {
    const { trackChannelConfig } = get();
    const newConfig = { ...trackChannelConfig, [trackId]: { mode } };
    set({ trackChannelConfig: newConfig });
    audioEngine.setTrackChannelMode(trackId, mode);

    import("./useLooperStore").then(({ useLooperStore }) => {
      const { currentProject } = useLooperStore.getState();
      if (!currentProject?.id) return;
      const newSettings = {
        ...(currentProject.settings ?? {}),
        trackChannelConfig: newConfig,
      };
      db.projects.update(currentProject.id, { settings: newSettings });
    });
  },
}));
