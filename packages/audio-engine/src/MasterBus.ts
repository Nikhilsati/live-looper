export class MasterBus {
  public input: GainNode;
  public output: GainNode;

  private glueCompressor: DynamicsCompressorNode;
  private limiter: DynamicsCompressorNode;

  constructor(context: AudioContext, destination?: AudioNode) {
    this.input = context.createGain();
    this.output = context.createGain();

    // Glue Compressor
    this.glueCompressor = context.createDynamicsCompressor();
    this.glueCompressor.threshold.value = -12;
    this.glueCompressor.ratio.value = 2;
    this.glueCompressor.attack.value = 0.03;
    this.glueCompressor.release.value = 0.1;

    // Limiter
    this.limiter = context.createDynamicsCompressor();
    this.limiter.threshold.value = -0.5;
    this.limiter.ratio.value = 20;
    this.limiter.attack.value = 0.001;
    this.limiter.release.value = 0.1;

    // Routing
    this.input.connect(this.glueCompressor);
    this.glueCompressor.connect(this.limiter);
    this.limiter.connect(this.output);
    if (destination) {
      this.output.connect(destination);
    } else {
      this.output.connect(context.destination);
    }
  }

  update() {
    // Future: update master parameters if needed
  }
}
