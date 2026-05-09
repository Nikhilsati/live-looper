import { useEffect } from 'react';
import { useLooperStore } from '../store/useLooperStore';
import { useSessionStore } from '../store/useSessionStore';

export const useKeyboardShortcuts = () => {
    const togglePlayback = useSessionStore(state => state.togglePlayback);
    const toggleTrackRecording = useLooperStore(state => state.toggleTrackRecording);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if in input field
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // SPACE -> Play / Pause
            if (e.code === 'Space') {
                e.preventDefault();
                togglePlayback();
            }

            // 1-4 -> Arm Track
            if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
                const trackId = parseInt(e.code.replace('Digit', ''), 10) - 1;
                toggleTrackRecording(trackId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlayback, toggleTrackRecording]);
};
