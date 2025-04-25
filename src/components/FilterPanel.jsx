// src/components/FilterPanel.jsx
import React, { useState } from 'react';
import '../styles/FilterPanel.css';

function FilterPanel({ currentView, onViewChange }) {
    const [isGroupByExpanded, setIsGroupByExpanded] = useState(true);
    const [isTimeFrameExpanded, setIsTimeFrameExpanded] = useState(true);

    return (
        <div className="filter-panel">

            {/* View Toggle Section */}
            <div className="view-toggle-section">
                <p className="view-toggle-label"></p>
                <div className="view-toggle-buttons">
                    <button
                        className={`view-icon-btn ${currentView === 'GRAPH' ? 'active' : ''}`}
                        onClick={() => onViewChange('GRAPH')}
                        title="Graph View"
                    >
                        <img src="/graph-icon.png" alt="Graph View" />
                    </button>
                    <button
                        className={`view-icon-btn ${currentView === 'LIST' ? 'active' : ''}`}
                        onClick={() => onViewChange('LIST')}
                        title="List View"
                    >
                        <img src="/list-icon.png" alt="List View" />
                    </button>
                    <button
                        className={`view-icon-btn ${currentView === 'CALENDAR' ? 'active' : ''}`}
                        onClick={() => onViewChange('CALENDAR')}
                        title="Calendar View"
                    >
                        <img src="/calendar-icon.png" alt="Calendar View" />
                    </button>
                </div>
            </div>

            {/* Time Frame Section */}
            <div className="filter-group">
                <div className="filter-header" onClick={() => setIsTimeFrameExpanded(!isTimeFrameExpanded)}>
                    <p className="filter-label">Time Frame</p>
                    <button className="toggle-btn">{isTimeFrameExpanded ? '-' : '+'}</button>
                </div>
                {isTimeFrameExpanded && (
                    <div className="filter-content">
                        <label>
                            <input type="radio" name="time" defaultChecked /> All
                        </label>
                        <label>
                            <input type="radio" name="time" /> 1 month
                        </label>
                        <label>
                            <input type="radio" name="time" /> 3 months
                        </label>
                        <label>
                            <input type="radio" name="time" /> 1 year
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterPanel;