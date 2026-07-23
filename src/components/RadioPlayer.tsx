'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, MessageCircle, Send, RadioReceiver } from 'lucide-react';
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
        <div className="habbo-box w-72 pointer-events-auto shadow-[4px_4px_0_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="habbo-box-header dark flex justify-between items-center py-2">
            <span className="flex items-center gap-1"><MessageCircle size={14} /> Radyo İstek Hattı</span>
            <button onClick={() => setShowRequestForm(false)} className="text-gray-400 hover:text-white font-bold bg-black/30 hover:bg-red-500 rounded px-1.5 transition-colors">X</button>
          </div>
          
          <div className="p-4 bg-gray-50 border-t-2 border-white">
              {requestStatus === 'success' ? (
                <div className="bg-green-100 text-green-800 p-4 border border-green-300 rounded text-sm text-center font-bold shadow-inner">
                  İsteğin DJ'e ulaştı! 🎉
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block">Adınız (İsteğe Bağlı)</label>
                    <input type="text" value={requestName} onChange={e => setRequestName(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded px-2 py-1.5 text-xs text-black outline-none focus:border-blue-500 shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block">İstediğiniz Şarkı</label>
                    <input type="text" required value={requestSong} onChange={e => setRequestSong(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded px-2 py-1.5 text-xs text-black outline-none focus:border-blue-500 shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block">Mesajınız</label>
                    <textarea required rows={2} value={requestMessage} onChange={e => setRequestMessage(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded px-2 py-1.5 text-xs text-black outline-none focus:border-blue-500 shadow-inner resize-none"></textarea>
                  </div>
                  <button disabled={requestStatus === 'loading'} type="submit" className="habbo-button blue w-full text-xs py-2 flex justify-center items-center gap-1 shadow-md">
                    {requestStatus === 'loading' ? 'Gönderiliyor...' : <><Send size={12}/> Gönder</>}
                  </button>
                </form>
              )}
          </div>
        </div>
      )}

      {/* Main Player Widget */}
      <div className="habbo-box w-72 pointer-events-auto shadow-2xl flex flex-col group">
        <div className="habbo-box-header" style={{backgroundColor: '#6b21a8', borderBottomColor: '#581c87'}}>
            <div className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-1.5">
                    <RadioReceiver size={14} className={isPlaying ? "animate-bounce" : ""} />
                    HabboZone FM
                </div>
                <div className="flex items-center gap-1 text-[9px] bg-black/30 border border-black/20 px-1.5 py-0.5 rounded shadow-inner">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></span>
                    CANLI YAYIN
                </div>
            </div>
        </div>
        
        <div className="p-3 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-between border-t border-white relative overflow-hidden">
          
          {/* Abstract background for the player */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Music size={100} />
          </div>

          <button 
            onClick={togglePlay}
            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 ${
                isPlaying 
                ? 'bg-red-500 text-white border-2 border-red-700 hover:bg-red-400' 
                : 'bg-green-500 text-white border-2 border-green-700 hover:bg-green-400'
            }`}
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
          </button>
          
          <div className="flex-1 px-3 relative z-10">
            <div className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1.5">DJ AutoDJ</div>
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-300 shadow-inner">
              <button onClick={() => setIsMuted(!isMuted)} className="text-gray-500 hover:text-purple-600 transition-colors">
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
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>

          <button 
            onClick={() => setShowRequestForm(!showRequestForm)}
            className={`relative z-10 p-2.5 rounded-lg transition-colors border-2 shadow-sm ${showRequestForm ? 'bg-purple-600 text-white border-purple-800' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600'}`}
            title="İstek Gönder"
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
