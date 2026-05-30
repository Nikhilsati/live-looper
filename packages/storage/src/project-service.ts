import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { encodePCM16WAV } from "./wav-encoder";
import type {
  ProjectRecord,
  TrackRecord,
  SectionRecord,
  LayerRecord,
  AudioBlobRecord,
} from "@live-looper/types";
import { FXBuilder } from "@live-looper/types";

export class ProjectService {
  async createProject(name: string, bpm: number): Promise<string> {
    const projectId = uuidv4();
    const now = Date.now();

    const project: ProjectRecord = {
      id: projectId,
      name,
      createdAt: now,
      updatedAt: now,
      bpm,
      timeSignature: "4/4",
      masterLengthSamples: 0,
      schemaVersion: 1,
      appVersion: "0.1.0",
      settings: {
        metronomeOn: true,
        showLayers: true,
        smartSnapEnabled: true,
      },
    };

    await db.transaction(
      "rw",
      [db.projects, db.tracks, db.sections],
      async () => {
        await db.projects.add(project);

        // Default 4 tracks
        for (let i = 0; i < 4; i++) {
          const track: TrackRecord = {
            id: uuidv4(),
            projectId,
            name: `Track ${i + 1}`,
            order: i,
            color: this.getDefaultColor(i),
            muted: false,
            solo: false,
            fx: this.getDefaultFX(),
          };
          await db.tracks.add(track);
        }

        // Default Section
        const section: SectionRecord = {
          id: uuidv4(),
          projectId,
          name: "Verse",
          order: 0,
          lengthSamples: 0, // Will be set on first recording
          lengthInBars: 4, // Default loop length; persisted as the source of truth
        };
        await db.sections.add(section);
      },
    );

    return projectId;
  }

  async saveLayer(params: {
    projectId: string;
    trackId: string;
    sectionId: string;
    audioData: Float32Array;
    rawAudioData?: Float32Array;
    sampleRate: number;
    gain?: number;
  }): Promise<void> {
    const {
      projectId,
      trackId,
      sectionId,
      audioData,
      rawAudioData,
      sampleRate,
      gain = 1,
    } = params;

    const wavBlob = encodePCM16WAV(audioData, sampleRate);
    const audioBlobId = uuidv4();
    const layerId = uuidv4();

    console.log(
      `[ProjectService] Saving layer: has rawAudioData? ${!!rawAudioData}`,
      rawAudioData ? rawAudioData.length : 0,
    );

    let rawAudioBlobId: string | undefined;
    let rawWavBlob: Blob | undefined;

    if (rawAudioData) {
      rawWavBlob = encodePCM16WAV(rawAudioData, sampleRate);
      rawAudioBlobId = uuidv4();
    }

    await db.transaction(
      "rw",
      [db.layers, db.audioBlobs, db.projects, db.sections, db.tracks],
      async () => {
        const audioBlob: AudioBlobRecord = {
          id: audioBlobId,
          projectId,
          blob: wavBlob,
          sampleRate,
          channels: 1,
          lengthSamples: audioData.length,
        };
        await db.audioBlobs.add(audioBlob);

        if (rawWavBlob && rawAudioBlobId && rawAudioData) {
          const rawAudioBlob: AudioBlobRecord = {
            id: rawAudioBlobId,
            projectId,
            blob: rawWavBlob,
            sampleRate,
            channels: 1,
            lengthSamples: rawAudioData.length,
          };
          await db.audioBlobs.add(rawAudioBlob);
        }

        // Only count active (non-deleted) layers for the order field.
        const activeLayerCount = await db.layers
          .where({ projectId, trackId, sectionId })
          .filter((l) => !l.deletedAt)
          .count();

        const layer: LayerRecord = {
          id: layerId,
          projectId,
          trackId,
          sectionId,
          audioBlobId,
          rawAudioBlobId,
          gain,
          order: activeLayerCount,
          deletedAt: null,
        };
        await db.layers.add(layer);

        // Propagate to linked downstream sections
        const section = await db.sections.get(sectionId);
        const track = await db.tracks.get(trackId);
        if (section && track) {
          const trackIndex = track.order;
          const allSections = await db.sections
            .where({ projectId })
            .sortBy("order");
          const startIndex = allSections.findIndex((s) => s.id === sectionId);
          if (startIndex !== -1) {
            for (let i = startIndex + 1; i < allSections.length; i++) {
              const nextSection = allSections[i];
              const isLinked = nextSection.trackLinks
                ? nextSection.trackLinks[trackIndex]
                : true;
              if (isLinked) {
                const nextActiveCount = await db.layers
                  .where({ projectId, trackId, sectionId: nextSection.id })
                  .filter((l) => !l.deletedAt)
                  .count();
                const propagatedLayer: LayerRecord = {
                  id: uuidv4(),
                  projectId,
                  trackId,
                  sectionId: nextSection.id,
                  audioBlobId,
                  rawAudioBlobId,
                  gain,
                  order: nextActiveCount,
                  deletedAt: null,
                };
                await db.layers.add(propagatedLayer);
              } else {
                break;
              }
            }
          }
        }

        await db.projects.update(projectId, { updatedAt: Date.now() });
      },
    );
  }

