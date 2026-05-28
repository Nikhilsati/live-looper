import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@knadh/oat/oat.min.css'
import '@knadh/oat/oat.min.js'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
