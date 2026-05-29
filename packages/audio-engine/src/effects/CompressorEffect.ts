import type { CompressorSettings } from "@live-looper/types";
import { BaseEffect } from "./BaseEffect";

/**
 * CompressorEffect — DynamicsCompressor with threshold, ratio, attack, release.
 *
 * Signal flow: input → compressor → output
 */
export class CompressorEffect extends BaseEffect {
  private compressor!: DynamicsCompressorNode;

  buildGraph(): void {
    this.compressor = this.context.createDynamicsCompressor();
    this.input.connect(this.compressor);
    this.compressor.connect(this.output);
  }

  update(settings: CompressorSettings, _bpm: number): void {
    const t = this.context.currentTime + 0.05;
    this.compressor.threshold.setTargetAtTime(settings.threshold, t, 0.02);
    this.compressor.ratio.setTargetAtTime(settings.ratio, t, 0.02);
    this.compressor.attack.setTargetAtTime(settings.attack, t, 0.02);
    this.compressor.release.setTargetAtTime(settings.release, t, 0.02);
  }
}
