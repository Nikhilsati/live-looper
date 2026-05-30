import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProjectDashboard } from "../../../../web/src/components/ProjectDashboard";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { useDialogStore } from "../../../../web/src/store/useDialogStore";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof ProjectDashboard> = {
  title: "Web/ProjectDashboard",
  component: ProjectDashboard,
  tags: ["ai-generated"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectDashboard>;

const mockProjects = [
  { id: "p1", name: "Midnight Blues", bpm: 96, updatedAt: Date.now() - 1000 * 60 * 30 },
  { id: "p2", name: "Synth Wave Jam", bpm: 120, updatedAt: Date.now() - 1000 * 60 * 60 * 24 },
  { id: "p3", name: "Acoustic Idea 4", bpm: 84, updatedAt: Date.now() - 1000 * 60 * 60 * 48 },
];

export const PrimaryDashboard: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        projectList: mockProjects,
        fetchProjects: async () => console.log("Fetching projects on dashboard..."),
        createNewProject: async (name) => {
          console.log("Create project from dashboard:", name);
          const nextProjects = [...useLooperStore.getState().projectList, { id: `p${Date.now()}`, name, bpm: 120, updatedAt: Date.now() }];
          useLooperStore.setState({ projectList: nextProjects });
          return `p${Date.now()}`;
        },
        deleteProject: async (id) => {
          console.log("Delete project from dashboard:", id);
          const nextProjects = useLooperStore.getState().projectList.filter((p) => p.id !== id);
          useLooperStore.setState({ projectList: nextProjects });
        },
        exportProject: async (id) => console.log("Export project:", id),
        importProject: async (file) => console.log("Import project:", file.name),
      });

      // Stub useDialogStore resolution for confirmations in storybook
      useDialogStore.setState({
        pushDialog: async (options) => {
          console.log("Confirmed dialog message:", options.message);
          return true; // Auto-confirm delete actions in storybook for simplicity
        },
      });
    }, []);

    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
        <ProjectDashboard />
      </div>
    );
  },
};

export const EmptyDashboard: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        projectList: [],
        fetchProjects: async () => console.log("Fetching projects on dashboard..."),
        createNewProject: async (name) => {
          console.log("Create project from dashboard:", name);
          return "new-id";
        },
      });
    }, []);

    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
        <ProjectDashboard />
      </div>
    );
  },
};
