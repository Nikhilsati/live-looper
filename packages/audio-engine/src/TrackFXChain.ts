import type { FXState } from "@live-looper/types";
import {
  BaseEffect,
  NoiseGateEffect,
  EQEffect,
  CompressorEffect,
  DriveEffect,
  ChorusEffect,
  PhaserEffect,
  TremoloEffect,
  DelayEffect,
  ReverbEffect,
  PanEffect,
} from "./effects";

/**
 * TrackFXChain — thin orchestrator for the serial audio effect chain.
 *
 * Responsibilities:
 *   1. Instantiate each effect.
 *   2. Wire them in order: this.input → effects[0] → … → effects[n] → this.output
 *   3. Delegate update() calls to each effect's own handler.
 *
 * Adding, removing, or reordering effects is O(n) — call reorder() with a
 * new array of the same effect instances and the chain rewires itself.
 */
export class TrackFXChain {
  /** Chain-level input trim. Connect the audio source here. */
  public input: GainNode;

  /** Chain-level output. Connect this to the next destination. */
  public output: GainNode;

  // ── Effect instances ────────────────────────────────────────────────────
  public readonly noiseGate: NoiseGateEffect;
  public readonly eq: EQEffect;
  public readonly compressor: CompressorEffect;
  public readonly drive: DriveEffect;
  public readonly chorus: ChorusEffect;
  public readonly phaser: PhaserEffect;
  public readonly tremolo: TremoloEffect;
  public readonly delay: DelayEffect;
  public readonly reverb: ReverbEffect;
  public readonly pan: PanEffect;

  /** Ordered effect array — the serial processing chain. */
  private effects: BaseEffect[];

  constructor(context: AudioContext) {
    this.input = context.createGain();
    this.output = context.createGain();

    // Instantiate effects
    this.noiseGate = new NoiseGateEffect(context);
    this.eq = new EQEffect(context);
    this.compressor = new CompressorEffect(context);
    this.drive = new DriveEffect(context);
    this.chorus = new ChorusEffect(context);
    this.phaser = new PhaserEffect(context);
    this.tremolo = new TremoloEffect(context);
    this.delay = new DelayEffect(context);
    this.reverb = new ReverbEffect(context);
    this.pan = new PanEffect(context);

    // Default signal chain order
    this.effects = [
      this.noiseGate,
      this.eq,
      this.compressor,
      this.drive,
      this.chorus,
      this.phaser,
      this.tremolo,
      this.delay,
      this.reverb,
      this.pan,
    ];

    this.wireChain();
  }

  /**
   * Wire the effects array serially:
   *   this.input → effects[0].input → effects[0].output → effects[1].input → … → this.output
   *
   * Call after any reorder().
   */
  private wireChain(): void {
    // Disconnect existing wiring
    this.input.disconnect();
    for (const effect of this.effects) {
      effect.disconnectOutput();
    }

    if (this.effects.length === 0) {
      this.input.connect(this.output);
      return;
    }

    // Chain input → first effect
    this.input.connect(this.effects[0].input);

    // Connect each effect to the next
    for (let i = 0; i < this.effects.length - 1; i++) {
      this.effects[i].connectTo(this.effects[i + 1]);
    }

    // Last effect → chain output
    this.effects[this.effects.length - 1].connectTo(this.output);
  }

  /**
   * Reorder the effects in the chain.
   *
   * Pass a new ordering of the same effect instances.  The chain is
   * fully rewired without allocating any new nodes.
   *
   * @example
   * // Move reverb before delay
   * chain.reorder([
   *   chain.noiseGate, chain.eq, chain.compressor, chain.drive,
   *   chain.chorus, chain.phaser, chain.reverb, chain.delay, chain.pan,
   * ]);
   */
  reorder(newOrder: BaseEffect[]): void {
    this.effects = newOrder;
    this.wireChain();
  }

  /**
   * Apply FX state to every effect in the chain.
   * Each effect's update() handles its own parameter scheduling;
   * effects that need structural rewiring (Delay mode, Phaser stages)
   * do so internally without touching the chain.
   */
  update(state: FXState, bpm: number): void {
    this.noiseGate.update(state.noiseGate, bpm);
    this.eq.update(state.eq, bpm);
    this.compressor.update(state.compressor, bpm);
    this.drive.update(state.drive, bpm);
    this.chorus.update(state.chorus, bpm);
    this.phaser.update(state.phaser, bpm);
    this.tremolo.update(state.tremolo, bpm);
    this.delay.update(state.delay, bpm);
    this.reverb.update(state.reverb, bpm);
    this.pan.update(state.pan, bpm);
  }
}
