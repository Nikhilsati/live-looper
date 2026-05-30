import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BpmEditPopup } from "../../../../web/src/components/TrackControls";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof BpmEditPopup> = {
  title: "Web/BpmEditPopup",
  component: BpmEditPopup,
  tags: ["ai-generated"],
  argTypes: {
    onClose: { action: "onClose clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof BpmEditPopup>;

export const Default: Story = {
  args: {
    onClose: () => console.log("onClose clicked"),
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        bpm: 120,
        isPlaying: false,
        setBpm: (b) => {
          useLooperStore.setState({ bpm: b });
        },
      });
    }, []);

    return (
      <div style={{ position: "relative", minHeight: "350px", width: "100%" }}>
        <BpmEditPopup {...args} />
      </div>
    );
  },
};
