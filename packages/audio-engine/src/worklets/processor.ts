// ─── Types ─────────────────────────────────────────────────────────────────────
interface LayerMeta {
    buffer: Float32Array;
}

interface Track {
    id: number;
    state: 'IDLE' | 'ARMED' | 'RECORDING' | 'PLAYING';
    // Per-section buffers: sectionIndex → { masterBuffer, layers, recordBuffer }
    sections: Map<number, SectionData>;
    isMuted: boolean;
}

interface SectionData {
    masterBuffer: Float32Array;
    layers: LayerMeta[];
    recordBuffer: Float32Array;
}

interface SectionConfig {
    index: number;
    lengthInBars: number;
    trackLinks: boolean[]; // which tracks are active in this section
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getOrCreateSectionData(track: Track, sectionIndex: number, sectionLen: number): SectionData {
    if (!track.sections.has(sectionIndex)) {
        track.sections.set(sectionIndex, {
            masterBuffer: new Float32Array(sectionLen),
            layers: [],
            recordBuffer: new Float32Array(sectionLen),
        });
    }
    return track.sections.get(sectionIndex)!;
}

function computeWaveformData(buffer: Float32Array, numPoints: number = 120): number[] {
    const data: number[] = [];
    const step = Math.floor(buffer.length / numPoints);
    if (step <= 0) return Array(numPoints).fill(0);

    for (let p = 0; p < numPoints; p++) {
        const start = p * step;
        const end = start + step;
        let sum = 0;
        for (let s = start; s < end; s++) {
            sum += buffer[s] * buffer[s];
        }
        data.push(Math.sqrt(sum / step));
    }
    return data;
}

function rebuildMaster(sd: SectionData): void {
    sd.masterBuffer.fill(0);
    for (const layer of sd.layers) {
        for (let i = 0; i < sd.masterBuffer.length; i++) {
            sd.masterBuffer[i] += layer.buffer[i];
        }
    }
}

// ─── Processor ─────────────────────────────────────────────────────────────────
class LiveLooperProcessor extends AudioWorkletProcessor {
    private currentSample: number = 0;
    private isPlaying: boolean = false;
    private samplesPerBeat: number = 0;
    private sampleRate: number = 44100;
    private tracks: Track[] = [];
    private metronomeEnabled: boolean = true;
    private lastProcessTime: number = 0;

    // RTL & Compensation
    private rtlTestActive: boolean = false;
    private rtlTestStartTime: number = 0;
    private rtlSpikeDetected: boolean = false;
    private latencySamples: number = 0;

    // Section management
    private sections: SectionConfig[] = [];
    private currentSectionIndex: number = 0;
    private queuedSectionIndex: number | null = null;
    private sectionSampleOffset: number = 0; // currentSample at start of this section loop

    constructor() {
        super();

        for (let id = 0; id < 4; id++) {
            this.tracks.push({ id, state: 'IDLE', sections: new Map(), isMuted: false });
        }

        // Default: one section, 8 bars
        this.sections = [{ index: 0, lengthInBars: 8, trackLinks: [true, true, true, true] }];

        this.port.onmessage = (event) => {
            const { type, payload } = event.data;

            if (type === 'START') {
                this.isPlaying = true;
                this.currentSample = 0;
                this.sectionSampleOffset = 0;
                this.currentSectionIndex = 0;
                this.queuedSectionIndex = null;

            } else if (type === 'STOP') {
                this.isPlaying = false;
                this.currentSample = 0;
                this.sectionSampleOffset = 0;

            } else if (type === 'CONFIG') {
                const { sampleRate, bpm, sections, latencySamples } = payload;
                this.sampleRate = sampleRate;
                this.samplesPerBeat = (sampleRate * 60) / bpm;
                if (sections && sections.length > 0) {
                    this.sections = sections;
                }
                if (typeof latencySamples === 'number') {
                    this.latencySamples = latencySamples;
                }

            } else if (type === 'RTL_TEST') {
                this.rtlTestActive = true;
                this.rtlSpikeDetected = false;
                this.rtlTestStartTime = 0; // Will set in process loop

            } else if (type === 'SET_LATENCY') {
                this.latencySamples = payload.latencySamples;

            } else if (type === 'QUEUE_SECTION') {
                this.queuedSectionIndex = payload.sectionIndex;

            } else if (type === 'SET_BPM') {
                this.samplesPerBeat = (this.sampleRate * 60) / payload.bpm;

            } else if (type === 'ARM_TRACK') {
                const { trackId } = payload;
                const track = this.tracks[trackId];
                if (!track) return;
                const sd = getOrCreateSectionData(track, this.currentSectionIndex, this.currentSectionLen());
                if (track.state === 'IDLE' || track.state === 'PLAYING') {
                    track.state = 'ARMED';
                } else if (track.state === 'ARMED') {
                    track.state = sd.layers.length > 0 ? 'PLAYING' : 'IDLE';
                }

            } else if (type === 'MUTE_TRACK') {
                const track = this.tracks[payload.trackId];
                if (track) track.isMuted = !track.isMuted;

            } else if (type === 'UNDO_LAYER') {
                const { trackId } = payload;
                const track = this.tracks[trackId];
                if (!track) return;
                const sd = track.sections.get(this.currentSectionIndex);
                if (!sd || sd.layers.length === 0) return;
                sd.layers.pop();
                rebuildMaster(sd);
                if (sd.layers.length === 0) {
                    track.state = 'IDLE';
                    this.port.postMessage({ type: 'TRACK_CLEARED', trackId, sectionIndex: this.currentSectionIndex });
                } else {
                    const waveformData = computeWaveformData(sd.masterBuffer);
                    this.port.postMessage({ type: 'RECORD_STOP', trackId, sectionIndex: this.currentSectionIndex, layerCount: sd.layers.length, waveformData });
                }

            } else if (type === 'CLEAR_TRACK') {
                const { trackId } = payload;
                const track = this.tracks[trackId];
                if (!track) return;
                track.sections.clear();
                track.state = 'IDLE';
                this.port.postMessage({ type: 'TRACK_CLEARED', trackId, sectionIndex: this.currentSectionIndex });

            } else if (type === 'MUTE_METRONOME') {
                this.metronomeEnabled = !this.metronomeEnabled;

            } else if (type === 'SET_BUFFER') {
                const { trackId, sectionIndex, buffer } = payload;
                const track = this.tracks[trackId];
                if (!track) return;

                const sd = getOrCreateSectionData(track, sectionIndex, buffer.length);
                sd.layers = [{ buffer: new Float32Array(buffer) }];
                sd.masterBuffer.set(buffer);
                track.state = 'PLAYING';

                const waveformData = computeWaveformData(sd.masterBuffer);
                this.port.postMessage({
                    type: 'RECORD_STOP',
                    trackId,
                    sectionIndex,
                    layerCount: 1,
                    waveformData
                });
            }
        };
    }

