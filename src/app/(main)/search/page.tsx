import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Newspaper, BookOpen, Medal, Calendar, User, FileText, Search, Users, AlertCircle, ShoppingBag, Package } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Arama Sonuçları - Habbo Zone',
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

interface SearchResultItem {
  id: string;
  _type: string;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  date?: string;
}

const TABS = [
  { id: 'all', label: 'Tümü' },
  { id: 'news', label: 'Haberler' },
  { id: 'magazines', label: 'Gazeteler' },
  { id: 'guides', label: 'Rehberler' },
  { id: 'badges', label: 'Rozetler' },
  { id: 'events', label: 'Etkinlikler' },
  { id: 'groups', label: 'Gruplar' },
  { id: 'profiles', label: 'Kullanıcılar' },
  { id: 'market', label: 'Pazar' },
  { id: 'wiki', label: 'Wiki' },
];

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const tab = typeof resolvedParams.tab === 'string' ? resolvedParams.tab : 'all';

  const supabase = await createClient();
  const searchPattern = `%${q}%`;
  
  const results: SearchResultItem[] = [];
  
  if (q.length >= 2) {
    if (tab === 'all' || tab === 'news') {
      const { data } = await supabase.from('news').select('id, title, summary, slug, thumbnail_url, published_at').ilike('title', searchPattern).eq('status', 'Published').limit(20);
      if (data) results.push(...data.map(d => ({ 
        id: d.id, _type: 'news', title: d.title, description: d.summary, url: `/news/${d.slug}`, imageUrl: d.thumbnail_url, date: d.published_at 
      })));
    }
    if (tab === 'all' || tab === 'badges') {
      const { data } = await supabase.from('badges').select('id, name, description, code, image_url').or(`name.ilike.${searchPattern},code.ilike.${searchPattern}`).limit(20);
      if (data) results.push(...data.map(d => ({ 
        id: d.id, _type: 'badge', title: d.name, description: d.description || d.code, url: `/badges`, imageUrl: d.image_url 
      })));
    }
    if (tab === 'all' || tab === 'profiles') {
      const { data } = await supabase.from('profiles').select('id, username, habbo_username, avatar_url, role').or(`username.ilike.${searchPattern},habbo_username.ilike.${searchPattern}`).limit(20);
      if (data) results.push(...data.map(d => ({ 
        id: d.id, _type: 'profile', title: d.username, description: d.habbo_username ? `Habbo: ${d.habbo_username} • Rol: ${d.role}` : `Rol: ${d.role}`, url: `/profile/${d.username}`, imageUrl: d.avatar_url || `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${d.habbo_username || d.username}&direction=2&head_direction=2&gesture=sml&size=m` 
      })));
    }
    if (tab === 'all' || tab === 'events') {
      const { data } = await supabase.from('events').select('id, title, description, image_url').ilike('title', searchPattern).eq('is_active', true).limit(20);
      if (data) results.push(...data.map(d => ({ 
        id: d.id, _type: 'event', title: d.title, description: d.description, url: `/events`, imageUrl: d.image_url 
      })));
    }
    if (tab === 'all' || tab === 'guides') {
      const { data } = await supabase.from('guides').select('id, title, summary, slug, image_url').ilike('title', searchPattern).eq('status', 'Published').limit(20);
      if (data) results.push(...data.map(d => ({ 
        id: d.id, _type: 'guide', title: d.title, description: d.summary, url: `/guides/${d.slug}`, imageUrl: d.image_url 
      })));
    }
    if (tab === 'all' || tab === 'market') {
      const { data } = await supabase.from('market_items').select('id, name, description, slug, image_url').ilike('name', searchPattern).limit(20);
      if (data) results.push(...data.map(d => ({ 
        id: d.id, _type: 'market', title: d.name, description: d.description, url: `/market/item/${d.slug}`, imageUrl: d.image_url 
      })));
    }
    if (tab === 'all' || tab === 'wiki') {
      const { data } = await supabase.from('wiki_items').select('id, name, description, slug, image_url').ilike('name', searchPattern).limit(20);
      if (data) results.push(...data.map(d => ({ 
        id: d.id, _type: 'wiki', title: d.name, description: d.description, url: `/wiki/item/${d.slug}`, imageUrl: d.image_url 
      })));
    }
    // TODO: Add magazines, groups when those tables/pages are fully ready
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <Newspaper size={16} className="text-[#38bdf8]" />;
      case 'magazine': return <BookOpen size={16} className="text-yellow-400" />;
      case 'badge': return <Medal size={16} className="text-orange-400" />;
      case 'event': return <Calendar size={16} className="text-purple-400" />;
      case 'profile': return <User size={16} className="text-green-400" />;
      case 'guide': return <FileText size={16} className="text-blue-400" />;
      case 'group': return <Users size={16} className="text-pink-400" />;
      case 'market': return <ShoppingBag size={16} className="text-emerald-400" />;
      case 'wiki': return <Package size={16} className="text-[#facc15]" />;
      default: return <Search size={16} className="text-gray-400" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'news': return 'Haber';
      case 'magazine': return 'Gazete';
      case 'badge': return 'Rozet';
      case 'event': return 'Etkinlik';
      case 'profile': return 'Kullanıcı';
      case 'guide': return 'Rehber';
      case 'group': return 'Grup';
      case 'market': return 'Pazar';
      case 'wiki': return 'Wiki';
      default: return 'Diğer';
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>ARAMA SONUÇLARI</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
          <strong className="text-white">"{q}"</strong> için {q.length >= 2 ? results.length : 0} sonuç bulundu
        </p>
      </div>

      {/* Search Input (Big) */}
      <div className="habbo-box bg-[#0a1325] p-4 rounded-[3px] border border-[#1e293b] mb-8 shadow">
        <form action="/search" method="GET" className="relative">
          <input type="hidden" name="tab" value={tab} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Ne aramak istersin?"
            className="w-full bg-[#050a14] text-white border border-[#1e293b] rounded-[2px] py-3 pl-12 pr-28 text-sm font-bold shadow-inner focus:outline-none focus:border-[#3b82f6] transition-colors"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 habbo-button success px-6 py-1.5 text-xs font-black uppercase tracking-wider">
            ARA
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 mb-6">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/search?q=${encodeURIComponent(q)}&tab=${t.id}`}
            className={`px-4 py-2 rounded-[2px] font-black text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
              tab === t.id 
                ? 'bg-[#facc15] text-black shadow' 
                : 'bg-[#0a1325] text-gray-400 hover:text-white border border-[#1e293b] hover:border-[#facc15]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Results */}
      {q.length < 2 ? (
        <div className="habbo-box bg-[#0a1325] border border-dashed border-[#1e293b] rounded-[3px] p-12 text-center flex flex-col items-center shadow">
          <Search size={40} className="text-gray-500 mb-4" />
          <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">ARAMAYA BAŞLA</h3>
          <p className="text-gray-400 text-xs font-medium">Arama yapmak için en az 2 karakter girmelisiniz.</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item) => (
            <Link
              href={item.url}
              key={`${item._type}-${item.id}`}
              className="bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 hover:border-[#facc15] hover:-translate-y-1 transition-all shadow flex flex-col group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-[2px] border border-[#1e293b] bg-[#050a14] overflow-hidden shrink-0 flex items-center justify-center relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover pixelated" />
                  ) : (
                    getTypeIcon(item._type)
                  )}
                  <div className="absolute top-0 right-0 bg-black/60 p-1 rounded-bl-[2px]">
                    {getTypeIcon(item._type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm truncate group-hover:text-[#facc15] transition-colors">{item.title}</h3>
                  <div className="inline-block mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-gray-400 font-bold uppercase tracking-wider">
                      {getTypeName(item._type)}
                    </span>
                  </div>
                </div>
              </div>
              {item.description && (
                <p className="text-gray-400 text-xs line-clamp-2 mt-auto text-left leading-relaxed">
                  {item.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="habbo-box bg-[#0a1325] border border-dashed border-[#1e293b] rounded-[3px] p-12 text-center flex flex-col items-center shadow">
          <AlertCircle size={40} className="text-gray-500 mb-4" />
          <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">SONUÇ BULUNAMADI</h3>
          <p className="text-gray-400 text-xs font-medium">
            "<strong className="text-white">{q}</strong>" kelimesi için sonuç bulamadık. Lütfen farklı kelimelerle tekrar deneyin.
          </p>
        </div>
      )}
    </div>
  );
}
