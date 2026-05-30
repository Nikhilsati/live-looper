import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DevInspector } from "../../../../web/src/components/DevInspector";
import { useLooperStore } from "../../../../web/src/store/useLooperStore";
import { db } from "@live-looper/storage";

const meta: Meta<typeof DevInspector> = {
  title: "Web/DevInspector",
  component: DevInspector,
  tags: ["ai-generated"],
};

export default meta;
type Story = StoryObj<typeof DevInspector>;

export const DefaultInspector: Story = {
  render: () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
      // Mock AudioContext's decodeAudioData to return a beautiful sine wave for storybook rendering
      const originalDecode = AudioContext.prototype.decodeAudioData;
      AudioContext.prototype.decodeAudioData = async function () {
        const length = 44100 * 2; // 2 seconds
        const data = new Float32Array(length);
        for (let i = 0; i < length; i++) {
          data[i] = Math.sin(i * 0.005) * 0.6 * (1 - i / length); // decaying sine wave
        }
        return {
          length,
          duration: 2.0,
          sampleRate: 44100,
          numberOfChannels: 1,
          getChannelData: () => data,
        } as any;
      };

      const seedDB = async () => {
        try {
          await db.projects.clear();
          await db.tracks.clear();
          await db.sections.clear();
          await db.layers.clear();
          await db.audioBlobs.clear();

          const projectId = "p-dev";
          await db.projects.add({ id: projectId, name: "Inspection Jam", settings: {} } as any);
          const t1 = await db.tracks.add({ id: "track-1", projectId, order: 0 } as any);
          const s1 = await db.sections.add({ id: "sec-1", projectId, order: 0, name: "Verse 1" } as any);

          // Seed a fake audio blob (WAV type container)
          const dummyBlob = new Blob([new Uint8Array(1000)], { type: "audio/wav" });
          await db.audioBlobs.add({
            id: "blob-1",
            projectId,
            blob: dummyBlob,
            lengthSamples: 88200,
            sampleRate: 44100,
          } as any);

          await db.layers.add({
            id: "layer-1",
            projectId,
            trackId: t1,
            sectionId: s1,
            audioBlobId: "blob-1",
            name: "Rhythm Guitar",
            order: 0,
            createdAt: Date.now() - 60000,
          } as any);

          useLooperStore.setState({
            currentProject: { id: projectId, name: "Inspection Jam" } as any,
            mode: "planning",
            showDevInspector: true,
            bpm: 120,
            tracks: [
              {
                isMuted: false,
                isSoloed: false,
                isRecording: false,
                isArmed: false,
                hasAudio: true,
                layerCount: 1,
                waveformData: [0.1, 0.3, 0.6, 0.4, 0.2],
                fx: {} as any,
              },
            ] as any,
            sections: [
              { id: "sec-1", name: "Verse 1", lengthInBars: 4, order: 0, trackStates: [] },
            ],
          });

          setReady(true);
        } catch (e) {
          console.error("Failed to seed inspector DB", e);
          setReady(true);
        }
      };

      seedDB();

      return () => {
        AudioContext.prototype.decodeAudioData = originalDecode;
      };
    }, []);

    if (!ready) return <div>Initializing mock IndexedDB and Audio Mocks...</div>;

    return (
      <div style={{ background: "#0a0a0f", minHeight: "400px", padding: "16px" }}>
        <DevInspector />
      </div>
    );
  },
};
