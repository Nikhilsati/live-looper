import type { SectionConfig, FXState, Mode, FrozenProjectSnapshot, EngineEvent, WorkletEvent, WorkletMessage } from '@live-looper/types';

const DEFAULT_SECTIONS: SectionConfig[] = [
    { index: 0, name: 'Verse', lengthInBars: 4, trackLinks: [true, true, true, true] },
    { index: 1, name: 'Chorus', lengthInBars: 8, trackLinks: [true, true, true, true] },
    { index: 2, name: 'Bridge', lengthInBars: 4, trackLinks: [true, true, true, true] },
];

const DEFAULT_BPM = 100;

import { TrackFXChain } from './TrackFXChain';
import { MasterBus } from './MasterBus';
import { db, projectService } from '@live-looper/storage';

class AudioEngine {
    context: AudioContext | null = null;
    workletNode: AudioWorkletNode | null = null;
    trackFX: TrackFXChain[] = [];
    masterBus: MasterBus | null = null;

    private currentStream: MediaStream | null = null;
    private currentInputNode: MediaStreamAudioSourceNode | null = null;

    /** Shadow of each track's current mute state inside the worklet. Used by applySolo/setMute
     *  to determine whether a MUTE_TRACK toggle is actually needed. */
    private _workletMuteState: boolean[] = [false, false, false, false];
    /** Shadow of the metronome's current on/off state in the worklet. Defaults to true (on). */
    private _metronomeOn: boolean = true;

    // Storage Context
    private currentProjectId: string | null = null;
    private trackIdMap: string[] = []; // index 0-3 -> UUID
    private sectionIdMap: string[] = []; // index 0-N -> UUID
    private savedProjectId: string | null = null;

    private listeners: ((event: EngineEvent) => void)[] = [];
    private static instance: AudioEngine;

    private constructor() { }

    static getInstance(): AudioEngine {
        if (!AudioEngine.instance) AudioEngine.instance = new AudioEngine();
        return AudioEngine.instance;
    }

