import React from 'react';
import { useLooperStore } from '../store/useLooperStore';
import { Row, Button } from '@live-looper/ui';
import { LayoutIcon, PlayIcon, BroadcastIcon } from '@phosphor-icons/react';
import type { Mode } from '@live-looper/types';

export const ModeSwitcher: React.FC = () => {
    const { mode, setMode } = useLooperStore();

    const modes: {
        id: Mode;
        label: string;
        icon: any;
        activeColor: string;
        activeBg: string;
        glowColor: string;
    }[] = [
            {
                id: 'planning',
                label: 'Plan',
                icon: LayoutIcon,
                activeColor: '#93c5fd',
                activeBg: 'rgba(59,130,246,0.2)',
                glowColor: 'rgba(59,130,246,0.3)',
            },
            {
                id: 'practice',
                label: 'Practice',
                icon: PlayIcon,
                activeColor: '#fcd34d',
                activeBg: 'rgba(234,179,8,0.2)',
                glowColor: 'rgba(234,179,8,0.3)',
            },
            {
                id: 'live',
                label: '● LIVE',
                icon: BroadcastIcon,
                activeColor: '#fca5a5',
                activeBg: 'rgba(220,38,38,0.25)',
                glowColor: 'rgba(220,38,38,0.4)',
            },
        ];

    return (
        <Row style={{
            gap: 6,
            padding: '6px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.07)'
        }}>
            {modes.map((m) => {
                const isActive = mode === m.id;
                const Icon = m.icon;
                return (
                    <Button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            padding: '9px 18px',
                            minWidth: 0,
                            justifyContent: 'center',
                            borderRadius: 10,
                            fontWeight: isActive ? 700 : 400,
                            fontSize: 13,
                            letterSpacing: isActive ? '0.04em' : 0,
                            // Active: coloured bg + shadow glow
                            background: isActive ? m.activeBg : 'transparent',
                            color: isActive ? m.activeColor : 'rgba(255,255,255,0.45)',
                            border: isActive
                                ? `1px solid ${m.activeColor}44`
                                : '1px solid transparent',
                            boxShadow: isActive
                                ? `0 0 16px ${m.glowColor}`
                                : 'none',
                            // Smooth transitions — no layout shift between states
                            transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, border-color 0.2s',
                            // Blink only for LIVE badge when active
                            animation: (isActive && m.id === 'live') ? 'live-pulse 2s ease-in-out infinite' : 'none',
                        }}
                    >
                        <Icon size={15} />
                        <span>{m.label}</span>
                    </Button>
                );
            })}
        </Row>
    );
};
