// src/components/BubbleChartForce.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import '../styles/BubbleChart.css';

function BubbleChartForce({ entries, onAddEntryClick, onEmotionSelect }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [selectedBubble, setSelectedBubble] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const animationRef = useRef(null);
    const nodesRef = useRef([]);
    const bubblesRef = useRef(null);

    // Responsive sizing
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!entries.length || !svgRef.current) return;
        const { width, height } = dimensions;

        // Clean up any previous animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        // Group entries by emotion
        const emotionGroups = d3.group(entries, d => d.emotion);

        // Transform into nodes for visualization
        const nodes = Array.from(emotionGroups, ([emotion, items]) => ({
            id: emotion,
            emotion,
            count: items.length,
            entries: items,
            r: Math.sqrt(items.length) * 20 + Math.max(150, (200 / emotionGroups.size)),
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
        }));

        nodesRef.current = nodes;

        // Clear previous SVG content
        d3.select(svgRef.current).selectAll('*').remove();

        // Create the SVG and group
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        const g = svg.append('g')
            .attr('transform', `translate(${width/2}, ${height/2})`);

        // Create bubble groups
        const bubbles = g.selectAll('.bubble')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'bubble')
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                // Instead of just selecting the bubble, navigate to the filtered list view
                onEmotionSelect(d.emotion);
                event.stopPropagation();
            });

        bubblesRef.current = bubbles;

        // Add circles to the bubble groups
        bubbles.append('circle')
            .attr('r', d => d.r)
            .style('fill', d => getEmotionColor(d.emotion))
            .style('fill-opacity', 1)
            .style('stroke', d => d3.rgb(getEmotionColor(d.emotion)).darker(0.5))
            .style('stroke-width', 2);

        // Add emotion labels with EB Garamond font
        bubbles.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.2em')
            .style('font-size', d => `${Math.max(d.r / 5, 18)}px`)
            .style('font-weight', 'bold')
            .style('font-family', '"EB Garamond", serif')
            .style('fill', '#000000')
            .style('pointer-events', 'none')
            .text(d => d.emotion);

        // Add count labels with EB Garamond font
        bubbles.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '1.2em')
            .style('font-size', d => `${Math.max(d.r / 6, 14)}px`)
            .style('font-family', '"EB Garamond", serif')
            .style('fill', '#000000')
            .style('pointer-events', 'none')
            .text(d => `${d.count} entries`);

        // Improved physics parameters
        const collisionDampening = 0.9;    // Less bounce
        const centerForce = 0.02;          // Stronger center attraction
        const mouseForce = 0.05;           // More subtle mouse effect
        const drag = 0.8;                  // Higher drag (lower value = more friction)
        const maxVelocity = 1.5;             // Prevent extreme velocities
        const bufferDistance = 15;         // Increased buffer between bubbles
        const boundaryPadding = 50;        // Padding from SVG edges
        let mouseX = 0;
        let mouseY = 0;
        let isMouseOver = false;

        // Mouse interaction
        svg.on('mousemove', (event) => {
            const [x, y] = d3.pointer(event, g.node());
            mouseX = x;
            mouseY = y;
            isMouseOver = true;
        });

        svg.on('mouseleave', () => {
            isMouseOver = false;
        });

        // Initialize positions in a circle
        nodes.forEach((node, i) => {
            const angle = (i / nodes.length) * 2 * Math.PI;
            const radius = 100;
            node.x = Math.cos(angle) * radius;
            node.y = Math.sin(angle) * radius;
        });

        // Animation loop with physics simulation
        function animate() {
            // Apply forces and update positions
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];

                // Center force
                node.vx += -node.x * centerForce;
                node.vy += -node.y * centerForce;

                // Mouse attraction if mouse is over
                if (isMouseOver) {
                    const dx = mouseX - node.x;
                    const dy = mouseY - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Only attract if within reasonable distance
                    if (distance < 300) {
                        const strength = mouseForce / (1 + distance * 0.05);
                        node.vx += dx * strength;
                        node.vy += dy * strength;
                    }
                }

                // Boundary constraints to keep bubbles on screen
                const maxX = width / 2 - node.r - boundaryPadding;
                const maxY = height / 2 - node.r - boundaryPadding;

                // Apply boundary forces
                if (Math.abs(node.x) > maxX) {
                    const direction = node.x > 0 ? -1 : 1;
                    const overflow = Math.abs(node.x) - maxX;
                    node.vx += direction * overflow * 0.05;
                    node.x = maxX * (node.x > 0 ? 1 : -1);
                }

                if (Math.abs(node.y) > maxY) {
                    const direction = node.y > 0 ? -1 : 1;
                    const overflow = Math.abs(node.y) - maxY;
                    node.vy += direction * overflow * 0.05;
                    node.y = maxY * (node.y > 0 ? 1 : -1);
                }

                // Apply drag
                node.vx *= drag;
                node.vy *= drag;

                // Update position
                node.x += node.vx;
                node.y += node.vy;
            }

            // Collision detection and resolution
            for (let i = 0; i < nodes.length; i++) {
                const nodeA = nodes[i];

                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeB = nodes[j];

                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = nodeA.r + nodeB.r + 5; // 5px buffer

                    if (distance < minDistance) {
                        const nx = dx / distance;
                        const ny = dy / distance;
                        const adjustment = (minDistance - distance) * 0.5;

                        nodeA.x -= nx * adjustment * collisionDampening;
                        nodeA.y -= ny * adjustment * collisionDampening;
                        nodeB.x += nx * adjustment * collisionDampening;
                        nodeB.y += ny * adjustment * collisionDampening;
                    }
                }
            }

            // Update DOM
            bubbles.attr('transform', d => `translate(${d.x},${d.y})`);

            // Continue animation
            animationRef.current = requestAnimationFrame(animate);
        }

        // Start animation
        animate();

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [entries, dimensions]);

    return (
        <div className="bubble-chart-container" ref={containerRef}>
            {entries.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-message">
                        <h2>No journal entries yet</h2>
                        <p>Start your journey by adding your first entry</p>
                        <div
                            className="arrow-container clickable"
                            onClick={onAddEntryClick}
                            title="Add your first entry"
                        >
                            <div className="arrow-down"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <svg ref={svgRef} className="bubble-chart" />
                    {selectedBubble && (
                        <div className="emotion-details">
                            <h3>{selectedBubble.emotion}</h3>
                            <p>{selectedBubble.count} entries</p>
                            <button onClick={() => setSelectedBubble(null)}>Close</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function getEmotionColor(emotion) {
    switch(emotion) {
        case 'Sad': return '#A0C4FF';
        case 'Joyous': return '#FDFFB6';
        case 'Anxious': return '#BDB2FF';
        case 'Angry': return '#FFADAD';
        case 'Disgusted': return '#CAFFBF';
        default: return '#ccc';
    }
}

export default BubbleChartForce;