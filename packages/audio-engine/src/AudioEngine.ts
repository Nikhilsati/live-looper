import type {
  SectionConfig,
  FXState,
  Mode,
  FrozenProjectSnapshot,
  EngineEvent,
  WorkletEvent,
  WorkletMessage,
} from "@live-looper/types";
import { TRACK_COUNT } from "@live-looper/types";

const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: "default-1",
    index: 0,
    name: "Verse",
    lengthInBars: 4,
    trackLinks: Array(TRACK_COUNT).fill(true),
  },
  {
    id: "default-2",
    index: 1,
    name: "Chorus",
    lengthInBars: 8,
    trackLinks: Array(TRACK_COUNT).fill(true),
  },
  {
    id: "default-3",
    index: 2,
    name: "Bridge",
    lengthInBars: 4,
    trackLinks: Array(TRACK_COUNT).fill(true),
  },
];

const DEFAULT_BPM = 100;

import { TrackFXChain } from "./TrackFXChain";
import { MasterClock } from "./MasterClock";
import { engineEvents } from "./EventBus";
import { MasterBus } from "./MasterBus";
import { FXBuilder } from "./FXBuilder";

class AudioEngine {
  context: AudioContext | null = null;
  workletNode: AudioWorkletNode | null = null;
  trackFX: TrackFXChain[] = [];
  liveTrackFX: TrackFXChain | null = null;
  masterBus: MasterBus | null = null;
  performerBus: GainNode | null = null;
  performerDestination: MediaStreamAudioDestinationNode | null = null;
  performerContext: AudioContext | null = null;
  performerSource: MediaStreamAudioSourceNode | null = null;
  private dualOutputEnabled: boolean = false;

  private activeStreams: Map<string, MediaStream> = new Map();

  /** Shadow of each track's current mute state inside the worklet. Used by applySolo/setMute
   *  to determine whether a MUTE_TRACK toggle is actually needed. */
  private _workletMuteState: boolean[] = Array(TRACK_COUNT).fill(false);
  /** Shadow of the metronome's current on/off state in the worklet. Defaults to true (on). */
  private _metronomeOn: boolean = true;

  // Session Recording & Replay
  private sessionRecorder: MediaRecorder | null = null;
  private sessionAudioChunks: Blob[] = [];
  private sessionAudioResolver: ((blob: Blob) => void) | null = null;
  private sessionPlaybackSource: AudioBufferSourceNode | null = null;

  // Storage Context
  public currentProjectId: string | null = null;
  public latencySamples: number = 0;
  public channelMapping: (string | null | undefined)[] = [];
  private trackIdMap: string[] = []; // index 0-3 -> UUID
  private sectionIdMap: string[] = []; // index 0-N -> UUID
  private savedProjectId: string | null = null;
  private smartSnapEnabled: boolean = true;
  private _masterOutLevel: number = 0;

