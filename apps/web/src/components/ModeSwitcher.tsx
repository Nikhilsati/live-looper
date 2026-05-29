import React from "react";
import { useLooperStore } from "../store/useLooperStore";
import { Row, Button } from "@live-looper/ui";
import {
  LayoutIcon,
  PlayIcon,
  BroadcastIcon,
  SaveIcon,
} from "@live-looper/icons";
import type { Mode } from "@live-looper/types";
import { useSessionStore } from "../store/useSessionStore";
import { SessionManager } from "./SessionManager";

export const ModeSwitcher: React.FC = () => {
  const { mode, setMode } = useLooperStore();
  const {
    isSessionArmed,
    setIsSessionArmed,
    isSessionRecording,
    isSessionReplaying,
  } = useSessionStore();
  const [showSessions, setShowSessions] = React.useState(false);

  const modes: {
    id: Mode;
    label: string;
    icon: any;
    activeColor: string;
    activeBg: string;
    glowColor: string;
  }[] = [
    {
      id: "planning",
      label: "Plan",
      icon: LayoutIcon,
      activeColor: "#93c5fd",
      activeBg: "rgba(59,130,246,0.2)",
      glowColor: "rgba(59,130,246,0.3)",
    },
    {
      id: "practice",
      label: "Practice",
      icon: PlayIcon,
      activeColor: "#fcd34d",
      activeBg: "rgba(234,179,8,0.2)",
      glowColor: "rgba(234,179,8,0.3)",
    },
    {
      id: "live",
      label: "● LIVE",
      icon: BroadcastIcon,
      activeColor: "#fca5a5",
      activeBg: "rgba(220,38,38,0.25)",
      glowColor: "rgba(220,38,38,0.4)",
    },
  ];

  return (
    <Row style={{ gap: 12, alignItems: "center" }}>
      {/* Recording / Arm Toggle */}

      <Row
        style={{
          gap: 4,
          padding: "4px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {modes.map((m) => {
          const isActive = mode === m.id;
          const Icon = m.icon;
          return (
            <Button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 18px",
                minWidth: 0,
                justifyContent: "center",
                borderRadius: 10,
                fontWeight: isActive ? 700 : 400,
                fontSize: 13,
                letterSpacing: isActive ? "0.04em" : 0,
                background: isActive ? m.activeBg : "transparent",
                color: isActive ? m.activeColor : "rgba(255,255,255,0.45)",
                border: isActive
                  ? `1px solid ${m.activeColor}44`
                  : "1px solid transparent",
                boxShadow: isActive ? `0 0 16px ${m.glowColor}` : "none",
                transition: "all 0.2s ease",
                animation:
                  isActive && m.id === "live"
                    ? "live-pulse 2s ease-in-out infinite"
                    : "none",
              }}
            >
              <Icon size={18} />
              <span>{m.label}</span>
            </Button>
          );
        })}

        <div
          style={{
            width: 1,
            height: 24,
            background: "rgba(255,255,255,0.1)",
            margin: "0 4px",
          }}
        />

        {/* Sessions Tab-like Button */}
        <div style={{ position: "relative" }}>
          <Button
            onClick={() => setShowSessions(!showSessions)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 18px",
              borderRadius: 10,
              fontWeight: showSessions || isSessionReplaying ? 700 : 400,
              fontSize: 13,
              background:
                showSessions || isSessionReplaying
                  ? "rgba(167, 139, 250, 0.15)"
                  : "transparent",
              color:
                showSessions || isSessionReplaying
                  ? "#a78bfa"
                  : "rgba(255,255,255,0.45)",
              border:
                showSessions || isSessionReplaying
                  ? "1px solid rgba(167, 139, 250, 0.3)"
                  : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <SaveIcon size={18} />
            <span>Sessions</span>
          </Button>
          {showSessions && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                zIndex: 2000,
              }}
            >
              <SessionManager onClose={() => setShowSessions(false)} />
            </div>
          )}
        </div>
      </Row>
    </Row>
  );
};
