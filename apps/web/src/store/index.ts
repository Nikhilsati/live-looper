/**
 * Store barrel — clean entry point for all domain slices.
 *
 * New code should import from the focused slice:
 *   import { useTransportStore } from "@/store"
 *
 * Existing code can continue to import from useLooperStore directly.
 */
export { useLooperStore } from "./useLooperStore";
export { useSessionStore } from "./useSessionStore";
export { useDialogStore, uiAlert } from "./useDialogStore";

// Domain slices
export { useTransportStore } from "./useTransportStore";
export type { TransportState } from "./useTransportStore";
export { useUIStore } from "./useUIStore";
export type { UIState } from "./useUIStore";
export { useDeviceStore } from "./useDeviceStore";
export type { DeviceState } from "./useDeviceStore";
export { useLatencyStore } from "./useLatencyStore";
export type { LatencyState } from "./useLatencyStore";
