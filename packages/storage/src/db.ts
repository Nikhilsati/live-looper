import Dexie, { type Table } from 'dexie';
import type {
    ProjectRecord,
    TrackRecord,
    SectionRecord,
    LayerRecord,
    AudioBlobRecord
} from '@live-looper/types';

export class LiveLooperDB extends Dexie {
    projects!: Table<ProjectRecord>;
    tracks!: Table<TrackRecord>;
    sections!: Table<SectionRecord>;
    layers!: Table<LayerRecord>;
    audioBlobs!: Table<AudioBlobRecord>;

    constructor() {
        super('live-looper-db');
        this.version(1).stores({
            projects: 'id, updatedAt, name',
            tracks: 'id, projectId',
            sections: 'id, projectId',
            layers: 'id, projectId, trackId, sectionId',
            audioBlobs: 'id, projectId'
        });
    }
}

export const db = new LiveLooperDB();
