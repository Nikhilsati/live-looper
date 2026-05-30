/**
 * trackColors.ts — Per-track color palette.
 *
 * Each track gets a distinct hue so your eyes can find it in <100ms.
 * Colors are keyed to the CSS design tokens in UI.css (--color-track-N)
 * but also provided as concrete values for components using inline styles.
 *
 * Used by: TrackPad, InputChannelSelector, LooperWorkspace, ChannelLevels, etc.
 */
export const TRACK_COLORS = [
  // Track 0 — Violet (lead)
  {
    idle: "rgba(124, 58, 237, 0.10)",
    haudio: "rgba(124, 58, 237, 0.15)",
    border: "#7c3aed",
    borderHasAudio: "#a78bfa",
    glow: "glow-violet",
    accent: "#a78bfa",
    progressFill: "rgba(167, 139, 250, 0.08)",
  },
  // Track 1 — Cyan (rhythm)
  {
    idle: "rgba(8, 145, 178, 0.10)",
    haudio: "rgba(8, 145, 178, 0.15)",
    border: "#0891b2",
    borderHasAudio: "#22d3ee",
    glow: "glow-cyan",
    accent: "#22d3ee",
    progressFill: "rgba(34, 211, 238, 0.08)",
  },
  // Track 2 — Amber (bass)
  {
    idle: "rgba(217, 119, 6, 0.10)",
    haudio: "rgba(217, 119, 6, 0.15)",
    border: "#d97706",
    borderHasAudio: "#fbbf24",
    glow: "glow-amber",
    accent: "#fbbf24",
    progressFill: "rgba(251, 191, 36, 0.08)",
  },
  // Track 3 — Rose (accent)
  {
    idle: "rgba(225, 29, 72, 0.10)",
    haudio: "rgba(225, 29, 72, 0.15)",
    border: "#e11d48",
    borderHasAudio: "#fb7185",
    glow: "glow-rose",
    accent: "#fb7185",
    progressFill: "rgba(251, 113, 133, 0.08)",
  },
] as const;

export type TrackColor = (typeof TRACK_COLORS)[number];
