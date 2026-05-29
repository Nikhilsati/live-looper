# Product Requirements Document (PRD)

## Live Looper – Effects Engine (Performance-Optimized, Native Web Audio)

---

# 1. Objective

Design and implement a **low-latency, performance-safe Effects Engine** for the Live Looper PWA using native Web Audio API primitives.

The system must:

- Maintain <10ms processing latency
- Scale to 4 tracks × overdubs × sections
- Remain stable on 16GB laptops
- Avoid heavy third-party DSP libraries
- Support section-based state recall
- Be extensible for future effects

Revisions applied:

- Pre-FX stage removed
- Reverb implemented as per-track insert (no shared send bus)

---

# 2. Scope

## Per Track (Insert Chain)

- EQ (3-band)
- Compressor
- Drive
- Delay
- Reverb (Insert)
- Pan
- Optional: Phaser
- Optional: Flanger
- Optional: Tremolo

## Master Bus

- Glue Compressor
- Limiter

---

# 3. System Architecture

## 3.1 Audio Graph Model

Track Buffer
↓
EQ
↓
Compressor
↓
Drive
↓
Modulation FX (optional)
↓
Delay
↓
Reverb
↓
Pan
↓
Track Gain
↓
Master Bus
↓
Glue Compressor
↓
Limiter
↓
Output

Characteristics:

- Fully linear per-track insert chain
- No parallel routing
- No shared bus
- No dynamic graph rewiring during playback
- Keep it linear and simple, however effects sequence should be rearrangeable and extendable to add more effects later

---

# 4. Functional Requirements

---

## 4.1 EQ

**Implementation**

- 3 × `BiquadFilterNode`
  - Low Shelf
  - Peaking (Mid)
  - High Shelf

**Parameters**

- Low gain (-12dB to +12dB)
- Mid gain (-12dB to +12dB)
- Mid frequency (300Hz–4kHz)
- High gain (-12dB to +12dB)

**Constraints**

- Always instantiated
- No runtime node creation
- Parameter changes must use ramp automation

---

## 4.2 Compressor (Per Track)

**Node**

- `DynamicsCompressorNode`

**Parameters**

- Threshold
- Ratio
- Attack
- Release
- Makeup gain

Used for:

- Dynamic control
- Tightening loop peaks

---

## 4.3 Drive

**Node**

- `WaveShaperNode`

**Parameters**

- Amount
- Optional tone control (pre high-cut filter)

**Rules**

- Distortion curve recalculated only when amount changes
- No per-sample JS processing

---

## 4.4 Delay

**Nodes**

- `DelayNode`
- Feedback loop via `GainNode`
- Optional filter in feedback path

**Parameters**

- Time (BPM-synced to looper clock)
- Feedback
- Mix (dry/wet)
- High cut

**Sync Modes**

- 1/4
- 1/8
- 1/8 dotted

**Mixing**

- Implement via Dry GainNode + Wet GainNode
- Avoid reconnecting graph

---

## 4.5 Reverb (Insert Mode)

**Node**

- `ConvolverNode`

Each track has its own instance.

**Constraints**

- IR length ≤ 2 seconds
- Default small-room impulse response
- Mix control (dry/wet)
- No shared bus in this version

**Tradeoff**

- Slightly higher CPU than shared send
- Lower architectural complexity

---

## 4.6 Pan

**Node**

- `StereoPannerNode`

**Range**

- -1 (Left) to +1 (Right)

---

# 5. Optional Performance FX

All modulation effects must be toggleable and CPU-safe.

---

## 5.1 Phaser

**Implementation**

- 2–4 `BiquadFilterNode` (allpass)
- LFO via `OscillatorNode`
- Optional feedback loop

**Parameters**

- Rate
- Depth
- Feedback

---

## 5.2 Flanger

**Implementation**

- Short `DelayNode` (0–10ms)
- LFO modulating delayTime
- Feedback loop

**Parameters**

- Rate
- Depth
- Feedback

---

## 5.3 Tremolo

**Implementation**

- LFO → `GainNode.gain`

**Parameters**

- Rate
- Depth

---

# 6. Master Bus

---

## 6.1 Glue Compressor

**Node**

- `DynamicsCompressorNode`

**Preset Characteristics**

- Ratio: 2–4
- Medium attack
- Subtle gain reduction

Purpose:

- Cohesion across tracks

---

## 6.2 Limiter

Implemented using:

- `DynamicsCompressorNode`
- High ratio (20+)
- Fast attack
- Ceiling: -0.5 dB

Must prevent digital clipping under peak stacking.

---

# 7. Performance Requirements

| Metric                      | Target                        |
| --------------------------- | ----------------------------- |
| Audio Latency               | < 10ms                        |
| CPU Load (4 tracks full FX) | < 40% on modern laptop        |
| Memory overhead             | Stable, no progressive growth |
| XRuns / Glitches            | 0 under normal use            |

---

# 8. Node Lifecycle Rules

- All nodes instantiated during track initialization
- No node creation during playback
- Effects toggled using wet/dry gain, not connect/disconnect
- Parameter changes must use:
  - `setValueAtTime`
  - `linearRampToValueAtTime`
  - `exponentialRampToValueAtTime`
- No dynamic graph rewiring while playing

---

# 9. State & Automation Model

Each track:

```ts
track.fx = {
  eq: {...},
  compressor: {...},
  drive: {...},
  delay: {...},
  reverb: {...},
  modulation: {...},
  pan: 0
}


Section switching must:

Recall effect states

Smoothly ramp parameters (20–50ms default)

Avoid audio clicks or discontinuities

10. Non-Functional Requirements

No external DSP libraries

No Tone.js dependency

Native Web Audio nodes only

Deterministic behavior

Predictable CPU usage

Modular and refactor-ready for future shared reverb bus

Easy, clean, modular, reusable UI components for effects

11. Risks & Mitigation
Risk	Mitigation
CPU spikes from reverb	Short IR (≤2s)
Clicks during parameter changes	Ramp automation
LFO duplication overhead	Share oscillator instances where possible
Browser inconsistencies	Test Chrome, Safari, Firefox
12. Out of Scope (Future)

Pitch shifting

Granular processing

Bitcrusher

Multi-band compression

AI-based effects

Shared reverb send bus (future refactor)

13. Success Criteria

Stable 20-minute live session

No audible glitches

All effects enabled simultaneously without dropouts

Smooth section transitions

Clean, extensible architecture
```
