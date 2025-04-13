// src/components/AddEntryModal.jsx
import React, { useState, useEffect } from 'react';
import VoiceRecognition from './VoiceRecognition';
import '../styles/AddEntryModal.css';

function AddEntryModal({ onAddEntry }) {
    const [isOpen, setIsOpen] = useState(false);
    const [entryText, setEntryText] = useState('');
    const [emotion, setEmotion] = useState('Sad');
    const [charCount, setCharCount] = useState(0);
    const [date, setDate] = useState(formatDate(new Date()));

    // Update character count when text changes
    useEffect(() => {
        setCharCount(entryText.length);
    }, [entryText]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) setIsOpen(false);
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (entryText.trim() !== '') {
            onAddEntry(entryText, emotion, new Date(date));
            setEntryText('');
            setEmotion('Sad');
            setDate(formatDate(new Date()));
            setIsOpen(false);
        }
    };

    // Format date for input
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    return (
        <>
            <button className="add-entry-btn" onClick={() => setIsOpen(true)}>
                +
            </button>
            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>New Journal Entry</h2>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
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
                                <textarea
                                    id="entry-text"
                                    value={entryText}
                                    onChange={(e) => setEntryText(e.target.value)}
                                    placeholder="Write your thoughts here..."
                                    rows="6"
                                ></textarea>
                                <div className="char-count">{charCount} characters</div>
                            </div>

                            <div className="voice-recognition-container">
                                <VoiceRecognition setEntryText={setEntryText} />
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