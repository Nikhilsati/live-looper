// @ts-nocheck
class NoiseGateProcessor extends AudioWorkletProcessor {
  private attack: number = 0.01;
  private release: number = 0.1;
  private threshold: number = 0; // linear
  private enabled: boolean = false;

  // Envelope follower state
  private envelope: number = 0;
  private gain: number = 1;
  private sampleRate: number = 44100;

  constructor(options: AudioWorkletNodeOptions) {
    super();
    this.sampleRate = options.processorOptions?.sampleRate || 44100;

    this.port.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === "UPDATE_PARAMS") {
        this.attack = Math.max(0.001, payload.attack ?? this.attack);
        this.release = Math.max(0.001, payload.release ?? this.release);
        const thresholdDB = payload.threshold ?? -100;
        this.threshold = Math.pow(10, thresholdDB / 20);
        this.enabled = payload.enabled ?? this.enabled;
      }
    };
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ) {
    const input = inputs[0];
    const output = outputs[0];

    if (!input || !output || input.length === 0) return true;

    if (!this.enabled) {
      // Bypass
      for (let channel = 0; channel < input.length; channel++) {
        const inChannel = input[channel];
        const outChannel = output[channel];
        if (outChannel && inChannel) {
          outChannel.set(inChannel);
        }
      }
      return true;
    }

    const dt = 1.0 / this.sampleRate;
    const attackCoef = Math.exp(-dt / this.attack);
    const releaseCoef = Math.exp(-dt / this.release);

    const numChannels = input.length;
    const numSamples = input[0].length;

    for (let i = 0; i < numSamples; i++) {
      let maxAbs = 0;
      for (let ch = 0; ch < numChannels; ch++) {
        const val = Math.abs(input[ch][i]);
        if (val > maxAbs) {
          maxAbs = val;
        }
      }

      if (maxAbs > this.envelope) {
        this.envelope = attackCoef * this.envelope + (1 - attackCoef) * maxAbs;
      } else {
        this.envelope =
          releaseCoef * this.envelope + (1 - releaseCoef) * maxAbs;
      }

      let targetGain = this.envelope >= this.threshold ? 1.0 : 0.0;

      if (targetGain > this.gain) {
        this.gain = attackCoef * this.gain + (1 - attackCoef) * targetGain;
      } else {
        this.gain = releaseCoef * this.gain + (1 - releaseCoef) * targetGain;
      }

      for (let ch = 0; ch < numChannels; ch++) {
        if (output[ch]) {
          output[ch][i] = input[ch][i] * this.gain;
        }
      }
    }

    return true;
  }
}

registerProcessor("noise-gate-processor", NoiseGateProcessor);
