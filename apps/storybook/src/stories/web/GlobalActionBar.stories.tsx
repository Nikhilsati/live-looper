import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlobalActionBar } from "../../../../web/src/components/TrackControls";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { useSessionStore } from "../../../../web/src/store/useSessionStore";
import { FXBuilder } from "@live-looper/types";

const meta: Meta<typeof GlobalActionBar> = {
  title: "Web/GlobalActionBar",
  component: GlobalActionBar,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof GlobalActionBar>;

export const PlanningSession: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        isPlaying: false,
        mode: "planning",
        bpm: 120,
        currentSectionIndex: 0,
        queuedSectionIndex: null,
        sections: [
          { id: "s1", name: "Main Chorus", lengthInBars: 4, order: 0, trackStates: [] },
        ],
        showLayers: false,
        showDevInspector: false,
        setShowLayers: (v) => useLooperStore.setState({ showLayers: v }),
        setShowDevInspector: (v) => useLooperStore.setState({ showDevInspector: v }),
        setBpm: (b) => useLooperStore.setState({ bpm: b }),
        availableInputs: [],
        availableOutputs: [],
        inputDeviceId: null,
        outputDeviceId: null,
        refreshDevices: async () => {},
        smartSnapEnabled: true,
        dualOutputMode: false,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build(),
        },
      });

      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        recordingDuration: 0,
        togglePlayback: async () => {
          const playing = useLooperStore.getState().isPlaying;
          useLooperStore.setState({ isPlaying: !playing });
        },
        setIsSessionArmed: (v) => useSessionStore.setState({ isSessionArmed: v }),
        toggleRecording: async () => {
          const rec = useSessionStore.getState().isSessionRecording;
          useSessionStore.setState({ isSessionRecording: !rec });
        },
      });
    }, []);

    return (
      <div style={{ background: "#0a0a0f", minHeight: "200px", padding: "20px" }}>
        {/* Relative layout wrapper for fixed positioning inside the storybook iframe */}
        <div style={{ position: "relative", width: "100%", height: "100px" }}>
          <GlobalActionBar />
        </div>
      </div>
    );
  },
};

export const RecordingSession: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        isPlaying: true,
        mode: "practice",
        bpm: 100,
        currentSectionIndex: 0,
        queuedSectionIndex: null,
        sections: [
          { id: "s1", name: "Chorus Peak", lengthInBars: 8, order: 0, trackStates: [] },
        ],
        showLayers: false,
        showDevInspector: false,
        setShowLayers: (v) => useLooperStore.setState({ showLayers: v }),
        setShowDevInspector: (v) => useLooperStore.setState({ showDevInspector: v }),
        setBpm: (b) => useLooperStore.setState({ bpm: b }),
        availableInputs: [],
        availableOutputs: [],
        inputDeviceId: null,
        outputDeviceId: null,
        refreshDevices: async () => {},
        smartSnapEnabled: true,
        dualOutputMode: false,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build(),
        },
      });

      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: true,
        recordingDuration: 24500, // 24.5 seconds
        togglePlayback: async () => {
          const playing = useLooperStore.getState().isPlaying;
          useLooperStore.setState({ isPlaying: !playing });
        },
        setIsSessionArmed: (v) => useSessionStore.setState({ isSessionArmed: v }),
        toggleRecording: async () => {
          const rec = useSessionStore.getState().isSessionRecording;
          useSessionStore.setState({ isSessionRecording: !rec });
        },
      });
    }, []);

    return (
      <div style={{ background: "#0a0a0f", minHeight: "200px", padding: "20px" }}>
        <div style={{ position: "relative", width: "100%", height: "100px" }}>
          <GlobalActionBar />
        </div>
      </div>
    );
  },
};
