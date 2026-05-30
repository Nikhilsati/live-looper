import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChannelLevels } from "../../../../web/src/components/ChannelLevels";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof ChannelLevels> = {
  title: "Web/ChannelLevels",
  component: ChannelLevels,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof ChannelLevels>;

export const DefaultLevels: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        inputLevels: [0.15, 0.45, 0.05, 0.75],
      });
    }, []);

    return <ChannelLevels />;
  },
};

export const ActiveLevelsSimulation: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        inputLevels: [0, 0, 0, 0],
      });

      const interval = setInterval(() => {
        useLooperStore.setState({
          inputLevels: [
            Math.max(0, 0.1 + 0.8 * Math.random()),
            Math.max(0, 0.2 + 0.7 * Math.random()),
            Math.max(0, 0.05 + 0.9 * Math.random()),
            Math.max(0, 0.02 + 0.3 * Math.random()),
          ],
        });
      }, 80);

      return () => clearInterval(interval);
    }, []);

    return <ChannelLevels />;
  },
};
