import React, { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Waveform } from "@live-looper/ui";

const meta: Meta<typeof Waveform> = {
  title: "UI/Waveform",
  component: Waveform,
  argTypes: {
    height: { control: "number" },
    bars: { control: "number" },
    beatsPerBar: { control: "number" },
    variant: { control: "select", options: ["default", "minimal"] },
  },
};

export default meta;
type Story = StoryObj<typeof Waveform>;

// Helper to generate mock waveform data
const generateMockData = (count: number) => {
  const data: number[] = [];
  for (let i = 0; i < count; i++) {
    // Generate organic-looking amplitude curves
    const value =
      0.1 +
      0.5 * Math.sin((i / count) * Math.PI * 4) * Math.sin((i / count) * Math.PI * 8) +
      0.4 * Math.random();
    data.push(Math.max(0.05, value));
  }
  return data;
};

const mockData = generateMockData(40);

export const Default: Story = {
  args: {
    data: mockData,
    progress: 0.35,
    height: 60,
    bars: 4,
    beatsPerBar: 4,
    variant: "default",
  },
};

export const Minimal: Story = {
  args: {
    data: mockData,
    progress: 0.6,
    height: 30,
    bars: 0,
    variant: "minimal",
  },
};

export const PlaybackSimulation: Story = {
  args: {
    data: generateMockData(60),
    height: 80,
    bars: 8,
    beatsPerBar: 4,
    variant: "default",
  },
  render: (args) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 1 ? 0 : prev + 0.005));
      }, 50);
      return () => clearInterval(interval);
    }, []);

    return <Waveform {...args} progress={progress} />;
  },
};
