/// <reference types="@live-looper/types" />
import React from 'react';
import './UI.css';

interface BaseProps extends React.HTMLAttributes<HTMLDivElement | HTMLSpanElement | HTMLHeadingElement | HTMLParagraphElement> {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Card = ({ children, className = '', style, ...props }: BaseProps) => (
    <div className={`card ${className}`} style={{ borderRadius: 'var(--radius-large)', ...style }} {...props}>
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
}: React.PropsWithChildren<ButtonProps>) => {
    return (
        <button className={`${variant || ''} ${size === 'sm' ? 'small' : ''} ${className}`} {...props}>
            {children}
        </button>
    );
};

/**
 * ButtonGroup — wraps two or more Button elements into a joined segmented control.
 * Inner borders are flattened; only the outermost corners remain rounded.
 * Usage:
 *   <ButtonGroup>
 *     <Button variant="active-warning">M</Button>
 *     <Button variant="outline">S</Button>
 *   </ButtonGroup>
 */
export const ButtonGroup = ({ children, style, className = '' }: BaseProps) => (
    <div className={`ui-btn-group ${className}`} style={style}>
        {children}
    </div>
);


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

export const Badge = ({ children, variant, className = '', ...props }: BaseProps & { variant?: 'live' }) => (
    <span className={`badge ${variant === 'live' ? 'success' : ''} ${className}`} style={{ fontSize: '10px' }} {...props}>
        {children}
    </span>
);

export const StatusDot = ({ className = '' }: { className?: string }) => (
    <div className={`ui-status-dot ${className}`} />
);

export const Slider = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input type="range" className="ui-slider" {...props} />
);

export const Label = ({ children, className = '', style, ...props }: BaseProps) => (
    <span className={`ui-text-label ${className}`} style={style} {...props}>
        {children}
    </span>
);

export const ValueText = ({ children, className = '', color, style, ...props }: BaseProps & { color?: string }) => (
    <span className={`ui-text-value ${className}`} style={{ color, ...style }} {...props}>
        {children}
    </span>
);

export const Heading = ({ children, className = '', style, ...props }: BaseProps) => (
    <h1 className={`ui-heading ${className}`} style={style} {...props}>
        {children}
    </h1>
);

export const Text = ({ children, className = '', style, ...props }: BaseProps) => (
    <p className={`ui-text ${className}`} style={style} {...props}>
        {children}
    </p>
);

export const Stack = ({ children, className = '', style, ...props }: BaseProps) => (
    <div className={`vstack ${className}`} style={style} {...props}>
        {children}
    </div>
);

export const Row = ({ children, className = '', style, ...props }: BaseProps) => (
    <div className={`hstack ${className}`} style={style} {...props}>
        {children}
    </div>
);

export const Grid = ({ children, className = '', style, cols, ...props }: BaseProps & { cols?: string }) => (
    <div
        className={`ui-grid ${className}`}
        style={{ gridTemplateColumns: cols, ...style }}
        {...props}
    >
        {children}
    </div>
);

export const Modal = ({ children, onClose, className = '', style, ...props }: BaseProps & { onClose: () => void }) => (
    <div
        className={`ui-modal-overlay ${className}`}
        style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style
        }}
        onClick={onClose}
        {...props}
    >
        <div onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

export const Waveform = ({
    data,
    progress,
    className = '',
    height = 36,
    bars = 0,
    beatsPerBar = 4,
    variant = 'default'
}: {
    data: number[],
    progress: number,
    className?: string,
    height?: number,
    bars?: number,
    beatsPerBar?: number,
    variant?: 'default' | 'minimal'
}) => {
    if (!data.length) return null;
    const max = Math.max(...data, 0.01);
    const activeIdx = Math.floor(progress * data.length);
    const isMinimal = variant === 'minimal';

    return (
        <div
            className={`ui-waveform ${className}`}
            style={{
                height,
                background: isMinimal ? 'transparent' : 'rgba(0,0,0,0.2)',
                borderRadius: 8,
                marginTop: isMinimal ? 0 : 10,
                padding: isMinimal ? 0 : '0 8px',
                overflow: 'hidden',
                opacity: isMinimal ? 0.3 : 1
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMinimal ? 1 : 1.5,
                }}
            >
                {/* Grid lines - only show in default mode */}
                {!isMinimal && bars > 0 && Array.from({ length: bars * beatsPerBar }).map((_, i) => (
                    <div
                        key={`grid-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${(i / (bars * beatsPerBar)) * 100}%`,
                            top: 0,
                            bottom: 0,
                            width: 1,
                            background: i % beatsPerBar === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}
                    />
                ))}

                {data.map((v, i) => {
                    const h = (v / max) * 100;
                    const isActive = i === activeIdx;
                    return (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                height: `${Math.max(isMinimal ? 4 : 6, h)}%`,
                                background: isActive ? 'var(--primary-light, #a78bfa)' : (i < activeIdx ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'),
                                borderRadius: i % 2 === 0 ? '1px 1px 0 0' : '0 0 1px 1px',
                                transition: 'height 0.2s ease, background 100ms',
                                opacity: i < activeIdx ? 0.8 : 1,
                                zIndex: 1
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
