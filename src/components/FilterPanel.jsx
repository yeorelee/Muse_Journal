// src/components/FilterPanel.jsx
import React, { useState } from 'react';
import '../styles/FilterPanel.css';

function FilterPanel({ currentView, onViewChange, onFilterByTimeRange, activeFilters }) {
    const [isGroupByExpanded, setIsGroupByExpanded] = useState(true);
    const [isTimeFrameExpanded, setIsTimeFrameExpanded] = useState(true);

    // Handle time range filter selection
    const handleTimeRangeChange = (timeRange) => {
        onFilterByTimeRange(timeRange);
    };

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
                            <input 
                                type="radio" 
                                name="time" 
                                checked={activeFilters.timeRange === null} 
                                onChange={() => handleTimeRangeChange(null)} 
                            /> All
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="time" 
                                checked={activeFilters.timeRange === 'week'}
                                onChange={() => handleTimeRangeChange('week')} 
                            /> This Week
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="time" 
                                checked={activeFilters.timeRange === 'month'}
                                onChange={() => handleTimeRangeChange('month')} 
                            /> This Month
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="time" 
                                checked={activeFilters.timeRange === 'year'}
                                onChange={() => handleTimeRangeChange('year')} 
                            /> This Year
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterPanel;