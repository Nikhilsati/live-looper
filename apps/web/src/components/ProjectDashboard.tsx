import React, { useEffect, useState } from 'react';
import { useLooperStore } from '../store/useLooperStore';
import {
    Stack, Row, Card, Button, Heading, Text, Grid
} from '@live-looper/ui';
import { PlusIcon, DownloadSimpleIcon, UploadSimpleIcon, TrashIcon, MusicNoteIcon, ClockIcon, VinylRecordIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const ProjectDashboard: React.FC = () => {
    const {
        projectList, fetchProjects, createNewProject,
        deleteProject, exportProject, importProject
    } = useLooperStore();

    const navigate = useNavigate();

    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

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
            setNewProjectName('');
            setIsCreating(false);
            if (projectId) navigate(`/projects/${projectId}`);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#0a0a0a',
            padding: '40px 20px',
            color: 'white'
        }}>
            <Stack style={{ maxWidth: 1200, margin: '0 auto', gap: 60 }}>
                {/* Header Section */}
                <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Stack style={{ gap: 8 }}>
                        <Heading style={{ fontSize: 48, letterSpacing: '-0.02em' }}>My Projects</Heading>
                        <Text style={{ opacity: 0.5, fontSize: 18 }}>Welcome back. What are we looping today?</Text>
                    </Stack>
                    <Row style={{ gap: 16 }}>
                        <label style={{ cursor: 'pointer' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '12px 24px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: 12,
                                color: 'white',
                                fontWeight: 600,
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.2s'
                            }}>
                                <UploadSimpleIcon size={20} style={{ marginRight: 10 }} />
                                Import .llp
                            </div>
                            <input type="file" accept=".llp" onChange={handleImport} style={{ display: 'none' }} />
                        </label>
                        <Button
                            variant="primary"
                            style={{ height: 50, padding: '0 24px', borderRadius: 12 }}
                            onClick={() => setIsCreating(true)}
                        >
                            <PlusIcon size={20} style={{ marginRight: 10 }} />
                            Create Project
                        </Button>
                    </Row>
                </Row>

                {/* Create New Project Modal */}
                {isCreating && (
                    <div style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Card style={{ width: 400, padding: 32 }}>
                            <Stack style={{ gap: 24 }}>
                                <Heading>New Project</Heading>
                                <input
                                    type="text"
                                    placeholder="Project Name..."
                                    value={newProjectName}
                                    onChange={e => setNewProjectName(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '16px',
                                        color: 'white',
                                        borderRadius: 12,
                                        fontSize: 18,
                                        width: '100%'
                                    }}
                                    autoFocus
                                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                />
                                <Row style={{ gap: 12 }}>
                                    <Button onClick={handleCreate} style={{ flex: 1 }}>Create</Button>
                                    <Button variant="ghost" onClick={() => setIsCreating(false)} style={{ flex: 1 }}>Cancel</Button>
                                </Row>
                            </Stack>
                        </Card>
                    </div>
                )}

                {/* Project List */}
                <Grid cols="repeat(auto-fill, minmax(340px, 1fr))" style={{ gap: 24 }}>
                    {projectList.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', opacity: 0.3 }}>
                            <MusicNoteIcon size={64} style={{ marginBottom: 20 }} />
                            <Text>No projects found. Start by creating one above.</Text>
                        </div>
                    )}
                    {projectList.map(p => (
                        <div
                            key={p.id}
                            style={{
                                padding: 24,
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'transform 0.2s, background 0.2s',
                                cursor: 'pointer',
                                borderRadius: 16
                            }}
                            className="project-card"
                            onClick={() => navigate(`/projects/${p.id}`)}
                        >
                            <Stack style={{ gap: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: 48, height: 48,
                                        borderRadius: 12,
                                        backgroundColor: 'var(--accent)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <VinylRecordIcon size={24} color="white" />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => exportProject(p.id)}
                                            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        >
                                            <DownloadSimpleIcon size={18} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => { if (confirm('Delete project?')) deleteProject(p.id); }}
                                            style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                                        >
                                            <TrashIcon size={18} />
                                        </Button>
                                    </div>
                                </div>

                                <Stack style={{ gap: 4 }}>
                                    <Heading style={{ fontSize: 24, margin: 0 }}>{p.name}</Heading>
                                    <Row style={{ gap: 12, alignItems: 'center', opacity: 0.5 }}>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <ClockIcon size={14} />
                                            <Text style={{ fontSize: 13 }}>{new Date(p.updatedAt).toLocaleDateString()}</Text>
                                        </div>
                                        <Text style={{ fontSize: 13 }}>•</Text>
                                        <Text style={{ fontSize: 13 }}>{p.bpm} BPM</Text>
                                    </Row>
                                </Stack>
                            </Stack>
                        </div>
                    ))}
                </Grid>
            </Stack>

            <style>{`
                .project-card:hover {
                    transform: translateY(-4px);
                    background-color: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                }
            `}</style>
        </div>
    );
};
