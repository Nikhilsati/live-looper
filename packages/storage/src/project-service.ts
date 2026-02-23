import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { encodePCM16WAV } from './wav-encoder';
import type {
    ProjectRecord,
    TrackRecord,
    SectionRecord,
    LayerRecord,
    AudioBlobRecord
} from '@live-looper/types';

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
            timeSignature: '4/4',
            masterLengthSamples: 0,
            schemaVersion: 1,
            appVersion: '0.1.0'
        };

        await db.transaction('rw', [db.projects, db.tracks, db.sections], async () => {
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
                    fx: this.getDefaultFX()
                };
                await db.tracks.add(track);
            }

            // Default Section
            const section: SectionRecord = {
                id: uuidv4(),
                projectId,
                name: 'Verse',
                order: 0,
                lengthSamples: 0 // Will be set on first recording
            };
            await db.sections.add(section);
        });

        return projectId;
    }

    async saveLayer(params: {
        projectId: string;
        trackId: string;
        sectionId: string;
        audioData: Float32Array;
        sampleRate: number;
        gain?: number;
    }): Promise<void> {
        const { projectId, trackId, sectionId, audioData, sampleRate, gain = 1 } = params;

        const wavBlob = encodePCM16WAV(audioData, sampleRate);
        const audioBlobId = uuidv4();
        const layerId = uuidv4();

        await db.transaction('rw', [db.layers, db.audioBlobs, db.projects], async () => {
            const audioBlob: AudioBlobRecord = {
                id: audioBlobId,
                projectId,
                blob: wavBlob,
                sampleRate,
                channels: 1,
                lengthSamples: audioData.length
            };
            await db.audioBlobs.add(audioBlob);

            const layerCount = await db.layers.where({ projectId, trackId, sectionId }).count();

            const layer: LayerRecord = {
                id: layerId,
                projectId,
                trackId,
                sectionId,
                audioBlobId,
                gain,
                order: layerCount
            };
            await db.layers.add(layer);

            await db.projects.update(projectId, { updatedAt: Date.now() });
        });
    }

    async deleteProject(projectId: string): Promise<void> {
        await db.transaction('rw', [db.projects, db.tracks, db.sections, db.layers, db.audioBlobs], async () => {
            await db.projects.delete(projectId);
            await db.tracks.where('projectId').equals(projectId).delete();
            await db.sections.where('projectId').equals(projectId).delete();
            await db.layers.where('projectId').equals(projectId).delete();
            await db.audioBlobs.where('projectId').equals(projectId).delete();
        });
    }

    private getDefaultColor(index: number): string {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF'];
        return colors[index % colors.length];
    }

    private getDefaultFX() {
        return {
            eq: { low: 0, mid: 0, midFreq: 1000, high: 0 },
            compressor: { threshold: -24, ratio: 4, attack: 0.003, release: 0.25, gain: 0 },
            drive: { amount: 0, enabled: false },
            delay: { time: 0.5, feedback: 0.3, mix: 0, enabled: false },
            reverb: { mix: 0, enabled: false },
            pan: 0,
        };
    }
}

export const projectService = new ProjectService();
