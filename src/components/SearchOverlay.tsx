'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded flex items-center justify-center bg-[#111827] text-gray-400 hover:text-white transition-colors border border-[#1e293b]"
        title="Ara"
      >
        <Search size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={24} className="text-[#3b82f6]" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Haber, rehber veya kullanıcı ara..."
                className="w-full bg-[#0f172a] border-2 border-black rounded-lg py-4 pl-12 pr-12 text-white text-lg font-bold focus:outline-none focus:border-[#3b82f6] shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </form>
            <div className="mt-4 text-center">
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full">Kapatmak için ESC tuşuna basın</span>
            </div>
          </div>
          
          <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
}
