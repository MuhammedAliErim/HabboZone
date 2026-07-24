'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Menu, 
  Download,
  Maximize,
  Minimize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MagazineReaderProps {
  magazine: {
    title: string;
    issue_number: number;
    pdf_url: string;
    pages?: string[];
  };
}

export default function MagazineReader({ magazine }: MagazineReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pages = magazine.pages || [];
  const totalPages = pages.length;

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    } else if (e.key === 'ArrowLeft') {
      setCurrentPage((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape' && isFullscreen) {
      toggleFullscreen();
    }
  }, [totalPages, isFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        Bu dergi için sayfa bulunamadı.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white flex flex-col overflow-hidden font-sans">
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
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors text-white md:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="hidden sm:block">
            <h1 className="font-bold text-[15px] leading-tight text-gray-100">{magazine.title}</h1>
            <p className="text-[11px] text-gray-400 font-medium">Sayı #{magazine.issue_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mr-2">
            {currentPage + 1} / {totalPages}
          </span>
          <button 
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors text-gray-300 hidden sm:flex"
            title="Tam Ekran"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <a 
            href={magazine.pdf_url} 
            download 
            className="flex items-center gap-2 px-3 py-1.5 bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 text-[#38bdf8] rounded-[4px] text-xs font-bold transition-colors border border-[#38bdf8]/30"
          >
            <Download size={14} />
            <span className="hidden sm:inline">PDF İNDİR</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Thumbnails) */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full bg-[#111111] border-r border-white/5 flex-none overflow-y-auto custom-scrollbar absolute md:relative z-10"
            >
              <div className="p-4 grid grid-cols-2 gap-3 w-[220px]">
                {pages.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`relative group rounded border-2 transition-all overflow-hidden aspect-[1/1.4] ${
                      currentPage === index 
                        ? 'border-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
                        : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Sayfa ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm text-[9px] font-bold text-center py-1 text-gray-300 border-t border-white/10">
                      SAYFA {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reader Canvas */}
        <main className="flex-1 relative flex items-center justify-center bg-[#0a0a0a] overflow-hidden group">
          {/* Controls overlay */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all z-10 border border-white/10 shadow-lg ${currentPage === 0 ? 'opacity-0 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 hover:bg-black/80 hover:scale-110'}`}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all z-10 border border-white/10 shadow-lg ${currentPage === totalPages - 1 ? 'opacity-0 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 hover:bg-black/80 hover:scale-110'}`}
          >
            <ChevronRight size={24} />
          </button>

          {/* Current Page Image */}
          <div className="w-full h-full p-4 md:p-8 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPage}
                src={pages[currentPage]}
                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="max-w-full max-h-full object-contain drop-shadow-2xl shadow-black rounded-[2px]"
                alt={`Sayfa ${currentPage + 1}`}
              />
            </AnimatePresence>
          </div>
          
          {/* Sidebar Toggle Button Overlay (if sidebar is closed) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`absolute left-4 top-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all z-10 border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 hover:bg-black/80 ${isSidebarOpen ? 'hidden md:hidden' : 'block'}`}
            title="Sayfaları Göster"
          >
            <Menu size={18} />
          </button>
        </main>
      </div>
    </div>
  );
}
