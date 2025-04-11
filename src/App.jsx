// src/App.jsx
import React, { useState } from 'react';
import GraphView from './components/GraphView';
import ListView from './components/ListView';
import AddEntryModal from './components/AddEntryModal';
import './index.css';

function App() {
    // currentView: 'GRAPH' or 'LIST'
    const [currentView, setCurrentView] = useState('GRAPH');

    // Sample journal entries
    const [journalEntries, setJournalEntries] = useState([
        {
            id: 1,
            date: 'March 7th, 2025',
            emotion: 'Sad',
            text: 'Noticed a lingering worry about upcoming exam results...',
        },
        {
            id: 2,
            date: 'March 12th, 2025',
            emotion: 'Angry',
            text: 'Felt frustration over short deadlines at work...',
        },
        {
            id: 3,
            date: 'March 20th, 2025',
            emotion: 'Joyous',
            text: 'Spent time with friends and felt a refreshing sense of relief...',
        },
        {
            id: 4,
            date: 'April 1st, 2025',
            emotion: 'Anxious',
            text: 'Worried about balancing extracurricular commitments...',
        },
        // Add more entries as needed
    ]);

    // Handler to add a new entry
    const addEntry = (entryText, emotion) => {
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            emotion,
            text: entryText,
        };
        setJournalEntries(prev => [...prev, newEntry]);
    };

    return (
        <div className="app-container">
            {currentView === 'GRAPH' && (
                <GraphView
                    journalEntries={journalEntries}
                    onSwitchView={() => setCurrentView('LIST')}
                />
            )}
            {currentView === 'LIST' && (
                <ListView
                    journalEntries={journalEntries}
                    onReturnToGraph={() => setCurrentView('GRAPH')}
                />
            )}
            <AddEntryModal onAddEntry={addEntry} />
        </div>
    );
}

export default App;
