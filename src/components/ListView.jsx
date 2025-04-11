// src/components/ListView.jsx
import React from 'react';
import '../styles/ListView.css';

function ListView({ journalEntries, onReturnToGraph }) {
    return (
        <div className="list-view-container">
            {/* Top bar with a return/back button */}
            <div className="list-view-header">
                <button onClick={onReturnToGraph} className="return-btn">← return to graph</button>
                <div className="spacer"></div>
                {/* Example icons or placeholders */}
                <div className="icons-area">
                    <i className="calendar-icon">📅</i>
                    <i className="filter-icon">⚙️</i>
                </div>
            </div>

            {/* A heading or optional summary */}
            <div className="suggestion-banner">
                <h2>Your Entries</h2>
            </div>

            {/* Entry cards in a grid layout */}
            <div className="entries-grid">
                {journalEntries.map(entry => (
                    <div key={entry.id} className="entry-card">
                        <h3>{entry.date}</h3>
                        <p>{entry.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListView;
