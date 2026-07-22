'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, MessageCircle, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  const [requestName, setRequestName] = useState('');
  const [requestSong, setRequestSong] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  const radioUrl = "https://listen.radioking.com/radio/15684/stream/29976"; 

  useEffect(() => {
    audioRef.current = new Audio(radioUrl);
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('loading');

    const { error } = await supabase.from('radio_requests').insert([
      { sender_name: requestName || 'Anonim', song_request: requestSong, message: requestMessage }
    ]);

    if (error) {
      setRequestStatus('error');
      setTimeout(() => setRequestStatus('idle'), 3000);
    } else {
      setRequestStatus('success');
      setRequestSong('');
      setRequestMessage('');
      setTimeout(() => {
        setShowRequestForm(false);
        setRequestStatus('idle');
      }, 3000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
      
      {/* Request Form Popup */}
      {showRequestForm && (
        <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0_rgba(0,0,0,0.2)] p-4 w-72 pointer-events-auto transform transition-all">
          <div className="flex justify-between items-center mb-3 border-b-2 border-gray-200 pb-2">
            <h3 className="font-bold text-sm uppercase text-primary">Radyo İstek Hattı</h3>
            <button onClick={() => setShowRequestForm(false)} className="text-gray-500 hover:text-red-500 font-bold">X</button>
          </div>
          
          {requestStatus === 'success' ? (
            <div className="bg-green-100 text-green-800 p-3 rounded text-sm text-center font-bold">
              İsteğin DJ'e ulaştı! 🎉
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-3">
              <input type="text" placeholder="Adınız (İsteğe bağlı)" value={requestName} onChange={e => setRequestName(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1.5 text-xs text-black outline-none focus:border-primary" />
              <input type="text" placeholder="İstediğin Şarkı" required value={requestSong} onChange={e => setRequestSong(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1.5 text-xs text-black outline-none focus:border-primary" />
              <textarea placeholder="DJ'e Mesajın..." required rows={2} value={requestMessage} onChange={e => setRequestMessage(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1.5 text-xs text-black outline-none focus:border-primary resize-none"></textarea>
              <button disabled={requestStatus === 'loading'} type="submit" className="habbo-button blue w-full text-xs py-1.5 flex justify-center items-center gap-1">
                {requestStatus === 'loading' ? 'Gönderiliyor...' : <><Send size={12}/> Gönder</>}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Main Player Widget */}
      <div className="habbo-box w-72 pointer-events-auto shadow-2xl flex flex-col">
        <div className="habbo-box-header orange flex items-center justify-between text-xs py-1.5">
          <div className="flex items-center gap-1">
            <Music size={14} className={isPlaying ? "animate-pulse" : ""} />
            HabboZone Radyo
          </div>
          <div className="flex items-center gap-1 text-[10px] bg-black/20 px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            YAYINDA
          </div>
        </div>
        
        <div className="p-3 bg-gray-100 flex items-center justify-between border-t-2 border-white">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-primary hover:bg-gray-50 hover:border-primary transition-colors shadow-sm"
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
          </button>
          
          <div className="flex-1 px-3">
            <div className="text-xs font-bold text-gray-800 mb-1">DJ HabboZone</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="text-gray-500 hover:text-primary">
                {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input 
                type="range" 
                min="0" max="1" step="0.01" 
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <button 
            onClick={() => setShowRequestForm(!showRequestForm)}
            className={`p-2 rounded-lg transition-colors border-2 ${showRequestForm ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-300 hover:border-primary hover:text-primary'}`}
            title="İstek Gönder"
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
