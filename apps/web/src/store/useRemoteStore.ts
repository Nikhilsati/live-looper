/**
 * useRemoteStore — Zustand store for remote connection state.
 *
 * Manages the RemoteHost lifecycle, session creation, peer connections,
 * and provides reactive state for UI components.
 */
import { create } from "zustand";
import type { RemoteConnectionStatus, RemoteCommand } from "@live-looper/types";
import {
  RemoteHost,
  SessionBroker,
  WebRTCTransport,
  type SessionInfo,
} from "@live-looper/remote";

interface RemotePeer {
  peerId: string;
  connectedAt: number;
  latencyMs: number;
}

interface RemoteStore {
  // State
  isSessionActive: boolean;
  sessionInfo: SessionInfo | null;
  connectionStatus: RemoteConnectionStatus;
  peers: RemotePeer[];
  lastCommand: RemoteCommand | null;

  // Internal refs (not serialized, but stored for lifecycle management)
  _host: RemoteHost | null;
  _broker: SessionBroker | null;

  // Actions
  startSession: () => void;
  stopSession: () => void;
  handleIncomingConnection: () => Promise<void>;
}

export const useRemoteStore = create<RemoteStore>((set, get) => ({
  isSessionActive: false,
  sessionInfo: null,
  connectionStatus: "disconnected",
  peers: [],
  lastCommand: null,
  _host: null,
  _broker: null,

  startSession: async () => {
    const state = get();

    // Clean up existing session
    if (state._host) {
      state._host.destroy();
    }

    let baseUrl = `${window.location.origin}/remote`;

    // In dev mode, fetch the local IP so the phone can connect
    if (import.meta.env.DEV) {
      try {
        const res = await fetch("/api/network-info");
        if (res.ok) {
          const { ip, port } = await res.json();
          baseUrl = `http://${ip}:${port}/remote`;
        }
      } catch (e) {
        console.warn("Failed to get network IP, using origin", e);
      }
    }

    const broker = new SessionBroker({
      remoteClientBaseUrl: baseUrl,
    });

    const sessionInfo = broker.createSession();
    const host = new RemoteHost();

    // Listen for host events
    host.on("connection-change", (status) => {
      set({ connectionStatus: status });
    });

    host.on("peer-connected", (peerId) => {
      set((s) => ({
        peers: [
          ...s.peers,
          { peerId, connectedAt: Date.now(), latencyMs: 0 },
        ],
      }));
    });

    host.on("peer-disconnected", (peerId) => {
      set((s) => ({
        peers: s.peers.filter((p) => p.peerId !== peerId),
      }));
    });

    host.on("latency", ({ peerId, rttMs }) => {
      set((s) => ({
        peers: s.peers.map((p) =>
          p.peerId === peerId ? { ...p, latencyMs: rttMs } : p,
        ),
      }));
    });

    host.on("command", (cmd) => {
      set({ lastCommand: cmd });
    });

    set({
      isSessionActive: true,
      sessionInfo,
      _host: host,
      _broker: broker,
      connectionStatus: "disconnected",
      peers: [],
    });
  },

  stopSession: () => {
    const { _host, _broker } = get();

    if (_host) {
      _host.destroy();
    }
    if (_broker) {
      _broker.destroySession();
    }

    set({
      isSessionActive: false,
      sessionInfo: null,
      connectionStatus: "disconnected",
      peers: [],
      lastCommand: null,
      _host: null,
      _broker: null,
    });
  },

  handleIncomingConnection: async () => {
    const { _host, _broker } = get();
    if (!_host || !_broker) return;

    const signaling = _broker.createSignalingChannel();
    const transport = new WebRTCTransport();

    await transport.connect({
      signaling,
      isInitiator: true,
    });

    _host.addPeer(transport);
  },
}));
