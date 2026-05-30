const fs = require('fs');

const code = fs.readFileSync('apps/web/src/components/TrackControls.tsx', 'utf8');
const lines = code.split('\n');

const trackPadCode = lines.slice(617, 1267).join('\n');
const liveTrackPadCode = lines.slice(2006, 2103).join('\n');

const importsTrackPad = `import { useState, useRef, useEffect } from "react";
import {
  MicrophoneIcon,
  RecordIcon,
  UndoIcon,
  EraserIcon,
  LayersIcon,
  ActivityIcon,
  SettingsIcon,
} from "@live-looper/icons";
import { audioEngine } from "@live-looper/audio-engine";
import { useLooperStore } from "../../store";
import { useSessionStore } from "../../store/useSessionStore";
import {
  Card,
  Row,
  Button,
  ButtonGroup,
  Waveform,
} from "@live-looper/ui";
import { TRACK_COLORS } from "./trackColors";
import { LayerIndicator } from "./LayerIndicator";
import { LayerRow } from "./LayerRow";
import { LayersDrawer } from "./LayersDrawer";

`;

const importsLiveTrackPad = `import { useState } from "react";
import {
  MicrophoneIcon,
  SettingsIcon,
} from "@live-looper/icons";
import { useLooperStore } from "../../store";
import {
  Card,
  Row,
  Button,
  Waveform,
} from "@live-looper/ui";
import { TRACK_COLORS } from "./trackColors";

`;

fs.writeFileSync('apps/web/src/components/track/TrackPad.tsx', importsTrackPad + trackPadCode);
fs.writeFileSync('apps/web/src/components/track/LiveTrackPad.tsx', importsLiveTrackPad + liveTrackPadCode);

console.log("Extraction complete.");