  /**
   * Soft-deletes the most recently recorded active layer for the given
   * track + section, mirroring what the in-memory worklet does for UNDO_LAYER.
   * The underlying audio blob is kept so potential redo can restore it.
   */
  async removeTopLayer(params: {
    projectId: string;
    trackId: string;
    sectionId: string;
  }): Promise<boolean> {
    const { projectId, trackId, sectionId } = params;

    return await db.transaction(
      "rw",
      [db.layers, db.projects, db.sections, db.tracks],
      async () => {
        const activeLayers = await db.layers
          .where({ projectId, trackId, sectionId })
          .filter((l) => !l.deletedAt)
          .sortBy("order");

        if (activeLayers.length === 0) return false;

        // The last active layer (highest order) is the one that was most recently recorded.
        const topLayer = activeLayers[activeLayers.length - 1];
        await db.layers.update(topLayer.id, { deletedAt: Date.now() });

        // Propagate to linked downstream sections
        const section = await db.sections.get(sectionId);
        const track = await db.tracks.get(trackId);
        if (section && track) {
          const trackIndex = track.order;
          const allSections = await db.sections
            .where({ projectId })
            .sortBy("order");
          const startIndex = allSections.findIndex((s) => s.id === sectionId);
          if (startIndex !== -1) {
            for (let i = startIndex + 1; i < allSections.length; i++) {
              const nextSection = allSections[i];
              const isLinked = nextSection.trackLinks
                ? nextSection.trackLinks[trackIndex]
                : true;
              if (isLinked) {
                const nextActiveLayers = await db.layers
                  .where({ projectId, trackId, sectionId: nextSection.id })
                  .filter((l) => !l.deletedAt)
                  .sortBy("order");
                if (nextActiveLayers.length > 0) {
                  const nextTopLayer =
                    nextActiveLayers[nextActiveLayers.length - 1];
                  await db.layers.update(nextTopLayer.id, {
                    deletedAt: Date.now(),
                  });
                }
              } else {
                break;
              }
            }
          }
        }

        await db.projects.update(projectId, { updatedAt: Date.now() });
        return true;
      },
    );
  }

  async deleteLayer(layerId: string): Promise<void> {
    const layer = await db.layers.get(layerId);
    if (!layer) return;

    const { projectId, audioBlobId, trackId, sectionId } = layer;

    await db.transaction(
      "rw",
      [db.layers, db.audioBlobs, db.projects, db.sections, db.tracks],
      async () => {
        await db.layers.delete(layerId);

        // Propagate deletion to downstream linked sections
        const section = await db.sections.get(sectionId);
        const track = await db.tracks.get(trackId);
        if (section && track) {
          const trackIndex = track.order;
          const allSections = await db.sections
            .where({ projectId })
            .sortBy("order");
          const startIndex = allSections.findIndex((s) => s.id === sectionId);
          if (startIndex !== -1) {
            for (let i = startIndex + 1; i < allSections.length; i++) {
              const nextSection = allSections[i];
              const isLinked = nextSection.trackLinks
                ? nextSection.trackLinks[trackIndex]
                : true;
              if (isLinked) {
                const matchingLayers = await db.layers
                  .where({
                    projectId,
                    trackId,
                    sectionId: nextSection.id,
                    audioBlobId,
                  })
                  .toArray();
                for (const ml of matchingLayers) {
                  await db.layers.delete(ml.id);
                }
              } else {
                break;
              }
            }
          }
        }

        if (audioBlobId) {
          const referencedCount = await db.layers
            .where({ audioBlobId })
            .count();
          if (referencedCount === 0) {
            await db.audioBlobs.delete(audioBlobId);
          }
        }

        await db.projects.update(projectId, { updatedAt: Date.now() });
      },
    );
  }