  private static instance: AudioEngine;

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) AudioEngine.instance = new AudioEngine();
    return AudioEngine.instance;
  }

  subscribe(listener: (event: EngineEvent) => void) {
    engineEvents.on("engine_event", listener);
    return () => {
      engineEvents.off("engine_event", listener);
    };
  }

  private notify(event: EngineEvent) {
    // Fire the specific event for targeted listeners
    engineEvents.emit(event.type, "payload" in event ? event.payload : undefined);
    // Fire the catch-all for legacy subscribers
    engineEvents.emit("engine_event", event);
  }

  async init(
    sections: SectionConfig[] = DEFAULT_SECTIONS,
    bpm: number = DEFAULT_BPM,
  ) {
    if (this.context) {
      // Already initialised — just re-send CONFIG with the provided sections/bpm
      // so the worklet is always in sync before playback starts.
      this.reconfigure(sections, bpm);
      return;
    }

    this.context = new AudioContext();

    // @ts-ignore
    const processorUrl = new URL("./worklets/processor.ts", import.meta.url)
      .href;
    // @ts-ignore
    const gateUrl = new URL(
      "./worklets/noise-gate-processor.ts",
      import.meta.url,
    ).href;

    const bustedUrl = processorUrl + "?t=" + Date.now();
    const bustedGateUrl = gateUrl + "?t=" + Date.now();

    try {
      await this.context.audioWorklet.addModule(bustedUrl);
      await this.context.audioWorklet.addModule(bustedGateUrl);

      this.workletNode = new AudioWorkletNode(
        this.context,
        "live-looper-processor",
        {
          // Support up to TRACK_COUNT separate audio inputs (one per track)
          numberOfInputs: TRACK_COUNT,
          numberOfOutputs: TRACK_COUNT + 1, // TRACK_COUNT tracks + 1 metronome
          outputChannelCount: Array(TRACK_COUNT + 1).fill(2),
        },
      );

      this.masterBus = new MasterBus(this.context);

      this.performerDestination = this.context.createMediaStreamDestination();
      this.performerBus = this.context.createGain();
      this.performerBus.connect(this.performerDestination);

      // Create secondary audio context for zero-latency performer loopback
      this.performerContext = new AudioContext({
        latencyHint: "interactive",
        sampleRate: this.context.sampleRate,
      });
      this.performerSource = this.performerContext.createMediaStreamSource(
        this.performerDestination.stream,
      );
      this.performerSource.connect(this.performerContext.destination);

      for (let i = 0; i < TRACK_COUNT; i++) {
        const chain = new TrackFXChain(this.context);
        this.trackFX.push(chain);

        // Audience Mix (with FX)
        this.workletNode.connect(chain.input, i);
        chain.output.connect(this.masterBus.input);

        // Performer Mix (raw track audio - bypass MasterBus for zero latency)
        this.workletNode.connect(this.performerBus, i);
      }

      // Live Track FX Chain
      this.liveTrackFX = new TrackFXChain(this.context);
      // Connect Live Track directly to Master, and also into Performer Bus
      this.liveTrackFX.output.connect(this.masterBus.input);
      this.liveTrackFX.output.connect(this.performerBus);

      // Metronome (output TRACK_COUNT) routing based on dual output mode
      if (this.dualOutputEnabled) {
        this.workletNode.connect(this.performerBus, TRACK_COUNT);
        // Context will be resumed in start()
      } else {
        this.workletNode.connect(this.masterBus.input, TRACK_COUNT);
        this.performerContext.suspend();
      }

      this.workletNode.port.onmessage = (event) => {
        const data = event.data as WorkletEvent;
        this.handleMessage(data);
        this.notify(data);
      };

      this.workletNode.onprocessorerror = (e) => {
        console.error("AudioWorklet Processor Crashed:", e);
        this.notify({ type: "ENGINE_CRASHED" });
      };

      this.workletNode.port.postMessage({
        type: "CONFIG",
        payload: {
          sampleRate: this.context.sampleRate,
          bpm,
          sections,
          latencySamples: this.latencySamples,
          smartSnapEnabled: this.smartSnapEnabled,
        },
      });

      console.log(
        "AudioEngine initialized with Multi-Output FX Chain.",
      );
    } catch (e) {
      console.error("Failed to load AudioWorklet", e);
    }
  }

  /** Re-send CONFIG to the worklet without tearing down the AudioContext. */
  reconfigure(sections: SectionConfig[], bpm: number) {
    if (!this.context || !this.workletNode) return;
    this.workletNode.port.postMessage({
      type: "CONFIG",
      payload: {
        sampleRate: this.context.sampleRate,
        bpm,
        sections,
        latencySamples: this.latencySamples,
        smartSnapEnabled: this.smartSnapEnabled,
        quantization: { snapToGrid: false, gridResolution: 16 }, // Initial fallback
      },
    });
  }

  /** Returns the exact sample count for one loop of section at the current sample rate + bpm. */
  private sectionLenSamples(lengthInBars: number, bpm: number): number {
    if (!this.context) return 0;
    const samplesPerBeat = (this.context.sampleRate * 60) / bpm;
    return Math.floor(samplesPerBeat * 4 * lengthInBars);
  }

  /** Mirrors the worklet's computeWaveformData — RMS per block, 120 points. */
  public computeWaveform(buffer: Float32Array, numPoints = 120): number[] {
    const step = Math.floor(buffer.length / numPoints);
    if (step <= 0) return Array(numPoints).fill(0);
    const out: number[] = [];
    for (let p = 0; p < numPoints; p++) {
      const start = p * step;
      let sum = 0;
      for (let s = start; s < start + step; s++) sum += buffer[s] * buffer[s];
      out.push(Math.sqrt(sum / step));
    }
    return out;
  }

  // Array to hold per-channel MediaStreamAudioSourceNodes
  private inputSources: (MediaStreamAudioSourceNode | null)[] = Array(
    TRACK_COUNT,
  ).fill(null);

  /**
   * Initialize multiple input devices and connect each to its corresponding worklet input channel.
   * @param deviceIds Array of device IDs, indexed by channel (0-3). If an entry is undefined/null, the default device is used for that channel.
   */
  async initInputs(deviceIds?: (string | null | undefined)[]) {
    if (!this.context) return;
    if (deviceIds) {
      this.channelMapping = deviceIds;
    }

    // Clean up any existing sources
    for (let i = 0; i < TRACK_COUNT; i++) {
      const src = this.inputSources[i];
      if (src) {
        src.disconnect();
        this.inputSources[i] = null;
      }
    }

    // Collect all currently used device IDs to determine what to stop
    const usedDeviceIds = new Set(this.channelMapping.map((id) => id || "default"));

    // Stop and remove streams that are no longer in use
    this.activeStreams.forEach((stream, deviceId) => {
      if (!usedDeviceIds.has(deviceId)) {
        stream.getTracks().forEach((t) => t.stop());
        this.activeStreams.delete(deviceId);
      }
    });

    for (let i = 0; i < TRACK_COUNT; i++) {
      const deviceId = this.channelMapping[i] || "default";
      try {
        let stream: MediaStream;

        if (this.activeStreams.has(deviceId)) {
          stream = this.activeStreams.get(deviceId)!;
        } else {
          const constraints: MediaStreamConstraints = {
            audio: {
              echoCancellation: false,
              autoGainControl: false,
              noiseSuppression: false,
              ...(deviceId !== "default"
                ? { deviceId: { exact: deviceId } }
                : {}),
            },
          };
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          this.activeStreams.set(deviceId, stream);
        }

        const source = this.context.createMediaStreamSource(stream);
        this.inputSources[i] = source;
        // Connect this source to the worklet's input channel i
        if (this.workletNode) {
          source.connect(this.workletNode, 0, i);
        }
        // Also route raw input to performer bus for zero‑latency monitoring
        source.connect(this.performerBus!);
      } catch (e) {
        console.error(`Failed to acquire input for channel ${i}`, e);
      }
    }
  }

  // Deprecated single-device initializer – retained for backward compatibility.
  async setInputDevice(deviceId: string) {
    // Re-initialize only the first channel with the supplied device ID.
    await this.initInputs([deviceId]);
  }

  /**
   * Route the AudioContext output to a specific speaker/headphone device.
   * Requires Chrome 110+ (AudioContext.setSinkId). Fails silently on other browsers.
   */
  async setOutputDevice(deviceId: string) {
    if (!this.context) return;
    try {
      // setSinkId is a newer API — not in all TS lib definitions yet
      await (this.context as any).setSinkId(deviceId);
      console.log("Output device set to", deviceId);
    } catch (e: any) {
      if (e?.name === "NotSupportedError") {
        console.warn("setSinkId not supported in this browser.");
      } else {
        console.error("Failed to set output device", e);
      }
    }
  }

  /** Route the performer audio element to a specific device. */
  async setPerformerOutputDevice(deviceId: string) {
    if (!this.performerContext) return;
    try {
      await (this.performerContext as any).setSinkId(deviceId);
      console.log("Performer output device set to", deviceId);
    } catch (e: any) {
      if (e?.name === "NotSupportedError") {
        console.warn("setSinkId not supported in this browser.");
      } else {
        console.error("Failed to set performer output device", e);
      }
    }
  }

  setDualOutputMode(enabled: boolean) {
    this.dualOutputEnabled = enabled;
    if (
      !this.context ||
      !this.workletNode ||
      !this.masterBus ||
      !this.performerBus ||
      !this.performerContext
    )
      return;

    try {
      this.workletNode.disconnect(TRACK_COUNT); // Disconnect metronome from its current bus
    } catch (e) {
      // Might throw if not connected, safe to ignore
    }

    if (enabled) {
      this.workletNode.connect(this.performerBus, TRACK_COUNT);
      if (this.performerContext.state === "suspended")
        this.performerContext.resume();
    } else {
      this.workletNode.connect(this.masterBus.input, TRACK_COUNT);
      this.performerContext.suspend();
    }
  }

  /** List available audio input and output devices. */
  async enumerateDevices(): Promise<{
    inputs: MediaDeviceInfo[];
    outputs: MediaDeviceInfo[];
  }> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      inputs: devices.filter((d) => d.kind === "audioinput"),
      outputs: devices.filter((d) => d.kind === "audiooutput"),
    };
  }

  start() {
    if (this.context?.state === "suspended") this.context.resume();
    if (this.dualOutputEnabled && this.performerContext?.state === "suspended")
      this.performerContext.resume();
    this.initInputs();
    this.workletNode?.port.postMessage({ type: "START" });
  }

  stop() {
    this.workletNode?.port.postMessage({ type: "STOP" });
  }

  runRTLTest() {
    if (!this.workletNode) return;
    this.workletNode.port.postMessage({ type: "RTL_TEST" });
  }

  setLatencyCompensation(samples: number) {
    this.latencySamples = samples;
    this.workletNode?.port.postMessage({
      type: "SET_LATENCY",
      payload: { latencySamples: samples },
    });
  }

  armTrack(trackId: number) {
    this.workletNode?.port.postMessage({
      type: "ARM_TRACK",
      payload: { trackId },
    });
  }

  toggleMute(trackId: number) {
    this.workletNode?.port.postMessage({
      type: "MUTE_TRACK",
      payload: { trackId },
    });
  }

  /**
   * Apply solo isolation across all 4 tracks.
   *
   * @param soloedIds    Track indices currently soloed. Empty array = no solo active.
   * @param muteStates   Each track's individual isMuted flag, restored when solo clears.
   *
   * effectiveMuted:
   *   - soloedIds non-empty → track is muted unless its index is in soloedIds
   *   - soloedIds empty     → track is muted only if its own isMuted flag is true
   */
  applySolo(soloedIds: number[], muteStates: boolean[]) {
    const hasSolo = soloedIds.length > 0;
    for (let i = 0; i < TRACK_COUNT; i++) {
      const effectiveMuted = hasSolo
        ? !soloedIds.includes(i) // solo active: mute unless in solo set
        : (muteStates[i] ?? false); // no solo: restore individual mute

      const current = this._workletMuteState[i] ?? false;
      if (effectiveMuted !== current) {
        this.workletNode?.port.postMessage({
          type: "MUTE_TRACK",
          payload: { trackId: i, muted: effectiveMuted },
        });
        this._workletMuteState[i] = effectiveMuted;
      }
    }
  }

  /** Sync a single track's mute state so _workletMuteState stays accurate. */
  setMute(trackId: number, muted: boolean) {
    const current = this._workletMuteState[trackId] ?? false;
    if (muted !== current) {
      this.workletNode?.port.postMessage({
        type: "MUTE_TRACK",
        payload: { trackId, muted },
      });
      this._workletMuteState[trackId] = muted;
    }
  }

  setMetronome(on: boolean) {
    if (this._metronomeOn === on) return;
    this._metronomeOn = on;
    this.workletNode?.port.postMessage({ type: "MUTE_METRONOME" });
  }

  toggleMetronome() {
    this._metronomeOn = !this._metronomeOn;
    this.workletNode?.port.postMessage({ type: "MUTE_METRONOME" });
  }

  undoLayer(trackId: number) {
    this.workletNode?.port.postMessage({
      type: "UNDO_LAYER",
      payload: { trackId },
    });
  }

  clearTrack(trackId: number) {
    this.workletNode?.port.postMessage({
      type: "CLEAR_TRACK",
      payload: { trackId },
    });
  }

  /** Clears ALL track buffers in the worklet — call before loading a new project. */
  clearAllTracks() {
    this.workletNode?.port.postMessage({ type: "CLEAR_ALL_TRACKS" });
  }

  queueSection(sectionIndex: number) {
    this.workletNode?.port.postMessage({
      type: "QUEUE_SECTION",
      payload: { sectionIndex },
    });
  }

  updateFX(trackId: number, fxState: FXState, bpm: number) {
    if (this.trackFX[trackId]) {
      this.trackFX[trackId].update(fxState, bpm);
    }
  }

  updateLiveTrackFX(fxState: FXState, bpm: number) {
    if (this.liveTrackFX) {
      this.liveTrackFX.update(fxState, bpm);
    }
  }

  setLiveTrackMute(muted: boolean) {
    if (this.liveTrackFX) {
      // Disconnect if muted, connect if unmuted.
      // But an easier way is to just control the gain of the output node.
      this.liveTrackFX.output.gain.setTargetAtTime(
        muted ? 0 : 1,
        this.context!.currentTime,
        0.05,
      );
    }
  }

  setSmartSnapEnabled(enabled: boolean) {
    this.smartSnapEnabled = enabled;
    this.workletNode?.port.postMessage({
      type: "SET_SMART_SNAP",
      payload: { enabled },
    });
  }

  setTrackChannelMode(trackId: number, mode: "mono" | "stereo") {
    this.workletNode?.port.postMessage({
      type: "CONFIG_CHANNELS",
      payload: { trackConfigs: [{ trackId, mode }] },
    });
  }

  setBpm(bpm: number) {
    this.workletNode?.port.postMessage({ type: "SET_BPM", payload: { bpm } });
  }

  loadBuffer(trackId: number, sectionIndex: number, buffer: Float32Array) {
    this.workletNode?.port.postMessage({
      type: "SET_BUFFER",
      payload: { trackId, sectionIndex, buffer },
    });
  }

  setMode(mode: Mode) {
    this.workletNode?.port.postMessage({ type: "SET_MODE", payload: { mode } });
  }

  enterLiveMode(snapshot: FrozenProjectSnapshot) {
    // Enforce snapshot settings on the engine
    this.setBpm(snapshot.bpm);

    // Update FX chains with snapshot values
    snapshot.tracks.forEach((track, i) => {
      this.updateFX(i, track.fx, snapshot.bpm);
    });

    this.updateLiveTrackFX(snapshot.liveTrack.fx, snapshot.bpm);
    this.setLiveTrackMute(snapshot.liveTrack.isMuted);

    // Pre-allocate or lock structures in worklet
    this.workletNode?.port.postMessage({
      type: "ENTER_LIVE_MODE",
      payload: { snapshot },
    });
  }

  // loadDemoData and loadProject have been moved to StorageController/ProjectLoader to decouple DB from Audio Engine

  private async handleMessage(data: WorkletEvent) {
    // DB writing logic (RECORD_STOP, UNDO_LAYER) is now handled by StorageController
    // which listens to these events via engineEvents.on(...)
  }

  // --- Session Recording & Replay Methods ---

  startLiveRecording() {
    if (!this.performerDestination) {
      console.warn("No performer destination to record for session.");
      return;
    }

    this.sessionAudioChunks = [];
    // Use standard WebM Opus for efficiency, we can convert or just store it as blob
    const options = { mimeType: "audio/webm;codecs=opus" };

    try {
      this.sessionRecorder = new MediaRecorder(
        this.performerDestination.stream,
        options,
      );
    } catch (e) {
      // Fallback if codec not supported
      this.sessionRecorder = new MediaRecorder(
        this.performerDestination.stream,
      );
    }

    this.sessionRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.sessionAudioChunks.push(e.data);
      }
    };

    this.sessionRecorder.start();
    console.log("Session live recording started");
  }

  stopLiveRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.sessionRecorder || this.sessionRecorder.state === "inactive") {
        resolve(null);
        return;
      }

      this.sessionAudioResolver = resolve;

      this.sessionRecorder.onstop = () => {
        const blob = new Blob(this.sessionAudioChunks, {
          type: "audio/webm;codecs=opus",
        });
        this.sessionAudioChunks = [];
        if (this.sessionAudioResolver) {
          this.sessionAudioResolver(blob);
          this.sessionAudioResolver = null;
        }
      };

      this.sessionRecorder.stop();
    });
  }

  async playLiveAudio(blob: Blob) {
    if (!this.context) return;

    this.stopLiveAudio(); // Stop any existing playback

    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      this.sessionPlaybackSource = this.context.createBufferSource();
      this.sessionPlaybackSource.buffer = audioBuffer;

      // Connect to liveTrackFX input so it goes through the live track FX chain during replay
      if (this.liveTrackFX) {
        this.sessionPlaybackSource.connect(this.liveTrackFX.input);
      } else {
        this.sessionPlaybackSource.connect(this.context.destination);
      }

      this.sessionPlaybackSource.start(0);
    } catch (e) {
      console.error("Failed to decode and play session live audio", e);
    }
  }

  stopLiveAudio() {
    if (this.sessionPlaybackSource) {
      try {
        this.sessionPlaybackSource.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      this.sessionPlaybackSource.disconnect();
      this.sessionPlaybackSource = null;
    }
  }

  getLatencyMetrics() {
    if (!this.context) return null;
    return {
      baseLatency: this.context.baseLatency,
      outputLatency: this.context.outputLatency,
      sampleRate: this.context.sampleRate,
      state: this.context.state,
    };
  }
}

export const audioEngine = AudioEngine.getInstance();
export { DEFAULT_SECTIONS, DEFAULT_BPM };
