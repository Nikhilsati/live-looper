import type { FXState } from "@live-looper/types";
import { EffectRegistry } from "./effects/EffectRegistry";
import { registerDefaultEffects } from "./effects/DefaultEffects";

// Ensure default effects are registered
registerDefaultEffects();

export class FXBuilder {
  private state: FXState;

  constructor(initialState?: Partial<FXState>) {
    this.state = EffectRegistry.getDefaultState() as FXState;

    if (initialState) {
      this.merge(initialState);
    }
  }

  // To keep UI types somewhat happy if they still call these (though they shouldn't if they use dynamic).
  withEQ(eq: any) { this.merge({ eq }); return this; }
  withCompressor(comp: any) { this.merge({ compressor: comp }); return this; }
  withDrive(drive: any) { this.merge({ drive }); return this; }
  withChorus(chorus: any) { this.merge({ chorus }); return this; }
  withPhaser(phaser: any) { this.merge({ phaser }); return this; }
  withTremolo(tremolo: any) { this.merge({ tremolo }); return this; }
  withDelay(delay: any) { this.merge({ delay }); return this; }
  withReverb(reverb: any) { this.merge({ reverb }); return this; }
  withNoiseGate(gate: any) { this.merge({ noiseGate: gate }); return this; }
  withPan(pan: number) { this.merge({ pan }); return this; }

  merge(partial: Partial<FXState>) {
    for (const key of Object.keys(partial)) {
      if (this.state[key] !== undefined && typeof this.state[key] === "object" && this.state[key] !== null) {
        Object.assign(this.state[key], partial[key as keyof FXState]);
      } else {
        // primitives like 'pan' or brand new dynamic effects
        this.state[key as keyof FXState] = partial[key as keyof FXState] as any;
      }
    }
    return this;
  }

  build(): FXState {
    return JSON.parse(JSON.stringify(this.state));
  }
}
