// src/components/GraphView.jsx
import React from 'react';
import BubbleChart from './BubbleChart';
import FilterPanel from './FilterPanel';
import '../styles/GraphView.css';

function GraphView({ journalEntries, onSwitchView }) {
    return (
        <div className="graph-view-container">
            {/* Optional top banner with AI suggestions */}
            <div className="banner">
                <p>
                    Your recent entries reveal stressed thoughts about performance and success.
                    Consider breaking down study goals, setting realistic expectations, and practicing self-compassion.
                </p>
            </div>

            {/* Bubble chart & Filter layout */}
            <div className="graph-content">
                <FilterPanel />
                <BubbleChart entries={journalEntries} />
            </div>

            {/* A button or link to switch to the list view */}
            <button className="view-switch-btn" onClick={onSwitchView}>
                View Entries
            </button>
        </div>
    );
}

export default GraphView;
