/**
 * RemoteHost — host-side controller for the remote communication layer.
 *
 * Runs on the desktop Live Looper Studio app. Manages multiple
 * connected remote peers (1 host → N clients), broadcasts engine
 * state at a throttled rate, and dispatches incoming commands.
 */

import mitt from "mitt";
import type {
  RemoteCommand,
  RemoteConnectionStatus,
  RemoteSyncState,
  RemoteMessage,
} from "@live-looper/types";
import type { Transport } from "../transport/Transport";
import { encodeMessage } from "../protocol";

/** Mitt-compatible event map (adds index signature). */
type HostEventMap = {
  [K in keyof RemoteHostEvents]: RemoteHostEvents[K];
} & Record<string, unknown>;

/** Events emitted by RemoteHost. */
export interface RemoteHostEvents {
  /** Fired when the overall connection status changes */
  "connection-change": RemoteConnectionStatus;
  /** Fired when a validated command arrives from any connected remote */
  "command": RemoteCommand;
  /** Fired with the measured round-trip time (ms) after a ping/pong cycle */
  "latency": { peerId: string; rttMs: number };
  /** Fired when a new peer connects */
  "peer-connected": string;
  /** Fired when a peer disconnects */
  "peer-disconnected": string;
}

/** Internal representation of a connected peer. */
interface PeerEntry {
  transport: Transport;
  connectedAt: number;
  lastPingTimestamp: number | null;
  latencyMs: number;
}

/**
 * Maximum state broadcast rate: ~15Hz (every 66ms).
 * Matches the beat-tick rate and prevents flooding data channels.
 */
const BROADCAST_THROTTLE_MS = 66;

/**
 * Interval for sending ping messages to measure RTT.
 */
const PING_INTERVAL_MS = 2000;

/** Valid remote command types for validation. */
const VALID_COMMAND_TYPES = new Set([
  "PLAY",
  "STOP",
  "ARM_TRACK",
  "MUTE_TRACK",
  "SOLO_TRACK",
  "SECTION_CHANGE",
  "SET_BPM",
  "UNDO_LAYER",
  "CLEAR_TRACK",
  "CLEAR_ALL_TRACKS",
  "SET_INPUT_GAIN",
  "SET_OUTPUT_GAIN",
  "MUTE_LIVE_TRACK",
  "SET_LIVE_TRACK_FX",
]);

export class RemoteHost {
  private emitter = mitt<HostEventMap>();
  private peers = new Map<string, PeerEntry>();
  private peerCounter = 0;
  private lastBroadcastTime = 0;
  private pingIntervals = new Map<string, ReturnType<typeof setInterval>>();
  private _status: RemoteConnectionStatus = "disconnected";

  /** Current aggregate connection status. */
  get status(): RemoteConnectionStatus {
    return this._status;
  }

  /** Number of currently connected peers. */
  get peerCount(): number {
    return this.peers.size;
  }

  /**
   * Register a new transport as a connected peer.
   * The transport should already be in "open" state (handshake complete).
   * Returns the assigned peer ID.
   */
  addPeer(transport: Transport): string {
    const peerId = `peer-${++this.peerCounter}`;

    const entry: PeerEntry = {
      transport,
      connectedAt: Date.now(),
      lastPingTimestamp: null,
      latencyMs: 0,
    };

    this.peers.set(peerId, entry);

    // ── Listen for incoming messages from this peer ──
    transport.on("message", (message: RemoteMessage) => {
      this.handleMessage(peerId, message);
    });

    // ── Monitor transport state changes ──
    transport.on("state-change", (state) => {
      if (state === "closed" || state === "error") {
        this.removePeer(peerId);
      }
    });

    transport.on("error", (err) => {
      console.warn(`[RemoteHost] Error from ${peerId}:`, err.message);
    });

    // ── Start periodic ping for RTT measurement ──
    const pingInterval = setInterval(() => {
      this.sendPing(peerId);
    }, PING_INTERVAL_MS);
    this.pingIntervals.set(peerId, pingInterval);

    this.updateStatus();
    this.emitter.emit("peer-connected", peerId);

    return peerId;
  }

  /**
   * Remove and disconnect a peer by ID.
   */
  removePeer(peerId: string): void {
    const entry = this.peers.get(peerId);
    if (!entry) return;

    // Clear ping interval
    const interval = this.pingIntervals.get(peerId);
    if (interval) {
      clearInterval(interval);
      this.pingIntervals.delete(peerId);
    }

    // Disconnect the transport (idempotent — may already be closed)
    try {
      entry.transport.disconnect();
    } catch {
      // Ignore disconnect errors on already-closed transports
    }

    this.peers.delete(peerId);
    this.updateStatus();
    this.emitter.emit("peer-disconnected", peerId);
  }

