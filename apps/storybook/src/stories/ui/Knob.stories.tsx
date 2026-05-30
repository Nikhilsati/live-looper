import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Knob } from "@live-looper/ui";

const meta: Meta<typeof Knob> = {
  title: "UI/Knob",
  component: Knob,
  tags: ["ai-generated"],
  argTypes: {
    color: { control: "color" },
    size: { control: { type: "range", min: 30, max: 120, step: 5 } },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    unit: { control: "text" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Knob>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    label: "Volume",
    color: "#f97316",
    size: 60,
    step: 1,
    unit: "%",
  },
  render: (args) => {
    const [val, setVal] = useState(50);
    return <Knob {...args} value={val} onChange={setVal} />;
  },
};

export const PanKnob: Story = {
  args: {
    min: -50,
    max: 50,
    label: "Pan",
    color: "#10b981",
    size: 50,
    step: 1,
    unit: "",
  },
  render: (args) => {
    const [val, setVal] = useState(0);
    return <Knob {...args} value={val} onChange={setVal} />;
  },
};

export const HighResolution: Story = {
  args: {
    min: 0,
    max: 1,
    label: "Feedback",
    color: "#a78bfa",
    size: 70,
    step: 0.01,
    unit: "",
  },
  render: (args) => {
    const [val, setVal] = useState(0.5);
    return <Knob {...args} value={val} onChange={setVal} />;
  },
};
