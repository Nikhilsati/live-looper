import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@live-looper/ui";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "success",
        "danger",
        "warning",
        "accent",
        "ghost",
        "active-primary",
        "active-warning",
        "outline",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "none"],
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    children: "Button Text",
    variant: "primary",
    size: "none",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success Button",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Button",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning Button",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
    children: "Accent Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};