    private currentSectionLen(): number {
        const sec = this.sections[this.currentSectionIndex];
        if (!sec || this.samplesPerBeat === 0) return 0;
        return Math.floor(this.samplesPerBeat * 4 * sec.lengthInBars);
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], _parameters: Record<string, Float32Array>) {
        const currentTime = (globalThis as any).currentTime;
        const delta = this.lastProcessTime ? (currentTime - this.lastProcessTime) : 0;
        this.lastProcessTime = currentTime;

        if (!this.isPlaying && !this.rtlTestActive) return true;

        const input = inputs[0];
        const inputChannel = (input && input[0] && input[0].length > 0) ? input[0] : null;

        const sectionLen = this.currentSectionLen();
        if (sectionLen === 0 && !this.rtlTestActive) return true;

        const outputCount = outputs[0][0].length;

        for (let i = 0; i < outputCount; i++) {
            this.currentSample++;
            const sectionRelative = this.currentSample - this.sectionSampleOffset;
            const sectionSample = sectionLen > 0 ? (sectionRelative % sectionLen) : 0;

            // ── 0. RTL Test Logic ─────────────────────────────────────────────
            if (this.rtlTestActive) {
                // Emit spike at start
                if (this.rtlTestStartTime === 0) {
                    this.rtlTestStartTime = this.currentSample;
                }

                // Impulse on System Output (Port 4)
                const sysOut = outputs[4];
                if (sysOut && this.currentSample === this.rtlTestStartTime) {
                    if (sysOut[0]) sysOut[0][i] = 1.0;
                    if (sysOut[1]) sysOut[1][i] = 1.0;
                }

                // Detect on Input
                if (!this.rtlSpikeDetected && inputChannel && inputChannel[i] > 0.3) {
                    const measured = this.currentSample - this.rtlTestStartTime;
                    this.rtlSpikeDetected = true;
                    this.rtlTestActive = false;
                    this.port.postMessage({ type: 'RTL_MEASURED', samples: measured, latencyMs: (measured / this.sampleRate) * 1000 });
                }

                // Timeout RTL test if nothing detected for 2 seconds
                if (this.currentSample - this.rtlTestStartTime > this.sampleRate * 2) {
                    this.rtlTestActive = false;
                    this.port.postMessage({ type: 'RTL_TIMEOUT' });
                }
            }

            if (!this.isPlaying) continue;

            // ── 1. Output Mixing (Individual Ports) ──────────────────────────
            const playIdx = (sectionRelative - 1 + sectionLen) % sectionLen;
            const currentSection = this.sections[this.currentSectionIndex];

            // Tracks 0-3 on outputs 0-3
            for (let t = 0; t < 4; t++) {
                const track = this.tracks[t];
                const trackOutput = outputs[t];
                if (!trackOutput) continue;

                let trackSample = 0;
                if (!track.isMuted && currentSection?.trackLinks[track.id] &&
                    (track.state === 'PLAYING' || track.state === 'ARMED' || track.state === 'RECORDING')) {
                    const sd = track.sections.get(this.currentSectionIndex);
                    if (sd && sd.masterBuffer.length > 0) {
                        trackSample = sd.masterBuffer[playIdx];
                    }
                }

                if (trackOutput[0]) trackOutput[0][i] = trackSample;
                if (trackOutput[1]) trackOutput[1][i] = trackSample;
            }

            // Metronome/System on output 4 (if not RTL testing)
            const systemOutput = outputs[4];
            if (systemOutput && !this.rtlTestActive) {
                let systemSample = 0;
                if (this.metronomeEnabled && this.samplesPerBeat > 0 &&
                    (this.currentSample % Math.floor(this.samplesPerBeat)) === 0) {
                    const totalBeats = Math.floor(this.currentSample / this.samplesPerBeat);
                    const isBarOne = (totalBeats % 4) === 0;
                    systemSample = isBarOne ? 0.7 : 0.35;
                }
                if (systemOutput[0]) systemOutput[0][i] = systemSample;
                if (systemOutput[1]) systemOutput[1][i] = systemSample;
            }

            // ── 2. Recording Logic ────────────────────────────────────────────
            for (const track of this.tracks) {
                // Quantized start at section boundary
                if (track.state === 'ARMED' && sectionSample === 1) {
                    track.state = 'RECORDING';
                    const sd = getOrCreateSectionData(track, this.currentSectionIndex, sectionLen);
                    sd.recordBuffer.fill(0);
                }

                if (track.state === 'RECORDING' && inputChannel) {
                    const recIdx = (sectionRelative - 1 + sectionLen) % sectionLen;
                    const sd = getOrCreateSectionData(track, this.currentSectionIndex, sectionLen);
                    sd.recordBuffer[recIdx] += inputChannel[i];
                }

                // End of section: commit layer
                if (track.state === 'RECORDING' && sectionSample === 0) {
                    const sd = getOrCreateSectionData(track, this.currentSectionIndex, sectionLen);
                    const layerBuf = new Float32Array(sectionLen);

                    // --- LATENCY COMPENSATION ---
                    // The audio we just recorded is "late" by latencySamples.
                    // We need to shift it left (early) to align.
                    if (this.latencySamples > 0 && this.latencySamples < sectionLen) {
                        for (let s = 0; s < sectionLen; s++) {
                            const sourceIdx = (s + this.latencySamples) % sectionLen;
                            layerBuf[s] = sd.recordBuffer[sourceIdx];
                        }
                    } else {
                        layerBuf.set(sd.recordBuffer);
                    }

                    sd.layers.push({ buffer: layerBuf });
                    for (let s = 0; s < sectionLen; s++) sd.masterBuffer[s] += layerBuf[s];
                    track.state = 'PLAYING';

                    const waveformData = computeWaveformData(sd.masterBuffer);
                    this.port.postMessage({
                        type: 'RECORD_STOP',
                        trackId: track.id,
                        sectionIndex: this.currentSectionIndex,
                        layerCount: sd.layers.length,
                        waveformData,
                    });
                }
            }

            // ── 3. Section Transition ─────────────────────────────────────────
            // At the very last sample of the section loop, switch to queued section
            if (sectionSample === 0 && sectionRelative > 0) {
                const nextIndex = this.queuedSectionIndex ?? this.currentSectionIndex;
                if (nextIndex !== this.currentSectionIndex) {
                    this.currentSectionIndex = nextIndex;
                    this.queuedSectionIndex = null;
                    this.sectionSampleOffset = this.currentSample;
                    // Reset any ARMED tracks that aren't linked in new section
                    const newSection = this.sections[this.currentSectionIndex];
                    for (const track of this.tracks) {
                        if (track.state === 'ARMED' && newSection && !newSection.trackLinks[track.id]) {
                            track.state = 'IDLE';
                        }
                    }
                    this.port.postMessage({ type: 'SECTION_CHANGE', sectionIndex: this.currentSectionIndex });
                } else {
                    // Same section looping — just reset offset
                    this.sectionSampleOffset = this.currentSample;
                }
            }
        }

        // ── Tick ─────────────────────────────────────────────────────────────
        const beatDuration = Math.floor(this.samplesPerBeat);
        if (beatDuration > 0 && this.currentSample % beatDuration === 0) {
            const sectionRelative = this.currentSample - this.sectionSampleOffset;
            const sectionLen2 = this.currentSectionLen();
            const sectionBeat = Math.floor(sectionRelative / this.samplesPerBeat);
            const bar = Math.floor(sectionBeat / 4) + 1;
            const beat = (sectionBeat % 4) + 1;
            const sectionProgress = sectionLen2 > 0 ? (sectionRelative % sectionLen2) / sectionLen2 : 0;

            // Measure jitter (time between process calls is implicit in the host, but we can check drift)
            // We'll report current time to compare with host time
            this.port.postMessage({
                type: 'TICK',
                bar,
                beat,
                time: this.currentSample / this.sampleRate,
                currentTime: currentTime,
                jitter: delta, // Report the process-to-process delta
                sectionIndex: this.currentSectionIndex,
                sectionProgress,
            });
        }

        return true;
    }
}

registerProcessor('live-looper-processor', LiveLooperProcessor);
