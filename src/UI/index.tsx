/// <reference path="../types/oat.d.ts" />
import React from 'react';
import './UI.css';

interface BaseProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Card = ({ children, className = '', style }: BaseProps) => (
    <div className={`card ${className}`} style={{ borderRadius: 'var(--radius-large)', ...style }}>
        {children}
    </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'accent' | 'ghost' | 'active-primary' | 'active-warning' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'none';
}

export const Button = ({
    children,
    variant,
    size = 'none',
    className = '',
    ...props
}: ButtonProps) => {
    // Map custom variants to Oat or keep them if specific
    const finalVariant = variant?.startsWith('active-') ? variant : variant;

    return (
        <button className={`${finalVariant || ''} ${size === 'sm' ? 'small' : ''} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const Switch = ({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label?: string }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input
            type="checkbox"
            role="switch"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        {label && <span className="ui-text-label">{label}</span>}
    </label>
);

export const Badge = ({ children, variant, className = '' }: BaseProps & { variant?: 'live' }) => (
    <span className={`badge ${variant === 'live' ? 'success' : ''} ${className}`} style={{ fontSize: '10px' }}>
        {children}
    </span>
);

export const StatusDot = ({ className = '' }: { className?: string }) => (
    <div className={`ui-status-dot ${className}`} />
);

export const Slider = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input type="range" className="ui-slider" {...props} />
);

export const Label = ({ children, className = '', style }: BaseProps) => (
    <span className={`ui-text-label ${className}`} style={style}>
        {children}
    </span>
);

export const ValueText = ({ children, className = '', color, style }: BaseProps & { color?: string }) => (
    <span className={`ui-text-value ${className}`} style={{ color, ...style }}>
        {children}
    </span>
);

export const Heading = ({ children, className = '', style }: BaseProps) => (
    <h1 className={`ui-heading ${className}`} style={style}>
        {children}
    </h1>
);

export const Text = ({ children, className = '', style }: BaseProps) => (
    <p className={`ui-text ${className}`} style={style}>
        {children}
    </p>
);

export const Stack = ({ children, className = '', style }: BaseProps) => (
    <div className={`vstack ${className}`} style={style}>
        {children}
    </div>
);

export const Row = ({ children, className = '', style }: BaseProps) => (
    <div className={`hstack ${className}`} style={style}>
        {children}
    </div>
);

export const Grid = ({ children, className = '', style, cols }: BaseProps & { cols?: string }) => (
    <div
        className={`ui-grid ${className}`}
        style={{ gridTemplateColumns: cols, ...style }}
    >
        {children}
    </div>
);

export const Waveform = ({ data, progress, className = '', height = 36 }: { data: number[], progress: number, className?: string, height?: number }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 0.01);
    const activeIdx = Math.floor(progress * data.length);

    return (
        <div
            className={`ui-waveform ${className}`}
            style={{
                height,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 8,
                padding: '0 8px',
                marginTop: 10,
                overflow: 'hidden'
            }}
        >
            {data.map((v, i) => {
                const h = (v / max) * 100;
                const isActive = i === activeIdx;
                return (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: `${Math.max(6, h)}%`,
                            background: isActive ? 'var(--primary-light, #a78bfa)' : (i < activeIdx ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'),
                            borderRadius: i % 2 === 0 ? '1px 1px 0 0' : '0 0 1px 1px',
                            transition: 'height 0.2s ease, background 0.1s',
                            opacity: i < activeIdx ? 0.8 : 1
                        }}
                    />
                );
            })}
        </div>
    );
};
