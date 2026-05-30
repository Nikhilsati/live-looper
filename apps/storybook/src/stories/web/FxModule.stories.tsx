import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FxModule } from "../../../../web/src/components/TrackFX";
import { Knob } from "@live-looper/ui";
import { DelayIcon, ReverbIcon, ChorusIcon, DriveIcon } from "@live-looper/icons";

const meta: Meta<typeof FxModule> = {
  title: "Web/FxModule",
  component: FxModule,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof FxModule>;

export const Delay: Story = {
  args: {
    name: "Delay",
    color: "#38bdf8",
    icon: <DelayIcon size={12} />,
    cols: "1fr",
    moduleWidth: 96,
  },
  render: (args) => {
    const [enabled, setEnabled] = useState(true);
    const [time, setTime] = useState(0.5);
    const [feedback, setFeedback] = useState(0.4);

    return (
      <FxModule {...args} enabled={enabled} onToggle={setEnabled}>
        <Knob
          color="#38bdf8"
          size={52}
          label="Time"
          unit="s"
          value={time}
          min={0.01}
          max={2}
          onChange={setTime}
        />
        <Knob
          color="#38bdf8"
          size={52}
          label="Fdbk"
          unit="%"
          value={feedback * 100}
          min={0}
          max={100}
          onChange={(v) => setFeedback(v / 100)}
        />
      </FxModule>
    );
  },
};

export const Reverb: Story = {
  args: {
    name: "Reverb",
    color: "#f472b6",
    icon: <ReverbIcon size={12} />,
    cols: "1fr",
    moduleWidth: 96,
  },
  render: (args) => {
    const [enabled, setEnabled] = useState(false);
    const [mix, setMix] = useState(0.3);

    return (
      <FxModule {...args} enabled={enabled} onToggle={setEnabled}>
        <Knob
          color="#f472b6"
          size={52}
          label="Mix"
          unit="%"
          value={mix * 100}
          min={0}
          max={100}
          onChange={(v) => setMix(v / 100)}
        />
      </FxModule>
    );
  },
};

export const Overdrive: Story = {
  args: {
    name: "Drive",
    color: "#f97316",
    icon: <DriveIcon size={12} />,
    cols: "1fr",
    moduleWidth: 96,
  },
  render: (args) => {
    const [enabled, setEnabled] = useState(true);
    const [amt, setAmt] = useState(0.5);
    const [tone, setTone] = useState(0.6);

    return (
      <FxModule {...args} enabled={enabled} onToggle={setEnabled}>
        <Knob color="#f97316" size={52} label="Amt" value={amt} min={0} max={1} onChange={setAmt} />
        <Knob
          color="#f97316"
          size={52}
          label="Tone"
          value={tone}
          min={0}
          max={1}
          onChange={setTone}
        />
      </FxModule>
    );
  },
};
