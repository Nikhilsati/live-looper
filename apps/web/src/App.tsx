import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProjectDashboard } from './components/ProjectDashboard';
import { LooperWorkspace } from './components/LooperWorkspace';
import { GuitarPracticeView } from './components/GuitarPracticeView';
import { useAudioEngine } from './hooks/useAudioEngine';
import { GlobalDialog } from './components/GlobalDialog';
import { useLooperStore } from './store/useLooperStore';
import './index.css';

function App() {
  useAudioEngine();
  const fetchFXPresets = useLooperStore(state => state.fetchFXPresets);

  useEffect(() => {
    fetchFXPresets();
  }, [fetchFXPresets]);

  return (
    <>
      <Routes>
        <Route path="/" element={<ProjectDashboard />} />
        <Route path="/projects/:id" element={<LooperWorkspace />} />
        <Route path="/practice" element={<GuitarPracticeView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <GlobalDialog />
    </>
  );
}

export default App;

