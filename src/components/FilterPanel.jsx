// src/components/FilterPanel.jsx
import React from 'react';
import '../styles/FilterPanel.css';

function FilterPanel() {
    return (
        <div className="filter-panel">
            <h3>Filters</h3>
            <div className="filter-group">
                <p className="filter-label">Group by</p>
                <label>
                    <input type="radio" name="group" defaultChecked /> Emotion
                </label>
                <label>
                    <input type="radio" name="group" /> Ideas
                </label>
            </div>

            <div className="filter-group">
                <p className="filter-label">Time Frame</p>
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
        </div>
    );
}

export default FilterPanel;