    subscribe(listener: (event: EngineEvent) => void) {
        this.listeners.push(listener);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    private notify(event: EngineEvent) {
        this.listeners.forEach(l => l(event));
    }

    async init(sections: SectionConfig[] = DEFAULT_SECTIONS, bpm: number = DEFAULT_BPM) {
        if (this.context) {
            // Already initialised — just re-send CONFIG with the provided sections/bpm
            // so the worklet is always in sync before playback starts.
            this.reconfigure(sections, bpm);
            return;
        }

        this.context = new AudioContext();

        // @ts-ignore
        const processorUrl = new URL('./worklets/processor.ts', import.meta.url).href;

        try {
            await this.context.audioWorklet.addModule(processorUrl);
            this.workletNode = new AudioWorkletNode(this.context, 'live-looper-processor', {
                numberOfInputs: 1,
                numberOfOutputs: 5,
                outputChannelCount: [2, 2, 2, 2, 2]
            });

            this.masterBus = new MasterBus(this.context);

            for (let i = 0; i < 4; i++) {
                const chain = new TrackFXChain(this.context);
                this.trackFX.push(chain);
                this.workletNode.connect(chain.input, i);
                chain.output.connect(this.masterBus.input);
            }

            // Metronome (output 4) directly to master bus for now
            this.workletNode.connect(this.masterBus.input, 4);

            this.workletNode.port.onmessage = (event) => {
                const data = event.data as WorkletEvent;
                this.handleMessage(data);
                this.notify(data);
            };

            const savedLatency = localStorage.getItem('looper_rtl_samples');
            const latencySamples = savedLatency ? parseInt(savedLatency, 10) : 0;

            this.workletNode.port.postMessage({
                type: 'CONFIG',
                payload: {
                    sampleRate: this.context.sampleRate,
                    bpm,
                    sections,
                    latencySamples
                },
            });

            console.log('AudioEngine initialized with Multi-Output FX Chain. Latency Comp:', latencySamples);
        } catch (e) {
            console.error('Failed to load AudioWorklet', e);
        }
    }

    /** Re-send CONFIG to the worklet without tearing down the AudioContext. */
    reconfigure(sections: SectionConfig[], bpm: number) {
        if (!this.context || !this.workletNode) return;
        const savedLatency = localStorage.getItem('looper_rtl_samples');
        const latencySamples = savedLatency ? parseInt(savedLatency, 10) : 0;
        this.workletNode.port.postMessage({
            type: 'CONFIG',
            payload: { sampleRate: this.context.sampleRate, bpm, sections, latencySamples }
        });
    }

    /** Returns the exact sample count for one loop of section at the current sample rate + bpm. */
    private sectionLenSamples(lengthInBars: number, bpm: number): number {
        if (!this.context) return 0;
        const samplesPerBeat = (this.context.sampleRate * 60) / bpm;
        return Math.floor(samplesPerBeat * 4 * lengthInBars);
    }

    /** Mirrors the worklet's computeWaveformData — RMS per block, 120 points. */
    private computeWaveform(buffer: Float32Array, numPoints = 120): number[] {
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


    async initInput(deviceId?: string) {
        if (!this.context) return;

        // Tear down existing stream before creating a new one
        if (this.currentInputNode) {
            this.currentInputNode.disconnect();
            this.currentInputNode = null;
        }
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(t => t.stop());
            this.currentStream = null;
        }

        try {
            const constraints: MediaStreamConstraints = {
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                    ...(deviceId ? { deviceId: { exact: deviceId } } : {})
                }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.currentStream = stream;
            const source = this.context.createMediaStreamSource(stream);
            this.currentInputNode = source;
            if (this.workletNode) source.connect(this.workletNode);
            console.log('Microphone connected', deviceId ?? '(default)');
        } catch (e) {
            console.error('Error accessing microphone', e);
        }
    }

    /** Switch the active microphone without restarting the AudioContext. */
    async setInputDevice(deviceId: string) {
        await this.initInput(deviceId);
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
            console.log('Output device set to', deviceId);
        } catch (e: any) {
            if (e?.name === 'NotSupportedError') {
                console.warn('setSinkId not supported in this browser.');
            } else {
                console.error('Failed to set output device', e);
            }
        }
    }

    /** List available audio input and output devices. */
    async enumerateDevices(): Promise<{ inputs: MediaDeviceInfo[]; outputs: MediaDeviceInfo[] }> {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return {
            inputs: devices.filter(d => d.kind === 'audioinput'),
            outputs: devices.filter(d => d.kind === 'audiooutput'),
        };
    }

    start() {
        if (this.context?.state === 'suspended') this.context.resume();
        this.initInput();
        this.workletNode?.port.postMessage({ type: 'START' });
    }

    stop() {
        this.workletNode?.port.postMessage({ type: 'STOP' });
    }

    runRTLTest() {
        if (!this.workletNode) return;
        this.workletNode.port.postMessage({ type: 'RTL_TEST' });
    }

    setLatencyCompensation(samples: number) {
        localStorage.setItem('looper_rtl_samples', samples.toString());
        this.workletNode?.port.postMessage({ type: 'SET_LATENCY', payload: { latencySamples: samples } });
    }

    armTrack(trackId: number) {
        this.workletNode?.port.postMessage({ type: 'ARM_TRACK', payload: { trackId } });
    }

