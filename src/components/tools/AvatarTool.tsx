'use client';

import { useState } from 'react';
import { Download, RefreshCw, Copy } from 'lucide-react';

export default function AvatarTool() {
  const [username, setUsername] = useState('Habbo');
  const [action, setAction] = useState('std');
  const [direction, setDirection] = useState('2');
  const [headDirection, setHeadDirection] = useState('2');
  const [gesture, setGesture] = useState('sml');
  const [size, setSize] = useState('b');
  const [loading, setLoading] = useState(false);

  const imageUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${username}&action=${action}&direction=${direction}&head_direction=${headDirection}&gesture=${gesture}&size=${size}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(imageUrl);
    alert('Resim linki kopyalandı!');
  };

  const handleChange = (setter: (val: string) => void, val: string) => {
    setLoading(true);
    setter(val);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-[11px] font-black text-gray-300 uppercase tracking-wider mb-1.5">HABBO ADI</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => handleChange(setUsername, e.target.value)}
            className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs text-white font-black focus:outline-none focus:border-[#3b82f6]"
            placeholder="Kullanıcı adı girin..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-black text-gray-300 uppercase tracking-wider mb-1.5">EYLEM</label>
            <select value={action} onChange={(e) => handleChange(setAction, e.target.value)} className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs text-white font-black focus:outline-none focus:border-[#3b82f6]">
              <option value="std">Ayakta</option>
              <option value="sit">Oturuyor</option>
              <option value="wlk">Yürüyor</option>
              <option value="wav">El Sallıyor</option>
              <option value="drk">İçecek İçiyor</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-300 uppercase tracking-wider mb-1.5">YÜZ İFADESİ</label>
            <select value={gesture} onChange={(e) => handleChange(setGesture, e.target.value)} className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs text-white font-black focus:outline-none focus:border-[#3b82f6]">
              <option value="std">Normal</option>
              <option value="sml">Gülümsüyor</option>
              <option value="sad">Üzgün</option>
              <option value="ang">Kızgın</option>
              <option value="sur">Şaşkın</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-black text-gray-300 uppercase tracking-wider mb-1.5">YÖN</label>
            <select value={direction} onChange={(e) => handleChange(setDirection, e.target.value)} className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs text-white font-black focus:outline-none focus:border-[#3b82f6]">
              <option value="2">Güney Doğu</option>
              <option value="3">Güney</option>
              <option value="4">Güney Batı</option>
              <option value="5">Batı</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-300 uppercase tracking-wider mb-1.5">BAŞ YÖNÜ</label>
            <select value={headDirection} onChange={(e) => handleChange(setHeadDirection, e.target.value)} className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs text-white font-black focus:outline-none focus:border-[#3b82f6]">
              <option value="2">Güney Doğu</option>
              <option value="3">Güney</option>
              <option value="4">Güney Batı</option>
              <option value="5">Batı</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-300 uppercase tracking-wider mb-1.5">BOYUT</label>
            <select value={size} onChange={(e) => handleChange(setSize, e.target.value)} className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs text-white font-black focus:outline-none focus:border-[#3b82f6]">
              <option value="b">Büyük (L)</option>
              <option value="s">Küçük (S)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="w-full md:w-48 flex flex-col items-center">
        <div className="w-full aspect-square bg-[#050a14] border border-[#1e293b] rounded-[3px] flex items-center justify-center relative group overflow-hidden shadow-inner p-4">
          {loading && (
            <div className="absolute inset-0 bg-[#050a14]/80 flex items-center justify-center z-10">
              <RefreshCw size={24} className="text-[#3b82f6] animate-spin" />
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt="Habbo Avatar" 
            className="max-h-full object-contain transition-transform group-hover:scale-110" 
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>
        <div className="flex w-full gap-2 mt-4">
           <button onClick={handleCopyLink} className="flex-1 habbo-button px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-tight">
             <Copy size={14} /> LİNKİ AL
           </button>
           <a href={imageUrl} target="_blank" download={`${username}_avatar.png`} className="flex-1 habbo-button blue px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-tight">
             <Download size={14} /> İNDİR
           </a>
        </div>
      </div>
    </div>
  );
}
