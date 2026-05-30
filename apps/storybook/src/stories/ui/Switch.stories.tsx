import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@live-looper/ui";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: "Enable Metronome",
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  },
};

export const CheckedByDefault: Story = {
  args: {
    label: "Auto-Quantize Loops",
  },
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  },
};

export const WithoutLabel: Story = {
  args: {},
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  },
};
