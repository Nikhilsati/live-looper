import type { PhaserSettings } from '@live-looper/types';
import { BaseEffect } from './BaseEffect';

/**
 * PhaserEffect — allpass-chain phaser with LFO sweep and feedback.
 *
 * Signal flow:
 *   input ─► phaserFeedbackInput ─► ap1 [─► ap2 ─► ap3 ─► ap4] ─► phaserWet ─► phaserOutput ─► output
 *                 ▲                            └──────────────── phaserFeedback ──┘
 *   input ──────── phaserDry ─────────────────────────────────────► phaserOutput
 *
 * Stage count (2 or 4) can change — handled internally by disconnecting and
 * reconnecting just the allpass chain, without touching any other effect.
 */
export class PhaserEffect extends BaseEffect {
    private phaserLfo!: OscillatorNode;
    private phaserLfoGain!: GainNode;
    private phaserAp1!: BiquadFilterNode;
    private phaserAp2!: BiquadFilterNode;
    private phaserAp3!: BiquadFilterNode;
    private phaserAp4!: BiquadFilterNode;
    private phaserFeedback!: GainNode;
    private phaserFeedbackInput!: GainNode;
    private phaserWet!: GainNode;
    private phaserDry!: GainNode;
    private phaserOutput!: GainNode;

    private currentStages: 2 | 4 = 4;

    buildGraph(): void {
        // LFO
        this.phaserLfo = this.context.createOscillator();
        this.phaserLfo.type = 'sine';
        this.phaserLfo.frequency.value = 0.5;

        this.phaserLfoGain = this.context.createGain();
        this.phaserLfoGain.gain.value = 1000; // depth 0-1 → ±1000Hz sweep

        // 4 allpass stages
        const makeAp = (freq: number): BiquadFilterNode => {
            const f = this.context.createBiquadFilter();
            f.type = 'allpass';
            f.frequency.value = freq;
            return f;
        };
        this.phaserAp1 = makeAp(1000);
        this.phaserAp2 = makeAp(1500);
        this.phaserAp3 = makeAp(2000);
        this.phaserAp4 = makeAp(2500);

        // LFO → each allpass frequency param
        this.phaserLfo.connect(this.phaserLfoGain);
        this.phaserLfoGain.connect(this.phaserAp1.frequency);
        this.phaserLfoGain.connect(this.phaserAp2.frequency);
        this.phaserLfoGain.connect(this.phaserAp3.frequency);
        this.phaserLfoGain.connect(this.phaserAp4.frequency);

        // Feedback
        this.phaserFeedback = this.context.createGain();
        this.phaserFeedback.gain.value = 0.5;
        this.phaserFeedbackInput = this.context.createGain();
        this.phaserFeedbackInput.gain.value = 1;

        // Wet / dry / output
        this.phaserWet = this.context.createGain();
        this.phaserWet.gain.value = 0; // disabled by default
        this.phaserDry = this.context.createGain();
        this.phaserDry.gain.value = 1;
        this.phaserOutput = this.context.createGain();
        this.phaserOutput.gain.value = 1;

        this.phaserLfo.start();

        // Wire allpass chain with current stage count
        this.wireAllpassChain(this.currentStages);

        // Dry path
        this.input.connect(this.phaserDry);
        this.phaserDry.connect(this.phaserOutput);
        this.phaserWet.connect(this.phaserOutput);
        this.phaserOutput.connect(this.output);
    }

    private wireAllpassChain(stages: 2 | 4): void {
        // Disconnect previous allpass wiring — guard for first call (nodes not yet connected)
        try { this.input.disconnect(this.phaserFeedbackInput); } catch { /* first call */ }
        try { this.phaserFeedbackInput.disconnect(); } catch { /* first call */ }
        try { this.phaserAp1.disconnect(); } catch { /* first call */ }
        try { this.phaserAp2.disconnect(); } catch { /* first call */ }
        try { this.phaserAp3.disconnect(); } catch { /* first call */ }
        try { this.phaserAp4.disconnect(); } catch { /* first call */ }
        try { this.phaserFeedback.disconnect(); } catch { /* first call */ }

        this.input.connect(this.phaserFeedbackInput);

        if (stages === 4) {
            this.phaserFeedbackInput.connect(this.phaserAp1);
            this.phaserAp1.connect(this.phaserAp2);
            this.phaserAp2.connect(this.phaserAp3);
            this.phaserAp3.connect(this.phaserAp4);
            this.phaserAp4.connect(this.phaserFeedback);
            this.phaserFeedback.connect(this.phaserFeedbackInput);
            this.phaserAp4.connect(this.phaserWet);
        } else {
            this.phaserFeedbackInput.connect(this.phaserAp1);
            this.phaserAp1.connect(this.phaserAp2);
            this.phaserAp2.connect(this.phaserFeedback);
            this.phaserFeedback.connect(this.phaserFeedbackInput);
            this.phaserAp2.connect(this.phaserWet);
        }

        this.currentStages = stages;
    }

    update(settings: PhaserSettings, _bpm: number): void {
        const t = this.context.currentTime + 0.05;
        this.enabled = settings.enabled;

        this.phaserLfo.frequency.setTargetAtTime(settings.rate, t, 0.02);

        const sweepHz = settings.depth * 3000;
        this.phaserLfoGain.gain.setTargetAtTime(sweepHz, t, 0.02);

        this.phaserFeedback.gain.setTargetAtTime(settings.feedback, t, 0.02);

        this.phaserWet.gain.setTargetAtTime(settings.enabled ? 1 : 0, t, 0.02);

        const newStages = settings.stages ?? 4;
        if (newStages !== this.currentStages) {
            this.wireAllpassChain(newStages);
        }
    }
}
