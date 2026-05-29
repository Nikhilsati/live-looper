# Product & Architecture Decisions

This file tracks the major product and architectural decisions made for the Live Looper project. It provides context on the "why" behind features and technical choices to help maintain consistency and context over time.

---

## 2026-02-19

### 1. Automated Decision Logging

**Status:** Accepted
**Context:** To ensure context is preserved without manual overhead for the developer, we need a consistent way to track project evolution.
**Decision:** The AI will take responsibility for adding and maintaining entries in `DECISIONS.md` whenever significant architectural or product changes occur.
**Consequences:**

- **Pros:** Ensures documentation happens in real-time. Maintains a "paper trail" for future debugging or refactoring.
- **Cons:** Requires the AI to correctly identify which changes warrant an entry.

### 2. Realtime Latency & Performance Suite

**Status:** Accepted/Planning
**Context:** Live performance requires sub-millisecond precision. Current hardware reports are often inaccurate due to driver layers.
**Decision:** Build a multi-modal performance suite including Active RTL measurement, Jitter monitoring, and Automatic Latency Compensation.
**Consequences:**

- **Pros:** Provides "Pro Audio" reliability. Eliminates "loop drift" and timing issues during recordings.
- **Cons:** Increases complexity of the AudioWorklet processor logic. Requires the user to grant microphone permissions for RTL testing.

---

## 2026-02-18

### 1. UI Component Library Refactor

**Status:** Accepted/Implemented
**Context:** The UI was becoming hard to maintain with ad-hoc styling and repeated patterns. UI will be minimalist and repetitive.
**Decision:** Extract core UI elements into a dedicated `src/UI` library.
**Consequences:**

- Consistent look and feel across the app.
- Reduced CSS duplication.
- Faster development of new components using primitives like `Stack`, `Grid`, and `Button`.

### 2. Horizontal Layout for Touch Screens

**Status:** Accepted/Implemented
**Context:** The app is intended for live performance, often on larger touch screens (tablets/monitors). Vertical scrolling is cumbersome during a performance.
**Decision:** Pivot to a horizontal layout. Prioritize frequently used controls (Record, Play, Mute) and hide/deactivate rarely changed settings like BPM once the set starts.
**Consequences:**

- Better ergonomic reach during performance.
- Clearer visual separation of tracks.

### 3. PWA Integration (Manifest & Service Worker)

**Status:** Accepted/Implemented
**Context:** Users need offline access and a "native-like" feel on mobile/tablet devices without app store overhead.
**Decision:** Implement PWA features including a manifest file and basic service worker.
**Consequences:**

- App can be installed to home screen.
- Reliable offline performance.
- Full-screen mode (standalone) for cleaner UI.

---

## Template for New Decisions

### [Decision Title]

**Status:** [Proposed / Accepted / Superseded]
**Context:** What problem are we trying to solve? Why are we discussing this now?
**Decision:** What are we doing?
**Consequences:**

- **Pros:** What do we gain?
- **Cons:** What are the trade-offs?
