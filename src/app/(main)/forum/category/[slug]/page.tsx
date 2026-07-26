import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageSquare, Pin, Clock, Users, Plus, Flame, Sparkles, MessageCircleQuestion, ShieldCheck } from 'lucide-react';
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
    .single();

  if (dbForum) {
    categoryInfo = {
      title: dbForum.title,
      slug: dbForum.slug,
      description: dbForum.description || 'Bu kategorideki tüm forum tartışmaları ve konuları',
      icon: dbForum.icon || '📌',
      parentCategoryName: (Array.isArray(dbForum.category) ? dbForum.category[0]?.name : (dbForum.category as any)?.name) || 'Topluluk'
    };
  } else {
    // Check in categories table if it wasn't in forums
    const { data: dbCat } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .eq('slug', resolvedParams.slug)
      .single();
    
    if (dbCat) {
      categoryInfo = {
        title: dbCat.name,
        slug: dbCat.slug,
        description: dbCat.description || 'Kategori ana tartışma panosu',
        icon: '📂',
        parentCategoryName: 'Forum Kategorisi'
      };
    } else {
      // Fallback mock category dictionary so clicking any tab always loads seamlessly
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
    // Fallback mock topics for this category
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

  // Deterministik Tarih Formatlama (React 19 saflık kuralı)
  const formatDeterministicDate = (dateStr?: string) => {
    if (!dateStr) return '26.07.2026';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 py-8 px-6">
      
      {/* Breadcrumb / Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/forum" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-[#0a1325]/80 border border-white/10 hover:border-white/30 px-4 py-2.5 rounded-xl shadow-md">
          <ArrowLeft size={16} className="text-cyan-400" /> Forum Ana Sayfasına Dön
        </Link>

        <Link href={`/forum/new?category=${categoryInfo.slug}`} className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/30">
          <Plus size={16} /> BU KATEGORİDE KONU AÇ
        </Link>
      </div>

      {/* Category Hero Banner */}
      <div className="habbo-box bg-[#0a1325]/90 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden p-8 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#050b14] border-2 border-cyan-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              {categoryInfo.icon || '📂'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-wider mb-2">
                <Sparkles size={12} className="text-cyan-400" /> {categoryInfo.parentCategoryName}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
                {categoryInfo.title}
              </h1>
              <p className="text-sm text-gray-300 font-medium mt-1">
                {categoryInfo.description}
              </p>
            </div>
          </div>

          <div className="bg-[#050b14]/80 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-6 shrink-0 text-center">
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase">Aktif Konu</div>
              <div className="text-xl font-black text-white">{topics.length}</div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase">Durum</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> Canlı
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics List Container */}
      <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
        <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare size={16} className="text-cyan-400" /> KATEGORİ BAŞLIKLARI ({categoryInfo.title})
          </span>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/30">
            GÜNCEL SAYFA
          </span>
        </div>

        <div className="p-6 bg-[#050b14] space-y-3">
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
              <p className="text-sm font-bold text-white">Bu kategoride henüz konu açılmadı.</p>
              <p className="text-xs text-gray-400 mt-1 mb-4">İlk tartışmayı sen başlat!</p>
              <Link href={`/forum/new?category=${categoryInfo.slug}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all">
                <Plus size={16} /> KONU AÇ
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
