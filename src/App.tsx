import { DebugControls, TrackControls } from './components/TrackControls';
import { LatencyMonitor } from './components/LatencyMonitor';
import { useAudioEngine } from './hooks/useAudioEngine';
import { StatusDot, Row, Heading, Text, Stack } from './UI';
import './index.css';

function App() {
  useAudioEngine();

  return (
    <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto' }}>
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
        <StatusDot />
      </Row>

      <DebugControls />

      <div style={{ height: 24 }} />

      <TrackControls />

      <LatencyMonitor />
    </div>
  );
}

export default App;

