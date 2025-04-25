import React, { useState } from 'react';
import './index.css'; // global layout
import GraphView from './components/GraphView';
import ListView from './components/ListView';
import FullPageEditor from './components/FullPageEditor';
import './styles/AddEntryModal.css';

function App() {
    const [currentView, setCurrentView] = useState('GRAPH');
    const [journalEntries, setJournalEntries] = useState([/* entries */]);
    const [selectedEntryForEditing, setSelectedEntryForEditing] = useState(null);
    
    // For editor state (both new entries and editing)
    const [editorText, setEditorText] = useState('');
    const [editorEmotion, setEditorEmotion] = useState('Sad');
    const [editorDate, setEditorDate] = useState(new Date().toISOString().split('T')[0]);
    const [isCreatingNewEntry, setIsCreatingNewEntry] = useState(false);

    // Add filter states
    const [activeFilters, setActiveFilters] = useState({
        emotion: null,
        timeRange: null
    });

    // Handle emotion filtering and view switching
    const handleFilterByEmotion = (emotion) => {
        setActiveFilters(prev => ({...prev, emotion}));
        setCurrentView('LIST');
    };

    // Add time range filtering function
    const handleFilterByTimeRange = (timeRange) => {
        setActiveFilters(prev => ({...prev, timeRange}));
    };

    // Handle opening editor for a new entry
    const handleAddEntryClick = () => {
        // Reset editor state for a new entry
        setEditorText('');
        setEditorEmotion('Sad');
        setEditorDate(new Date().toISOString().split('T')[0]);
        setIsCreatingNewEntry(true);
        setSelectedEntryForEditing(null);
        setCurrentView('editor');
    };

    // Handle opening editor for editing an existing entry
    const handleEditEntry = (entry) => {
        setSelectedEntryForEditing(entry);
        // Set up editor state values from the entry
        setEditorText(entry.text);
        setEditorEmotion(entry.emotion);
        // Format date for input if timestamp exists
        const entryDate = entry.timestamp instanceof Date ?
            entry.timestamp.toISOString().split('T')[0] :
            new Date().toISOString().split('T')[0];
        setEditorDate(entryDate);
        setIsCreatingNewEntry(false);
        setCurrentView('editor');
    };

    // Handle saving an entry (both new and edited)
    const handleSaveEditorEntry = () => {
        if (isCreatingNewEntry) {
            // Create a new entry
            const newEntry = {
                id: Date.now(),
                date: new Date(editorDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                timestamp: new Date(editorDate),
                emotion: editorEmotion,
                text: editorText,
            };
            setJournalEntries(prev => [...prev, newEntry]);
        } else {
            // Update existing entry
            const updatedEntry = {
                ...selectedEntryForEditing,
                text: editorText,
                emotion: editorEmotion,
                date: new Date(editorDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                timestamp: new Date(editorDate)
            };

            setJournalEntries(prevEntries =>
                prevEntries.map(entry =>
                    entry.id === updatedEntry.id ? updatedEntry : entry
                )
            );
        }
        setCurrentView('LIST');
        setSelectedEntryForEditing(null);
        setIsCreatingNewEntry(false);
    };

    // Function to get filtered entries based on both emotion and time
    const getFilteredEntries = () => {
        return journalEntries.filter(entry => {
            // Apply emotion filter if set
            if (activeFilters.emotion && entry.emotion !== activeFilters.emotion) {
                return false;
            }

            // Apply time range filter if set
            if (activeFilters.timeRange) {
                const entryDate = new Date(entry.timestamp);
                const currentDate = new Date();

                switch (activeFilters.timeRange) {
                    case 'day':
                        return entryDate.toDateString() === currentDate.toDateString();
                    case 'week':
                        const weekAgo = new Date();
                        weekAgo.setDate(currentDate.getDate() - 7);
                        return entryDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date();
                        monthAgo.setMonth(currentDate.getMonth() - 1);
                        return entryDate >= monthAgo;
                    case 'year':
                        const yearAgo = new Date();
                        yearAgo.setFullYear(currentDate.getFullYear() - 1);
                        return entryDate >= yearAgo;
                    default:
                        return true;
                }
            }

            return true; // No filters applied
        });
    };

    // Add function to clear filters
    const clearFilters = () => {
        setActiveFilters({
            emotion: null,
            timeRange: null
        });
    };

    return (
        <div className="app-container">
            <div className="main-content">
                {currentView === 'GRAPH' && (
                    <div className="left-panel">
                        <GraphView
                            journalEntries={journalEntries}
                            onSwitchView={() => setCurrentView('LIST')}
                            currentView={currentView}
                            onAddEntryClick={handleAddEntryClick}
                            onFilterByEmotion={handleFilterByEmotion}
                            onFilterByTimeRange={handleFilterByTimeRange}
                            activeFilters={activeFilters}
                        />
                    </div>
                )}
                {currentView === 'LIST' && (
                    <div className="right-panel">
                        <ListView
                            journalEntries={getFilteredEntries()}
                            onSwitchView={() => {
                                setCurrentView('GRAPH');
                                clearFilters();
                            }}
                            onReturnToGraph={() => {
                                setCurrentView('GRAPH');
                                clearFilters();
                            }}
                            currentView={currentView}
                            onFilterByTimeRange={handleFilterByTimeRange}
                            activeFilters={activeFilters}
                            onEditEntry={handleEditEntry}
                        />
                    </div>
                )}
                {currentView === 'editor' && (
                    <div className="right-panel">
                        <FullPageEditor
                            entryText={editorText}
                            setEntryText={setEditorText}
                            emotion={editorEmotion}
                            setEmotion={setEditorEmotion}
                            date={editorDate}
                            setDate={setEditorDate}
                            onSave={handleSaveEditorEntry}
                            onClose={() => {
                                setCurrentView(selectedEntryForEditing ? 'LIST' : 'GRAPH');
                                setSelectedEntryForEditing(null);
                                setIsCreatingNewEntry(false);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Move "+" button outside of the modal */}
            {currentView !== 'editor' && (
                <button className="add-entry-btn" onClick={handleAddEntryClick}>
                    +
                </button>
            )}
        </div>
    );
}

export default App;