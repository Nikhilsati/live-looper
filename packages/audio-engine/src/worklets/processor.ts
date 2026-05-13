// import {  AudioWorkletProcessor } from "@live-looper/types/src/audio-worklet";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface LayerMeta {
    buffer: Float32Array;
}

interface Track {
    id: number;
    state: 'IDLE' | 'ARMED' | 'RECORDING' | 'POST_ROLL' | 'PLAYING';
    // Per-section buffers: sectionIndex → { masterBuffer, layers, recordBuffer }
    sections: Map<number, SectionData>;
    isMuted: boolean;
    postRollSamplesRemaining: number;
    channelMode: 'mono' | 'stereo';
}

interface SectionData {
    masterBuffer: Float32Array;
    layers: LayerMeta[];
    recordBuffer: Float32Array;
}

// Sync with @live-looper/types
interface SectionConfig {
    index: number;
    name: string;
    lengthInBars: number;
    trackLinks: boolean[]; // length 4 — which tracks play in this section
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

    // Smart Snap (Pre/Post Roll)
    private inputHistory: Float32Array = new Float32Array(0);
    private inputHistoryWriteIdx: number = 0;
    private smartSnapWindowSamples: number = 0;
    private quantization: { snapToGrid: boolean; gridResolution: number } | null = null;

    // Level tracking
    private inputSums: number[] = [0, 0, 0, 0];
    private inputCount: number = 0;

