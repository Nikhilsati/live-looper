import React from 'react';
import { useLooperStore } from '../store/useLooperStore';
import { Row, Button, Badge } from '@live-looper/ui';
import { Layout, Play, Radio } from 'lucide-react';
import type { Mode } from '@live-looper/types';

export const ModeSwitcher: React.FC = () => {
    const { mode, setMode } = useLooperStore();

    const modes: { id: Mode; label: string; icon: any; color: string; variant: any }[] = [
        { id: 'planning', label: 'Planning', icon: Layout, color: '#4dabf7', variant: 'outline' },
        { id: 'practice', label: 'Practice', icon: Play, color: '#fab005', variant: 'warning' },
        { id: 'live', label: 'Live', icon: Radio, color: '#fa5252', variant: 'danger' },
    ];

    return (
        <Row style={{ gap: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
            {modes.map((m) => {
                const isActive = mode === m.id;
                const Icon = m.icon;
                return (
                    <Button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        variant={isActive ? (m.id === 'planning' ? 'primary' : m.variant) : 'outline'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 16px',
                            minWidth: 120,
                            justifyContent: 'center',
                            borderColor: isActive ? m.color : 'rgba(255,255,255,0.1)',
                            boxShadow: isActive ? `0 0 15px ${m.color}44` : 'none',
                            opacity: isActive ? 1 : 0.6
                        }}
                    >
                        <Icon size={18} color={isActive ? 'white' : '#888'} />
                        <span style={{ fontWeight: isActive ? 600 : 400 }}>{m.label}</span>
                    </Button>
                );
            })}
            <div style={{ marginLeft: 'auto' }}>
                <Badge variant={mode === 'live' ? 'live' : undefined}>
                    {mode.toUpperCase()} MODE
                </Badge>
            </div>
        </Row>
    );
};
