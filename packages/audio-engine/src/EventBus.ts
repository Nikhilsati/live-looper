import mitt from "mitt";
import type { EngineEvent } from "@live-looper/types";

// Map the discriminated union to a map of event types to their payloads
// so we can subscribe to specific events like: engineEvents.on("TICK", handler)
type EngineEventMap = {
  [E in EngineEvent as E["type"]]: E extends { payload: infer P } ? P : undefined;
};

// Also support a catch-all for legacy listeners that expect the full EngineEvent
export type LegacyEventMap = {
  '*': EngineEvent;
  'engine_event': EngineEvent;
};

export const engineEvents = mitt<EngineEventMap & LegacyEventMap>();