    constructor() {
        super();

        for (let id = 0; id < 4; id++) {
            this.tracks.push({ id, state: 'IDLE', sections: new Map(), isMuted: false, postRollSamplesRemaining: 0, channelMode: 'stereo' });
        }

        // Default: one section, 8 bars
        this.sections = [{ index: 0, name: 'Initial', lengthInBars: 8, trackLinks: [true, true, true, true] }];

        this.port.onmessage = (event) => {
            const { type, payload } = event.data;

            switch (type) {
                case 'START':
                    this.isPlaying = true;
                    this.currentSample = 0;
                    this.sectionSampleOffset = 0;
                    this.currentSectionIndex = 0;
                    this.queuedSectionIndex = null;
                    break;

                case 'STOP':
                    this.isPlaying = false;
                    this.currentSample = 0;
                    this.sectionSampleOffset = 0;
                    break;

                case 'CONFIG': {
                    const { sampleRate, bpm, sections, latencySamples, smartSnapEnabled, quantization } = payload;
                    this.sampleRate = sampleRate;
                    this.samplesPerBeat = (sampleRate * 60) / bpm;
                    if (sections && sections.length > 0) {
                        this.sections = sections;
                    }
                    if (typeof latencySamples === 'number') {
                        this.latencySamples = latencySamples;
                    }
                    if (typeof smartSnapEnabled === 'boolean') {
                        this.smartSnapEnabled = smartSnapEnabled;
                        console.log(`[AudioWorklet] CONFIG received. smartSnapEnabled=${smartSnapEnabled}`);
                    }
                    if (quantization) {
                        this.quantization = quantization;
                    }
                    // Initialize the pre-roll / post-roll window size (e.g. 250ms)
                    this.smartSnapWindowSamples = Math.floor((this.sampleRate * 250) / 1000);
                    if (this.inputHistory.length !== this.smartSnapWindowSamples) {
                        this.inputHistory = new Float32Array(this.smartSnapWindowSamples);
                        this.inputHistoryWriteIdx = 0;
                    }
                    break;
                }

                case 'SET_SMART_SNAP':
                    this.smartSnapEnabled = payload.enabled;
                    break;

                case 'RTL_TEST':
                    this.rtlTestActive = true;
                    this.rtlSpikeDetected = false;
                    this.rtlTestStartTime = 0; // Will set in process loop
                    break;

                case 'SET_LATENCY':
                    this.latencySamples = payload.latencySamples;
                    break;

                case 'QUEUE_SECTION':
                    this.queuedSectionIndex = payload.sectionIndex;
                    break;

                case 'SET_BPM': {
                    const newBpm = payload.bpm;
                    const oldSamplesPerBeat = this.samplesPerBeat;
                    const newSamplesPerBeat = (this.sampleRate * 60) / newBpm;

                    if (oldSamplesPerBeat > 0 && Math.abs(newSamplesPerBeat - oldSamplesPerBeat) > 0.001) {
                        const ratio = newSamplesPerBeat / oldSamplesPerBeat;

                        this.stretchAllSections(newSamplesPerBeat, ratio);

                        // 4. Adjust playhead proportionally
                        const currentSectionRelative = this.currentSample - this.sectionSampleOffset;
                        const newSectionRelative = Math.floor(currentSectionRelative * ratio);
                        this.sectionSampleOffset = this.currentSample - newSectionRelative;
                    }

                    this.samplesPerBeat = newSamplesPerBeat;
                    break;
                }

                case 'ARM_TRACK': {
                    const { trackId } = payload;
                    const track = this.tracks[trackId];
                    if (!track) return;
                    const sd = getOrCreateSectionData(track, this.currentSectionIndex, this.currentSectionLen());
                    if (track.state === 'IDLE' || track.state === 'PLAYING') {
                        track.state = 'ARMED';
                    } else if (track.state === 'ARMED') {
                        track.state = sd.layers.length > 0 ? 'PLAYING' : 'IDLE';
                    }
                    break;
                }

                case 'MUTE_TRACK': {
                    const track = this.tracks[payload.trackId];
                    if (track) track.isMuted = payload.muted ?? !track.isMuted;
                    break;
                }

                case 'UNDO_LAYER': {
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
                    // Emit a confirmation so AudioEngine can soft-delete the DB record.
                    this.port.postMessage({ type: 'UNDO_LAYER', trackId, sectionIndex: this.currentSectionIndex });
                    break;
                }

                case 'CLEAR_TRACK': {
                    const { trackId } = payload;
                    const track = this.tracks[trackId];
                    if (!track) return;
                    track.sections.clear();
                    track.state = 'IDLE';
                    this.port.postMessage({ type: 'TRACK_CLEARED', trackId, sectionIndex: this.currentSectionIndex });
                    break;
                }

                case 'CLEAR_ALL_TRACKS':
                    // Reset the entire worklet state for a fresh project load.
                    // Clears all section buffers and brings every track back to IDLE.
                    for (const track of this.tracks) {
                        track.sections.clear();
                        track.state = 'IDLE';
                        track.isMuted = false;
                    }
                    this.currentSample = 0;
                    this.sectionSampleOffset = 0;
                    this.currentSectionIndex = 0;
                    this.queuedSectionIndex = null;
                    break;

                case 'MUTE_METRONOME':
                    this.metronomeEnabled = !this.metronomeEnabled;
                    break;

                case 'SET_BUFFER': {
                    const { trackId, sectionIndex, buffer } = payload;
                    const track = this.tracks[trackId];
                    if (!track) return;

                    const layerBuf = new Float32Array(buffer);
                    const sd = getOrCreateSectionData(track, sectionIndex, buffer.length);
                    sd.layers.push({ buffer: layerBuf });
                    // Accumulate into master (same as live recording commit)
                    for (let s = 0; s < sd.masterBuffer.length; s++) {
                        sd.masterBuffer[s] += layerBuf[s];
                    }
                    track.state = 'PLAYING';

                    const waveformData = computeWaveformData(sd.masterBuffer);
                    this.port.postMessage({
                        type: 'RECORD_STOP',
                        trackId,
                        sectionIndex,
                        layerCount: sd.layers.length,
                        waveformData
                    });
                    break;
                }

                case 'CONFIG_CHANNELS': {
                    const { trackConfigs } = payload;
                    trackConfigs.forEach((config: { trackId: number; mode: 'mono' | 'stereo' }) => {
                        const track = this.tracks[config.trackId];
                        if (track) track.channelMode = config.mode;
                    });
                    break;
                }
            }
        };
    }

    private currentSectionLen(): number {
        const sec = this.sections[this.currentSectionIndex];
        if (!sec || this.samplesPerBeat === 0) return 0;
        return Math.floor(this.samplesPerBeat * 4 * sec.lengthInBars);
    }

