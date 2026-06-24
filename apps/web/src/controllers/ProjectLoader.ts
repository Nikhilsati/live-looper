import { db, projectService } from "@live-looper/storage";
import { audioEngine } from "@live-looper/audio-engine";
import { useLooperStore } from "../store/useLooperStore";
import { SectionConfig } from "@live-looper/types";
import { FXBuilder } from "@live-looper/audio-engine/src/FXBuilder";
import { TRACK_COUNT } from "@live-looper/types";

export class ProjectLoader {
  static async loadProject(projectId: string) {
    const store = useLooperStore.getState();

    // Reset current tracks before loading to avoid flicker/stale data
    const defaultTrack = () => ({
      isMuted: false,
      isSoloed: false,
      isRecording: false,
      isArmed: false,
      hasAudio: false,
      layerCount: 0,
      waveformData: [],
      fx: new FXBuilder().build(),
    });

    useLooperStore.setState({
      tracks: Array.from({ length: TRACK_COUNT }, defaultTrack),
      isPlaying: false,
    });

    if (!audioEngine.context || !audioEngine.workletNode) await audioEngine.init();

    // Wipe all in-worklet buffers before loading the new project so no
    // audio from the previously-open project bleeds through.
    audioEngine.clearAllTracks();

    const project = await db.projects.get(projectId);
    if (!project) return;

    audioEngine.currentProjectId = projectId;

    const tracks = await db.tracks.where({ projectId }).sortBy("order");
    (audioEngine as any).trackIdMap = tracks.map((t: any) => t.id);

    const rawSections = await db.sections.where({ projectId }).sortBy("order");
    (audioEngine as any).sectionIdMap = rawSections.map((s: any) => s.id);

    const sampleRate = audioEngine.context!.sampleRate;

    const sectionConfigs: SectionConfig[] = rawSections.map((s: any) => {
      let bars: number;
      if (s.lengthInBars != null && s.lengthInBars > 0) {
        bars = s.lengthInBars;
      } else if (s.lengthSamples > 0) {
        bars = Math.max(
          1,
          Math.round((s.lengthSamples * project.bpm) / (60 * sampleRate * 4)),
        );
      } else {
        bars = 4;
      }
      return {
        id: s.id,
        index: s.order,
        name: s.name,
        lengthInBars: bars,
        trackLinks: s.trackLinks ?? [true, true, true, true],
      };
    });

    const projectSmartSnap = project.settings?.smartSnapEnabled ?? true;
    (audioEngine as any).smartSnapEnabled = projectSmartSnap;

    // Sync worklet with the resolved section config
    audioEngine.workletNode?.port.postMessage({
      type: "CONFIG",
      payload: {
        sampleRate,
        bpm: project.bpm,
        sections: sectionConfigs,
        latencySamples: audioEngine.latencySamples,
        smartSnapEnabled: projectSmartSnap,
        quantization: { snapToGrid: true, gridResolution: 16 },
      },
    });

    tracks.forEach((t: any, i: number) => {
      if (t.fx) {
        const mergedFX = new FXBuilder(t.fx).build();
        audioEngine.updateFX(i, mergedFX, project.bpm);
      }
    });

    (audioEngine as any)._workletMuteState = Array(TRACK_COUNT).fill(false);
    tracks.forEach((t: any, i: number) => {
      const shouldBeMuted = t.muted ?? false;
      if (shouldBeMuted) {
        audioEngine.workletNode?.port.postMessage({
          type: "MUTE_TRACK",
          payload: { trackId: i, muted: true },
        });
        (audioEngine as any)._workletMuteState[i] = true;
      }
    });

    const layers = await db.layers
      .where({ projectId })
      .filter((l) => !l.deletedAt)
      .toArray();
    const layerCounts: Record<number, number> = {};
    const waveformDataMap: Record<number, number[]> = {};

    for (const layer of layers) {
      const blobRecord = await db.audioBlobs.get(layer.audioBlobId);
      if (blobRecord && audioEngine.context) {
        try {
          const arrayBuffer = await blobRecord.blob.arrayBuffer();
          const audioBuffer = await audioEngine.context.decodeAudioData(arrayBuffer);
          const data = audioBuffer.getChannelData(0);

          const trackIdx = (audioEngine as any).trackIdMap.indexOf(layer.trackId);
          const sectionIdx = (audioEngine as any).sectionIdMap.indexOf(layer.sectionId);

          if (trackIdx !== -1 && sectionIdx !== -1) {
            audioEngine.loadBuffer(trackIdx, sectionIdx, data);

            if (sectionIdx === 0) {
              layerCounts[trackIdx] = (layerCounts[trackIdx] || 0) + 1;
              waveformDataMap[trackIdx] = audioEngine.computeWaveform(data);
            }
          }
        } catch (e) {
          console.error("Error loading audio blob into engine", e);
        }
      }
    }

    const liveTrack = project.settings?.liveTrack ? {
      ...project.settings.liveTrack,
      fx: new FXBuilder(project.settings.liveTrack.fx).build(),
    } : {
      isMuted: false,
      fx: new FXBuilder().build(),
    };

    useLooperStore.setState({ currentProject: project || null });

    // Emulate the PROJECT_LOADED event that the UI expects
    useLooperStore.getState().handleEngineEvent({
      type: "PROJECT_LOADED",
      payload: {
        project: project as any,
        tracks: tracks as any,
        sections: sectionConfigs,
        layerCounts,
        waveformDataMap,
        liveTrack: liveTrack as any,
      },
    });
  }

  static async loadDemoData() {
    const projectId = await projectService.createProject(
      "Demo Jam",
      100,
    );
    await ProjectLoader.loadProject(projectId);

    const ctx = audioEngine.context!;
    const exactLen = (audioEngine as any).sectionLenSamples(2, 100);

    const samples = [
      "/samples/looperman-l-2148602-0151263-secret-trap-drumloop-100bpm.wav",
      "/samples/looperman-l-6590395-0406745-zaytoven-2.wav",
      "/samples/looperman-l-0498019-0103176-tumbleweed-100-e-acoustic-guitar-mute-rhythm.wav",
      "/samples/looperman-l-0498019-0079454-tumbleweed-100-e-d-a-d-clean-strat-rhythm.wav",
    ];

    const loadAndDecode = async (url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        return audioBuffer.getChannelData(0);
      } catch (e) {
        console.error(`Failed to load sample: ${url}`, e);
        return null;
      }
    };

    for (let i = 0; i < samples.length; i++) {
      const raw = await loadAndDecode(samples[i]);
      if (raw && audioEngine.currentProjectId) {
        let buffer: Float32Array;
        if (exactLen > 0 && raw.length !== exactLen) {
          buffer = new Float32Array(exactLen);
          buffer.set(raw.subarray(0, Math.min(raw.length, exactLen)));
        } else {
          buffer = raw;
        }

        await projectService.saveLayer({
          projectId: audioEngine.currentProjectId,
          trackId: (audioEngine as any).trackIdMap[i % 4],
          sectionId: (audioEngine as any).sectionIdMap[0],
          audioData: buffer,
          sampleRate: ctx.sampleRate,
        });
      }
    }

    await ProjectLoader.loadProject(audioEngine.currentProjectId!);
  }
}
