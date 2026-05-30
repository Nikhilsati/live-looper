import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GuitarPracticeView } from "../../../../web/src/components/GuitarPracticeView";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { FXBuilder } from "@live-looper/audio-engine";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof GuitarPracticeView> = {
  title: "Web/GuitarPracticeView",
  component: GuitarPracticeView,
  tags: ["ai-generated"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GuitarPracticeView>;

export const ActivePractice: Story = {
  render: () => {
    useEffect(() => {
      // Mock MediaDevices and AudioContext to avoid actual hardware mic access
      const originalGetUserMedia = navigator.mediaDevices ? navigator.mediaDevices.getUserMedia : null;
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia = async () => {
          return {
            getTracks: () => [{ stop: () => {} }],
          } as any;
        };
      }

      const originalCreateMediaStreamSource = AudioContext.prototype.createMediaStreamSource;
      AudioContext.prototype.createMediaStreamSource = function () {
        return {
          connect: () => {},
        } as any;
      };

      useLooperStore.setState({
        liveTrack: {
          fx: new FXBuilder()
            .withDrive({ enabled: true, amount: 0.5, tone: 0.5 })
            .withReverb({ enabled: true, mix: 0.3, size: 2.0 })
            .build(),
          isMuted: false,
        },
        bpm: 100,
        metronomeOn: false,
        inputDeviceId: "mock-mic",
        setLiveTrackState: (state) => {
          const current = useLooperStore.getState().liveTrack;
          useLooperStore.setState({ liveTrack: { ...current, ...state } });
        },
        setBpm: (b) => useLooperStore.setState({ bpm: b }),
        setMetronomeOn: (m) => useLooperStore.setState({ metronomeOn: m }),
      });

      return () => {
        if (navigator.mediaDevices && originalGetUserMedia) {
          navigator.mediaDevices.getUserMedia = originalGetUserMedia;
        }
        AudioContext.prototype.createMediaStreamSource = originalCreateMediaStreamSource;
      };
    }, []);

    return (
      <div style={{ background: "#070b0f", minHeight: "100vh" }}>
        <GuitarPracticeView />
      </div>
    );
  },
};
