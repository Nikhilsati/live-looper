import React from "react";
import { useNavigate } from "react-router-dom";
import { GuitarIcon, VinylRecordIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Heading, Text, Stack } from "@live-looper/ui";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "radial-gradient(ellipse at top, #130925 0%, #0a0a0a 100%)",
        color: "white",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Stack style={{ alignItems: "center", gap: 16, marginBottom: 80, textAlign: "center" }}>
        <div
          style={{
            padding: "8px 20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Live Looper Studio
        </div>
        <Heading
          style={{
            fontSize: "4.5rem",
            letterSpacing: "-0.03em",
            background: "linear-gradient(180deg, #ffffff 0%, #a881ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Where to?
        </Heading>
        <Text style={{ opacity: 0.6, fontSize: "1.25rem", fontWeight: 400, maxWidth: 500 }}>
          Choose your session type to get started.
        </Text>
      </Stack>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 40,
          width: "100%",
          maxWidth: 900,
        }}
      >
        {/* Guitar Practice Card */}
        <div
          onClick={() => navigate("/practice")}
          className="navigator-card practice-card"
          style={{
            position: "relative",
            padding: 40,
            background: "rgba(16,185,129,0.03)",
            border: "1px solid rgba(16,185,129,0.15)",
            borderRadius: 32,
            cursor: "pointer",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 32,
            transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
        >
          <div className="card-glow practice-glow" />
          
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 32px rgba(16,185,129,0.4)",
              zIndex: 1,
            }}
          >
            <GuitarIcon size={40} color="white" weight="fill" />
          </div>

          <Stack style={{ gap: 12, zIndex: 1 }}>
            <Heading
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Guitar Practice
            </Heading>
            <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              Plug in and play immediately. Live pass-through with a full FX rack. No project setup required.
            </Text>
          </Stack>

          <div className="card-footer" style={{ zIndex: 1, display: "flex", alignItems: "center", gap: 12, color: "#10b981", fontWeight: 700, marginTop: "auto" }}>
            <span>Start Session</span>
            <ArrowRightIcon size={20} weight="bold" className="arrow-icon" />
          </div>
        </div>

        {/* Live Looper Card */}
        <div
          onClick={() => navigate("/looper")}
          className="navigator-card looper-card"
          style={{
            position: "relative",
            padding: 40,
            background: "rgba(168,129,255,0.03)",
            border: "1px solid rgba(168,129,255,0.15)",
            borderRadius: 32,
            cursor: "pointer",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 32,
            transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
        >
          <div className="card-glow looper-glow" />

          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: "linear-gradient(135deg, #a881ff 0%, #7b42ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 32px rgba(168,129,255,0.4)",
              zIndex: 1,
            }}
          >
            <VinylRecordIcon size={40} color="white" weight="fill" />
          </div>

          <Stack style={{ gap: 12, zIndex: 1 }}>
            <Heading
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Live Looper
            </Heading>
            <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              Create multi-track loops, arrange sections, and record full performances. Access your projects.
            </Text>
          </Stack>
          
          <div className="card-footer" style={{ zIndex: 1, display: "flex", alignItems: "center", gap: 12, color: "#a881ff", fontWeight: 700, marginTop: "auto" }}>
            <span>Open Workspace</span>
            <ArrowRightIcon size={20} weight="bold" className="arrow-icon" />
          </div>
        </div>
      </div>

      <style>{`
        .navigator-card:hover {
          transform: translateY(-8px);
        }
        .practice-card:hover {
          border-color: rgba(16, 185, 129, 0.6) !important;
          background: rgba(16, 185, 129, 0.08) !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 60px rgba(16,185,129,0.15);
        }
        .looper-card:hover {
          border-color: rgba(168, 129, 255, 0.6) !important;
          background: rgba(168, 129, 255, 0.08) !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 60px rgba(168,129,255,0.15);
        }
        
        .card-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          pointer-events: none;
          transition: all 0.5s ease;
          opacity: 0.5;
        }
        .practice-glow {
          top: -100px;
          right: -100px;
          background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%);
        }
        .looper-glow {
          top: -100px;
          right: -100px;
          background: radial-gradient(circle, rgba(168,129,255,0.2) 0%, transparent 70%);
        }
        
        .navigator-card:hover .practice-glow {
          opacity: 1;
          transform: scale(1.2);
        }
        .navigator-card:hover .looper-glow {
          opacity: 1;
          transform: scale(1.2);
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }
        .navigator-card:hover .arrow-icon {
          transform: translateX(6px);
        }
      `}</style>
    </div>
  );
};
