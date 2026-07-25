'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';

// Bypass strict TS type checking for HTMLFlipBook since its types are incomplete
const FlipBook = HTMLFlipBook as any;

interface MagazineReaderProps {
  magazine: any;
  aiPages?: any[];
}

// Flipbook için her bir sayfa bileşeni (React-pageflip forwardRef gerektirir)
const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; number: number }>(
  (props, ref) => {
    return (
      <div className="bg-white overflow-hidden shadow-lg" ref={ref}>
        {props.children}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-medium opacity-50 z-50 mix-blend-difference">
          {props.number}
        </div>
      </div>
    );
  }
);
Page.displayName = 'Page';

export default function MagazineReader({ magazine, aiPages = [] }: MagazineReaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flipBookRef = useRef<any>(null);

  // Eski sistemdeki (Resim tabanlı) sayfalar
  const oldPages = magazine.pages || [];
  const isAiGenerated = aiPages.length > 0 || magazine.is_ai_generated;
  
  // Hangi sayfaları göstereceğiz?
  const totalPages = isAiGenerated ? aiPages.length : oldPages.length;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (totalPages === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        Bu dergi için sayfa bulunamadı.
      </div>
    );
  }

  // AI Sayfasını Render Etme Fonksiyonu
  const renderAIPage = (page: any) => {
    const layers = page.layout_data?.layers || [];
    return (
      <div 
        className="w-full h-full relative origin-top-left"
        style={{
          backgroundColor: page.background_color || '#ffffff',
          backgroundImage: page.background_image ? `url(${page.background_image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Orijinal dergi 800x1131, bizim flipbook boyutumuz 400x565 olacak (Yarı yarıya)
          // Transform scale ile küçültüyoruz ki içindeki absolute pozisyonlar bozulmasın
          transform: 'scale(0.5)',
          width: 800,
          height: 1131
        }}
      >
        {layers.map((layer: any) => {
          if (layer.type === 'text') {
            return (
              <div 
                key={layer.id}
                style={{
                  position: 'absolute',
                  left: layer.style?.x || 0,
                  top: layer.style?.y || 0,
                  width: layer.style?.width,
                  height: layer.style?.height,
                  fontSize: layer.style?.fontSize,
                  color: layer.style?.color,
                  fontWeight: layer.style?.fontWeight,
                  lineHeight: 1.2
                }}
              >
                {layer.content}
              </div>
            );
          } else if (layer.type === 'image') {
            return (
              <div
                key={layer.id}
                style={{
                  position: 'absolute',
                  left: layer.style?.x || 0,
                  top: layer.style?.y || 0,
                  width: layer.style?.width,
                  height: layer.style?.height,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={layer.content} 
                  alt="layer" 
                  className="w-full h-full object-cover"
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 flex-none bg-[#111111] border-b border-white/10 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-3">
          <Link 
            href="/magazines" 
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors text-white"
            title="Geri Dön"
          >
            <X size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-[15px] leading-tight text-gray-100">{magazine.title}</h1>
            {magazine.issue_number && <p className="text-[11px] text-gray-400 font-medium">Sayı #{magazine.issue_number}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors text-gray-300"
            title="Tam Ekran"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </header>

      {/* Reader Canvas (3D Flipbook) */}
      <main className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] relative overflow-hidden">
        
        {/* Flipbook Container */}
        <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <FlipBook 
            width={400} 
            height={565} 
            size="fixed" 
            minWidth={315} 
            maxWidth={1000} 
            minHeight={400} 
            maxHeight={1533} 
            maxShadowOpacity={0.5} 
            showCover={true} 
            mobileScrollSupport={true}
            className="flipbook-component"
            ref={flipBookRef}
          >
            {isAiGenerated ? (
              aiPages.map((page: any, index: number) => (
                <Page key={page.id} number={index + 1}>
                  {renderAIPage(page)}
                </Page>
              ))
            ) : (
              oldPages.map((url: string, index: number) => (
                <Page key={index} number={index + 1}>
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Sayfa ${index + 1}`} className="max-w-full max-h-full object-contain" />
                  </div>
                </Page>
              ))
            )}
          </FlipBook>
        </div>

        {/* Sonraki / Önceki Sayfa Butonları */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
          <button 
            onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
            className="text-white hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm font-bold"
          >
            <ChevronLeft size={20} /> ÖNCEKİ
          </button>
          
          <div className="w-[1px] h-6 bg-white/20"></div>

          <button 
            onClick={() => flipBookRef.current?.pageFlip().flipNext()}
            className="text-white hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm font-bold"
          >
            SONRAKİ <ChevronRight size={20} />
          </button>
        </div>

      </main>
    </div>
  );
}
