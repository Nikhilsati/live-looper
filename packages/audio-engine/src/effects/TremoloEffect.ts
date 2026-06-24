import type { TremoloSettings } from "@live-looper/types";
import { BaseEffect } from "./BaseEffect";

/**
 * TremoloEffect — amplitude modulation using an LFO.
 *
 * Signal flow:
 *   input → tremoloGain → output
 *
 * tremoloGain's gain is modulated by a sine wave LFO configured by rate and depth.
 * depth controls the range of the amplitude swing.
 */
export class TremoloEffect extends BaseEffect {
  private lfo!: OscillatorNode;
  private lfoGain!: GainNode;
  private tremoloGain!: GainNode;

  buildGraph(): void {
    // LFO for modulation
    this.lfo = this.context.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.value = 5.0; // default rate

    // LFO Gain (controls depth)
    this.lfoGain = this.context.createGain();
    this.lfoGain.gain.value = 0.0; // default depth (0.0 means bypassed/disabled initially)

    // The target Gain node for amplitude modulation
    this.tremoloGain = this.context.createGain();
    // Base gain. When modulated, the value will oscillate around 1 or below it.
    // If lfo is -1 to 1, and depth is D, then lfoGain outputs -D to D.
    // We set tremoloGain.gain.value = 1.0 - D/2, and modulate it by D/2
    // Or simply we set the oscillator to control a portion of the gain
    // Let's set it up simply:
    this.tremoloGain.gain.value = 1.0;

    // Routing
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.tremoloGain.gain);

    this.input.connect(this.tremoloGain);
    this.tremoloGain.connect(this.output);

    this.lfo.start();
  }

  update(settings: TremoloSettings, _bpm: number): void {
    const t = this.context.currentTime + 0.05;
    this.enabled = settings.enabled;

    this.lfo.frequency.setTargetAtTime(settings.rate, t, 0.02);

    // When enabled, adjust depth.
    // If depth = 1, we want gain to go from 0 to 1, so base = 0.5, mod = 0.5
    // If depth = 0, gain goes from 1 to 1, base = 1.0, mod = 0.0
    // base = 1.0 - (depth / 2)
    // mod = depth / 2

    if (settings.enabled) {
      const modAmp = settings.depth / 2;
      const baseAmp = 1.0 - modAmp;

      this.tremoloGain.gain.setTargetAtTime(baseAmp, t, 0.02);
      this.lfoGain.gain.setTargetAtTime(modAmp, t, 0.02);
    } else {
      // Bypass mode
      this.tremoloGain.gain.setTargetAtTime(1.0, t, 0.02);
      this.lfoGain.gain.setTargetAtTime(0, t, 0.02);
    }
  }
}
