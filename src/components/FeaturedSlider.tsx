'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FeaturedNews {
  title: string;
  slug: string;
  summary: string;
  thumbnail_url: string;
}

export default function FeaturedSlider({ items }: { items: FeaturedNews[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="habbo-box relative w-full h-[380px] md:h-[440px] bg-[#0a1325] border border-[#1e293b] overflow-hidden group">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform group-hover:scale-105"
        style={{ backgroundImage: `url(${currentItem.thumbnail_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#2563eb] text-white px-2 py-0.5 rounded-[2px] text-[10px] font-black uppercase tracking-wider border border-[#3b82f6]">
            🔥 ÖNE ÇIKAN HABER
          </span>
          <span className="bg-black/60 text-gray-300 px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
        <Link href={`/news/${currentItem.slug}`}>
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-2 hover:text-[#facc15] transition-colors" style={{ textShadow: '2px 2px 0 #000' }}>
            {currentItem.title}
          </h2>
        </Link>
        <p className="text-gray-300 text-xs md:text-sm max-w-2xl line-clamp-2 font-medium">
          {currentItem.summary}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-1/2 left-3 -translate-y-1/2 z-10">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
          className="w-9 h-9 rounded-[2px] bg-[#0a1325]/90 border border-[#1e293b] text-white font-black flex items-center justify-center hover:bg-[#2563eb] hover:border-[#3b82f6] transition-colors shadow-md"
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 right-3 -translate-y-1/2 z-10">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))}
          className="w-9 h-9 rounded-[2px] bg-[#0a1325]/90 border border-[#1e293b] text-white font-black flex items-center justify-center hover:bg-[#2563eb] hover:border-[#3b82f6] transition-colors shadow-md"
        >
          →
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-4 h-2 rounded-[1px] transition-all border ${idx === currentIndex ? 'bg-[#facc15] border-[#ca8a04] w-6' : 'bg-[#0a1325]/80 border-[#1e293b] hover:bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}
