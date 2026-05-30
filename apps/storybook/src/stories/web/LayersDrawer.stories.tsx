import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LayersDrawer } from "../../../../web/src/components/TrackControls";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { db } from "@live-looper/storage";

const meta: Meta<typeof LayersDrawer> = {
  title: "Web/LayersDrawer",
  component: LayersDrawer,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof LayersDrawer>;

export const Default: Story = {
  args: {
    trackId: 0,
    accent: "#a78bfa",
    onClose: () => console.log("Close layers drawer"),
  },
  render: (args) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
      const seedDB = async () => {
        try {
          await db.projects.clear();
          await db.tracks.clear();
          await db.sections.clear();
          await db.layers.clear();
          await db.audioBlobs.clear();

          await db.projects.add({ id: "p1", name: "Demo Project", settings: {} } as any);
          const trackDbId = await db.tracks.add({ id: "t1", projectId: "p1", order: 0 } as any);
          const sectionDbId = await db.sections.add({
            id: "s1",
            projectId: "p1",
            order: 0,
            name: "Main Groove",
          } as any);

          const dummyBlob = new Blob([new Float32Array(100).buffer], { type: "audio/wav" });
          const blobId1 = await db.audioBlobs.add({ id: "b1", blob: dummyBlob } as any);
          const blobId2 = await db.audioBlobs.add({ id: "b2", blob: dummyBlob } as any);

          await db.layers.add({
            id: "l1",
            projectId: "p1",
            trackId: trackDbId,
            sectionId: sectionDbId,
            audioBlobId: blobId1,
            order: 0,
            name: "Base Beat",
          } as any);

          await db.layers.add({
            id: "l2",
            projectId: "p1",
            trackId: trackDbId,
            sectionId: sectionDbId,
            audioBlobId: blobId2,
            order: 1,
            name: "Percussion Overdub",
          } as any);

          useLooperStore.setState({
            currentProject: { id: "p1", name: "Demo Project" } as any,
            currentSectionIndex: 0,
            sections: [
              { id: "s1", name: "Main Groove", lengthInBars: 4, order: 0, trackStates: [] },
            ],
          });

          setReady(true);
        } catch (e) {
          console.error("Failed to seed storybook DB", e);
          setReady(true);
        }
      };

      seedDB();
    }, []);

    if (!ready) return <div>Loading story database...</div>;
    return (
      <div style={{ maxWidth: "400px", padding: "12px", background: "#0a0a0f" }}>
        <LayersDrawer {...args} />
      </div>
    );
  },
};
