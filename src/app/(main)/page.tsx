import FeaturedSlider from '@/components/FeaturedSlider';
import NewsCard from '@/components/NewsCard';
import MarketWidget from '@/components/MarketWidget';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { MessageCircle, Award, Eye, Calendar, Pin } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function Home() {
  const supabase = await createClient();

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
    .limit(4);

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

  // Fetch Latest Badges
  const { data: latestBadges } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="py-8 space-y-16 animate-in fade-in duration-700">
      
      {/* Featured Slider */}
      {featuredNews && featuredNews.length > 0 && (
        <section>
          <FeaturedSlider items={featuredNews} />
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: News & Forums (Takes up 2/3 space on large screens) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Latest News */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-4 border-black/10 dark:border-white/10 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-4 h-4 bg-primary inline-block pixel-borders"></span>
                Son Haberler
              </h2>
              <Link href="/news" className="text-sm font-bold text-primary hover:underline">Tümünü Gör →</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularNews?.map((news: any) => (
                <NewsCard key={news.slug} news={news} />
              ))}
              {(!regularNews || regularNews.length === 0) && (
                <div className="col-span-full p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-white/50">
                  Henüz haber bulunmuyor.
                </div>
              )}
            </div>
          </section>

          {/* Latest Forum Topics */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-4 border-black/10 dark:border-white/10 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-4 h-4 bg-[#FF9800] inline-block pixel-borders"></span>
                Forumda Neler Oluyor?
              </h2>
              <Link href="/forum" className="text-sm font-bold text-[#FF9800] hover:underline">Foruma Git →</Link>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg divide-y divide-white/10">
              {latestTopics?.map((topic: any) => (
                <Link 
                  key={topic.id} 
                  href={`/forum/topic/${topic.slug}`}
                  className={`flex items-center p-4 gap-4 hover:bg-white/5 transition-colors group ${topic.is_pinned ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex-shrink-0">
                    <img 
                      src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(topic.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=s`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full bg-black/20 border border-white/10"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate group-hover:text-[#FF9800] transition-colors flex items-center gap-2">
                      {topic.is_pinned && <Pin size={14} className="text-[#FF9800]" />}
                      {topic.title}
                    </h3>
                    <div className="text-xs text-white/50 mt-1">
                      <span className="font-bold text-white/70">{(topic.author as any)?.username}</span>
                      {' • '}
                      <span>{new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white/50 bg-black/20 px-3 py-1 rounded-full">
                    <MessageCircle size={14} />
                    <span>{(topic.replies as any)?.[0]?.count || 0}</span>
                  </div>
                </Link>
              ))}
              {(!latestTopics || latestTopics.length === 0) && (
                <div className="p-8 text-center text-white/50">
                  Henüz konu açılmamış.
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Widgets */}
        <aside className="space-y-8">
          
          {/* Magazine Showcase */}
          {latestMagazine && (
            <div className="bg-white/10 dark:bg-black/20 p-6 rounded-2xl border-4 border-white/20 shadow-lg relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
              
              <h3 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
                <span className="text-2xl">📖</span> Son Dergi
              </h3>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-48 h-64 bg-black/20 rounded-lg overflow-hidden shadow-2xl border-2 border-white/30 transform rotate-[-2deg] group-hover:rotate-0 transition-transform mb-6">
                  <img 
                    src={latestMagazine.cover_image_url} 
                    alt={latestMagazine.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-lg mb-2">{latestMagazine.title}</h4>
                <p className="text-sm opacity-80 mb-6">Sayı #{latestMagazine.issue_number} • En son çıkan sürüm</p>
                
                <Link 
                  href={`/magazines/${latestMagazine.id}`}
                  className="w-full py-3 bg-primary text-white font-bold uppercase tracking-widest rounded-lg pixel-borders hover:bg-primary/90 transition-colors text-center shadow-lg"
                >
                  Hemen Oku
                </Link>
              </div>
            </div>
          )}

          {/* Latest Badges */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <Award className="text-[#E91E63]" /> Son Rozetler
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {latestBadges?.map((badge: any) => (
                <div key={badge.id} className="flex flex-col items-center gap-2 group cursor-help" title={badge.name}>
                  <div className="w-16 h-16 bg-black/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-[#E91E63] group-hover:bg-[#E91E63]/10 transition-colors shadow-inner">
                    <img src={badge.image_url} alt={badge.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/badges" className="block text-center text-sm font-bold text-[#E91E63] mt-6 hover:underline">
              Tüm Rozetleri İncele →
            </Link>
          </div>
          
          {/* Economy/Market Widget */}
          <MarketWidget />
        </aside>

      </div>
    </div>
  );
}
