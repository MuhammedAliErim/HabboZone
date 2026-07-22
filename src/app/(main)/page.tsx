import FeaturedSlider from '@/components/FeaturedSlider';
import NewsCard from '@/components/NewsCard';
import MarketWidget from '@/components/MarketWidget';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { MessageCircle, Award, PenTool, Radio } from 'lucide-react';

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
    <div className="py-6 space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto">
      
      {/* Featured Slider Area */}
      {featuredNews && featuredNews.length > 0 && (
        <section className="mb-6 rounded-lg overflow-hidden border-4 border-white shadow-md bg-white">
          <FeaturedSlider items={featuredNews} />
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: News & Forums */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Latest News */}
          <section className="habbo-box">
            <div className="habbo-box-header blue flex justify-between items-center">
              <span>Son Haberler</span>
              <Link href="/news" className="text-[10px] bg-black/20 hover:bg-black/40 px-2 py-1 rounded transition-colors">
                Tümünü Gör
              </Link>
            </div>
            <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
              {regularNews?.map((news: any) => (
                <div key={news.slug} className="bg-white border border-gray-200 rounded p-2 shadow-sm flex flex-col gap-2 hover:border-primary transition-colors group">
                  <div className="h-32 rounded overflow-hidden relative">
                    <img src={news.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <Link href={`/news/${news.slug}`} className="font-bold text-sm text-gray-800 hover:text-primary leading-tight">
                    {news.title}
                  </Link>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 mt-auto pt-2 border-t border-gray-100">
                    <span>{(news.author as any)?.username || 'Admin'}</span>
                    <span>{new Date(news.published_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))}
              {(!regularNews || regularNews.length === 0) && (
                <div className="col-span-full p-8 text-center text-gray-500">
                  Henüz haber bulunmuyor.
                </div>
              )}
            </div>
          </section>

          {/* Latest Forum Topics */}
          <section className="habbo-box">
            <div className="habbo-box-header orange flex justify-between items-center">
              <span>Forum'da Konuşulanlar</span>
              <Link href="/forum" className="text-[10px] bg-black/20 hover:bg-black/40 px-2 py-1 rounded transition-colors">
                Foruma Git
              </Link>
            </div>
            
            <div className="divide-y divide-gray-200 bg-white">
              {latestTopics?.map((topic: any) => (
                <Link 
                  key={topic.id} 
                  href={`/forum/topic/${topic.slug}`}
                  className={`flex items-center p-3 gap-3 hover:bg-orange-50 transition-colors group ${topic.is_pinned ? 'bg-orange-50/50' : ''}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <img 
                        src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(topic.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=s`}
                        alt="avatar"
                        className="w-12 h-12 -mt-2"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-800 truncate group-hover:text-orange-600 transition-colors flex items-center gap-2">
                      {topic.is_pinned && <span className="bg-orange-500 text-white text-[9px] px-1 rounded uppercase">Sabit</span>}
                      {topic.title}
                    </h3>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Yazar: <span className="font-bold text-gray-700">{(topic.author as any)?.username}</span>
                      {' • '}
                      {new Date(topic.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded border border-gray-200 min-w-[50px]">
                    <span className="font-bold text-gray-700">{(topic.replies as any)?.[0]?.count || 0}</span>
                    <span className="text-[9px] uppercase">Yanıt</span>
                  </div>
                </Link>
              ))}
              {(!latestTopics || latestTopics.length === 0) && (
                <div className="p-8 text-center text-gray-500">
                  Henüz konu açılmamış.
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Widgets */}
        <aside className="space-y-6">
          
          {/* User Widget */}
          {profile && (
            <div className="habbo-box">
              <div className="habbo-box-header green">Benim Bilgilerim</div>
              <div className="p-4 bg-white flex items-center gap-4 border-b border-gray-100">
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <img src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${profile.habbo_username || 'Habbo'}&direction=3&head_direction=3&gesture=sml&size=m`} alt="avatar" className="w-20 h-20 -mt-2" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-800">{profile.username}</div>
                  <div className="text-xs text-gray-500 italic mb-2">{profile.motto || 'Motto yok'}</div>
                  <div className="flex gap-2 text-xs font-bold text-gray-600">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-300 shadow-sm">{profile.hz_points || 0} HZ Puanı</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Magazine Showcase */}
          {latestMagazine && (
            <div className="habbo-box">
              <div className="habbo-box-header dark">Haftanın Dergisi</div>
              <div className="bg-gray-100 p-4 flex flex-col items-center">
                <div className="w-32 h-44 bg-white rounded shadow-md border-2 border-gray-300 transform -rotate-2 hover:rotate-0 transition-transform mb-4 overflow-hidden">
                  <img 
                    src={latestMagazine.cover_image_url} 
                    alt={latestMagazine.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-sm text-gray-800 text-center leading-tight mb-1">{latestMagazine.title}</h4>
                <p className="text-[10px] text-gray-500 mb-3">Sayı #{latestMagazine.issue_number}</p>
                <Link href={`/magazines/${latestMagazine.id}`} className="habbo-button blue text-xs w-full text-center py-2">
                  Hemen Oku
                </Link>
              </div>
            </div>
          )}

          {/* Latest Badges */}
          <div className="habbo-box">
            <div className="habbo-box-header" style={{backgroundColor: '#E91E63', borderBottomColor: '#C2185B'}}>Son Eklenen Rozetler</div>
            <div className="bg-white p-4">
              <div className="grid grid-cols-3 gap-2">
                {latestBadges?.map((badge: any) => (
                  <div key={badge.id} className="flex flex-col items-center gap-1 group cursor-help bg-gray-50 border border-gray-100 rounded p-2 hover:border-pink-300 hover:bg-pink-50 transition-colors" title={badge.name}>
                    <img src={badge.image_url} alt={badge.name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform drop-shadow-sm" />
                  </div>
                ))}
              </div>
              <Link href="/badges" className="block text-center text-xs font-bold text-[#E91E63] mt-4 hover:underline">
                Tüm Rozetleri İncele →
              </Link>
            </div>
          </div>
          
          {/* Economy/Market Widget */}
          <div className="habbo-box">
             <div className="habbo-box-header" style={{backgroundColor: '#795548', borderBottomColor: '#5D4037'}}>Değerler & Ekonomi</div>
             <div className="bg-white">
                <MarketWidget />
             </div>
          </div>
          
        </aside>

      </div>
    </div>
  );
}
