import React, { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Row,
  Button,
  Heading,
  Text,
  Badge,
} from "@live-looper/ui";
import {
  PlayIcon,
  StopIcon,
  TrashIcon,
  RecordIcon,
  XIcon,
  FloppyDiskIcon,
} from "@phosphor-icons/react";
import { useLooperStore } from "../store/useLooperStore";
import { useSessionStore } from "../store/useSessionStore";
import type { SessionRecord } from "@live-looper/types";

export const SessionManager = ({ onClose }: { onClose: () => void }) => {
  const { currentProject, isPlaying } = useLooperStore();
  const {
    isSessionArmed,
    setIsSessionArmed,
    isSessionRecording,
    isSessionReplaying,
    replaySession,
    stopReplay,
    sessions,
    fetchSessions,
    deleteSession,
  } = useSessionStore();

  useEffect(() => {
    if (currentProject?.id) {
      fetchSessions(currentProject.id);
    }
  }, [currentProject?.id, isSessionRecording]); // Reload when recording stops

  const handleDelete = async (id: string) => {
    await deleteSession(id);
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      style={{
        width: 400,
        maxHeight: 500,
        background: "rgba(13, 13, 15, 0.98)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Row
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Row style={{ gap: 8, alignItems: "center" }}>
          <FloppyDiskIcon size={20} color="#a78bfa" weight="fill" />
          <Heading style={{ fontSize: 16, margin: 0, letterSpacing: "0.02em" }}>
            Saved Sessions
          </Heading>
        </Row>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          style={{ padding: 4, borderRadius: 8 }}
          title="Close Session Manager"
        >
          <XIcon size={18} />
        </Button>
      </Row>

      <Stack style={{ padding: 20, gap: 16, overflowY: "auto", flex: 1 }}>
        {/* Session List */}
        <Stack style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 700,
              opacity: 0.5,
              letterSpacing: "0.05em",
            }}
          >
            SAVED SESSIONS
          </Text>
          {sessions.length === 0 ? (
            <Text
              style={{
                fontSize: 13,
                opacity: 0.4,
                fontStyle: "italic",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              No sessions recorded yet.
            </Text>
          ) : (
            sessions.map((session) => (
              <Row
                key={session.id}
                style={{
                  padding: 12,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.05)",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack style={{ gap: 2 }}>
                  <Text style={{ fontWeight: 600, fontSize: 14 }}>
                    {session.name}
                  </Text>
                  <Row style={{ gap: 8, opacity: 0.5, fontSize: 11 }}>
                    <span>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{formatDuration(session.durationMs)}</span>
                    <span>•</span>
                    <span>{session.events.length} events</span>
                  </Row>
                </Stack>
                <Row style={{ gap: 6 }}>
                  {isSessionReplaying ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={stopReplay}
                      style={{ width: 32, height: 32, padding: 0 }}
                      title="Stop replay"
                    >
                      <StopIcon size={16} weight="fill" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isPlaying}
                      onClick={() => replaySession(session)}
                      style={{ width: 32, height: 32, padding: 0 }}
                      title={
                        isPlaying ? "Stop playback first" : "Replay Session"
                      }
                    >
                      <PlayIcon size={16} weight="fill" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(session.id)}
                    style={{ width: 32, height: 32, padding: 0, opacity: 0.5 }}
                    title="Delete session permanently"
                  >
                    <TrashIcon size={16} />
                  </Button>
                </Row>
              </Row>
            ))
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
