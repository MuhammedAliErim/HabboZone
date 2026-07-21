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
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl group">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform group-hover:scale-105"
        style={{ backgroundImage: `url(${currentItem.thumbnail_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-md mb-4 pixel-borders">
          Öne Çıkan
        </span>
        <Link href={`/news/${currentItem.slug}`}>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 hover:underline decoration-primary underline-offset-4">
            {currentItem.title}
          </h2>
        </Link>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl line-clamp-2">
          {currentItem.summary}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
          className="w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-primary transition-colors backdrop-blur-md"
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))}
          className="w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-primary transition-colors backdrop-blur-md"
        >
          →
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 right-8 flex gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
}
