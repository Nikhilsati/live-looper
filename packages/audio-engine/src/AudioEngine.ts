import type {
  SectionConfig,
  FXState,
  Mode,
  FrozenProjectSnapshot,
  EngineEvent,
  WorkletEvent,
  WorkletMessage,
} from "@live-looper/types";

const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: "default-1",
    index: 0,
    name: "Verse",
    lengthInBars: 4,
    trackLinks: [true, true, true, true],
  },
  {
    id: "default-2",
    index: 1,
    name: "Chorus",
    lengthInBars: 8,
    trackLinks: [true, true, true, true],
  },
  {
    id: "default-3",
    index: 2,
    name: "Bridge",
    lengthInBars: 4,
    trackLinks: [true, true, true, true],
  },
];

const DEFAULT_BPM = 100;

import { TrackFXChain } from "./TrackFXChain";
import { MasterBus } from "./MasterBus";
import { db, projectService } from "@live-looper/storage";
import { FXBuilder } from "@live-looper/types";

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
  private _workletMuteState: boolean[] = [false, false, false, false];
  /** Shadow of the metronome's current on/off state in the worklet. Defaults to true (on). */
  private _metronomeOn: boolean = true;

  // Session Recording & Replay
  private sessionRecorder: MediaRecorder | null = null;
  private sessionAudioChunks: Blob[] = [];
  private sessionAudioResolver: ((blob: Blob) => void) | null = null;
  private sessionPlaybackSource: AudioBufferSourceNode | null = null;

  // Storage Context
  private currentProjectId: string | null = null;
  private trackIdMap: string[] = []; // index 0-3 -> UUID
  private sectionIdMap: string[] = []; // index 0-N -> UUID
  private savedProjectId: string | null = null;
  private smartSnapEnabled: boolean = true;

  private listeners: ((event: EngineEvent) => void)[] = [];
  private static instance: AudioEngine;

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) AudioEngine.instance = new AudioEngine();
    return AudioEngine.instance;
  }

  subscribe(listener: (event: EngineEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(event: EngineEvent) {
    this.listeners.forEach((l) => l(event));
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
          // Support up to 4 separate audio inputs (one per track)
          numberOfInputs: 4,
          numberOfOutputs: 5,
          outputChannelCount: [2, 2, 2, 2, 2],
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

      for (let i = 0; i < 4; i++) {
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

      // Metronome (output 4) routing based on dual output mode
      if (this.dualOutputEnabled) {
        this.workletNode.connect(this.performerBus, 4);
        // Context will be resumed in start()
      } else {
        this.workletNode.connect(this.masterBus.input, 4);
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

      const savedLatency = localStorage.getItem("looper_rtl_samples");
      const latencySamples = savedLatency ? parseInt(savedLatency, 10) : 0;

      this.workletNode.port.postMessage({
        type: "CONFIG",
        payload: {
          sampleRate: this.context.sampleRate,
          bpm,
          sections,
          latencySamples,
          smartSnapEnabled: this.smartSnapEnabled,
        },
      });

      console.log(
        "AudioEngine initialized with Multi-Output FX Chain. Latency Comp:",
        latencySamples,
      );
    } catch (e) {
      console.error("Failed to load AudioWorklet", e);
    }
  }

  /** Re-send CONFIG to the worklet without tearing down the AudioContext. */
  reconfigure(sections: SectionConfig[], bpm: number) {
    if (!this.context || !this.workletNode) return;
    const savedLatency = localStorage.getItem("looper_rtl_samples");
    const latencySamples = savedLatency ? parseInt(savedLatency, 10) : 0;
    this.workletNode.port.postMessage({
      type: "CONFIG",
      payload: {
        sampleRate: this.context.sampleRate,
        bpm,
        sections,
        latencySamples,
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
  private inputSources: (MediaStreamAudioSourceNode | null)[] = [
    null,
    null,
    null,
    null,
  ];

  /**
   * Initialize multiple input devices and connect each to its corresponding worklet input channel.
   * @param deviceIds Array of device IDs, indexed by channel (0-3). If an entry is undefined/null, the default device is used for that channel.
   */
  async initInputs(deviceIds: (string | null | undefined)[] = []) {
    if (!this.context) return;

    // Clean up any existing sources
    for (let i = 0; i < 4; i++) {
      const src = this.inputSources[i];
      if (src) {
        src.disconnect();
        this.inputSources[i] = null;
      }
    }

    // Collect all currently used device IDs to determine what to stop
    const usedDeviceIds = new Set(deviceIds.map((id) => id || "default"));

    // Stop and remove streams that are no longer in use
    this.activeStreams.forEach((stream, deviceId) => {
      if (!usedDeviceIds.has(deviceId)) {
        stream.getTracks().forEach((t) => t.stop());
        this.activeStreams.delete(deviceId);
      }
    });

    for (let i = 0; i < 4; i++) {
      const deviceId = deviceIds[i] || "default";
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
      this.workletNode.disconnect(4); // Disconnect metronome from its current bus
    } catch (e) {
      // Might throw if not connected, safe to ignore
    }

    if (enabled) {
      this.workletNode.connect(this.performerBus, 4);
      if (this.performerContext.state === "suspended")
        this.performerContext.resume();
    } else {
      this.workletNode.connect(this.masterBus.input, 4);
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
    // Retrieve channel mapping from the store (fallback to empty array for defaults)
    const mapping =
      (globalThis as any).looperStore?.getState().channelMapping ?? [];
    this.initInputs(mapping);
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
    localStorage.setItem("looper_rtl_samples", samples.toString());
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
    for (let i = 0; i < 4; i++) {
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

  async loadDemoData() {
    // Always create a fresh "Demo Jam" project so demo loading is
    // idempotent regardless of what project is currently open.
    // This also guarantees trackIdMap / sectionIdMap are populated for
    // the new project before we start saving layers.
    const projectId = await projectService.createProject(
      "Demo Jam",
      DEFAULT_BPM,
    );
    // loadProject sends CONFIG to the worklet with the correct BPM /
    // sections and populates trackIdMap / sectionIdMap.
    await this.loadProject(projectId);

    const ctx = this.context!;

    // Resolve section length from the freshly created project record.
    const { db: storage } = await import("@live-looper/storage");
    const sectionRecord = await storage.sections.get(this.sectionIdMap[0]);
    const project = await storage.projects.get(this.currentProjectId!);
    const bpm = project?.bpm ?? DEFAULT_BPM;
    const lengthInBars = sectionRecord?.lengthInBars ?? 2;
    const exactLen = this.sectionLenSamples(lengthInBars, bpm);

    const samples = [
      "/samples/looperman-l-2148602-0151263-secret-trap-drumloop-100bpm.wav",
      "/samples/looperman-l-6590395-0406745-zaytoven-2.wav",
      "/samples/looperman-l-0498019-0103176-tumbleweed-100-e-acoustic-guitar-mute-rhythm.wav",
      "/samples/looperman-l-0498019-0079454-tumbleweed-100-e-d-a-d-clean-strat-rhythm.wav",
    ];

    const loadAndDecode = async (url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        return audioBuffer.getChannelData(0);
      } catch (e) {
        console.error(`Failed to load sample: ${url}`, e);
        return null;
      }
    };

    // Save all demo layers as WAV blobs — the exact same format that
    // recording uses — so loadProject can reload them identically.
    for (let i = 0; i < samples.length; i++) {
      const raw = await loadAndDecode(samples[i]);
      if (raw && this.currentProjectId) {
        // Trim / zero-pad to exactly one section loop.
        let buffer: Float32Array;
        if (exactLen > 0 && raw.length !== exactLen) {
          buffer = new Float32Array(exactLen);
          buffer.set(raw.subarray(0, Math.min(raw.length, exactLen)));
        } else {
          buffer = raw;
        }

        await projectService.saveLayer({
          projectId: this.currentProjectId!,
          trackId: this.trackIdMap[i % 4],
          sectionId: this.sectionIdMap[0],
          audioData: buffer,
          sampleRate: ctx.sampleRate,
        });
      }
    }

    // Reload the project through the STANDARD path (WAV blob → decodeAudioData
    // → loadBuffer). This is the SAME path used after every real recording
    // session, so there is now ONE unified format for audio in the engine.
    await this.loadProject(this.currentProjectId!);
  }

  private async handleMessage(data: WorkletEvent) {
    if (data.type === "RECORD_STOP" && this.currentProjectId && data.buffer) {
      const trackId = this.trackIdMap[data.trackId];
      const sectionId = this.sectionIdMap[data.sectionIndex];

      if (trackId && sectionId) {
        await projectService.saveLayer({
          projectId: this.currentProjectId,
          trackId,
          sectionId,
          audioData: data.buffer,
          rawAudioData: data.rawBuffer,
          sampleRate: this.context!.sampleRate,
        });
        console.log(
          "Layer saved to IndexedDB" +
            (data.rawBuffer ? " (with raw snap data)" : ""),
        );
      }
    }

    if (data.type === "UNDO_LAYER" && this.currentProjectId) {
      const trackId = this.trackIdMap[data.trackId];
      // The worklet sends the sectionIndex it was recording into.
      // Fall back to sectionIndex 0 if not provided (older worklet builds).
      const sectionIndex = data.sectionIndex ?? 0;
      const sectionId = this.sectionIdMap[sectionIndex];

      if (trackId && sectionId) {
        const removed = await projectService.removeTopLayer({
          projectId: this.currentProjectId,
          trackId,
          sectionId,
        });
        console.log(
          `UNDO_LAYER: DB soft-delete ${removed ? "succeeded" : "nothing to remove"} (track=${data.trackId})`,
        );
      }
    }
  }

  async loadProject(projectId: string) {
    if (!this.context || !this.workletNode) await this.init();

    // Wipe all in-worklet buffers before loading the new project so no
    // audio from the previously-open project bleeds through.
    this.clearAllTracks();

    const project = await db.projects.get(projectId);
    if (!project) return;

    this.currentProjectId = projectId;
    localStorage.setItem("looper_current_project_id", projectId);

    const tracks = await db.tracks.where({ projectId }).sortBy("order");
    this.trackIdMap = tracks.map((t: any) => t.id);

    const rawSections = await db.sections.where({ projectId }).sortBy("order");
    this.sectionIdMap = rawSections.map((s: any) => s.id);

    const savedLatency = localStorage.getItem("looper_rtl_samples");
    const latencySamples = savedLatency ? parseInt(savedLatency, 10) : 0;
    const sampleRate = this.context!.sampleRate;

    // Build SectionConfig[] once — used for BOTH the worklet CONFIG message
    // and the PROJECT_LOADED UI notification so they're always identical.
    const sectionConfigs: SectionConfig[] = rawSections.map((s: any) => {
      let bars: number;
      if (s.lengthInBars != null && s.lengthInBars > 0) {
        // Preferred: stored directly in the DB record.
        bars = s.lengthInBars;
      } else if (s.lengthSamples > 0) {
        // Fallback for old records that predate the lengthInBars field.
        bars = Math.max(
          1,
          Math.round((s.lengthSamples * project.bpm) / (60 * sampleRate * 4)),
        );
      } else {
        bars = 4; // safe default for brand-new sections
      }
      return {
        id: s.id,
        index: s.order,
        name: s.name,
        lengthInBars: bars,
        trackLinks: s.trackLinks ?? [true, true, true, true],
      };
    });

    const projectSmartSnap = project.settings?.smartSnapEnabled ?? true;
    this.smartSnapEnabled = projectSmartSnap;

    // Sync worklet with the resolved section config
    this.workletNode?.port.postMessage({
      type: "CONFIG",
      payload: {
        sampleRate,
        bpm: project.bpm,
        sections: sectionConfigs,
        latencySamples,
        smartSnapEnabled: projectSmartSnap,
        quantization: { snapToGrid: true, gridResolution: 16 }, // We could let store manage this later, hardcoding for now so WSOLA uses 1/16th.
      },
    });

    // Apply FX per track
    tracks.forEach((t: any, i: number) => {
      if (t.fx) {
        // Ensure all legacy properties (e.g. noiseGate) are patched
        const mergedFX = new FXBuilder(t.fx).build();
        this.updateFX(i, mergedFX, project.bpm);
      }
    });

    // Restore persisted mute state — worklet starts all tracks unmuted after
    // clearAllTracks, so we send MUTE_TRACK for any track that was saved as muted.
    this._workletMuteState = [false, false, false, false];
    tracks.forEach((t: any, i: number) => {
      const shouldBeMuted = t.muted ?? false;
      if (shouldBeMuted) {
        this.workletNode?.port.postMessage({
          type: "MUTE_TRACK",
          payload: { trackId: i, muted: true },
        });
        this._workletMuteState[i] = true;
      }
    });

    // Load persisted audio blobs into the engine — skip soft-deleted layers.
    const layers = await db.layers
      .where({ projectId })
      .filter((l) => !l.deletedAt)
      .toArray();
    const layerCounts: Record<number, number> = {};
    // Waveform data computed here (main thread) so PROJECT_LOADED carries
    // everything the UI needs in one atomic update — no async worklet
    // round-trip that can be dropped by the mode-controller gate.
    const waveformDataMap: Record<number, number[]> = {};

    for (const layer of layers) {
      const blobRecord = await db.audioBlobs.get(layer.audioBlobId);
      if (blobRecord && this.context) {
        try {
          const arrayBuffer = await blobRecord.blob.arrayBuffer();
          const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
          const data = audioBuffer.getChannelData(0);

          const trackIdx = this.trackIdMap.indexOf(layer.trackId);
          const sectionIdx = this.sectionIdMap.indexOf(layer.sectionId);

          if (trackIdx !== -1 && sectionIdx !== -1) {
            this.loadBuffer(trackIdx, sectionIdx, data);

            // Only count layers and compute waveform for the initial active section (Section 0) on load!
            if (sectionIdx === 0) {
              layerCounts[trackIdx] = (layerCounts[trackIdx] || 0) + 1;
              // Accumulate waveform RMS per track (last layer wins for now)
              waveformDataMap[trackIdx] = this.computeWaveform(data);
            }
          }
        } catch (e) {
          console.error("Error loading audio blob into engine", e);
        }
      }
    }

    // Default live track state if not present in saved settings
    const loadedLiveTrack = project.settings?.liveTrack;
    const liveTrackState = loadedLiveTrack
      ? {
          ...loadedLiveTrack,
          fx: new FXBuilder(loadedLiveTrack.fx).build(),
        }
      : {
          isMuted: false,
          fx: new FXBuilder().build(),
        };

    // Notify the UI store — pass the same SectionConfig[] the worklet received,
    // plus waveform data so the UI shows previews without a second async cycle.
    this.notify({
      type: "PROJECT_LOADED",
      payload: {
        project,
        tracks,
        sections: sectionConfigs,
        layerCounts,
        waveformDataMap,
        liveTrack: liveTrackState,
      },
    });
  }

  async createNewProject(name: string) {
    if (!this.context) await this.init();
    const projectId = await projectService.createProject(name, DEFAULT_BPM);
    await this.loadProject(projectId);
    return projectId;
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