    toggleMute(trackId: number) {
        this.workletNode?.port.postMessage({ type: 'MUTE_TRACK', payload: { trackId } });
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
                ? !soloedIds.includes(i)   // solo active: mute unless in solo set
                : muteStates[i] ?? false;  // no solo: restore individual mute

            const current = this._workletMuteState[i] ?? false;
            if (effectiveMuted !== current) {
                this.workletNode?.port.postMessage({ type: 'MUTE_TRACK', payload: { trackId: i } });
                this._workletMuteState[i] = effectiveMuted;
            }
        }
    }

    /** Sync a single track's mute state so _workletMuteState stays accurate. */
    setMute(trackId: number, muted: boolean) {
        const current = this._workletMuteState[trackId] ?? false;
        if (muted !== current) {
            this.workletNode?.port.postMessage({ type: 'MUTE_TRACK', payload: { trackId } });
            this._workletMuteState[trackId] = muted;
        }
    }

    setMetronome(on: boolean) {
        if (this._metronomeOn === on) return;
        this._metronomeOn = on;
        this.workletNode?.port.postMessage({ type: 'MUTE_METRONOME' });
    }

    toggleMetronome() {
        this._metronomeOn = !this._metronomeOn;
        this.workletNode?.port.postMessage({ type: 'MUTE_METRONOME' });
    }

    undoLayer(trackId: number) {
        this.workletNode?.port.postMessage({ type: 'UNDO_LAYER', payload: { trackId } });
    }

    clearTrack(trackId: number) {
        this.workletNode?.port.postMessage({ type: 'CLEAR_TRACK', payload: { trackId } });
    }

    /** Clears ALL track buffers in the worklet — call before loading a new project. */
    clearAllTracks() {
        this.workletNode?.port.postMessage({ type: 'CLEAR_ALL_TRACKS' });
    }

    queueSection(sectionIndex: number) {
        this.workletNode?.port.postMessage({ type: 'QUEUE_SECTION', payload: { sectionIndex } });
    }

    updateFX(trackId: number, fxState: FXState, bpm: number) {
        if (this.trackFX[trackId]) {
            this.trackFX[trackId].update(fxState, bpm);
        }
    }

    setBpm(bpm: number) {
        this.workletNode?.port.postMessage({ type: 'SET_BPM', payload: { bpm } });
    }

    loadBuffer(trackId: number, sectionIndex: number, buffer: Float32Array) {
        this.workletNode?.port.postMessage({
            type: 'SET_BUFFER',
            payload: { trackId, sectionIndex, buffer }
        });
    }

    setMode(mode: Mode) {
        this.workletNode?.port.postMessage({ type: 'SET_MODE', payload: { mode } });
    }

    enterLiveMode(snapshot: FrozenProjectSnapshot) {
        // Enforce snapshot settings on the engine
        this.setBpm(snapshot.bpm);

        // Update FX chains with snapshot values
        snapshot.tracks.forEach((track, i) => {
            this.updateFX(i, track.fx, snapshot.bpm);
        });

        // Pre-allocate or lock structures in worklet
        this.workletNode?.port.postMessage({
            type: 'ENTER_LIVE_MODE',
            payload: { snapshot }
        });
    }

    async loadDemoData() {
        // Always create a fresh "Demo Jam" project so demo loading is
        // idempotent regardless of what project is currently open.
        // This also guarantees trackIdMap / sectionIdMap are populated for
        // the new project before we start saving layers.
        const projectId = await projectService.createProject('Demo Jam', DEFAULT_BPM);
        // loadProject sends CONFIG to the worklet with the correct BPM /
        // sections and populates trackIdMap / sectionIdMap.
        await this.loadProject(projectId);

        const ctx = this.context!;

        // Resolve section length from the freshly created project record.
        const { db: storage } = await import('@live-looper/storage');
        const sectionRecord = await storage.sections.get(this.sectionIdMap[0]);
        const project = await storage.projects.get(this.currentProjectId!);
        const bpm = project?.bpm ?? DEFAULT_BPM;
        const lengthInBars = sectionRecord?.lengthInBars ?? 2;
        const exactLen = this.sectionLenSamples(lengthInBars, bpm);

        const samples = [
            '/samples/looperman-l-2148602-0151263-secret-trap-drumloop-100bpm.wav',
            '/samples/looperman-l-6590395-0406745-zaytoven-2.wav',
            '/samples/looperman-l-0498019-0103176-tumbleweed-100-e-acoustic-guitar-mute-rhythm.wav',
            '/samples/looperman-l-0498019-0079454-tumbleweed-100-e-d-a-d-clean-strat-rhythm.wav'
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
                    sampleRate: ctx.sampleRate
                });
            }
        }

        // Reload the project through the STANDARD path (WAV blob → decodeAudioData
        // → loadBuffer). This is the SAME path used after every real recording
        // session, so there is now ONE unified format for audio in the engine.
        await this.loadProject(this.currentProjectId!);
    }

    private async handleMessage(data: WorkletEvent) {
        if (data.type === 'RECORD_STOP' && this.currentProjectId && data.buffer) {
            const trackId = this.trackIdMap[data.trackId];
            const sectionId = this.sectionIdMap[data.sectionIndex];

            if (trackId && sectionId) {
                await projectService.saveLayer({
                    projectId: this.currentProjectId,
                    trackId,
                    sectionId,
                    audioData: data.buffer,
                    sampleRate: this.context!.sampleRate
                });
                console.log('Layer saved to IndexedDB');
            }
        }

        if (data.type === 'UNDO_LAYER' && this.currentProjectId) {
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
                console.log(`UNDO_LAYER: DB soft-delete ${removed ? 'succeeded' : 'nothing to remove'} (track=${data.trackId})`);
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
        localStorage.setItem('looper_current_project_id', projectId);

        const tracks = await db.tracks.where({ projectId }).sortBy('order');
        this.trackIdMap = tracks.map((t: any) => t.id);

        const rawSections = await db.sections.where({ projectId }).sortBy('order');
        this.sectionIdMap = rawSections.map((s: any) => s.id);

        const savedLatency = localStorage.getItem('looper_rtl_samples');
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
                bars = Math.max(1, Math.round((s.lengthSamples * project.bpm) / (60 * sampleRate * 4)));
            } else {
                bars = 4; // safe default for brand-new sections
            }
            return {
                index: s.order,
                name: s.name,
                lengthInBars: bars,
                trackLinks: [true, true, true, true]
            };
        });

        // Sync worklet with the resolved section config
        this.workletNode?.port.postMessage({
            type: 'CONFIG',
            payload: { sampleRate, bpm: project.bpm, sections: sectionConfigs, latencySamples }
        });

        // Apply FX per track
        tracks.forEach((t: any, i: number) => {
            if (t.fx) this.updateFX(i, t.fx, project.bpm);
        });

        // Restore persisted mute state — worklet starts all tracks unmuted after
        // clearAllTracks, so we send MUTE_TRACK for any track that was saved as muted.
        this._workletMuteState = [false, false, false, false];
        tracks.forEach((t: any, i: number) => {
            const shouldBeMuted = t.muted ?? false;
            if (shouldBeMuted) {
                this.workletNode?.port.postMessage({ type: 'MUTE_TRACK', payload: { trackId: i } });
                this._workletMuteState[i] = true;
            }
        });

        // Load persisted audio blobs into the engine — skip soft-deleted layers.
        const layers = await db.layers
            .where({ projectId })
            .filter(l => !l.deletedAt)
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
                        layerCounts[trackIdx] = (layerCounts[trackIdx] || 0) + 1;
                        // Accumulate waveform RMS per track (last layer wins for now)
                        waveformDataMap[trackIdx] = this.computeWaveform(data);
                    }
                } catch (e) {
                    console.error('Error loading audio blob into engine', e);
                }
            }
        }

        // Notify the UI store — pass the same SectionConfig[] the worklet received,
        // plus waveform data so the UI shows previews without a second async cycle.
        this.notify({
            type: 'PROJECT_LOADED',
            payload: { project, tracks, sections: sectionConfigs, layerCounts, waveformDataMap }
        });
    }

    async createNewProject(name: string) {
        if (!this.context) await this.init();
        const projectId = await projectService.createProject(name, DEFAULT_BPM);
        await this.loadProject(projectId);
        return projectId;
    }

    getLatencyMetrics() {
        if (!this.context) return null;
        return {
            baseLatency: this.context.baseLatency,
            outputLatency: this.context.outputLatency,
            sampleRate: this.context.sampleRate,
            state: this.context.state
        };
    }
}

export const audioEngine = AudioEngine.getInstance();
export { DEFAULT_SECTIONS, DEFAULT_BPM };
