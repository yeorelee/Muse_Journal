// src/components/GraphView.jsx
import React from 'react';
import BubbleChartForce from './BubbleChartForce';
import FilterPanel from './FilterPanel';
import '../styles/GraphView.css';

// In GraphView.jsx
function GraphView({
                       journalEntries,
                       onSwitchView,
                       currentView,
                       onAddEntryClick,
                       onFilterByEmotion,
                       onFilterByTimeRange,
                       activeFilters
                   }) {
    return (
        <div className="graph-view-container">
            <div className="graph-content">
                <div className="filter-side">
                    <FilterPanel
                        currentView={currentView}
                        onViewChange={onSwitchView}
                        onFilterByTimeRange={onFilterByTimeRange}
                        activeFilters={activeFilters}
                    />
                </div>
                <div className="chart-side">
                    <BubbleChartForce
                        entries={journalEntries}
                        onAddEntryClick={onAddEntryClick}
                        onEmotionSelect={onFilterByEmotion}
                    />
                </div>
            </div>
        </div>
    );
}

export default GraphView;