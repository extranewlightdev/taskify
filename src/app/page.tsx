"use client";

import { useState } from 'react';
import Editor from './Editor';
import ProjectBoard from './ProjectBoard';
import DiagramEditor from './DiagramEditor';
import { RocketIcon, Pencil2Icon, DrawingPinIcon, StopwatchIcon, CheckCircledIcon, CalendarIcon, CardStackIcon, SpeakerLoudIcon } from '@radix-ui/react-icons';
import WindowFrame from './WindowFrame';
import TimerWidget from './TimerWidget';
import StickyNotes from './StickyNotes';
import MusicPlayer from './MusicPlayer';

const NAV = [
  { key: 'projects', label: 'Projects', icon: RocketIcon },
  { key: 'editor', label: 'Editor', icon: Pencil2Icon },
  { key: 'diagrams', label: 'Diagrams', icon: DrawingPinIcon },
  { key: 'timer', label: 'Timer', icon: StopwatchIcon },
  { key: 'todo', label: 'Todo', icon: CheckCircledIcon },
  { key: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { key: 'notes', label: 'Notes', icon: CardStackIcon },
  { key: 'music', label: 'Music', icon: SpeakerLoudIcon },
];

export default function Home() {
  const [section, setSection] = useState('editor');

  return (
    <div className="flex flex-col w-full h-full">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between w-full max-w-6xl mx-auto px-6 py-4 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-lg mb-8">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">vibecccc</span>
          {NAV.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium ${section === key ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-white/80 dark:hover:bg-black/60 text-black dark:text-white'}`}
              onClick={() => setSection(key)}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4"></div>
      </nav>
      {/* Main Workspace Area */}
      <section className="flex-1 w-full flex items-center justify-center min-h-[60vh]">
        {section === 'editor' && (
          <WindowFrame title="Code Editor">
            <Editor />
          </WindowFrame>
        )}
        {section === 'projects' && (
          <WindowFrame title="Project Board">
            <ProjectBoard />
          </WindowFrame>
        )}
        {section === 'diagrams' && (
          <WindowFrame title="Diagram Editor">
            <DiagramEditor />
          </WindowFrame>
        )}
        {section === 'timer' && (
          <WindowFrame title="Timer / Clock">
            <TimerWidget />
          </WindowFrame>
        )}
        {section === 'notes' && (
          <WindowFrame title="Sticky Notes">
            <StickyNotes />
          </WindowFrame>
        )}
        {section === 'music' && (
          <WindowFrame title="Music Player">
            <MusicPlayer />
          </WindowFrame>
        )}
        {section !== 'editor' && section !== 'projects' && section !== 'diagrams' && section !== 'timer' && section !== 'notes' && section !== 'music' && (
          <div className="text-3xl text-gray-700 dark:text-gray-200 font-semibold opacity-60">{NAV.find(n => n.key === section)?.label} coming soon...</div>
        )}
      </section>
    </div>
  );
}
