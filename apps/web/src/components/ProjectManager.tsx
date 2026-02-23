import React, { useEffect, useState } from 'react';
import { useLooperStore } from '../store/useLooperStore';
import {
    Stack, Row, Card, Button, Heading, Text, Badge,
} from '@live-looper/ui';
import { FolderOpen, Plus, Save, Download, Upload, Trash2, X } from 'lucide-react';

export const ProjectManager: React.FC = () => {
    const {
        projectList, currentProject, fetchProjects, createNewProject,
        loadProject, deleteProject, exportProject, importProject, mode
    } = useLooperStore();

    const [isOpen, setIsOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await importProject(file);
            setIsOpen(false);
        }
    };

    const handleCreate = async () => {
        if (newProjectName.trim()) {
            await createNewProject(newProjectName);
            setNewProjectName('');
            setIsCreating(false);
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return (
            <Button variant="ghost" onClick={() => setIsOpen(true)}>
                <FolderOpen size={18} style={{ marginRight: 8 }} />
                {currentProject?.name || 'Projects'}
            </Button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
        }}>
            <Card style={{ width: '100%', maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }}>
                <Stack style={{ gap: 24 }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Heading>Project Manager</Heading>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            <X size={24} />
                        </Button>
                    </Row>

                    {isCreating ? (
                        <Stack style={{ gap: 16 }}>
                            <Text>New Project Name</Text>
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={e => setNewProjectName(e.target.value)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '12px 16px',
                                    color: 'white',
                                    borderRadius: 8,
                                    fontSize: 16
                                }}
                                autoFocus
                                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                            />
                            <Row style={{ gap: 12 }}>
                                <Button onClick={handleCreate}>Create Project</Button>
                                <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                            </Row>
                        </Stack>
                    ) : (
                        <Stack style={{ gap: 20 }}>
                            <Row style={{ gap: 12 }}>
                                <Button onClick={() => setIsCreating(true)}>
                                    <Plus size={18} style={{ marginRight: 8 }} />
                                    New Project
                                </Button>
                                <label style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontWeight: 500 }}>
                                        <Upload size={18} style={{ marginRight: 8 }} />
                                        Import .llp
                                    </div>
                                    <input type="file" accept=".llp" onChange={handleImport} style={{ display: 'none' }} />
                                </label>
                            </Row>

                            <Stack style={{ gap: 12 }}>
                                <Text style={{ fontWeight: 'bold' }}>All Projects</Text>
                                {projectList.length === 0 && (
                                    <Text style={{ opacity: 0.5 }}>No projects found. Create or import one!</Text>
                                )}
                                {projectList.map(p => (
                                    <Card key={p.id} style={{
                                        padding: 16,
                                        border: currentProject?.id === p.id ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                                        backgroundColor: 'rgba(255,255,255,0.02)'
                                    }}>
                                        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div
                                                onClick={() => loadProject(p.id)}
                                                style={{ cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}
                                            >
                                                <Heading style={{ fontSize: 18 }}>{p.name}</Heading>
                                                <Text style={{ fontSize: 12, opacity: 0.6 }}>
                                                    {new Date(p.updatedAt).toLocaleString()} • {p.bpm} BPM
                                                </Text>
                                            </div>
                                            <Row style={{ gap: 8 }}>
                                                <Button variant="ghost" onClick={() => exportProject(p.id)} title="Export .llp">
                                                    <Download size={18} />
                                                </Button>
                                                <Button variant="ghost" onClick={() => deleteProject(p.id)} style={{ color: '#ff4444' }}>
                                                    <Trash2 size={18} />
                                                </Button>
                                            </Row>
                                        </Row>
                                    </Card>
                                ))}
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </Card>
        </div>
    );
};
