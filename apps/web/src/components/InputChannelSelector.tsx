import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLooperStore } from "../store/useLooperStore";
import {
  SpeakerSimpleHighIcon,
  SpeakerSimpleNoneIcon,
  CaretDownIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { MicrophoneIcon, MonoIcon, StereoIcon } from "@live-looper/icons";

interface InputChannelSelectorProps {
  trackId: number;
}

export const InputChannelSelector: React.FC<InputChannelSelectorProps> = ({
  trackId,
}) => {
  const {
    availableInputs,
    channelMapping,
    trackChannelConfig,
    setChannelMapping,
    setTrackChannelMode,
    mode,
  } = useLooperStore();

  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentDeviceId = channelMapping[trackId] || null;
  const currentMode = trackChannelConfig[trackId]?.mode || "stereo";
  const currentDevice = availableInputs.find(
    (d) => d.deviceId === currentDeviceId,
  );

  const deviceLabel = currentDevice ? currentDevice.label : "Default Input";

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.right - 280, // Align right edges
      });
    }
    setIsOpen(!isOpen);
  };

  // Close on click outside or escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEvent = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEvent);
    return () => window.removeEventListener("keydown", handleEvent);
  }, [isOpen]);

  const popoverContent = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "auto",
      }}
      onMouseDown={() => setIsOpen(false)}
    >
      <div
        style={{
          position: "absolute",
          top: coords.top,
          left: coords.left,
          width: 280,
          background: "#1a1a1e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Configuration
            </span>
            <div
              style={{
                display: "flex",
                background: "rgba(0,0,0,0.4)",
                padding: 2,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <button
                onClick={() => setTrackChannelMode(trackId, "mono")}
                title="Set input channel mode to Mono (combines left & right inputs)"
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 9,
                  fontWeight: 900,
                  border: "none",
                  cursor: "pointer",
                  background:
                    currentMode === "mono" ? "#7c3aed" : "transparent",
                  color:
                    currentMode === "mono" ? "white" : "rgba(255,255,255,0.3)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <MonoIcon size={12} /> MONO
              </button>
              <button
                onClick={() => setTrackChannelMode(trackId, "stereo")}
                title="Set input channel mode to Stereo (keeps left & right inputs separate)"
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 9,
                  fontWeight: 900,
                  border: "none",
                  cursor: "pointer",
                  background:
                    currentMode === "stereo" ? "#7c3aed" : "transparent",
                  color:
                    currentMode === "stereo"
                      ? "white"
                      : "rgba(255,255,255,0.3)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <StereoIcon size={12} /> STEREO
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <MicrophoneIcon size={14} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {deviceLabel}
            </span>
          </div>
        </div>

        {/* Device List */}
        <div
          style={{
            padding: 4,
            maxHeight: 240,
            overflowY: "auto",
            background: "rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ padding: "8px 12px 4px 12px" }}>
            <span
              style={{
                fontSize: 8,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              Available Inputs
            </span>
          </div>

          <button
            onClick={() => {
              setChannelMapping(trackId, null);
              setIsOpen(false);
            }}
            title="Select the system default microphone/audio input"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              background:
                currentDeviceId === null
                  ? "rgba(255,255,255,0.06)"
                  : "transparent",
              color:
                currentDeviceId === null ? "white" : "rgba(255,255,255,0.3)",
              transition: "all 0.2s",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    currentDeviceId === null
                      ? "#a855f7"
                      : "rgba(255,255,255,0.1)",
                  boxShadow:
                    currentDeviceId === null ? "0 0 10px #a855f7" : "none",
                }}
              />
              Default System Input
            </div>
            {currentDeviceId === null && (
              <CheckIcon size={14} weight="bold" style={{ color: "#a855f7" }} />
            )}
          </button>

          {availableInputs.map((device) => (
            <button
              key={device.deviceId}
              onClick={() => {
                setChannelMapping(trackId, device.deviceId);
                setIsOpen(false);
              }}
              title={`Select ${device.label || "this input device"}`}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                background:
                  currentDeviceId === device.deviceId
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                color:
                  currentDeviceId === device.deviceId
                    ? "white"
                    : "rgba(255,255,255,0.3)",
                transition: "all 0.2s",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      currentDeviceId === device.deviceId
                        ? "#a855f7"
                        : "rgba(255,255,255,0.1)",
                    boxShadow:
                      currentDeviceId === device.deviceId
                        ? "0 0 10px #a855f7"
                        : "none",
                  }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {device.label ||
                    `Audio Device ${device.deviceId.slice(0, 4)}`}
                </span>
              </div>
              {currentDeviceId === device.deviceId && (
                <CheckIcon
                  size={14}
                  weight="bold"
                  style={{ color: "#a855f7" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Status */}
        <div
          style={{
            padding: "8px 16px",
            background: "rgba(255,255,255,0.01)",
            borderTop: "1px solid rgba(255,255,255,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px rgba(34,197,94,0.4)",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(255,255,255,0.15)",
              }}
            >
              Audio Stream Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const isLive = mode === "live";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={triggerRef}
        onClick={toggleOpen}
        title="Input channel settings (change device and Mono/Stereo mode)"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isLive ? 0 : 8,
          padding: isLive ? "6px" : "4px 10px",
          borderRadius: 8,
          border: isOpen
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(255,255,255,0.05)",
          background: isOpen
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.03)",
          color: isOpen ? "white" : "rgba(255,255,255,0.4)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <MicrophoneIcon
          size={14}
          style={{ color: currentDeviceId ? "#a855f7" : "inherit" }}
        />
        {!isLive && (
          <>
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {currentMode}
            </span>
            <CaretDownIcon
              size={10}
              style={{
                opacity: 0.3,
                transform: isOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
          </>
        )}
      </button>

      {isOpen && createPortal(popoverContent, document.body)}
    </div>
  );
};
