import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SessionManager } from "../../../../web/src/components/SessionManager";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { useSessionStore } from "../../../../web/src/store/useSessionStore";

const meta: Meta<typeof SessionManager> = {
  title: "Web/SessionManager",
  component: SessionManager,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof SessionManager>;

const mockSessions = [
  {
    id: "sess1",
    name: "Acoustic Jam Session",
    projectId: "p1",
    createdAt: Date.now() - 3600 * 1000 * 24, // 1 day ago
    durationMs: 45000,
    events: [{}, {}, {}, {}],
  },
  {
    id: "sess2",
    name: "Rock Solos Loop",
    projectId: "p1",
    createdAt: Date.now() - 3600 * 1000 * 2, // 2 hours ago
    durationMs: 92000,
    events: [{}, {}, {}, {}, {}, {}],
  },
];

export const Default: Story = {
  args: {
    onClose: () => console.log("Close session manager"),
  },
  render: (args) => {
    useEffect(() => {
      useLooperStore.setState({
        currentProject: { id: "p1", name: "Project 1" } as any,
        isPlaying: false,
      });

      useSessionStore.setState({
        isSessionArmed: true,
        isSessionRecording: false,
        isSessionReplaying: false,
        sessions: mockSessions as any,
        fetchSessions: () => Promise.resolve(),
        deleteSession: (id) => {
          const filtered = useSessionStore.getState().sessions.filter((s) => s.id !== id);
          useSessionStore.setState({ sessions: filtered });
          return Promise.resolve();
        },
      });
    }, []);

    return (
      <div style={{ padding: "16px" }}>
        <SessionManager {...args} />
      </div>
    );
  },
};
