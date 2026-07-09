/**
 * RemoteClient — client-side controller for the remote communication layer.
 *
 * Runs on the mobile/tablet device. Sends commands to the host,
 * receives state updates, triggers haptic feedback on state transitions,
 * and measures latency via periodic ping/pong.
 */

import mitt from "mitt";
import type {
  RemoteCommandType,
  RemoteConnectionStatus,
  RemoteSyncState,
  RemoteMessage,
} from "@live-looper/types";
import type { Transport } from "../transport/Transport";
import { encodeMessage } from "../protocol";

/** Mitt-compatible event map (adds index signature). */
type ClientEventMap = {
  [K in keyof RemoteClientEvents]: RemoteClientEvents[K];
} & Record<string, unknown>;

/** Events emitted by RemoteClient. */
export interface RemoteClientEvents {
  /** Fired when the connection status changes */
  "connection-change": RemoteConnectionStatus;
  /** Fired when a new state update arrives from the host */
  "state": RemoteSyncState;
  /** Fired with the measured round-trip time (ms) */
  "latency": number;
}

/**
 * Haptic feedback patterns (durations in ms).
 * Uses the Web Vibration API — degrades gracefully on unsupported devices.
 */
const HAPTIC_PATTERNS = {
  /** Standard button tap */
  tap: [15],
  /** Track arming (double pulse) */
  arm: [35, 50, 35],
  /** Recording started */
  recordStart: [50],
  /** Recording stopped */
  recordStop: [30, 40, 30],
  /** Emergency stop (sustained feedback) */
  emergencyStop: [100],
  /** Section changed */
  sectionChange: [20, 30, 20],
} as const;

/** Interval between periodic pings (ms). */
const PING_INTERVAL_MS = 2000;

export class RemoteClient {
  private emitter = mitt<ClientEventMap>();
  private transport: Transport;
  private _status: RemoteConnectionStatus = "disconnected";
  private lastState: RemoteSyncState | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private lastPingTimestamp: number | null = null;

  /** Current connection status. */
  get status(): RemoteConnectionStatus {
    return this._status;
  }

  /** Most recent state snapshot from the host. */
  get currentState(): RemoteSyncState | null {
    return this.lastState;
  }

  constructor(transport: Transport) {
    this.transport = transport;

    // ── Listen for incoming messages ──
    this.transport.on("message", (message: RemoteMessage) => {
      this.handleMessage(message);
    });

    // ── Monitor transport state ──
    this.transport.on("state-change", (state) => {
      switch (state) {
        case "connecting":
          this.setStatus("connecting");
          break;
        case "open":
          this.setStatus("connected");
          this.startPingLoop();
          break;
        case "closed":
          this.setStatus("disconnected");
          this.stopPingLoop();
          break;
        case "error":
          this.setStatus("error");
          this.stopPingLoop();
          break;
      }
    });

    this.transport.on("error", (err) => {
      console.warn("[RemoteClient] Transport error:", err.message);
    });
  }

  /**
   * Connect to the host using the provided config.
   * The config is transport-specific (passed through to Transport.connect).
   */
  async connect(config: unknown): Promise<void> {
    this.setStatus("connecting");
    await this.transport.connect(config);
  }

  /**
   * Send a command to the host.
   * Automatically attaches a client timestamp for latency measurement.
   */
  sendCommand(
    type: RemoteCommandType,
    payload?: Record<string, unknown>,
  ): void {
    const message = encodeMessage("command", {
      type,
      payload,
      clientTimestamp: Date.now(),
    });

    try {
      this.transport.send(JSON.parse(message));
    } catch (err) {
      console.warn("[RemoteClient] Failed to send command:", err);
    }
  }

  /** Subscribe to client events. */
  on<K extends keyof RemoteClientEvents>(
    event: K,
    handler: (data: RemoteClientEvents[K]) => void,
  ): void {
    this.emitter.on(
      event,
      handler as (data: ClientEventMap[string]) => void,
    );
  }

