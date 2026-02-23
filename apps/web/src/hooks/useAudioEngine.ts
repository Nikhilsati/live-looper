import { useEffect } from 'react';
import { audioEngine } from '@live-looper/audio-engine';
import { useLooperStore } from '../store/useLooperStore';

export const useAudioEngine = () => {
    const handleEngineEvent = useLooperStore(state => state.handleEngineEvent);

    useEffect(() => {
        const unsubscribe = audioEngine.subscribe((event: any) => {
            handleEngineEvent(event);
        });
        return unsubscribe;
    }, [handleEngineEvent]);
};
