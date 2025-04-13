// src/components/GraphView.jsx
import React from 'react';
import BubbleChartForce from './BubbleChartForce';
import FilterPanel from './FilterPanel';
import '../styles/GraphView.css';

function GraphView({ journalEntries, onSwitchView, currentView }) {
    return (
        <div className="graph-view-container">
            <div className="graph-content">
                <div className="filter-side">
                    <FilterPanel
                        currentView={currentView}
                        onViewChange={onSwitchView}
                    />
                </div>
                <div className="chart-side">
                    <BubbleChartForce entries={journalEntries} />
                </div>
            </div>
        </div>
    );
}

export default GraphView;