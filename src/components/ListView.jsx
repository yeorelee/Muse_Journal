// src/components/ListView.jsx
import React, { useState } from 'react';
import FilterPanel from './FilterPanel';
import '../styles/ListView.css';

function ListView({ 
    journalEntries, 
    onSwitchView, 
    onReturnToGraph,
    onFilterByTimeRange,
    activeFilters,
    onEditEntry }) {
    // State for sorting options
    const [sortBy, setSortBy] = useState('newest');

    // Sort entries based on current sort selection
    const sortedEntries = [...journalEntries].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.timestamp) - new Date(a.timestamp);
        } else {
            return new Date(a.timestamp) - new Date(b.timestamp);
        }
    });

    // Handler for navigating to edit page
    const handleEntryClick = (entry) => {
        onEditEntry(entry);
    };

    function truncateHtml(html, maxLength) {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Get text content only
        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        if (textContent.length <= maxLength) {
            return html;
        }

        // If text is longer than maxLength, return a simplified version
        return textContent.substring(0, maxLength) + '...';
    }

    return (
        <div className="list-view-container">
            <div className="list-view-header">
                <button className="return-to-graph-btn" onClick={onSwitchView}>
                    <span className="arrow">&lt;</span>
                    return to graph
                </button>

                {activeFilters.emotion && (
                    <div className="active-filters">
                        <span>Filtered by: {activeFilters.emotion}</span>
                    </div>
                )}
            </div>

            <div className="list-content">
                <div className="entries-container">
                    <div className="list-controls">
                        <div className="sort-control">
                            <label>Sort by: </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                            </select>
                        </div>
                        <div className="entries-count">
                            {journalEntries.length} entries
                        </div>
                    </div>

                    {sortedEntries.length > 0 ? (
                        <div className="entries-list">
                            {sortedEntries.map(entry => (
                                <div
                                    key={entry.id}
                                    className="entry-card"
                                    onClick={() => handleEntryClick(entry)}
                                >
                                    <div className="entry-header">
                                        <div className="entry-date">{entry.date}</div>
                                        <div className={`emotion-tag emotion-${entry.emotion.toLowerCase()}`}>
                                            {entry.emotion}
                                        </div>
                                    </div>
                                    <div className="entry-content">
                                        <div className="entry-text"
                                             dangerouslySetInnerHTML={{
                                                 __html: entry.text.length > 200
                                                     ? truncateHtml(entry.text, 200)
                                                     : entry.text
                                             }}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-entries-message">
                            <p>No journal entries match your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListView;