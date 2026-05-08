import type { ReverbSettings } from '@live-looper/types';
import { BaseEffect } from './BaseEffect';

/**
 * ReverbEffect — algorithmic convolution reverb with pre-delay and damping.
 *
 * Signal flow:
 *   input ─────────────────────────────────────── afterReverb (dry) ──► output
 *         └─► reverbPredelay → reverb → damping → reverbMix ──────────► afterReverb
 */
export class ReverbEffect extends BaseEffect {
    private reverb!: ConvolverNode;
    private reverbPredelay!: DelayNode;
    private reverbDamping!: BiquadFilterNode;
    private reverbMix!: GainNode;
    private afterReverb!: GainNode;

    buildGraph(): void {
        this.reverb = this.context.createConvolver();
        this.reverb.buffer = this.createImpulseResponse(1.5, 4.0);

        this.reverbPredelay = this.context.createDelay(0.5);
        this.reverbPredelay.delayTime.value = 0;

        this.reverbDamping = this.context.createBiquadFilter();
        this.reverbDamping.type = 'lowpass';
        this.reverbDamping.frequency.value = 20000;

        this.reverbMix = this.context.createGain();
        this.reverbMix.gain.value = 0; // disabled by default

        this.afterReverb = this.context.createGain();
        this.afterReverb.gain.value = 1;

        // Dry path through afterReverb
        this.input.connect(this.afterReverb);
        // Wet path
        this.input.connect(this.reverbPredelay);
        this.reverbPredelay.connect(this.reverb);
        this.reverb.connect(this.reverbDamping);
        this.reverbDamping.connect(this.reverbMix);
        this.reverbMix.connect(this.afterReverb);

        this.afterReverb.connect(this.output);
    }

    update(settings: ReverbSettings, _bpm: number): void {
        const t = this.context.currentTime + 0.05;
        this.enabled = settings.enabled;

        this.reverbMix.gain.setTargetAtTime(settings.enabled ? settings.mix : 0, t, 0.02);
        this.reverbPredelay.delayTime.setTargetAtTime(settings.predelay / 1000, t, 0.02);

        const dampingFreq = 1000 + settings.damping * 19000;
        this.reverbDamping.frequency.setTargetAtTime(dampingFreq, t, 0.02);

        // Regenerate impulse response when size changes significantly
        const currentDuration = this.reverb.buffer?.duration ?? 1.5;
        if (Math.abs(settings.size - currentDuration) > 0.05) {
            this.reverb.buffer = this.createImpulseResponse(settings.size, 4.0);
        }
    }

    private createImpulseResponse(duration: number, decay: number): AudioBuffer {
        const sampleRate = this.context.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.context.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const n = i / length;
            const envelope = Math.pow(1 - n, decay);
            left[i] = (Math.random() * 2 - 1) * envelope;
            right[i] = (Math.random() * 2 - 1) * envelope;
        }
        return impulse;
    }
}
