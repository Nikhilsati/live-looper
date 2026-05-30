/// <reference path="./oat.d.ts" />
/// <reference path="./audio-worklet.d.ts" />

/**
 * Single source of truth for the number of looper tracks.
 * Changing this constant is the only thing required to scale to more tracks.
 * Every consumer (engine, worklet, store, storage) derives from this value.
 */
export const TRACK_COUNT = 4;

export interface SectionConfig {
  id: string;
  index: number;
  name: string;
  lengthInBars: number;
  trackLinks: boolean[]; // length TRACK_COUNT — which tracks play in this section
}

export interface EQSettings {
  low: number;
  mid: number;
  midFreq: number;
  high: number;
}

export interface CompressorSettings {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
  gain: number;
}

export interface DriveSettings {
  amount: number;
  tone: number; // 0–1: 0 = dark/rolled-off, 1 = full bright
  enabled: boolean;
}

export interface DelaySettings {
  time: number; // in beats
  feedback: number;
  mix: number;
  mode: "mono" | "pingpong";
  filter: number; // 0–1: brightness of feedback path (0 = dark/muffled, 1 = bright/open)
  enabled: boolean;
}

export interface ReverbSettings {
  mix: number;
  size: number; // impulse duration in seconds (0.1–5)
  predelay: number; // pre-delay in ms (0–100)
  damping: number; // 0 = dark, 1 = bright (maps to lowpass cutoff)
  enabled: boolean;
}

export interface NoiseGateSettings {
  threshold: number;
  attack: number;
  release: number;
  enabled: boolean;
}

export interface ChorusSettings {
  rate: number; // LFO rate in Hz (0.1–5)
  depth: number; // LFO depth 0–1 (maps to delay time variation)
  mix: number; // wet/dry blend 0–1
  voices: 1 | 2; // 1 = classic chorus, 2 = stereo doubler
  enabled: boolean;
}

export interface PhaserSettings {
  rate: number; // LFO rate in Hz (0.1–5)
  depth: number; // sweep depth 0–1
  feedback: number; // resonance/intensity 0–0.9
  stages: 2 | 4; // number of allpass stages
  enabled: boolean;
}

export interface TremoloSettings {
  rate: number; // LFO rate in Hz (0.1-20), or beat fraction (0.25, 0.5, 1, etc.) when sync=true
  depth: number; // modulation depth 0-1
  sync: boolean; // sync rate to bpm
  enabled: boolean;
}

export interface FXState {
  [effectId: string]: any;
}

export interface Track {
  isMuted: boolean;
  fx: FXState;
}

export interface TrackState extends Track {
  isSoloed: boolean;
  isRecording: boolean;
  isArmed: boolean; // pending recording at next section boundary
  hasAudio: boolean; // has audio in current section
  layerCount: number;
  waveformData: number[];
}

export interface LiveTrackState extends Track {}

export type Mode = "planning" | "practice" | "live";

export interface QuantizationSettings {
  snapToGrid: boolean;
  gridResolution: number;
}

export interface FrozenProjectSnapshot {
  sections: SectionConfig[];
  tracks: TrackState[];
  liveTrack: LiveTrackState;
  bpm: number;
  quantization: QuantizationSettings;
}

export interface EngineState {
  isPlaying: boolean;
  bpm: number;
  currentBar: number;
  currentBeat: number;
  sectionProgress: number; // 0–1 within current section loop
  currentSectionIndex: number;
  queuedSectionIndex: number | null;
  sections: SectionConfig[];
  tracks: TrackState[];
  liveTrack: LiveTrackState;
  mode: Mode;
  // Performance & Latency Suite
  latencyMeasuredSamples: number;
  latencyCompensationSamples: number;
  isCalibratingLatency: boolean;
  jitter: number;
  lastHitOffset: number; // ms offset from quantization boundary
  channelMapping: (string | null)[];
  trackChannelConfig: { [trackId: number]: { mode: "mono" | "stereo" } };
  inputLevels: number[];
}

// Storage Interfaces
export interface ProjectRecord {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  bpm: number;
  timeSignature: string;
  masterLengthSamples: number;
  schemaVersion: number;
  appVersion: string;
  settings?: {
    metronomeOn?: boolean;
    showLayers?: boolean;
    smartSnapEnabled?: boolean;
    liveTrack?: LiveTrackState;
    channelMapping?: (string | null)[];
    trackChannelConfig?: { [trackId: number]: { mode: "mono" | "stereo" } };
  };
}

export type SessionEventType =
  | "PLAY"
  | "STOP"
  | "ARM_TRACK"
  | "MUTE_TRACK"
  | "SOLO_TRACK"
  | "SECTION_CHANGE"
  | "SET_BPM"
  | "SET_TRACK_FX"
  | "SET_LIVE_TRACK_FX"
  | "MUTE_LIVE_TRACK"
  | "CLEAR_TRACK";

