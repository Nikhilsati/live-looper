import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import type {
    ProjectRecord,
    TrackRecord,
    SectionRecord,
    LayerRecord,
    AudioBlobRecord
} from '@live-looper/types';

export class ExportService {
    async exportProject(projectId: string): Promise<void> {
        const project = await db.projects.get(projectId);
        if (!project) throw new Error('Project not found');

        const tracks = await db.tracks.where({ projectId }).toArray();
        const sections = await db.sections.where({ projectId }).toArray();
        const layers = await db.layers.where({ projectId }).toArray();
        const audioBlobs = await db.audioBlobs.where({ projectId }).toArray();

        const zip = new JSZip();

        // Project Manifest
        const manifest = {
            project,
            tracks,
            sections,
            layers,
            audioBlobs: audioBlobs.map(b => ({
                id: b.id,
                sampleRate: b.sampleRate,
                channels: b.channels,
                lengthSamples: b.lengthSamples
            }))
        };
        zip.file('project.json', JSON.stringify(manifest, null, 2));

        // Audio Files
        const audioFolder = zip.folder('audio');
        for (const blob of audioBlobs) {
            audioFolder?.file(`${blob.id}.wav`, blob.blob);
        }

        const content = await zip.generateAsync({ type: 'blob' });

        // File System Access API
        try {
            // @ts-ignore
            const handle = await window.showSaveFilePicker({
                suggestedName: `${project.name}.llp`,
                types: [{
                    description: 'Live Looper Project',
                    accept: { 'application/zip': ['.llp'] }
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
        } catch (e) {
            // Fallback for browsers without File System Access API
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${project.name}.llp`;
            link.click();
            URL.revokeObjectURL(url);
        }
    }

    async importProject(file: File): Promise<string> {
        const zip = await JSZip.loadAsync(file);
        const manifestStr = await zip.file('project.json')?.async('string');
        if (!manifestStr) throw new Error('Invalid project file');

        const manifest = JSON.parse(manifestStr);
        const oldProject: ProjectRecord = manifest.project;
        const oldTracks: TrackRecord[] = manifest.tracks;
        const oldSections: SectionRecord[] = manifest.sections;
        const oldLayers: LayerRecord[] = manifest.layers;
        const oldAudioBlobs: any[] = manifest.audioBlobs || [];

        const newProjectId = uuidv4();
        const idMap = new Map<string, string>();

        // Remap IDs to avoid collisions
        idMap.set(oldProject.id, newProjectId);

        const newProject: ProjectRecord = {
            ...oldProject,
            id: newProjectId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        return await db.transaction('rw', [db.projects, db.tracks, db.sections, db.layers, db.audioBlobs], async () => {
            await db.projects.add(newProject);

            for (const t of oldTracks) {
                const newTrackId = uuidv4();
                idMap.set(t.id, newTrackId);
                await db.tracks.add({ ...t, id: newTrackId, projectId: newProjectId });
            }

            for (const s of oldSections) {
                const newSectionId = uuidv4();
                idMap.set(s.id, newSectionId);
                await db.sections.add({ ...s, id: newSectionId, projectId: newProjectId });
            }

            for (const l of oldLayers) {
                const newLayerId = uuidv4();
                const oldAudioBlobId = l.audioBlobId;
                const newAudioBlobId = uuidv4();

                // Import audio blob
                const blobData = await zip.file(`audio/${oldAudioBlobId}.wav`)?.async('blob');
                if (blobData) {
                    const oldMeta = oldAudioBlobs.find(b => b.id === oldAudioBlobId);

                    const audioBlob: AudioBlobRecord = {
                        id: newAudioBlobId,
                        projectId: newProjectId,
                        blob: blobData,
                        sampleRate: oldMeta?.sampleRate || 44100,
                        channels: oldMeta?.channels || 1,
                        lengthSamples: oldMeta?.lengthSamples || 0
                    };
                    await db.audioBlobs.add(audioBlob);
                }

                await db.layers.add({
                    ...l,
                    id: newLayerId,
                    projectId: newProjectId,
                    trackId: idMap.get(l.trackId)!,
                    sectionId: idMap.get(l.sectionId)!,
                    audioBlobId: newAudioBlobId
                });
            }

            return newProjectId;
        });
    }
}

export const exportService = new ExportService();