  /**
   * Broadcast the current engine state to all connected peers.
   * Throttled to max ~15Hz to avoid flooding data channels.
   */
  broadcastState(state: RemoteSyncState): void {
    const now = Date.now();
    if (now - this.lastBroadcastTime < BROADCAST_THROTTLE_MS) {
      return;
    }
    this.lastBroadcastTime = now;

    this.sendStateToAllPeers(state);
  }

  /**
   * Broadcast state immediately, bypassing the throttle.
   * Used for initial state push to newly connected peers.
   */
  broadcastStateImmediate(state: RemoteSyncState): void {
    this.lastBroadcastTime = Date.now();
    this.sendStateToAllPeers(state);
  }

  private sendStateToAllPeers(state: RemoteSyncState): void {
    const encoded = encodeMessage("sync", state);

    for (const [peerId, entry] of this.peers) {
      try {
        if (entry.transport.state === "open") {
          entry.transport.send(JSON.parse(encoded));
        }
      } catch (err) {
        console.warn(
          `[RemoteHost] Failed to broadcast to ${peerId}:`,
          err,
        );
      }
    }
  }

  /** Subscribe to host events. */
  on<K extends keyof RemoteHostEvents>(
    event: K,
    handler: (data: RemoteHostEvents[K]) => void,
  ): void {
    this.emitter.on(
      event,
      handler as (data: HostEventMap[string]) => void,
    );
  }

  /** Unsubscribe from host events. */
  off<K extends keyof RemoteHostEvents>(
    event: K,
    handler: (data: RemoteHostEvents[K]) => void,
  ): void {
    this.emitter.off(
      event,
      handler as (data: HostEventMap[string]) => void,
    );
  }

  /**
   * Disconnect all peers and clean up all resources.
   */
  destroy(): void {
    for (const [peerId] of this.peers) {
      this.removePeer(peerId);
    }
    this.emitter.all.clear();
    this._status = "disconnected";
  }

  // ── Private ──

  private handleMessage(peerId: string, message: RemoteMessage): void {
    switch (message.kind) {
      case "command":
        this.handleCommand(message.data as RemoteCommand);
        break;

      case "ping":
        // Respond with pong immediately
        this.sendPong(peerId, message.timestamp);
        break;

      case "pong":
        // Calculate RTT from our original ping timestamp
        this.handlePong(peerId, message.data as { originalTimestamp: number });
        break;

      case "handshake":
        // Future: handle client capability negotiation
        break;

      default:
        break;
    }
  }

  private handleCommand(command: RemoteCommand): void {
    // Validate command type against known types
    if (!VALID_COMMAND_TYPES.has(command.type)) {
      console.warn(
        `[RemoteHost] Received unknown command type: "${command.type}". Ignoring.`,
      );
      return;
    }

    this.emitter.emit("command", command);
  }

  private sendPing(peerId: string): void {
    const entry = this.peers.get(peerId);
    if (!entry || entry.transport.state !== "open") return;

    const now = Date.now();
    entry.lastPingTimestamp = now;

    try {
      entry.transport.send(
        JSON.parse(encodeMessage("ping", { timestamp: now })),
      );
    } catch {
      // Transport may have closed between check and send
    }
  }

  private sendPong(peerId: string, originalTimestamp: number): void {
    const entry = this.peers.get(peerId);
    if (!entry || entry.transport.state !== "open") return;

    try {
      entry.transport.send(
        JSON.parse(
          encodeMessage("pong", { originalTimestamp }),
        ),
      );
    } catch {
      // Transport may have closed
    }
  }

  private handlePong(
    peerId: string,
    data: { originalTimestamp: number },
  ): void {
    const entry = this.peers.get(peerId);
    if (!entry) return;

    const rttMs = Date.now() - data.originalTimestamp;
    entry.latencyMs = rttMs;

    this.emitter.emit("latency", { peerId, rttMs });
  }

  private updateStatus(): void {
    const newStatus: RemoteConnectionStatus =
      this.peers.size > 0 ? "connected" : "disconnected";

    if (newStatus !== this._status) {
      this._status = newStatus;
      this.emitter.emit("connection-change", newStatus);
    }
  }
}
