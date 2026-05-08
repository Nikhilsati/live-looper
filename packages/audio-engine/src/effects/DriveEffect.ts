import type { DriveSettings } from '@live-looper/types';
import { BaseEffect } from './BaseEffect';

/**
 * DriveEffect — waveshaper-based saturation/distortion with a tone shelf.
 *
 * Signal flow: input → drive (WaveShaper) → driveGain → driveTone → output
 */
export class DriveEffect extends BaseEffect {
    private drive!: WaveShaperNode;
    private driveGain!: GainNode;
    private driveTone!: BiquadFilterNode;

    buildGraph(): void {
        this.drive = this.context.createWaveShaper();
        this.drive.curve = this.makeDistortionCurve(0) as Float32Array<ArrayBuffer>;

        this.driveGain = this.context.createGain();

        this.driveTone = this.context.createBiquadFilter();
        this.driveTone.type = 'highshelf';
        this.driveTone.frequency.value = 3500;
        this.driveTone.gain.value = 0;

        this.input.connect(this.drive);
        this.drive.connect(this.driveGain);
        this.driveGain.connect(this.driveTone);
        this.driveTone.connect(this.output);
    }

    update(settings: DriveSettings, _bpm: number): void {
        const t = this.context.currentTime + 0.05;
        this.drive.curve = this.makeDistortionCurve(settings.enabled ? settings.amount : 0) as Float32Array<ArrayBuffer>;
        this.driveGain.gain.setTargetAtTime(1, t, 0.02);
        const toneDbGain = (settings.tone - 1) * 24;
        this.driveTone.gain.setTargetAtTime(toneDbGain, t, 0.02);
        this.enabled = settings.enabled;
    }

    private makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
        const k = amount * 100;
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }
}
