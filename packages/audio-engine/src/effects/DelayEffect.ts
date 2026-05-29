import type { DelaySettings } from "@live-looper/types";
import { BaseEffect } from "./BaseEffect";

/**
 * DelayEffect — tempo-synced delay supporting mono and ping-pong modes.
 *
 * Mono:
 *   input → delay → feedbackFilter → feedback ─┐
 *                └─────────────────────────────┘
 *   delay → delayMix → afterDelay → output
 *   input → afterDelay (dry)
 *
 * Ping-pong:
 *   input → panL → delay → feedbackFilter → feedback → panR → delayR → feedbackR ─┐
 *                                                                └──────────────────┘
 *   delay + delayR → delayMix → afterDelay → output
 *   input → afterDelay (dry)
 *
 * Mode changes are handled internally via `rewireForMode()`.
 */
export class DelayEffect extends BaseEffect {
  private delay!: DelayNode;
  private delayR!: DelayNode;
  private delayFeedback!: GainNode;
  private delayFeedbackR!: GainNode;
  private delayFeedbackFilter!: BiquadFilterNode;
  private delayPanL!: StereoPannerNode;
  private delayPanR!: StereoPannerNode;
  private delayMix!: GainNode;
  private afterDelay!: GainNode;

  private currentMode: "mono" | "pingpong" = "mono";

  buildGraph(): void {
    this.delay = this.context.createDelay(2.0);
    this.delayR = this.context.createDelay(2.0);

    this.delayFeedback = this.context.createGain();
    this.delayFeedback.gain.value = 0;
    this.delayFeedbackR = this.context.createGain();
    this.delayFeedbackR.gain.value = 0;

    this.delayFeedbackFilter = this.context.createBiquadFilter();
    this.delayFeedbackFilter.type = "lowpass";
    this.delayFeedbackFilter.frequency.value = 20000;

    this.delayPanL = this.context.createStereoPanner();
    this.delayPanL.pan.value = -1;
    this.delayPanR = this.context.createStereoPanner();
    this.delayPanR.pan.value = 1;

    this.delayMix = this.context.createGain();
    this.delayMix.gain.value = 0; // disabled by default

    this.afterDelay = this.context.createGain();
    this.afterDelay.gain.value = 1;

    // Wire for initial mode
    this.rewireForMode(this.currentMode);

    this.afterDelay.connect(this.output);
  }

  private rewireForMode(mode: "mono" | "pingpong"): void {
    // Tear down delay-internal connections.
    // Guards needed: on first call from buildGraph() these aren't connected yet.
    try {
      this.input.disconnect(this.afterDelay);
    } catch {
      /* first call */
    }
    try {
      this.input.disconnect(this.delay);
    } catch {
      /* not connected */
    }
    try {
      this.input.disconnect(this.delayPanL);
    } catch {
      /* not connected */
    }
    this.delay.disconnect();
    this.delayR.disconnect();
    this.delayFeedback.disconnect();
    this.delayFeedbackR.disconnect();
    this.delayFeedbackFilter.disconnect();
    this.delayPanL.disconnect();
    this.delayPanR.disconnect();
    this.delayMix.disconnect();

    // Dry path always present
    this.input.connect(this.afterDelay);

    if (mode === "mono") {
      this.input.connect(this.delay);
      this.delay.connect(this.delayFeedbackFilter);
      this.delayFeedbackFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delay);
      this.delay.connect(this.delayMix);
      this.delayMix.connect(this.afterDelay);
    } else {
      // Ping-pong
      this.input.connect(this.delayPanL);
      this.delayPanL.connect(this.delay);
      this.delay.connect(this.delayFeedbackFilter);
      this.delayFeedbackFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayPanR);
      this.delayPanR.connect(this.delayR);
      this.delayR.connect(this.delayFeedbackR);
      this.delayFeedbackR.connect(this.delay);
      this.delay.connect(this.delayMix);
      this.delayR.connect(this.delayMix);
      this.delayMix.connect(this.afterDelay);
    }

    this.currentMode = mode;
  }

  update(settings: DelaySettings, bpm: number): void {
    const t = this.context.currentTime + 0.05;
    this.enabled = settings.enabled;

    const secondsPerBeat = 60 / bpm;
    const delayTime = settings.time * secondsPerBeat;

    this.delay.delayTime.setTargetAtTime(delayTime, t, 0.02);
    this.delayR.delayTime.setTargetAtTime(delayTime, t, 0.02);
    this.delayFeedback.gain.setTargetAtTime(settings.feedback, t, 0.02);
    this.delayFeedbackR.gain.setTargetAtTime(settings.feedback, t, 0.02);
    this.delayMix.gain.setTargetAtTime(
      settings.enabled ? settings.mix : 0,
      t,
      0.02,
    );

    const filterFreq = 500 + (settings.filter ?? 1) * 19500;
    this.delayFeedbackFilter.frequency.setTargetAtTime(filterFreq, t, 0.02);

    const newMode = settings.mode ?? "mono";
    if (newMode !== this.currentMode) {
      this.rewireForMode(newMode);
    }
  }
}
