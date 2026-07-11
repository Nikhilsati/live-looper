import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  GithubLogo,
  ShieldCheck,
  WifiSlash,
  Cpu,
  Record,
  Sliders,
  Folders,
  FastForward,
  PlayCircle,
  Crosshair,
  Timer,
  ArrowsSplit,
  DeviceMobile,
  FolderOpen,
  Headphones,
  Broadcast,
  NotePencil,
  Barbell,
  CheckCircle,
  VideoCamera,
  ArrowRight,
  List,
  X,
  Lightning
} from "@phosphor-icons/react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="lp-root">
      {/* Navigation */}
      <nav className={`lp-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="lp-nav-content">
          <div className="lp-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Live<span>Looper</span>
          </div>

          <div className="lp-nav-desktop">
            <button onClick={() => scrollToSection("problem")}>Features</button>
            <button className="lp-nav-cta" onClick={() => navigate("/looper")}>
              Try Live Looper
            </button>
          </div>

          <button className="lp-nav-mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lp-nav-mobile-menu">
            <button onClick={() => scrollToSection("problem")}>Features</button>
            <button className="lp-nav-cta-mobile" onClick={() => navigate("/looper")}>
              Try Live Looper
            </button>
          </div>
        )}
      </nav>

      {/* Section 1: Hero */}
      <section className="lp-hero" id="home">
        <div className="lp-hero-content">
          <div className="lp-hero-left">
            <h1>Build Complete Live Performances.<br /><span>Without the Complexity.</span></h1>
            <p className="lp-hero-desc">
              A live performance platform with a professional looping engine.
            </p>
            <div className="lp-hero-actions">
              <button className="lp-btn-primary" onClick={() => navigate("/looper")}>
                <Play weight="fill" size={20} />
                Try Live Looper
              </button>
            </div>
            <p className="lp-hero-preview-text">Currently available as a free public preview. Premium features coming soon.</p>
            <div className="lp-trust-badges">
              <span><ShieldCheck size={16} /> Professional Audio Engine</span>
              <span><WifiSlash size={16} /> Offline Ready</span>
              <span><DeviceMobile size={16} /> Cross Platform</span>
              <span><Lightning size={16} /> Low Latency</span>
            </div>
          </div>
          <div className="lp-hero-right">
            <div className="lp-hero-visual-mockup">
              <img src={`${import.meta.env.BASE_URL}screenshots/plan-full.png`} alt="Live Looper Planning Mode" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Why Live Looper? */}
      <section className="lp-section lp-problem" id="problem">
        <h2 className="lp-section-title">Why Live Looper?</h2>
        <p className="lp-section-subtitle">Because you already know what you want to perform live.</p>
        <div className="lp-comparison-table-wrapper">
          <table className="lp-comparison-table">
            <thead>
              <tr>
                <th>Others</th>
                <th>Live Looper</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="lp-td-content"><X size={18} weight="bold" color="#ef4444" /> Separate looper, backing track player, recorder, metronome</span></td>
                <td className="lp-highlight-col"><span className="lp-td-content"><CheckCircle size={18} weight="fill" color="#7c3aed" /> <strong>Everything in one place.</strong></span></td>
              </tr>
              <tr>
                <td><span className="lp-td-content"><X size={18} weight="bold" color="#ef4444" /> Designed around pedals</span></td>
                <td className="lp-highlight-col"><span className="lp-td-content"><CheckCircle size={18} weight="fill" color="#7c3aed" /> <strong>Designed for musicians, not engineers.</strong></span></td>
              </tr>
              <tr>
                <td><span className="lp-td-content"><X size={18} weight="bold" color="#ef4444" /> Limited song organization</span></td>
                <td className="lp-highlight-col"><span className="lp-td-content"><CheckCircle size={18} weight="fill" color="#7c3aed" /> <strong>Organize complete songs, not just loops.</strong></span></td>
              </tr>
              <tr>
                <td><span className="lp-td-content"><X size={18} weight="bold" color="#ef4444" /> Hardware-dependent</span></td>
                <td className="lp-highlight-col"><span className="lp-td-content"><CheckCircle size={18} weight="fill" color="#7c3aed" /> <strong>Runs anywhere</strong></span></td>
              </tr>
              <tr>
                <td><span className="lp-td-content"><X size={18} weight="bold" color="#ef4444" /> Single output</span></td>
                <td className="lp-highlight-col"><span className="lp-td-content"><CheckCircle size={18} weight="fill" color="#7c3aed" /> <strong>Independent performer and audience outputs</strong></span></td>
              </tr>
              <tr>
                <td><span className="lp-td-content"><X size={18} weight="bold" color="#ef4444" /> Basic recording</span></td>
                <td className="lp-highlight-col"><span className="lp-td-content"><CheckCircle size={18} weight="fill" color="#7c3aed" /> <strong>Complete performance recording and replay</strong></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Why Live Looper (Workflow Cards) */}
      <section className="lp-section">
        <div className="lp-workflow-grid">
          <div className="lp-workflow-card">
            <div className="lp-workflow-icon"><Record size={32} weight="fill" color="#ef4444" /></div>
            <h3>Record</h3>
            <div className="lp-workflow-img-wrapper">
              <img src={`${import.meta.env.BASE_URL}screenshots/live.png`} alt="Recording" />
            </div>
            <ul>
              <li>Multi-track recording</li>
              <li>Unlimited overdubs</li>
              <li>Live waveforms</li>
              <li>Undo layers</li>
            </ul>
          </div>
          <div className="lp-workflow-card">
            <div className="lp-workflow-icon"><PlayCircle size={32} weight="fill" color="#10b981" /></div>
            <h3>Perform</h3>
            <div className="lp-workflow-img-wrapper">
              <img src={`${import.meta.env.BASE_URL}screenshots/timeline.png`} alt="Performance Timeline" />
            </div>
            <ul>
              <li>Pre-planned sections</li>
              <li>Queued transitions</li>
              <li>Dedicated Live Mode</li>
              <li>Remote control ready</li>
            </ul>
          </div>
          <div className="lp-workflow-card">
            <div className="lp-workflow-icon"><Sliders size={32} weight="fill" color="#3b82f6" /></div>
            <h3>Sound</h3>
            <div className="lp-workflow-img-wrapper">
              <img src={`${import.meta.env.BASE_URL}screenshots/fx.png`} alt="Modular FX" />
            </div>
            <ul>
              <li>Custom FX presets</li>
              <li>Modular chains</li>
              <li>Precise gain staging</li>
              <li>Any audio interface</li>
            </ul>
          </div>
          <div className="lp-workflow-card">
            <div className="lp-workflow-icon"><Folders size={32} weight="fill" color="#f59e0b" /></div>
            <h3>Manage</h3>
            <div className="lp-workflow-img-wrapper">
              <img src={`${import.meta.env.BASE_URL}screenshots/io.png`} alt="Session Management" />
            </div>
            <ul>
              <li>Save full projects</li>
              <li>Master output recording</li>
              <li>Easy setlists</li>
              <li>Offline ready</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4: Performance Modes */}
      <section className="lp-section lp-modes" id="modes">
        <h2 className="lp-section-title">One Application.<br />Three Ways To Work.</h2>
        <div className="lp-modes-grid">
          <div className="lp-mode-card">
            <div className="lp-mode-image-placeholder planning">
              <img src={`${import.meta.env.BASE_URL}screenshots/plan-full.png`} alt="Planning Mode" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left top' }} />
            </div>
            <div className="lp-mode-content">
              <h3>Planning</h3>
              <p>Configure everything. Access all routing, FX, and track settings.</p>
            </div>
          </div>
          <div className="lp-mode-card">
            <div className="lp-mode-image-placeholder rehearsal">
              <img src={`${import.meta.env.BASE_URL}screenshots/practice-full.png`} alt="Rehearsal Mode" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left top' }} />
            </div>
            <div className="lp-mode-content">
              <h3>Rehearsal</h3>
              <p>Rehearse sets with clear state feedback and easy corrections.</p>
            </div>
          </div>
          <div className="lp-mode-card live-mode-highlight">
            <div className="lp-mode-image-placeholder live">
              <img src={`${import.meta.env.BASE_URL}screenshots/live.png`} alt="Live Mode" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="lp-mode-content">
              <h3>Live</h3>
              <p>Minimal interface. Maximum confidence. Huge hit areas and zero clutter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Professional Performance Features */}
      <section className="lp-section lp-pro-features">
        <div className="lp-pro-grid">
          <div className="lp-pro-item">
            <Crosshair size={32} className="lp-pro-icon" />
            <div>
              <h4>Smart Quantization</h4>
              <p>Automatically align recordings to the musical grid.</p>
            </div>
          </div>
          <div className="lp-pro-item">
            <Timer size={32} className="lp-pro-icon" />
            <div>
              <h4>Latency Calibration</h4>
              <p>Measure real hardware latency for perfect timing.</p>
            </div>
          </div>
          <div className="lp-pro-item">
            <FastForward size={32} className="lp-pro-icon" />
            <div>
              <h4>Automatic Compensation</h4>
              <p>Correct recorded audio timing behind the scenes.</p>
            </div>
          </div>
          <div className="lp-pro-item">
            <ArrowsSplit size={32} className="lp-pro-icon" />
            <div>
              <h4>Dual Output</h4>
              <p>Separate audience mix from performer monitor mix.</p>
            </div>
          </div>
          <div className="lp-pro-item">
            <DeviceMobile size={32} className="lp-pro-icon" />
            <div>
              <h4>Remote Controller</h4>
              <p>Control the looper remotely from your phone or tablet.</p>
            </div>
          </div>
          <div className="lp-pro-item">
            <VideoCamera size={32} className="lp-pro-icon" />
            <div>
              <h4>Session Recording</h4>
              <p>Record the master output of every live performance.</p>
            </div>
          </div>
          <div className="lp-pro-item">
            <Headphones size={32} className="lp-pro-icon" />
            <div>
              <h4>Backing Tracks</h4>
              <p>Import, trim, and seamlessly synchronize tracks.</p>
            </div>
          </div>
          <div className="lp-pro-item">
            <Sliders size={32} className="lp-pro-icon" />
            <div>
              <h4>Audio Routing</h4>
              <p>Professional multi-channel audio interface support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Performance Workflow */}
      <section className="lp-section lp-timeline-section">
        <div className="lp-timeline">
          <div className="lp-timeline-step">
            <div className="lp-step-icon"><NotePencil size={24} /></div>
            <h4>Plan</h4>
            <p>Setup tracks & FX</p>
          </div>
          <div className="lp-timeline-connector"></div>
          <div className="lp-timeline-step">
            <div className="lp-step-icon"><Barbell size={24} /></div>
            <h4>Rehearse</h4>
            <p>Build muscle memory</p>
          </div>
          <div className="lp-timeline-connector"></div>
          <div className="lp-timeline-step">
            <div className="lp-step-icon"><Broadcast size={24} /></div>
            <h4>Perform</h4>
            <p>Hit the stage</p>
          </div>
          <div className="lp-timeline-connector"></div>
          <div className="lp-timeline-step">
            <div className="lp-step-icon"><Record size={24} /></div>
            <h4>Record</h4>
            <p>Capture the gig</p>
          </div>
          <div className="lp-timeline-connector"></div>
          <div className="lp-timeline-step">
            <div className="lp-step-icon"><PlayCircle size={24} /></div>
            <h4>Replay</h4>
            <p>Review & Improve</p>
          </div>
        </div>
      </section>

      {/* Section 7: Technical Foundation & Features */}
      <section className="lp-section lp-technical">
        <h2 className="lp-section-title">Built for Reliable Live Performance.</h2>
        <div className="lp-tech-grid">
          <div className="lp-tech-card">
            <Cpu size={32} color="#7c3aed" weight="fill" style={{marginBottom: 16}} />
            <h3>Sample Accurate</h3>
            <p>AudioWorklet engine ensures perfect sample timing across all tracks.</p>
          </div>
          <div className="lp-tech-card">
            <Lightning size={32} color="#7c3aed" weight="fill" style={{marginBottom: 16}} />
            <h3>Low Latency</h3>
            <p>Active RTL calibration delivers ultra low latency hardware response.</p>
          </div>
          <div className="lp-tech-card">
            <WifiSlash size={32} color="#7c3aed" weight="fill" style={{marginBottom: 16}} />
            <h3>Offline Ready</h3>
            <p>IndexedDB storage and PWA support means you don't need internet to gig.</p>
          </div>
          <div className="lp-tech-card">
            <Crosshair size={32} color="#7c3aed" weight="fill" style={{marginBottom: 16}} />
            <h3>Smart Snap</h3>
            <p>Automatic compensation handles the heavy lifting of recording timing.</p>
          </div>
        </div>
      </section>

      {/* Section 8.5: Additional Tools */}
      <section className="lp-section">
        <h2 className="lp-section-title">Additional Tools</h2>
        <div className="lp-workflow-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '500px', margin: '0 auto' }}>
          <div className="lp-workflow-card">
            <div className="lp-workflow-icon"><Headphones size={32} weight="fill" /></div>
            <h3>Guitar Practice</h3>
            <div className="lp-workflow-img-wrapper" style={{ height: '240px' }}>
              <img src={`${import.meta.env.BASE_URL}screenshots/guitar-practice.png`} alt="Guitar Practice Mode" />
            </div>
            <p style={{ marginTop: '16px', color: '#a0a0a0' }}>Includes a dedicated practice mode with a metronome, backing tracks, and loop recording to help you build muscle memory before you hit the stage.</p>
            <button className="lp-btn-green" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }} onClick={() => navigate("/practice")}>
              Launch Practice Mode
            </button>
          </div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="lp-section lp-cta-section" id="pricing">
        <div className="lp-cta-box">
          <h2 className="lp-cta-title">Ready to Perform?</h2>
          <div className="lp-cta-actions">
            <button className="lp-btn-primary large" onClick={() => navigate("/looper")}>
              <Play weight="fill" size={24} />
              Try Live Looper
            </button>
          </div>
          <p className="lp-open-source">Currently available as a free public preview. Premium features coming soon.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div>© 2026 Live Looper</div>
        <div className="lp-footer-links">
        </div>
      </footer>

      {/* Scoped Styles for Landing Page v2.0 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .lp-root {
          font-family: 'Inter', -apple-system, sans-serif;
          background-color: #0b0a10;
          color: #ffffff;
          min-height: 100vh;
          width: 100vw;
          margin-left: -16px;
          margin-top: -24px;
          overflow-x: hidden;
          line-height: 1.5;
        }

        /* --- Typography --- */
        h1, h2, h3, h4 { margin: 0; font-weight: 700; letter-spacing: -0.02em; }
        p { color: #a0a0a0; margin: 0; font-size: 18px; }

        /* --- Buttons --- */
        .lp-btn-primary {
          background-color: #7c3aed;
          color: #0b0a10;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.2);
        }
        .lp-btn-primary:hover { background-color: #a855f7; transform: translateY(-1px); }
        .lp-btn-primary.large { padding: 18px 36px; font-size: 18px; }

        .lp-btn-green {
          background-color: #00ff66;
          color: #0b0a10;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0, 255, 102, 0.2);
        }
        .lp-btn-green:hover { background-color: #00cc52; transform: translateY(-1px); }

        .lp-btn-secondary {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lp-btn-secondary:hover { background-color: rgba(255, 255, 255, 0.1); }
        .lp-btn-secondary.large { padding: 18px 36px; font-size: 18px; }

        .lp-btn-text {
          background: none;
          color: #a0a0a0;
          border: none;
          padding: 14px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }
        .lp-btn-text:hover { color: #ffffff; }

        /* --- Navigation --- */
        .lp-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: all 0.3s;
          padding: 20px 40px;
          background: transparent;
        }
        .lp-nav.scrolled {
          background: rgba(11, 10, 16, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 16px 40px;
        }
        .lp-nav-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lp-nav-logo {
          font-size: 20px;
          font-weight: 800;
          cursor: pointer;
        }
        .lp-nav-logo span { color: #7c3aed; }
        .lp-nav-desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .lp-nav-desktop button {
          background: none;
          border: none;
          color: #a0a0a0;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }
        .lp-nav-desktop button:hover { color: #ffffff; }
        .lp-nav-desktop .lp-nav-cta {
          background: #7c3aed;
          color: #0b0a10;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
        }
        .lp-nav-desktop .lp-nav-cta:hover { background: #6d28d9; color: #0b0a10; }
        
        .lp-nav-mobile-btn {
          display: none;
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
        }
        .lp-nav-mobile-menu {
          display: none;
          flex-direction: column;
          background: #1a1a1a;
          padding: 20px;
          border-radius: 8px;
          margin-top: 16px;
          gap: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .lp-nav-mobile-menu button {
          background: none;
          border: none;
          color: #fff;
          text-align: left;
          font-size: 16px;
          padding: 8px 0;
        }
        .lp-nav-cta-mobile {
          background: #7c3aed !important;
          color: #0b0a10 !important;
          padding: 12px !important;
          border-radius: 6px;
          text-align: center !important;
          font-weight: 600;
          margin-top: 8px;
        }

        /* --- Generic Section --- */
        .lp-section {
          padding: 130px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .lp-section-title {
          font-size: 40px;
          text-align: center;
          margin-bottom: 16px;
        }
        .lp-section-subtitle {
          text-align: center;
          font-size: 20px;
          color: #a0a0a0;
          margin-bottom: 60px;
        }

        /* --- Hero Section --- */
        .lp-hero {
          padding: 200px 20px 100px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .lp-hero-content {
          display: grid;
          grid-template-columns: 4fr 6fr;
          gap: 80px;
          align-items: center;
        }
        .lp-hero-left h1 {
          font-size: clamp(48px, 6vw, 72px);
          line-height: 1.1;
          margin-bottom: 24px;
        }
        .lp-hero-left h1 span { color: #7c3aed; }
        .lp-hero-desc {
          font-size: 20px;
          color: #a0a0a0;
          margin-bottom: 40px;
          max-width: 500px;
        }
        .lp-hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .lp-trust-badges {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        .lp-trust-badges span {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        /* Hero Visual Placeholder */
        .lp-hero-visual-mockup {
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .lp-mockup-header {
          background: #222;
          padding: 12px 16px;
          display: flex;
          gap: 8px;
        }
        .lp-mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
        .lp-mockup-dot.red { background: #ff5f56; }
        .lp-mockup-dot.yellow { background: #ffbd2e; }
        .lp-mockup-dot.green { background: #27c93f; }
        .lp-mockup-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .lp-mockup-track {
          height: 60px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        .lp-mockup-waveform {
          position: absolute;
          top: 20%; bottom: 20%; left: 0; width: 60%;
          background: rgba(124, 58, 237, 0.2);
          border-radius: 4px;
        }
        .lp-mockup-waveform.offset { left: 20%; width: 40%; background: rgba(0, 136, 255, 0.2); }
        .lp-mockup-controls {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          justify-content: center;
        }
        .lp-mockup-btn {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .lp-mockup-btn.primary { background: rgba(124, 58, 237, 0.2); border: 2px solid #7c3aed; }
        /* --- Comparison Table --- */
        .lp-comparison-table-wrapper {
          background: #1a1a1a;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .lp-comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .lp-comparison-table th {
          background: #111;
          padding: 24px;
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .lp-comparison-table th:last-child {
          color: #7c3aed;
          background: rgba(124, 58, 237, 0.08);
          border-top-right-radius: 16px;
        }
        .lp-comparison-table td {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          color: #a0a0a0;
          vertical-align: middle;
        }
        .lp-comparison-table tr:hover td {
          background: rgba(255,255,255,0.02);
        }
        .lp-comparison-table td.lp-highlight-col {
          background: rgba(124, 58, 237, 0.05);
        }
        .lp-comparison-table tr:hover td.lp-highlight-col {
          background: rgba(124, 58, 237, 0.1);
        }
        .lp-td-content {
          display: flex;
          align-items: center;
          gap: 12px;
          line-height: 1.4;
        }
        .lp-comparison-table tr:last-child td { border-bottom: none; }
        .lp-comparison-table td strong {
          color: #fff;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .lp-comparison-table thead { display: none; }
          .lp-comparison-table tr {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 16px 0;
          }
          .lp-comparison-table tr:last-child { border-bottom: none; }
          .lp-comparison-table td {
            border: none;
            padding: 8px 24px;
          }
          .lp-comparison-table td:first-child {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .lp-comparison-table td:first-child::before {
            content: "Others: ";
            font-weight: 700;
          }
          .lp-comparison-table td:last-child::before {
            content: "Live Looper: ";
            color: #7c3aed;
            font-weight: 700;
            display: block;
            margin-bottom: 4px;
          }
        }

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          font-weight: 500;
        }
        .lp-problem-arrow { color: #333; }

        /* --- Workflow Cards --- */
        .lp-workflow-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .lp-workflow-card {
          background: #1a1a1a;
          padding: 32px 24px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.03);
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .lp-workflow-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 12px 30px rgba(0,0,0,0.5);
        }
        .lp-workflow-icon {
          color: #0088ff;
          margin-bottom: 12px;
        }
        .lp-workflow-card h3 { margin-bottom: 16px; font-size: 20px; }
        .lp-workflow-img-wrapper {
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
          background: #111;
        }
        .lp-workflow-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        .lp-workflow-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          margin-top: auto;
        }
        .lp-workflow-card ul li {
          color: #a0a0a0;
          font-size: 14px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        .lp-workflow-card ul li::before {
          content: '•';
          color: #333;
          margin-right: 8px;
        }

        /* --- Performance Modes --- */
        .lp-modes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .lp-mode-card {
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.03);
          transition: all 0.3s;
        }
        .lp-mode-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.1);
        }
        .lp-mode-card.live-mode-highlight {
          border-color: rgba(124, 58, 237, 0.3);
        }
        .lp-mode-card.live-mode-highlight:hover {
          border-color: rgba(124, 58, 237, 0.6);
          box-shadow: 0 12px 40px rgba(124, 58, 237, 0.1);
        }
        .lp-mode-image-placeholder {
          height: 280px;
          background: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #444;
          overflow: hidden;
        }
        .lp-mode-image-placeholder.live { background: rgba(124, 58, 237, 0.05); color: #7c3aed; }
        .lp-mode-content { padding: 24px; }
        .lp-mode-content h3 {
          margin-bottom: 12px;
          font-size: 24px;
        }

        /* --- Pro Features --- */
        .lp-pro-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
        }
        .lp-pro-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .lp-pro-icon { color: #0088ff; flex-shrink: 0; }
        .lp-pro-item h4 { font-size: 18px; margin-bottom: 6px; }
        .lp-pro-item p { font-size: 15px; }

        /* --- Timeline --- */
        .lp-timeline-section {
          background: #1a1a1a;
          border-radius: 24px;
          padding: 80px 40px;
        }
        .lp-timeline {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          max-width: 1000px;
          margin: 0 auto;
        }
        .lp-timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
        }
        .lp-step-icon {
          width: 56px;
          height: 56px;
          background: #2a2a2a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #fff;
        }
        .lp-timeline-step h4 { margin-bottom: 4px; }
        .lp-timeline-step p { font-size: 13px; }
        .lp-timeline-connector {
          flex: 1;
          height: 2px;
          background: #333;
          margin-top: 28px;
        }

        /* --- Technical --- */
        .lp-tech-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .lp-tech-card {
          background: #1a1a1a;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.03);
          transition: all 0.3s;
        }
        .lp-tech-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.1);
        }
        .lp-tech-card h3 { margin-bottom: 12px; font-size: 20px; }
        .lp-tech-card p { font-size: 15px; }

        /* --- Final CTA --- */
        .lp-cta-box {
          background: linear-gradient(145deg, #1a1a1a 0%, #0f1c14 100%);
          border: 1px solid rgba(124, 58, 237, 0.2);
          padding: 80px 40px;
          border-radius: 24px;
          text-align: center;
        }
        .lp-cta-title { font-size: 48px; margin-bottom: 40px; }
        .lp-cta-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .lp-open-source { color: #666; font-size: 14px; }

        /* --- Footer --- */
        .lp-footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 14px;
        }
        .lp-footer-links {
          display: flex;
          gap: 24px;
        }
        .lp-footer-links a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s;
        }
        .lp-footer-links a:hover { color: #fff; }

        /* --- Responsive --- */
        @media (max-width: 1024px) {
          .lp-hero-content { grid-template-columns: 1fr; text-align: center; gap: 40px; }
          .lp-hero-desc { margin: 0 auto 40px; }
          .lp-hero-actions { justify-content: center; }
          .lp-trust-badges { justify-content: center; }
          
          .lp-workflow-grid, .lp-modes-grid, .lp-tech-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .lp-nav-desktop { display: none; }
          .lp-nav-mobile-btn { display: block; }
          .lp-nav-mobile-menu { display: flex; }
          
          .lp-problem-grid { grid-template-columns: 1fr; gap: 20px; }
          .lp-problem-arrow { transform: rotate(90deg); margin: 0 auto; }
          
          .lp-workflow-grid, .lp-modes-grid, .lp-tech-grid, .lp-pro-grid { grid-template-columns: 1fr; }
          
          .lp-timeline { flex-direction: column; gap: 24px; align-items: flex-start; }
          .lp-timeline-step { flex-direction: row; text-align: left; gap: 16px; }
          .lp-step-icon { margin-bottom: 0; }
          .lp-timeline-connector { display: none; }
          
          .lp-hero { padding-top: 140px; }
          .lp-hero-left h1 { font-size: 40px; }
          .lp-section-title { font-size: 32px; }
          .lp-cta-title { font-size: 32px; }
          
          .lp-footer { flex-direction: column; align-items: center; gap: 24px; }
        }
      `}</style>
    </div>
  );
};
