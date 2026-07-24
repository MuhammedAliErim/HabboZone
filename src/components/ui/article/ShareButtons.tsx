'use client';

import { Link as LinkIcon, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : `https://habbozone.com${url}`;

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + fullUrl)}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold text-gray-400 uppercase mr-2">PAYLAŞ:</span>
      
      <a 
        href={shareLinks.x} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center bg-[#1da1f2] text-white rounded-[4px] border border-black shadow-[2px_2px_0_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all"
        title="X (Twitter) üzerinde paylaş"
      >
        <span className="font-bold text-[12px]">X</span>
      </a>
      
      <a 
        href={shareLinks.facebook} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center bg-[#1877f2] text-white rounded-[4px] border border-black shadow-[2px_2px_0_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all"
        title="Facebook üzerinde paylaş"
      >
        <span className="font-bold text-[12px]">f</span>
      </a>
      
      <a 
        href={shareLinks.whatsapp} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center bg-[#25d366] text-white rounded-[4px] border border-black shadow-[2px_2px_0_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all"
        title="WhatsApp üzerinde paylaş"
      >
        <MessageCircle size={14} />
      </a>
      
      <button 
        onClick={copyToClipboard}
        className="w-8 h-8 flex items-center justify-center bg-[#334155] text-white rounded-[4px] border border-black shadow-[2px_2px_0_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all relative"
        title="Bağlantıyı kopyala"
      >
        <LinkIcon size={14} />
        {copied && (
          <span className="absolute -top-8 bg-black text-white text-[10px] py-1 px-2 rounded-[2px] font-bold whitespace-nowrap border border-gray-700 animate-in fade-in zoom-in duration-200">
            Kopyalandı!
          </span>
        )}
      </button>
    </div>
  );
}
