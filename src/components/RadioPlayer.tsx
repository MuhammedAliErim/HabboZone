'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, MessageCircle, Send, RadioReceiver, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [requestName, setRequestName] = useState('');
  const [requestSong, setRequestSong] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  const radioUrl = process.env.NEXT_PUBLIC_RADIO_URL || '';

  useEffect(() => {
    const audio = new Audio(radioUrl);
    audio.volume = volume;
    audio.preload = 'none';

    audio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setError('Yayına bağlanılamadı.');
    };

    audio.oncanplay = () => {
      setIsLoading(false);
      setError(null);
    };

    audio.onwaiting = () => setIsLoading(true);
    audio.onplaying = () => {
      setIsLoading(false);
      setError(null);
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.onerror = null;
      audio.oncanplay = null;
      audio.onwaiting = null;
      audio.onplaying = null;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current || !radioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setError(null);
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (e) {
        setIsPlaying(false);
        setIsLoading(false);
        setError('Yayın başlatılamadı.');
        console.error("Playback failed:", e);
      }
    }
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
      
      {showRequestForm && (
        <div className="habbo-box w-[calc(100vw-2rem)] sm:w-72 pointer-events-auto shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="habbo-box-header flex justify-between items-center py-2">
            <span className="flex items-center gap-1"><MessageCircle size={14} /> RADYO İSTEK HATTI</span>
            <button onClick={() => setShowRequestForm(false)} className="text-[#94a3b8] hover:text-white font-black hover:bg-red-600 rounded-[2px] px-1.5 transition-colors" aria-label="Kapat">X</button>
          </div>
          
          <div className="p-4 bg-[#050a14]">
              {requestStatus === 'success' ? (
                <div className="bg-green-900/30 text-green-400 p-4 border border-green-800 rounded-[2px] text-sm text-center font-bold">
                  İsteğin DJ&apos;e ulaştı! 🎉
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#64748b] mb-1 block">ADINIZ (İSTEĞE BAĞLI)</label>
                    <input type="text" value={requestName} onChange={e => setRequestName(e.target.value)} className="w-full bg-[#0a1325] border border-[#1e293b] rounded-[2px] px-2 py-1.5 text-xs text-white outline-none focus:border-[#facc15]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#64748b] mb-1 block">İSTEDİĞİNİZ ŞARKI</label>
                    <input type="text" required value={requestSong} onChange={e => setRequestSong(e.target.value)} className="w-full bg-[#0a1325] border border-[#1e293b] rounded-[2px] px-2 py-1.5 text-xs text-white outline-none focus:border-[#facc15]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#64748b] mb-1 block">MESAJINIZ</label>
                    <textarea required rows={2} value={requestMessage} onChange={e => setRequestMessage(e.target.value)} className="w-full bg-[#0a1325] border border-[#1e293b] rounded-[2px] px-2 py-1.5 text-xs text-white outline-none focus:border-[#facc15] resize-none"></textarea>
                  </div>
                  <button disabled={requestStatus === 'loading'} type="submit" className="habbo-button w-full text-[10px] py-2 flex justify-center items-center gap-1">
                    {requestStatus === 'loading' ? 'GÖNDERİLİYOR...' : <><Send size={12}/> GÖNDER</>}
                  </button>
                </form>
              )}
          </div>
        </div>
      )}

      <div className="habbo-box w-[calc(100vw-2rem)] sm:w-72 pointer-events-auto shadow-2xl flex flex-col group">
        <div className="habbo-box-header">
            <div className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-1.5 font-black">
                    <RadioReceiver size={14} className={isPlaying ? "animate-bounce text-[#facc15]" : "text-white"} />
                    HABBOZONE FM
                </div>
                <div className="flex items-center gap-1 text-[9px] bg-black/40 border border-black/50 px-1.5 py-0.5 rounded-[2px] shadow-inner">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></span>
                    CANLI YAYIN
                </div>
            </div>
        </div>
        
        <div className="p-3 bg-[#050a14] flex items-center justify-between relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Music size={100} className="text-white" />
          </div>

          <button 
            onClick={togglePlay}
            disabled={!radioUrl}
            aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
            className={`relative z-10 w-12 h-12 rounded-[2px] flex items-center justify-center transition-all border border-[#14213a] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                isPlaying 
                ? 'bg-red-600 text-white hover:bg-red-500' 
                : 'bg-green-600 text-white hover:bg-green-500'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
          </button>
          
          <div className="flex-1 px-3 relative z-10">
            <div className="text-[11px] font-black text-white uppercase tracking-widest mb-1.5 drop-shadow">DJ AutoDJ</div>
            <div className="flex items-center gap-2 bg-[#050a14] px-2 py-1 rounded-[2px] border border-[#14213a] shadow-inner">
              <button onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Sesi aç' : 'Sesi kapat'} className="text-[#64748b] hover:text-white transition-colors">
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
                className="w-full h-1 bg-[#1e293b] rounded-[2px] appearance-none cursor-pointer accent-[#facc15]"
              />
            </div>
            {error && <div className="text-[10px] text-red-400 font-bold mt-1">{error}</div>}
          </div>

          <button 
            onClick={() => setShowRequestForm(!showRequestForm)}
            aria-label="İstek Gönder"
            className={`relative z-10 p-2.5 rounded-[2px] transition-colors border shadow-sm ${showRequestForm ? 'bg-[#facc15] text-black border-transparent font-black' : 'bg-[#050a14] text-[#94a3b8] border-[#14213a] hover:border-[#facc15] hover:text-[#facc15]'}`}
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
