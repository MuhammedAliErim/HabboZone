'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Newspaper, BookOpen, Medal, Calendar, User, FileText } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { globalSearch, SearchResult } from '@/app/actions/search';
import Link from 'next/link';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      startTransition(async () => {
        const data = await globalSearch(debouncedQuery);
        setResults(data);
        setIsOpen(true);
      });
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <Newspaper size={14} className="text-[#38bdf8]" />;
      case 'magazine': return <BookOpen size={14} className="text-yellow-400" />;
      case 'badge': return <Medal size={14} className="text-orange-400" />;
      case 'event': return <Calendar size={14} className="text-purple-400" />;
      case 'profile': return <User size={14} className="text-green-400" />;
      case 'topic': return <FileText size={14} className="text-gray-400" />;
      default: return <Search size={14} className="text-gray-400" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'news': return 'Haber';
      case 'magazine': return 'Gazete';
      case 'badge': return 'Rozet';
      case 'event': return 'Etkinlik';
      case 'profile': return 'Kullanıcı';
      case 'topic': return 'Forum/Rehber';
      default: return 'Diğer';
    }
  };

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          placeholder="Haber, rozet veya kullanıcı ara..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length < 2) setIsOpen(false);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="w-full bg-[#1e293b] text-white border-2 border-[#0f172a] rounded-[4px] py-1.5 pl-9 pr-4 text-[13px] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#38bdf8] transition-colors placeholder-gray-500"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#38bdf8] transition-colors">
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border-2 border-black rounded-[4px] shadow-[4px_4px_0_#000] z-50 overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-3 py-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider bg-[#0f172a]/50">
                Hızlı Sonuçlar
              </div>
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#334155] transition-colors border-b border-gray-800 last:border-0"
                >
                  <div className="w-8 h-8 rounded-[2px] border border-black bg-[#0a1325] overflow-hidden shrink-0 flex items-center justify-center">
                    {result.imageUrl ? (
                      <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover pixelated" />
                    ) : (
                      getTypeIcon(result.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-[13px] truncate">{result.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-[2px] bg-[#0f172a] border border-gray-700 text-gray-400 font-bold uppercase shrink-0">
                        {getTypeName(result.type)}
                      </span>
                    </div>
                    {result.description && (
                      <div className="text-gray-400 text-[11px] truncate mt-0.5">{result.description}</div>
                    )}
                  </div>
                </Link>
              ))}
              
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 text-[12px] font-bold text-[#38bdf8] hover:bg-[#0f172a] transition-colors mt-1"
              >
                Tüm sonuçları gör &rarr;
              </Link>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-[13px] font-bold">
              Sonuç bulunamadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
