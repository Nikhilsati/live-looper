/// <reference types="@live-looper/types" />
import React from "react";
import "./UI.css";
import { cva, type VariantProps } from "class-variance-authority";

interface BaseProps extends React.HTMLAttributes<
  HTMLDivElement | HTMLSpanElement | HTMLHeadingElement | HTMLParagraphElement
> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const cardVariants = cva("card", {
  variants: {},
  defaultVariants: {},
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children?: React.ReactNode;
}

export const Card = ({
  children,
  className,
  style,
  ...props
}: CardProps) => (
  <div
    className={cardVariants({ className })}
    style={{ borderRadius: "var(--radius-large)", ...style }}
    {...props}
  >
    {children}
  </div>
);

export const buttonVariants = cva("", {
  variants: {
    variant: {
      primary: "primary",
      success: "success",
      danger: "danger",
      warning: "warning",
      accent: "accent",
      ghost: "ghost",
      "active-primary": "active-primary",
      "active-warning": "active-warning",
      outline: "outline",
    },
    size: {
      sm: "small",
      md: "",
      lg: "",
      none: "",
    },
  },
  defaultVariants: {
    size: "none",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
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
export const ButtonGroup = ({ children, style, className = "" }: BaseProps) => (
  <div className={`ui-btn-group ${className}`} style={style}>
    {children}
  </div>
);

export const Switch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) => (
  <label
    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
  >
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label && <span className="ui-text-label">{label}</span>}
  </label>
);

export const badgeVariants = cva("badge", {
  variants: {
    variant: {
      live: "success",
    },
  },
  defaultVariants: {},
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
}

export const Badge = ({
  children,
  variant,
  className,
  ...props
}: BadgeProps) => (
  <span
    className={badgeVariants({ variant, className })}
    style={{ fontSize: "10px" }}
    {...props}
  >
    {children}
  </span>
);

export const StatusDot = ({ className = "" }: { className?: string }) => (
  <div className={`ui-status-dot ${className}`} />
);

export const Slider = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input type="range" className="ui-slider" {...props} />
);

export const Label = ({
  children,
  className = "",
  style,
  ...props
}: BaseProps) => (
  <span className={`ui-text-label ${className}`} style={style} {...props}>
    {children}
  </span>
);

export const ValueText = ({
  children,
  className = "",
  color,
  style,
  ...props
}: BaseProps & { color?: string }) => (
  <span
    className={`ui-text-value ${className}`}
    style={{ color, ...style }}
    {...props}
  >
    {children}
  </span>
);

export const Heading = ({
  children,
  className = "",
  style,
  ...props
}: BaseProps) => (
  <h1 className={`ui-heading ${className}`} style={style} {...props}>
    {children}
  </h1>
);

export const Text = ({
  children,
  className = "",
  style,
  ...props
}: BaseProps) => (
  <p className={`ui-text ${className}`} style={style} {...props}>
    {children}
  </p>
);

export const Stack = ({
  children,
  className = "",
  style,
  ...props
}: BaseProps) => (
  <div className={`vstack ${className}`} style={style} {...props}>
    {children}
  </div>
);

export const Row = ({
  children,
  className = "",
  style,
  ...props
}: BaseProps) => (
  <div className={`hstack ${className}`} style={style} {...props}>
    {children}
  </div>
);

export const Grid = ({
  children,
  className = "",
  style,
  cols,
  ...props
}: BaseProps & { cols?: string }) => (
  <div
    className={`ui-grid ${className}`}
    style={{ gridTemplateColumns: cols, ...style }}
    {...props}
  >
    {children}
  </div>
);

export const Modal = ({
  children,
  onClose,
  className = "",
  style,
  ...props
}: BaseProps & { onClose: () => void }) => (
  <div
    className={`ui-modal-overlay ${className}`}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 2000,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
    onClick={onClose}
    {...props}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

export const waveformVariants = cva("ui-waveform", {
  variants: {
    variant: {
      default: "",
      minimal: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface WaveformProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof waveformVariants> {
  data: number[];
  progress: number;
  height?: number;
  bars?: number;
  beatsPerBar?: number;
}

export const Waveform = ({
  data,
  progress,
  className,
  height = 36,
  bars = 0,
  beatsPerBar = 4,
  variant,
}: WaveformProps) => {
  if (!data.length) return null;
  const max = Math.max(...data, 0.01);
  const activeIdx = Math.floor(progress * data.length);
  const isMinimal = variant === "minimal";

  return (
    <div
      className={`ui-waveform ${className}`}
      style={{
        height,
        background: isMinimal ? "transparent" : "rgba(0,0,0,0.2)",
        borderRadius: 8,
        marginTop: isMinimal ? 0 : 10,
        padding: isMinimal ? 0 : "0 8px",
        overflow: "hidden",
        opacity: isMinimal ? 0.3 : 1,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: isMinimal ? 1 : 1.5,
        }}
      >
        {/* Grid lines - only show in default mode */}
        {!isMinimal &&
          bars > 0 &&
          Array.from({ length: bars * beatsPerBar }).map((_, i) => (
            <div
              key={`grid-${i}`}
              style={{
                position: "absolute",
                left: `${(i / (bars * beatsPerBar)) * 100}%`,
                top: 0,
                bottom: 0,
                width: 1,
                background:
                  i % beatsPerBar === 0
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.05)",
                zIndex: 0,
                pointerEvents: "none",
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
                background: isActive
                  ? "var(--primary-light, #a78bfa)"
                  : i < activeIdx
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.15)",
                borderRadius: i % 2 === 0 ? "1px 1px 0 0" : "0 0 1px 1px",
                transition: "height 0.2s ease, background 100ms",
                opacity: i < activeIdx ? 0.8 : 1,
                zIndex: 1,
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
  title?: string;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end = polarToXY(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export const Knob = ({
  value,
  min,
  max,
  label,
  onChange,
  color = "#f97316",
  size = 44,
  step = 0.01,
  unit = "",
  title,
}: KnobProps) => {
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
  const gradId = `kg-${label.replace(/\s/g, "")}-${color.replace("#", "")}`;

  // Using refs for drag so callbacks never go stale
  const minRef = React.useRef(min);
  const maxRef = React.useRef(max);
  const stepRef = React.useRef(step);
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    minRef.current = min;
    maxRef.current = max;
    stepRef.current = step;
    onChangeRef.current = onChange;
  });

  const updateFromDrag = React.useCallback((clientY: number) => {
    const dy = lastY.current - clientY; // up = positive
    lastY.current = clientY;
    const sensitivity = (maxRef.current - minRef.current) / 160; // 160px = full sweep
    dragVal.current = Math.min(
      maxRef.current,
      Math.max(minRef.current, dragVal.current + dy * sensitivity),
    );
    const snapped =
      Math.round(dragVal.current / stepRef.current) * stepRef.current;
    onChangeRef.current(parseFloat(snapped.toFixed(10)));
  }, []);

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      dragVal.current = dragVal.current; // already synced via useEffect
      lastY.current = e.clientY;
      svgRef.current?.classList.add("dragging");

      const onMove = (me: MouseEvent) => {
        if (dragging.current) updateFromDrag(me.clientY);
      };
      const onUp = () => {
        dragging.current = false;
        svgRef.current?.classList.remove("dragging");
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [updateFromDrag],
  );

  const onTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      dragging.current = true;
      lastY.current = e.touches[0].clientY;
      svgRef.current?.classList.add("dragging");

      const onMove = (te: TouchEvent) => {
        if (dragging.current) updateFromDrag(te.touches[0].clientY);
      };
      const onEnd = () => {
        dragging.current = false;
        svgRef.current?.classList.remove("dragging");
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    },
    [updateFromDrag],
  );

  // Double-click resets to center/zero
  const onDoubleClick = React.useCallback(() => {
    const center = min + (max - min) / 2;
    onChange(parseFloat((Math.round(center / step) * step).toFixed(10)));
  }, [min, max, step, onChange]);

  const displayVal =
    typeof value === "number"
      ? Math.abs(value) < 10
        ? value.toFixed(2)
        : value.toFixed(1)
      : String(value);

  return (
    <div
      className="ui-knob-wrap"
      title={title}
      style={{ "--knob-glow": `${color}99` } as React.CSSProperties}
    >
      <svg
        ref={svgRef}
        className="ui-knob-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onDoubleClick={onDoubleClick}
        style={{ "--knob-glow": `${color}80` } as React.CSSProperties}
      >
        <defs>
          <radialGradient id={gradId} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(80,80,90,0.9)" />
            <stop offset="100%" stopColor="rgba(20,20,25,0.98)" />
          </radialGradient>
        </defs>
        {/* Track arc — dim background */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Value arc */}
        {normalised > 0.005 && (
          <path
            d={valuePath}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 3px ${color}88)` }}
          />
        )}
        {/* Body circle */}
        <circle cx={cx} cy={cy} r={bodyR} fill={`url(#${gradId})`} />
        {/* Inner ring shine */}
        <circle
          cx={cx}
          cy={cy}
          r={bodyR}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
        {/* Position indicator dot */}
        <circle
          cx={dot.x}
          cy={dot.y}
          r={size * 0.055}
          fill={color}
          style={{ filter: `drop-shadow(0 0 2px ${color})` }}
        />
      </svg>
      <span className="ui-knob-label">{label}</span>
      <span className="ui-knob-value">
        {displayVal}
        {unit}
      </span>
    </div>
  );
};

// ─── Level Meter ──────────────────────────────────────────────────────────────

export const levelMeterVariants = cva("ui-level-meter", {
  variants: {
    orientation: {
      horizontal: "horizontal",
      vertical: "vertical",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface LevelMeterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof levelMeterVariants> {
  value?: number;
  values?: number[];
  analyser?: AnalyserNode | null;
  vertical?: boolean; // legacy support mapped to orientation
  bars?: number;
  variant?: "segmented" | "continuous";
  color?: string | string[];
}

export const LevelMeter = ({
  value = 0,
  values,
  analyser,
  vertical = false,
  bars = 16,
  variant = "segmented",
  color,
  className,
  style,
  ...props
}: LevelMeterProps) => {
  const [localLevel, setLocalLevel] = React.useState(0);
  const rafRef = React.useRef<number>(0);
  const bufRef = React.useRef<Uint8Array | null>(null);

  React.useEffect(() => {
    if (!analyser) {
      setLocalLevel(value);
      return;
    }
    bufRef.current = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteTimeDomainData(bufRef.current as any);
      let peak = 0;
      for (let i = 0; i < bufRef.current!.length; i++) {
        const v = Math.abs(bufRef.current![i] - 128) / 128;
        if (v > peak) peak = v;
      }
      setLocalLevel(peak);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser, value]);

  const channels = values !== undefined ? values : [analyser ? localLevel : value];
  const orientation = vertical ? "vertical" : "horizontal";

  return (
    <div
      className={levelMeterVariants({ orientation, className })}
      style={{
        display: "flex",
        flexDirection: vertical ? "row" : "column", // Channels side-by-side or stacked
        gap: 8,
        width: vertical ? undefined : "100%",
        height: vertical ? "100%" : undefined,
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      {channels.map((chVal, chIdx) => {
        const level = Math.min(1, Math.max(0, chVal));
        const isPeaking = level > 0.95;
        const channelColor = Array.isArray(color) ? color[chIdx] : color;

        if (variant === "continuous") {
          const sizePct = Math.pow(level, 0.45) * 100;
          const activeColor = channelColor || (isPeaking ? "#ef4444" : level > 0.75 ? "#fbbf24" : "#4ade80");
          const glowColor = channelColor ? `${channelColor}80` : (isPeaking ? "#ef444480" : level > 0.75 ? "#fbbf2480" : "#4ade8080");

          return (
            <div
              key={chIdx}
              className={`ui-level-meter-channel continuous ${vertical ? "vertical" : "horizontal"}`}
              style={{
                position: "relative",
                flex: 1,
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
                overflow: "hidden",
                height: vertical ? "100%" : 8,
                width: vertical ? undefined : "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: vertical ? 0 : "auto",
                  left: 0,
                  top: vertical ? "auto" : 0,
                  width: vertical ? "100%" : `${sizePct}%`,
                  height: vertical ? `${sizePct}%` : "100%",
                  background: activeColor,
                  boxShadow: level > 0.02 ? `0 0 6px ${glowColor}` : "none",
                  transition: "height 0.05s ease-out, width 0.05s ease-out, background 0.1s ease",
                }}
              />
            </div>
          );
        }

        // Segmented LED look
        const activeBarsCount = Math.round(level * bars);
        return (
          <div
            key={chIdx}
            className={`ui-level-meter-channel segmented ${vertical ? "vertical" : "horizontal"}`}
            style={{
              display: "flex",
              flexDirection: vertical ? "column-reverse" : "row",
              alignItems: "center",
              gap: 2,
              flex: 1,
              height: vertical ? "100%" : undefined,
              width: vertical ? undefined : "100%",
            }}
          >
            {Array.from({ length: bars }).map((_, barIdx) => {
              const active = barIdx < activeBarsCount;
              const pct = barIdx / (bars - 1);
              
              let barColor = channelColor || "#4ade80"; // green
              if (!channelColor) {
                if (pct > 0.9) barColor = "#ef4444"; // red
                else if (pct > 0.72) barColor = "#fbbf24"; // amber
              }

              const widthStyle = vertical
                ? { width: "100%", height: `calc(${100 / bars}% - 2px)` }
                : { height: "100%", width: `calc(${100 / bars}% - 2px)` };

              return (
                <div
                  key={barIdx}
                  className="ui-level-meter-bar"
                  style={{
                    ...widthStyle,
                    borderRadius: 1,
                    background: active ? barColor : "rgba(255, 255, 255, 0.06)",
                    boxShadow: active ? `0 0 4px ${barColor}80` : "none",
                    transition: "background 0.05s ease, box-shadow 0.05s ease",
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
