UI Design Instruction Set (Performance-First, Artist-Centric)
0. Core Philosophy

Design this app as if:

The user is on stage.

Their hands may be shaking.

Their attention is 90% on music, 10% on UI.

Mistakes are expensive.

Speed matters more than density.

Confidence > Features.

The UI must disappear during performance.

1️⃣ User Context Model

Every UI decision must consider three mental states:

A. Planning Mode

Mental state:

Calm

Analytical

Exploring ideas

Needs:

Visibility

Structure

Editable parameters

Experimentation tools

Non-destructive workflows

Tolerance for complexity: Medium

B. Rehearsal Mode

Mental state:

Practicing flow

Testing transitions

Muscle memory building

Needs:

Repeatable flows

Clear state indicators

Quick adjustments

Undo safety

Tolerance for complexity: Low–Medium

C. Live Mode

Mental state:

High pressure

Emotional

Time-sensitive

Minimal bandwidth

Needs:

Absolute clarity

Large hit areas

Zero ambiguity

Zero clutter

Immediate feedback

Tolerance for complexity: Extremely Low

2️⃣ Global Design Rules
1. The UI Must Reduce Mental Load

Avoid:

Tiny controls

Multi-step flows

Hidden states

Overloaded panels

Dense control clusters

Prefer:

One primary action per region

Clear visual grouping

Progressive disclosure

Minimal visible options in Live mode

2. Touch-First Layout Rules

All controls must:

Have large hit areas (minimum 44–60px)

Be spaced generously

Avoid edge crowding

Avoid hover-only affordances

Work without precision pointer

No micro-controls.

3. Speed Perception Rules

The UI must feel:

Instant

Deterministic

Physically responsive

Enforce:

Immediate visual feedback on touch

No loading spinners for core actions

No delayed state updates

Avoid UI transitions that block interaction

Perceived latency matters more than visual polish.

3️⃣ Mode-Based UI Architecture
Planning Mode UI

Can include:

Detailed controls

Editable parameters

Grid views

Configuration panels

Section management

Quantization settings

Overdub settings

Layout:

Structured panels

Visible editing tools

Expandable side panels

Goal:
Full creative control.

Rehearsal Mode UI

Must:

Reduce visible configuration

Highlight transitions

Emphasize state feedback

Allow quick corrections

Hide:

Deep configuration panels

Rarely used controls

Goal:
Practice performance flow.

Live Mode UI (Critical)

Must show only:

Track controls

Record / Overdub / Stop

Section switch

Tempo (if adjustable live)

Clear mode indicator

Must hide:

Settings

Configuration panels

Advanced toggles

Grid settings

Debug info

Layout principles:

Full-width tracks

Large, centered controls

Clear color semantics

No scrolling

No nested menus

Goal:
Zero thinking required.

4️⃣ Visual Hierarchy Rules

Primary Action = Largest Element

Active State = High Contrast

Dangerous Action = Clearly Separated

Disabled Action = Obvious

Mode = Always Visible

Never rely only on color.
Use shape + icon + label where needed.

5️⃣ Interaction Safety

Especially in Live Mode:

No destructive action without friction

Avoid accidental double-tap consequences

Avoid layout shifts

Avoid moving buttons dynamically

Buttons must not relocate between states.

6️⃣ Component Design Rules

All components must be:

Predictable

Single-purpose

Stateless where possible

Visually consistent

Avoid:

Multifunction overloaded buttons

Mode-dependent hidden logic inside components

Modes should control visibility, not behavior ambiguity.

7️⃣ State Transparency

The user must always know:

Is it recording?

Is it armed?

Is it quantized?

Which section is active?

Which track is active?

Is overdub enabled?

States must be visually obvious without reading small text.

8️⃣ Layout Stability Rules

Avoid:

Layout jumping

Resizing on state change

Element repositioning

Muscle memory must remain valid across interactions.

9️⃣ Minimalism Rules (Especially Live Mode)

Ask before adding anything:

Is this required during performance?

Can this be hidden in Planning mode?

Can this be accessed via long-press instead?

Can this be placed in a secondary screen?

If not essential → remove.

🔟 Performance Feedback Rules

Every action must produce:

Immediate visual feedback

Clear state transition

Optional subtle animation

No ambiguity

Example:
Record button:

Idle → neutral

Armed → blinking

Recording → solid red

Overdub → distinct visual difference

No subtle state differences.

11️⃣ Scalability Strategy

UI must support future:

More tracks

Effects

Automation

Sections

Plugins

Design layout containers, not fixed layouts.

12️⃣ Final Output Format for UI Discussions

Cursor must always provide:

Mode-based breakdown

Layout description (top → bottom)

Component tree outline

Interaction flow

State model (UI vs system state)

Justification based on artist mental model

Explanation of how mental load is reduced

No generic UI suggestions.
