import FeaturedSlider from '@/components/FeaturedSlider';
import NewsCard from '@/components/NewsCard';
import MarketWidget from '@/components/MarketWidget';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { MessageCircle, Award, PenTool, Radio, Users, Sparkles, Megaphone, Clock, User, Coins, Flame, Monitor, AlignLeft, BookOpen, Newspaper } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export const revalidate = 60; // Cache for 60 seconds

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  // Fetch Featured News
  const { data: featuredNews } = await supabase
    .from('news')
    .select('title, slug, summary, thumbnail_url')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(5);

  // Fetch Regular News
  const { data: regularNews } = await supabase
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
    .eq('is_featured', false)
    .order('published_at', { ascending: false })
    .limit(6);

  // Fetch Latest Magazine
  const { data: latestMagazine } = await supabase
    .from('magazines')
    .select('*')
    .order('issue_number', { ascending: false })
    .limit(1)
    .single();

  // Fetch Latest Forum Topics
  const { data: latestTopics } = await supabase
    .from('topics')
    .select(`
      id,
      title,
      slug,
      is_pinned,
      created_at,
      author:profiles!topics_author_id_fkey(username, habbo_username),
      replies(count)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="animate-in fade-in duration-700 pb-12">
      
      {/* Hero Section (Dark Theme Cityscape) */}
      <section className="relative w-full overflow-hidden bg-[#0b1120] min-h-[500px] flex items-center justify-center border-b border-[#1e293b]">
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            imageRendering: 'pixelated'
          }}
        />
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0b1120] via-transparent to-[#0b1120]"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0b1120] to-transparent opacity-80"></div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            
            <div className="font-black tracking-tighter leading-none transform -skew-x-6 mb-6">
                <div className="text-[#f59e0b] text-6xl md:text-8xl drop-shadow-[0_4px_0_rgba(0,0,0,1)] -mb-2">HABBO</div>
                <div className="text-white text-6xl md:text-8xl drop-shadow-[0_4px_0_rgba(0,0,0,1)]">ZONE</div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Habbo dünyasından en son haberler!
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mb-8 font-medium">
                Habbo Zone, Habbo hayranları için en kapsamlı haber, rehber, fan sitesi ve topluluk platformudur!
            </p>

            <div className="flex items-center gap-4">
                <Link href="/register" className="habbo-button text-lg px-8 py-3 shadow-[0_4px_15px_rgba(34,197,94,0.3)]">
                    HEMEN KATIL
                </Link>
                <Link href="https://www.habbo.com.tr" target="_blank" className="habbo-button blue text-lg px-8 py-3 shadow-[0_4px_15px_rgba(59,130,246,0.3)]">
                    HABBO HOTEL
                </Link>
            </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-6 mt-[-40px] relative z-30 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Featured Slider Area */}
          {featuredNews && featuredNews.length > 0 && (
            <section className="rounded-xl overflow-hidden border border-[#1e293b] shadow-2xl bg-[#131c31]">
              <FeaturedSlider items={featuredNews} />
            </section>
          )}

          {/* Latest News */}
          <section className="habbo-box">
            <div className="habbo-box-header flex justify-between items-center">
              <div className="flex items-center gap-2"><AlignLeft size={18} className="text-red-400" /> SON HABERLER</div>
              <Link href="/news" className="text-[10px] text-gray-400 hover:text-white transition-colors">
                TÜM HABERLER →
              </Link>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {regularNews?.map((news: any) => (
                <Link key={news.slug} href={`/news/${news.slug}`} className="bg-[#0b1120] border border-[#1e293b] rounded-lg p-3 flex gap-3 hover:border-gray-500 transition-colors group">
                  <div className="w-24 h-24 shrink-0 rounded overflow-hidden relative border border-[#1e293b]">
                    <img src={news.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Yeni</div>
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <h3 className="font-bold text-sm text-gray-200 group-hover:text-white leading-tight line-clamp-2">
                        {news.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                        {news.summary || 'Habbo dünyasından en güncel gelişmeler ve daha fazlası...'}
                    </p>
                    <div className="text-[10px] text-gray-500 mt-2 font-bold">
                        {new Date(news.published_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Magazine Section */}
          {latestMagazine && (
            <section className="habbo-box">
              <div className="habbo-box-header flex justify-between items-center">
                <div className="flex items-center gap-2"><Newspaper size={18} className="text-yellow-400" /> HABBO ZONE GAZETESİ</div>
                <Link href="/magazines" className="text-[10px] text-gray-400 hover:text-white transition-colors">
                  TÜM SAYILAR →
                </Link>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#131c31] to-[#0b1120] flex flex-col md:flex-row items-center gap-8">
                  <div className="w-40 shrink-0">
                      <div className="w-full aspect-[3/4] bg-white rounded-md shadow-2xl border-4 border-gray-800 relative group overflow-hidden">
                          <img src={latestMagazine.cover_image_url} alt={latestMagazine.title} className="w-full h-full object-cover" />
                      </div>
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-3">
                      <h3 className="text-2xl font-black text-white">{latestMagazine.title}</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                          Habbo dünyasındaki en sıcak gelişmeler, röportajlar, odalar ve daha fazlası bu sayıda seni bekliyor!
                      </p>
                      <div className="pt-2">
                          <Link href={`/magazines/${latestMagazine.id}`} className="habbo-button yellow inline-block">
                              HEMEN OKU
                          </Link>
                      </div>
                  </div>
              </div>
            </section>
          )}

        </div>

        {/* Right Column - 4 cols */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Hot Topics */}
          <div className="habbo-box">
            <div className="habbo-box-header flex justify-between items-center">
              <div className="flex items-center gap-2"><Flame size={18} className="text-orange-500" /> SICAK KONULAR</div>
              <Link href="/forum" className="text-[10px] text-gray-400 hover:text-white transition-colors">
                TÜMÜ →
              </Link>
            </div>
            <div className="p-3 divide-y divide-[#1e293b]">
              {latestTopics?.map((topic: any) => (
                <Link key={topic.id} href={`/forum/topic/${topic.slug}`} className="flex items-center gap-3 p-3 hover:bg-[#0b1120] transition-colors group">
                    <Flame size={16} className="text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white truncate">{topic.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Online Users Mockup */}
          <div className="habbo-box">
            <div className="habbo-box-header flex justify-between items-center">
              <div className="flex items-center gap-2"><Users size={18} className="text-green-400" /> ÇEVRİMİÇİ KULLANICILAR</div>
            </div>
            <div className="p-4 flex items-center justify-between">
                <div className="flex -space-x-3">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#131c31] overflow-hidden flex items-center justify-center shrink-0">
                            <img src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=Habbo&direction=2&head_direction=2&gesture=sml&size=s`} className="w-10 h-10 object-cover" />
                        </div>
                    ))}
                </div>
                <div className="text-sm font-black text-gray-400">+248</div>
            </div>
          </div>

          {/* Radio Status Widget (Dark Theme) */}
          <div className="habbo-box">
             <div className="habbo-box-header flex items-center gap-2">
               <Radio size={18} className="text-purple-400" /> HABBO RADYO
             </div>
             <div className="p-4 bg-[#0b1120] flex items-center gap-4 relative overflow-hidden">
                <div className="w-16 h-16 bg-[#131c31] rounded border border-[#1e293b] flex items-center justify-center shrink-0">
                    <img src="https://images.habbo.com/c_images/album1584/ADM.gif" alt="DJ" className="w-10 object-contain drop-shadow-md" />
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Şu An Çalan</div>
                    <div className="font-bold text-sm text-white mb-1">Habbo FM - Yaz Özel</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1"><User size={10} /> DJ AutoDJ</div>
                </div>
             </div>
          </div>

          {/* Quick Links */}
          <div className="habbo-box">
             <div className="habbo-box-header flex items-center gap-2">
               <Monitor size={18} className="text-blue-400" /> HIZLI ERİŞİM
             </div>
             <div className="p-4 grid grid-cols-3 gap-2 text-center">
                 <Link href="https://habbo.com.tr" target="_blank" className="flex flex-col items-center gap-2 p-2 hover:bg-[#0b1120] rounded-lg transition-colors group">
                     <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center group-hover:bg-blue-900 transition-colors">
                        <Monitor size={20} className="text-blue-400" />
                     </div>
                     <span className="text-[10px] font-bold text-gray-400">Habbo Hotel</span>
                 </Link>
                 <Link href="/guides" className="flex flex-col items-center gap-2 p-2 hover:bg-[#0b1120] rounded-lg transition-colors group">
                     <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center group-hover:bg-purple-900 transition-colors">
                        <BookOpen size={20} className="text-purple-400" />
                     </div>
                     <span className="text-[10px] font-bold text-gray-400">Rehberler</span>
                 </Link>
                 <Link href="/forum" className="flex flex-col items-center gap-2 p-2 hover:bg-[#0b1120] rounded-lg transition-colors group">
                     <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center group-hover:bg-green-900 transition-colors">
                        <MessageCircle size={20} className="text-green-400" />
                     </div>
                     <span className="text-[10px] font-bold text-gray-400">Forum</span>
                 </Link>
             </div>
          </div>
          
        </aside>

      </div>
    </div>
  );
}
