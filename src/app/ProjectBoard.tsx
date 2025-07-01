"use client";
import React, { useState, useRef } from 'react';
import { PlusIcon, Pencil2Icon, TrashIcon, CheckIcon } from '@radix-ui/react-icons';

// Card type
interface Card {
  id: string;
  column: string;
  title: string;
  description: string;
  _moving?: boolean;
}

const initialColumns = [
  { id: 'todo', name: 'To Do' },
  { id: 'inprogress', name: 'In Progress' },
  { id: 'done', name: 'Done' },
];

const initialCards: Card[] = [
  { id: '1', column: 'todo', title: 'Sample Task', description: 'This is a sample card.' },
];

export default function ProjectBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [draggedCard, setDraggedCard] = useState(null as null | string);
  const [newColumnName, setNewColumnName] = useState('');
  const [addingCardCol, setAddingCardCol] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [confettiDone, setConfettiDone] = useState(false);
  const confettiTimeout = useRef<NodeJS.Timeout | null>(null);

  // Drag handlers
  const onDragStart = (id: string) => setDraggedCard(id);
  const onDragEnd = () => setDraggedCard(null);
  const onDrop = (colId: string) => {
    if (draggedCard) {
      setCards(cards => cards.map(card => card.id === draggedCard ? { ...card, column: colId } : card));
      setDraggedCard(null);
    }
  };

  // Add column
  const addColumn = () => {
    if (newColumnName.trim()) {
      setColumns(cols => [...cols, { id: Date.now().toString(), name: newColumnName.trim() }]);
      setNewColumnName('');
    }
  };

  // Add card
  const addCard = (colId: string) => {
    if (newCardTitle.trim()) {
      setCards(cards => [
        ...cards,
        { id: Date.now().toString(), column: colId, title: newCardTitle.trim(), description: newCardDesc.trim() },
      ]);
      setNewCardTitle('');
      setNewCardDesc('');
      setAddingCardCol(null);
    }
  };

  // Edit card
  const startEditCard = (card: Card) => {
    setEditingCardId(card.id);
    setEditTitle(card.title);
    setEditDesc(card.description);
  };
  const saveEditCard = (id: string) => {
    setCards(cards => cards.map(card => card.id === id ? { ...card, title: editTitle, description: editDesc } : card));
    setEditingCardId(null);
  };

  // Delete card
  const deleteCard = (id: string) => setCards(cards => cards.filter(card => card.id !== id));

  // Move card to Done with animation and confetti
  const completeCard = (id: string) => {
    setCards(cards => cards.map(card => card.id === id ? { ...card, column: 'done', _moving: true } : card));
    setConfettiDone(true);
    if (confettiTimeout.current) clearTimeout(confettiTimeout.current);
    confettiTimeout.current = setTimeout(() => setConfettiDone(false), 1800);
    setTimeout(() => {
      setCards(cards => cards.map(card => card.id === id ? { ...card, _moving: false } : card));
    }, 600);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar" style={{scrollbarWidth: 'thin', scrollbarColor: '#a5b4fc #f3f4f6', WebkitOverflowScrolling: 'touch'}}>
      <div className="flex gap-6 justify-center min-w-full">
        {columns.map(col => (
          <div
            key={col.id}
            className="flex flex-col min-w-[300px] bg-white/60 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl p-4 relative"
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(col.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{col.name}</h2>
              <button
                className="p-1 rounded hover:bg-blue-100"
                onClick={() => setAddingCardCol(col.id)}
                title="Add Card"
              >
                <PlusIcon />
              </button>
            </div>
            {/* Add Card Form */}
            {addingCardCol === col.id && (
              <div className="mb-2 flex flex-col gap-2 bg-white/80 p-2 rounded-xl shadow">
                <input
                  className="rounded px-2 py-1 border border-gray-300"
                  placeholder="Card title"
                  value={newCardTitle}
                  onChange={e => setNewCardTitle(e.target.value)}
                />
                <textarea
                  className="rounded px-2 py-1 border border-gray-300"
                  placeholder="Description"
                  value={newCardDesc}
                  onChange={e => setNewCardDesc(e.target.value)}
                />
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => addCard(col.id)}>Add</button>
                  <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setAddingCardCol(null)}>Cancel</button>
                </div>
              </div>
            )}
            {/* Cards */}
            <div className="flex flex-col gap-3">
              {cards.filter(card => card.column === col.id).map(card => (
                <div
                  key={card.id}
                  className={`bg-white/90 dark:bg-black/60 rounded-xl shadow p-3 cursor-grab border-2 transition-all duration-500 ${draggedCard === card.id ? 'border-blue-400' : 'border-transparent'} ${card._moving ? 'opacity-0 translate-x-16 pointer-events-none' : 'opacity-100 translate-x-0'}`}
                  draggable
                  onDragStart={() => onDragStart(card.id)}
                  onDragEnd={onDragEnd}
                >
                  {editingCardId === card.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        className="rounded px-2 py-1 border border-gray-300"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                      />
                      <textarea
                        className="rounded px-2 py-1 border border-gray-300"
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => saveEditCard(card.id)}>Save</button>
                        <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setEditingCardId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{card.title}</h3>
                        <div className="flex gap-1">
                          {col.id === 'inprogress' && (
                            <button className="p-1 rounded hover:bg-green-100" title="Mark as Done" onClick={() => completeCard(card.id)}>
                              <CheckIcon className="w-5 h-5 text-green-600" />
                            </button>
                          )}
                          <button className="p-1 rounded hover:bg-blue-100" onClick={() => startEditCard(card)} title="Edit"><Pencil2Icon /></button>
                          <button className="p-1 rounded hover:bg-red-100" onClick={() => deleteCard(card.id)} title="Delete"><TrashIcon /></button>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">{card.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* Confetti over Done column */}
            {col.id === 'done' && confettiDone && (
              <div className="absolute inset-0 pointer-events-none flex items-start justify-center z-20">
                <ConfettiBurst />
              </div>
            )}
          </div>
        ))}
        {/* Add Column (max 3 columns) */}
        {columns.length < 3 && (
          <div className="flex flex-col min-w-[140px] bg-white/40 dark:bg-black/30 backdrop-blur-lg rounded-2xl shadow-xl p-2 items-center justify-start h-fit self-start mt-2">
            <input
              className="rounded px-1 py-1 border border-gray-300 mb-1 text-sm w-full"
              placeholder="New column name"
              value={newColumnName}
              onChange={e => setNewColumnName(e.target.value)}
              style={{fontSize: '0.95rem'}}
            />
            <button className="px-2 py-1 rounded bg-blue-600 text-white text-sm flex items-center gap-1" onClick={addColumn}><PlusIcon className="w-4 h-4" /> Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ConfettiBurst component
function ConfettiBurst() {
  // Simple emoji confetti burst
  const confetti = Array.from({ length: 18 });
  return (
    <div className="w-full h-32 flex flex-wrap items-start justify-center">
      {confetti.map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: `${Math.random() * 1.2 + 1.2}rem`,
            transform: `translateY(${Math.random() * 10}px) rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall 1.2s cubic-bezier(.6,.2,.4,1) forwards`,
            left: `${Math.random() * 90}%`,
            position: 'relative',
            top: 0,
            zIndex: 30,
            display: 'inline-block',
            margin: '0 2px',
          }}
        >
          {['🎉','✨','🎊','🥳','💫','🌈','⭐️','🍬','🍭'][i % 9]}
        </span>
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(80px) scale(0.7); }
        }
      `}</style>
    </div>
  );
} 