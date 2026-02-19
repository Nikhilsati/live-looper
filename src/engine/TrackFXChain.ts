import type { FXState } from '../types';

export class TrackFXChain {
    private context: AudioContext;
    public input: GainNode;
    public output: GainNode;

    // Nodes
    private eqLow: BiquadFilterNode;
    private eqMid: BiquadFilterNode;
    private eqHigh: BiquadFilterNode;
    private compressor: DynamicsCompressorNode;
    private drive: WaveShaperNode;
    private driveGain: GainNode;
    private delay: DelayNode;
    private delayFeedback: GainNode;
    private delayMix: GainNode;
    private reverb: ConvolverNode;
    private reverbMix: GainNode;
    private panner: StereoPannerNode;

    constructor(context: AudioContext) {
        this.context = context;
        this.input = context.createGain();
        this.output = context.createGain();

        // EQ
        this.eqLow = context.createBiquadFilter();
        this.eqLow.type = 'lowshelf';
        this.eqMid = context.createBiquadFilter();
        this.eqMid.type = 'peaking';
        this.eqHigh = context.createBiquadFilter();
        this.eqHigh.type = 'highshelf';

        // Compressor
        this.compressor = context.createDynamicsCompressor();

        // Drive (WaveShaper)
        this.drive = context.createWaveShaper();
        this.drive.curve = this.makeDistortionCurve(0);
        this.driveGain = context.createGain();

        // Delay
        this.delay = context.createDelay(2.0);
        this.delayFeedback = context.createGain();
        this.delayMix = context.createGain();
        this.delayMix.gain.value = 0;

        // Reverb
        this.reverb = context.createConvolver();
        this.reverb.buffer = this.createImpulseResponse(1.5, 4.0);
        this.reverbMix = context.createGain();
        this.reverbMix.gain.value = 0;

        // Panner
        this.panner = context.createStereoPanner();

        // Routing: input -> EQ Low -> EQ Mid -> EQ High -> Compressor -> Drive Gain -> Panner -> Output
        // Parallel paths for Delay and Reverb handled within the chain

        this.input.connect(this.eqLow);
        this.eqLow.connect(this.eqMid);
        this.eqMid.connect(this.eqHigh);
        this.eqHigh.connect(this.compressor);

        // Sub-chain: Drive
        this.compressor.connect(this.drive);
        this.drive.connect(this.driveGain);
        this.driveGain.connect(this.panner);

        // Sub-chain: Delay (Parallel Wet)
        this.compressor.connect(this.delay);
        this.delay.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delay);
        this.delay.connect(this.delayMix);
        this.delayMix.connect(this.panner);

        // Sub-chain: Reverb (Parallel Wet)
        this.panner.connect(this.reverb); // Reverb is usually after delay/pan or before pan? PRD says before pan.
        // Let's follow PRD order: Drive -> Delay -> Reverb -> Pan

        // Wait, current routing is a bit messy. Let's fix to match PRD:
        // EQ -> Compressor -> Drive -> Delay -> Reverb -> Pan -> Track Gain

        this.rebuildRouting();

