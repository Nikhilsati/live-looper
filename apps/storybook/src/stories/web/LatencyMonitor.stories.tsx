import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LatencyMonitor } from "../../../../web/src/components/LatencyMonitor";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof LatencyMonitor> = {
  title: "Web/LatencyMonitor",
  component: LatencyMonitor,
  tags: ["ai-generated"],
  decorators: [
    (Story) => {
      // Return a container with relative layout and padding so the fixed LatencyMonitor is visible
      return (
        <div style={{ position: "relative", minHeight: "250px", width: "100%" }}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof LatencyMonitor>;

export const CalibrationRequired: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        latencyMeasuredSamples: 0,
        latencyCompensationSamples: 0,
        isCalibratingLatency: false,
        jitter: 0,
        calibrateLatency: () => {
          useLooperStore.setState({ isCalibratingLatency: true });
          setTimeout(() => {
            useLooperStore.setState({
              isCalibratingLatency: false,
              latencyMeasuredSamples: 529, // 12ms
              latencyCompensationSamples: 529,
              jitter: 0.0004,
            });
          }, 2000);
        },
      });
    }, []);

    return <LatencyMonitor />;
  },
};

export const CalibratedAndStable: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        latencyMeasuredSamples: 441, // 10ms round-trip at 44.1kHz
        latencyCompensationSamples: 441,
        isCalibratingLatency: false,
        jitter: 0.0006, // 0.6ms jitter
      });

      // Simulate a small amount of jitter changing in real time for sparkline visual effect
      const interval = setInterval(() => {
        useLooperStore.setState({
          jitter: 0.0005 + 0.0003 * Math.random(),
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return <LatencyMonitor />;
  },
};

export const UnstableJitter: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        latencyMeasuredSamples: 882, // 20ms RTL
        latencyCompensationSamples: 882,
        isCalibratingLatency: false,
        jitter: 0.0045, // 4.5ms jitter (unstable, > 2ms)
      });

      const interval = setInterval(() => {
        useLooperStore.setState({
          jitter: 0.003 + 0.003 * Math.random(),
        });
      }, 300);

      return () => clearInterval(interval);
    }, []);

    return <LatencyMonitor />;
  },
};
