// src/components/BubbleChart.jsx
import React from 'react';
import '../styles/BubbleChart.css';

function BubbleChart({ entries }) {
    // Count entries by emotion
    const emotionCounts = entries.reduce((acc, entry) => {
        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
        return acc;
    }, {});

    // Prepare bubble data
    const bubbles = Object.entries(emotionCounts).map(([emotion, count], index) => ({
        emotion,
        count,
        radius: Math.sqrt(count) * 20,
    }));

    return (
        <div className="bubble-chart-container">
            {bubbles.map((bubble, i) => (
                <div
                    key={i}
                    className="bubble"
                    style={{
                        width: `${bubble.radius * 2}px`,
                        height: `${bubble.radius * 2}px`,
                        lineHeight: `${bubble.radius * 2}px`,
                    }}
                >
          <span className="bubble-text">
            {bubble.emotion} <br />
              {bubble.count} entries
          </span>
                </div>
            ))}
        </div>
    );
}

export default BubbleChart;
