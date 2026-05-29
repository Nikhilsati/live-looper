import type {
  Mode,
  FrozenProjectSnapshot,
  EngineState,
} from "@live-looper/types";

export class ModeController {
  private static instance: ModeController;
  private currentMode: Mode = "planning";

  private constructor() {}

  static getInstance(): ModeController {
    if (!ModeController.instance) {
      ModeController.instance = new ModeController();
    }
    return ModeController.instance;
  }

  getMode(): Mode {
    return this.currentMode;
  }

  /**
   * Attempts to transition to a new mode.
   * Returns a snapshot if entering Live Mode.
   */
  async transitionTo(
    targetMode: Mode,
    currentState: EngineState,
  ): Promise<{
    success: boolean;
    error?: string;
    snapshot?: FrozenProjectSnapshot;
  }> {
    if (this.currentMode === targetMode) return { success: true };

    // Transition: Planning -> Live
    if (targetMode === "live") {
      // Validation: Ensure we have sections and tracks
      if (currentState.sections.length === 0) {
        return {
          success: false,
          error: "Cannot enter Live Mode without sections",
        };
      }

      const snapshot: FrozenProjectSnapshot = {
        sections: [...currentState.sections],
        tracks: JSON.parse(JSON.stringify(currentState.tracks)), // Deep copy for immutability
        liveTrack: JSON.parse(JSON.stringify(currentState.liveTrack)), // Deep copy for immutability
        bpm: currentState.bpm,
        quantization: {
          snapToGrid: true,
          gridResolution: 0.0625, // 1/16 default
        },
      };

      this.currentMode = "live";
      return { success: true, snapshot };
    }

    // Transition: Live -> Planning
    if (this.currentMode === "live" && targetMode === "planning") {
      this.currentMode = "planning";
      return { success: true };
    }

    // Transition: Planning <-> Practice
    if (targetMode === "practice") {
      this.currentMode = "practice";
      return { success: true };
    }

    if (this.currentMode === "practice" && targetMode === "planning") {
      this.currentMode = "planning";
      return { success: true };
    }

    this.currentMode = targetMode;
    return { success: true };
  }

  /**
   * Authority model: Check if an action is allowed in the current mode.
   */
  isActionAllowed(action: string): boolean {
    switch (this.currentMode) {
      case "live":
        return [
          "trigger-section",
          "record",
          "overdub",
          "clear-track",
          "mute",
          "unmute",
          "stop-transport",
          "start-transport",
        ].includes(action);

      case "practice":
        const restrictedInPractice = [
          "add-section",
          "remove-section",
          "reorder-sections",
          "change-routing",
          "modify-fx-config",
        ];
        return !restrictedInPractice.includes(action);

      case "planning":
      default:
        return true;
    }
  }
}

export const modeController = ModeController.getInstance();
