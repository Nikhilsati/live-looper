import React, { useEffect, useState } from "react";
import { useLooperStore } from "../store/useLooperStore";
import { Stack, Row, Card, Button, Heading, Text, Grid } from "@live-looper/ui";
import {
  PlusIcon,
  DownloadSimpleIcon,
  UploadSimpleIcon,
  TrashIcon,
  MusicNoteIcon,
  ClockIcon,
  VinylRecordIcon,
  GuitarIcon,
  LightningIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { uiConfirm } from "../store/useDialogStore";

export const ProjectDashboard: React.FC = () => {
  const {
    projectList,
    fetchProjects,
    createNewProject,
    deleteProject,
    exportProject,
    importProject,
  } = useLooperStore();

  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importProject(file);
    }
  };

  const handleCreate = async () => {
    if (newProjectName.trim()) {
      const projectId = await createNewProject(newProjectName);
      setNewProjectName("");
      setIsCreating(false);
      if (projectId) navigate(`/projects/${projectId}`);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        // background: 'radial-gradient(ellipse at top left, #2a0845 0%, #1a0b2e 50%, #0a0a0a 100%)',
        padding: "40px 20px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Stack style={{ maxWidth: 1200, margin: "0 auto", gap: 60 }}>
        {/* Header Section */}
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <Stack style={{ gap: 8 }}>
            <Heading
              style={{
                fontSize: 56,
                letterSpacing: "-0.03em",
                background: "linear-gradient(90deg, #ffffff, #a881ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                margin: 0,
              }}
            >
              My Projects
            </Heading>
            <Text style={{ opacity: 0.7, fontSize: 18, fontWeight: 400 }}>
              Welcome back. What are we looping today?
            </Text>
          </Stack>
          <Row style={{ gap: 16 }}>
            <label style={{ cursor: "pointer" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 24px",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 16,
                  color: "white",
                  fontWeight: 600,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
                className="header-btn"
              >
                <UploadSimpleIcon
                  size={20}
                  style={{ marginRight: 10 }}
                  weight="bold"
                />
                Import .llp
              </div>
              <input
                type="file"
                accept=".llp"
                onChange={handleImport}
                style={{ display: "none" }}
              />
            </label>
            <Button
              variant="primary"
              style={{
                height: 50,
                padding: "0 28px",
                borderRadius: 16,
                background: "linear-gradient(135deg, #a881ff 0%, #7b42ff 100%)",
                border: "none",
                fontWeight: 700,
                boxShadow: "0 4px 15px rgba(123, 66, 255, 0.3)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setIsCreating(true)}
              className="header-btn-primary"
            >
              <PlusIcon size={20} style={{ marginRight: 10 }} weight="bold" />
              Create Project
            </Button>
          </Row>
        </Row>

        {/* Create New Project Modal */}
        {isCreating && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <Card
              style={{
                width: 440,
                padding: 40,
                background: "rgba(30, 20, 45, 0.95)",
                border: "1px solid rgba(168, 129, 255, 0.3)",
                borderRadius: 24,
                boxShadow:
                  "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(168, 129, 255, 0.1) inset",
              }}
            >
              <Stack style={{ gap: 28 }}>
                <Heading style={{ fontSize: 32, margin: 0 }}>
                  New Project
                </Heading>
                <input
                  type="text"
                  placeholder="Project Name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(168, 129, 255, 0.4)",
                    padding: "18px 20px",
                    color: "white",
                    borderRadius: 16,
                    fontSize: 18,
                    width: "100%",
                    outline: "none",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
                    transition: "border-color 0.2s ease",
                  }}
                  className="project-input"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
                <Row style={{ gap: 16 }}>
                  <Button
                    onClick={handleCreate}
                    style={{
                      flex: 1,
                      padding: "16px 0",
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg, #a881ff 0%, #7b42ff 100%)",
                      border: "none",
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                    className="header-btn-primary"
                  >
                    Create
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsCreating(false)}
                    style={{
                      flex: 1,
                      padding: "16px 0",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                    className="header-btn"
                  >
                    Cancel
                  </Button>
                </Row>
              </Stack>
            </Card>
          </div>
        )}

        {/* ── Guitar Practice Quick Access ───────────────────── */}
        <div
          id="guitar-practice-card"
          className="guitar-practice-card"
          onClick={() => navigate("/practice")}
          style={{
            position: "relative",
            padding: "28px 32px",
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(8,145,178,0.08) 100%)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 24,
            cursor: "pointer",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
        >
          {/* Background glow orbs */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: 60,
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -30,
              right: 20,
              width: 130,
              height: 130,
              background:
                "radial-gradient(circle, rgba(8,145,178,0.12) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {/* Left: icon + text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                flexShrink: 0,
                background: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
              }}
            >
              <GuitarIcon size={32} color="white" weight="fill" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(90deg, #10b981, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 4,
                }}
              >
                Guitar Practice
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 400,
                }}
              >
                Plug in and play — live pass-through with the full FX rack. No
                project needed.
              </div>
            </div>
          </div>

          {/* Right: feature pills + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            {["EQ", "Reverb", "Delay", "Drive", "Chorus"].map((fx) => (
              <div
                key={fx}
                style={{
                  padding: "5px 12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {fx}
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                background: "linear-gradient(135deg, #10b981, #0891b2)",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
              }}
            >
              <LightningIcon size={16} weight="fill" />
              Open
            </div>
          </div>
        </div>

        {/* Project List */}

        <Grid cols="repeat(auto-fill, minmax(360px, 1fr))" style={{ gap: 30 }}>
          {projectList.length === 0 && (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "120px 0",
                opacity: 0.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MusicNoteIcon size={48} weight="duotone" />
              </div>
              <Text style={{ fontSize: 20, fontWeight: 500 }}>
                No projects found. Start by creating one above.
              </Text>
            </div>
          )}
          {projectList.map((p) => (
            <div
              key={p.id}
              style={{
                position: "relative",
                padding: 30,
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 24,
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                cursor: "pointer",
                overflow: "hidden",
              }}
              className="project-card"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              {/* Decorative background flare */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  background:
                    "radial-gradient(circle, rgba(168, 129, 255, 0.15) 0%, rgba(0,0,0,0) 70%)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              <Stack style={{ gap: 28 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 18,
                      background:
                        "linear-gradient(135deg, #a881ff 0%, #7b42ff 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(123, 66, 255, 0.3)",
                    }}
                  >
                    <VinylRecordIcon size={32} color="white" weight="duotone" />
                  </div>
                  <div
                    style={{ display: "flex", gap: 8, zIndex: 10 }}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => exportProject(p.id)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: 14,
                        width: 44,
                        height: 44,
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      className="card-action-btn"
                    >
                      <DownloadSimpleIcon size={20} weight="bold" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const confirmed = await uiConfirm(
                          "This action cannot be undone. All recorded layers will be lost.",
                          "Delete Project?",
                          { danger: true, confirmText: "Delete Forever" },
                        );
                        if (confirmed) {
                          deleteProject(p.id);
                        }
                      }}
                      style={{
                        color: "#ff6b6b",
                        backgroundColor: "rgba(255, 107, 107, 0.1)",
                        borderRadius: 14,
                        width: 44,
                        height: 44,
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      className="card-action-btn-danger"
                    >
                      <TrashIcon size={20} weight="bold" />
                    </Button>
                  </div>
                </div>

                <Stack style={{ gap: 8 }}>
                  <Heading
                    style={{
                      fontSize: 26,
                      margin: 0,
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {p.name}
                  </Heading>
                  <Row style={{ gap: 16, alignItems: "center", opacity: 0.6 }}>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      <ClockIcon size={16} weight="duotone" />
                      <Text style={{ fontSize: 14, fontWeight: 500 }}>
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </Text>
                    </div>
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "currentColor",
                        opacity: 0.5,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#a881ff",
                      }}
                    >
                      {p.bpm} BPM
                    </Text>
                  </Row>
                </Stack>
              </Stack>
            </div>
          ))}
        </Grid>
      </Stack>

      <style>{`
                .project-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(168, 129, 255, 0.4);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(168, 129, 255, 0.15);
                }
                .header-btn {
                    cursor: pointer;
                }
                .header-btn:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
                }
                .header-btn-primary {
                    cursor: pointer;
                }
                .header-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(123, 66, 255, 0.5) !important;
                    filter: brightness(1.1);
                }
                .card-action-btn:hover {
                    background-color: rgba(255,255,255,0.15) !important;
                    color: #a881ff !important;
                    transform: scale(1.05);
                }
                .card-action-btn-danger:hover {
                    background-color: rgba(255, 107, 107, 0.2) !important;
                    color: #ff4c4c !important;
                    transform: scale(1.05);
                }
                .project-input:focus {
                    border-color: #a881ff !important;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.2), 0 0 0 3px rgba(168, 129, 255, 0.2) !important;
                }
                @keyframes fadeIn {
                    from { opacity: 0; backdrop-filter: blur(0px); }
                    to { opacity: 1; backdrop-filter: blur(8px); }
                }
                .guitar-practice-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(16, 185, 129, 0.5);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.3), 0 0 40px rgba(16,185,129,0.12);
                }
            `}</style>
    </div>
  );
};
