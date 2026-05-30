import { engineEvents } from "@live-looper/audio-engine/src/EventBus";
import { db, projectService } from "@live-looper/storage";
import { useLooperStore } from "../store/useLooperStore";
import { audioEngine } from "@live-looper/audio-engine";

export class StorageController {
  static init() {
    engineEvents.on("RECORD_STOP", async (data: any) => {
      const store = useLooperStore.getState();
      const currentProjectId = store.currentProject?.id;
      if (!currentProjectId || !data.buffer) return;

      const trackRecord = await db.tracks
        .where({ projectId: currentProjectId, order: data.trackId })
        .first();
      const sectionRecord = await db.sections
        .where({ projectId: currentProjectId, order: data.sectionIndex })
        .first();

      if (trackRecord?.id && sectionRecord?.id) {
        await projectService.saveLayer({
          projectId: currentProjectId,
          trackId: trackRecord.id,
          sectionId: sectionRecord.id,
          audioData: data.buffer,
          rawAudioData: data.rawBuffer,
          sampleRate: audioEngine.context?.sampleRate ?? 48000,
        });
        console.log(
          "StorageController: Layer saved to IndexedDB" +
            (data.rawBuffer ? " (with raw snap data)" : "")
        );
      }
    });

    engineEvents.on("UNDO_LAYER", async (data: any) => {
      const store = useLooperStore.getState();
      const currentProjectId = store.currentProject?.id;
      if (!currentProjectId) return;

      const trackRecord = await db.tracks
        .where({ projectId: currentProjectId, order: data.trackId })
        .first();
      const sectionIndex = data.sectionIndex ?? 0;
      const sectionRecord = await db.sections
        .where({ projectId: currentProjectId, order: sectionIndex })
        .first();

      if (trackRecord?.id && sectionRecord?.id) {
        const removed = await projectService.removeTopLayer({
          projectId: currentProjectId,
          trackId: trackRecord.id,
          sectionId: sectionRecord.id,
        });
        console.log(
          `StorageController: UNDO_LAYER DB soft-delete ${
            removed ? "succeeded" : "nothing to remove"
          } (track=${data.trackId})`
        );
      }
    });
  }
}
