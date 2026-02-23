export class MasterClock {
    private context: AudioContext;
    private bpm: number;

    constructor(context: AudioContext, bpm: number) {
        this.context = context;
        this.bpm = bpm;
    }

    get sampleRate() {
        return this.context.sampleRate;
    }

    get secondsPerBeat() {
        return 60 / this.bpm;
    }

    get secondsPerBar() {
        return this.secondsPerBeat * 4;
    }

    // Helper to convert time to bars/beats
    getTimeInfo(time: number) {
        const totalBeats = time / this.secondsPerBeat;
        const currentBar = Math.floor(totalBeats / 4);
        const currentBeat = Math.floor(totalBeats % 4);
        return { currentBar, currentBeat };
    }
}
