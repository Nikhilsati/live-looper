import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { InputChannelSelector } from "../../../../web/src/components/InputChannelSelector";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof InputChannelSelector> = {
  title: "Web/InputChannelSelector",
  component: InputChannelSelector,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof InputChannelSelector>;

export const Default: Story = {
  args: {
    trackId: 0,
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        availableInputs: [
          {
            deviceId: "built-in",
            label: "Built-in Microphone (MacBook)",
            kind: "audioinput",
            groupId: "default",
          } as MediaDeviceInfo,
          {
            deviceId: "scarlett-2i2",
            label: "Focusrite Scarlett 2i2 USB Interface",
            kind: "audioinput",
            groupId: "scarlett",
          } as MediaDeviceInfo,
        ],
        channelMapping: ["built-in", null, null, null],
        trackChannelConfig: {
          0: { mode: "stereo" },
          1: { mode: "mono" },
          2: { mode: "stereo" },
          3: { mode: "stereo" },
        },
        setChannelMapping: (trackId, deviceId) => {
          const mapping = [...useLooperStore.getState().channelMapping];
          mapping[trackId] = deviceId;
          useLooperStore.setState({ channelMapping: mapping });
          return Promise.resolve();
        },
        setTrackChannelMode: (trackId, mode) => {
          const configs = { ...useLooperStore.getState().trackChannelConfig };
          configs[trackId] = { mode };
          useLooperStore.setState({ trackChannelConfig: configs });
          return Promise.resolve();
        },
      });
    }, []);

    return (
      <div style={{ padding: "40px", minHeight: "200px" }}>
        <InputChannelSelector {...args} />
      </div>
    );
  },
};
