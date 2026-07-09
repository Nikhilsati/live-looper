# Product Requirement Document (PRD): Live Remote

Status: needs-triage
Feature Slug: live-remote

---

## 1. Executive Summary & Overview

**Live Remote** enables musicians to transform any smartphone or tablet into a low-latency, wireless control surface for **Live Looper Studio**. 

While the desktop host remains the single source of truth for all audio processing, AudioWorklet execution, effects, recording, and storage, the mobile remote acts as a real-time performance companion. By utilizing a zero-install, scan-to-connect workflow, it eliminates the need for expensive MIDI foot controllers and reduces dangerous trackpad interactions on stage.

---

## 2. Problem Statement & User Context

Live looping requires rapid, split-second actions (arming, muting, switching sections, undoing layers) that interrupt a musician's physical flow if they must walk to a laptop. 

Our product addresses three distinct user contexts as outlined in [DESIGN.md](file:///Users/nikhilsati/Desktop/Projects%20Personal/DESIGN.md):
1. **Planning Mode (Analytical / Setup)**: High tolerance for configuration. The user needs to arrange sections, set quantization, and configure routing.
2. **Rehearsal Mode (Practice / Feedback)**: Medium tolerance for complexity. The user needs to practice loops, see metronome state, and view timing accuracy ("Late-Hit" offsets).
3. **Live Mode (High Pressure / Stage)**: Extremely low tolerance for complexity. The user needs huge touch targets, zero clutter, zero scrolling, absolute visual clarity, and immediate haptic feedback.

---

## 3. Product Goals & Scope

### Primary Goals
- **Zero-Installation Setup**: Pairing via a dynamic QR code on the desktop interface. No login, no app store download, no external network configuration.
- **Ultra-Low Latency Messaging**: Achieving < 30ms command latency over local Wi-Fi.
- **Adaptive Interfaces**: Interface dynamically shifts layout based on the active project mode (`planning`, `practice`, `live`).
- **Stage Safety**: Zero layout shifting, no accidental double-tap consequences, and a prominent Emergency Stop button.

### Scope Matrix

| Feature | In MVP (v1) | Deferred / Future | Reason / Notes |
| :--- | :---: | :---: | :--- |
| **QR Code pairing** | Yes | | Standard local WebRTC signaling/broker setup |
| **WebRTC RTCDataChannel** | Yes | | Direct local browser-to-browser P2P communication |
| **BPM / Playhead Sync** | Yes | | Real-time display of BPM, Bar, Beat, and SectionProgress |
| **Live Mode UI** | Yes | | Zero-scrolling, 4 track pads, transport, emergency stop |
| **Practice Mode UI** | Yes | | Includes "Late-Hit" offset indicator & Latency Monitor |
| **Planning Mode UI** | Yes | | Remote section list selection and basic layout config |
| **Input/Output Gains** | Yes | | Control over `inputGain` and `outputGain` for 4 tracks + Live Input |
| **Undo / Clear Track** | Yes | | Sends `UNDO_LAYER` and `CLEAR_TRACK` events to the host |
| **Haptic Feedback** | Yes | | Web Vibrations API for active tactile responses on stage |
| **Emergency Stop** | Yes | | Direct stop of all tracks + optional audio engine quiet command |
| **Mixer Console Mode** | | Deferred | Detailed panning/fader routing (handled as simple sliders in v1) |
| **Multi-phone Control** | | Deferred | Multi-device permission levels |
| **Lyrics/Chord Sync** | | Deferred | Lyric auto-scroll or Chord Highlight viewer |
| **Smartwatch Companion** | | Deferred | WearOS and Apple Watch integration |

---

## 4. Technical Architecture & Communication Protocol

The remote client communicates directly with the desktop host using WebRTC peer-to-peer data channels. Audio data is **never** streamed; only control instructions and state updates are transmitted.

```mermaid
graph TD
    subgraph Desktop Host (Audio Engine)
        Worklet[AudioWorkletProcessor] <--> Store[useLooperStore / EngineState]
        Store <--> RTCHost[WebRTC Host Controller]
    end

    subgraph Local Wi-Fi Network
        RTCHost <-->|RTCDataChannel P2P| RTCClient[WebRTC Client Controller]
    end

    subgraph Mobile Remote Client (PWA)
        RTCClient <--> RemoteStore[Remote State Store]
        RemoteStore <--> RemoteUI[Adaptive UI View]
    end
```

### 4.1. Network Topology & Signaling
1. **Host Setup**: The desktop host starts a local WebRTC signaling listener (or connects to a lightweight local broker/relay).
2. **Pairing**: The desktop displays a QR code containing WebRTC configuration parameters (e.g., Session Peer ID, connection token).
3. **P2P Channel**: The mobile client scans the QR code, initiating a direct peer-to-peer connection over WebRTC. The connection persists even if external internet access is dropped, as long as both devices are on the same local network.

### 4.2. State Synchronization Data Model (Host to Remote)
The host pushes state packets matching `EngineState` at structural intervals (e.g., tick/beat updates, track state changes).

```typescript
// Synchronized state layout derived from packages/types/src/index.ts
export interface RemoteSyncState {
  isPlaying: boolean;
  bpm: number;
  currentBar: number;
  currentBeat: number;
  sectionProgress: number; // 0-1 progress in active section
  currentSectionIndex: number;
  queuedSectionIndex: number | null;
  mode: "planning" | "practice" | "live";
  
  // Track Status (exactly TRACK_COUNT = 4)
  tracks: Array<{
    isMuted: boolean;
    isSoloed: boolean;
    isArmed: boolean;
    isRecording: boolean;
    hasAudio: boolean;
    layerCount: number;
    inputGain: number;
    outputGain: number;
  }>;
  
  // Live Input State
  liveTrack: {
    isMuted: boolean;
    inputGain: number;
    outputGain: number;
  };
  
  // Performance Diagnostics
  latencyMeasuredSamples: number;
  latencyCompensationSamples: number;
  jitter: number;
  lastHitOffset: number; // Late-Hit offset (ms)
}
```

### 4.3. Command Dispatch Protocol (Remote to Host)
Commands sent from the remote use the exact event payloads of `SessionEvent` as defined in `packages/types/src/index.ts`.

```typescript
export interface SessionEvent {
  timestampMs: number;
  type: 
    | "PLAY"
    | "STOP"
    | "ARM_TRACK"          // payload: { trackId: number }
    | "MUTE_TRACK"         // payload: { trackId: number }
    | "SOLO_TRACK"         // payload: { trackId: number }
    | "SECTION_CHANGE"      // payload: { sectionIndex: number }
    | "SET_BPM"            // payload: { bpm: number }
    | "UNDO_LAYER"         // payload: { trackId: number }
    | "CLEAR_TRACK"        // payload: { trackId: number }
    | "SET_INPUT_GAIN"     // payload: { trackId: number | 'live', gain: number }
    | "SET_OUTPUT_GAIN"    // payload: { trackId: number | 'live', gain: number }
    | "CLEAR_ALL_TRACKS";  // Used for Emergency Stop
}
```

---

## 5. UI & Interaction Design (Adaptive Modes)

Consistent with the mobile-first guidelines in [DESIGN.md](file:///Users/nikhilsati/Desktop/Projects%20Personal/DESIGN.md), the remote adapts its UI structure depending on the host's current `Mode`.

### 5.1. Common Layout Rules
- **Minimum Tap Target**: 56px (Live controls use 72px targets).
- **Stage Contrast**: True black `#000000` background with color-coded track cards (using track accent colors from the host theme).
- **Haptic Confirmation**: Web Vibrations API trigger duration:
  - Button Tap: `15ms`
  - Track Arming: `35ms` (double pulse)
  - Emergency Stop: `100ms` (continuous feedback)

---

### 5.2. Adaptive UI Breakdown

```carousel
#### Planning Mode Remote UI
- **Focus**: Arrangement & Session Config
- **Layout**: Tabbed navigation
  - *Tab 1: Sections*: Reorderable list of sections with lengths. Tap to queue or modify track links.
  - *Tab 2: Quantization*: Toggles for smart snap, grid resolution selector.
  - *Tab 3: Settings*: BPM input slider, Metronome level.
- **Mental Load**: Medium. Detailed configuration controls are visible.
<!-- slide -->
#### Practice Mode Remote UI
- **Focus**: Real-time performance monitoring & timing feedback.
- **Layout**: Split screen.
  - *Top*: Playhead monitor, Metronome toggle, and Latency Monitor (displays measured RTL, current jitter, and glitch status).
  - *Middle*: 4 Grid Track Pads. Tap to ARM. Shows live "Late-Hit" offset flashes (e.g., `+12ms` green, `-25ms` yellow) directly on the track pad.
  - *Bottom*: Gain Sliders for Live Input and output volumes.
- **Mental Load**: Low-Medium. Interactive guidance indicators are active.
<!-- slide -->
#### Live Mode Remote UI (Stage Optimization)
- **Focus**: Distraction-free, zero-scrolling trigger pads.
- **Layout**: Large, static grids.
  - *Header*: Huge Bar/Beat counter and BPM. Status indicator: `LIVE`.
  - *Body*: 4 Full-Width colored track pads.
    - Status colors: Idle (Dark Gray), Armed (Blinking Accent), Recording (Solid Red), Playing (Solid Track Accent Color).
    - Left-swipe on a pad to mute; right-swipe to solo.
  - *Footer*: Heavy interaction buttons:
    - Left: **UNDO** (Removes last layer of the active recording track).
    - Center: **PLAY/STOP** transport toggle.
    - Right: **STOP ALL** (Emergency stop - double-tap to kill all playback).
- **Mental Load**: Extremely Low. No nested menus or settings pages.
```

---

## 6. Detailed Feature Specifications

### 6.1. Instant Pairing Workflow
1. User clicks the "Remote" icon in the desktop utility toolbar.
2. An overlay dialog appears containing:
   - Dynamic QR Code containing local signaling details.
   - 4-character backup alphanumeric session code (e.g., `A92D`).
   - List of connected devices (limit: 1 active mobile control connection).
3. The user opens their phone camera or a generic QR scanner, which launches the Live Remote PWA client URL.
4. The client establishes a local PeerConnection, gets accepted, and the desktop dialog shows `Connected: Phone (iOS/Safari)`.

### 6.2. Track Input & Output Gain Controls
1. Available in both **Planning** and **Practice** modes.
2. Each track card has two vertical/horizontal slider components labeled `IN` and `OUT`:
   - `IN`: Controls `inputGain` (pre-worklet signal).
   - `OUT`: Controls `outputGain` (post-worklet track volume).
3. Values are synchronized in real-time. Slide action triggers immediate changes on the desktop's Web Audio nodes.

### 6.3. Late-Hit Offset & Jitter Monitoring
1. The remote subscribes to `lastHitOffset` and `jitter` updates from the desktop host's `EngineState`.
2. When the user taps a pad to Arm or Record a loop, the engine evaluates the trigger offset relative to the metronome grid boundary.
3. The remote displays a brief floating badge (e.g., `+8ms` or `-14ms`) on the relevant track pad.
4. If the desktop engine flags a jitter underrun (e.g., CPU overload or browser audio glitch), a bright red warning banner `SYSTEM OVERLOAD` flashes at the top of the remote screen to notify the performer immediately.

---

## 7. Success Metrics & Non-Functional Requirements

### 7.1. Performance & Latency Metrics
- **Pairing Success**: > 98% of pairing attempts completed in under 10 seconds.
- **Command Latency**: < 30ms round-trip over standard Wi-Fi (target: < 15ms).
- **State Synchronization Rate**: UI ticks updated at least 15 times per second (synchronized with bar/beat grid) without blocking the thread.
- **Robustness**: Auto-reconnection logic within 2 seconds if Wi-Fi temporarily drops.
- **Battery Drain**: Mobile client uses < 6% battery per hour (no heavy computations, pure WebSocket/WebRTC and rendering).

---

## 8. Verification & QA Plan

### 8.1. Automated Test Strategy
- **WebRTC Connection Mocking**: Unit tests for the signaling broker, verification of session token validation, and correct channel handling.
- **Message Schema Verification**: TypeScript static checks ensuring all messages sent by `RemoteStore` conform to `SessionEvent` format.
- **PWA offline audits**: Lighthouse auditing for offline capability, asset caching, and manifest configurations.

### 8.2. Manual Stage Verification
- **Latency Verification**: Run active looping while monitoring console timestamps to compare WebRTC dispatch triggers with local execution times.
- **Accidental Interaction Testing**: Run the mobile UI in Live Mode while vibrating, double-tapping, and swiping to verify no layout shifts or unexpected double-triggering occurs.
- **Browser Compatibility**: Verification of standard Web Audio and WebRTC API support across Chrome (Android) and Safari (iOS).
