// src/components/AddEntryModal.jsx
import React, { useState } from 'react';
import VoiceRecognition from './VoiceRecognition';
import '../styles/AddEntryModal.css';

function AddEntryModal({ onAddEntry }) {
    const [isOpen, setIsOpen] = useState(false);
    const [entryText, setEntryText] = useState('');
    const [emotion, setEmotion] = useState('Sad');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (entryText.trim() !== '') {
            onAddEntry(entryText, emotion);
            setEntryText('');
            setIsOpen(false);
        }
    };

    return (
        <>
            <button className="add-entry-btn" onClick={() => setIsOpen(true)}>
                +
            </button>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add a Journal Entry</h2>
                        <form onSubmit={handleSubmit}>
              <textarea
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  placeholder="What's on your mind?"
              ></textarea>
                            {/* Optional voice input */}
                            <VoiceRecognition setEntryText={setEntryText} />

                            <label>
                                Emotion:
                                <select value={emotion} onChange={(e) => setEmotion(e.target.value)}>
                                    <option value="Sad">Sad</option>
                                    <option value="Joyous">Joyous</option>
                                    <option value="Anxious">Anxious</option>
                                    <option value="Angry">Angry</option>
                                    <option value="Disgusted">Disgusted</option>
                                </select>
                            </label>
                            <div className="modal-actions">
                                <button type="submit">Save Entry</button>
                                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddEntryModal;
