import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import type {
  SessionRecord,
  SessionEvent,
  FrozenProjectSnapshot,
} from "@live-looper/types";

export const sessionService = {
  async createSession(
    projectId: string,
    name: string,
    durationMs: number,
    events: SessionEvent[],
    projectSnapshot: FrozenProjectSnapshot,
    liveAudioBlob?: Blob,
  ): Promise<string> {
    const sessionId = uuidv4();
    let liveAudioBlobId: string | undefined = undefined;

    if (liveAudioBlob) {
      liveAudioBlobId = uuidv4();
      await db.audioBlobs.add({
        id: liveAudioBlobId,
        projectId,
        blob: liveAudioBlob,
        sampleRate: 48000, // Not super critical for playback, just for record keeping
        channels: 1,
        lengthSamples: 0, // We don't strictly need this for linear playback
      });
    }

    const session: SessionRecord = {
      id: sessionId,
      projectId,
      name,
      createdAt: Date.now(),
      durationMs,
      events,
      projectSnapshot,
      liveAudioBlobId,
    };

    await db.sessions.add(session);
    return sessionId;
  },

  async getSessionsForProject(projectId: string): Promise<SessionRecord[]> {
    return db.sessions.where({ projectId }).sortBy("createdAt");
  },

  async getSession(id: string): Promise<SessionRecord | undefined> {
    return db.sessions.get(id);
  },

  async deleteSession(id: string): Promise<void> {
    const session = await db.sessions.get(id);
    if (session) {
      if (session.liveAudioBlobId) {
        await db.audioBlobs.delete(session.liveAudioBlobId);
      }
      await db.sessions.delete(id);
    }
  },
};
