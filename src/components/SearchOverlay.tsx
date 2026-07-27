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
        className="w-10 h-10 rounded-[2px] flex items-center justify-center bg-[#050a14] text-gray-400 hover:text-white transition-colors border border-[#1e293b] hover:border-[#facc15] shadow"
        title="Ara"
      >
        <Search size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={22} className="text-[#facc15]" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Haber, rehber veya kullanıcı ara..."
                className="w-full bg-[#050a14] border-2 border-[#1e293b] rounded-[3px] py-4 pl-12 pr-12 text-white text-base font-black tracking-wider uppercase focus:outline-none focus:border-[#facc15] shadow-2xl transition-colors"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </form>
            <div className="mt-4 text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-[#050a14] border border-[#1e293b] px-3 py-1.5 rounded-[2px] shadow-sm">KAPATMAK İÇİN ESC TUŞUNA BASIN</span>
            </div>
          </div>
          
          <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
}
