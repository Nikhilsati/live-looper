import React, { useRef, useState } from "react";
import {
  MuteIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  HeadphonesIcon,
  WaveformIcon,
  TrashIcon,
  LoopIcon,
} from "@live-looper/icons";
import { useLooperStore } from "../../store";
import {
  Card,
  Row,
  Button,
  Stack,
  Label,
  Modal,
} from "@live-looper/ui";

export const BackingTrackRow: React.FC = () => {
  const {
    mode,
    isPlaying,
    backingTrackName,
    backingTrackVolume,
    backingTrackLoop,
    backingTrackMonitorOnly,
    backingTrackProgress,
    backingTrackDuration,
    setBackingTrackFile,
    removeBackingTrack,
    updateBackingTrackSettings,
  } = useLooperStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isLive = mode === "live";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await setBackingTrackFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleMuteToggle = () => {
    if (!backingTrackName) return;
    const isCurrentlyMuted = backingTrackVolume === 0;
    updateBackingTrackSettings({ volume: isCurrentlyMuted ? 0.8 : 0 });
  };

  const formatDuration = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isMuted = backingTrackVolume === 0;

  return (
    <Card
      style={{
        width: "100%",
        padding: "16px 24px",
        background: isLive ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.02)",
        border: isLive
          ? "1px solid rgba(99, 102, 241, 0.4)"
          : "1px dashed rgba(255,255,255,0.08)",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        position: "relative",
        minHeight: 88,
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/wav,audio/mp3,audio/mpeg,audio/ogg,audio/aac"
        style={{ display: "none" }}
      />

      {/* 1. Mute Button & Info */}
      <Row style={{ gap: 16, alignItems: "center", flexShrink: 0, width: 260 }}>
        <button
          onClick={handleMuteToggle}
          disabled={!backingTrackName}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: !backingTrackName
              ? "rgba(255,255,255,0.02)"
              : isMuted
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(99, 102, 241, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${
              !backingTrackName
                ? "rgba(255,255,255,0.05)"
                : isMuted
                  ? "rgba(239, 68, 68, 0.4)"
                  : "rgba(99, 102, 241, 0.5)"
            }`,
            cursor: backingTrackName ? "pointer" : "default",
            opacity: backingTrackName ? 1 : 0.4,
            transition: "all 0.2s ease",
            padding: 0,
            outline: "none",
          }}
          title={isMuted ? "Unmute Backing Track" : "Mute Backing Track"}
        >
          {isMuted || !backingTrackName ? (
            <MuteIcon
              size={22}
              style={{
                color: isMuted && backingTrackName ? "#ef4444" : "rgba(255,255,255,0.3)",
              }}
            />
          ) : (
            <VolumeHighIcon
              size={22}
              style={{ color: "#818cf8" }}
            />
          )}
        </button>

        <Stack style={{ gap: 4, maxWidth: 190 }}>
          <Label
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: isMuted ? "rgba(255,255,255,0.4)" : "#818cf8",
              textTransform: "uppercase",
            }}
          >
            Backing Track
          </Label>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: backingTrackName ? "white" : "rgba(255,255,255,0.3)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={backingTrackName || "No Track Loaded"}
          >
            {backingTrackName || "No track loaded"}
          </div>
          {backingTrackName && (
            <span style={{ fontSize: 9, opacity: 0.4, fontWeight: 600 }}>
              Length: {formatDuration(backingTrackDuration)}
            </span>
          )}
        </Stack>
      </Row>

      {/* 2. Waveform Progress Track */}
      <div
        style={{
          flex: 1,
          height: 36,
          background: "rgba(0,0,0,0.2)",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.03)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
        }}
      >
        {!backingTrackName ? (
          <div
            onClick={!isLive ? triggerFileInput : undefined}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              cursor: !isLive ? "pointer" : "default",
              userSelect: "none",
            }}
          >
            <WaveformIcon size={16} />
            {!isLive ? "Click here to load a .wav or .mp3 backing track file" : "No backing track preloaded"}
          </div>
        ) : (
          <>
            {/* Waveform Background Simulation */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                opacity: 0.15,
                pointerEvents: "none",
              }}
            >
              {Array.from({ length: 48 }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 2,
                    height: `${Math.sin(idx * 0.4) * 12 + 18}px`,
                    background: "white",
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>

            {/* Glowing Active Progress Bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: `${backingTrackProgress * 100}%`,
                background: "linear-gradient(90deg, rgba(99,102,241,0.05) 0%, rgba(99,102,241,0.2) 100%)",
                borderRight: "2px solid #818cf8",
                boxShadow: "0 0 10px rgba(99, 102, 241, 0.4)",
                transition: isPlaying ? "width 0.1s linear" : "none",
                pointerEvents: "none",
              }}
            />

            {/* Seek Time Display */}
            <div
              style={{
                position: "absolute",
                right: 12,
                fontSize: 10,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                background: "rgba(0,0,0,0.4)",
                padding: "2px 6px",
                borderRadius: 4,
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              {formatDuration(backingTrackProgress * backingTrackDuration)} / {formatDuration(backingTrackDuration)}
            </div>
          </>
        )}
      </div>

      {/* 3. Direct Volume Slider */}
      {backingTrackName && (
        <Row style={{ gap: 8, alignItems: "center", flexShrink: 0, width: 160 }}>
          <VolumeLowIcon size={14} style={{ opacity: 0.4, color: "white" }} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={backingTrackVolume}
            onChange={(e) => updateBackingTrackSettings({ volume: parseFloat(e.target.value) })}
            style={{
              flex: 1,
              height: 4,
              WebkitAppearance: "none",
              appearance: "none",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2,
              outline: "none",
              cursor: "pointer",
            }}
          />
          <VolumeHighIcon size={14} style={{ opacity: 0.4, color: "white" }} />
        </Row>
      )}

      {/* 4. Action Controls */}
      <Row style={{ gap: 12, alignItems: "center", flexShrink: 0 }}>
        {!isLive && backingTrackName && (
          <>
            {/* Loop Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateBackingTrackSettings({ loop: !backingTrackLoop })}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: backingTrackLoop ? "rgba(99,102,241,0.12)" : "transparent",
                border: `1px solid ${backingTrackLoop ? "rgba(99,102,241,0.3)" : "transparent"}`,
                color: backingTrackLoop ? "#818cf8" : "rgba(255,255,255,0.4)",
                padding: 0,
              }}
              title={backingTrackLoop ? "Loop Enabled" : "Loop Disabled"}
            >
              <LoopIcon size={18} />
            </Button>

            {/* Monitor/Headphones Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateBackingTrackSettings({ monitorOnly: !backingTrackMonitorOnly })}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: backingTrackMonitorOnly ? "rgba(234,179,8,0.12)" : "transparent",
                border: `1px solid ${backingTrackMonitorOnly ? "rgba(234,179,8,0.3)" : "transparent"}`,
                color: backingTrackMonitorOnly ? "#f59e0b" : "rgba(255,255,255,0.4)",
                padding: 0,
              }}
              title={backingTrackMonitorOnly ? "Monitor Only (Headphones)" : "Audience Mix (Master)"}
            >
              <HeadphonesIcon size={18} />
            </Button>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                color: "rgba(239, 68, 68, 0.7)",
                padding: 0,
              }}
              title="Remove Backing Track"
            >
              <TrashIcon size={18} />
            </Button>
          </>
        )}

        {!isLive && !backingTrackName && (
          <Button
            variant="outline"
            onClick={triggerFileInput}
            style={{
              height: 38,
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 700,
              padding: "0 16px",
            }}
          >
            Import Audio
          </Button>
        )}

        {/* Live Mode indicator tags */}
        {isLive && backingTrackName && (
          <Row style={{ gap: 8 }}>
            {backingTrackLoop && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  background: "rgba(99,102,241,0.12)",
                  color: "#818cf8",
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(99,102,241,0.25)",
                  textTransform: "uppercase",
                }}
              >
                LOOP
              </span>
            )}
            {backingTrackMonitorOnly && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  background: "rgba(234,179,8,0.12)",
                  color: "#f59e0b",
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(234,179,8,0.25)",
                  textTransform: "uppercase",
                }}
              >
                MONITOR ONLY
              </span>
            )}
          </Row>
        )}
      </Row>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <Card
            style={{
              width: 320,
              padding: 24,
              background: "#1a1a1e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>
              Remove Backing Track?
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.4 }}>
              Are you sure you want to remove the backing track "{backingTrackName}" from this project?
            </div>
            <Row style={{ gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                style={{ height: 38, borderRadius: 10 }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  setShowDeleteConfirm(false);
                  await removeBackingTrack();
                }}
                style={{ height: 38, borderRadius: 10 }}
              >
                Remove
              </Button>
            </Row>
          </Card>
        </Modal>
      )}
    </Card>
  );
};
