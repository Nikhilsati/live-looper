import { DebugControls, TrackControls } from './components/TrackControls';
import { LatencyMonitor } from './components/LatencyMonitor';
import { useAudioEngine } from './hooks/useAudioEngine';
import { StatusDot, Row, Heading, Text, Stack } from '@live-looper/ui';
import { ModeSwitcher } from './components/ModeSwitcher';
import { useLooperStore } from './store/useLooperStore';
import './index.css';

function App() {
  useAudioEngine();
  const mode = useLooperStore(s => s.mode);

  const isLive = mode === 'live';

  return (
    <Stack style={{ width: '100%', maxWidth: 1400, margin: '0 auto', paddingBottom: 100 }}>
      <Row style={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
        padding: '0 16px'
      }}>
        <Stack style={{ gap: 0 }}>
          <Heading>Live Looper</Heading>
          <Text>Section-aware loop station</Text>
        </Stack>
        <Row style={{ gap: 24, alignItems: 'center' }}>
          <ModeSwitcher />
          <StatusDot />
        </Row>
      </Row>

      {!isLive && <DebugControls />}

      <div style={{ height: 24 }} />

      <TrackControls />

      {!isLive && <LatencyMonitor />}
    </Stack>
  );
}

export default App;

