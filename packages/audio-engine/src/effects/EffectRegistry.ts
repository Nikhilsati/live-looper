import { BaseEffect } from "./BaseEffect";

export interface EffectDefinition {
  id: string;
  name: string;
  createNode: (context: AudioContext) => BaseEffect;
  defaultSettings: any;
}

export class EffectRegistry {
  private static effects = new Map<string, EffectDefinition>();
  private static effectOrder: string[] = [];

  /**
   * Register a new effect into the engine.
   */
  static register(definition: EffectDefinition) {
    this.effects.set(definition.id, definition);
    if (!this.effectOrder.includes(definition.id)) {
      this.effectOrder.push(definition.id);
    }
  }

  /**
   * Register an effect at a specific order index.
   */
  static registerAt(definition: EffectDefinition, index: number) {
    this.effects.set(definition.id, definition);
    const existingIdx = this.effectOrder.indexOf(definition.id);
    if (existingIdx !== -1) {
      this.effectOrder.splice(existingIdx, 1);
    }
    this.effectOrder.splice(index, 0, definition.id);
  }

  /**
   * Get an effect definition by ID.
   */
  static get(id: string): EffectDefinition | undefined {
    return this.effects.get(id);
  }

  /**
   * Get all registered effects in chain order.
   */
  static getAll(): EffectDefinition[] {
    return this.effectOrder
      .map((id) => this.effects.get(id))
      .filter((def): def is EffectDefinition => def !== undefined);
  }

  /**
   * Generate a default FXState object with all default settings.
   */
  static getDefaultState(): Record<string, any> {
    const state: Record<string, any> = {};
    for (const def of this.getAll()) {
      state[def.id] = JSON.parse(JSON.stringify(def.defaultSettings));
    }
    return state;
  }
}
