import { Routes, Route, Navigate } from 'react-router-dom';
import { ProjectDashboard } from './components/ProjectDashboard';
import { LooperWorkspace } from './components/LooperWorkspace';
import { useAudioEngine } from './hooks/useAudioEngine';
import './index.css';

function App() {
  useAudioEngine();

  return (
    <Routes>
      <Route path="/" element={<ProjectDashboard />} />
      <Route path="/projects/:id" element={<LooperWorkspace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

