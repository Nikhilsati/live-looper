import React from 'react';
import { useLooperStore } from '../store/useLooperStore';
import {
    Stack, Row, Heading, Text, Button, StatusDot
} from '@live-looper/ui';
import { TrackControls, HeaderIndications, GlobalActionBar } from './TrackControls';
import { LatencyMonitor } from './LatencyMonitor';
import { KeyboardCheatSheet } from './KeyboardCheatSheet';
import { DevInspector } from './DevInspector';
import { ModeSwitcher } from './ModeSwitcher';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const LooperWorkspace: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentProject, mode, closeProject, loadProject } = useLooperStore();

    // Initialize keyboard shortcuts
    useKeyboardShortcuts();

    useEffect(() => {
        if (id && currentProject?.id !== id) {
            loadProject(id);
        }
    }, [id]);

    const handleBack = () => {
        closeProject();
        navigate('/');
    };

    const isLive = mode === 'live';
    const isPractice = mode === 'practice';

    return (
        <Stack style={{
            width: '100%',
            maxWidth: 1400,
            margin: '0 auto',
            padding: isLive ? '16px' : '24px',
            paddingBottom: 120,
            transition: 'padding 0.3s ease'
        }}>
            {/* Header / Top Bar — always visible */}
            <Row style={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: isLive ? 20 : 32,
                transition: 'margin 0.3s ease'
            }}>
                <Row style={{ gap: 20, alignItems: 'center', flex: 1 }}>
                    {/* Hide back button in Live mode — no accidental navigation */}
                    {!isLive && (
                        <Button variant="ghost" onClick={handleBack} style={{ padding: 8 }}>
                            <ArrowLeftIcon size={24} />
                        </Button>
                    )}
                    <Stack style={{ gap: 0 }}>
                        <Heading style={{ fontSize: isLive ? 22 : 28 }}>{currentProject?.name || 'Live Looper'}</Heading>
                        {!isLive && <Text style={{ opacity: 0.5, fontSize: 14 }}>Session started</Text>}
                    </Stack>
                    <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
                    <HeaderIndications />
                </Row>

                <Row style={{ gap: 24, alignItems: 'center' }}>
                    <ModeSwitcher />
                    <StatusDot />
                </Row>
            </Row>

            {/* Main Content Area */}
            <Stack style={{ gap: isLive ? 20 : 32, transition: 'gap 0.3s ease' }}>
                {/* Track Pads — always visible, same grid layout across all modes */}
                <TrackControls />

                {/* Dev Inspector — Planning only, toggled */}
                <DevInspector />
            </Stack>

            {/* Sticky Performance Widget — Planning only */}
            {!isLive && !isPractice && (
                <LatencyMonitor />
            )}

            {/* Global Action Bar — fixed at bottom */}
            <GlobalActionBar />
        </Stack>
    );
};
