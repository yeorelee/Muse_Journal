// src/components/VoiceRecognition.jsx
import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function VoiceRecognition({ setEntryText }) {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    useEffect(() => {
        setEntryText(transcript);
    }, [transcript, setEntryText]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div>
            <button onClick={SpeechRecognition.startListening}>
                {listening ? 'Listening...' : 'Start Voice Input'}
            </button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
        </div>
    );
}

export default VoiceRecognition;
