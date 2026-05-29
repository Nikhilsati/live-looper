# Phase 2 Implementation Plan: Performance & Latency Suite

This phase focuses on upgrading the audio engine to handle professional-grade timing requirements, ensuring that every recording is sample-accurate regardless of hardware delays.

## 1. Active Round-Trip Latency (RTL) Test

**Goal:** Measured exact latency from "Out to In".

- **Engine (Processor):** Add an `RTL_TEST` mode. When triggered, it emits a 1-sample spike (impulse) at a specific time.
- **Engine (Processor):** Monitor the `inputChannel` for that spike and record the sample offset between emission and reception.
- **UI:** A simple "Calibrate Audio" button that asks the user to loop their output to input (or place mic near speaker) and runs the test.

## 2. Automatic Latency Compensation

**Goal:** Zero-latency feel for recorded loops.

- **Storage:** Persist the measured RTL in `localStorage` or common state.
- **Processor Logic:** When recording a layer, use the measured RTL offset to "shift" the recorded buffer backward in time so it aligns perfectly with the playhead.
- **UI:** Display "Compensated: -45ms" in the Latency Monitor.

## 3. Jitter & Glitch Monitoring

**Goal:** Visual confirmation of system stability.

- **Processor:** Track time since last `process()` call and report variances to the UI.
- **Processor:** Implement an `UNDERRUN_DETECTOR` that flags if the processor is falling behind the hardware clock.
- **UI (LatencyMonitor):** Add a mini sparkline graph showing jitter variance. Red "GLITCH" badge if an underrun occurs.

## 4. Visual "Late-Hit" Analyzer

**Goal:** Help the user distinguish between system lag and human timing.

- **System:** Capture the exact millisecond/sample when a "Record" button is pressed vs the quantization boundary (Start of Bar).
- **UI:** Show a briefly flashing "Hit: -12ms" (early) or "+15ms" (late) next to the track record button.

## 5. Stress Test Mode (QA Tool)

**Goal:** Validate performance limits.

- **Processor:** Add a parameter to "Burn CPU Cycles" (looping heavy math) inside the Worklet.
- **UI:** A slider to increase the simulated load until glitches occur, helping define the "safe headroom" of the current device.

---

**Sequence:**

1. RTL Test & Calibration (Foundational)
2. Latency Compensation (Functional)
3. Jitter/Glitch Detection (Monitoring)
4. Late-Hit Analyzer (Experience)
