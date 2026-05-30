import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { KeyboardCheatSheet } from "../../../../web/src/components/KeyboardCheatSheet";

const meta: Meta<typeof KeyboardCheatSheet> = {
  title: "Web/KeyboardCheatSheet",
  component: KeyboardCheatSheet,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof KeyboardCheatSheet>;

export const Default: Story = {
  render: () => {
    return (
      <div style={{ background: "#0a0a0f", minHeight: "200px", padding: "20px" }}>
        {/* We place it in a relative container so it positions correctly inside Storybook iframe */}
        <div style={{ position: "relative", width: "100%", height: "150px" }}>
          <KeyboardCheatSheet />
        </div>
      </div>
    );
  },
};
