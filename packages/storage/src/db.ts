import Dexie, { type Table } from 'dexie';
import type {
    ProjectRecord,
    TrackRecord,
    SectionRecord,
    LayerRecord,
    AudioBlobRecord,
    SessionRecord
} from '@live-looper/types';

export class LiveLooperDB extends Dexie {
    projects!: Table<ProjectRecord>;
    tracks!: Table<TrackRecord>;
    sections!: Table<SectionRecord>;
    layers!: Table<LayerRecord>;
    audioBlobs!: Table<AudioBlobRecord>;
    sessions!: Table<SessionRecord>;

    constructor() {
        super('live-looper-db');
        this.version(1).stores({
            projects: 'id, updatedAt, name',
            tracks: 'id, projectId',
            sections: 'id, projectId',
            layers: 'id, projectId, trackId, sectionId',
            audioBlobs: 'id, projectId'
        });
        // v2: adds deletedAt index to layers for soft-delete (undo) support.
        this.version(2).stores({
            layers: 'id, projectId, trackId, sectionId, deletedAt'
        });
        // v3: adds sessions table
        this.version(3).stores({
            sessions: 'id, projectId'
        });
    }
}

export const db = new LiveLooperDB();
