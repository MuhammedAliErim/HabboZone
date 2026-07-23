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

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Habbo Adı</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Kullanıcı adı girin..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Eylem</label>
            <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="std">Ayakta</option>
              <option value="sit">Oturuyor</option>
              <option value="wlk">Yürüyor</option>
              <option value="wav">El Sallıyor</option>
              <option value="drk">İçecek İçiyor</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Yüz İfadesi</label>
            <select value={gesture} onChange={(e) => setGesture(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="std">Normal</option>
              <option value="sml">Gülümsüyor</option>
              <option value="sad">Üzgün</option>
              <option value="ang">Kızgın</option>
              <option value="sur">Şaşkın</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Yön</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="2">Güney Doğu</option>
              <option value="3">Güney</option>
              <option value="4">Güney Batı</option>
              <option value="5">Batı</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Baş Yönü</label>
            <select value={headDirection} onChange={(e) => setHeadDirection(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
               <option value="2">Güney Doğu</option>
              <option value="3">Güney</option>
              <option value="4">Güney Batı</option>
              <option value="5">Batı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="w-full md:w-48 flex flex-col items-center">
        <div className="w-full aspect-square bg-[#f8fafc] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative group overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Habbo Avatar" 
            className="max-h-full object-contain transition-transform group-hover:scale-110" 
            onLoad={() => setLoading(false)}
          />
        </div>
        <div className="flex w-full gap-2 mt-4">
           <button onClick={handleCopyLink} className="flex-1 habbo-button px-2 py-2 flex items-center justify-center gap-1 text-[10px]">
             <Copy size={14} /> Link
           </button>
           <a href={imageUrl} target="_blank" download={`${username}_avatar.png`} className="flex-1 habbo-button blue px-2 py-2 flex items-center justify-center gap-1 text-[10px]">
             <Download size={14} /> İndir
           </a>
        </div>
      </div>
    </div>
  );
}
