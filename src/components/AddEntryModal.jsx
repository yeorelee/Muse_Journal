// src/components/AddEntryModal.jsx - Modified
import React, { useState, useEffect } from 'react';
import VoiceRecognition from './VoiceRecognition';
import FullPageEditor from './FullPageEditor';
import '../styles/AddEntryModal.css';

function AddEntryModal({ onAddEntry, isOpen, setIsOpen }) {
    const [entryText, setEntryText] = useState('');
    const [emotion, setEmotion] = useState('Sad');
    const [charCount, setCharCount] = useState(0);
    const [date, setDate] = useState(formatDate(new Date()));
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Update character count when text changes
    useEffect(() => {
        setCharCount(entryText.length);
    }, [entryText]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen && !isFullScreen) setIsOpen(false);
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, setIsOpen, isFullScreen]);

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (entryText.trim() !== '') {
            onAddEntry(entryText, emotion, new Date(date));
            setEntryText('');
            setEmotion('Sad');
            setDate(formatDate(new Date()));
            setIsOpen(false);
            setIsFullScreen(false);
        }
    };

    // Format date for input
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Toggle to full-screen editor
    const handleExpandEditor = () => {
        setIsFullScreen(true);
    };

    // Minimize to compact editor
    const handleMinimizeEditor = () => {
        setIsFullScreen(false);
    };

    return (
        <>
            <button className="add-entry-btn" onClick={() => {
                setIsOpen(true);
                setIsFullScreen(true);
            }}>
                +
            </button>
            {isOpen && isFullScreen && (
                <FullPageEditor
                    entryText={entryText}
                    setEntryText={setEntryText}
                    emotion={emotion}
                    setEmotion={setEmotion}
                    date={date}
                    setDate={setDate}
                    onSave={handleSubmit}
                    onClose={() => {
                        setIsOpen(false);
                        setIsFullScreen(false);
                    }}
                />
            )}

            {isOpen && !isFullScreen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>New Journal Entry</h2>
                            <div className="modal-header-actions">
                                <button
                                    className="minimize-btn"
                                    onClick={handleMinimizeEditor}
                                    title="Minimize to compact editor"
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M3,3H9V5H5V9H3V3M21,3V9H19V5H15V3H21M3,21V15H5V19H9V21H3M19,21H15V19H19V15H21V21Z"/>
                                    </svg>
                                </button>
                                <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group date-picker">
                                <label htmlFor="entry-date">Date</label>
                                <input
                                    type="date"
                                    id="entry-date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emotion-select">How are you feeling?</label>
                                <select
                                    id="emotion-select"
                                    value={emotion}
                                    onChange={(e) => setEmotion(e.target.value)}
                                >
                                    <option value="Sad">Sad</option>
                                    <option value="Joyous">Joyous</option>
                                    <option value="Anxious">Anxious</option>
                                    <option value="Angry">Angry</option>
                                    <option value="Disgusted">Disgusted</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="entry-text">What's on your mind?</label>
                                <div className="textarea-container">
                                    <textarea
                                        id="entry-text"
                                        value={entryText}
                                        onChange={(e) => setEntryText(e.target.value)}
                                        placeholder="Write your thoughts here..."
                                        rows="6"
                                    ></textarea>
                                    <div className="textarea-controls">
                                        <div className="char-count">{charCount} characters</div>
                                        <VoiceRecognition setEntryText={setEntryText} />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsOpen(false)}>Cancel</button>
                                <button type="submit" className="save-btn" disabled={entryText.trim() === ''}>Save Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddEntryModal;