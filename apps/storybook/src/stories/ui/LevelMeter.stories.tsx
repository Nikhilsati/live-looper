import React, { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LevelMeter } from "@live-looper/ui";

const meta: Meta<typeof LevelMeter> = {
  title: "UI/LevelMeter",
  component: LevelMeter,
  tags: ["ai-generated"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
    vertical: { control: "boolean" },
    bars: { control: { type: "number", min: 5, max: 40 } },
    variant: { control: "select", options: ["segmented", "continuous"] },
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof LevelMeter>;

export const Default: Story = {
  args: {
    value: 0.5,
    vertical: false,
    bars: 16,
    variant: "segmented",
  },
};

export const SegmentedVertical: Story = {
  args: {
    value: 0.75,
    vertical: true,
    bars: 28,
    variant: "segmented",
  },
  render: (args) => (
    <div style={{ height: 240, width: 24 }}>
      <LevelMeter {...args} />
    </div>
  ),
};

export const ContinuousHorizontal: Story = {
  args: {
    value: 0.65,
    vertical: false,
    variant: "continuous",
  },
};

export const ContinuousVertical: Story = {
  args: {
    value: 0.88,
    vertical: true,
    variant: "continuous",
  },
  render: (args) => (
    <div style={{ height: 200, width: 16 }}>
      <LevelMeter {...args} />
    </div>
  ),
};

export const StereoSegmented: Story = {
  args: {
    values: [0.6, 0.45],
    vertical: true,
    bars: 20,
    variant: "segmented",
  },
  render: (args) => (
    <div style={{ height: 200, width: 48 }}>
      <LevelMeter {...args} />
    </div>
  ),
};

export const MultiChannelContinuous: Story = {
  args: {
    values: [0.2, 0.7, 0.98, 0.4],
    vertical: true,
    variant: "continuous",
  },
  render: (args) => (
    <div style={{ height: 160, width: 80 }}>
      <LevelMeter {...args} />
    </div>
  ),
};

export const ActiveSimulation: Story = {
  args: {
    vertical: true,
    bars: 24,
    variant: "segmented",
  },
  render: (args) => {
    const [levels, setLevels] = useState<number[]>([0.1, 0.2]);

    useEffect(() => {
      const interval = setInterval(() => {
        setLevels([
          Math.max(0, 0.2 + 0.7 * Math.sin(Date.now() / 300) + 0.1 * Math.random()),
          Math.max(0, 0.15 + 0.6 * Math.cos(Date.now() / 250) + 0.15 * Math.random()),
        ]);
      }, 50);
      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 300 }}>
        <div>
          <h3>Segmented Stereo Simulation</h3>
          <div style={{ height: 200, width: 50 }}>
            <LevelMeter {...args} values={levels} />
          </div>
        </div>
        <div>
          <h3>Continuous Stereo Simulation</h3>
          <div style={{ height: 200, width: 50 }}>
            <LevelMeter {...args} values={levels} variant="continuous" />
          </div>
        </div>
      </div>
    );
  },
};
