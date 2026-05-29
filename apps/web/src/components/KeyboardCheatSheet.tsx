import React from "react";
import { Card, Stack, Row, Label } from "@live-looper/ui";

export const KeyboardCheatSheet: React.FC = () => {
  return (
    <Card
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        padding: "16px 20px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        width: 260,
        zIndex: 100,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <Stack style={{ gap: "16px" }}>
        <Label
          style={{ fontSize: "10px", opacity: 0.4, letterSpacing: "0.05em" }}
        >
          KEYBOARD SHORTCUTS
        </Label>
        <Stack style={{ gap: "10px" }}>
          {[
            { key: "1-4", label: "Arm Track" },
            { key: "SPACE", label: "Play / Pause" },
          ].map((item, i) => (
            <Row
              key={i}
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: "10px",
                  padding: "4px 8px",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontWeight: 800,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {item.key}
              </span>
              <span style={{ fontSize: "12px", opacity: 0.8, color: "white" }}>
                {item.label}
              </span>
            </Row>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};
