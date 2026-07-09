import mitt from "mitt";
import type { RemoteMessage } from "@live-looper/types";
import type { Transport, TransportState, TransportEvents } from "./Transport";
import { decodeMessage } from "../protocol";

/** Mitt-compatible event map (adds index signature). */
type TransportEventMap = {
  [K in keyof TransportEvents]: TransportEvents[K];
} & Record<string, unknown>;

/**
 * Signaling channel abstraction — decouples ICE/SDP exchange
 * from the transport itself. The host and client inject different
 * signaling implementations (BroadcastChannel, HTTP, WebSocket, etc.).
 */
export interface SignalingChannel {
  send(data: SignalingMessage): void;
  onMessage(handler: (data: SignalingMessage) => void): void;
  close(): void;
}

export type SignalingMessage =
  | { type: "offer"; payload: RTCSessionDescriptionInit }
  | { type: "answer"; payload: RTCSessionDescriptionInit }
  | { type: "candidate"; payload: RTCIceCandidateInit };

/** Configuration for the WebRTC transport. */
export interface WebRTCTransportConfig {
  /** The signaling channel to use for SDP/ICE exchange */
  signaling: SignalingChannel;
  /** Whether this side creates the offer (true = host, false = client) */
  isInitiator: boolean;
  /** Optional STUN/TURN server configuration */
  iceServers?: RTCIceServer[];
}

/** Default STUN servers for ICE candidate gathering. */
const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

/**
 * Auto-reconnect configuration.
 * Exponential backoff: 500ms → 1000ms → 2000ms, then give up.
 */
const MAX_RECONNECT_ATTEMPTS = 3;
const BASE_RECONNECT_DELAY_MS = 500;

/**
 * WebRTCTransport — concrete Transport implementation using
 * native RTCPeerConnection + RTCDataChannel.
 *
 * Data channel config: unordered, unreliable (maxRetransmits: 0)
 * for lowest possible latency. Commands are idempotent and state
 * is overwritten each tick, so dropped messages are acceptable.
 */
export class WebRTCTransport implements Transport {
  private emitter = mitt<TransportEventMap>();
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private signaling: SignalingChannel | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private config: WebRTCTransportConfig | null = null;

  private _state: TransportState = "idle";

  get state(): TransportState {
    return this._state;
  }

  private setState(newState: TransportState): void {
    if (this._state === newState) return;
    this._state = newState;
    this.emitter.emit("state-change", newState);
  }

  async connect(config: WebRTCTransportConfig): Promise<void> {
    this.config = config;
    this.signaling = config.signaling;
    this.reconnectAttempts = 0;

    this.setState("connecting");

    const iceServers = config.iceServers ?? DEFAULT_ICE_SERVERS;

    this.peerConnection = new RTCPeerConnection({ iceServers });

    // ── ICE Candidate Handling ──
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.signaling) {
        this.signaling.send({
          type: "candidate",
          payload: event.candidate.toJSON(),
        });
      }
    };

    // ── Connection State Monitoring ──
    this.peerConnection.oniceconnectionstatechange = () => {
      const iceState = this.peerConnection?.iceConnectionState;

      if (iceState === "connected" || iceState === "completed") {
        this.reconnectAttempts = 0;
      }

      if (iceState === "disconnected") {
        this.attemptReconnect();
      }

      if (iceState === "failed") {
        this.setState("error");
        this.emitter.emit("error", new Error("ICE connection failed"));
        this.attemptReconnect();
      }

      if (iceState === "closed") {
        this.setState("closed");
      }
    };

    // ── Signaling Message Handler ──
    this.signaling.onMessage(async (message) => {
      if (!this.peerConnection) return;

      try {
        if (message.type === "offer") {
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(message.payload),
          );
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          this.signaling?.send({
            type: "answer",
            payload: answer,
          });
        }

        if (message.type === "answer") {
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(message.payload),
          );
        }

        if (message.type === "candidate") {
          await this.peerConnection.addIceCandidate(
            new RTCIceCandidate(message.payload),
          );
        }
      } catch (err) {
        this.emitter.emit(
          "error",
          err instanceof Error ? err : new Error(String(err)),
        );
      }
    });

    if (config.isInitiator) {
      // Host: create the data channel and the offer
      this.dataChannel = this.peerConnection.createDataChannel(
        "live-looper-remote",
        {
          ordered: false,
          maxRetransmits: 0,
        },
      );
      this.setupDataChannel(this.dataChannel);

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.signaling.send({ type: "offer", payload: offer });
    } else {
      // Client: wait for the host to create the data channel
      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.setupDataChannel(this.dataChannel);
      };
    }
  }

  send(message: RemoteMessage): void {
    if (this._state !== "open" || !this.dataChannel) {
      throw new Error(
        `[WebRTCTransport] Cannot send — transport state is "${this._state}"`,
      );
    }

    try {
      this.dataChannel.send(JSON.stringify(message));
    } catch (err) {
      this.emitter.emit(
        "error",
        err instanceof Error ? err : new Error(String(err)),
      );
    }
  }

  disconnect(): void {
    this.clearReconnectTimer();

    if (this.dataChannel) {
      this.dataChannel.onopen = null;
      this.dataChannel.onclose = null;
      this.dataChannel.onmessage = null;
      this.dataChannel.onerror = null;
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.onicecandidate = null;
      this.peerConnection.oniceconnectionstatechange = null;
      this.peerConnection.ondatachannel = null;
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.signaling) {
      this.signaling.close();
      this.signaling = null;
    }

    this.setState("closed");
  }

  on<K extends keyof TransportEvents>(
    event: K,
    handler: (data: TransportEvents[K]) => void,
  ): void {
    this.emitter.on(event, handler as (data: TransportEventMap[string]) => void);
  }

  off<K extends keyof TransportEvents>(
    event: K,
    handler: (data: TransportEvents[K]) => void,
  ): void {
    this.emitter.off(event, handler as (data: TransportEventMap[string]) => void);
  }

  // ── Private Helpers ──

  private setupDataChannel(channel: RTCDataChannel): void {
    channel.binaryType = "arraybuffer";

    channel.onopen = () => {
      this.setState("open");
    };

    if (channel.readyState === "open") {
      this.setState("open");
    }

    channel.onclose = () => {
      if (this._state !== "closed") {
        this.attemptReconnect();
      }
    };

    channel.onerror = (event) => {
      const errorEvent = event as RTCErrorEvent;
      const error =
        errorEvent.error ??
        new Error("RTCDataChannel error");
      this.emitter.emit("error", error);
    };

    channel.onmessage = (event) => {
      const message = decodeMessage(event.data);
      if (message) {
        this.emitter.emit("message", message);
      }
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.setState("error");
      this.emitter.emit(
        "error",
        new Error(
          `[WebRTCTransport] Reconnection failed after ${MAX_RECONNECT_ATTEMPTS} attempts`,
        ),
      );
      return;
    }

    this.clearReconnectTimer();

    const delay =
      BASE_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.setState("connecting");

    this.reconnectTimer = setTimeout(async () => {
      // Tear down old connection and re-establish
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
      if (this.dataChannel) {
        this.dataChannel.close();
        this.dataChannel = null;
      }

      if (this.config) {
        try {
          await this.connect(this.config);
        } catch (err) {
          this.emitter.emit(
            "error",
            err instanceof Error ? err : new Error(String(err)),
          );
          this.attemptReconnect();
        }
      }
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
