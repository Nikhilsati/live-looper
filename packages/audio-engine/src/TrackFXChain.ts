import type { FXState } from "@live-looper/types";
import {
  BaseEffect,
} from "./effects";
import { EffectRegistry } from "./effects/EffectRegistry";

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

  /** Map of effect ID to instantiated BaseEffect */
  public readonly activeEffects = new Map<string, BaseEffect>();

  /** Ordered effect array — the serial processing chain. */
  private effects: BaseEffect[] = [];

  constructor(context: AudioContext) {
    this.input = context.createGain();
    this.output = context.createGain();

    // Instantiate effects dynamically
    const definitions = EffectRegistry.getAll();
    for (const def of definitions) {
      const instance = def.createNode(context);
      this.activeEffects.set(def.id, instance);
      this.effects.push(instance);
    }

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
   * // Move reverb before delay (assuming IDs map to instances)
   * chain.reorder([
   *   chain.activeEffects.get("reverb"),
   *   chain.activeEffects.get("delay"),
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
    for (const [id, effect] of Array.from(this.activeEffects.entries())) {
      if (state[id] !== undefined) {
        effect.update(state[id], bpm);
      }
    }
  }
}
