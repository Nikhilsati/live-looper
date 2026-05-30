import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HeaderIndications } from "../../../../web/src/components/TrackControls";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof HeaderIndications> = {
  title: "Web/HeaderIndications",
  component: HeaderIndications,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof HeaderIndications>;

export const Default: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: true,
        currentBar: 2,
        currentBeat: 3,
        sectionProgress: 0.45,
        currentSectionIndex: 0,
        sections: [
          { id: "s1", name: "Main Chorus", lengthInBars: 4, order: 0, trackStates: [] },
        ],
      });
    }, []);

    return (
      <div style={{ background: "#0a0a0f", padding: "20px", maxWidth: "400px" }}>
        <HeaderIndications />
      </div>
    );
  },
};
