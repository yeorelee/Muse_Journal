import React, { useState } from 'react';
import './index.css'; // global layout
import GraphView from './components/GraphView';
import ListView from './components/ListView';
import AddEntryModal from './components/AddEntryModal';
import FullPageEditor from './components/FullPageEditor';

function App() {
    const [currentView, setCurrentView] = useState('GRAPH');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [journalEntries, setJournalEntries] = useState([/* entries */]);
    const [selectedEntryForEditing, setSelectedEntryForEditing] = useState(null);

    // For editor temporary state
    const [editorText, setEditorText] = useState('');
    const [editorEmotion, setEditorEmotion] = useState('');
    const [editorDate, setEditorDate] = useState('');

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
        // Note: We don't switch views when changing time range
    };

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
        setCurrentView('editor');
    };

    // Handle saving edited entry
    const handleSaveEditorEntry = () => {
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
        setCurrentView('LIST');
        setSelectedEntryForEditing(null);
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

    // Update the return statement to pass these new props
    return (
        <div className="app-container">
            <div className="main-content">
                {currentView === 'GRAPH' && (
                    <div className="left-panel">
                        <GraphView
                            journalEntries={journalEntries}
                            onSwitchView={() => setCurrentView('LIST')}
                            currentView={currentView}
                            onAddEntryClick={() => setIsAddModalOpen(true)}
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
                {currentView === 'editor' && selectedEntryForEditing && (
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
                                setCurrentView('LIST');
                                setSelectedEntryForEditing(null);
                            }}
                        />
                    </div>
                )}
            </div>

            <AddEntryModal
                onAddEntry={addEntry}
                isOpen={isAddModalOpen}
                setIsOpen={setIsAddModalOpen}
            />
        </div>
    );
}

export default App;