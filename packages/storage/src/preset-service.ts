import { db } from "./db";
import type { FXPreset } from "@live-looper/types";
import { v4 as uuidv4 } from "uuid";

class PresetService {
  async savePreset(
    name: string,
    type: "chain" | "module",
    fxState: any,
    moduleType?: string,
  ): Promise<FXPreset> {
    const preset: FXPreset = {
      id: uuidv4(),
      name,
      type,
      moduleType: moduleType as any,
      fxState,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.fxPresets.add(preset);
    return preset;
  }

  async getPresetsByType(
    type: "chain" | "module",
    moduleType?: string,
  ): Promise<FXPreset[]> {
    let query = db.fxPresets.where("type").equals(type);
    if (type === "module" && moduleType) {
      query = db.fxPresets.where({ type: "module", moduleType });
    }
    return await query.toArray();
  }

  async deletePreset(id: string): Promise<void> {
    await db.fxPresets.delete(id);
  }

  async importPreset(file: File): Promise<FXPreset> {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!data.type || !data.fxState || !data.name) {
      throw new Error("Invalid preset file format");
    }

    const preset: FXPreset = {
      id: uuidv4(),
      name: data.name,
      type: data.type,
      moduleType: data.moduleType,
      fxState: data.fxState,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.fxPresets.add(preset);
    return preset;
  }

  async exportPreset(id: string): Promise<void> {
    const preset = await db.fxPresets.get(id);
    if (!preset) throw new Error("Preset not found");

    // We only want to export the relevant data, not the internal ID/timestamps
    const exportData = {
      name: preset.name,
      type: preset.type,
      moduleType: preset.moduleType,
      fxState: preset.fxState,
      version: 1,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${preset.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_preset.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

export const presetService = new PresetService();