export interface SessionEvent {
  timestampMs: number; // Offset from start of session
  type: SessionEventType;
  payload?: any;
}

export interface SessionRecord {
  id: string;
  projectId: string;
  name: string;
  createdAt: number;
  durationMs: number;
  events: SessionEvent[];
  liveAudioBlobId?: string; // Reference to the raw mic audio recorded linearly
  projectSnapshot: FrozenProjectSnapshot;
}

export interface TrackRecord {
  id: string;
  projectId: string;
  name: string;
  order: number;
  color: string;
  muted: boolean;
  solo: boolean;
  fx?: FXState;
}

export interface SectionRecord {
  id: string;
  projectId: string;
  name: string;
  order: number;
  lengthSamples: number;
  lengthInBars?: number; // Preferred source of truth; lengthSamples is a fallback
  trackLinks?: boolean[]; // length 4 — which tracks play in this section
}

export interface LayerRecord {
  id: string;
  projectId: string;
  trackId: string;
  sectionId: string;
  audioBlobId: string;
  rawAudioBlobId?: string;
  gain: number;
  order: number;
  /** Timestamp (ms) when this layer was soft-deleted (undo). Null/undefined = active. */
  deletedAt?: number | null;
}

export interface AudioBlobRecord {
  id: string;
  projectId: string;
  blob: Blob; // WAV
  sampleRate: number;
  channels: number;
  lengthSamples: number;
}

export interface FXPreset {
  id: string;
  name: string;
  type: "chain" | "module";
  moduleType?: keyof FXState | "pan"; // If type is 'module'
  fxState: Partial<FXState>;
  createdAt: number;
  updatedAt: number;
}

export type ConfigPayload = {
  sampleRate: number;
  bpm: number;
  sections: SectionConfig[];
  latencySamples: number;
  smartSnapEnabled?: boolean;
  quantization?: QuantizationSettings;
};

export type WorkletMessage =
  | { type: "CONFIG"; payload: ConfigPayload }
  | { type: "START" }
  | { type: "STOP" }
  | { type: "RTL_TEST" }
  | { type: "SET_LATENCY"; payload: Pick<ConfigPayload, "latencySamples"> }
  | { type: "ARM_TRACK"; payload: { trackId: number } }
  | { type: "MUTE_TRACK"; payload: { trackId: number } }
  | { type: "MUTE_METRONOME" }
  | { type: "UNDO_LAYER"; payload: { trackId: number } }
  | { type: "CLEAR_TRACK"; payload: { trackId: number } }
  | { type: "CLEAR_ALL_TRACKS" }
  | { type: "QUEUE_SECTION"; payload: { sectionIndex: number } }
  | { type: "SET_BPM"; payload: Pick<ConfigPayload, "bpm"> }
  | {
      type: "SET_BUFFER";
      payload: { trackId: number; sectionIndex: number; buffer: Float32Array };
    }
  | { type: "SET_MODE"; payload: { mode: Mode } }
  | { type: "ENTER_LIVE_MODE"; payload: { snapshot: FrozenProjectSnapshot } }
  | { type: "SET_SMART_SNAP"; payload: { enabled: boolean } }
  | {
      type: "CONFIG_CHANNELS";
      payload: { trackConfigs: { trackId: number; mode: "mono" | "stereo" }[] };
    };

export type WorkletEvent =
  | ({ type: "TICK" } & Pick<
      EngineState,
      | "currentBar"
      | "currentBeat"
      | "sectionProgress"
      | "jitter"
      | "inputLevels"
    > & { sectionIndex: number })
  | {
      type: "RECORD_START";
      trackId: number;
      sectionIndex: number;
    }
  | {
      type: "RECORD_STOP";
      trackId: number;
      sectionIndex: number;
      buffer: Float32Array;
      rawBuffer?: Float32Array;
      waveformData: number[];
      layerCount: number;
    }
  | { type: "TRACK_CLEARED"; trackId: number }
  | {
      type: "SECTION_CHANGE";
      sectionIndex: number;
      trackStates?: { id: number; state: string }[];
    }
  | { type: "RTL_MEASURED"; samples: number }
  | { type: "RTL_TIMEOUT" }
  | { type: "UNDO_LAYER"; trackId: number; sectionIndex?: number };

export type EngineEvent =
  | WorkletEvent
  | { type: "ENGINE_CRASHED" }
  | {
      type: "PROJECT_LOADED";
      payload: {
        project: ProjectRecord;
        tracks: TrackRecord[];
        sections: SectionConfig[];
        layerCounts: Record<number, number>;
        waveformDataMap: Record<number, number[]>;
        liveTrack: LiveTrackState;
      };
    };

// FXBuilder moved to @live-looper/audio-engine

export interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean;
}
