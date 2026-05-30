import React from "react";
import { useLooperStore } from "../store/useLooperStore";
import {
  Card,
  Button,
  Row,
  Stack,
  Label,
  Heading,
  ValueText,
} from "@live-looper/ui";
import {
  PlusIcon,
  TrashIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@live-looper/icons";
import { TRACK_COLORS } from "./track/trackColors";
import { audioEngine } from "@live-looper/audio-engine";
import { can } from "@live-looper/mode-controller";

const EditableSectionName = ({
  initialName,
  onRename,
  disabled = false,
}: {
  initialName: string;
  onRename: (newName: string) => void;
  disabled?: boolean;
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(initialName);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && !disabled) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, disabled]);

  const handleBlur = () => {
    setIsEditing(false);
    if (name.trim() && name !== initialName) {
      onRename(name.trim());
    } else {
      setName(initialName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setName(initialName);
    }
  };

  // Keep name in sync with external changes if any
  React.useEffect(() => {
    setName(initialName);
  }, [initialName]);

  if (disabled) {
    return <ValueText>{initialName}</ValueText>;
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          background: "rgba(0,0,0,0.5)",
          border: "1px solid var(--color-primary)",
          color: "white",
          borderRadius: 4,
          padding: "2px 6px",
          fontSize: 14,
          fontWeight: 600,
          width: "100%",
          outline: "none",
          margin: "-3px -7px", // to visually offset the padding so layout doesn't jump
        }}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      title="Click to rename"
      style={{
        cursor: "pointer",
        borderBottom: "1px dashed rgba(255,255,255,0.3)",
        display: "inline-block",
      }}
    >
      <ValueText>{initialName}</ValueText>
    </span>
  );
};

