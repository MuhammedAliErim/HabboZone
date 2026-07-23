'use client';

import { useState } from 'react';
import { Download, Copy } from 'lucide-react';

export default function FontGeneratorTool() {
  const [text, setText] = useState('HabboZone');
  const [font, setFont] = useState('habbo_new');
  
  // Format the text for the habbofont.net URL (replace spaces with %20)
  const formattedText = text.length > 0 ? encodeURIComponent(text) : ' ';
  const imageUrl = `https://habbofont.net/font/${font}/${formattedText}.gif`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(imageUrl);
    alert('Resim linki kopyalandı!');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Yazı</label>
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Ne yazmak istersiniz?"
            maxLength={30}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Yazı Tipi</label>
          <select value={font} onChange={(e) => setFont(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            <option value="habbo_new">Habbo Yeni (Siyah)</option>
            <option value="habbo_new_white">Habbo Yeni (Beyaz)</option>
            <option value="volter">Volter (Klasik)</option>
            <option value="volter_white">Volter (Beyaz)</option>
            <option value="habbo">Habbo (Eski)</option>
            <option value="neon">Neon</option>
            <option value="habbocn">Çin (Kırmızı)</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="w-full md:w-64 flex flex-col items-center">
        <div className="w-full h-24 bg-[#f8fafc] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4">
           {text.length > 0 ? (
             <img src={imageUrl} alt="Generated Font" className="max-w-full object-contain pixelated" />
           ) : (
             <span className="text-gray-400 text-sm">Bir şeyler yazın...</span>
           )}
        </div>
        <div className="flex w-full gap-2 mt-4">
           <button onClick={handleCopyLink} disabled={text.length === 0} className="flex-1 habbo-button px-2 py-2 flex items-center justify-center gap-1 text-[10px] disabled:opacity-50">
             <Copy size={14} /> Link
           </button>
           <a href={text.length > 0 ? imageUrl : '#'} target="_blank" download={`${text}_font.gif`} className={`flex-1 habbo-button blue px-2 py-2 flex items-center justify-center gap-1 text-[10px] ${text.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
             <Download size={14} /> İndir
           </a>
        </div>
      </div>
    </div>
  );
}
