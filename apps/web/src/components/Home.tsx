import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GuitarIcon, VinylRecordIcon, PlayIcon, CodeIcon, MonitorPlayIcon } from "@phosphor-icons/react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waveformRef.current) {
      const waveform = waveformRef.current;
      waveform.innerHTML = ''; // Clear existing
      const heights = [8,14,22,30,18,40,55,45,60,72,65,58,70,80,68,55,42,60,75,68,50,38,52,64,48,36,28,18,12,8];
      
      heights.forEach((h, i) => {
        const bar = document.createElement('div');
        bar.className = `ls-bar ${i > 8 && i < 22 ? 'active' : ''} ${i % 7 === 0 ? 'teal' : ''}`;
        bar.style.height = `${h}px`;
        bar.style.animationDelay = `${i * 0.05}s`;
        bar.style.animationDuration = `${1.1 + (i % 5) * 0.15}s`;
        waveform.appendChild(bar);
      });
    }
  }, []);

  return (
    <div className="ls-root">
      <div className="ls-grid-bg"></div>
      <div className="ls-glow-1"></div>
      <div className="ls-glow-2"></div>

      <nav className="ls-nav">
        <div className="ls-nav-logo">Live<span>Looper</span> Studio</div>
      </nav>

      <section className="ls-hero">
        <div className="ls-badge">
          <div className="ls-badge-dot"></div>
          Live Looper Studio
        </div>
        <h1>Play it.<br /><em>Loop it.</em><br />Own it.</h1>
        <p className="ls-hero-sub">From first strum to full performance. Pick your session and start making music immediately.</p>
        <div className="ls-hero-actions">
          <button className="ls-btn-primary" onClick={() => navigate("/practice")}>
            <PlayIcon weight="fill" size={16} />
            Start playing
          </button>
        </div>
      </section>

      <div className="ls-waveform" ref={waveformRef}></div>

      <section className="ls-modes">
        <div className="ls-mode-card guitar" onClick={() => navigate("/practice")}>
          <div className="ls-mode-icon teal"><GuitarIcon weight="fill" size={28} color="#fff" /></div>
          <div className="ls-mode-title">Guitar Practice</div>
          <p className="ls-mode-desc">Plug in and play immediately. Live pass-through with a full FX rack. No project setup required.</p>
          <div className="ls-mode-tags">
            <span className="ls-tag teal">No setup</span>
            <span className="ls-tag teal">Full FX rack</span>
            <span className="ls-tag teal">Live input</span>
          </div>
          <div className="ls-mode-cta">Start Session <span>→</span></div>
        </div>

        <div className="ls-mode-card looper" onClick={() => navigate("/looper")}>
          <div className="ls-mode-icon purple"><VinylRecordIcon weight="fill" size={28} color="#fff" /></div>
          <div className="ls-mode-title">Live Looper</div>
          <p className="ls-mode-desc">Create multi-track loops, arrange sections, and record full performances. Access your projects.</p>
          <div className="ls-mode-tags">
            <span className="ls-tag purple">Multi-track</span>
            <span className="ls-tag purple">Arrangements</span>
            <span className="ls-tag purple">Projects</span>
          </div>
          <div className="ls-mode-cta">Open Workspace <span>→</span></div>
        </div>
      </section>

      <section className="ls-features">
        <div className="ls-features-label">Everything you need</div>
        <div className="ls-features-grid">
          <div className="ls-feat">
            <div className="ls-feat-icon">🎛️</div>
            <div className="ls-feat-title">Zero-latency FX</div>
            <div className="ls-feat-sub">Real-time effects chain with studio-grade processing.</div>
          </div>
          <div className="ls-feat">
            <div className="ls-feat-icon">🎚️</div>
            <div className="ls-feat-title">Multi-track loops</div>
            <div className="ls-feat-sub">Layer unlimited tracks, each with independent controls.</div>
          </div>
          <div className="ls-feat">
            <div className="ls-feat-icon">💾</div>
            <div className="ls-feat-title">Auto-save projects</div>
            <div className="ls-feat-sub">Never lose a session. Everything is saved in real time.</div>
          </div>
        </div>
      </section>

      <footer className="ls-footer">
        <div className="ls-footer-text">© 2026 Live Looper Studio</div>
        <div className="ls-status">
          <div className="ls-status-dot"></div>
          All systems operational
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .ls-root {
          font-family: 'DM Sans', sans-serif;
          background: #0b0a10;
          color: #e8e4f0;
          min-height: 100vh;
          width: 100vw;
          margin-left: -16px;
          margin-top: -24px;
          overflow-x: hidden;
          position: relative;
        }

        .ls-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(130, 80, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(130, 80, 255, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .ls-glow-1 {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(100, 60, 220, 0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .ls-glow-2 {
          position: absolute;
          top: 300px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(20, 180, 140, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .ls-nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 40px;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
        }

        .ls-nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.12em;
          color: #e8e4f0;
          text-transform: uppercase;
        }

        .ls-nav-logo span {
          color: #7c5ce8;
        }

        .ls-hero {
          position: relative;
          z-index: 5;
          text-align: center;
          padding: 80px 20px 60px;
        }

        .ls-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(124, 92, 232, 0.9);
          background: rgba(124, 92, 232, 0.1);
          border: 0.5px solid rgba(124, 92, 232, 0.3);
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 28px;
        }

        .ls-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #7c5ce8;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        .ls-hero h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(48px, 8vw, 72px);
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: #f0ecff;
          max-width: 680px;
          margin: 0 auto 20px;
        }

        .ls-hero h1 em {
          font-style: normal;
          color: #7c5ce8;
        }

        .ls-hero-sub {
          font-size: clamp(15px, 3vw, 17px);
          font-weight: 300;
          color: rgba(232,228,240,0.5);
          max-width: 420px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        .ls-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ls-btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          background: #7c5ce8;
          border: none;
          padding: 13px 28px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ls-btn-primary:hover {
          background: #9172f0;
          transform: translateY(-1px);
        }

        .ls-waveform {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 32px 20px;
          margin: 0 auto;
          max-width: 600px;
          height: 80px;
        }

        .ls-bar {
          width: 3px;
          background: rgba(124, 92, 232, 0.4);
          border-radius: 2px;
          animation: wave 1.4s ease-in-out infinite;
        }

        .ls-bar.active { background: rgba(124, 92, 232, 0.85); }
        .ls-bar.teal { background: rgba(20, 180, 140, 0.6); }

        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }

        .ls-modes {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          padding: 0 20px 40px;
          max-width: 900px;
          margin: 0 auto;
        }

        .ls-mode-card {
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
          text-align: left;
        }

        .ls-mode-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.25s;
          border-radius: 20px;
        }

        .ls-mode-card.guitar::before {
          background: radial-gradient(ellipse at 20% 20%, rgba(20,180,140,0.12) 0%, transparent 65%);
        }

        .ls-mode-card.looper::before {
          background: radial-gradient(ellipse at 20% 20%, rgba(124,92,232,0.15) 0%, transparent 65%);
        }

        .ls-mode-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }

        .ls-mode-card:hover::before { opacity: 1; }

        .ls-mode-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .ls-mode-icon.teal { background: linear-gradient(135deg, #0f6e56, #1db88a); }
        .ls-mode-icon.purple { background: linear-gradient(135deg, #4a35a0, #7c5ce8); }

        .ls-mode-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #f0ecff;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .ls-mode-desc {
          font-size: 14px;
          font-weight: 300;
          color: rgba(232,228,240,0.5);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .ls-mode-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .ls-tag {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 100px;
          border: 0.5px solid;
        }

        .ls-tag.teal {
          color: #1db88a;
          border-color: rgba(29,184,138,0.3);
          background: rgba(29,184,138,0.08);
        }

        .ls-tag.purple {
          color: #9b7ff5;
          border-color: rgba(155,127,245,0.3);
          background: rgba(155,127,245,0.08);
        }

        .ls-mode-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          transition: gap 0.2s;
        }

        .ls-mode-card.guitar .ls-mode-cta { color: #1db88a; }
        .ls-mode-card.looper .ls-mode-cta { color: #9b7ff5; }
        .ls-mode-card:hover .ls-mode-cta { gap: 12px; }

        .ls-features {
          position: relative;
          z-index: 5;
          padding: 40px 20px 48px;
          max-width: 900px;
          margin: 0 auto;
        }

        .ls-features-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(232,228,240,0.3);
          margin-bottom: 20px;
        }

        .ls-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }

        .ls-feat {
          background: #0b0a10;
          padding: 20px;
          transition: background 0.2s;
        }

        .ls-feat:hover { background: rgba(255,255,255,0.02); }

        .ls-feat-icon {
          font-size: 18px;
          margin-bottom: 10px;
          opacity: 0.7;
        }

        .ls-feat-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #e8e4f0;
          margin-bottom: 4px;
        }

        .ls-feat-sub {
          font-size: 12px;
          color: rgba(232,228,240,0.35);
          line-height: 1.5;
        }

        .ls-footer {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-top: 0.5px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
          gap: 16px;
        }

        .ls-footer-text {
          font-size: 12px;
          color: rgba(232,228,240,0.25);
        }

        .ls-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(29,184,138,0.7);
        }

        .ls-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #1db88a;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        
        @media (max-width: 600px) {
          .ls-nav { padding: 20px; }
          .ls-footer { padding: 20px; flex-direction: column; text-align: center; justify-content: center; }
          .ls-waveform { display: none; } /* Hide waveform on very small screens if it gets too cramped */
        }
      `}</style>
    </div>
  );
};

