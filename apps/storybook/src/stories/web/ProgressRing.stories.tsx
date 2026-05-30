import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgressRing } from "../../../../web/src/components/TrackControls";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof ProgressRing> = {
  title: "Web/ProgressRing",
  component: ProgressRing,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof ProgressRing>;

export const Default: Story = {
  args: {
    progress: 0.25,
    bar: 2,
    beat: 1,
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        currentSectionIndex: 0,
        sections: [
          {
            id: "s1",
            name: "Intro",
            lengthInBars: 4,
            order: 0,
            trackStates: [],
          },
        ],
      });
    }, []);

    return <ProgressRing {...args} />;
  },
};

export const HalfwayThrough: Story = {
  args: {
    progress: 0.5,
    bar: 3,
    beat: 1,
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        currentSectionIndex: 0,
        sections: [
          {
            id: "s1",
            name: "Verse",
            lengthInBars: 4,
            order: 0,
            trackStates: [],
          },
        ],
      });
    }, []);

    return <ProgressRing {...args} />;
  },
};
