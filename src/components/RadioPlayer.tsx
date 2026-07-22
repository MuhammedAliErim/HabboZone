'use client';

import { useEffect, useRef, useState } from 'react';
import { useRadioStore } from '@/store/useRadioStore';
import { createClient } from '@/utils/supabase/client';
import { Send, Music, Loader2, Check } from 'lucide-react';

// Demo radio stream URL (can be replaced with a real stream URL later)
const RADIO_URL = 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one';

export default function RadioPlayer() {
  const { isPlaying, volume, togglePlay, setVolume } = useRadioStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Request form state
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio(RADIO_URL);
    audioRef.current.loop = true;
    
    // Check if user is logged in to pre-fill sender name
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single();
        if (data?.username) {
          setSenderName(data.username);
        }
      }
    };
    fetchUser();
    
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
        audioRef.current.play().catch((err) => {
          console.error("Audio playback failed:", err);
          togglePlay();
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, togglePlay]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const supabase = createClient();
      const { error } = await supabase.from('radio_requests').insert([
        { 
          sender_name: senderName, 
          message, 
          song_request: songRequest 
        }
      ]);
      
      if (error) throw error;
      
      setSubmitStatus('success');
      setMessage('');
      setSongRequest('');
      
      setTimeout(() => {
        setSubmitStatus('idle');
        setShowRequestForm(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {showRequestForm && (
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl mb-2 w-80 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold uppercase tracking-wider flex items-center gap-2">
              <Music size={16} className="text-primary" /> Radyo İstek
            </h3>
            <button 
              onClick={() => setShowRequestForm(false)}
              className="text-foreground/50 hover:text-foreground text-xl"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSubmitRequest} className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase opacity-70 ml-1">Adın</label>
              <input 
                type="text" 
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
                placeholder="Habbo adın..."
                className="w-full bg-black/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase opacity-70 ml-1">İstediğin Şarkı (Opsiyonel)</label>
              <input 
                type="text" 
                value={songRequest}
                onChange={(e) => setSongRequest(e.target.value)}
                placeholder="Örn: Tarkan - Kuzu Kuzu"
                className="w-full bg-black/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase opacity-70 ml-1">Mesajın</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="DJ'e iletmek istediğin mesaj..."
                className="w-full bg-black/10 border border-white/10 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:border-primary"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting || submitStatus === 'success'}
              className={`w-full py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                submitStatus === 'success' ? 'bg-green-500 text-white' : 'bg-primary text-black hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : submitStatus === 'success' ? (
                <><Check size={16} /> Gönderildi!</>
              ) : (
                <><Send size={16} /> İsteği Gönder</>
              )}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white/20 dark:bg-black/40 backdrop-blur-md p-4 rounded-2xl border-2 border-white/10 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center border border-primary/30 ${isPlaying ? 'animate-pulse' : ''}`}>
              <Music size={20} />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wider">HabboZone Radyo</div>
              <div className="text-xs text-primary font-medium">{isPlaying ? 'Yayında...' : 'Duraklatıldı'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className={`p-2 rounded-lg transition-colors ${showRequestForm ? 'bg-primary text-black' : 'bg-white/10 hover:bg-white/20'}`}
              title="İstek Gönder"
            >
              <Send size={16} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center bg-primary text-black hover:scale-105 rounded-lg transition-transform font-black"
            >
              {isPlaying ? '||' : '▶'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-1">
          <span className="text-xs opacity-50">🔈</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-black/20 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-xs opacity-50">🔊</span>
        </div>
      </div>
    </div>
  );
}
