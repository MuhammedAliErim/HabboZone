import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { MessageCircle, Plus, ChevronRight, Flame } from 'lucide-react';
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
      forums(id, title, slug, description, icon)
    `)
    .order('id', { ascending: true });
  
  if (dbCategories && dbCategories.length > 0) {
    categories = dbCategories;
  } else {
    categories = [
      {
        id: 'cat-1', name: 'Duyurular & Kurallar', slug: 'duyurular-ve-kurallar',
        forums: [
          { id: 'f-1', title: 'Resmi Haberler', slug: 'resmi-haberler', icon: '📢' },
          { id: 'f-2', title: 'Yarışmalar & Çekilişler', slug: 'yarismalar-cekilisler', icon: '🎁' }
        ]
      },
      {
        id: 'cat-2', name: 'Topluluk & Sohbet', slug: 'topluluk-ve-sohbet',
        forums: [
          { id: 'f-3', title: 'Genel Sohbet', slug: 'genel-sohbet', icon: '💬' },
          { id: 'f-4', title: 'Oda Tasarımları', slug: 'oda-tasarimlari', icon: '🏰' }
        ]
      },
      {
        id: 'cat-3', name: 'Ekonomi & Nadireler', slug: 'ekonomi-ve-nadireler',
        forums: [
          { id: 'f-5', title: 'Fiyat Tartışmaları', slug: 'fiyat-tartismalari', icon: '💎' },
          { id: 'f-6', title: 'Takas Pazaryeri', slug: 'takas-pazaryeri', icon: '🔄' }
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

  const formatDeterministicDate = (dateStr?: string) => {
    if (!dateStr) return '26.07.2026';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="pb-16 w-full max-w-[1200px] mx-auto px-4 pt-6">
      
      {/* AUTHENTIC HABBO HERO SECTION */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#ef4444] text-white px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#991b1b]">TOPLULUK MERKEZİ</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Tüm Konular</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
            HABBOZONE FORUM & TARTIŞMA
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            Habbo otelinin en güncel gelişmelerini değerlendir, oda tasarımlarını paylaş, nadire piyasasını takip et ve toplulukla etkileşime geç!
          </p>
        </div>
        
        <Link href="/forum/new" className="bg-[#facc15] hover:bg-[#eab308] text-black px-6 py-3 rounded-[4px] font-black text-xs border-2 border-black shadow-[0_4px_0_#a16207] hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-wider shrink-0 flex items-center gap-2">
          <Plus size={16} /> YENİ KONU AÇ
        </Link>
      </div>

      {/* Main Content 2 Columns */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Col: TOPICS */}
        <div className="flex-1 lg:w-[70%] flex flex-col gap-4">
            
          {/* Categories Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#1e293b] pb-3">
            <Link href="/forum" className="bg-[#3b82f6] text-white px-4 py-1.5 rounded-[3px] font-bold text-xs border-b-2 border-[#1d4ed8] uppercase flex items-center gap-1.5">
              <Flame size={14} className="text-yellow-300" /> TÜMÜ
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/forum/category/${cat.slug}`} className="bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white px-4 py-1.5 rounded-[3px] font-bold text-xs border border-[#1e293b] uppercase transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-[#facc15]" />
              <h2 className="text-[#facc15] font-black text-sm tracking-wide">GÜNCEL FORUM BAŞLIKLARI</h2>
            </div>
            <span className="text-gray-400 text-[11px] font-bold uppercase">TOPLAM {topics.length} KONU</span>
          </div>

          {/* Authentic Habbo Box Topic List */}
          <div className="flex flex-col gap-2.5">
            {topics && topics.length > 0 ? topics.map((topic: any) => (
              <Link href={`/forum/topic/${topic.slug}`} key={topic.id} className="habbo-box hover:border-[#3b82f6]/50 p-3.5 flex items-center justify-between gap-4 group transition-all duration-200 bg-[#0a1325]">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-[4px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center shrink-0 overflow-hidden relative">
                    <HabboAvatar username={topic.author?.habbo_username || topic.author?.username || 'Admin'} size="m" headOnly direction={3} className="w-7 h-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {topic.is_pinned && (
                        <span className="bg-[#ef4444] text-white text-[9px] font-black px-1.5 py-0.5 rounded-[2px] uppercase shrink-0">
                          SABİT
                        </span>
                      )}
                      <span className="bg-[#1e293b] text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-[2px] shrink-0">
                        {topic.forum?.title || 'Genel'}
                      </span>
                      <h3 className="text-white font-bold text-[14px] md:text-[15px] group-hover:text-[#facc15] transition-colors truncate">
                        {topic.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[11px] text-[#64748b] font-bold">
                      <span>Yazar: <strong className="text-gray-300">@{topic.author?.username || 'Anonim'}</strong></span>
                      <span>•</span>
                      <span>{formatDeterministicDate(topic.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end shrink-0 border-l border-[#1e293b] pl-4">
                  <span className="text-white font-black text-sm group-hover:text-[#3b82f6] transition-colors">
                    {topic.replies?.length || 0}
                  </span>
                  <span className="text-[10px] text-[#64748b] font-bold uppercase">Cevap</span>
                </div>
              </Link>
            )) : (
              <div className="habbo-box p-8 text-center text-gray-400">
                <p className="font-bold text-sm text-white">Henüz konu açılmamış.</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">İlk konuyu açarak tartışmayı sen başlat!</p>
                <Link href="/forum/new" className="bg-[#22c55e] text-white px-6 py-2 rounded-[4px] font-bold text-xs border-b-4 border-[#15803d] uppercase inline-block">
                  KONU AÇ
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: SIDEBAR WIDGETS */}
        <div className="flex-1 lg:w-[30%] flex flex-col gap-6">
            
          {/* Forum Categories Widget */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
              <h2 className="text-[#facc15] font-black text-sm tracking-wide">FORUM KATEGORİLERİ</h2>
            </div>

            <div className="habbo-box p-3 bg-[#0a1325] flex flex-col gap-3">
              {categories?.map((cat) => (
                <div key={cat.id} className="flex flex-col gap-1.5">
                  <Link href={`/forum/category/${cat.slug}`} className="text-xs font-black uppercase text-[#3b82f6] hover:underline">
                    {cat.name}
                  </Link>
                  
                  <div className="flex flex-col gap-1 pl-2 border-l-2 border-[#1e293b]">
                    {cat.forums?.map((forum: any) => (
                      <Link href={`/forum/category/${forum.slug}`} key={forum.id} className="flex items-center justify-between p-1.5 hover:bg-[#1e293b] rounded-[3px] transition-colors group">
                        <span className="text-xs font-bold text-gray-300 group-hover:text-white flex items-center gap-1.5">
                          <span>{forum.icon || '📌'}</span> {forum.title}
                        </span>
                        <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Widget */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
              <h2 className="text-[#facc15] font-black text-sm tracking-wide">SON ETKİLEŞİMLER</h2>
            </div>

            <div className="habbo-box p-3 bg-[#0a1325] flex flex-col gap-2.5">
              {latestReplies && latestReplies.length > 0 ? (
                latestReplies.map((reply: any) => (
                  <Link href={`/forum/topic/${reply.topic?.slug || 'genel'}`} key={reply.id} className="flex flex-col gap-1 p-2 hover:bg-[#1e293b] rounded-[3px] transition-colors group border-b border-[#1e293b]/50 last:border-0 pb-2.5 last:pb-2">
                    <div className="flex items-center justify-between text-[10px] text-[#64748b] font-bold">
                      <span className="text-cyan-400">@{reply.author?.username || 'Üye'}</span>
                      <span>{formatDeterministicDate(reply.created_at)}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-200 group-hover:text-white line-clamp-1">
                      {reply.topic?.title || 'Konu Başlığı'}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-xs font-bold text-gray-500">
                  Henüz son aktivite bulunmuyor.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
