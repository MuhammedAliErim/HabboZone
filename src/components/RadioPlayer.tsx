'use client';

import { useEffect, useRef, useState } from 'react';
import { useRadioStore } from '@/store/useRadioStore';

// Demo radio stream URL (can be replaced with a real stream URL later)
const RADIO_URL = 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one';

export default function RadioPlayer() {
  const { isPlaying, volume, togglePlay, setVolume } = useRadioStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio(RADIO_URL);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Handle browser autoplay policies
        audioRef.current.play().catch((err) => {
          console.error("Audio playback failed:", err);
          togglePlay(); // Revert state if play fails
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, togglePlay]);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-white/10 dark:bg-black/20 backdrop-blur-md p-4 rounded-xl border-4 border-white/30 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center pixel-borders animate-pulse">
            📻
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wider">HabboZone Radyo</div>
            <div className="text-xs opacity-80">{isPlaying ? 'Yayında...' : 'Duraklatıldı'}</div>
          </div>
        </div>
        
        <button 
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-md transition-colors"
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs">🔉</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs">🔊</span>
      </div>
    </div>
  );
}