  async addSection(projectId: string, name: string): Promise<string> {
    const id = uuidv4();
    await db.transaction("rw", [db.projects, db.sections], async () => {
      const count = await db.sections.where({ projectId }).count();
      const section: SectionRecord = {
        id,
        projectId,
        name,
        order: count,
        lengthSamples: 0,
        lengthInBars: 4,
        trackLinks: [true, true, true, true],
      };
      await db.sections.add(section);
      await db.projects.update(projectId, { updatedAt: Date.now() });
    });
    return id;
  }

  async deleteSection(sectionId: string): Promise<void> {
    const section = await db.sections.get(sectionId);
    if (!section) return;

    await db.transaction(
      "rw",
      [db.projects, db.sections, db.layers],
      async () => {
        await db.sections.delete(sectionId);

        // Fetch and delete all layers for this section. (Audioblobs are kept to avoid deleting them if shared, or we can leave them orphaned. Wait, we should probably clean up orphaned blobs later. Leaving them for now as per layer deletion standards).
        // Usually deleteLayer deletes audioBlobId if deleted independently, but for section wipe, let's keep it simple.
        const layers = await db.layers.where({ sectionId }).toArray();
        await db.layers.bulkDelete(layers.map((l) => l.id));

        // Reorder remaining sections
        const remaining = await db.sections
          .where({ projectId: section.projectId })
          .sortBy("order");
        for (let i = 0; i < remaining.length; i++) {
          if (remaining[i].order !== i) {
            await db.sections.update(remaining[i].id, { order: i });
          }
        }
        await db.projects.update(section.projectId, { updatedAt: Date.now() });
      },
    );
  }

  async reorderSections(
    projectId: string,
    sectionIds: string[],
  ): Promise<void> {
    await db.transaction("rw", [db.projects, db.sections], async () => {
      for (let i = 0; i < sectionIds.length; i++) {
        await db.sections.update(sectionIds[i], { order: i });
      }
      await db.projects.update(projectId, { updatedAt: Date.now() });
    });
  }

  async carryForwardTrack(
    projectId: string,
    trackIndex: number,
    fromSectionId: string,
    toSectionId: string,
    enabled: boolean,
  ): Promise<void> {
    await db.transaction(
      "rw",
      [db.projects, db.sections, db.tracks, db.layers],
      async () => {
        // Get trackId by order
        const track = await db.tracks
          .where({ projectId, order: trackIndex })
          .first();
        if (!track) return;
        const trackId = track.id;

        // Update the trackLinks field on the target section
        const targetSection = await db.sections.get(toSectionId);
        if (targetSection) {
          targetSection.trackLinks = targetSection.trackLinks || [
            true,
            true,
            true,
            true,
          ];
          targetSection.trackLinks[trackIndex] = enabled;
          await db.sections.put(targetSection);
        }

        if (enabled) {
          // Duplicate active layers from `fromSectionId` to `toSectionId`
          const sourceLayers = await db.layers
            .where({ projectId, trackId, sectionId: fromSectionId })
            .filter((l) => !l.deletedAt)
            .sortBy("order");

          for (const layer of sourceLayers) {
            const newLayer: LayerRecord = {
              ...layer,
              id: uuidv4(),
              sectionId: toSectionId,
              // Re-use the existing audio blobs!
              audioBlobId: layer.audioBlobId,
              rawAudioBlobId: layer.rawAudioBlobId,
            };
            await db.layers.add(newLayer);
          }
        } else {
          // Remove all layers for this track in the `toSectionId`
          const targetLayers = await db.layers
            .where({ projectId, trackId, sectionId: toSectionId })
            .toArray();

          await db.layers.bulkDelete(targetLayers.map((l) => l.id));
        }

        await db.projects.update(projectId, { updatedAt: Date.now() });
      },
    );
  }

  async updateSectionName(
    projectId: string,
    sectionId: string,
    newName: string,
  ): Promise<void> {
    await db.transaction("rw", [db.projects, db.sections], async () => {
      await db.sections.update(sectionId, { name: newName });
      await db.projects.update(projectId, { updatedAt: Date.now() });
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    await db.transaction(
      "rw",
      [db.projects, db.tracks, db.sections, db.layers, db.audioBlobs],
      async () => {
        await db.projects.delete(projectId);
        await db.tracks.where("projectId").equals(projectId).delete();
        await db.sections.where("projectId").equals(projectId).delete();
        await db.layers.where("projectId").equals(projectId).delete();
        await db.audioBlobs.where("projectId").equals(projectId).delete();
      },
    );
  }

  private getDefaultColor(index: number): string {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF"];
    return colors[index % colors.length];
  }

  private getDefaultFX() {
    return new FXBuilder().build();
  }
}

export const projectService = new ProjectService();
