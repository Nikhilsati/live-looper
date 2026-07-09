import type { RemoteMessage } from "@live-looper/types";

/**
 * Protocol version for the remote communication layer.
 * Increment when making breaking changes to the message format.
 */
export const PROTOCOL_VERSION = 1;

/**
 * Wrap a typed payload in a versioned RemoteMessage envelope.
 */
export function encodeMessage<T>(
  kind: RemoteMessage["kind"],
  data: T,
): string {
  const message: RemoteMessage<T> = {
    version: PROTOCOL_VERSION,
    kind,
    data,
    timestamp: Date.now(),
  };
  return JSON.stringify(message);
}

/**
 * Parse a raw string from the data channel into a validated RemoteMessage.
 * Returns null for malformed or version-incompatible messages.
 */
export function decodeMessage(raw: string): RemoteMessage | null {
  try {
    const parsed = JSON.parse(raw);

    // Structural validation
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.version !== "number" ||
      typeof parsed.kind !== "string" ||
      typeof parsed.timestamp !== "number" ||
      !("data" in parsed)
    ) {
      return null;
    }

    // Version compatibility — reject messages from future protocol versions.
    // This is strict for now; a future negotiation handshake can relax this.
    if (parsed.version > PROTOCOL_VERSION) {
      console.warn(
        `[remote/protocol] Received message with version ${parsed.version}, ` +
          `but this client only supports up to version ${PROTOCOL_VERSION}. Ignoring.`,
      );
      return null;
    }

    // Validate kind is one of the known categories
    const validKinds: RemoteMessage["kind"][] = [
      "command",
      "sync",
      "ping",
      "pong",
      "handshake",
    ];
    if (!validKinds.includes(parsed.kind)) {
      return null;
    }

    return parsed as RemoteMessage;
  } catch {
    // JSON.parse failed — corrupted message
    return null;
  }
}
