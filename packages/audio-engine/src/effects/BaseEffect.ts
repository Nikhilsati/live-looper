/**
 * BaseEffect — abstract foundation for all audio effects in the FX chain.
 *
 * Every effect exposes a standard `input` and `output` GainNode so the chain
 * can wire them serially: chain.input → effect[0].input … effect[n].output → chain.output
 *
 * The `input` node doubles as an input-trim gain and the `output` node as an
 * output-trim gain, giving each effect independent level control without
 * needing extra nodes in the chain.
 */
export abstract class BaseEffect {
  protected context: AudioContext;

  /** Entry point — receives audio from the previous node in the chain. */
  readonly input: GainNode;

  /** Exit point — feeds audio into the next node in the chain. */
  readonly output: GainNode;

  /** Whether this effect is processing (implementations should bypass when false). */
  protected enabled: boolean = true;

  /**
   * Wet/dry blend: 0 = fully dry (pass-through), 1 = fully wet.
   * Concrete effects apply this in their own way (e.g. via a mix GainNode).
   */
  protected mix: number = 1;

  constructor(context: AudioContext) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
    this.buildGraph();
  }

  /**
   * Wire all internal DSP nodes between `this.input` and `this.output`.
   * Called once in the constructor. Re-call when the internal graph needs
   * structural changes (e.g. Delay mode change, Phaser stage change).
   */
  abstract buildGraph(): void;

  /**
   * Apply updated parameters. `settings` is typed by each concrete class;
   * the base signature uses `unknown` so the method can be invoked uniformly
   * from the chain orchestrator.
   */
  abstract update(settings: unknown, bpm: number): void;

  /**
   * Connect this effect's output to the next node in the chain.
   * Call once after the graph is built (or after a rebuildGraph).
   */
  connectTo(next: BaseEffect | AudioNode): void {
    this.output.connect(next instanceof BaseEffect ? next.input : next);
  }

  /**
   * Fully disconnect the output node.  Call before rewiring or disposing.
   */
  disconnectOutput(): void {
    this.output.disconnect();
  }
}
