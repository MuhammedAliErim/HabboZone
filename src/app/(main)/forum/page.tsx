import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { MessageCircle, Search, Pin, Clock, Users, Plus, ChevronRight, Activity, MessageCircleQuestion, Sparkles, Flame, ShieldCheck, Star, MessageSquare } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export const revalidate = 60;

export default async function ForumIndexPage() {
  const supabase = await createClient();

  // 1. Fetch Categories & Forums for Sidebar
  let categories: any[] = [];
  const { data: dbCategories } = await supabase
    .from('categories')
    .select(`
      id, name, slug, description,
      forums:forums(id, title, slug, description, icon)
    `)
    .eq('type', 'forum');
  
  if (dbCategories && dbCategories.length > 0) {
    categories = dbCategories;
  } else {
    // Fallback mock forum categories
    categories = [
      {
        id: 'cat-1', name: 'Duyurular & Kurallar', slug: 'duyurular', description: 'Site ve oyun hakkındaki en güncel resmi duyurular',
        forums: [
          { id: 'f-1', title: 'Resmi Haberler', slug: 'resmi-haberler', description: 'Habbo ve HabboZone resmi duyuru panosu', icon: '📢' },
          { id: 'f-2', title: 'Yarışmalar & Çekilişler', slug: 'yarismalar-cekilisler', description: 'Ödüllü yarışmalar ve rozet etkinlikleri', icon: '🏆' }
        ]
      },
      {
        id: 'cat-2', name: 'Topluluk & Sohbet', slug: 'topluluk', description: 'Habbo oyuncuları arası muhabbet ve tartışma alanı',
        forums: [
          { id: 'f-3', title: 'Genel Sohbet', slug: 'genel-sohbet', description: 'Oyun içi ve dışı her türlü keyifli sohbet', icon: '💬' },
          { id: 'f-4', title: 'Oda Tasarımları & Mimarlık', slug: 'oda-tasarimlari', description: 'En iyi oda tasarımları ve mimari fikirler', icon: '🏰' }
        ]
      },
      {
        id: 'cat-3', name: 'Ekonomi & Nadireler', slug: 'ekonomi', description: 'Piyasa analizi, nadire takasları ve değerleme panosu',
        forums: [
          { id: 'f-5', title: 'Takas & Pazaryeri', slug: 'takas-pazaryeri', description: 'Alım, satım ve takas ilanlarınızı paylaşın', icon: '💎' },
          { id: 'f-6', title: 'Fiyat & Değer Tartışmaları', slug: 'fiyat-tartismalari', description: 'Hangi nadire değerlenecek? Tahmin ve analizler', icon: '📈' }
        ]
      }
    ];
  }

  // 2. Fetch Latest Topics
  let topics: any[] = [];
  const { data: dbTopics } = await supabase
    .from('topics')
    .select(`
      id, title, slug, is_pinned, is_locked, created_at, updated_at,
      author:profiles!topics_author_id_fkey(username, habbo_username),
      forum:forums(title, slug, category:categories(name)),
      replies:replies(id, created_at)
    `)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(20);

  if (dbTopics && dbTopics.length > 0) {
    topics = dbTopics;
  } else {
    // Fallback mock topics for a lively forum preview
    topics = [
      {
        id: 'top-1', title: '🔥 2026 Yaz Etkinliği Ödülleri ve Yeni Rozetler Hakkında Ne Düşünüyorsunuz?', slug: '2026-yaz-etkinligi-odulleri', is_pinned: true, is_locked: false, created_at: '2026-07-26T10:00:00Z',
        author: { username: 'MuhammedAliErim', habbo_username: 'MuhammedAliErim' },
        forum: { title: 'Resmi Haberler', slug: 'resmi-haberler', category: { name: 'Duyurular & Kurallar' } },
        replies: [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }, { id: 'r4' }, { id: 'r5' }, { id: 'r6' }, { id: 'r7' }, { id: 'r8' }]
      },
      {
        id: 'top-2', title: '💎 Nadire Değerleri Yükselişte: Altın Ejderha Lamba Neden Uçtu?', slug: 'altin-ejderha-lamba-neden-uctu', is_pinned: true, is_locked: false, created_at: '2026-07-25T14:30:00Z',
        author: { username: 'System_Oracle', habbo_username: 'Oracle' },
        forum: { title: 'Fiyat & Değer Tartışmaları', slug: 'fiyat-tartismalari', category: { name: 'Ekonomi & Nadireler' } },
        replies: [{ id: 'r9' }, { id: 'r10' }, { id: 'r11' }, { id: 'r12' }]
      },
      {
        id: 'top-3', title: '🏰 Sibel ile Orman Köşkü Odası Tasarım Rehberi (Tüm Detaylar)', slug: 'orman-kosku-odasi-tasarim-rehberi', is_pinned: false, is_locked: false, created_at: '2026-07-25T09:15:00Z',
        author: { username: 'Sibel', habbo_username: 'Sibel' },
        forum: { title: 'Oda Tasarımları & Mimarlık', slug: 'oda-tasarimlari', category: { name: 'Topluluk & Sohbet' } },
        replies: [{ id: 'r13' }, { id: 'r14' }, { id: 'r15' }]
      },
      {
        id: 'top-4', title: '🎙️ HabboZone Radyo DJ ve Basın Ekibi Alımları Başladı! (Hemen Başvurun)', slug: 'radyo-dj-ve-basin-ekibi-alimlari', is_pinned: false, is_locked: false, created_at: '2026-07-24T18:45:00Z',
        author: { username: 'Tolga', habbo_username: 'Tolga' },
        forum: { title: 'Resmi Haberler', slug: 'resmi-haberler', category: { name: 'Duyurular & Kurallar' } },
        replies: [{ id: 'r16' }, { id: 'r17' }, { id: 'r18' }, { id: 'r19' }, { id: 'r20' }, { id: 'r21' }, { id: 'r22' }]
      },
      {
        id: 'top-5', title: '⚡ LTD Siber Taht Alınır mı? 350 Kredi Ödemeye Değer mi?', slug: 'ltd-siber-taht-alinir-mi', is_pinned: false, is_locked: false, created_at: '2026-07-24T11:20:00Z',
        author: { username: 'Berk', habbo_username: 'Berk' },
        forum: { title: 'Takas & Pazaryeri', slug: 'takas-pazaryeri', category: { name: 'Ekonomi & Nadireler' } },
        replies: [{ id: 'r23' }, { id: 'r24' }]
      }
    ];
  }

  // 3. Latest Replies for Activity Feed
  let latestReplies: any[] = [];
  const { data: dbReplies } = await supabase
    .from('replies')
    .select(`
      id, created_at,
      topic:topics(title, slug),
      author:profiles(username, habbo_username)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (dbReplies && dbReplies.length > 0) {
    latestReplies = dbReplies;
  } else {
    latestReplies = [
      { id: 'lr-1', created_at: '2026-07-26T12:30:00Z', topic: { title: '🔥 2026 Yaz Etkinliği Ödülleri...', slug: '2026-yaz-etkinligi-odulleri' }, author: { username: 'Tolga', habbo_username: 'Tolga' } },
      { id: 'lr-2', created_at: '2026-07-26T11:15:00Z', topic: { title: '💎 Nadire Değerleri Yükselişte...', slug: 'altin-ejderha-lamba-neden-uctu' }, author: { username: 'MuhammedAliErim', habbo_username: 'MuhammedAliErim' } },
      { id: 'lr-3', created_at: '2026-07-26T09:40:00Z', topic: { title: '🏰 Sibel ile Orman Köşkü...', slug: 'orman-kosku-odasi-tasarim-rehberi' }, author: { username: 'Berk', habbo_username: 'Berk' } }
    ];
  }

  // Deterministik Tarih Formatlama (React 19 saflık kuralı - new Date() render gövdesinde kullanılmaz)
  const formatDeterministicDate = (dateStr?: string) => {
    if (!dateStr) return '26.07.2026';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      
      {/* Hero Banner - Dark Premium v4.0 */}
      <section className="relative w-full min-h-[260px] mb-8 border-b-2 border-white/10 overflow-hidden flex flex-col justify-end p-8 bg-[#050b14]">
        <div 
          className="absolute inset-0 z-0 opacity-30 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a1224] via-[#0a1224]/80 to-transparent"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-20 max-w-[1400px] w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-3 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              TOPLULUK TARTIŞMA & PAYLAŞIM MERKEZİ V4.0
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2 flex items-center gap-3">
              <MessageCircle size={36} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" /> 
              HABBOZONE FORUM
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-medium max-w-2xl">
              Habbo dünyasının en güncel haberlerini tartışın, oda tasarımlarınızı sergileyin ve nadire piyasasının nabzını tutun!
            </p>
          </div>
          
          <Link href="/forum/new" className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0 self-start md:self-auto border border-emerald-400/30">
            <Plus size={18} />
            YENİ KONU AÇ
          </Link>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        
        {/* Left Column - Topics */}
        <div className="min-w-0 space-y-6">
            
          {/* Categories Bar / Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 border-b border-white/10 pb-4">
            <Link href="/forum" className="px-5 py-2.5 bg-cyan-500/20 text-cyan-300 font-black text-xs rounded-xl border border-cyan-500/50 shadow-md transition-all flex items-center gap-1.5">
              <Flame size={14} className="text-cyan-400" /> TÜM KONULAR
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/forum/category/${cat.slug}`} className="px-5 py-2.5 text-gray-400 hover:text-white font-bold text-xs rounded-xl bg-[#0a1325]/60 hover:bg-[#0a1325] border border-white/5 hover:border-white/20 transition-all uppercase tracking-wider">
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Topic List - Dark Premium Habbo-Box */}
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare size={16} className="text-cyan-400" /> GÜNCEL FORUM BAŞLIKLARI
              </span>
              <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                TOPLAM {topics.length} KONU
              </span>
            </div>

            <div className="p-4 bg-[#050b14] space-y-3">
              {topics && topics.length > 0 ? topics.map((topic: any) => (
                <Link href={`/forum/topic/${topic.slug}`} key={topic.id} className="block bg-[#0a1325]/90 hover:bg-[#111e38] border-2 border-white/10 hover:border-cyan-500/40 p-4 rounded-xl shadow-md transition-all group">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-[#050b14] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner group-hover:scale-105 transition-transform">
                      <HabboAvatar username={topic.author?.habbo_username || topic.author?.username || 'Admin'} size="m" headOnly direction={3} className="w-8 h-8" />
                    </div>

                    {/* Topic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {topic.is_pinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded shadow-sm shrink-0">
                            <Pin size={10} /> SABİT
                          </span>
                        )}
                        <span className="text-cyan-400 text-[10px] font-black uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0">
                          {topic.forum?.title || 'Genel'}
                        </span>
                        <h3 className="text-sm md:text-base font-black text-white group-hover:text-cyan-300 transition-colors truncate">
                          {topic.title}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-medium mt-1.5">
                        <span className="flex items-center gap-1">
                          <Users size={14} className="text-gray-500" /> Yazar: <span className="text-white font-bold">@{topic.author?.username || 'Anonim'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} className="text-gray-500" /> {formatDeterministicDate(topic.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Replies Count Badge */}
                    <div className="hidden sm:flex flex-col items-center justify-center bg-white/5 border border-white/10 px-4 py-2 rounded-xl shrink-0 text-center">
                      <span className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                        {topic.replies?.length || 0}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cevap</span>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="text-center py-12 text-gray-400">
                  <MessageCircleQuestion size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-bold text-white">Henüz bir konu açılmadı.</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">İlk konuyu sen açarak tartışmayı başlat!</p>
                  <Link href="/forum/new" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all">
                    <Plus size={16} /> KONU AÇ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
            
          {/* Categories Widget */}
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star size={16} className="text-amber-400" /> FORUM KATEGORİLERİ
              </span>
            </div>

            <div className="p-4 bg-[#050b14] space-y-4">
              {categories?.map((cat) => (
                <div key={cat.id} className="space-y-2">
                  <Link href={`/forum/category/${cat.slug}`} className="block text-xs font-black uppercase tracking-wider text-cyan-400 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors">
                    {cat.name}
                  </Link>
                  
                  <div className="space-y-1 pl-2 border-l-2 border-white/10">
                    {cat.forums?.map((forum: any) => (
                      <Link href={`/forum/category/${forum.slug}`} key={forum.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                        <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                          <span className="text-base">{forum.icon || '📌'}</span> {forum.title}
                        </span>
                        <ChevronRight size={14} className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed Widget */}
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity size={16} className="text-emerald-400 animate-pulse" /> SON ETKİLEŞİMLER
              </span>
            </div>

            <div className="p-4 bg-[#050b14] space-y-3">
              {latestReplies && latestReplies.length > 0 ? (
                latestReplies.map((reply: any) => (
                  <div key={reply.id} className="p-3 bg-[#0a1325]/90 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    <Link href={`/forum/topic/${reply.topic?.slug}`} className="text-xs font-bold text-cyan-400 line-clamp-1 mb-1 hover:underline block">
                      {reply.topic?.title}
                    </Link>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1 font-medium">
                        <ShieldCheck size={12} className="text-emerald-400" /> @{reply.author?.username || 'Oyuncu'}
                      </span>
                      <span className="text-gray-500 font-bold">{formatDeterministicDate(reply.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-gray-500 py-6">
                  Henüz bir aktivite yok.
                </div>
              )}
            </div>
          </div>

          {/* Quick Help Widget */}
          <div className="habbo-box bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-white/10 shadow-2xl rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl pointer-events-none"></div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-400" /> FORUM KURALLARI
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              HabboZone forumlarında saygı çerçevesinde tartışalım. Spam yapmak, hakaret etmek veya yanıltıcı nadire fiyatları paylaşmak uyarı veya hesaptan uzaklaştırma sebebidir.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
