import {
  type SessionEvent,
  type FrozenProjectSnapshot,
} from "@live-looper/types";
import { audioEngine } from "@live-looper/audio-engine";

/**
 * SRP: This class is solely responsible for the accumulation of session data
 * during a performance. It handles timing, event logging, and audio capture.
 */
export class SessionRecorder {
  private static instance: SessionRecorder;
  private events: SessionEvent[] = [];
  private startTime: number = 0;
  private snapshot: FrozenProjectSnapshot | null = null;
  private isRecording: boolean = false;

  private constructor() {}

  static getInstance(): SessionRecorder {
    if (!SessionRecorder.instance) {
      SessionRecorder.instance = new SessionRecorder();
    }
    return SessionRecorder.instance;
  }

  async start(snapshot: FrozenProjectSnapshot) {
    this.events = [];
    this.startTime = Date.now();
    this.snapshot = snapshot;
    this.isRecording = true;

    await audioEngine.startLiveRecording();
    this.logEvent("PLAY");
  }

  async stop(): Promise<{
    events: SessionEvent[];
    snapshot: FrozenProjectSnapshot;
    durationMs: number;
    audioBlob?: Blob;
  } | null> {
    if (!this.isRecording || !this.snapshot) return null;

    this.logEvent("STOP");
    const durationMs = Date.now() - this.startTime;
    const audioBlob = await audioEngine.stopLiveRecording();

    const result = {
      events: [...this.events],
      snapshot: this.snapshot,
      durationMs,
      audioBlob: audioBlob || undefined,
    };

    this.isRecording = false;
    this.events = [];
    this.snapshot = null;

    return result;
  }

  logEvent(type: any, payload?: any) {
    if (!this.isRecording) return;

    this.events.push({
      timestampMs: Date.now() - this.startTime,
      type,
      payload,
    });
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  getStartTime(): number {
    return this.startTime;
  }
}

export const sessionRecorder = SessionRecorder.getInstance();
