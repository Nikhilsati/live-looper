// ── Host-side ──
export { RemoteHost } from "./host/RemoteHost";
export type { RemoteHostEvents } from "./host/RemoteHost";
export { SessionBroker, HTTPSignalingChannel } from "./host/SessionBroker";
export type { SessionInfo, SessionBrokerConfig } from "./host/SessionBroker";

// ── Client-side ──
export { RemoteClient } from "./client/RemoteClient";
export type { RemoteClientEvents } from "./client/RemoteClient";

// ── Transport ──
export { WebRTCTransport } from "./transport/WebRTCTransport";
export type {
  SignalingChannel,
  SignalingMessage,
  WebRTCTransportConfig,
} from "./transport/WebRTCTransport";
export type {
  Transport,
  TransportState,
  TransportEvents,
} from "./transport/Transport";

// ── Protocol ──
export { encodeMessage, decodeMessage, PROTOCOL_VERSION } from "./protocol";
