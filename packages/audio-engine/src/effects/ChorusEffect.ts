import type { ChorusSettings } from '@live-looper/types';
import { BaseEffect } from './BaseEffect';

/**
 * ChorusEffect — stereo chorus/doubler using two modulated delay lines.
 *
 * Signal flow:
 *   input ┬──────────────────────────────── chorusDry ──┐
 *         ├─ chorusDelay1 → chorusWet1 → chorusMix ────┤ → chorusOutput → output
 *         └─ chorusDelay2 → chorusWet2 → chorusMix ────┘
 *
 * Two LFOs modulate the delay times for the classic chorusing effect.
 * Voice 2 (chorusDelay2/chorusWet2) is gated off when voices=1.
 */
export class ChorusEffect extends BaseEffect {
    private chorusLfo1!: OscillatorNode;
    private chorusLfo2!: OscillatorNode;
    private chorusLfoGain1!: GainNode;
    private chorusLfoGain2!: GainNode;
    private chorusDelay1!: DelayNode;
    private chorusDelay2!: DelayNode;
    private chorusWet1!: GainNode;
    private chorusWet2!: GainNode;
    private chorusMix!: GainNode;
    private chorusDry!: GainNode;
    private chorusOutput!: GainNode;

    buildGraph(): void {
        // LFO 1
        this.chorusLfo1 = this.context.createOscillator();
        this.chorusLfo1.type = 'sine';
        this.chorusLfo1.frequency.value = 0.5;
        this.chorusLfoGain1 = this.context.createGain();
        this.chorusLfoGain1.gain.value = 0.003; // ±3ms default depth

        // LFO 2 (second voice, slightly detuned)
        this.chorusLfo2 = this.context.createOscillator();
        this.chorusLfo2.type = 'sine';
        this.chorusLfo2.frequency.value = 0.5;
        this.chorusLfoGain2 = this.context.createGain();
        this.chorusLfoGain2.gain.value = 0.003;

        // Delay lines centered at 10ms & 12ms
        this.chorusDelay1 = this.context.createDelay(0.05);
        this.chorusDelay1.delayTime.value = 0.010;
        this.chorusDelay2 = this.context.createDelay(0.05);
        this.chorusDelay2.delayTime.value = 0.012;

        // Per-voice wet gains
        this.chorusWet1 = this.context.createGain();
        this.chorusWet1.gain.value = 0.5;
        this.chorusWet2 = this.context.createGain();
        this.chorusWet2.gain.value = 0; // off until voices=2

        // Master chorus mix (wet blend)
        this.chorusMix = this.context.createGain();
        this.chorusMix.gain.value = 0; // disabled by default

        // Dry path (always passes through)
        this.chorusDry = this.context.createGain();
        this.chorusDry.gain.value = 1;

        // Output summing node
        this.chorusOutput = this.context.createGain();
        this.chorusOutput.gain.value = 1;

        // LFO → delay AudioParams
        this.chorusLfo1.connect(this.chorusLfoGain1);
        this.chorusLfoGain1.connect(this.chorusDelay1.delayTime);
        this.chorusLfo2.connect(this.chorusLfoGain2);
        this.chorusLfoGain2.connect(this.chorusDelay2.delayTime);

        // Start LFOs (effect muted via gain=0 until enabled)
        this.chorusLfo1.start();
        this.chorusLfo2.start();

        // Wet/dry routing
        this.input.connect(this.chorusDry);
        this.input.connect(this.chorusDelay1);
        this.chorusDelay1.connect(this.chorusWet1);
        this.chorusWet1.connect(this.chorusMix);
        this.input.connect(this.chorusDelay2);
        this.chorusDelay2.connect(this.chorusWet2);
        this.chorusWet2.connect(this.chorusMix);

        this.chorusDry.connect(this.chorusOutput);
        this.chorusMix.connect(this.chorusOutput);

        this.chorusOutput.connect(this.output);
    }

    update(settings: ChorusSettings, _bpm: number): void {
        const t = this.context.currentTime + 0.05;
        this.enabled = settings.enabled;

        this.chorusLfo1.frequency.setTargetAtTime(settings.rate, t, 0.02);
        this.chorusLfo2.frequency.setTargetAtTime(settings.rate * 1.05, t, 0.02); // slight detune

        const depthSeconds = settings.depth * 0.008; // 0-1 → ±1ms–±8ms
        this.chorusLfoGain1.gain.setTargetAtTime(depthSeconds, t, 0.02);
        this.chorusLfoGain2.gain.setTargetAtTime(depthSeconds, t, 0.02);

        const wetLevel = settings.enabled ? settings.mix : 0;
        this.chorusMix.gain.setTargetAtTime(wetLevel, t, 0.02);

        // Voice 2 only active when voices=2
        this.chorusWet2.gain.setTargetAtTime(
            settings.enabled && settings.voices === 2 ? 1 : 0,
            t, 0.02,
        );
    }
}
