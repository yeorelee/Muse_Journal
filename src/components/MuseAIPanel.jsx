// src/components/MuseAIPanel.jsx
import React, { useState, useEffect } from 'react';
import '../styles/MuseAIPanel.css';

function MuseAIPanel({ isOpen, onClose, editorContent, onInsertResponse }) {
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');
    const [showResponse, setShowResponse] = useState(false);

    // Predefined suggestions based on journal content
    const suggestions = [
        "Expand on my feelings described here",
        "Suggest journaling prompts based on this entry",
        "Summarize the key emotions in this entry",
        "Provide a different perspective on this situation",
        "Help me reflect on how this connects to my past experiences"
    ];

    // Reset when panel is closed
    useEffect(() => {
        if (!isOpen) {
            setShowResponse(false);
            setQuestion('');
            setAiResponse('');
            setError('');
        }
    }, [isOpen]);

    // Function to fetch AI response
    const fetchAIResponse = async (prompt) => {
        setIsLoading(true);
        setQuestion(prompt);
        setShowResponse(true);
        setError('');

        try {
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
            if (!apiKey) {
                throw new Error('API key is missing in .env file');
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Muse, a concise AI journaling assistant. Follow these guidelines:\n' +
                                '1. Keep responses very short (under 100 words)\n' +
                                '2. Begin by empathizing with the writer\'s entry\n' +
                                '3. End with a thoughtful follow-up question to prompt further reflection\n' +
                                '4. Focus on the writer\'s emotions and experiences'
                        },
                        {
                            role: 'user',
                            content: `Here is my journal entry: "${editorContent}"\n\nNow, please ${prompt.toLowerCase()}.`
                        }
                    ],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            // Log the raw response for debugging
            const rawResponse = await response.text();
            console.log('Raw API response:', rawResponse);

            // Parse the response text back to JSON
            const data = rawResponse ? JSON.parse(rawResponse) : {};

            if (!response.ok) {
                console.error('Error details:', data);
                throw new Error(`API Error: ${data.error?.message || response.statusText}`);
            }

            // Log the processed response
            console.log('Processed response:', data);

            // Check if the response has the expected structure
            if (data.choices && data.choices[0] && data.choices[0].message) {
                setAiResponse(data.choices[0].message.content.trim());
            } else {
                throw new Error('Unexpected API response format');
            }
        } catch (err) {
            console.error('Error calling OpenAI API:', err);
            setError(`Error: ${err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

// Add this function to your component - will help diagnose issues
    const testApiConnection = async () => {
        try {
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const data = await response.json();
            console.log('API Connection Test:', data);
            alert(response.ok ? 'Connection successful' : `Connection failed: ${data.error?.message}`);
        } catch (err) {
            console.error('Connection Test Error:', err);
            alert('Connection test failed: ' + err.message);
        }
    };

    // Function to handle inserting the response into the editor
    const handleInsertResponse = () => {
        if (aiResponse) {
            onInsertResponse(aiResponse);
            onClose();
        }
    };

    // Handle new question
    const handleNewQuestion = () => {
        setShowResponse(false);
        setQuestion('');
    };

    return (
        <div className={`muse-panel ${isOpen ? 'open' : ''}`}>
            <div className="muse-panel-header">
                <h3>Muse AI</h3>
                <button className="muse-close-btn" onClick={onClose}>×</button>
            </div>

            <div className="muse-panel-content">
                {error && <div className="error-message">{error}</div>}

                {!showResponse ? (
                    <div className="muse-suggestions">
                        <p className="suggestion-intro">
                            What would you like help with in your journal entry?
                        </p>
                        <ul>
                            {suggestions.map((suggestion, index) => (
                                <li key={index}>
                                    <button
                                        className="suggestion-btn"
                                        onClick={() => fetchAIResponse(suggestion)}
                                    >
                                        {suggestion}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="muse-response">
                        <div className="response-question">
                            <strong>{question}</strong>
                        </div>

                        {isLoading ? (
                            <div className="muse-loading">
                                <div className="loading-spinner"></div>
                                <p>Thinking...</p>
                            </div>
                        ) : (
                            <div className="response-answer">
                                <p>{aiResponse}</p>
                                <div className="response-actions">
                                    <button
                                        className="secondary-btn"
                                        onClick={handleNewQuestion}
                                    >
                                        Ask something else
                                    </button>
                                    <button
                                        className="primary-btn"
                                        onClick={handleInsertResponse}
                                    >
                                        Insert into journal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MuseAIPanel;