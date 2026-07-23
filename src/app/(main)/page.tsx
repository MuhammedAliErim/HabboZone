import FeaturedSlider from '@/components/FeaturedSlider';
import NewsCard from '@/components/NewsCard';
import MarketWidget from '@/components/MarketWidget';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { MessageCircle, Award, PenTool, Radio, Users, Sparkles, Megaphone, Clock, User, Coins } from 'lucide-react';
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

  // Fetch Latest Badges
  const { data: latestBadges } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto">
      
      {/* 2-Column Main Layout: Left (Main Content) - Right (Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Main Content) - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Welcome Box */}
          {!profile && (
            <div className="habbo-box bg-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 opacity-10 p-8 pointer-events-none transform group-hover:scale-110 transition-transform duration-1000">
                <Sparkles size={120} />
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-50 to-white flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <div className="w-24 h-24 bg-white rounded-full border border-blue-200 shadow-inner flex items-center justify-center shrink-0">
                   <img src="https://images.habbo.com/c_images/album1584/ADM.gif" alt="Welcome" className="w-12 object-contain" />
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <h1 className="text-2xl font-black text-blue-800 uppercase tracking-tight">HabboZone'a Hoş Geldin!</h1>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
                    Türkiye'nin en güncel ve en yenilikçi Habbo topluluğundasın. En son haberleri okuyabilir, forumda diğer Habbolarla tartışabilir, rozetleri inceleyebilir ve radyomuzda müzik dinleyebilirsin. Aramıza katılmak için hemen giriş yap!
                  </p>
                  <div className="pt-2">
                    <Link href="/login" className="habbo-button blue inline-block shadow-md">
                      HESAP OLUŞTUR / GİRİŞ YAP
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Featured Slider Area */}
          {featuredNews && featuredNews.length > 0 && (
            <section className="rounded-lg overflow-hidden border-4 border-[#334155] shadow-[0_4px_0_#94a3b8] bg-white">
              <FeaturedSlider items={featuredNews} />
            </section>
          )}

          {/* Latest News */}
          <section className="habbo-box">
            <div className="habbo-box-header blue flex justify-between items-center">
              <div className="flex items-center gap-2"><Megaphone size={16} /> HabboZone Haberleri</div>
              <Link href="/news" className="text-[10px] bg-black/20 hover:bg-black/40 px-2 py-1 rounded transition-colors shadow-inner">
                Tümünü Gör
              </Link>
            </div>
            <div className="p-4 bg-[#f8fafc] grid grid-cols-1 md:grid-cols-2 gap-4">
              {regularNews?.map((news: any) => (
                <div key={news.slug} className="bg-white border border-gray-200 rounded p-2.5 shadow-sm flex flex-col gap-2 hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                  <div className="h-32 rounded overflow-hidden relative border border-gray-200 shadow-inner">
                    <img src={news.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <Link href={`/news/${news.slug}`} className="font-bold text-[13px] text-gray-800 hover:text-blue-700 leading-tight">
                    {news.title}
                  </Link>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 mt-auto pt-2 border-t border-gray-100 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><User size={12}/> {(news.author as any)?.username || 'Admin'}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(news.published_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))}
              {(!regularNews || regularNews.length === 0) && (
                <div className="col-span-full p-8 text-center text-gray-500 font-bold">
                  Henüz haber bulunmuyor.
                </div>
              )}
            </div>
          </section>

          {/* Latest Forum Topics */}
          <section className="habbo-box">
            <div className="habbo-box-header orange flex justify-between items-center">
              <div className="flex items-center gap-2"><MessageCircle size={16} /> Forum'da Konuşulanlar</div>
              <Link href="/forum" className="text-[10px] bg-black/20 hover:bg-black/40 px-2 py-1 rounded transition-colors shadow-inner">
                Foruma Git
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100 bg-[#f8fafc]">
              {latestTopics?.map((topic: any) => (
                <Link 
                  key={topic.id} 
                  href={`/forum/topic/${topic.slug}`}
                  className={`flex items-center p-3 gap-3 bg-white hover:bg-orange-50 transition-colors group ${topic.is_pinned ? 'bg-orange-50/30' : ''}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shadow-inner">
                      <img 
                        src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(topic.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=m`}
                        alt="avatar"
                        className="w-12 h-12 -mt-2"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[13px] text-gray-800 truncate group-hover:text-orange-600 transition-colors flex items-center gap-2">
                      {topic.is_pinned && <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm">SABİT</span>}
                      {topic.title}
                    </h3>
                    <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">
                      {(topic.author as any)?.username} <span className="text-gray-300 mx-1">•</span> {new Date(topic.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded border border-gray-200 shadow-inner min-w-[50px] group-hover:border-orange-200 group-hover:bg-orange-100/50">
                    <span className="font-black text-gray-700">{(topic.replies as any)?.[0]?.count || 0}</span>
                    <span className="text-[9px] uppercase font-bold text-gray-400">Yanıt</span>
                  </div>
                </Link>
              ))}
              {(!latestTopics || latestTopics.length === 0) && (
                <div className="p-8 text-center text-gray-500 font-bold">
                  Henüz konu açılmamış.
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column (Sidebar Widgets) - 4 cols */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Radio Status Widget */}
          <div className="habbo-box">
             <div className="habbo-box-header" style={{backgroundColor: '#6b21a8', borderBottomColor: '#581c87'}}>
               <div className="flex items-center gap-2"><Radio size={16} /> Yayında Olan</div>
             </div>
             <div className="bg-white p-0 relative overflow-hidden">
                <div className="h-16 bg-gradient-to-r from-purple-100 to-fuchsia-100 absolute top-0 w-full z-0 border-b border-purple-200"></div>
                <div className="p-4 relative z-10 flex flex-col items-center pt-6">
                    <div className="w-16 h-16 bg-white rounded-full border-2 border-purple-300 shadow-md flex items-center justify-center mb-3">
                        <img src="https://images.habbo.com/c_images/album1584/ADM.gif" alt="DJ" className="w-10 object-contain" />
                    </div>
                    <div className="font-black text-lg text-purple-900 leading-none mb-1">DJ AutoDJ</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 mb-4">Şu an Canlı</div>
                    
                    <div className="w-full bg-gray-50 rounded border border-gray-200 p-3 text-center shadow-inner">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Çalan Şarkı</div>
                        <div className="text-xs font-bold text-gray-700 truncate">HabboZone Hits - Karışık Yabancı</div>
                    </div>
                </div>
             </div>
          </div>

          {/* User Widget */}
          {profile && (
            <div className="habbo-box">
              <div className="habbo-box-header green">Kullanıcı Bilgileri</div>
              <div className="p-4 bg-white flex items-center gap-4">
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 shadow-inner">
                  <HabboAvatar username={profile.habbo_username || 'Habbo'} size="m" headDirection={3} direction={3} className="w-16 h-16 -mt-4" />
                </div>
                <div>
                  <div className="font-black text-lg text-gray-800 leading-none mb-1">{profile.username}</div>
                  <div className="text-[11px] text-gray-500 italic mb-2">"{profile.motto || 'Motto yok'}"</div>
                  <div className="flex gap-2 text-[10px] font-black uppercase tracking-wider text-gray-600">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border border-yellow-200"><Coins size={10}/> {profile.hz_points || 0} HZ Puanı</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Magazine Showcase */}
          {latestMagazine && (
            <div className="habbo-box">
              <div className="habbo-box-header dark flex items-center gap-2"><PenTool size={16} /> Haftanın Dergisi</div>
              <div className="bg-[#f8fafc] p-5 flex flex-col items-center">
                <div className="w-32 h-44 bg-white rounded shadow-lg border-4 border-white transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 mb-4 overflow-hidden relative group">
                  <img 
                    src={latestMagazine.cover_image_url} 
                    alt={latestMagazine.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-xs uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Okumak için tıkla</span>
                  </div>
                </div>
                <h4 className="font-black text-[13px] text-gray-800 text-center leading-tight mb-1">{latestMagazine.title}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Sayı #{latestMagazine.issue_number}</p>
                <Link href={`/magazines/${latestMagazine.id}`} className="habbo-button blue text-xs w-full text-center py-2 shadow-md">
                  Hemen Oku
                </Link>
              </div>
            </div>
          )}

          {/* Economy/Market Widget */}
          <div className="habbo-box">
             <div className="habbo-box-header" style={{backgroundColor: '#795548', borderBottomColor: '#5D4037'}}>
               <div className="flex items-center gap-2"><Coins size={16} /> Değerler & Ekonomi</div>
             </div>
             <div className="bg-white">
                <MarketWidget />
             </div>
          </div>

          {/* Latest Badges */}
          <div className="habbo-box">
            <div className="habbo-box-header" style={{backgroundColor: '#E91E63', borderBottomColor: '#C2185B'}}>
              <div className="flex items-center gap-2"><Award size={16} /> Son Eklenen Rozetler</div>
            </div>
            <div className="bg-white p-4">
              <div className="grid grid-cols-4 gap-2">
                {latestBadges?.map((badge: any) => (
                  <div key={badge.id} className="flex flex-col items-center justify-center group cursor-help bg-gray-50 border border-gray-100 rounded p-2 hover:border-pink-300 hover:bg-pink-50 transition-colors shadow-sm aspect-square" title={badge.name}>
                    <img src={badge.image_url} alt={badge.name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform drop-shadow-sm" />
                  </div>
                ))}
              </div>
              <Link href="/badges" className="block text-center text-[10px] font-black uppercase tracking-widest text-[#E91E63] mt-4 hover:text-[#C2185B] transition-colors bg-pink-50 py-2 rounded">
                Tüm Rozetleri İncele
              </Link>
            </div>
          </div>
          
        </aside>

      </div>
    </div>
  );
}
