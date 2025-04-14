// src/components/VoiceRecognition.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/VoiceRecognition.css';

function VoiceRecognition({ setEntryText }) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);

    // Initialize speech recognition once
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Speech recognition not supported');
            return;
        }

        // Create recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        // Handle cleanup
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore stop errors during cleanup
                }
            }
        };
    }, []);

    // Configure event handlers when recognition status changes
    useEffect(() => {
        if (!recognitionRef.current) return;

        recognitionRef.current.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            // Process all results
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            // Only update with final transcripts to avoid jumps
            if (finalTranscript) {
                setEntryText(prev => {
                    // Add space if needed
                    const needsSpace = prev && !prev.endsWith(' ');
                    return prev + (needsSpace ? ' ' : '') + finalTranscript;
                });
            }
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            setError(event.error === 'not-allowed' ?
                'Microphone access denied' : 'Recognition error');
        };

        recognitionRef.current.onend = () => {
            // If still supposed to be listening, try restarting
            if (isListening) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    setIsListening(false);
                }
            }
        };
    }, [isListening, setEntryText]);

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            recognitionRef.current?.stop();
        } else {
            setError('');
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                setError('Failed to start recording');
            }
        }
    };

    return (
        <button
            type="button"
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={isListening ? "Stop recording" : "Start recording"}
        >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.35 9.65V11.5C4.35 15.57 7.78 19 11.85 19C15.92 19 19.35 15.57 19.35 11.5V9.65"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isListening && <span className="pulse-dot"></span>}
            {error && <span className="error-tooltip">{error}</span>}
        </button>
    );
}

export default VoiceRecognition;