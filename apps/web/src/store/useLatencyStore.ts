/**
 * useLatencyStore — latency measurement, compensation, and calibration.
 *
 * Owns: latencyMeasuredSamples, latencyCompensationSamples,
 *       isCalibratingLatency, jitter, lastHitOffset.
 */
import { create } from "zustand";
import { audioEngine } from "@live-looper/audio-engine";

export interface LatencyState {
  latencyMeasuredSamples: number;
  latencyCompensationSamples: number;
  isCalibratingLatency: boolean;
  jitter: number;
  lastHitOffset: number;

  // Actions
  calibrateLatency: () => void;
  setCompensation: (samples: number) => void;
  setLastHitOffset: (ms: number) => void;
  setLatencyMeasured: (samples: number) => void;
  setCalibrating: (v: boolean) => void;
  setJitter: (jitter: number) => void;
}

export const useLatencyStore = create<LatencyState>((set, get) => ({
  latencyMeasuredSamples: 0,
  latencyCompensationSamples: 0,
  isCalibratingLatency: false,
  jitter: 0,
  lastHitOffset: 0,

  calibrateLatency: () => {
    import("./useLooperStore").then(({ useLooperStore }) => {
      if (useLooperStore.getState().mode === "live") return;
    });
    set({ isCalibratingLatency: true });
    audioEngine.runRTLTest();
  },

  setCompensation: (samples) => {
    set({ latencyCompensationSamples: samples });
    audioEngine.setLatencyCompensation(samples);
  },

  setLastHitOffset: (ms) => set({ lastHitOffset: ms }),
  setLatencyMeasured: (samples) => set({ latencyMeasuredSamples: samples }),
  setCalibrating: (v) => set({ isCalibratingLatency: v }),
  setJitter: (jitter) => set({ jitter }),
}));

// Restore persisted compensation on startup
const savedComp = localStorage.getItem("looper_rtl_samples");
if (savedComp) {
  useLatencyStore.getState().setCompensation(parseInt(savedComp, 10));
}
