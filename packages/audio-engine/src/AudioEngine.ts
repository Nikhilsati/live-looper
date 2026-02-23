import type { SectionConfig, FXState } from '@live-looper/types';

const DEFAULT_SECTIONS: SectionConfig[] = [
    { index: 0, name: 'Verse', lengthInBars: 4, trackLinks: [true, true, true, true] },
    { index: 1, name: 'Chorus', lengthInBars: 8, trackLinks: [true, true, true, true] },
    { index: 2, name: 'Bridge', lengthInBars: 4, trackLinks: [true, true, true, true] },
];

const DEFAULT_BPM = 100;

import { TrackFXChain } from './TrackFXChain';
import { MasterBus } from './MasterBus';

class AudioEngine {
    context: AudioContext | null = null;
    workletNode: AudioWorkletNode | null = null;
    trackFX: TrackFXChain[] = [];
    masterBus: MasterBus | null = null;

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

            this.workletNode.port.onmessage = (event) => this.notify(event.data);

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

    async loadDemoData() {
        if (!this.context || !this.workletNode) await this.init();
        const ctx = this.context!;
        const bpm = 100;
        const secondsPerBeat = 60 / bpm;
        const sectionBars = 4;
        const totalSamples = Math.floor(ctx.sampleRate * secondsPerBeat * 4 * sectionBars);

        const generateTrack = (type: 'kick' | 'snare' | 'bass' | 'lead') => {
            const buf = new Float32Array(totalSamples);
            const samplesPerBeat = ctx.sampleRate * secondsPerBeat;

            for (let i = 0; i < totalSamples; i++) {
                const beat = (i / samplesPerBeat) % 4;
                const bar = Math.floor(i / (samplesPerBeat * 4));

                if (type === 'kick') {
                    // Kick on 1 and 3
                    if (beat < 0.1 || (beat > 2 && beat < 2.1)) {
                        const t = (i % samplesPerBeat) / ctx.sampleRate;
                        buf[i] = Math.exp(-t * 15) * Math.sin(2 * Math.PI * 55 * Math.exp(-t * 20));
                    }
                } else if (type === 'snare') {
                    // Snare on 2 and 4
                    if ((beat > 1 && beat < 1.1) || (beat > 3 && beat < 3.1)) {
                        buf[i] = (Math.random() * 2 - 1) * Math.exp(-(beat % 1) * 10) * 0.3;
                    }
                } else if (type === 'bass') {
                    // Bass pulse
                    const freq = [55, 55, 41, 48][bar % 4];
                    buf[i] = Math.sin(2 * Math.PI * freq * (i / ctx.sampleRate)) * 0.2;
                }
            }
            return buf;
        };

        this.loadBuffer(0, 0, generateTrack('kick'));
        this.loadBuffer(1, 0, generateTrack('snare'));
        this.loadBuffer(2, 0, generateTrack('bass'));
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
