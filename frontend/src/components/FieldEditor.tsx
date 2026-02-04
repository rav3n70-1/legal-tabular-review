import React, { useState } from 'react';

interface FieldEditorProps {
    fields: string[];
    onFieldsChange: (fields: string[]) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ fields, onFieldsChange }) => {
    const [newField, setNewField] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const addField = () => {
        if (newField.trim() && !fields.includes(newField.trim())) {
            onFieldsChange([...fields, newField.trim()]);
            setNewField('');
        }
    };

    const removeField = (index: number) => {
        onFieldsChange(fields.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addField();
        }
    };

    // Predefined field suggestions
    const suggestions = [
        "Effective Date",
        "Expiration Date",
        "Governing Law",
        "Jurisdiction",
        "Parties Involved",
        "Termination Clause",
        "Payment Terms",
        "Confidentiality Period",
        "Liability Cap",
        "Force Majeure",
        "Dispute Resolution",
        "Notice Period",
        "Renewal Terms",
        "Indemnification",
        "Intellectual Property Rights"
    ].filter(s => !fields.includes(s));

    return (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-md)'
            }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>🎯 Extraction Fields</h3>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.875rem' }}
                >
                    {isOpen ? '✖️ Close Editor' : '✏️ Edit Fields'}
                </button>
            </div>

            {isOpen && (
                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)'
                        }}>
                            Add Custom Field
                        </label>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <input
                                type="text"
                                value={newField}
                                onChange={e => setNewField(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="e.g., Contract Value"
                                className="input"
                                style={{ flex: 1 }}
                            />
                            <button
                                onClick={addField}
                                className="btn btn-primary"
                                disabled={!newField.trim()}
                            >
                                ➕ Add
                            </button>
                        </div>
                    </div>

                    {suggestions.length > 0 && (
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: 'var(--spacing-sm)',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)'
                            }}>
                                Quick Add (Common Fields)
                            </label>
                            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                                {suggestions.slice(0, 8).map(suggestion => (
                                    <button
                                        key={suggestion}
                                        onClick={() => onFieldsChange([...fields, suggestion])}
                                        style={{
                                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            fontSize: '0.8125rem',
                                            transition: 'var(--transition)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--primary)';
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'var(--bg-primary)';
                                            e.currentTarget.style.color = 'var(--text-primary)';
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                        }}
                                    >
                                        + {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                {fields.map((f, i) => (
                    <div key={i} style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)'
                    }}>
                        {f}
                        {isOpen && (
                            <button
                                onClick={() => removeField(i)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
