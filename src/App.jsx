import React, { useState } from 'react';
import './index.css'; // global layout
import GraphView from './components/GraphView';
import ListView from './components/ListView';
import AddEntryModal from './components/AddEntryModal';

function App() {
    const [currentView, setCurrentView] = useState('GRAPH');
    const [journalEntries, setJournalEntries] = useState([
        // your sample entries...
    ]);

    const addEntry = (entryText, emotion, entryDate) => {
        const newEntry = {
            id: Date.now(),
            date: entryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            timestamp: entryDate, // Store the actual date object for sorting
            emotion,
            text: entryText,
        };
        setJournalEntries(prev => [...prev, newEntry]);
    };

    return (
        <div className="app-container">
            <div className="main-content">
                {currentView === 'GRAPH' && (
                    <div className="left-panel">
                        <GraphView
                            journalEntries={journalEntries}
                            onSwitchView={setCurrentView}
                            currentView={currentView}
                        />
                    </div>
                )}
                {currentView === 'LIST' && (
                    <div className="right-panel">
                        <ListView
                            journalEntries={journalEntries}
                            onReturnToGraph={() => setCurrentView('GRAPH')}
                        />
                    </div>
                )}
            </div>
            <AddEntryModal onAddEntry={addEntry} />
        </div>
    );
}

export default App;
