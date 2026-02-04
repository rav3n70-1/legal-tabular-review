import React, { useState, useEffect } from 'react';

interface DocumentPreviewProps {
    documentId: string;
    filename: string;
    onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentId, filename, onClose }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real implementation, fetch document content from backend
        // For now, show a placeholder
        setLoading(false);
        setContent('Document preview functionality - content would be loaded from backend');
    }, [documentId]);

    const isHTML = filename.toLowerCase().endsWith('.html') || filename.toLowerCase().endsWith('.htm');
    const isPDF = filename.toLowerCase().endsWith('.pdf');

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-lg)'
        }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-lg)',
                    maxWidth: '900px',
                    width: '100%',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-xl)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>📄 Document Preview</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{filename}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
                        ✕ Close
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: 'var(--spacing-lg)'
                }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-2xl)' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : isPDF ? (
                        <div style={{
                            background: 'var(--bg-secondary)',
                            padding: 'var(--spacing-2xl)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📑</div>
                            <h4 style={{ color: 'var(--text-secondary)' }}>PDF Preview</h4>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                                PDF preview would be rendered here using a PDF viewer library
                            </p>
                            <div style={{
                                background: 'var(--bg-primary)',
                                padding: 'var(--spacing-lg)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                textAlign: 'left'
                            }}>
                                <strong>Suggested Implementation:</strong>
                                <ul style={{ marginTop: 'var(--spacing-sm)', paddingLeft: 'var(--spacing-lg)' }}>
                                    <li>Use <code>react-pdf</code> library</li>
                                    <li>Or embed with <code>&lt;iframe&gt;</code></li>
                                    <li>Add zoom controls</li>
                                    <li>Page navigation</li>
                                </ul>
                            </div>
                        </div>
                    ) : isHTML ? (
                        <div style={{
                            background: 'var(--bg-secondary)',
                            padding: 'var(--spacing-lg)',
                            borderRadius: 'var(--radius-md)',
                            maxHeight: '600px',
                            overflow: 'auto'
                        }}>
                            <div style={{
                                background: 'var(--bg-primary)',
                                padding: 'var(--spacing-lg)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)'
                            }}>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    HTML content would be sanitized and rendered here
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            background: 'var(--bg-secondary)',
                            padding: 'var(--spacing-lg)',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                            maxHeight: '600px',
                            overflow: 'auto'
                        }}>
                            {content}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    justifyContent: 'flex-end'
                }}>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
