import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrackControls } from "../../../../web/src/components/TrackControls";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { FXBuilder } from "@live-looper/audio-engine";

const meta: Meta<typeof TrackControls> = {
  title: "Web/TrackControls",
  component: TrackControls,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof TrackControls>;

const mockTracks = [
  {
    isMuted: false,
    isSoloed: false,
    isRecording: true, // Recording state (red pulsating border)
    isArmed: false,
    hasAudio: false,
    layerCount: 0,
    waveformData: [],
    fx: new FXBuilder().build(),
  },
  {
    isMuted: false,
    isSoloed: false,
    isRecording: false,
    isArmed: true, // Armed state (purple blinking border)
    hasAudio: false,
    layerCount: 0,
    waveformData: [],
    fx: new FXBuilder().build(),
  },
  {
    isMuted: false,
    isSoloed: false,
    isRecording: false,
    isArmed: false,
    hasAudio: true, // Playing state with waveform
    layerCount: 3,
    waveformData: [0.1, 0.3, 0.6, 0.9, 0.7, 0.4, 0.5, 0.8, 0.3, 0.2, 0.4, 0.7],
    fx: new FXBuilder().build(),
  },
  {
    isMuted: true, // Muted state (greyed out)
    isSoloed: false,
    isRecording: false,
    isArmed: false,
    hasAudio: true,
    layerCount: 1,
    waveformData: [0.2, 0.4, 0.3, 0.2, 0.4, 0.5, 0.3],
    fx: new FXBuilder().build(),
  },
];

export const FullPanelShowcase: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: true,
        bpm: 120,
        currentBar: 2,
        currentBeat: 3,
        sectionProgress: 0.45,
        currentSectionIndex: 0,
        queuedSectionIndex: null,
        sections: [
          {
            id: "s1",
            name: "Main Chorus",
            lengthInBars: 4,
            order: 0,
            trackStates: [],
          },
        ],
        tracks: mockTracks as any,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build(),
        },
        inputLevels: [0.1, 0.05, 0.8, 0],
        channelMapping: [null, null, null, null],
        trackChannelConfig: {
          0: { mode: "stereo" },
          1: { mode: "stereo" },
          2: { mode: "stereo" },
          3: { mode: "stereo" },
        },
      });
    }, []);

    return (
      <div style={{ width: "100%", maxWidth: "1200px", padding: "12px" }}>
        <TrackControls />
      </div>
    );
  },
};

