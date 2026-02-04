import React from 'react';

interface ComparisonTableProps {
    questions: string[];
    documents: {
        id: string;
        filename: string;
        answers: {
            question_text: string;
            value: string;
            confidence: number;
            citation?: string;
        }[];
    }[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ questions, documents }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="table">
                <thead>
                    <tr>
                        <th style={{ minWidth: '200px' }}>Field / Question</th>
                        {documents.map(doc => (
                            <th key={doc.id} style={{ minWidth: '300px' }}>{doc.filename}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {questions.map(q => (
                        <tr key={q}>
                            <td>
                                <strong style={{ color: 'var(--text-primary)' }}>{q}</strong>
                            </td>
                            {documents.map(doc => {
                                const ans = doc.answers.find(a => a.question_text === q);
                                return (
                                    <td key={`${doc.id}-${q}`}>
                                        {ans ? (
                                            <div>
                                                <div style={{
                                                    marginBottom: 'var(--spacing-sm)',
                                                    color: 'var(--text-primary)',
                                                    fontWeight: 500
                                                }}>
                                                    {ans.value}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--spacing-sm)',
                                                    marginBottom: ans.citation ? 'var(--spacing-sm)' : 0
                                                }}>
                                                    <span className={`badge ${ans.confidence > 0.8 ? 'badge-success' :
                                                            ans.confidence > 0.5 ? 'badge-warning' :
                                                                'badge-danger'
                                                        }`}>
                                                        {(ans.confidence * 100).toFixed(0)}% confidence
                                                    </span>
                                                </div>
                                                {ans.citation && (
                                                    <details style={{ marginTop: 'var(--spacing-sm)' }}>
                                                        <summary style={{
                                                            cursor: 'pointer',
                                                            color: 'var(--primary)',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500
                                                        }}>
                                                            📄 View Citation
                                                        </summary>
                                                        <div style={{
                                                            marginTop: 'var(--spacing-sm)',
                                                            padding: 'var(--spacing-sm)',
                                                            background: 'var(--bg-secondary)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            fontSize: '0.8125rem',
                                                            color: 'var(--text-secondary)',
                                                            fontStyle: 'italic',
                                                            borderLeft: '3px solid var(--primary)'
                                                        }}>
                                                            {ans.citation}
                                                        </div>
                                                    </details>
                                                )}
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--gray-400)' }}>—</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