    private commitLayerStandard(track: Track, sectionLen: number) {
        const sd = getOrCreateSectionData(track, this.currentSectionIndex, sectionLen);
        const reqSize = sectionLen + 2 * this.smartSnapWindowSamples;
        const expandedBuffer = sd.recordBuffer;

        const compensatedBuffer = new Float32Array(reqSize);
        if (this.latencySamples > 0 && this.latencySamples < reqSize) {
            for (let s = 0; s < reqSize; s++) {
                if (s + this.latencySamples < reqSize) {
                    compensatedBuffer[s] = expandedBuffer[s + this.latencySamples];
                } else {
                    compensatedBuffer[s] = 0;
                }
            }
        } else {
            compensatedBuffer.set(expandedBuffer);
        }

        const layerBuf = new Float32Array(sectionLen);
        for (let s = 0; s < sectionLen; s++) {
            const readIdx = this.smartSnapWindowSamples + s;
            if (readIdx >= 0 && readIdx < reqSize) {
                layerBuf[s] = compensatedBuffer[readIdx];
            }
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
            buffer: layerBuf
        });
    }

    private detectOnsets(buffer: Float32Array): number[] {
        const onsets: number[] = [];
        const winSize = Math.floor(this.sampleRate * 0.01); // 10ms
        const hop = Math.floor(winSize / 2);
        let lastEnergy = 0;

        const threshold = 0.05; // min energy
        let cooldown = 0;

        for (let i = 0; i < buffer.length - winSize; i += hop) {
            let energy = 0;
            for (let j = 0; j < winSize; j++) {
                energy += Math.abs(buffer[i + j]);
            }
            energy /= winSize;

            if (energy > threshold && energy > lastEnergy * 2.5 && cooldown <= 0) {
                let maxE = 0;
                let maxIdx = i;
                for (let j = 0; j < winSize; j++) {
                    if (Math.abs(buffer[i + j]) > maxE) {
                        maxE = Math.abs(buffer[i + j]);
                        maxIdx = i + j;
                    }
                }

                let onsetIdx = maxIdx;
                while (onsetIdx > i && Math.abs(buffer[onsetIdx]) > maxE * 0.1) {
                    onsetIdx--;
                }

                onsets.push(onsetIdx);
                cooldown = Math.floor(this.sampleRate * 0.1); // 100ms
            }
            lastEnergy = energy;
            if (cooldown > 0) cooldown -= hop;
        }
        return onsets;
    }

    private stretchAllSections(newSamplesPerBeat: number, ratio: number) {
        for (const track of this.tracks) {
            track.sections.forEach((sd, sectionIndex) => {
                const secConfig = this.sections.find(s => s.index === sectionIndex);
                if (!secConfig) return;

                const newSectionLen = Math.floor(newSamplesPerBeat * 4 * secConfig.lengthInBars);
                if (newSectionLen === 0) return;

                // 1. Stretch masterBuffer
                const stretchedMaster = this.fastResampleLinear(sd.masterBuffer, ratio);
                const newMaster = new Float32Array(newSectionLen);
                newMaster.set(stretchedMaster.subarray(0, Math.min(newSectionLen, stretchedMaster.length)));
                sd.masterBuffer = newMaster;

                // 2. Stretch all layers
                for (const layer of sd.layers) {
                    const stretchedLayer = this.fastResampleLinear(layer.buffer, ratio);
                    const newLayerBuf = new Float32Array(newSectionLen);
                    newLayerBuf.set(stretchedLayer.subarray(0, Math.min(newSectionLen, stretchedLayer.length)));
                    layer.buffer = newLayerBuf;
                }

                // 3. Resize recordBuffer
                const reqSize = newSectionLen + 2 * this.smartSnapWindowSamples;
                sd.recordBuffer = new Float32Array(reqSize);
            });
        }
    }

    /**
     * Extremely fast O(N) linear resampling time-stretch.
     * Alters pitch but runs in <1ms, avoiding audio thread crashes for massive lengths.
     */
    private fastResampleLinear(source: Float32Array, ratio: number): Float32Array {
        if (ratio === 1) return source.slice();
        if (ratio < 0.1 || ratio > 10) return source.slice(); // safety limits

        const outLength = Math.floor(source.length * ratio);
        const output = new Float32Array(outLength);

        for (let i = 0; i < outLength; i++) {
            const srcPos = i / ratio;
            const idx1 = Math.floor(srcPos);
            const idx2 = Math.min(idx1 + 1, source.length - 1);
            const frac = srcPos - idx1;

            if (idx1 >= source.length) break;

            output[i] = source[idx1] * (1 - frac) + source[idx2] * frac;
        }

        return output;
    }

    private wsolaStretch(source: Float32Array, ratio: number): Float32Array {
        if (ratio === 1) return source.slice();
        if (ratio < 0.1 || ratio > 10) return source.slice(); // safety limits

        const outLength = Math.floor(source.length * ratio);
        const output = new Float32Array(outLength);

        // Standard 40ms window
        const winSize = Math.floor(this.sampleRate * 0.04);
        const halfWin = Math.floor(winSize / 2);
        const hopOut = halfWin;
        const hopIn = hopOut / ratio;

        // Create Hanning window
        const window = new Float32Array(winSize);
        for (let i = 0; i < winSize; i++) {
            window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (winSize - 1)));
        }

        // Search boundaries a ±15ms neighborhood for best cross-correlation
        const searchMaxOffset = Math.floor(this.sampleRate * 0.015);

        let inPos = 0;
        let outPos = 0;

        // First frame is a direct copy to output
        for (let i = 0; i < winSize && i < source.length && i < outLength; i++) {
            output[i] += source[i] * window[i];
        }

        outPos += hopOut;
        inPos += hopIn;

        while (outPos + winSize < outLength && inPos + winSize < source.length) {
            let bestOffset = Math.floor(inPos);
            let maxCorrelation = -Infinity;

            // To ensure phase alignment, we cross-correlate the tail of the audio 
            // ALREADY written to output, with the start of the CANDIDATE windows in the source.
            // We search around the theoretical next inPos.
            const idealNextInPos = Math.floor(inPos);
            const searchStart = Math.max(0, idealNextInPos - searchMaxOffset);
            const searchEnd = Math.min(source.length - winSize, idealNextInPos + searchMaxOffset);

            for (let offset = searchStart; offset <= searchEnd; offset++) {
                let correlation = 0;

                // Correlate the first half of the candidate window with the overlapping portion of already written output 
                for (let i = 0; i < halfWin; i++) {
                    const outSample = output[outPos + i]; // Already written audio
                    const srcSample = source[offset + i]; // Candidate audio overlap
                    correlation += outSample * srcSample;
                }

                if (correlation > maxCorrelation) {
                    maxCorrelation = correlation;
                    bestOffset = offset;
                }
            }

            // Fallback if cross-correlation failed (e.g., pure silence)
            if (maxCorrelation === -Infinity) {
                bestOffset = idealNextInPos;
            }

            // Now apply overlap-add using the perfectly aligned phase offset
            for (let i = 0; i < winSize; i++) {
                output[outPos + i] += source[bestOffset + i] * window[i];
            }

            outPos += hopOut;
            inPos += hopIn;
        }

        return output;
    }

    private commitLayerWithSmartSnap(track: Track, sectionLen: number) {
        const sd = getOrCreateSectionData(track, this.currentSectionIndex, sectionLen);
        const reqSize = sectionLen + 2 * this.smartSnapWindowSamples;
        const expandedBuffer = sd.recordBuffer;

        const compensatedBuffer = new Float32Array(reqSize);
        if (this.latencySamples > 0 && this.latencySamples < reqSize) {
            for (let s = 0; s < reqSize; s++) {
                if (s + this.latencySamples < reqSize) {
                    compensatedBuffer[s] = expandedBuffer[s + this.latencySamples];
                } else {
                    compensatedBuffer[s] = 0;
                }
            }
        } else {
            compensatedBuffer.set(expandedBuffer);
        }

        // --- Full Layer Auto Time Sync (WSOLA) ---
        const rawOnsets = this.detectOnsets(compensatedBuffer);

        // Add start and end boundaries to onsets list
        const validOnsets = rawOnsets.filter(o => o > this.smartSnapWindowSamples && o < this.smartSnapWindowSamples + sectionLen);
        const onsets = [this.smartSnapWindowSamples, ...validOnsets, this.smartSnapWindowSamples + sectionLen];

        // Quantize onsets to nearest grid point
        const quantizedOnsets = onsets.map(onset => {
            const relativeOffset = onset - this.smartSnapWindowSamples;
            const gridRes = this.quantization?.gridResolution || 16;
            const samplesPerGrid = this.samplesPerBeat * (4 / gridRes);

            const gridIndex = Math.round(relativeOffset / samplesPerGrid);
            let quantizedIdx = this.smartSnapWindowSamples + gridIndex * samplesPerGrid;

            if (quantizedIdx < this.smartSnapWindowSamples) quantizedIdx = this.smartSnapWindowSamples;
            if (quantizedIdx > this.smartSnapWindowSamples + sectionLen) quantizedIdx = this.smartSnapWindowSamples + sectionLen;

            return quantizedIdx;
        });

        // Stretch and stitch
        const stretchedBuffer = new Float32Array(sectionLen);

        for (let i = 0; i < onsets.length - 1; i++) {
            const startSrc = onsets[i];
            const endSrc = onsets[i + 1];
            const startTgt = quantizedOnsets[i];
            const endTgt = quantizedOnsets[i + 1];

            const srcLength = endSrc - startSrc;
            const tgtLength = endTgt - startTgt;

            if (srcLength > 0 && tgtLength > 0) {
                const ratio = tgtLength / srcLength;
                const sourceSegment = compensatedBuffer.slice(Math.floor(startSrc), Math.floor(endSrc));
                const stretchedSegment = this.wsolaStretch(sourceSegment, ratio);

                const writeStart = Math.floor(startTgt - this.smartSnapWindowSamples);
                for (let s = 0; s < stretchedSegment.length; s++) {
                    if (writeStart + s >= 0 && writeStart + s < sectionLen) {
                        stretchedBuffer[writeStart + s] += stretchedSegment[s];
                    }
                }
            }
        }

        // Apply slight crossfade at the boundaries to prevent clicks
        const xfadeSamples = Math.floor(this.sampleRate * 0.005); // 5ms fade
        for (let s = 0; s < xfadeSamples; s++) {
            if (s < sectionLen) {
                const fade = Math.sin((s / xfadeSamples) * Math.PI / 2); // 0 to 1
                stretchedBuffer[s] = stretchedBuffer[s] * fade;
                stretchedBuffer[sectionLen - 1 - s] = stretchedBuffer[sectionLen - 1 - s] * fade;
            }
        }

        sd.layers.push({ buffer: stretchedBuffer });
        for (let s = 0; s < sectionLen; s++) {
            sd.masterBuffer[s] += stretchedBuffer[s];
        }
        track.state = 'PLAYING';

        const waveformData = computeWaveformData(sd.masterBuffer);
        this.port.postMessage({
            type: 'RECORD_STOP',
            trackId: track.id,
            sectionIndex: this.currentSectionIndex,
            layerCount: sd.layers.length,
            waveformData,
            buffer: stretchedBuffer,
            rawBuffer: compensatedBuffer
        });
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], _parameters: Record<string, Float32Array>) {
        const currentTime = (globalThis as any).currentTime;
        const delta = this.lastProcessTime ? (currentTime - this.lastProcessTime) : 0;
        this.lastProcessTime = currentTime;

        if (!this.isPlaying && !this.rtlTestActive) return true;

        // Collect input channels for all tracks
        const trackInputs: (Float32Array[] | null)[] = [];
        for (let t = 0; t < 4; t++) {
            const input = inputs[t];
            if (input && input.length > 0 && input[0].length > 0) {
                trackInputs[t] = input;
            } else {
                trackInputs[t] = null;
            }
        }

        // Global level monitoring (simplified: just take the first track's first channel for RTL or default)
        const inputChannel = (trackInputs[0] && trackInputs[0][0]) ? trackInputs[0][0] : null;

        const sectionLen = this.currentSectionLen();
        if (sectionLen === 0 && !this.rtlTestActive) return true;

        const outputCount = outputs[0][0].length;

        for (let i = 0; i < outputCount; i++) {
            // Level tracking
            this.inputCount++;
            for (let t = 0; t < 4; t++) {
                const tInput = trackInputs[t];
                if (tInput) {
                    const val = (tInput.length > 1 && this.tracks[t].channelMode === 'stereo')
                        ? (tInput[0][i] + tInput[1][i]) * 0.5
                        : tInput[0][i];
                    this.inputSums[t] += val * val;
                }
            }
            // Update global input history
            if (this.smartSnapWindowSamples > 0) {
                if (inputChannel) {
                    this.inputHistory[this.inputHistoryWriteIdx] = inputChannel[i];
                } else {
                    this.inputHistory[this.inputHistoryWriteIdx] = 0;
                }
                this.inputHistoryWriteIdx = (this.inputHistoryWriteIdx + 1) % this.smartSnapWindowSamples;
            }

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

                    const reqSize = sectionLen + 2 * this.smartSnapWindowSamples;
                    if (sd.recordBuffer.length !== reqSize) {
                        sd.recordBuffer = new Float32Array(reqSize);
                    } else {
                        sd.recordBuffer.fill(0);
                    }

                    // Copy pre-roll from inputHistory to the start of recordBuffer
                    for (let s = 0; s < this.smartSnapWindowSamples; s++) {
                        const readIdx = (this.inputHistoryWriteIdx + s) % this.smartSnapWindowSamples;
                        sd.recordBuffer[s] = this.inputHistory[readIdx];
                    }
                }

                if (track.state === 'RECORDING') {
                    const tInput = trackInputs[track.id];
                    if (tInput) {
                        const recIdx = (sectionRelative - 1 + sectionLen) % sectionLen;
                        const sd = getOrCreateSectionData(track, this.currentSectionIndex, sectionLen);
                        // Mix down to mono for the record buffer
                        const val = (tInput.length > 1 && track.channelMode === 'stereo')
                            ? (tInput[0][i] + tInput[1][i]) * 0.5
                            : tInput[0][i];

                        if (this.smartSnapWindowSamples + recIdx < sd.recordBuffer.length) {
                            sd.recordBuffer[this.smartSnapWindowSamples + recIdx] += val;
                        }
                    }
                }

                if (track.state === 'RECORDING' && sectionSample === 0) {
                    track.state = 'POST_ROLL';
                    track.postRollSamplesRemaining = this.smartSnapWindowSamples;
                }

                if (track.state === 'POST_ROLL') {
                    const tInput = trackInputs[track.id];
                    if (tInput) {
                        const sd = getOrCreateSectionData(track, this.currentSectionIndex, sectionLen);
                        const postRollIdx = this.smartSnapWindowSamples - track.postRollSamplesRemaining;
                        const writeIdx = this.smartSnapWindowSamples + sectionLen + postRollIdx;
                        if (writeIdx >= 0 && writeIdx < sd.recordBuffer.length) {
                            sd.recordBuffer[writeIdx] += inputChannel[i];
                        }
                    }

                    track.postRollSamplesRemaining--;

                    if (track.postRollSamplesRemaining <= 0) {
                        if (this.smartSnapEnabled) {
                            this.commitLayerWithSmartSnap(track, sectionLen);
                        } else {
                            this.commitLayerStandard(track, sectionLen);
                        }
                    }
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
        // Send UI updates at a fixed interval independent of BPM to avoid skipped updates at odd BPMs.
        // 1024 samples at 44.1kHz / 48kHz provides a stable ~43-46Hz UI loop.
        if (this.currentSample % 1024 === 0 && this.samplesPerBeat > 0) {
            const sectionRelative = this.currentSample - this.sectionSampleOffset;
            const sectionLen2 = this.currentSectionLen();
            const sectionBeat = Math.floor(sectionRelative / this.samplesPerBeat);
            const bar = Math.floor(sectionBeat / 4) + 1;
            const beat = (sectionBeat % 4) + 1;
            const sectionProgress = sectionLen2 > 0 ? (sectionRelative % sectionLen2) / sectionLen2 : 0;
            const currentBar = bar;
            const currentBeat = beat;

            const inputLevels = this.inputSums.map(sum => Math.sqrt(sum / Math.max(1, this.inputCount)));
            this.inputSums.fill(0);
            this.inputCount = 0;

            // Measure jitter (time between process calls is implicit in the host, but we can check drift)
            this.port.postMessage({
                type: 'TICK',
                currentBar,
                currentBeat,
                time: this.currentSample / this.sampleRate,
                currentTime: currentTime,
                jitter: delta, // Report the process-to-process delta
                sectionIndex: this.currentSectionIndex,
                sectionProgress,
                inputLevels,
            });
        }

        return true;
    }
}

registerProcessor('live-looper-processor', LiveLooperProcessor);
