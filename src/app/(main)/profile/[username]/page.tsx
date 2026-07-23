import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Users, FileText, MessageCircle, MapPin, Calendar, Award } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export const revalidate = 60;

export default async function ProfilePage({ params, searchParams }: { params: Promise<{ username: string }>, searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const username = decodeURIComponent(resolvedParams.username);
  const currentTab = resolvedSearchParams?.tab || 'profil';
  
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user && user.id === profile.id;

  const { data: topics } = await supabase
    .from('topics')
    .select('id, title, slug, created_at, replies(count)')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(4);

  let news: any[] = [];
  if (['Admin', 'Editor', 'Journalist', 'Owner'].includes(profile.role)) {
    const { data } = await supabase
      .from('news')
      .select('id, title, slug, published_at')
      .eq('author_id', profile.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(4);
    if (data) {
      news = data;
    }
  }

  // Fetch Badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', profile.id)
    .limit(8);
    
  const badges = userBadges ? userBadges.map(ub => ub.badge) : [];

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar - User Info */}
        <div className="w-full lg:w-[300px] shrink-0 space-y-4">
            
            <div className="habbo-box overflow-hidden relative">
                
                {/* Banner / Avatar Area */}
                <div className="h-[120px] bg-[#050a14] border-b border-[#1e293b] relative overflow-hidden flex items-end justify-center">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")', backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] to-transparent"></div>
                    
                    <div className="relative z-10 -mb-4">
                        <HabboAvatar 
                            username={profile.habbo_username || 'Habbo'} 
                            direction={3} 
                            headDirection={3} 
                            size="l"
                        />
                    </div>
                </div>

                {/* Info Area */}
                <div className="p-5 pt-6 text-center">
                    <h1 className="text-2xl font-black text-white mb-1">{profile.username}</h1>
                    <p className="text-[#64748b] text-[11px] font-bold flex items-center justify-center gap-1.5 mb-4">
                        <Calendar size={12} />
                        Kayıt: {new Date(profile.created_at).toLocaleDateString('tr-TR')}
                    </p>

                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                        <span className="px-2 py-1 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 text-[10px] font-bold rounded">
                            {profile.role.toUpperCase()}
                        </span>
                        {profile.habbo_username && (
                            <span className="px-2 py-1 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 text-[10px] font-bold rounded flex items-center gap-1">
                                HABBO: {profile.habbo_username}
                            </span>
                        )}
                    </div>
                    
                    {isOwnProfile && (
                        <div className="w-full px-4 pb-4">
                            <Link href="/settings" className="w-full block text-center bg-[#1e293b] hover:bg-[#334155] text-white text-[11px] font-bold py-2 rounded transition-colors border border-black shadow-[0_2px_0_#000]">
                                AYARLARI DÜZENLE
                            </Link>
                        </div>
                    )}
                </div>

                <div className="p-5 pt-0">
                    <div className="text-left mb-5">
                        <h3 className="text-[10px] text-[#64748b] font-bold mb-1.5 uppercase tracking-wider">Hakkımda</h3>
                        <p className="text-[#94a3b8] text-[12px] bg-[#050a14] p-3 rounded border border-[#1e293b]">
                            Merhaba! Ben {profile.username}. HabboZone'a hoş geldiniz.
                        </p>
                    </div>

                    <div className="text-left">
                        <h3 className="text-[10px] text-[#64748b] font-bold mb-2 uppercase tracking-wider flex items-center gap-1">
                            <Award size={12} /> Seçili Rozetler
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 bg-[#050a14] p-2 rounded border border-[#1e293b] min-h-[58px]">
                            {badges.length > 0 ? (
                                badges.map((b: any, i: number) => (
                                    <div key={i} title={b?.name || ''} className="w-10 h-10 bg-[#050a14] rounded border border-[#1e293b] flex items-center justify-center hover:bg-[#1e293b] transition-colors cursor-pointer group">
                                        <img src={b?.image_url} alt="Badge" className="group-hover:scale-110 transition-transform pixelated" />
                                    </div>
                                ))
                            ) : (
                                <span className="text-[#64748b] text-[11px] font-bold px-2">Kullanıcının henüz rozeti yok.</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>

        </div>

        {/* Right Content Area */}
        <div className="flex-1">
            
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#1e293b] pb-4 mb-6">
                <Link href={`/profile/${username}?tab=profil`} className={`px-6 py-2.5 font-bold text-[12px] rounded transition-colors ${currentTab === 'profil' ? 'bg-[#1e293b] text-white border border-[#334155]' : 'text-[#64748b] hover:text-white hover:bg-[#0a1325]'}`}>
                    PROFİL
                </Link>
                <Link href={`/profile/${username}?tab=arkadaslar`} className={`px-6 py-2.5 font-bold text-[12px] rounded transition-colors ${currentTab === 'arkadaslar' ? 'bg-[#1e293b] text-white border border-[#334155]' : 'text-[#64748b] hover:text-white hover:bg-[#0a1325]'}`}>
                    ARKADAŞLAR
                </Link>
                <Link href={`/profile/${username}?tab=rozetler`} className={`px-6 py-2.5 font-bold text-[12px] rounded transition-colors ${currentTab === 'rozetler' ? 'bg-[#1e293b] text-white border border-[#334155]' : 'text-[#64748b] hover:text-white hover:bg-[#0a1325]'}`}>
                    ROZETLER
                </Link>
                <Link href={`/profile/${username}?tab=odalar`} className={`px-6 py-2.5 font-bold text-[12px] rounded transition-colors ${currentTab === 'odalar' ? 'bg-[#1e293b] text-white border border-[#334155]' : 'text-[#64748b] hover:text-white hover:bg-[#0a1325]'}`}>
                    ODALAR
                </Link>
            </div>

            {/* Profile Content */}
            {currentTab === 'profil' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Recent Forum Topics */}
                <div className="habbo-box p-4">
                    <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <MessageCircle size={16} className="text-[#a855f7]" /> 
                        Son Topluluk Konuları
                    </h2>
                    
                    <div className="space-y-2">
                        {topics && topics.length > 0 ? (
                            topics.map(topic => (
                                <Link href={`/forum/topic/${topic.slug}`} key={topic.id} className="block bg-[#050a14] border border-[#1e293b] p-3 rounded hover:border-[#facc15] transition-colors group">
                                    <h3 className="text-[13px] text-white font-bold mb-1 group-hover:text-[#a855f7] transition-colors line-clamp-1">{topic.title}</h3>
                                    <div className="flex justify-between items-center text-[10px] text-[#64748b] font-bold">
                                        <span>{new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
                                        <span className="flex items-center gap-1 text-[#a855f7] bg-[#a855f7]/10 px-1.5 py-0.5 rounded">
                                            <MessageCircle size={10} /> {(topic.replies as any)?.[0]?.count || 0}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-[12px] text-[#64748b] text-center py-4">Henüz konu açmamış.</p>
                        )}
                    </div>
                </div>

                {/* Recent News (if applicable) */}
                {news.length > 0 && (
                    <div className="habbo-box p-4">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-[#22c55e]" /> 
                            Son Haberleri
                        </h2>
                        
                        <div className="space-y-2">
                            {news.map(item => (
                                <Link href={`/news/${item.slug}`} key={item.id} className="block bg-[#050a14] border border-[#1e293b] p-3 rounded hover:border-[#facc15] transition-colors group">
                                    <h3 className="text-[13px] text-white font-bold mb-1 group-hover:text-[#22c55e] transition-colors line-clamp-1">{item.title}</h3>
                                    <div className="text-[10px] text-[#64748b] font-bold">
                                        {new Date(item.published_at).toLocaleDateString('tr-TR')}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>


            ) : (
                <div className="habbo-box bg-[#0f172a] p-12 text-center border-dashed border-[#1e293b] mt-4">
                    <div className="flex justify-center mb-4 opacity-50">
                        <Users size={48} className="text-[#3b82f6]" />
                    </div>
                    <h3 className="text-white font-bold uppercase tracking-wider mb-2">ÇOK YAKINDA</h3>
                    <p className="text-[#94a3b8] text-[13px] max-w-sm mx-auto">
                        Bu sekme geliştirme aşamasındadır. Daha fazlası için bizi takip etmeye devam edin!
                    </p>
                </div>
            )}
        </div>

      </div>

    </div>
  );
}
