import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MetronomeButton } from "../../../../web/src/components/TrackControls";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof MetronomeButton> = {
  title: "Web/MetronomeButton",
  component: MetronomeButton,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof MetronomeButton>;

export const MetronomeOff: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        metronomeOn: false,
        setMetronomeOn: (v) => {
          useLooperStore.setState({ metronomeOn: v });
        },
      });
    }, []);

    return <MetronomeButton />;
  },
};

export const MetronomeOn: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        metronomeOn: true,
        setMetronomeOn: (v) => {
          useLooperStore.setState({ metronomeOn: v });
        },
      });
    }, []);

    return <MetronomeButton />;
  },
};
