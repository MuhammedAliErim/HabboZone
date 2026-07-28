import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageSquare, Plus } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export const revalidate = 60;

export default async function ForumCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // 1. Fetch forum / category details
  let categoryInfo: any = null;
  const { data: dbForum } = await supabase
    .from('forums')
    .select('id, title, slug, description, icon, category:categories(name, slug)')
    .eq('slug', resolvedParams.slug)
    .maybeSingle();

  if (dbForum) {
    categoryInfo = {
      title: dbForum.title,
      slug: dbForum.slug,
      description: dbForum.description || 'Bu kategorideki tüm forum tartışmaları ve konuları',
      icon: dbForum.icon || '📌',
      parentCategoryName: (Array.isArray(dbForum.category) ? dbForum.category[0]?.name : (dbForum.category as any)?.name) || 'Topluluk'
    };
  } else {
    const { data: dbCat } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .eq('slug', resolvedParams.slug)
    .maybeSingle();

  if (dbCat) {
      categoryInfo = {
        title: dbCat.name,
        slug: dbCat.slug,
        description: dbCat.description || 'Kategori ana tartışma panosu',
        icon: '📂',
        parentCategoryName: 'Forum Kategorisi'
      };
    } else {
      const mockCategories: Record<string, any> = {
        'duyurular': { title: 'Duyurular & Kurallar', slug: 'duyurular', description: 'Site ve oyun hakkındaki en güncel resmi duyurular', icon: '📢', parentCategoryName: 'Resmi Kategori' },
        'resmi-haberler': { title: 'Resmi Haberler', slug: 'resmi-haberler', description: 'Habbo ve HabboZone resmi duyuru panosu', icon: '📢', parentCategoryName: 'Duyurular & Kurallar' },
        'yarismalar-cekilisler': { title: 'Yarışmalar & Çekilişler', slug: 'yarismalar-cekilisler', description: 'Ödüllü yarışmalar ve rozet etkinlikleri', icon: '🏆', parentCategoryName: 'Duyurular & Kurallar' },
        'topluluk': { title: 'Topluluk & Sohbet', slug: 'topluluk', description: 'Habbo oyuncuları arası muhabbet ve tartışma alanı', icon: '💬', parentCategoryName: 'Topluluk Kategorisi' },
        'genel-sohbet': { title: 'Genel Sohbet', slug: 'genel-sohbet', description: 'Oyun içi ve dışı her türlü keyifli sohbet', icon: '💬', parentCategoryName: 'Topluluk & Sohbet' },
        'oda-tasarimlari': { title: 'Oda Tasarımları & Mimarlık', slug: 'oda-tasarimlari', description: 'En iyi oda tasarımları ve mimari fikirler', icon: '🏰', parentCategoryName: 'Topluluk & Sohbet' },
        'ekonomi': { title: 'Ekonomi & Nadireler', slug: 'ekonomi', description: 'Piyasa analizi, nadire takasları ve değerleme panosu', icon: '📈', parentCategoryName: 'Ekonomi Kategorisi' },
        'takas-pazaryeri': { title: 'Takas & Pazaryeri', slug: 'takas-pazaryeri', description: 'Alım, satım ve takas ilanlarınızı paylaşın', icon: '💎', parentCategoryName: 'Ekonomi & Nadireler' },
        'fiyat-tartismalari': { title: 'Fiyat & Değer Tartışmaları', slug: 'fiyat-tartismalari', description: 'Hangi nadire değerlenecek? Tahmin ve analizler', icon: '📈', parentCategoryName: 'Ekonomi & Nadireler' }
      };

      categoryInfo = mockCategories[resolvedParams.slug];
    }
  }

  if (!categoryInfo) {
    notFound();
  }

  // 2. Fetch Topics for this category/forum
  let topics: any[] = [];
  const { data: dbTopics } = await supabase
    .from('topics')
    .select(`
      id, title, slug, is_pinned, is_locked, created_at, updated_at,
      author:profiles!topics_author_id_fkey(username, habbo_username),
      forum:forums(title, slug),
      replies:replies(id)
    `)
    .eq(dbForum ? 'forum_id' : 'id', dbForum ? dbForum.id : '00000000-0000-0000-0000-000000000000')
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  if (dbTopics && dbTopics.length > 0) {
    topics = dbTopics;
  } else {
    topics = [
      {
        id: 'cat-top-1', title: `🔥 [${categoryInfo.title}] Hakkında Önemli Bilgilendirme ve Tartışma`, slug: 'onemli-bilgilendirme-ve-tartisma', is_pinned: true, is_locked: false, created_at: '2026-07-26T10:00:00Z',
        author: { username: 'MuhammedAliErim', habbo_username: 'MuhammedAliErim' },
        forum: { title: categoryInfo.title, slug: categoryInfo.slug },
        replies: [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }, { id: 'r4' }, { id: 'r5' }]
      },
      {
        id: 'cat-top-2', title: `💬 Oyuncular Soruyor: ${categoryInfo.title} Alanındaki Son Gelişmeler`, slug: 'oyuncular-soruyor-son-gelismeler', is_pinned: false, is_locked: false, created_at: '2026-07-25T15:30:00Z',
        author: { username: 'Tolga', habbo_username: 'Tolga' },
        forum: { title: categoryInfo.title, slug: categoryInfo.slug },
        replies: [{ id: 'r6' }, { id: 'r7' }, { id: 'r8' }]
      },
      {
        id: 'cat-top-3', title: `✨ Haftanın Öne Çıkan Fikirleri ve Öneriler Panosu`, slug: 'haftanin-one-cikan-fikirleri', is_pinned: false, is_locked: false, created_at: '2026-07-24T09:20:00Z',
        author: { username: 'Sibel', habbo_username: 'Sibel' },
        forum: { title: categoryInfo.title, slug: categoryInfo.slug },
        replies: [{ id: 'r9' }, { id: 'r10' }]
      }
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
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <Link href="/forum" className="bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white px-4 py-2 rounded-[3px] font-bold text-xs border border-[#1e293b] uppercase flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} className="text-[#3b82f6]" /> FORUM ANA SAYFA
        </Link>

        <Link href={`/forum/new?category=${categoryInfo.slug}`} className="bg-[#facc15] hover:bg-[#eab308] text-black px-6 py-2.5 rounded-[4px] font-black text-xs border-2 border-black shadow-[0_4px_0_#a16207] hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-wider flex items-center gap-2">
          <Plus size={16} /> BU KATEGORİDE KONU AÇ
        </Link>
      </div>

      {/* AUTHENTIC HABBO CATEGORY HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[4px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center text-3xl shrink-0">
            {categoryInfo.icon || '📂'}
          </div>
          <div>
            <div className="inline-block bg-[#3b82f6] text-white px-2 py-0.5 rounded-[2px] text-[10px] font-black uppercase tracking-wider mb-2">
              {categoryInfo.parentCategoryName}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight" style={{ textShadow: '2px 2px 0 #000' }}>
              {categoryInfo.title}
            </h1>
            <p className="text-xs md:text-sm text-gray-300 font-medium mt-1">
              {categoryInfo.description}
            </p>
          </div>
        </div>

        <div className="bg-[#050a14] border border-[#1e293b] px-6 py-3 rounded-[4px] flex items-center gap-6 shrink-0 text-center">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Aktif Konu</div>
            <div className="text-lg font-black text-white">{topics.length}</div>
          </div>
          <div className="h-6 w-px bg-[#1e293b]"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Durum</div>
            <div className="text-xs font-black text-[#22c55e]">Aktif</div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#facc15]" />
          <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">KATEGORİ BAŞLIKLARI ({categoryInfo.title})</h2>
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
            <p className="font-bold text-sm text-white">Bu kategoride henüz konu açılmamış.</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">İlk tartışmayı sen başlat!</p>
            <Link href={`/forum/new?category=${categoryInfo.slug}`} className="bg-[#22c55e] text-white px-6 py-2 rounded-[4px] font-bold text-xs border-b-4 border-[#15803d] uppercase inline-block">
              KONU AÇ
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
