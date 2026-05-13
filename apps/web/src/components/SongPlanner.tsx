import React from 'react';
import { useLooperStore } from '../store/useLooperStore';
import { Card, Button, Row, Stack, Label, Heading, ValueText } from '@live-looper/ui';
import { 
    PlusIcon, 
    TrashIcon, 
    CaretLeftIcon, 
    CaretRightIcon 
} from '@live-looper/icons';
import { TRACK_COLORS } from './TrackControls';

const EditableSectionName = ({
    initialName,
    onRename
}: {
    initialName: string;
    onRename: (newName: string) => void;
}) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [name, setName] = React.useState(initialName);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (name.trim() && name !== initialName) {
            onRename(name.trim());
        } else {
            setName(initialName);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setName(initialName);
        }
    };

    // Keep name in sync with external changes if any
    React.useEffect(() => {
        setName(initialName);
    }, [initialName]);

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--color-primary)',
                    color: 'white',
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontSize: 14,
                    fontWeight: 600,
                    width: '100%',
                    outline: 'none',
                    margin: '-3px -7px' // to visually offset the padding so layout doesn't jump
                }}
            />
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            title="Click to rename"
            style={{ cursor: 'pointer', borderBottom: '1px dashed rgba(255,255,255,0.3)', display: 'inline-block' }}
        >
            <ValueText>{initialName}</ValueText>
        </span>
    );
};

export const SongPlanner = () => {
    const {
        sections,
        currentSectionIndex,
        queuedSectionIndex,
        mode,
        addSection,
        renameSection,
        deleteSection,
        reorderSections,
        carryForwardTrack
    } = useLooperStore();

    const isPlan = mode === 'planning';

    const handleAdd = async () => {
        const newName = `Section ${sections.length + 1}`;
        await addSection(newName);
    };

    const handleMoveLeft = async (index: number) => {
        if (index === 0) return;
        const newOrder = [...sections.map(s => s.id)];
        const temp = newOrder[index - 1];
        newOrder[index - 1] = newOrder[index];
        newOrder[index] = temp;
        await reorderSections(newOrder);
    };

    const handleMoveRight = async (index: number) => {
        if (index === sections.length - 1) return;
        const newOrder = [...sections.map(s => s.id)];
        const temp = newOrder[index + 1];
        newOrder[index + 1] = newOrder[index];
        newOrder[index] = temp;
        await reorderSections(newOrder);
    };

    const handleToggleCarryForward = async (trackIndex: number, sectionIndex: number, currentLinked: boolean) => {
        if (sectionIndex === 0) return; // Can't carry forward to the first section
        const prevSection = sections[sectionIndex - 1];
        const thisSection = sections[sectionIndex];
        await carryForwardTrack(trackIndex, prevSection.id, thisSection.id, !currentLinked);
    };

    return (
        <Stack style={{ gap: 16 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading style={{ fontSize: 24, margin: 0 }}>Timeline</Heading>
                {isPlan && (
                    <Button onClick={handleAdd} size="sm" variant="ghost">
                        <Row style={{ alignItems: 'center', gap: 6 }}>
                            <PlusIcon size={14} /> Add Section
                        </Row>
                    </Button>
                )}
            </Row>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                overflowX: 'auto',
                padding: '16px 0',
                msOverflowStyle: 'none',  /* IE and Edge */
                scrollbarWidth: 'none',  /* Firefox */
            }}>
                {sections.map((section, idx) => {
                    const isActive = idx === currentSectionIndex;
                    const isQueued = idx === queuedSectionIndex;

                    return (
                        <Card
                            key={section.id}
                            style={{
                                minWidth: 250,
                                borderColor: isQueued ? 'var(--color-warning)' : isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)',
                                padding: 16,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                transition: 'all 0.2s'
                            }}
                        >
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Stack style={{ gap: 4 }}>
                                    <EditableSectionName
                                        initialName={section.name}
                                        onRename={(newName) => renameSection(section.id, newName)}
                                    />
                                    <Label>{section.lengthInBars} Bars</Label>
                                </Stack>
                                {isPlan && (
                                    <Row style={{ gap: 4 }}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMoveLeft(idx)}
                                            disabled={idx === 0}
                                            style={{ padding: '4px 8px' }}
                                        >
                                            <CaretLeftIcon size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMoveRight(idx)}
                                            disabled={idx === sections.length - 1}
                                            style={{ padding: '4px 8px' }}
                                        >
                                            <CaretRightIcon size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteSection(section.id)}
                                            disabled={sections.length <= 1}
                                            style={{ padding: '4px 8px' }}
                                        >
                                            <TrashIcon size={16} style={{ color: "var(--color-danger)" }} />
                                        </Button>
                                    </Row>
                                )}
                            </Row>

                            {/* Carry Forward Toggles - Only show in Plan mode, and not on the first section */}
                            {isPlan && idx > 0 && (
                                <Stack style={{ gap: 8, marginTop: 8 }}>
                                    <Label>Carry Forward From Previous:</Label>
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                                        {[0, 1, 2, 3].map(trackIndex => {
                                            const isLinked = section.trackLinks?.[trackIndex] ?? true;

                                            return (
                                                <button
                                                    key={trackIndex}
                                                    onClick={() => handleToggleCarryForward(trackIndex, idx, isLinked)}
                                                    title={`Carry Forward T${trackIndex + 1}`}
                                                    style={{
                                                        flex: 1,
                                                        height: 32,
                                                        borderRadius: 6,
                                                        border: `1px solid ${isLinked ? TRACK_COLORS[trackIndex].border : 'rgba(255,255,255,0.1)'}`,
                                                        background: isLinked ? TRACK_COLORS[trackIndex].idle : 'transparent',
                                                        color: isLinked ? TRACK_COLORS[trackIndex].accent : 'rgba(255,255,255,0.4)',
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.background = TRACK_COLORS[trackIndex].haudio;
                                                        e.currentTarget.style.color = TRACK_COLORS[trackIndex].accent;
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = isLinked ? TRACK_COLORS[trackIndex].idle : 'transparent';
                                                        e.currentTarget.style.color = isLinked ? TRACK_COLORS[trackIndex].accent : 'rgba(255,255,255,0.4)';
                                                    }}
                                                >
                                                    T{trackIndex + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </Stack>
                            )}
                        </Card>
                    );
                })}
            </div>
        </Stack>
    );
};
