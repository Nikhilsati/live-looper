const fs = require('fs');

const code = fs.readFileSync('apps/web/src/components/TrackControls.tsx', 'utf8');
const lines = code.split('\n');

// We will reconstruct the file by keeping only lines that are NOT in the extracted ranges.
// Ranges to remove (1-indexed based on original file):
// 54-97: TRACK_COLORS
// 99-160: LayerIndicator
// 162-435: LayersDrawer
// 436-501: StateBadge
// 503-617: LayerRow
// 618-1267: TrackPad
// 1268-1353: ProgressRing
// 2007-2103: LiveTrackPad

const removeRanges = [
  [54, 97],
  [99, 160],
  [162, 435],
  [436, 501],
  [503, 617],
  [618, 1267],
  [1268, 1353],
  [2007, 2103]
];

function shouldKeep(lineNum) {
  for (const [start, end] of removeRanges) {
    if (lineNum >= start && lineNum <= end) return false;
  }
  return true;
}

const newLines = [];
let importsAdded = false;

for (let i = 0; i < lines.length; i++) {
  const lineNum = i + 1;
  
  if (lineNum === 50 && !importsAdded) {
    newLines.push('import { TRACK_COLORS } from "./track/trackColors";');
    newLines.push('import { TrackPad } from "./track/TrackPad";');
    newLines.push('import { LiveTrackPad } from "./track/LiveTrackPad";');
    newLines.push('import { ProgressRing } from "./track/ProgressRing";');
    newLines.push('');
    importsAdded = true;
  }
  
  if (shouldKeep(lineNum)) {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync('apps/web/src/components/TrackControls.tsx', newLines.join('\n'));

console.log("TrackControls.tsx updated.");
