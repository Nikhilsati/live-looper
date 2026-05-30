import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal, Card, Heading, Text, Button } from "@live-looper/ui";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ padding: "40px", minHeight: "300px" }}>
        <Button variant="primary" onClick={() => setIsOpen(true)} style={{ padding: "10px 20px" }}>
          Open Dialog Modal
        </Button>

        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <Card
              style={{
                width: "420px",
                padding: "24px",
                border: "1px solid var(--border)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Heading style={{ fontSize: "20px", marginBottom: "12px" }}>
                Confirm Session Clear
              </Heading>
              <Text
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: "24px",
                  lineHeight: "1.5",
                }}
              >
                Are you sure you want to clear your current recording session? All unsaved tracks and
                planned timelines will be permanently lost.
              </Text>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  style={{ padding: "8px 16px" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setIsOpen(false)}
                  style={{ padding: "8px 16px" }}
                >
                  Clear Session
                </Button>
              </div>
            </Card>
          </Modal>
        )}
      </div>
    );
  },
};
