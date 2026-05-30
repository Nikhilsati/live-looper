import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconShowcase } from "../../../../web/src/components/IconShowcase";

const meta: Meta<typeof IconShowcase> = {
  title: "Web/IconShowcase",
  component: IconShowcase,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof IconShowcase>;

export const DefaultShowcase: Story = {
  render: () => {
    useEffect(() => {
      // Dynamically inject Tailwind CSS CDN strictly within the story context so the grid aligns correctly.
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }, []);

    return (
      <div style={{ background: "#09090b" }}>
        <IconShowcase />
      </div>
    );
  },
};
