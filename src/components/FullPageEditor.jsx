// src/components/FullPageEditor.jsx
import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import FontFamily from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import CodeBlock from '@tiptap/extension-code-block';
import VoiceRecognition from './VoiceRecognition';
import '../styles/FullPageEditor.css';
import MuseAIPanel from './MuseAIPanel';
import logo from '/logo.png'; // Import logo

function FullPageEditor({
                            entryText,
                            setEntryText,
                            emotion,
                            setEmotion,
                            date,
                            setDate,
                            onSave,
                            onClose
                        }) {
    const [charCount, setCharCount] = useState(entryText.length);
    const [wordCount, setWordCount] = useState(entryText.split(/\s+/).filter(word => word !== '').length);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isMusePanelOpen, setIsMusePanelOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                linkOnPaste: true,
                HTMLAttributes: {
                    rel: 'noopener noreferrer',
                    target: '_blank',
                }
            }),
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Image,
            Placeholder.configure({
                placeholder: 'Start writing your thoughts...',
            }),
            Typography,
            Highlight,
            TaskList,
            TaskItem.configure({
                nested: true
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            CodeBlock,
        ],
        content: entryText,
        onUpdate: ({ editor }) => {
            const text = editor.getText();
            setEntryText(editor.getHTML());
            setCharCount(text.length);
            setWordCount(text.split(/\s+/).filter(word => word !== '').length);
        },
        autofocus: true
    });

    const handleSave = () => {
        onSave();
    };

    // Replace existing askMuseQuestion function
    const toggleMusePanel = () => {
        setIsMusePanelOpen(!isMusePanelOpen);
    };

    // Add the insertMuseResponse function
    const insertMuseResponse = (html) => {
        editor.chain().focus().insertContent(html).run();
    };


    const addImage = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className={`full-page-editor ${isFocusMode ? 'focus-mode' : ''}`}>
            <div className={`editor-header ${isFocusMode ? 'minimized' : ''}`}>
                <div className="header-left">
                    <img src={logo} alt="Muse Logo" className="editor-logo" />
                    <h1>Journal Entry</h1>
                </div>
                <div className="header-actions">
                    <button className="close-editor-btn" onClick={onClose}>×</button>
                </div>
            </div>

            <div className={`editor-toolbar ${isFocusMode ? 'minimized' : ''}`}>
                <div className="toolbar-group">
                    <div className="format-buttons">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
                            title="Heading 1"
                        >
                            H1
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
                            title="Heading 2"
                        >
                            H2
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
                            title="Heading 3"
                        >
                            H3
                        </button>
                    </div>

                    <div className="format-buttons">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'active' : ''}
                            title="Bold"
                        >
                            B
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'active' : ''}
                            title="Italic"
                        >
                            I
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={editor.isActive('underline') ? 'active' : ''}
                            title="Underline"
                        >
                            U
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? 'active' : ''}
                            title="Strike"
                        >
                            S
                        </button>
                    </div>

                    <div className="format-buttons">
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={editor.isActive('bulletList') ? 'active' : ''}
                            title="Bullet List"
                        >
                            •
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={editor.isActive('orderedList') ? 'active' : ''}
                            title="Numbered List"
                        >
                            1.
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                            className={editor.isActive('taskList') ? 'active' : ''}
                            title="Task List"
                        >
                            ☑
                        </button>
                    </div>

                    <div className="format-buttons">
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
                            title="Align Left"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
                            title="Align Center"
                        >
                            ↔
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
                            title="Align Right"
                        >
                            →
                        </button>
                    </div>

                    <div className="format-buttons font-buttons">
                        <button
                            onClick={() => editor.chain().focus().setFontFamily('Inter').run()}
                            className={editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'active' : ''}
                            title="Sans-serif"
                        >
                            Sans
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setFontFamily('EB Garamond').run()}
                            className={editor.isActive('textStyle', { fontFamily: 'EB Garamond' }) ? 'active' : ''}
                            title="Serif"
                        >
                            Serif
                        </button>
                    </div>

                    <div className="format-buttons voice-button">
                        <VoiceRecognition setEntryText={(text) => {
                            editor.commands.insertContent(text);
                        }} />
                    </div>
                </div>

                {/* Focus mode button in toolbar */}
                <button
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className={`focus-mode-btn ${isFocusMode ? 'active' : ''}`}
                    title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                >
                    {isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
                </button>
            </div>

            <div className="editor-main">
                {editor && (
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                        <div className="bubble-menu">
                            <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
                            <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
                            <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
                            <button onClick={() => editor.chain().focus().toggleHighlight().run()}>H</button>
                        </div>
                    </BubbleMenu>
                )}
                <EditorContent editor={editor} className="tiptap-editor" />

                {/* Word/character count at bottom right */}
                <div className="editor-stats">
                    <div className="word-count">{wordCount} words</div>
                    <div className="char-count">{charCount} characters</div>
                </div>
            </div>

            <div className="editor-footer">
                <div className="editor-metadata">
                    <div className="editor-date">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="editor-emotion">
                        <label>Emotion:</label>
                        <select
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
                </div>

                {/* Muse logo button in middle of footer */}
                <div className="footer-center">
                    <button className="muse-logo-btn" onClick={toggleMusePanel}>
                        <img src={logo} alt="Muse AI" className="footer-logo" />
                    </button>
                </div>

                <div className="footer-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="save-btn" onClick={handleSave} disabled={editor.isEmpty}>Save</button>
                </div>
            </div>
            <MuseAIPanel
                isOpen={isMusePanelOpen}
                onClose={() => setIsMusePanelOpen(false)}
                editorContent={editor ? editor.getText() : ''}
                onInsertResponse={insertMuseResponse}
            />
        </div>
    );
}

export default FullPageEditor;