  /** Unsubscribe from client events. */
  off<K extends keyof RemoteClientEvents>(
    event: K,
    handler: (data: RemoteClientEvents[K]) => void,
  ): void {
    this.emitter.off(
      event,
      handler as (data: ClientEventMap[string]) => void,
    );
  }

  /** Disconnect from the host and clean up. */
  disconnect(): void {
    this.stopPingLoop();
    this.transport.disconnect();
    this.lastState = null;
    this.setStatus("disconnected");
  }

  // ── Private ──

  private handleMessage(message: RemoteMessage): void {
    switch (message.kind) {
      case "sync":
        this.handleStateUpdate(message.data as RemoteSyncState);
        break;

      case "pong":
        this.handlePong(message.data as { originalTimestamp: number });
        break;

      case "ping":
        // Host is pinging us — respond with pong
        this.sendPong(message.timestamp);
        break;

      default:
        break;
    }
  }

  private handleStateUpdate(state: RemoteSyncState): void {
    const prevState = this.lastState;
    this.lastState = state;

    // ── Haptic feedback on state transitions ──
    if (prevState) {
      this.triggerHaptics(prevState, state);
    }

    this.emitter.emit("state", state);
  }

  /**
   * Detect state transitions and trigger appropriate haptic feedback.
   * Only fires on actual changes to avoid vibration spam.
   */
  private triggerHaptics(
    prev: RemoteSyncState,
    next: RemoteSyncState,
  ): void {
    // Check if any track started recording
    for (let i = 0; i < next.tracks.length; i++) {
      const prevTrack = prev.tracks[i];
      const nextTrack = next.tracks[i];
      if (!prevTrack || !nextTrack) continue;

      // Recording started
      if (!prevTrack.isRecording && nextTrack.isRecording) {
        this.vibrate(HAPTIC_PATTERNS.recordStart);
        return; // Only one haptic per update
      }

      // Recording stopped
      if (prevTrack.isRecording && !nextTrack.isRecording) {
        this.vibrate(HAPTIC_PATTERNS.recordStop);
        return;
      }

      // Track armed
      if (!prevTrack.isArmed && nextTrack.isArmed) {
        this.vibrate(HAPTIC_PATTERNS.arm);
        return;
      }
    }

    // Section changed
    if (prev.currentSectionIndex !== next.currentSectionIndex) {
      this.vibrate(HAPTIC_PATTERNS.sectionChange);
      return;
    }

    // Playback stopped (emergency stop scenario)
    if (prev.isPlaying && !next.isPlaying) {
      this.vibrate(HAPTIC_PATTERNS.tap);
    }
  }

  /**
   * Trigger device vibration using the Web Vibration API.
   * Degrades gracefully on unsupported devices (no-op).
   */
  private vibrate(pattern: readonly number[]): void {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([...pattern]);
      }
    } catch {
      // Vibration API not available — silent fallback
    }
  }

  private startPingLoop(): void {
    this.stopPingLoop();
    this.pingInterval = setInterval(() => {
      this.sendPing();
    }, PING_INTERVAL_MS);
  }

  private stopPingLoop(): void {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.lastPingTimestamp = null;
  }

  private sendPing(): void {
    if (this.transport.state !== "open") return;

    const now = Date.now();
    this.lastPingTimestamp = now;

    try {
      this.transport.send(
        JSON.parse(encodeMessage("ping", { timestamp: now })),
      );
    } catch {
      // Transport may have closed
    }
  }

  private sendPong(originalTimestamp: number): void {
    if (this.transport.state !== "open") return;

    try {
      this.transport.send(
        JSON.parse(encodeMessage("pong", { originalTimestamp })),
      );
    } catch {
      // Transport may have closed
    }
  }

  private handlePong(data: { originalTimestamp: number }): void {
    const rttMs = Date.now() - data.originalTimestamp;
    this.emitter.emit("latency", rttMs);
  }

  private setStatus(status: RemoteConnectionStatus): void {
    if (this._status === status) return;
    this._status = status;
    this.emitter.emit("connection-change", status);
  }
}
