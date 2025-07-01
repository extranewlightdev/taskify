"use client";
import React, { useState, useRef } from 'react';
import { PlusIcon, TrashIcon, Pencil2Icon } from '@radix-ui/react-icons';

const COLORS = [
  '#fef08a', // yellow
  '#bbf7d0', // green
  '#bae6fd', // blue
  '#fca5a5', // red
  '#c4b5fd', // purple
  '#fdba74', // orange
  '#f9a8d4', // pink
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

const defaultNotes = [
  // Example note
  // { id: '1', text: 'Welcome to sticky notes!', x: 100, y: 100, color: '#fef08a' },
];

export default function StickyNotes() {
  const [notes, setNotes] = useState(defaultNotes);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Add a new note
  const addNote = () => {
    const newId = Date.now().toString();
    setNotes(notes => [
      ...notes,
      {
        id: newId,
        text: '',
        x: 80 + Math.random() * 200,
        y: 80 + Math.random() * 200,
        color: getRandomColor(),
      },
    ]);
    setEditingId(newId);
    setEditText('');
  };

  // Start dragging
  const onDragStart = (e: React.MouseEvent, id: string) => {
    setDraggedId(id);
    const note = notes.find(n => n.id === id);
    if (note) {
      setOffset({ x: e.clientX - note.x, y: e.clientY - note.y });
    }
  };
  // Drag
  const onDrag = (e: React.MouseEvent) => {
    if (!draggedId) return;
    setNotes(notes => notes.map(n => n.id === draggedId ? { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y } : n));
  };
  // End drag
  const onDragEnd = () => setDraggedId(null);

  // Edit note
  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };
  const saveEdit = (id: string) => {
    setNotes(notes => notes.map(n => n.id === id ? { ...n, text: editText } : n));
    setEditingId(null);
  };
  const deleteNote = (id: string) => setNotes(notes => notes.filter(n => n.id !== id));

  // Render
  return (
    <div
      ref={workspaceRef}
      className="relative w-full h-[600px] min-h-[400px] bg-transparent rounded-xl overflow-hidden"
      onMouseMove={onDrag}
      onMouseUp={onDragEnd}
      style={{ minHeight: 400 }}
    >
      {/* Add Note Button */}
      <button
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-200 hover:bg-yellow-300 shadow font-bold text-yellow-900"
        onClick={addNote}
      >
        <PlusIcon /> Add Note
      </button>
      {/* Notes */}
      {notes.map(note => (
        <div
          key={note.id}
          className="absolute z-10 shadow-xl cursor-grab"
          style={{
            left: note.x,
            top: note.y,
            background: note.color,
            minWidth: 160,
            minHeight: 120,
            maxWidth: 240,
            borderRadius: 12,
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            transform: draggedId === note.id ? 'scale(1.04) rotate(-2deg)' : 'rotate(-2deg)',
            transition: 'box-shadow 0.2s, transform 0.1s',
            userSelect: 'none',
          }}
          onMouseDown={e => onDragStart(e, note.id)}
        >
          <div className="flex items-center justify-between px-2 pt-2">
            <button className="p-1 rounded hover:bg-yellow-100" onClick={e => { e.stopPropagation(); startEdit(note.id, note.text); }} title="Edit"><Pencil2Icon /></button>
            <button className="p-1 rounded hover:bg-red-200" onClick={e => { e.stopPropagation(); deleteNote(note.id); }} title="Delete"><TrashIcon /></button>
          </div>
          <div className="p-3 pt-1">
            {editingId === note.id ? (
              <textarea
                className="w-full h-24 rounded bg-yellow-50 p-2 text-yellow-900 font-semibold shadow-inner resize-none"
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onBlur={() => saveEdit(note.id)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(note.id); } }}
                autoFocus
              />
            ) : (
              <div
                className="whitespace-pre-wrap text-yellow-900 font-semibold text-base min-h-[60px]"
                style={{wordBreak: 'break-word'}}
                onDoubleClick={() => startEdit(note.id, note.text)}
              >
                {note.text || <span className="opacity-40">(Double click to edit)</span>}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 