import type { NoiseGateSettings } from '@live-looper/types';
import { BaseEffect } from './BaseEffect';

/**
 * NoiseGateEffect — wraps the `noise-gate-processor` AudioWorklet.
 *
 * Signal flow: input → noiseGate (worklet) → output
 */
export class NoiseGateEffect extends BaseEffect {
    private noiseGate!: AudioWorkletNode;

    buildGraph(): void {
        this.noiseGate = new AudioWorkletNode(this.context, 'noise-gate-processor', {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            channelCount: 2,
            channelCountMode: 'explicit',
            channelInterpretation: 'speakers',
        });

        // Disabled by default until the first update() call
        this.noiseGate.port.postMessage({ type: 'UPDATE_PARAMS', payload: { enabled: false } });

        this.input.connect(this.noiseGate);
        this.noiseGate.connect(this.output);
    }

    update(settings: NoiseGateSettings, _bpm: number): void {
        this.enabled = settings.enabled;
        this.noiseGate.port.postMessage({
            type: 'UPDATE_PARAMS',
            payload: {
                threshold: settings.threshold,
                attack: settings.attack,
                release: settings.release,
                enabled: settings.enabled,
            },
        });
    }
}
