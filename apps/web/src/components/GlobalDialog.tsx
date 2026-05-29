import React from "react";
import { useDialogStore } from "../store/useDialogStore";
import {
  Modal,
  Card,
  Heading,
  Text,
  Button,
  Stack,
  Row,
} from "@live-looper/ui";

export const GlobalDialog: React.FC = () => {
  const { isOpen, options, closeDialog } = useDialogStore();

  if (!isOpen || !options) return null;

  const {
    type,
    title,
    message,
    danger,
    confirmText = "OK",
    cancelText = "Cancel",
  } = options;

  return (
    <Modal onClose={() => closeDialog(false)}>
      <Card
        style={{
          width: 440,
          padding: 32,
          background: "var(--surface, #1e1e1e)",
          border: danger
            ? "1px solid rgba(255, 107, 107, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: danger
            ? "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 107, 107, 0.1) inset"
            : "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <Stack style={{ gap: 24 }}>
          <Heading
            style={{
              fontSize: 24,
              margin: 0,
              color: danger ? "#ff6b6b" : "white",
            }}
          >
            {title}
          </Heading>
          <Text style={{ fontSize: 16, opacity: 0.9 }}>{message}</Text>
          <Row style={{ gap: 16, justifyContent: "flex-end", marginTop: 8 }}>
            {type === "confirm" && (
              <Button
                variant="ghost"
                onClick={() => closeDialog(false)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  fontWeight: 600,
                }}
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => closeDialog(true)}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                background: danger
                  ? "rgba(239, 68, 68, 0.2)"
                  : "var(--primary, #a881ff)",
                color: danger ? "#ff6b6b" : "white",
                border: danger ? "none" : "auto",
                fontWeight: 600,
              }}
            >
              {confirmText}
            </Button>
          </Row>
        </Stack>
      </Card>
    </Modal>
  );
};
