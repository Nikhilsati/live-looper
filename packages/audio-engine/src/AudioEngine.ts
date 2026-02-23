import type { SectionConfig, FXState, Mode, FrozenProjectSnapshot } from '@live-looper/types';

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

    // Storage Context
    private currentProjectId: string | null = null;
    private trackIdMap: string[] = []; // index 0-3 -> UUID
    private sectionIdMap: string[] = []; // index 0-N -> UUID
    private savedProjectId: string | null = null;

    private listeners: ((event: any) => void)[] = [];
    private static instance: AudioEngine;

    private constructor() { }

    static getInstance(): AudioEngine {
        if (!AudioEngine.instance) AudioEngine.instance = new AudioEngine();
        return AudioEngine.instance;
    }

    subscribe(listener: (event: any) => void) {
        this.listeners.push(listener);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    private notify(event: any) {
        this.listeners.forEach(l => l(event));
    }

    async init(sections: SectionConfig[] = DEFAULT_SECTIONS, bpm: number = DEFAULT_BPM) {
        if (this.context) return;

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
                this.handleMessage(event.data);
                this.notify(event.data);
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


    async initInput() {
        if (!this.context) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                },
            });
            const source = this.context.createMediaStreamSource(stream);
            if (this.workletNode) source.connect(this.workletNode);
            console.log('Microphone connected');
        } catch (e) {
            console.error('Error accessing microphone', e);
        }
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

    toggleMetronome() {
        this.workletNode?.port.postMessage({ type: 'MUTE_METRONOME' });
    }

    undoLayer(trackId: number) {
        this.workletNode?.port.postMessage({ type: 'UNDO_LAYER', payload: { trackId } });
    }

    clearTrack(trackId: number) {
        this.workletNode?.port.postMessage({ type: 'CLEAR_TRACK', payload: { trackId } });
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
        if (!this.context || !this.workletNode) await this.init();

        if (!this.currentProjectId) {
            await this.createNewProject("Demo Jam");
        }

        const ctx = this.context!;

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
                // Return mono data for now as the looper engine expects Float32Array
                return audioBuffer.getChannelData(0);
            } catch (e) {
                console.error(`Failed to load sample: ${url}`, e);
                return null;
            }
        };

        for (let i = 0; i < samples.length; i++) {
            const buffer = await loadAndDecode(samples[i]);
            if (buffer && this.currentProjectId) {
                const trackId = this.trackIdMap[i % 4];
                const sectionId = this.sectionIdMap[0];

                await projectService.saveLayer({
                    projectId: this.currentProjectId!,
                    trackId,
                    sectionId,
                    audioData: buffer,
                    sampleRate: ctx.sampleRate
                });

                this.loadBuffer(i % 4, 0, buffer);
            }
        }
    }

    private async handleMessage(data: any) {
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
    }

    async loadProject(projectId: string) {
        if (!this.context || !this.workletNode) await this.init();

        const project = await db.projects.get(projectId);
        if (!project) return;

        this.currentProjectId = projectId;
        localStorage.setItem('looper_current_project_id', projectId);

        const tracks = await db.tracks.where({ projectId }).sortBy('order');
        this.trackIdMap = tracks.map((t: any) => t.id);

        const sections = await db.sections.where({ projectId }).sortBy('order');
        this.sectionIdMap = sections.map((s: any) => s.id);

        // Sync worklet config with project structure
        const savedLatency = localStorage.getItem('looper_rtl_samples');
        const latencySamples = savedLatency ? parseInt(savedLatency, 10) : 0;

        const sampleRate = this.context!.sampleRate;
        this.workletNode?.port.postMessage({
            type: 'CONFIG',
            payload: {
                sampleRate,
                bpm: project.bpm,
                sections: sections.map(s => {
                    // Convert samples to bars if lengthInBars isn't stored
                    const bars = Math.max(1, Math.round((s.lengthSamples * project.bpm) / (60 * sampleRate * 4)));
                    return {
                        index: s.order,
                        name: s.name,
                        lengthInBars: bars,
                        trackLinks: [true, true, true, true]
                    };
                }),
                latencySamples
            },
        });

        // Apply FX state
        tracks.forEach((t: any, i: number) => {
            if (t.fx) {
                this.updateFX(i, t.fx, project.bpm);
            }
        });

        // Load Audio Blobs into Engine and collect stats
        const layers = await db.layers.where({ projectId }).toArray();
        const layerCounts: Record<number, number> = {};

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
                    }
                } catch (e) {
                    console.error('Error loading audio blob into engine', e);
                }
            }
        }

        // Notify UI about loaded project structure and content
        this.notify({
            type: 'PROJECT_LOADED',
            payload: {
                project,
                tracks,
                sections,
                layerCounts // trackIndex -> count
            }
        });
    }

    async createNewProject(name: string) {
        if (!this.context) await this.init();
        const projectId = await projectService.createProject(name, 100);
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
