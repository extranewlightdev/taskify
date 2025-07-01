"use client";
import React, { useState, useRef, useEffect } from 'react';
import { StopwatchIcon, TimerIcon, ClockIcon, PlayIcon, PauseIcon, ResetIcon } from '@radix-ui/react-icons';

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

const MODES = [
  { key: 'timer', label: 'Timer', icon: <StopwatchIcon /> },
  { key: 'countdown', label: 'Countdown', icon: <TimerIcon /> },
  { key: 'clock', label: 'Clock', icon: <ClockIcon /> },
];

export default function TimerWidget() {
  const [mode, setMode] = useState<'timer' | 'countdown' | 'clock'>('timer');
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [countdownInput, setCountdownInput] = useState('00:05:00');
  const [clock, setClock] = useState(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Timer logic
  useEffect(() => {
    if (mode === 'timer' && running) {
      intervalRef.current = setInterval(() => setTimer(t => t + 1000), 1000);
      return () => clearInterval(intervalRef.current!);
    }
    if (mode === 'countdown' && running && countdown > 0) {
      intervalRef.current = setInterval(() => setCountdown(t => t - 1000), 1000);
      return () => clearInterval(intervalRef.current!);
    }
    if (mode === 'clock') {
      intervalRef.current = setInterval(() => setClock(new Date()), 1000);
      return () => clearInterval(intervalRef.current!);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [mode, running, countdown]);

  // Stop timer/countdown at zero
  useEffect(() => {
    if (mode === 'countdown' && countdown <= 0 && running) {
      setRunning(false);
      setCountdown(0);
    }
  }, [countdown, mode, running]);

  // Parse countdown input
  function parseCountdownInput(input: string) {
    const [h, m, s] = input.split(':').map(Number);
    return ((h || 0) * 3600 + (m || 0) * 60 + (s || 0)) * 1000;
  }

  // Handlers
  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    if (mode === 'timer') setTimer(0);
    if (mode === 'countdown') setCountdown(parseCountdownInput(countdownInput));
  };
  const setCountdownFromInput = () => {
    setCountdown(parseCountdownInput(countdownInput));
    setRunning(false);
  };

  // Render
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 bg-white/60 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl p-8">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-2">
        {MODES.map(m => (
          <button
            key={m.key}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium transition ${mode === m.key ? 'bg-black text-white' : 'bg-white/80 text-black border border-gray-300'}`}
            onClick={() => { setMode(m.key as 'timer' | 'countdown' | 'clock'); setRunning(false); }}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>
      {/* Main Display */}
      <div className="text-5xl font-mono text-center text-gray-800 dark:text-gray-100 select-none">
        {mode === 'timer' && formatTime(timer)}
        {mode === 'countdown' && formatTime(countdown)}
        {mode === 'clock' && clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timezone })}
      </div>
      {/* Controls */}
      {mode === 'timer' && (
        <div className="flex gap-3">
          {running ? (
            <button className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={pause}><PauseIcon /> Pause</button>
          ) : (
            <button className="p-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={start}><PlayIcon /> Start</button>
          )}
          <button className="p-2 rounded bg-gray-200 hover:bg-gray-300" onClick={reset}><ResetIcon /> Reset</button>
        </div>
      )}
      {mode === 'countdown' && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 items-center">
            <input
              className="w-32 rounded px-2 py-1 border border-gray-300 text-center font-mono"
              value={countdownInput}
              onChange={e => setCountdownInput(e.target.value)}
              onBlur={setCountdownFromInput}
              placeholder="hh:mm:ss"
              pattern="\d{2}:\d{2}:\d{2}"
            />
            <button className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={setCountdownFromInput}>Set</button>
          </div>
          <div className="flex gap-3">
            {running ? (
              <button className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={pause}><PauseIcon /> Pause</button>
            ) : (
              <button className="p-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={start}><PlayIcon /> Start</button>
            )}
            <button className="p-2 rounded bg-gray-200 hover:bg-gray-300" onClick={reset}><ResetIcon /> Reset</button>
          </div>
        </div>
      )}
      {mode === 'clock' && (
        <div className="text-gray-500 mt-2 text-center">Timezone: <span className="font-semibold">{timezone}</span></div>
      )}
    </div>
  );
} 