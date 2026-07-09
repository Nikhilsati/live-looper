/**
 * SessionBroker — manages session lifecycle on the host side.
 *
 * Responsibilities:
 *  - Generate a unique 4-character alphanumeric session code
 *  - Provide session info for QR code rendering
 *  - Create a BroadcastChannel-based signaling channel for local connections
 *  - Wait for a peer to complete the WebRTC handshake
 */

import type { SignalingChannel, SignalingMessage } from "../transport/WebRTCTransport";

/** Session info exposed to the UI for QR code generation. */
export interface SessionInfo {
  /** 4-character alphanumeric code (e.g. "A92D") */
  sessionCode: string;
  /** Full URL that clients should open (includes session code) */
  connectUrl: string;
  /** Timestamp when the session was created */
  createdAt: number;
}

/** Configuration for creating a session. */
export interface SessionBrokerConfig {
  /**
   * Base URL of the remote client app.
   * The session code will be appended as a query parameter.
   * Example: "https://localhost:5173/remote"
   */
  remoteClientBaseUrl: string;
}

/** Characters used for session code generation (uppercase + digits, excluding ambiguous chars). */
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 4;

/**
 * Generate a cryptographically random session code.
 * Uses crypto.getRandomValues for uniform distribution.
 */
function generateSessionCode(): string {
  const values = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(values);
  return Array.from(values)
    .map((v) => CODE_CHARS[v % CODE_CHARS.length])
    .join("");
}

/**
 * HTTP-based signaling using Server-Sent Events (SSE).
 * Connects to the Vite dev server's local signaling relay.
 * Works across different devices on the same local network!
 */
export class HTTPSignalingChannel implements SignalingChannel {
  private eventSource: EventSource | null = null;
  private handler: ((data: SignalingMessage) => void) | null = null;
  private baseUrl: string;

  constructor(sessionCode: string, isHost: boolean) {
    const senderId = isHost ? "host" : "client";
    // We use relative URL because we are hosted on the Vite server
    this.baseUrl = `/api/signal/${sessionCode}/${senderId}`;

    this.eventSource = new EventSource(this.baseUrl);

    this.eventSource.onmessage = (event) => {
      if (this.handler && event.data) {
        try {
          const message = JSON.parse(event.data);
          this.handler(message as SignalingMessage);
        } catch (e) {
          console.error("[HTTPSignalingChannel] Error parsing message", e);
        }
      }
    };

    this.eventSource.onerror = (err) => {
      console.error("[HTTPSignalingChannel] SSE Error:", err);
    };
  }

  send(data: SignalingMessage): void {
    fetch(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(data),
    }).catch((err) => {
      console.error("[HTTPSignalingChannel] Send failed:", err);
    });
  }

  onMessage(handler: (data: SignalingMessage) => void): void {
    this.handler = handler;
  }

  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.handler = null;
  }
}

export class SessionBroker {
  private sessionInfo: SessionInfo | null = null;
  private config: SessionBrokerConfig;

  constructor(config: SessionBrokerConfig) {
    this.config = config;
  }

  /**
   * Create a new session and return its info for QR code rendering.
   * If a session already exists, it is destroyed first.
   */
  createSession(): SessionInfo {
    if (this.sessionInfo) {
      this.destroySession();
    }

    const sessionCode = generateSessionCode();
    const connectUrl = `${this.config.remoteClientBaseUrl}?session=${sessionCode}`;

    this.sessionInfo = {
      sessionCode,
      connectUrl,
      createdAt: Date.now(),
    };

    return this.sessionInfo;
  }

  /** Get the current session info, or null if no session is active. */
  getSessionInfo(): SessionInfo | null {
    return this.sessionInfo;
  }

  /**
   * Create a signaling channel for the current session.
   * The returned channel can be passed to WebRTCTransport.
   */
  createSignalingChannel(): SignalingChannel {
    if (!this.sessionInfo) {
      throw new Error(
        "[SessionBroker] Cannot create signaling channel — no active session",
      );
    }

    return new HTTPSignalingChannel(this.sessionInfo.sessionCode, true);
  }

  /** Tear down the current session. */
  destroySession(): void {
    this.sessionInfo = null;
  }
}
