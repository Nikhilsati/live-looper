import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlobalDialog } from "../../../../web/src/components/GlobalDialog";
import { useDialogStore } from "../../../../web/src/store/useDialogStore";

const meta: Meta<typeof GlobalDialog> = {
  title: "Web/GlobalDialog",
  component: GlobalDialog,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof GlobalDialog>;

export const StandardAlert: Story = {
  render: () => {
    useEffect(() => {
      useDialogStore.setState({
        isOpen: true,
        options: {
          type: "alert",
          title: "Audio Engine Initialized",
          message: "The Live Looper audio engine has started successfully. Plug in your guitar to begin.",
          confirmText: "Got it",
        },
        closeDialog: (res) => {
          console.log("Dialog closed with result:", res);
          useDialogStore.setState({ isOpen: false });
        },
      });
    }, []);

    return (
      <div style={{ background: "#0a0a0f", minHeight: "300px" }}>
        <GlobalDialog />
      </div>
    );
  },
};

export const DangerConfirm: Story = {
  render: () => {
    useEffect(() => {
      useDialogStore.setState({
        isOpen: true,
        options: {
          type: "confirm",
          title: "Delete Project?",
          message: "This will permanently remove the project 'Midnight Blues' and all recorded layers.",
          danger: true,
          confirmText: "Delete Permanently",
          cancelText: "Keep Project",
        },
        closeDialog: (res) => {
          console.log("Dialog closed with result:", res);
          useDialogStore.setState({ isOpen: false });
        },
      });
    }, []);

    return (
      <div style={{ background: "#0a0a0f", minHeight: "300px" }}>
        <GlobalDialog />
      </div>
    );
  },
};
