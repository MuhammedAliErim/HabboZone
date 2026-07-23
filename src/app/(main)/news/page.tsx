import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { MessageCircle, Eye, Tag, ChevronRight, Clock } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function NewsPage() {
  const supabase = await createClient();

  // Fetch News
  const { data: newsItems } = await supabase
    .from('news')
    .select(`
      title, 
      slug, 
      summary, 
      thumbnail_url, 
      published_at,
      author:profiles!news_author_id_fkey(username, habbo_username)
    `)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  // Mock Categories and Most Read for the UI Kit
  const categories = [
      { name: 'Tümü', icon: '🌟' },
      { name: 'Güncellemeler', icon: '🔧' },
      { name: 'Etkinlikler', icon: '🎉' },
      { name: 'Habbo Gazetesi', icon: '📰' },
      { name: 'Röportajlar', icon: '🎤' },
      { name: 'Rehberler', icon: '📚' },
      { name: 'Duyurular', icon: '📢' },
  ];

  const mostRead = [
      'Habbo 2024 Yaz Güncellemesi',
      'Retro Günleri Başlıyor!',
      'Plaj Partisi Etkinliği',
      'Habbo Gazetesi #11',
      'Yeni Kıyafetler Geldi!'
  ];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-8 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/background_right_coffee_1.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1400px] w-full mx-auto">
            <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">HABERLER</h1>
            <p className="text-[#94a3b8] text-sm font-medium">Habbo dünyasından en son haberler!</p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        
        {/* Left Column - News List */}
        <div className="space-y-4">
            {newsItems?.map((news: any) => (
              <Link key={news.slug} href={`/news/${news.slug}`} className="habbo-box habbo-card-hover p-4 flex flex-col sm:flex-row gap-5 group">
                <div className="w-full sm:w-[240px] h-[140px] rounded-md overflow-hidden border border-[#1e293b] shrink-0 relative">
                  <Image src={news.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} alt={news.title} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 left-2">
                      <span className="habbo-tag blue bg-blue-600/90 text-white border-blue-500 backdrop-blur-sm shadow-sm">HABER</span>
                  </div>
                </div>
                <div className="flex flex-col py-1 flex-1">
                    <h2 className="font-black text-white text-xl group-hover:text-[#facc15] transition-colors leading-tight mb-2">
                        {news.title}
                    </h2>
                    <p className="text-[#94a3b8] text-sm line-clamp-2 mb-4">
                        {news.summary}
                    </p>
                    <div className="flex justify-between items-center text-[11px] text-[#64748b] font-bold mt-auto pt-4 border-t border-[#1e293b]">
                        <span>{new Date(news.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 hover:text-white transition-colors"><Clock size={14}/> 3 dk</span>
                            <span className="flex items-center gap-1 hover:text-white transition-colors"><Eye size={14}/> 35</span>
                            <span className="flex items-center gap-1 hover:text-white transition-colors"><MessageCircle size={14}/> 12</span>
                        </div>
                    </div>
                </div>
              </Link>
            ))}

            {(!newsItems || newsItems.length === 0) && (
              <div className="habbo-box p-8 text-center text-gray-500 font-bold">
                Henüz hiç haber eklenmemiş.
              </div>
            )}

            {/* Pagination Mockup */}
            <div className="flex items-center justify-center gap-2 pt-6">
                <button className="habbo-button secondary px-3 py-1.5 opacity-50 cursor-not-allowed text-[10px]">&lt;</button>
                <button className="habbo-button px-3 py-1.5 text-[10px]">1</button>
                <button className="habbo-button outline px-3 py-1.5 text-[10px]">2</button>
                <button className="habbo-button outline px-3 py-1.5 text-[10px]">3</button>
                <button className="habbo-button outline px-3 py-1.5 text-[10px]">4</button>
                <span className="text-white text-[10px] font-bold">...</span>
                <button className="habbo-button outline px-3 py-1.5 text-[10px]">12</button>
                <button className="habbo-button secondary px-3 py-1.5 text-[10px]">&gt;</button>
            </div>
        </div>

        {/* Right Column - Sidebar */}
        <aside className="space-y-6">
            
            {/* Categories */}
            <div className="habbo-box">
                <div className="habbo-box-header">
                    KATEGORİLER
                </div>
                <div className="p-2 flex flex-col">
                    {categories.map((cat, idx) => (
                        <Link key={cat.name} href="#" className={`flex items-center gap-3 p-3 rounded-md transition-colors ${idx === 0 ? 'bg-[#1e293b] text-white' : 'text-[#94a3b8] hover:bg-[#0a1325] hover:text-white'}`}>
                            <span className="text-lg leading-none">{cat.icon}</span>
                            <span className="text-sm font-bold flex-1">{cat.name}</span>
                            {idx === 0 && <ChevronRight size={16} className="text-[#facc15]" />}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Most Read */}
            <div className="habbo-box">
                <div className="habbo-box-header">
                    EN ÇOK OKUNANLAR
                </div>
                <div className="p-4 flex flex-col gap-3">
                    {mostRead.map((item, idx) => (
                        <Link key={idx} href="#" className="flex gap-3 group">
                            <span className="text-[#facc15] font-black text-sm">{idx + 1}.</span>
                            <span className="text-[#94a3b8] text-sm font-bold group-hover:text-white transition-colors">{item}</span>
                        </Link>
                    ))}
                </div>
            </div>

        </aside>

      </div>
    </div>
  );
}
