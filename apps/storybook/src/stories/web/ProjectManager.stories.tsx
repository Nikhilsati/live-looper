import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProjectManager } from "../../../../web/src/components/ProjectManager";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof ProjectManager> = {
  title: "Web/ProjectManager",
  component: ProjectManager,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof ProjectManager>;

const mockProjects = [
  { id: "p1", name: "Midnight Blues", bpm: 96, updatedAt: Date.now() - 1000 * 60 * 30 },
  { id: "p2", name: "Synth Wave Jam", bpm: 120, updatedAt: Date.now() - 1000 * 60 * 60 * 24 },
  { id: "p3", name: "Acoustic Idea 4", bpm: 84, updatedAt: Date.now() - 1000 * 60 * 60 * 48 },
];

export const ClosedButton: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        projectList: mockProjects,
        currentProject: mockProjects[0],
        mode: "planning",
        fetchProjects: async () => console.log("Fetch projects..."),
        createNewProject: async (name) => {
          console.log("Create project", name);
          const nextProjects = [...useLooperStore.getState().projectList, { id: `p${Date.now()}`, name, bpm: 120, updatedAt: Date.now() }];
          useLooperStore.setState({ projectList: nextProjects });
          return "new-id";
        },
        loadProject: async (id) => {
          console.log("Load project", id);
          const proj = useLooperStore.getState().projectList.find((p) => p.id === id);
          if (proj) useLooperStore.setState({ currentProject: proj });
        },
        deleteProject: async (id) => {
          console.log("Delete project", id);
          const nextProjects = useLooperStore.getState().projectList.filter((p) => p.id !== id);
          useLooperStore.setState({ projectList: nextProjects });
        },
        exportProject: async (id) => console.log("Export project", id),
        importProject: async (file) => console.log("Import project", file.name),
      });
    }, []);

    return (
      <div style={{ padding: "40px", background: "#0a0a0f", minHeight: "150px" }}>
        <ProjectManager />
      </div>
    );
  },
};
