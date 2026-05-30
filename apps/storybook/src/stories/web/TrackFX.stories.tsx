import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrackFX } from "../../../../web/src/components/TrackFX";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof TrackFX> = {
  title: "Web/TrackFX",
  component: TrackFX,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof TrackFX>;

const mockFx = {
  noiseGate: { enabled: false, threshold: -45, attack: 0.01, release: 0.1 },
  eq: { low: 1.5, mid: -2.0, high: 3.5 },
  compressor: { threshold: -18, ratio: 3.5, gain: 3 },
  drive: { enabled: true, amount: 0.4, tone: 0.6 },
  chorus: { enabled: true, rate: 1.2, depth: 0.5, mix: 0.4, voices: 2 },
  phaser: { enabled: false, rate: 0.5, depth: 0.5, stages: 4 },
  tremolo: { enabled: false, rate: 5, depth: 0.7 },
  delay: { enabled: true, time: 0.35, feedback: 0.3, mix: 0.25, mode: "pingpong", filter: 0.8 },
  reverb: { enabled: true, mix: 0.3, size: 2.5, predelay: 15, damping: 0.5 },
  pan: 15,
};

export const TrackPedalboard: Story = {
  args: {
    trackId: 0,
    onClose: () => console.log("Close pedalboard"),
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        tracks: [
          {
            fx: mockFx as any,
            isMuted: false,
            isSoloed: false,
            isRecording: false,
            isArmed: false,
            hasAudio: true,
            layerCount: 1,
            waveformData: [],
          },
        ],
        setTrackFX: (trackId, fxState) => {
          const currentTracks = [...useLooperStore.getState().tracks];
          currentTracks[trackId] = {
            ...currentTracks[trackId],
            fx: { ...currentTracks[trackId].fx, ...fxState },
          };
          useLooperStore.setState({ tracks: currentTracks });
        },
      });
    }, []);

    return (
      <div style={{ padding: "16px", background: "#0a0a0f" }}>
        <TrackFX {...args} />
      </div>
    );
  },
};

export const LiveTrackPedalboard: Story = {
  args: {
    trackId: "live",
    onClose: () => console.log("Close live pedalboard"),
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        liveTrack: {
          fx: mockFx as any,
          isMuted: false,
        },
        setLiveTrackState: (state) => {
          const currentLiveTrack = useLooperStore.getState().liveTrack;
          useLooperStore.setState({
            liveTrack: { ...currentLiveTrack, ...state },
          });
        },
      });
    }, []);

    return (
      <div style={{ padding: "16px", background: "#0a0a0f" }}>
        <TrackFX {...args} />
      </div>
    );
  },
};