export const SongPlanner = () => {
  const {
    sections,
    currentSectionIndex,
    queuedSectionIndex,
    mode,
    tracks,
    isPlaying,
    sectionProgress,
    addSection,
    renameSection,
    deleteSection,
    reorderSections,
    carryForwardTrack,
  } = useLooperStore();

  const handleAdd = async () => {
    const newName = `Section ${sections.length + 1}`;
    await addSection(newName);
  };

  const handleMoveLeft = async (index: number) => {
    if (index === 0) return;
    const newOrder = [...sections.map((s) => s.id)];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    await reorderSections(newOrder);
  };

  const handleMoveRight = async (index: number) => {
    if (index === sections.length - 1) return;
    const newOrder = [...sections.map((s) => s.id)];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    await reorderSections(newOrder);
  };

  const handleToggleCarryForward = async (
    trackIndex: number,
    sectionIndex: number,
    currentLinked: boolean,
  ) => {
    if (sectionIndex === 0) return; // Can't carry forward to the first section
    const prevSection = sections[sectionIndex - 1];
    const thisSection = sections[sectionIndex];
    await carryForwardTrack(
      trackIndex,
      prevSection.id,
      thisSection.id,
      !currentLinked,
    );
  };

  const handleSectionClick = (sectionIndex: number) => {
    if (!can("trigger-section", mode)) return;
    if (!isPlaying) {
      useLooperStore.getState().setCurrentSection(sectionIndex);
    } else {
      if (sectionIndex === currentSectionIndex) {
        useLooperStore.getState().setQueuedSection(null);
        audioEngine.queueSection(currentSectionIndex);
      } else {
        useLooperStore.getState().setQueuedSection(sectionIndex);
        audioEngine.queueSection(sectionIndex);
      }
    }
  };

  // Card height estimate without carry-forward buttons:
  //   padding(16) + header(32) + gap(12) + bars-label(20) + padding(16) = ~96px
  // Center = ~48px. 4 dots spaced 14px apart around center.
  const DOT_POSITIONS = [-21, -7, 7, 21].map((offset) => 48 + offset); // [27, 41, 55, 69]

  return (
    <Stack style={{ gap: 16 }}>
      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Heading style={{ fontSize: 24, margin: 0 }}>Timeline</Heading>
        {can("add-section", mode) && (
          <Button
            onClick={handleAdd}
            size="sm"
            variant="ghost"
            title="Add a new song section to the timeline"
          >
            <Row style={{ alignItems: "center", gap: 6 }}>
              <PlusIcon size={14} /> Add Section
            </Row>
          </Button>
        )}
      </Row>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 0,
          overflowX: "auto",
          padding: "16px 0",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {sections.map((section, idx) => {
          const isActive = idx === currentSectionIndex;
          const isQueued = idx === queuedSectionIndex;
          const nextSection = sections[idx + 1];

          return (
            <React.Fragment key={section.id}>
              {/* Section Card */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Card
                  onClick={() => handleSectionClick(idx)}
                  className={`timeline-section-card ${isActive ? "active" : ""} ${isQueued ? "queued" : ""} ${can("trigger-section", mode) ? "clickable" : ""}`}
                  title={
                    !can("trigger-section", mode)
                      ? undefined
                      : isPlaying
                        ? "Queue section to play next"
                        : "Switch to this section"
                  }
                >
                  {isActive && isPlaying && (
                    <div
                      className="timeline-section-progress-overlay"
                      style={{ width: `${sectionProgress * 100}%` }}
                    />
                  )}
                  <Row
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Stack style={{ gap: 4 }}>
                      <EditableSectionName
                        initialName={section.name}
                        onRename={(newName) =>
                          renameSection(section.id, newName)
                        }
                        disabled={!can("rename-section", mode)}
                      />
                      <Label>{section.lengthInBars} Bars</Label>
                    </Stack>
                    <Row style={{ gap: 4 }}>
                      {can("reorder-sections", mode) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveLeft(idx);
                            }}
                            disabled={idx === 0}
                            style={{ padding: "4px 8px" }}
                            title="Move section left"
                          >
                            <CaretLeftIcon size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveRight(idx);
                            }}
                            disabled={idx === sections.length - 1}
                            style={{ padding: "4px 8px" }}
                            title="Move section right"
                          >
                            <CaretRightIcon size={16} />
                          </Button>
                        </>
                      )}
                      {can("remove-section", mode) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSection(section.id);
                          }}
                          disabled={sections.length <= 1}
                          style={{ padding: "4px 8px" }}
                          title="Delete section"
                        >
                          <TrashIcon
                            size={16}
                            style={{ color: "var(--color-danger)" }}
                          />
                        </Button>
                      )}
                    </Row>
                  </Row>
                </Card>

                {/* Left-edge port dots (receive carry-forward from previous section) */}
                {can("change-routing", mode) &&
                  idx > 0 &&
                  DOT_POSITIONS.map((y, trackIndex) => {
                    const isLinked = section.trackLinks?.[trackIndex] ?? true;
                    return (
                      <button
                        key={trackIndex}
                        onClick={() =>
                          handleToggleCarryForward(trackIndex, idx, isLinked)
                        }
                        title={`${isLinked ? "Unlink" : "Link"} Track ${trackIndex + 1} carry-forward from previous section`}
                        style={{
                          position: "absolute",
                          left: -5,
                          top: y - 5,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: isLinked
                            ? TRACK_COLORS[trackIndex].accent
                            : "rgba(30,30,40,1)",
                          border: `2px solid ${isLinked ? TRACK_COLORS[trackIndex].accent : "rgba(255,255,255,0.18)"}`,
                          cursor: "pointer",
                          padding: 0,
                          zIndex: 10,
                          transition: "all 0.2s ease",
                          boxShadow: isLinked
                            ? `0 0 6px ${TRACK_COLORS[trackIndex].accent}`
                            : "none",
                        }}
                      />
                    );
                  })}

                {/* Right-edge port dots (signal exits towards next section) */}
                {can("change-routing", mode) &&
                  idx < sections.length - 1 &&
                  nextSection &&
                  DOT_POSITIONS.map((y, trackIndex) => {
                    const nextIsLinked =
                      nextSection.trackLinks?.[trackIndex] ?? true;
                    return (
                      <div
                        key={trackIndex}
                        style={{
                          position: "absolute",
                          right: -5,
                          top: y - 5,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: nextIsLinked
                            ? TRACK_COLORS[trackIndex].accent
                            : "rgba(30,30,40,1)",
                          border: `2px solid ${nextIsLinked ? TRACK_COLORS[trackIndex].accent : "rgba(255,255,255,0.18)"}`,
                          pointerEvents: "none",
                          zIndex: 10,
                          transition: "all 0.2s ease",
                          boxShadow: nextIsLinked
                            ? `0 0 6px ${TRACK_COLORS[trackIndex].accent}`
                            : "none",
                        }}
                      />
                    );
                  })}
              </div>

              {/* SVG Connector Bridge */}
              {idx < sections.length - 1 && nextSection && (
                <div
                  style={{
                    width: 40,
                    flexShrink: 0,
                    position: "relative",
                    alignSelf: "stretch",
                  }}
                >
                  <svg
                    width="40"
                    height="100%"
                    style={{
                      position: "absolute",
                      inset: 0,
                      overflow: "visible",
                    }}
                  >
                    {DOT_POSITIONS.map((y, trackIndex) => {
                      const nextIsLinked =
                        nextSection.trackLinks?.[trackIndex] ?? true;
                      const color = nextIsLinked
                        ? TRACK_COLORS[trackIndex].accent
                        : "rgba(255,255,255,0.07)";
                      const strokeW = nextIsLinked ? 2 : 1;
                      const isAnimating =
                        isPlaying &&
                        currentSectionIndex === idx &&
                        nextIsLinked &&
                        (tracks?.[trackIndex]?.hasAudio ||
                          tracks?.[trackIndex]?.isRecording);
                      return (
                        <path
                          key={trackIndex}
                          d={`M0,${y} C20,${y} 20,${y} 40,${y}`}
                          stroke={color}
                          strokeWidth={strokeW}
                          fill="none"
                          strokeDasharray={
                            nextIsLinked ? (isAnimating ? "6 4" : "0") : "4 3"
                          }
                          className={
                            isAnimating ? "signal-flow-line" : undefined
                          }
                          style={{
                            transition: "stroke 0.2s, stroke-width 0.2s",
                          }}
                        />
                      );
                    })}
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Stack>
  );
};
