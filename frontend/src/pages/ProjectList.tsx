import React, { useEffect, useState } from 'react';
import { api, Project } from '../services/api';
import { Link } from 'react-router-dom';

export const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(true);

    useEffect(() => {
        loadProjects();
        loadFiles();
    }, []);

    const loadProjects = async () => {
        setLoadingProjects(true);
        try {
            const data = await api.listProjects();
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProjects(false);
        }
    };

    const loadFiles = async () => {
        try {
            const files = await api.listAvailableFiles();
            setAvailableFiles(files);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFile = (file: string) => {
        const newSet = new Set(selectedFiles);
        if (newSet.has(file)) {
            newSet.delete(file);
        } else {
            newSet.add(file);
        }
        setSelectedFiles(newSet);
    };

    const handleCreate = async () => {
        if (!newProjectName) return;
        setLoading(true);
        try {
            await api.createProject(newProjectName, 'Description', Array.from(selectedFiles));
            setNewProjectName('');
            setSelectedFiles(new Set());
            loadProjects();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectId: string, projectName: string) => {
        if (!confirm(`Are you sure you want to delete "${projectName}"?`)) return;
        try {
            await api.deleteProject(projectId);
            loadProjects();
        } catch (error) {
            console.error(error);
            alert('Failed to delete project');
        }
    };

    return (
        <div className="container">
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>
                    📊 Legal Tabular Review
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                    Extract structured data from legal documents using AI
                </p>
            </div>

            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="card-header">✨ Create New Project</div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Project Name
                    </label>
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={e => setNewProjectName(e.target.value)}
                        placeholder="e.g., Tesla Supply Agreement Review"
                        className="input"
                    />
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Select Documents ({selectedFiles.size} selected)
                    </label>
                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-secondary)'
                    }}>
                        {availableFiles.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                                📂 No files found in data folder
                            </p>
                        ) : (
                            availableFiles.map(file => (
                                <label
                                    key={file}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: 'var(--spacing-sm)',
                                        cursor: 'pointer',
                                        borderRadius: 'var(--radius-sm)',
                                        marginBottom: 'var(--spacing-xs)',
                                        transition: 'var(--transition)',
                                        background: selectedFiles.has(file) ? 'var(--primary)' : 'transparent',
                                        color: selectedFiles.has(file) ? 'white' : 'var(--text-primary)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!selectedFiles.has(file)) {
                                            e.currentTarget.style.background = 'var(--gray-100)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!selectedFiles.has(file)) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedFiles.has(file)}
                                        onChange={() => toggleFile(file)}
                                        style={{ marginRight: 'var(--spacing-sm)' }}
                                    />
                                    <span style={{ fontSize: '0.875rem' }}>📄 {file}</span>
                                </label>
                            ))
                        )}
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    disabled={loading || !newProjectName || selectedFiles.size === 0}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <>
                            <div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></div>
                            Creating...
                        </>
                    ) : (
                        <>🚀 Create Project</>
                    )}
                </button>
            </div>

            <div>
                <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '1.5rem' }}>
                    📁 Your Projects
                </h2>

                {loadingProjects ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div className="spinner"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📭</div>
                        <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No projects yet</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
                            Create your first project to get started
                        </p>
                    </div>
                ) : (
                    <div className="grid" style={{ gap: 'var(--spacing-lg)' }}>
                        {projects.map(p => (
                            <div key={p.id} className="card" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 'var(--spacing-lg)'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <Link
                                        to={`/project/${p.id}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'var(--primary)',
                                            fontSize: '1.25rem',
                                            fontWeight: 600,
                                            display: 'block',
                                            marginBottom: 'var(--spacing-sm)'
                                        }}
                                    >
                                        {p.name}
                                    </Link>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span className={`badge ${p.status === 'completed' ? 'badge-success' :
                                                p.status === 'pending' ? 'badge-warning' :
                                                    p.status === 'failed' ? 'badge-danger' : 'badge-info'
                                            }`}>
                                            {p.status}
                                        </span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            📅 {new Date(p.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(p.id, p.name);
                                    }}
                                    className="btn btn-danger"
                                    style={{ fontSize: '0.875rem' }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
