import React, { useState } from 'react';

interface FilterPanelProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    confidenceMin: number;
    searchTerm: string;
    showOnlyHighConfidence: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        confidenceMin: 0,
        searchTerm: '',
        showOnlyHighConfidence: false
    });

    const updateFilter = (updates: Partial<FilterState>) => {
        const newFilters = { ...filters, ...updates };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const defaultFilters: FilterState = {
            confidenceMin: 0,
            searchTerm: '',
            showOnlyHighConfidence: false
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const activeFilterCount = [
        filters.confidenceMin > 0,
        filters.searchTerm.length > 0,
        filters.showOnlyHighConfidence
    ].filter(Boolean).length;

    return (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-md)'
            }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>
                    🔍 Filters
                    {activeFilterCount > 0 && (
                        <span className="badge badge-info" style={{ marginLeft: 'var(--spacing-sm)' }}>
                            {activeFilterCount} active
                        </span>
                    )}
                </h3>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.875rem' }}
                >
                    {isOpen ? '▲ Hide Filters' : '▼ Show Filters'}
                </button>
            </div>

            {isOpen && (
                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gap: 'var(--spacing-md)'
                }}>
                    {/* Search */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)'
                        }}>
                            🔎 Search in Results
                        </label>
                        <input
                            type="text"
                            value={filters.searchTerm}
                            onChange={e => updateFilter({ searchTerm: e.target.value })}
                            placeholder="Search values, citations..."
                            className="input"
                        />
                    </div>

                    {/* Confidence Filter */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)'
                        }}>
                            📊 Minimum Confidence: {filters.confidenceMin}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={filters.confidenceMin}
                            onChange={e => updateFilter({ confidenceMin: parseInt(e.target.value) })}
                            style={{ width: '100%' }}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            marginTop: 'var(--spacing-xs)'
                        }}>
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)'
                        }}>
                            ⚡ Quick Filters
                        </label>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: 'var(--spacing-sm)',
                            background: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)'
                        }}>
                            <input
                                type="checkbox"
                                checked={filters.showOnlyHighConfidence}
                                onChange={e => updateFilter({ showOnlyHighConfidence: e.target.checked })}
                                style={{ marginRight: 'var(--spacing-sm)' }}
                            />
                            <span style={{ fontSize: '0.875rem' }}>Show only high confidence (≥80%)</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                        <button
                            onClick={resetFilters}
                            className="btn btn-secondary"
                            disabled={activeFilterCount === 0}
                        >
                            🔄 Reset Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
