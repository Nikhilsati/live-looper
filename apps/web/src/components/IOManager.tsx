import { useEffect, useRef } from 'react';
import { Card, Stack, Row, Label } from '@live-looper/ui';
import { useLooperStore } from '../store/useLooperStore';
import { MicrophoneIcon, SpeakerHighIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react';

/** True if AudioContext.setSinkId is available (Chrome 110+). */
const supportsOutputSelection: boolean = (() => {
    try {
        return typeof (window as any).AudioContext !== 'undefined' &&
            'setSinkId' in AudioContext.prototype;
    } catch {
        return false;
    }
})();

export const IOManager = () => {
    const {
        availableInputs,
        availableOutputs,
        inputDeviceId,
        outputDeviceId,
        refreshDevices,
        setInputDevice,
        setOutputDevice,
    } = useLooperStore();

    const deviceChangeRegistered = useRef(false);

    useEffect(() => {
        refreshDevices();

        if (!deviceChangeRegistered.current) {
            deviceChangeRegistered.current = true;
            navigator.mediaDevices.addEventListener('devicechange', () => {
                refreshDevices();
            });
        }
    }, []);

    const handleInputChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        await setInputDevice(e.target.value);
    };

    const handleOutputChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        await setOutputDevice(e.target.value);
    };

    const selectStyle: React.CSSProperties = {
        width: '100%',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.85)',
        fontSize: 12,
        padding: '6px 10px',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        paddingRight: 28,
    };

    const emptyLabel = availableInputs.length === 0 ? 'Grant mic permission first' : undefined;

    return (
        <Card style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            width: 280,
            zIndex: 100,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
            <Stack style={{ gap: 14 }}>
                {/* Header */}
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Row style={{ alignItems: 'center', gap: 8 }}>
                        <MicrophoneIcon size={15} style={{ color: 'var(--accent, #a78bfa)' }} weight="fill" />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'white', letterSpacing: '0.03em' }}>
                            I/O Devices
                        </span>
                    </Row>
                    <button
                        onClick={() => refreshDevices()}
                        title="Refresh device list"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.4)',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 6,
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                    >
                        <ArrowsClockwiseIcon size={14} />
                    </button>
                </Row>

                {/* Input */}
                <Stack style={{ gap: 6 }}>
                    <Row style={{ alignItems: 'center', gap: 6 }}>
                        <MicrophoneIcon size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                        <Label style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Input
                        </Label>
                    </Row>
                    {emptyLabel ? (
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                            {emptyLabel}
                        </span>
                    ) : (
                        <select
                            style={selectStyle}
                            value={inputDeviceId ?? ''}
                            onChange={handleInputChange}
                        >
                            {availableInputs.map(d => (
                                <option key={d.deviceId} value={d.deviceId}>
                                    {d.label || `Microphone (${d.deviceId.slice(0, 8)}…)`}
                                </option>
                            ))}
                        </select>
                    )}
                </Stack>

                {/* Output */}
                <Stack style={{ gap: 6 }}>
                    <Row style={{ alignItems: 'center', gap: 6 }}>
                        <SpeakerHighIcon size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                        <Label style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Output
                        </Label>
                    </Row>
                    {!supportsOutputSelection ? (
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                            Output selection requires Chrome
                        </span>
                    ) : availableOutputs.length === 0 ? (
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                            No output devices found
                        </span>
                    ) : (
                        <select
                            style={selectStyle}
                            value={outputDeviceId ?? ''}
                            onChange={handleOutputChange}
                        >
                            {availableOutputs.map(d => (
                                <option key={d.deviceId} value={d.deviceId}>
                                    {d.label || `Speaker (${d.deviceId.slice(0, 8)}…)`}
                                </option>
                            ))}
                        </select>
                    )}
                </Stack>
            </Stack>
        </Card>
    );
};
