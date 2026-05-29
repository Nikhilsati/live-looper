import React, { useEffect, useRef } from "react";
import {
  MicrophoneIcon,
  SpeakerHighIcon,
  ArrowsClockwiseIcon,
  CloudArrowDownIcon,
  SlidersIcon,
  HeadphonesIcon,
} from "@phosphor-icons/react";
import { useLooperStore } from "../store/useLooperStore";
import { Button } from "@live-looper/ui";

interface SettingsPopoverProps {
  onClose: () => void;
  showDemoOption?: boolean;
  showSmartSnap?: boolean;
  style?: React.CSSProperties;
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({
  onClose,
  showDemoOption = true,
  showSmartSnap = true,
  style: customStyle,
}) => {
  const {
    availableInputs,
    availableOutputs,
    inputDeviceId,
    outputDeviceId,
    performerOutputDeviceId,
    refreshDevices,
    setInputDevice,
    setOutputDevice,
    setPerformerOutputDevice,
    smartSnapEnabled,
    setSmartSnapEnabled,
    dualOutputMode,
    setDualOutputMode,
  } = useLooperStore();

  const deviceChangeRegistered = useRef(false);
  useEffect(() => {
    refreshDevices();
    if (!deviceChangeRegistered.current) {
      deviceChangeRegistered.current = true;
      if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
        navigator.mediaDevices.addEventListener("devicechange", refreshDevices);
      }
    }
    return () => {
      if (
        navigator.mediaDevices &&
        navigator.mediaDevices.removeEventListener
      ) {
        navigator.mediaDevices.removeEventListener(
          "devicechange",
          refreshDevices,
        );
      }
    };
  }, [refreshDevices]);

  const selectStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    padding: "6px 10px",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 28,
  };

  /** True if AudioContext.setSinkId is available (Chrome 110+). */
  const supportsOutputSelection =
    typeof (window as any).AudioContext !== "undefined" &&
    "setSinkId" in AudioContext.prototype;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% + 12px)",
        right: 0,
        background: "rgba(13, 13, 15, 0.95)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "12px 8px",
        minWidth: 240,
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        zIndex: 10,
        ...customStyle,
      }}
    >
      {showDemoOption && (
        <>
          <Button
            variant="ghost"
            size="sm"
            style={{
              height: 40,
              padding: "0 16px",
              borderRadius: 10,
              justifyContent: "flex-start",
              gap: 10,
              fontSize: 13,
            }}
            onClick={() => {
              useLooperStore.getState().loadDemoData();
              onClose();
            }}
          >
            <CloudArrowDownIcon size={16} />
            Load Demo
          </Button>
          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.07)",
              margin: "4px 8px",
            }}
          />
        </>
      )}

      {showSmartSnap && (
        <>
          {/* Application Settings (Smart Snap) */}
          <div
            style={{
              padding: "4px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <SlidersIcon
                  size={13}
                  style={{ color: "var(--accent, #a78bfa)" }}
                  weight="fill"
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Options
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
                Smart Snap (Auto-align)
              </span>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={smartSnapEnabled}
                  onChange={(e) => setSmartSnapEnabled(e.target.checked)}
                  style={{ cursor: "pointer", accentColor: "#a78bfa" }}
                />
              </label>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.07)",
              margin: "4px 8px",
            }}
          />
        </>
      )}

      {/* I/O Devices section */}
      <div
        style={{
          padding: "4px 8px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MicrophoneIcon
              size={13}
              style={{ color: "var(--accent, #a78bfa)" }}
              weight="fill"
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.04em",
              }}
            >
              I/O Devices
            </span>
          </div>
          <button
            onClick={() => refreshDevices()}
            title="Refresh device list"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.35)",
              padding: 4,
              display: "flex",
              alignItems: "center",
              borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
            }
          >
            <ArrowsClockwiseIcon size={13} />
          </button>
        </div>

        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <MicrophoneIcon
              size={11}
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
            <span
              style={{
                fontSize: 9,
                opacity: 0.45,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              Input
            </span>
          </div>
          {availableInputs.length === 0 ? (
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
              }}
            >
              Grant mic permission first
            </span>
          ) : (
            <select
              style={selectStyle}
              value={inputDeviceId ?? ""}
              onChange={(e) => setInputDevice(e.target.value)}
            >
              {availableInputs.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Microphone (${d.deviceId.slice(0, 8)}…)`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Output */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <SpeakerHighIcon
              size={11}
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
            <span
              style={{
                fontSize: 9,
                opacity: 0.45,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              Output
            </span>
          </div>
          {!supportsOutputSelection ? (
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                fontStyle: "italic",
              }}
            >
              Output selection requires Chrome
            </span>
          ) : availableOutputs.length === 0 ? (
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
              }}
            >
              No output devices found
            </span>
          ) : (
            <select
              style={selectStyle}
              value={outputDeviceId ?? ""}
              onChange={(e) => setOutputDevice(e.target.value)}
            >
              {availableOutputs.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Speaker (${d.deviceId.slice(0, 8)}…)`}
                </option>
              ))}
            </select>
          )}
          {/* Dual Output Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
              paddingTop: 8,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <HeadphonesIcon
                size={11}
                style={{ color: "rgba(255,255,255,0.4)" }}
              />
              <span
                style={{
                  fontSize: 9,
                  opacity: 0.6,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                Separate Cue Mix
              </span>
            </div>
            <input
              type="checkbox"
              checked={dualOutputMode}
              onChange={(e) => setDualOutputMode(e.target.checked)}
              style={{ cursor: "pointer", accentColor: "#a78bfa" }}
            />
          </div>

          {/* Performer Output */}
          {dualOutputMode && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <HeadphonesIcon
                  size={11}
                  style={{ color: "rgba(255,255,255,0.4)" }}
                />
                <span
                  style={{
                    fontSize: 9,
                    opacity: 0.45,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                  }}
                >
                  Performer Output
                </span>
              </div>
              {!supportsOutputSelection ? (
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    fontStyle: "italic",
                  }}
                >
                  Output selection requires Chrome
                </span>
              ) : availableOutputs.length === 0 ? (
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    fontStyle: "italic",
                  }}
                >
                  No output devices found
                </span>
              ) : (
                <select
                  style={selectStyle}
                  value={performerOutputDeviceId ?? ""}
                  onChange={(e) => setPerformerOutputDevice(e.target.value)}
                >
                  {availableOutputs.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Speaker (${d.deviceId.slice(0, 8)}…)`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