        this.panner.connect(this.output);
    }

    private rebuildRouting() {
        // Disconnect everything first
        this.input.disconnect();
        this.eqLow.disconnect();
        this.eqMid.disconnect();
        this.eqHigh.disconnect();
        this.compressor.disconnect();
        this.drive.disconnect();
        this.driveGain.disconnect();
        this.delay.disconnect();
        this.delayFeedback.disconnect();
        this.delayMix.disconnect();
        this.reverb.disconnect();
        this.reverbMix.disconnect();
        this.panner.disconnect();

        // Linear Chain
        this.input.connect(this.eqLow);
        this.eqLow.connect(this.eqMid);
        this.eqMid.connect(this.eqHigh);
        this.eqHigh.connect(this.compressor);

        // Drive stage (Always in line, amount 0 = clean)
        this.compressor.connect(this.drive);
        this.drive.connect(this.driveGain);

        // Delay (Parallel Mix)
        this.driveGain.connect(this.panner); // Dry

        // Delay Path
        this.driveGain.connect(this.delay);
        this.delay.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delay);
        this.delay.connect(this.delayMix);
        this.delayMix.connect(this.panner); // Wet delay

        // Reverb Path (Connected after panner or before? PRD says Reverb then Pan)
        // Let's do Reverb before Pan as per PRD diagram.

        // Wait, PRD Diagram:
        // Drive -> Modulation -> Delay -> Reverb -> Pan

        // Let's re-route:
        this.input.disconnect();
        this.input.connect(this.eqLow);
        this.eqLow.connect(this.eqMid);
        this.eqMid.connect(this.eqHigh);
        this.eqHigh.connect(this.compressor);
        this.compressor.connect(this.drive);
        this.drive.connect(this.driveGain);

        // Delay stage
        const beforeDelay = this.driveGain;
        const afterDelay = this.context.createGain(); // Intermediate junction
        beforeDelay.connect(afterDelay); // Dry
        beforeDelay.connect(this.delay);
        this.delay.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delay);
        this.delay.connect(this.delayMix);
        this.delayMix.connect(afterDelay); // Wet

        // Reverb stage
        const beforeReverb = afterDelay;
        const afterReverb = this.context.createGain(); // Intermediate junction
        beforeReverb.connect(afterReverb); // Dry
        beforeReverb.connect(this.reverb);
        this.reverb.connect(this.reverbMix);
        this.reverbMix.connect(afterReverb); // Wet

        // Final Pan and Output
        afterReverb.connect(this.panner);
        this.panner.connect(this.output);
    }

    update(state: FXState, bpm: number) {
        const t = this.context.currentTime + 0.05;

        // EQ
        this.eqLow.gain.setTargetAtTime(state.eq.low, t, 0.02);
        this.eqMid.gain.setTargetAtTime(state.eq.mid, t, 0.02);
        this.eqMid.frequency.setTargetAtTime(state.eq.midFreq, t, 0.02);
        this.eqHigh.gain.setTargetAtTime(state.eq.high, t, 0.02);

        // Compressor
        this.compressor.threshold.setTargetAtTime(state.compressor.threshold, t, 0.02);
        this.compressor.ratio.setTargetAtTime(state.compressor.ratio, t, 0.02);
        this.compressor.attack.setTargetAtTime(state.compressor.attack, t, 0.02);
        this.compressor.release.setTargetAtTime(state.compressor.release, t, 0.02);
        // Note: DynamicsCompressorNode doesn't have a makeup gain parameter directly, 
        // we'd need a gain node after it if we want makeup gain.

        // Drive
        if (state.drive.enabled) {
            this.drive.curve = this.makeDistortionCurve(state.drive.amount);
            this.driveGain.gain.setTargetAtTime(1, t, 0.02);
        } else {
            this.driveGain.gain.setTargetAtTime(1, t, 0.02);
            this.drive.curve = this.makeDistortionCurve(0);
        }

        // Delay
        const secondsPerBeat = 60 / bpm;
        const delayTime = state.delay.time * secondsPerBeat;
        this.delay.delayTime.setTargetAtTime(delayTime, t, 0.02);
        this.delayFeedback.gain.setTargetAtTime(state.delay.feedback, t, 0.02);
        this.delayMix.gain.setTargetAtTime(state.delay.enabled ? state.delay.mix : 0, t, 0.02);

        // Reverb
        this.reverbMix.gain.setTargetAtTime(state.reverb.enabled ? state.reverb.mix : 0, t, 0.02);

        // Pan
        this.panner.pan.setTargetAtTime(state.pan, t, 0.02);
    }

    private makeDistortionCurve(amount: number) {
        const k = amount * 100;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; i++) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    private createImpulseResponse(duration: number, decay: number) {
        const sampleRate = this.context.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.context.createBuffer(2, length, sampleRate);
        const leftArr = impulse.getChannelData(0);
        const rightArr = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const n = i / length;
            const envelope = Math.pow(1 - n, decay);
            leftArr[i] = (Math.random() * 2 - 1) * envelope;
            rightArr[i] = (Math.random() * 2 - 1) * envelope;
        }
        return impulse;
    }
}
