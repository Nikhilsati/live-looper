import { EffectRegistry } from "./EffectRegistry";
import { NoiseGateEffect } from "./NoiseGateEffect";
import { EQEffect } from "./EQEffect";
import { CompressorEffect } from "./CompressorEffect";
import { DriveEffect } from "./DriveEffect";
import { ChorusEffect } from "./ChorusEffect";
import { PhaserEffect } from "./PhaserEffect";
import { TremoloEffect } from "./TremoloEffect";
import { DelayEffect } from "./DelayEffect";
import { ReverbEffect } from "./ReverbEffect";
import { PanEffect } from "./PanEffect";

export function registerDefaultEffects() {
  EffectRegistry.register({
    id: "noiseGate",
    name: "Noise Gate",
    createNode: (ctx) => new NoiseGateEffect(ctx),
    defaultSettings: { threshold: -50, attack: 0.01, release: 0.1, enabled: false },
  });

  EffectRegistry.register({
    id: "eq",
    name: "EQ 3B",
    createNode: (ctx) => new EQEffect(ctx),
    defaultSettings: { low: 0, mid: 0, midFreq: 1000, high: 0 },
  });

  EffectRegistry.register({
    id: "compressor",
    name: "Compressor",
    createNode: (ctx) => new CompressorEffect(ctx),
    defaultSettings: { threshold: -24, ratio: 4, attack: 0.003, release: 0.25, gain: 0 },
  });

  EffectRegistry.register({
    id: "drive",
    name: "Drive",
    createNode: (ctx) => new DriveEffect(ctx),
    defaultSettings: { amount: 0, tone: 1, enabled: false },
  });

  EffectRegistry.register({
    id: "chorus",
    name: "Chorus",
    createNode: (ctx) => new ChorusEffect(ctx),
    defaultSettings: { rate: 0.5, depth: 0.4, mix: 0.5, voices: 1, enabled: false },
  });

  EffectRegistry.register({
    id: "phaser",
    name: "Phaser",
    createNode: (ctx) => new PhaserEffect(ctx),
    defaultSettings: { rate: 0.5, depth: 0.5, feedback: 0.5, stages: 4, enabled: false },
  });

  EffectRegistry.register({
    id: "tremolo",
    name: "Tremolo",
    createNode: (ctx) => new TremoloEffect(ctx),
    defaultSettings: { rate: 5, depth: 0.5, sync: false, enabled: false },
  });

  EffectRegistry.register({
    id: "delay",
    name: "Delay",
    createNode: (ctx) => new DelayEffect(ctx),
    defaultSettings: { time: 0.5, feedback: 0.3, mix: 0, mode: "mono", filter: 1, enabled: false },
  });

  EffectRegistry.register({
    id: "reverb",
    name: "Reverb",
    createNode: (ctx) => new ReverbEffect(ctx),
    defaultSettings: { mix: 0, size: 1.5, predelay: 0, damping: 1, enabled: false },
  });

  EffectRegistry.register({
    id: "pan",
    name: "Pan",
    createNode: (ctx) => new PanEffect(ctx),
    defaultSettings: 0,
  });
}
