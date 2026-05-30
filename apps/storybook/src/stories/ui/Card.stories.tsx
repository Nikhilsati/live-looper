import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, Heading, Text, Button } from "@live-looper/ui";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    style: {
      padding: "20px",
      maxWidth: "400px",
    },
  },
  render: (args) => (
    <Card {...args}>
      <Heading style={{ fontSize: "18px", marginBottom: "8px" }}>Track Title</Heading>
      <Text style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
        Configure track settings, routing channels, and loop levels here.
      </Text>
      <div style={{ display: "flex", gap: "8px" }}>
        <Button variant="primary" style={{ padding: "8px 16px" }}>
          Edit Settings
        </Button>
        <Button variant="outline" style={{ padding: "8px 16px" }}>
          Mute Track
        </Button>
      </div>
    </Card>
  ),
};

export const BorderedOrCustomBackground: Story = {
  args: {
    style: {
      padding: "24px",
      maxWidth: "400px",
      border: "1px solid rgba(167, 139, 250, 0.3)",
      background: "rgba(167, 139, 250, 0.05)",
    },
  },
  render: (args) => (
    <Card {...args}>
      <Heading style={{ fontSize: "18px", color: "#a78bfa", marginBottom: "8px" }}>
        Premium Card
      </Heading>
      <Text style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
        This card uses a custom border and subtle glowing background to indicate an active state.
      </Text>
    </Card>
  ),
};
