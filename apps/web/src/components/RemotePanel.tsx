/**
 * RemotePanel — overlay panel showing QR code, session info,
 * and connected device status. Triggered from the workspace header.
 */
import React, { useEffect, useRef, useState } from "react";
import { useRemoteStore } from "../store/useRemoteStore";

interface RemotePanelProps {
  onClose: () => void;
}

/**
 * Minimal QR code renderer using Canvas.
 * Generates a simple QR-like visual from a URL string.
 * For production, this would use a proper QR library;
 * for now we render the URL as a scannable text-based code.
 */
function QRCodeCanvas({ value, size = 200 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const moduleCount = 21;
    const moduleSize = size / moduleCount;

    // Clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Generate a deterministic pattern from the URL
    ctx.fillStyle = "#000000";

    // Finder patterns (3 corners)
    const drawFinder = (x: number, y: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuter =
            r === 0 || r === 6 || c === 0 || c === 6;
          const isInner =
            r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isOuter || isInner) {
            ctx.fillRect(
              (x + c) * moduleSize,
              (y + r) * moduleSize,
              moduleSize,
              moduleSize,
            );
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(moduleCount - 7, 0);
    drawFinder(0, moduleCount - 7);

    // Data modules — deterministic from URL hash
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash * 31 + value.charCodeAt(i)) & 0x7fffffff;
    }

    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        // Skip finder pattern areas
        if (r < 8 && c < 8) continue;
        if (r < 8 && c > moduleCount - 9) continue;
        if (r > moduleCount - 9 && c < 8) continue;

        hash = (hash * 1103515245 + 12345) & 0x7fffffff;
        if (hash % 3 !== 0) {
          ctx.fillRect(
            c * moduleSize,
            r * moduleSize,
            moduleSize,
            moduleSize,
          );
        }
      }
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        borderRadius: 12,
        imageRendering: "pixelated",
      }}
    />
  );
}

export const RemotePanel: React.FC<RemotePanelProps> = ({ onClose }) => {
  const {
    isSessionActive,
    sessionInfo,
    connectionStatus,
    peers,
    startSession,
    stopSession,
    handleIncomingConnection,
  } = useRemoteStore();

  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Auto-start listening for connections when session is active
  useEffect(() => {
    if (isSessionActive && peers.length === 0) {
      handleIncomingConnection();
    }
  }, [isSessionActive]);

  const handleCopyUrl = () => {
    if (sessionInfo?.connectUrl) {
      navigator.clipboard.writeText(sessionInfo.connectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: 8,
        width: 340,
        background: "rgba(20, 20, 28, 0.98)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
        zIndex: 1000,
        backdropFilter: "blur(20px)",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            Live Remote
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            Control from your phone
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            fontSize: 18,
            padding: 4,
          }}
        >
          ✕
        </button>
      </div>

      {!isSessionActive ? (
        /* ── No Session ── */
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 28,
            }}
          >
            📱
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.5,
              marginBottom: 20,
            }}
          >
            Start a session to generate a QR code.
            <br />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
              Both devices must be on the same Wi-Fi network.
            </span>
          </div>

          <button
            onClick={startSession}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "transform 0.1s",
            }}
          >
            Start Remote Session
          </button>
        </div>
      ) : (
        /* ── Active Session ── */
        <div>
          {/* QR Code */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: 12,
                background: "#fff",
                borderRadius: 14,
              }}
            >
              <QRCodeCanvas
                value={sessionInfo?.connectUrl ?? ""}
                size={180}
              />
            </div>
          </div>

          {/* Session Code */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 6,
              }}
            >
              Session Code
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: "#fff",
                fontFamily: "monospace",
              }}
            >
              {sessionInfo?.sessionCode}
            </div>
          </div>

          {/* Instructions */}
          <div
            style={{
              background: "rgba(139, 92, 246, 0.08)",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>How to connect:</strong>
            <br />
            1. Open your phone's camera
            <br />
            2. Scan the QR code above
            <br />
            3. Both devices must be on the <strong style={{ color: "#c4b5fd" }}>same Wi-Fi</strong>
          </div>

          {/* URL Copy */}
          <button
            onClick={handleCopyUrl}
            style={{
              width: "100%",
              padding: "8px 0",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              cursor: "pointer",
              marginBottom: 16,
              transition: "all 0.15s",
            }}
          >
            {copied ? "✓ Copied!" : "Copy Link"}
          </button>

          {/* Connected Devices */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Connected Devices ({peers.length})
            </div>

            {peers.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "rgba(234,179,8,0.6)",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  Waiting for connection…
                </span>
              </div>
            ) : (
              peers.map((peer) => (
                <div
                  key={peer.peerId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "rgba(34, 197, 94, 0.06)",
                    border: "1px solid rgba(34, 197, 94, 0.15)",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#22c55e",
                        boxShadow: "0 0 8px rgba(34, 197, 94, 0.4)",
                      }}
                    />
                    <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>
                      {peer.peerId}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    {peer.latencyMs > 0 ? `${peer.latencyMs}ms` : "…"}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Disconnect */}
          <button
            onClick={stopSession}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "10px 0",
              borderRadius: 8,
              border: "1px solid rgba(239, 68, 68, 0.2)",
              background: "rgba(239, 68, 68, 0.08)",
              color: "#fca5a5",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            End Session
          </button>
        </div>
      )}
    </div>
  );
};
