"use client";
import React, { useState } from 'react';
import { EnterFullScreenIcon, ExitFullScreenIcon } from '@radix-ui/react-icons';

export default function WindowFrame({ title, children, initialFullscreen = false }: {
  title: string;
  children: React.ReactNode;
  initialFullscreen?: boolean;
}) {
  const [fullscreen, setFullscreen] = useState(initialFullscreen);

  return (
    <div
      className={`z-10 flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-black/50 backdrop-blur-xl rounded-2xl transition-all duration-300 ${fullscreen ? 'fixed inset-0 m-0 w-full h-full max-w-none max-h-none' : 'relative mx-auto my-8 w-full max-w-3xl min-h-[400px]'} overflow-hidden`}
      style={{
        boxShadow: '0 8px 40px 0 rgba(80,60,30,0.10), 0 2px 8px 0 rgba(180,160,120,0.06)',
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/60 dark:bg-black/40 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 select-none truncate">{title}</span>
        <button
          className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          onClick={() => setFullscreen(f => !f)}
          title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {fullscreen ? <ExitFullScreenIcon className="w-5 h-5" /> : <EnterFullScreenIcon className="w-5 h-5" />}
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
} 