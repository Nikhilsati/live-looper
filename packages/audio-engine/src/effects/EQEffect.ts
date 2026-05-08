import type { EQSettings } from '@live-looper/types';
import { BaseEffect } from './BaseEffect';

/**
 * EQEffect — 3-band parametric EQ (low shelf, peaking mid, high shelf).
 *
 * Signal flow: input → eqLow → eqMid → eqHigh → output
 */
export class EQEffect extends BaseEffect {
    private eqLow!: BiquadFilterNode;
    private eqMid!: BiquadFilterNode;
    private eqHigh!: BiquadFilterNode;

    buildGraph(): void {
        this.eqLow = this.context.createBiquadFilter();
        this.eqLow.type = 'lowshelf';

        this.eqMid = this.context.createBiquadFilter();
        this.eqMid.type = 'peaking';

        this.eqHigh = this.context.createBiquadFilter();
        this.eqHigh.type = 'highshelf';

        this.input.connect(this.eqLow);
        this.eqLow.connect(this.eqMid);
        this.eqMid.connect(this.eqHigh);
        this.eqHigh.connect(this.output);
    }

    update(settings: EQSettings, _bpm: number): void {
        const t = this.context.currentTime + 0.05;
        this.eqLow.gain.setTargetAtTime(settings.low, t, 0.02);
        this.eqMid.gain.setTargetAtTime(settings.mid, t, 0.02);
        this.eqMid.frequency.setTargetAtTime(settings.midFreq, t, 0.02);
        this.eqHigh.gain.setTargetAtTime(settings.high, t, 0.02);
    }
}
