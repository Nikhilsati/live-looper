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

// ─── Rotary Knob ──────────────────────────────────────────────────────────────

interface KnobProps {
    value: number;
    min: number;
    max: number;
    label: string;
    onChange: (val: number) => void;
    /** Accent color for the arc and glow, e.g. "#f97316" */
    color?: string;
    /** Diameter in px, default 44 */
    size?: number;
    step?: number;
    unit?: string;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const start = polarToXY(cx, cy, r, startDeg);
    const end = polarToXY(cx, cy, r, endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export const Knob = ({ value, min, max, label, onChange, color = '#f97316', size = 44, step = 0.01, unit = '' }: KnobProps) => {
    const dragging = React.useRef(false);
    const lastY = React.useRef(0);
    // dragVal accumulates the value during a drag session, avoiding stale-prop closure bugs
    const dragVal = React.useRef(value);
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Keep dragVal in sync when not dragging
    React.useEffect(() => {
        if (!dragging.current) dragVal.current = value;
    }, [value]);

    const START_DEG = -145;
    const END_DEG = 145;
    const RANGE_DEG = END_DEG - START_DEG;

    const normalised = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const valueDeg = START_DEG + normalised * RANGE_DEG;

    const cx = size / 2;
    const cy = size / 2;
    const bodyR = size * 0.36;
    const arcR = size * 0.46;
    const strokeW = size * 0.055;

    const trackPath = describeArc(cx, cy, arcR, START_DEG, END_DEG);
    const valuePath = describeArc(cx, cy, arcR, START_DEG, valueDeg);

    // Dot on the knob face indicating position
    const dot = polarToXY(cx, cy, bodyR * 0.62, valueDeg);

    // Radial gradient IDs — use color hex stripped for uniqueness
    const gradId = `kg-${label.replace(/\s/g, '')}-${color.replace('#', '')}`;

    // Using refs for drag so callbacks never go stale
    const minRef = React.useRef(min);
    const maxRef = React.useRef(max);
    const stepRef = React.useRef(step);
    const onChangeRef = React.useRef(onChange);
    React.useEffect(() => { minRef.current = min; maxRef.current = max; stepRef.current = step; onChangeRef.current = onChange; });

    const updateFromDrag = React.useCallback((clientY: number) => {
        const dy = lastY.current - clientY; // up = positive
        lastY.current = clientY;
        const sensitivity = (maxRef.current - minRef.current) / 160; // 160px = full sweep
        dragVal.current = Math.min(maxRef.current, Math.max(minRef.current, dragVal.current + dy * sensitivity));
        const snapped = Math.round(dragVal.current / stepRef.current) * stepRef.current;
        onChangeRef.current(parseFloat(snapped.toFixed(10)));
    }, []);

    const onMouseDown = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        dragging.current = true;
        dragVal.current = dragVal.current; // already synced via useEffect
        lastY.current = e.clientY;
        svgRef.current?.classList.add('dragging');

        const onMove = (me: MouseEvent) => { if (dragging.current) updateFromDrag(me.clientY); };
        const onUp = () => {
            dragging.current = false;
            svgRef.current?.classList.remove('dragging');
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [updateFromDrag]);

    const onTouchStart = React.useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        dragging.current = true;
        lastY.current = e.touches[0].clientY;
        svgRef.current?.classList.add('dragging');

        const onMove = (te: TouchEvent) => { if (dragging.current) updateFromDrag(te.touches[0].clientY); };
        const onEnd = () => {
            dragging.current = false;
            svgRef.current?.classList.remove('dragging');
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onEnd);
        };
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
    }, [updateFromDrag]);

    // Double-click resets to center/zero
    const onDoubleClick = React.useCallback(() => {
        const center = min + (max - min) / 2;
        onChange(parseFloat((Math.round(center / step) * step).toFixed(10)));
    }, [min, max, step, onChange]);

    const displayVal = typeof value === 'number'
        ? (Math.abs(value) < 10 ? value.toFixed(2) : value.toFixed(1))
        : String(value);

    return (
        <div className="ui-knob-wrap" style={{ '--knob-glow': `${color}99` } as React.CSSProperties}>
            <svg
                ref={svgRef}
                className="ui-knob-svg"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onDoubleClick={onDoubleClick}
                style={{ '--knob-glow': `${color}80` } as React.CSSProperties}
            >
                <defs>
                    <radialGradient id={gradId} cx="40%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="rgba(80,80,90,0.9)" />
                        <stop offset="100%" stopColor="rgba(20,20,25,0.98)" />
                    </radialGradient>
                </defs>
                {/* Track arc — dim background */}
                <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeW} strokeLinecap="round" />
                {/* Value arc */}
                {normalised > 0.005 && (
                    <path d={valuePath} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 3px ${color}88)` }} />
                )}
                {/* Body circle */}
                <circle cx={cx} cy={cy} r={bodyR} fill={`url(#${gradId})`} />
                {/* Inner ring shine */}
                <circle cx={cx} cy={cy} r={bodyR} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
                {/* Position indicator dot */}
                <circle cx={dot.x} cy={dot.y} r={size * 0.055} fill={color}
                    style={{ filter: `drop-shadow(0 0 2px ${color})` }} />
            </svg>
            <span className="ui-knob-label">{label}</span>
            <span className="ui-knob-value">{displayVal}{unit}</span>
        </div>
    );
};
