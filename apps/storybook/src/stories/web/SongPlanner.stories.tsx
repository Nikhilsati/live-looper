import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SongPlanner } from "../../../../web/src/components/SongPlanner";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";

const meta: Meta<typeof SongPlanner> = {
  title: "Web/SongPlanner",
  component: SongPlanner,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof SongPlanner>;

const mockSections = [
  { id: "s1", name: "Intro", lengthInBars: 4, order: 0, trackStates: [] },
  { id: "s2", name: "Verse 1", lengthInBars: 8, order: 1, trackStates: [] },
  { id: "s3", name: "Chorus", lengthInBars: 8, order: 2, trackStates: [] },
  { id: "s4", name: "Outro", lengthInBars: 4, order: 3, trackStates: [] },
];

export const Default: Story = {
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: false,
        sections: mockSections,
        currentSectionIndex: 1,
        queuedSectionIndex: null,
        addSection: (name) => {
          const current = useLooperStore.getState().sections;
          const next = [
            ...current,
            {
              id: Math.random().toString(),
              name,
              lengthInBars: 4,
              order: current.length,
              trackStates: [],
            },
          ];
          useLooperStore.setState({ sections: next });
          return Promise.resolve();
        },
        deleteSection: (id) => {
          const next = useLooperStore.getState().sections.filter((s) => s.id !== id);
          useLooperStore.setState({ sections: next });
          return Promise.resolve();
        },
        renameSection: (id, name) => {
          const next = useLooperStore.getState().sections.map((s) => (s.id === id ? { ...s, name } : s));
          useLooperStore.setState({ sections: next });
          return Promise.resolve();
        },
        reorderSections: (ids) => {
          const current = useLooperStore.getState().sections;
          const next = ids
            .map((id, index) => {
              const sec = current.find((s) => s.id === id);
              return sec ? { ...sec, order: index } : null;
            })
            .filter((s) => s !== null);
          useLooperStore.setState({ sections: next as any });
          return Promise.resolve();
        },
      });
    }, []);

    return (
      <div style={{ maxWidth: "800px", padding: "16px" }}>
        <SongPlanner />
      </div>
    );
  },
};
