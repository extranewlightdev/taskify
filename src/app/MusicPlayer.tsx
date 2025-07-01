"use client";
import React, { useRef, useState } from 'react';
import ReactYouTube from 'react-youtube';
import { SpeakerLoudIcon, PlayIcon, PauseIcon, StopIcon, UploadIcon, Link2Icon } from '@radix-ui/react-icons';

export default function MusicPlayer() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle file upload
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUrl(URL.createObjectURL(file));
      setYoutubeId(null);
      setIsPlaying(false);
    }
  };

  // Handle YouTube link
  const onYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    if (match) {
      setYoutubeId(match[1]);
      setFileUrl(null);
      setIsPlaying(false);
    }
  };

  // Audio controls
  const play = () => { audioRef.current?.play(); setIsPlaying(true); };
  const pause = () => { audioRef.current?.pause(); setIsPlaying(false); };
  const stop = () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setIsPlaying(false); } };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 bg-white/60 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
        <SpeakerLoudIcon className="w-6 h-6" /> Music Player
      </div>
      {/* File Upload */}
      <label className="flex items-center gap-2 cursor-pointer bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg shadow">
        <UploadIcon /> Upload Music File
        <input type="file" accept="audio/*" className="hidden" onChange={onFileChange} />
      </label>
      {/* YouTube Link */}
      <form className="flex gap-2 w-full" onSubmit={onYoutubeSubmit}>
        <input
          className="flex-1 rounded px-2 py-1 border border-gray-300"
          placeholder="Paste YouTube link..."
          value={youtubeUrl}
          onChange={e => setYoutubeUrl(e.target.value)}
        />
        <button type="submit" className="p-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center"><Link2Icon className="w-5 h-5" /></button>
      </form>
      {/* Player */}
      {fileUrl && (
        <div className="w-full flex flex-col items-center gap-2 mt-4">
          <audio ref={audioRef} src={fileUrl} controls className="w-full" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
          <div className="flex gap-2">
            {isPlaying ? (
              <button className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={pause}><PauseIcon /></button>
            ) : (
              <button className="p-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={play}><PlayIcon /></button>
            )}
            <button className="p-2 rounded bg-gray-200 hover:bg-gray-300" onClick={stop}><StopIcon /></button>
          </div>
        </div>
      )}
      {youtubeId && (
        <div className="w-full flex flex-col items-center gap-2 mt-4">
          <ReactYouTube
            videoId={youtubeId}
            opts={{ width: '0', height: '0', playerVars: { autoplay: 1 } }}
            style={{ display: 'none' }}
            iframeClassName="hidden"
          />
          <div className="text-gray-500 text-sm">YouTube audio is playing in the background.</div>
        </div>
      )}
      {!fileUrl && !youtubeId && (
        <div className="text-gray-400 mt-8">Upload a music file or paste a YouTube link to play music.</div>
      )}
    </div>
  );
} 