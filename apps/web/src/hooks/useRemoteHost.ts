/**
 * useRemoteHost — bridge hook that connects RemoteHost commands
 * to the looper store actions, and broadcasts engine state to
 * connected remote clients.
 *
 * Mount this hook once in the LooperWorkspace to activate the bridge.
 */
import { useEffect, useRef } from "react";
import { useRemoteStore } from "../store/useRemoteStore";
import { useLooperStore } from "../store/useLooperStore";
import { useTransportStore } from "../store/useTransportStore";
import type { RemoteCommand, RemoteSyncState } from "@live-looper/types";

export function useRemoteHost() {
  const host = useRemoteStore((s) => s._host);
  const lastCommand = useRemoteStore((s) => s.lastCommand);
  const commandHandledRef = useRef<RemoteCommand | null>(null);

  // ── Command Dispatch: route incoming remote commands to store actions ──
  useEffect(() => {
    if (!lastCommand || lastCommand === commandHandledRef.current) return;
    commandHandledRef.current = lastCommand;

    const looper = useLooperStore.getState();
    const transport = useTransportStore.getState();

    switch (lastCommand.type) {
      case "PLAY":
        if (!transport.isPlaying) {
          transport.togglePlayback();
        }
        break;

      case "STOP":
        if (transport.isPlaying) {
          transport.togglePlayback();
        }
        break;

      case "ARM_TRACK": {
        const trackId = (lastCommand.payload?.trackId as number) ?? 0;
        looper.toggleTrackRecording(trackId);
        break;
      }

      case "MUTE_TRACK": {
        const trackId = (lastCommand.payload?.trackId as number) ?? 0;
        looper.setTrackState(trackId, {
          isMuted: !looper.tracks[trackId]?.isMuted,
        });
        break;
      }

      case "SOLO_TRACK": {
        const trackId = (lastCommand.payload?.trackId as number) ?? 0;
        looper.setSolo(trackId);
        break;
      }

      case "SECTION_CHANGE": {
        const sectionIndex = (lastCommand.payload?.sectionIndex as number) ?? 0;
        looper.setQueuedSection(sectionIndex);
        break;
      }

      case "SET_BPM": {
        const bpm = lastCommand.payload?.bpm as number;
        if (bpm && bpm > 0) {
          transport.setBpm(bpm);
        }
        break;
      }

      case "UNDO_LAYER": {
        const trackId = (lastCommand.payload?.trackId as number) ?? 0;
        // Trigger undo via audio engine
        import("@live-looper/audio-engine").then(({ audioEngine }) => {
          audioEngine.undoLayer(trackId);
        });
        break;
      }

      case "CLEAR_TRACK": {
        const trackId = (lastCommand.payload?.trackId as number) ?? 0;
        import("@live-looper/audio-engine").then(({ audioEngine }) => {
          audioEngine.clearTrack(trackId);
        });
        break;
      }

      case "CLEAR_ALL_TRACKS":
        import("@live-looper/audio-engine").then(({ audioEngine }) => {
          audioEngine.clearAllTracks();
        });
        if (transport.isPlaying) {
          transport.togglePlayback();
        }
        break;

      case "MUTE_LIVE_TRACK":
        looper.setLiveTrackState({
          isMuted: !looper.liveTrack.isMuted,
        });
        break;

      default:
        console.warn(
          `[useRemoteHost] Unhandled remote command: ${lastCommand.type}`,
        );
    }
  }, [lastCommand]);

  // ── State Broadcasting: push looper state to all connected remotes ──
  useEffect(() => {
    if (!host) return;

    const broadcastCurrentState = () => {
      const transport = useTransportStore.getState();
      const looper = useLooperStore.getState();

      const syncState: RemoteSyncState = {
        isPlaying: transport.isPlaying,
        bpm: transport.bpm,
        currentBar: transport.currentBar,
        currentBeat: transport.currentBeat,
        sectionProgress: transport.sectionProgress,
        currentSectionIndex: transport.currentSectionIndex,
        queuedSectionIndex: transport.queuedSectionIndex,
        mode: looper.mode,

        tracks: looper.tracks.map((t) => ({
          isMuted: t.isMuted,
          isSoloed: t.isSoloed,
          isArmed: t.isArmed,
          isRecording: t.isRecording,
          hasAudio: t.hasAudio,
          layerCount: t.layerCount,
          inputGain: t.inputGain,
          outputGain: t.outputGain,
        })),

        liveTrack: {
          isMuted: looper.liveTrack.isMuted,
          inputGain: looper.liveTrack.inputGain,
          outputGain: looper.liveTrack.outputGain,
        },

        sections: looper.sections.map((s) => ({
          id: s.id,
          name: s.name,
          lengthInBars: s.lengthInBars,
        })),

        jitter: looper.jitter ?? 0,
        lastHitOffset: looper.lastHitOffset ?? 0,
      };

      host.broadcastState(syncState);
    };

    // Broadcast immediately on mount
    broadcastCurrentState();

    // Subscribe to stores for real-time broadcasting
    const unsubTransport = useTransportStore.subscribe(broadcastCurrentState);
    const unsubLooper = useLooperStore.subscribe(broadcastCurrentState);

    // Push initial state to newly connected peers
    const handlePeerConnected = () => broadcastCurrentState();
    host.on("peer-connected", handlePeerConnected);

    return () => {
      unsubTransport();
      unsubLooper();
      host.off("peer-connected", handlePeerConnected);
    };
  }, [host]);
}
