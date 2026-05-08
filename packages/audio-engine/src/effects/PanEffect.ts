import { BaseEffect } from './BaseEffect';

/**
 * PanEffect — stereo panner.  Sits at the end of the chain.
 *
 * Signal flow: input → panner → output
 */
export class PanEffect extends BaseEffect {
    private panner!: StereoPannerNode;

    buildGraph(): void {
        this.panner = this.context.createStereoPanner();
        this.input.connect(this.panner);
        this.panner.connect(this.output);
    }

    update(panValue: number, _bpm: number): void {
        const t = this.context.currentTime + 0.05;
        this.panner.pan.setTargetAtTime(panValue, t, 0.02);
    }
}
