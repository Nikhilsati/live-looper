import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPopover } from "../../../../web/src/components/SettingsPopover";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof SettingsPopover> = {
  title: "Web/SettingsPopover",
  component: SettingsPopover,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof SettingsPopover>;

const mockDevices = [
  { deviceId: "default", label: "System Default Device", kind: "audioinput" },
  { deviceId: "mic-1", label: "Built-in Microphone", kind: "audioinput" },
  { deviceId: "audio-interface-in", label: "Focusrite Scarlett Solo (Input)", kind: "audioinput" },
  { deviceId: "out-1", label: "Built-in Speakers", kind: "audiooutput" },
  { deviceId: "audio-interface-out", label: "Focusrite Scarlett Solo (Output)", kind: "audiooutput" },
];

export const Default: Story = {
  args: {
    onClose: () => console.log("Close settings popover"),
    showDemoOption: true,
    showSmartSnap: true,
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        availableInputs: mockDevices.filter((d) => d.kind === "audioinput") as any,
        availableOutputs: mockDevices.filter((d) => d.kind === "audiooutput") as any,
        inputDeviceId: "mic-1",
        outputDeviceId: "out-1",
        performerOutputDeviceId: "out-1",
        smartSnapEnabled: true,
        dualOutputMode: false,
        refreshDevices: async () => console.log("Refreshing devices..."),
        setInputDevice: async (id) => {
          console.log("Set input device", id);
          useLooperStore.setState({ inputDeviceId: id });
        },
        setOutputDevice: async (id) => {
          console.log("Set output device", id);
          useLooperStore.setState({ outputDeviceId: id });
        },
        setPerformerOutputDevice: async (id) => {
          console.log("Set cue/performer output device", id);
          useLooperStore.setState({ performerOutputDeviceId: id });
        },
        setSmartSnapEnabled: (v) => {
          console.log("Set smart snap", v);
          useLooperStore.setState({ smartSnapEnabled: v });
        },
        setDualOutputMode: (v) => {
          console.log("Set dual output mode", v);
          useLooperStore.setState({ dualOutputMode: v });
        },
        loadDemoData: () => console.log("Loading demo data..."),
      });
    }, []);

    return (
      <div style={{ position: "relative", height: "350px", width: "260px", background: "#0a0a0f", padding: "10px" }}>
        <SettingsPopover {...args} style={{ position: "static", bottom: "auto", right: "auto" }} />
      </div>
    );
  },
};

export const DualOutputActive: Story = {
  args: {
    onClose: () => console.log("Close settings popover"),
    showDemoOption: true,
    showSmartSnap: true,
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        availableInputs: mockDevices.filter((d) => d.kind === "audioinput") as any,
        availableOutputs: mockDevices.filter((d) => d.kind === "audiooutput") as any,
        inputDeviceId: "audio-interface-in",
        outputDeviceId: "out-1",
        performerOutputDeviceId: "audio-interface-out",
        smartSnapEnabled: false,
        dualOutputMode: true,
        refreshDevices: async () => console.log("Refreshing devices..."),
        setInputDevice: async (id) => useLooperStore.setState({ inputDeviceId: id }),
        setOutputDevice: async (id) => useLooperStore.setState({ outputDeviceId: id }),
        setPerformerOutputDevice: async (id) => useLooperStore.setState({ performerOutputDeviceId: id }),
        setSmartSnapEnabled: (v) => useLooperStore.setState({ smartSnapEnabled: v }),
        setDualOutputMode: (v) => useLooperStore.setState({ dualOutputMode: v }),
        loadDemoData: () => console.log("Loading demo data..."),
      });
    }, []);

    return (
      <div style={{ position: "relative", height: "420px", width: "260px", background: "#0a0a0f", padding: "10px" }}>
        <SettingsPopover {...args} style={{ position: "static", bottom: "auto", right: "auto" }} />
      </div>
    );
  },
};
