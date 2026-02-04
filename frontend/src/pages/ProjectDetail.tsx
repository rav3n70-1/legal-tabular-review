import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, Project } from '../services/api';
import { ComparisonTable } from '../components/ComparisonTable';
import { FieldEditor } from '../components/FieldEditor';
import { FilterPanel, FilterState } from '../components/FilterPanel';
import { DocumentPreview } from '../components/DocumentPreview';
import { ExportService } from '../services/export';

export const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<{ id: string; filename: string } | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        confidenceMin: 0,
        searchTerm: '',
        showOnlyHighConfidence: false
    });

    // Default fields for demo
    const [fields, setFields] = useState([
        "Effective Date",
        "Governing Law",
        "Parties Involved",
        "Termination Clause"
    ]);

    useEffect(() => {
        if (id) loadProject(id);
    }, [id]);

    const loadProject = async (projectId: string) => {
        setLoading(true);
        try {
            const data = await api.getProject(projectId);
            setProject(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!project) return;
        setGenerating(true);
        try {
            await api.generateAnswers(project.id, fields);
            setTimeout(() => loadProject(project.id), 1000);
        } catch (error) {
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const handleExportCSV = () => {
        if (!project) return;
        const comparisonData = [{
            id: project.id,
            filename: "Consolidated Results",
            answers: project.answers
        }];
        ExportService.exportExtractionResults(project.name, fields, comparisonData);
    };

    const handleExportExcel = () => {
        if (!project) return;
        const comparisonData = [{
            id: project.id,
            filename: "Consolidated Results",
            answers: project.answers
        }];
        ExportService.exportExtractionResultsToExcel(project.name, fields, comparisonData);
    };

    if (loading && !project) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-2xl)' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container">
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>❌</div>
                    <h3>Project not found</h3>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    // Apply filters
    let filteredAnswers = project.answers || [];
    if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredAnswers = filteredAnswers.filter(a =>
            a.question_text.toLowerCase().includes(searchLower) ||
            a.value.toLowerCase().includes(searchLower) ||
            (a.citation && a.citation.toLowerCase().includes(searchLower))
        );
    }
    if (filters.confidenceMin > 0) {
        filteredAnswers = filteredAnswers.filter(a => a.confidence * 100 >= filters.confidenceMin);
    }
    if (filters.showOnlyHighConfidence) {
        filteredAnswers = filteredAnswers.filter(a => a.confidence >= 0.8);
    }

    const comparisonData = [{
        id: project.id,
        filename: "Consolidated Results",
        answers: filteredAnswers
    }];

    return (
        <div className="container">
            <Link to="/" className="btn btn-secondary" style={{ marginBottom: 'var(--spacing-xl)' }}>
                ← Back to Projects
            </Link>

            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                    <div>
                        <h1 style={{ margin: 0, marginBottom: 'var(--spacing-sm)' }}>{project.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{project.description}</p>
                    </div>
                    <span className={`badge ${project.status === 'completed' ? 'badge-success' :
                            project.status === 'pending' ? 'badge-warning' :
                                project.status === 'failed' ? 'badge-danger' : 'badge-info'
                        }`} style={{ fontSize: '0.875rem' }}>
                        {project.status}
                    </span>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        📄 DOCUMENTS ({project.documents?.length || 0})
                    </div>
                    {project.documents && project.documents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {project.documents.map((doc: any) => (
                                <div key={doc.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--bg-primary)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <span style={{ fontSize: '0.875rem' }}>📎 {doc.filename}</span>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                                        <span className={`badge ${doc.status === 'parsed' ? 'badge-success' :
                                                doc.status === 'failed' ? 'badge-danger' :
                                                    'badge-warning'
                                            }`} style={{ fontSize: '0.75rem' }}>
                                            {doc.status}
                                        </span>
                                        <button
                                            onClick={() => setPreviewDoc({ id: doc.id, filename: doc.filename })}
                                            className="btn btn-secondary"
                                            style={{ fontSize: '0.75rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                                        >
                                            👁️ Preview
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>No documents attached</p>
                    )}
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <FieldEditor fields={fields} onFieldsChange={setFields} />

                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        {generating ? (
                            <>
                                <div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></div>
                                Running Extraction...
                            </>
                        ) : (
                            <>🚀 Run Extraction</>
                        )}
                    </button>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>📊 Extraction Results</h2>
                    {project.answers && project.answers.length > 0 && (
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button onClick={handleExportCSV} className="btn btn-secondary">
                                📥 Export CSV
                            </button>
                            <button onClick={handleExportExcel} className="btn btn-secondary">
                                📊 Export Excel
                            </button>
                        </div>
                    )}
                </div>

                {project.answers && project.answers.length > 0 && (
                    <FilterPanel onFilterChange={setFilters} />
                )}

                {project.answers && project.answers.length > 0 ? (
                    filteredAnswers.length > 0 ? (
                        <ComparisonTable questions={fields} documents={comparisonData} />
                    ) : (
                        <div style={{
                            padding: 'var(--spacing-2xl)',
                            textAlign: 'center',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            border: '2px dashed var(--border)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔍</div>
                            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                                No results match your filters
                            </h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Try adjusting your filter settings
                            </p>
                        </div>
                    )
                ) : (
                    <div style={{
                        padding: 'var(--spacing-2xl)',
                        textAlign: 'center',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px dashed var(--border)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                        <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 'var(--spacing-sm)' }}>
                            No extraction results yet
                        </h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Click "Run Extraction" above to analyze your documents
                        </p>
                    </div>
                )}
            </div>

            {previewDoc && (
                <DocumentPreview
                    documentId={previewDoc.id}
                    filename={previewDoc.filename}
                    onClose={() => setPreviewDoc(null)}
                />
            )}
        </div>
    );
};
