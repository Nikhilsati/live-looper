import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrackPad } from "../../../../web/src/components/track/TrackPad";
import { LiveTrackPad } from "../../../../web/src/components/track/LiveTrackPad";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { FXBuilder } from "@live-looper/audio-engine";

const meta: Meta<typeof TrackPad> = {
  title: "Web/TrackPad",
  component: TrackPad,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof TrackPad>;

export const PlayingTrack: Story = {
  args: {
    trackId: 0,
    onOpenFX: (id) => console.log("Open FX for track", id),
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: true,
        tracks: [
          {
            isMuted: false,
            isSoloed: false,
            isRecording: false,
            isArmed: false,
            hasAudio: true,
            layerCount: 2,
            waveformData: [0.1, 0.4, 0.8, 0.5, 0.3, 0.6, 0.7],
            fx: new FXBuilder().build(),
          },
        ] as any,
      });
    }, []);

    return (
      <div style={{ maxWidth: "280px" }}>
        <TrackPad {...args} />
      </div>
    );
  },
};

export const ArmedTrack: Story = {
  args: {
    trackId: 0,
    onOpenFX: (id) => console.log("Open FX for track", id),
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: true,
        tracks: [
          {
            isMuted: false,
            isSoloed: false,
            isRecording: false,
            isArmed: true,
            hasAudio: false,
            layerCount: 0,
            waveformData: [],
            fx: new FXBuilder().build(),
          },
        ] as any,
      });
    }, []);

    return (
      <div style={{ maxWidth: "280px" }}>
        <TrackPad {...args} />
      </div>
    );
  },
};

export const RecordingTrack: Story = {
  args: {
    trackId: 0,
    onOpenFX: (id) => console.log("Open FX for track", id),
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: true,
        tracks: [
          {
            isMuted: false,
            isSoloed: false,
            isRecording: true,
            isArmed: false,
            hasAudio: false,
            layerCount: 0,
            waveformData: [],
            fx: new FXBuilder().build(),
          },
        ] as any,
      });
    }, []);

    return (
      <div style={{ maxWidth: "280px" }}>
        <TrackPad {...args} />
      </div>
    );
  },
};

export const LiveTrack: StoryObj<typeof LiveTrackPad> = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "live",
        isPlaying: true,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build(),
        },
      });
    }, []);

    return (
      <div style={{ maxWidth: "280px" }}>
        <LiveTrackPad onOpenFX={(id) => console.log("Open Live FX", id)} />
      </div>
    );
  },
};

