# DAW SVG Icon Library (React + TypeScript)

## Folder Structure

```txt
src/icons/
  IconBase.tsx

  transport/
    PlayIcon.tsx
    PauseIcon.tsx
    StopIcon.tsx
    RecordIcon.tsx
    LoopIcon.tsx
    RewindIcon.tsx
    FastForwardIcon.tsx

  audio/
    MonoIcon.tsx
    StereoIcon.tsx
    MuteIcon.tsx
    VolumeLowIcon.tsx
    VolumeHighIcon.tsx
    PanLeftIcon.tsx
    PanRightIcon.tsx

  tracks/
    MicrophoneIcon.tsx
    MicrophoneOffIcon.tsx
    HeadphonesIcon.tsx
    AddTrackIcon.tsx
    DeleteTrackIcon.tsx

  mixing/
    WaveformIcon.tsx
    MetronomeIcon.tsx
    EqIcon.tsx
    MixerIcon.tsx
    GainIcon.tsx

  session/
    SaveIcon.tsx
    ExportIcon.tsx
    ImportIcon.tsx
    SettingsIcon.tsx
    UndoIcon.tsx
    RedoIcon.tsx

  midi/
    PianoRollIcon.tsx
    MidiIcon.tsx
    ChordIcon.tsx
    ArpeggioIcon.tsx
    DrumPadIcon.tsx
    StepSequencerIcon.tsx

  arrangement/
    ClipIcon.tsx
    FadeInIcon.tsx
    FadeOutIcon.tsx
    CrossfadeIcon.tsx
    SpliceIcon.tsx
    GlueIcon.tsx
    FreezeTrackIcon.tsx
    BounceIcon.tsx

  routing/
    SendIcon.tsx
    ReturnIcon.tsx
    InsertIcon.tsx
    SidechainIcon.tsx
    BusIcon.tsx
    PatchCableIcon.tsx

  effects/
    CompressorIcon.tsx
    LimiterIcon.tsx
    GateIcon.tsx
    SaturatorIcon.tsx
    StereoImagerIcon.tsx
    SpectralAnalyzerIcon.tsx

  ai/
    AiMasteringIcon.tsx
    PitchCorrectIcon.tsx
    StemSeparatorIcon.tsx
    MatchEqIcon.tsx

  timing/
    TempoIcon.tsx
    TimeSignatureIcon.tsx
    SwingIcon.tsx
    QuantizeIcon.tsx
    GrooveIcon.tsx

  sync/
    MidiClockIcon.tsx
    AbletonLinkIcon.tsx
    TimecodeIcon.tsx
    LatencyIcon.tsx

  index.ts
```

---

# IconBase.tsx

```tsx
import { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export function IconBase({
  children,
  width = 24,
  height = 24,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}
```

---

# Transport Icons

## PlayIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function PlayIcon() {
  return (
    <IconBase>
      <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
```

## PauseIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function PauseIcon() {
  return (
    <IconBase>
      <rect
        x="6"
        y="5"
        width="4"
        height="14"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
      <rect
        x="14"
        y="5"
        width="4"
        height="14"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
    </IconBase>
  );
}
```

## StopIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function StopIcon() {
  return (
    <IconBase>
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="2"
        fill="currentColor"
        stroke="none"
      />
    </IconBase>
  );
}
```

## RecordIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function RecordIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="6" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
```

## LoopIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function LoopIcon() {
  return (
    <IconBase>
      <path d="M17 7h3V4" />
      <path d="M20 7a8 8 0 0 0-14-3" />
      <path d="M7 17H4v3" />
      <path d="M4 17a8 8 0 0 0 14 3" />
    </IconBase>
  );
}
```

## RewindIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function RewindIcon() {
  return (
    <IconBase>
      <path d="M11 6l-6 6 6 6V6z" fill="currentColor" stroke="none" />
      <path d="M19 6l-6 6 6 6V6z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
```

## FastForwardIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function FastForwardIcon() {
  return (
    <IconBase>
      <path d="M5 6l6 6-6 6V6z" fill="currentColor" stroke="none" />
      <path d="M13 6l6 6-6 6V6z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
```

---

# Audio Icons

## MonoIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function MonoIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="4" />
    </IconBase>
  );
}
```

## StereoIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function StereoIcon() {
  return (
    <IconBase>
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="12" r="2" />
      <path d="M10 12h4" />
    </IconBase>
  );
}
```

## MuteIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function MuteIcon() {
  return (
    <IconBase>
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M16 9l5 6" />
      <path d="M21 9l-5 6" />
    </IconBase>
  );
}
```

## VolumeLowIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function VolumeLowIcon() {
  return (
    <IconBase>
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M16 12a2 2 0 0 0-2-2" />
    </IconBase>
  );
}
```

## VolumeHighIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function VolumeHighIcon() {
  return (
    <IconBase>
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M15 9a4 4 0 0 1 0 6" />
      <path d="M18 6a8 8 0 0 1 0 12" />
    </IconBase>
  );
}
```

## PanLeftIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function PanLeftIcon() {
  return (
    <IconBase>
      <path d="M14 6l-6 6 6 6" />
      <line x1="20" y1="12" x2="9" y2="12" />
    </IconBase>
  );
}
```

## PanRightIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function PanRightIcon() {
  return (
    <IconBase>
      <path d="M10 6l6 6-6 6" />
      <line x1="4" y1="12" x2="15" y2="12" />
    </IconBase>
  );
}
```

---

# Track Icons

## MicrophoneIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function MicrophoneIcon() {
  return (
    <IconBase>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="21" />
    </IconBase>
  );
}
```

## MicrophoneOffIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function MicrophoneOffIcon() {
  return (
    <IconBase>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </IconBase>
  );
}
```

## HeadphonesIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function HeadphonesIcon() {
  return (
    <IconBase>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="7" rx="2" />
      <rect x="17" y="13" width="4" height="7" rx="2" />
    </IconBase>
  );
}
```

## AddTrackIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function AddTrackIcon() {
  return (
    <IconBase>
      <path d="M3 12h8" />
      <path d="M7 8v8" />
      <path d="M14 12h2l1-4 2 8 1-4h1" />
    </IconBase>
  );
}
```

## DeleteTrackIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function DeleteTrackIcon() {
  return (
    <IconBase>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <rect x="6" y="7" width="12" height="13" rx="2" />
    </IconBase>
  );
}
```

---

# Mixing Icons

## WaveformIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function WaveformIcon() {
  return (
    <IconBase>
      <path d="M3 12h2l2-6 4 12 2-8 2 4h6" />
    </IconBase>
  );
}
```

## MetronomeIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function MetronomeIcon() {
  return (
    <IconBase>
      <path d="M7 20h10l-2-14H9L7 20z" />
      <path d="M12 10l3-4" />
    </IconBase>
  );
}
```

## EqIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function EqIcon() {
  return (
    <IconBase>
      <path d="M4 16c2-4 4-4 6 0s4 4 6 0 4-4 4 0" />
      <path d="M4 8c2 4 4 4 6 0s4-4 6 0 4 4 4 0" />
    </IconBase>
  );
}
```

## MixerIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function MixerIcon() {
  return (
    <IconBase>
      <line x1="6" y1="4" x2="6" y2="20" />
      <circle cx="6" cy="9" r="2" fill="currentColor" stroke="none" />

      <line x1="12" y1="4" x2="12" y2="20" />
      <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />

      <line x1="18" y1="4" x2="18" y2="20" />
      <circle cx="18" cy="7" r="2" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
```

## GainIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function GainIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 12l4-4" />
    </IconBase>
  );
}
```

---

# Effects Icons

## CompressorIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function CompressorIcon() {
  return (
    <IconBase>
      <path d="M5 16c3 0 3-8 6-8s3 4 6 4 2-2 2-2" />
      <line x1="5" y1="19" x2="19" y2="19" />
    </IconBase>
  );
}
```

## LimiterIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function LimiterIcon() {
  return (
    <IconBase>
      <path d="M5 18V9" />
      <path d="M5 9h10" />
      <path d="M15 9v9" />
    </IconBase>
  );
}
```

## GateIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function GateIcon() {
  return (
    <IconBase>
      <path d="M5 18V6h6v12h8" />
    </IconBase>
  );
}
```

## SaturatorIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function SaturatorIcon() {
  return (
    <IconBase>
      <path d="M5 14c2-6 12-6 14 0" />
      <path d="M5 14c2 4 12 4 14 0" />
    </IconBase>
  );
}
```

## StereoImagerIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function StereoImagerIcon() {
  return (
    <IconBase>
      <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 12a7 7 0 0 1 14 0" />
      <path d="M2 12a10 10 0 0 1 20 0" />
    </IconBase>
  );
}
```

## SpectralAnalyzerIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function SpectralAnalyzerIcon() {
  return (
    <IconBase>
      <path d="M3 18l3-8 3 4 3-10 3 6 3-2 3 10" />
    </IconBase>
  );
}
```

---

# AI Icons

## AiMasteringIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function AiMasteringIcon() {
  return (
    <IconBase>
      <path d="M3 13h2l2-5 3 9 2-4h3" />
      <path d="M18 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
    </IconBase>
  );
}
```

## PitchCorrectIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function PitchCorrectIcon() {
  return (
    <IconBase>
      <circle cx="10" cy="10" r="3" />
      <path d="M13 13l6 6" />
      <path d="M17 15v4h4" />
    </IconBase>
  );
}
```

## StemSeparatorIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function StemSeparatorIcon() {
  return (
    <IconBase>
      <path d="M3 12h4" />
      <path d="M9 12h2" />
      <path d="M13 12h2" />
      <path d="M17 12h4" />
      <path d="M9 8v8" />
      <path d="M15 8v8" />
    </IconBase>
  );
}
```

## MatchEqIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function MatchEqIcon() {
  return (
    <IconBase>
      <path d="M3 15c3-5 6-5 9 0" />
      <path d="M12 15c3-5 6-5 9 0" opacity="0.5" />
    </IconBase>
  );
}
```

---

# Timing Icons

## TempoIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function TempoIcon() {
  return (
    <IconBase>
      <path d="M10 4v10" />
      <circle cx="10" cy="17" r="3" fill="currentColor" stroke="none" />
      <path d="M14 7h5" />
      <path d="M14 11h5" />
    </IconBase>
  );
}
```

## TimeSignatureIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function TimeSignatureIcon() {
  return (
    <IconBase>
      <path d="M8 7h4" />
      <path d="M8 17h4" />
      <line x1="14" y1="5" x2="14" y2="19" />
    </IconBase>
  );
}
```

## QuantizeIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function QuantizeIcon() {
  return (
    <IconBase>
      <path d="M4 4h16v16H4z" />
      <path d="M8 4v16" />
      <path d="M16 4v16" />
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </IconBase>
  );
}
```

## GrooveIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function GrooveIcon() {
  return (
    <IconBase>
      <path d="M4 18V6" />
      <path d="M8 18V10" />
      <path d="M12 18V8" />
      <path d="M16 18V13" />
      <path d="M20 18V5" />
    </IconBase>
  );
}
```

---

# Arrangement Icons

## ClipIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function ClipIcon() {
  return (
    <IconBase>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M6 12h2l1-3 2 6 2-4 1 2h4" />
    </IconBase>
  );
}
```

## FadeInIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function FadeInIcon() {
  return (
    <IconBase>
      <path d="M4 18c4 0 8-8 16-8" />
    </IconBase>
  );
}
```

## FadeOutIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function FadeOutIcon() {
  return (
    <IconBase>
      <path d="M4 10c8 0 12 8 16 8" />
    </IconBase>
  );
}
```

## CrossfadeIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function CrossfadeIcon() {
  return (
    <IconBase>
      <path d="M4 18c4 0 8-8 16-8" />
      <path d="M4 10c8 0 12 8 16 8" />
    </IconBase>
  );
}
```

## SpliceIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function SpliceIcon() {
  return (
    <IconBase>
      <path d="M8 4l8 16" />
      <path d="M16 4L8 20" />
    </IconBase>
  );
}
```

## GlueIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function GlueIcon() {
  return (
    <IconBase>
      <rect x="3" y="8" width="7" height="8" rx="2" />
      <rect x="14" y="8" width="7" height="8" rx="2" />
      <path d="M10 12h4" />
    </IconBase>
  );
}
```

## FreezeTrackIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function FreezeTrackIcon() {
  return (
    <IconBase>
      <path d="M12 3v18" />
      <path d="M7 7l10 10" />
      <path d="M17 7L7 17" />
    </IconBase>
  );
}
```

## BounceIcon.tsx

```tsx
import { IconBase } from "../IconBase";

export function BounceIcon() {
  return (
    <IconBase>
      <path d="M12 4v12" />
      <path d="M8 12l4 4 4-4" />
      <path d="M4 20h16" />
    </IconBase>
  );
}
```

---

# index.ts

```ts
export * from "./transport/PlayIcon";
export * from "./transport/PauseIcon";
export * from "./transport/StopIcon";
export * from "./transport/RecordIcon";
export * from "./transport/LoopIcon";
export * from "./transport/RewindIcon";
export * from "./transport/FastForwardIcon";

export * from "./audio/MonoIcon";
export * from "./audio/StereoIcon";
export * from "./audio/MuteIcon";
export * from "./audio/VolumeLowIcon";
export * from "./audio/VolumeHighIcon";
export * from "./audio/PanLeftIcon";
export * from "./audio/PanRightIcon";

export * from "./tracks/MicrophoneIcon";
export * from "./tracks/MicrophoneOffIcon";
export * from "./tracks/HeadphonesIcon";
export * from "./tracks/AddTrackIcon";
export * from "./tracks/DeleteTrackIcon";
```

---

# Usage

```tsx
import { PlayIcon, RecordIcon, MixerIcon, WaveformIcon } from "@/icons";

export function Toolbar() {
  return (
    <div className="flex gap-3 text-zinc-300">
      <PlayIcon className="w-5 h-5" />
      <RecordIcon className="w-5 h-5 text-red-500" />
      <MixerIcon className="w-5 h-5" />
      <WaveformIcon className="w-5 h-5" />
    </div>
  );
}
```

---

# Recommended Enhancements

- Add animated record pulse
- Add filled + outline variants
- Add active states
- Add icon preview storybook
- Generate spritesheet build
- Add Figma export pipeline
- Add SVGO optimization
- Add visual regression tests
