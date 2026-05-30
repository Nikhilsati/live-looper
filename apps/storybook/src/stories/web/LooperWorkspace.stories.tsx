import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LooperWorkspace } from "../../../../web/src/components/LooperWorkspace";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { useSessionStore } from "../../../../web/src/store/useSessionStore";
import { FXBuilder } from "@live-looper/audio-engine";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const meta: Meta<typeof LooperWorkspace> = {
  title: "Web/LooperWorkspace",
  component: LooperWorkspace,
  tags: ["ai-generated"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/projects/p-workspace"]}>
        <Routes>
          <Route path="/projects/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LooperWorkspace>;

const mockTracks = [
  {
    isMuted: false,
    isSoloed: false,
    isRecording: false,
    isArmed: false,
    hasAudio: true,
    layerCount: 2,
    waveformData: [0.1, 0.4, 0.6, 0.7, 0.5],
    fx: new FXBuilder().build(),
  },
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
  {
    isMuted: false,
    isSoloed: false,
    isRecording: false,
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
    isArmed: false,
    hasAudio: false,
    layerCount: 0,
    waveformData: [],
    fx: new FXBuilder().build(),
  },
];

export const PlanningWorkspace: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        currentProject: { id: "p-workspace", name: "Indie Groove Jam" } as any,
        mode: "planning",
        isPlaying: false,
        bpm: 108,
        currentBar: 1,
        currentBeat: 1,
        sectionProgress: 0,
        currentSectionIndex: 0,
        queuedSectionIndex: null,
        sections: [
          { id: "s1", name: "Main Intro", lengthInBars: 4, order: 0, trackStates: [] },
          { id: "s2", name: "Chorus Peak", lengthInBars: 8, order: 1, trackStates: [] },
        ],
        tracks: mockTracks as any,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build(),
        },
        inputLevels: [0.02, 0.01, 0, 0],
        channelMapping: [null, null, null, null],
        trackChannelConfig: {
          0: { mode: "stereo" },
          1: { mode: "stereo" },
          2: { mode: "stereo" },
          3: { mode: "stereo" },
        },
        showDevInspector: false,
        loadProject: async (id) => console.log("Workspace loading project:", id),
        refreshDevices: async () => console.log("Workspace refresh devices"),
        closeProject: () => console.log("Workspace close project"),
        toggleTrackRecording: (id) => console.log("Toggle track record:", id),
      });

      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: false,
        togglePlayback: async () => console.log("Toggle playback action"),
      });
    }, []);

    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
        <LooperWorkspace />
      </div>
    );
  },
};
