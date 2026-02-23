import React from 'react';
import { useLooperStore } from '../store/useLooperStore';
import {
    Stack, Row, Heading, Text, Button, StatusDot
} from '@live-looper/ui';
import { DebugControls, TrackControls } from './TrackControls';
import { LatencyMonitor } from './LatencyMonitor';
import { ModeSwitcher } from './ModeSwitcher';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const LooperWorkspace: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentProject, mode, closeProject, loadProject } = useLooperStore();

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

    return (
        <Stack style={{
            width: '100%',
            maxWidth: 1400,
            margin: '0 auto',
            padding: '24px',
            paddingBottom: 100
        }}>
            {/* Header / Top Bar */}
            <Row style={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 32,
            }}>
                <Row style={{ gap: 20, alignItems: 'center' }}>
                    <Button variant="ghost" onClick={handleBack} style={{ padding: 8 }}>
                        <ArrowLeft size={24} />
                    </Button>
                    <Stack style={{ gap: 0 }}>
                        <Heading style={{ fontSize: 28 }}>{currentProject?.name || 'Live Looper'}</Heading>
                        <Text style={{ opacity: 0.5, fontSize: 14 }}>Session started</Text>
                    </Stack>
                </Row>

                <Row style={{ gap: 24, alignItems: 'center' }}>
                    <ModeSwitcher />
                    <StatusDot />
                </Row>
            </Row>

            {/* Main Content Area */}
            <Stack style={{ gap: 32 }}>
                {!isLive && <DebugControls />}

                <TrackControls />

                {!isLive && <LatencyMonitor />}
            </Stack>
        </Stack>
    );
};
