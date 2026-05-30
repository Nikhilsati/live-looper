import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tuner } from "../../../../web/src/components/Tuner";
import { Button } from "@live-looper/ui";

const meta: Meta<typeof Tuner> = {
  title: "Web/Tuner",
  component: Tuner,
};

export default meta;
type Story = StoryObj<typeof Tuner>;

// Helper to create a mock AnalyserNode generating a sine wave at a specific frequency
const createMockAnalyser = (frequency: number) => {
  return {
    context: {
      sampleRate: 44100,
    },
    getFloatTimeDomainData: (buf: Float32Array) => {
      const sampleRate = 44100;
      for (let i = 0; i < buf.length; i++) {
        // Generate a sine wave with some noise
        buf[i] =
          0.8 * Math.sin(2 * Math.PI * frequency * (i / sampleRate)) +
          0.05 * (Math.random() - 0.5);
      }
    },
  } as unknown as AnalyserNode;
};

export const InTuneA440: Story = {
  args: {
    analyser: createMockAnalyser(440), // Perfect A4 (440 Hz)
  },
};

export const FlatE327: Story = {
  args: {
    analyser: createMockAnalyser(327), // Flat E (Ideal is 329.6 Hz)
  },
};

export const SharpC264: Story = {
  args: {
    analyser: createMockAnalyser(264), // Sharp C (Ideal is 261.6 Hz)
  },
};

export const InteractiveTuner: Story = {
  render: () => {
    const [freq, setFreq] = useState<number>(440);
    const mockAnalyser = createMockAnalyser(freq);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
        <Tuner analyser={mockAnalyser} />
        
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button variant="outline" size="sm" onClick={() => setFreq(261.6)}>
            C4 (261.6Hz)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFreq(258.0)}>
            Flat C4 (258Hz)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFreq(265.0)}>
            Sharp C4 (265Hz)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFreq(440.0)}>
            A4 (440Hz)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFreq(329.6)}>
            E4 (329.6Hz)
          </Button>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Adjust Pitch:</span>
          <input
            type="range"
            min="200"
            max="600"
            step="1"
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontFamily: "monospace", fontSize: "13px" }}>{freq} Hz</span>
        </div>
      </div>
    );
  },
};
