import type { RemoteMessage } from "@live-looper/types";

/**
 * Transport state machine:
 *   idle → connecting → open → closed
 *                    ↘ error
 */
export type TransportState = "idle" | "connecting" | "open" | "closed" | "error";

/** Events emitted by any transport implementation. */
export interface TransportEvents {
  /** Fired when the transport state changes */
  "state-change": TransportState;
  /** Fired when a decoded message arrives from the remote peer */
  "message": RemoteMessage;
  /** Fired on transport-level errors (ICE failure, channel close, etc.) */
  "error": Error;
}

/**
 * Abstract transport interface.
 *
 * This is the primary extensibility point — any future transport
 * (WebSocket, Bluetooth, USB, in-memory mock) implements this interface.
 * The host and client controllers are transport-agnostic.
 */
export interface Transport {
  /** Current connection state */
  readonly state: TransportState;

  /**
   * Initiate a connection.
   * @param config Transport-specific configuration (e.g., RTCSessionDescription for WebRTC)
   */
  connect(config: unknown): Promise<void>;

  /**
   * Send a message to the connected peer.
   * Throws if the transport is not in "open" state.
   */
  send(message: RemoteMessage): void;

  /** Graceful shutdown — closes the connection and cleans up resources. */
  disconnect(): void;

  /** Subscribe to a transport event. */
  on<K extends keyof TransportEvents>(
    event: K,
    handler: (data: TransportEvents[K]) => void,
  ): void;

  /** Unsubscribe from a transport event. */
  off<K extends keyof TransportEvents>(
    event: K,
    handler: (data: TransportEvents[K]) => void,
  ): void;
}
