import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ModeSwitcher } from "../../../../web/src/components/ModeSwitcher";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { useSessionStore } from "../../../../web/src/store/useSessionStore";

const meta: Meta<typeof ModeSwitcher> = {
  title: "Web/ModeSwitcher",
  component: ModeSwitcher,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof ModeSwitcher>;

export const PlanningMode: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        setMode: (mode) => {
          useLooperStore.setState({ mode });
          return Promise.resolve();
        },
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: false,
      });
    }, []);

    return <ModeSwitcher />;
  },
};

export const PracticeMode: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "practice",
        setMode: (mode) => {
          useLooperStore.setState({ mode });
          return Promise.resolve();
        },
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: false,
      });
    }, []);

    return <ModeSwitcher />;
  },
};

export const LiveModeActive: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "live",
        setMode: (mode) => {
          useLooperStore.setState({ mode });
          return Promise.resolve();
        },
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: false,
      });
    }, []);

    return <ModeSwitcher />;
  },
};

export const ReplayingSession: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        setMode: (mode) => {
          useLooperStore.setState({ mode });
          return Promise.resolve();
        },
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: true, // Replaying session status active
      });
    }, []);

    return <ModeSwitcher />;
  },
};
