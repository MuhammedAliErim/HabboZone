import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageCircle, Clock, CheckCircle, ShieldCheck, Sparkles, Flame, ThumbsUp, MessageSquare, MessageCircleQuestion } from 'lucide-react';
import ReplyForm from './ReplyForm';
import PollView from './PollView';
import ReactionView from './ReactionView';
import TopicModeration from './TopicModeration';
import HabboAvatar from '@/components/HabboAvatar';

export const revalidate = 60; // Clean cache structure

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userProfile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    userProfile = data;
  }

  // Fetch Topic Data
  let topic: any = null;
  const { data: dbTopic, error: topicError } = await supabase
    .from('topics')
    .select(`
      id,
      title,
      slug,
      content,
      is_pinned,
      is_locked,
      is_solved,
      views,
      created_at,
      forum_id,
      forums(title, slug),
      author:profiles!topics_author_id_fkey(id, username, habbo_username, role),
      polls(id, question, is_multiple_choice, poll_options(id, option_text))
    `)
    .eq('slug', resolvedParams.slug)
    .single();

  if (dbTopic) {
    topic = dbTopic;
  } else {
    // Fallback mock topic dictionary so clicking any preview card opens a rich topic page
    const mockTopics: Record<string, any> = {
      '2026-yaz-etkinligi-odulleri': {
        id: 'top-1', title: '🔥 2026 Yaz Etkinliği Ödülleri ve Yeni Rozetler Hakkında Ne Düşünüyorsunuz?', slug: '2026-yaz-etkinligi-odulleri', is_pinned: true, is_locked: false, is_solved: false, views: 342, created_at: '2026-07-26T10:00:00Z',
        content: '<p>Merhaba HabboZone topluluğu! Bu yaz Habbo otele giriş yapan yeni plaj festivali oda paketleri, zümrüt nadireler ve etkinlik rozetleri hakkında ne düşünüyorsunuz? Ben özellikle yeni çıkan sörf tahtası nadiresine bayıldım. Fikirlerinizi aşağıda paylaşın!</p>',
        author: { id: 'u-1', username: 'MuhammedAliErim', habbo_username: 'MuhammedAliErim', role: 'Kurucu & Admin' },
        forums: { title: 'Resmi Haberler', slug: 'resmi-haberler' },
        polls: [{ id: 'p1', question: '2026 Yaz Etkinliğini Nasıl Buldunuz?', is_multiple_choice: false, poll_options: [{ id: 'o1', option_text: '⭐ Çok Başarılı, ödüller harika!' }, { id: 'o2', option_text: '👍 İdare eder, orta şekerli.' }, { id: 'o3', option_text: '👎 Beğenmedim, daha iyi olabilirdi.' }] }]
      },
      'altin-ejderha-lamba-neden-uctu': {
        id: 'top-2', title: '💎 Nadire Değerleri Yükselişte: Altın Ejderha Lamba Neden Uçtu?', slug: 'altin-ejderha-lamba-neden-uctu', is_pinned: true, is_locked: false, is_solved: true, views: 512, created_at: '2026-07-25T14:30:00Z',
        content: '<p>Son iki hafta içerisinde Altın Ejderha Lamba piyasa değerinde %25 üzerinde bir artış gözlemlendi. Eski oyuncuların dönüş yapması mı yoksa piyasada stokların azalması mı bu yükselişi tetikledi? Ekonomi analistlerimizden görüşler bekliyoruz.</p>',
        author: { id: 'u-2', username: 'System_Oracle', habbo_username: 'Oracle', role: 'Ekonomi Editörü' },
        forums: { title: 'Fiyat & Değer Tartışmaları', slug: 'fiyat-tartismalari' }
      },
      'orman-kosku-odasi-tasarim-rehberi': {
        id: 'top-3', title: '🏰 Sibel ile Orman Köşkü Odası Tasarım Rehberi (Tüm Detaylar)', slug: 'orman-kosku-odasi-tasarim-rehberi', is_pinned: false, is_locked: false, is_solved: false, views: 198, created_at: '2026-07-25T09:15:00Z',
        content: '<p>Merhaba arkadaşlar! Doğal taş blokları ve şelale mobileriyle nasıl katmanlı bir orman köşkü yapabileceğinizi adım adım anlattığım rehberi paylaşmaktan mutluluk duyuyorum. Görselleri ve kablo bağlantı mantıklarını ekledim!</p>',
        author: { id: 'u-3', username: 'Sibel', habbo_username: 'Sibel', role: 'Baş Mimar' },
        forums: { title: 'Oda Tasarımları & Mimarlık', slug: 'oda-tasarimlari' }
      }
    };
    topic = mockTopics[resolvedParams.slug] || mockTopics['2026-yaz-etkinligi-odulleri'];
  }

  if (!topic) {
    notFound();
  }

  // Increment views asynchronously
  if (topic.id && typeof topic.id === 'string' && !topic.id.startsWith('top-')) {
    await supabase.from('topics').update({ views: (topic.views || 0) + 1 }).eq('id', topic.id);
  }

  // Fetch Replies
  let replies: any[] = [];
  if (topic.id && typeof topic.id === 'string' && !topic.id.startsWith('top-')) {
    const { data: dbReplies } = await supabase
      .from('replies')
      .select(`
        id,
        content,
        is_solution,
        created_at,
        author:profiles!replies_author_id_fkey(id, username, habbo_username)
      `)
      .eq('topic_id', topic.id)
      .order('created_at', { ascending: true });
    replies = dbReplies || [];
  } else {
    // Fallback mock replies for rich discussion view
    replies = [
      {
        id: 'rep-1', content: '<p>Kesinlikle katılıyorum! Özellikle yaz etkinliklerinde gelen rozet görevleri hem çok keyifli hem de otelde büyük bir aktiflik yaratıyor. Ellerine sağlık paylaşım için!</p>', is_solution: false, created_at: '2026-07-26T11:00:00Z',
        author: { id: 'u-4', username: 'Tolga', habbo_username: 'Tolga' }
      },
      {
        id: 'rep-2', content: '<p>Benim en çok dikkatimi çeken şey yeni eklenen kıyafet mobileri oldu. Kombin yapmak için sabırsızlanıyorum. Takas piyasası oldukça hareketlenecek gibi duruyor.</p>', is_solution: true, created_at: '2026-07-26T12:15:00Z',
        author: { id: 'u-5', username: 'Berk', habbo_username: 'Berk' }
      }
    ];
  }

  // Deterministik Tarih ve Saat Formatlama (React 19 saflık kuralı)
  const formatDeterministicDateTime = (dateStr?: string) => {
    if (!dateStr) return '26.07.2026, 14:30';
    const parts = dateStr.split('T');
    const dateParts = parts[0].split('-');
    const timeParts = parts[1] ? parts[1].substring(0, 5) : '12:00';
    if (dateParts.length === 3) return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}, ${timeParts}`;
    return dateStr;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 py-8 px-6">
      
      {/* Üst Kısım: Breadcrumb & Başlık */}
      <div className="space-y-4">
        <Link href={`/forum/category/${(topic.forums as any)?.slug || 'duyurular'}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-[#0a1325]/80 border border-white/10 hover:border-white/30 px-4 py-2.5 rounded-xl shadow-md">
          <ArrowLeft size={16} className="text-cyan-400" /> {(topic.forums as any)?.title || 'Kategori'} Forumuna Dön
        </Link>
        
        <div className="flex items-center justify-between flex-wrap gap-4 border-b-2 border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm">
                {(topic.forums as any)?.title || 'Genel Tartışma'}
              </span>
              {topic.is_solved && (
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CheckCircle size={14} /> ÇÖZÜLDÜ
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-md">
              {topic.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-[#0a1325]/80 border border-white/10 px-5 py-2.5 rounded-xl shadow-md">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <Clock size={16} className="text-cyan-400" /> {formatDeterministicDateTime(topic.created_at)}
            </span>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
              <MessageCircle size={16} /> {replies?.length || 0} Cevap
            </span>
          </div>
        </div>
      </div>

      {/* Anket Gösterimi (Eğer varsa) */}
      {topic.polls && topic.polls.length > 0 && (
        <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden p-6">
          <PollView poll={topic.polls[0]} currentUser={user} />
        </div>
      )}

      {/* Ana Konu Gövdesi - Dark Premium v4.0 */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Yazar Bilgi Kutusu */}
        <div className="w-full md:w-64 habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden shrink-0 self-start">
          <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck size={16} className="text-cyan-400" /> KONU SAHİBİ
          </div>
          
          <div className="p-6 bg-[#050b14] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="w-24 h-24 rounded-2xl bg-[#0a1325] border-2 border-white/10 mb-4 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)] relative group">
              <HabboAvatar username={(topic.author as any)?.habbo_username || (topic.author as any)?.username || 'Admin'} size="l" direction={2} className="w-20 h-20 scale-110" />
            </div>
            
            <Link href={`/profile/${(topic.author as any)?.username}`} className="text-base font-black text-white hover:text-cyan-300 transition-colors truncate w-full">
              @{(topic.author as any)?.username || 'Anonim'}
            </Link>
            
            <div className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg mt-2 uppercase tracking-wider">
              {(topic.author as any)?.role || 'Topluluk Üyesi'}
            </div>
          </div>
        </div>

        {/* Konu İçeriği */}
        <div className="flex-1 habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col min-h-[300px]">
          <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare size={16} className="text-amber-400" /> TARTIŞMA İÇERİĞİ
            </span>
            <span className="text-[11px] font-bold text-gray-400">
              Yayınlanma: {formatDeterministicDateTime(topic.created_at)}
            </span>
          </div>

          <div className="p-8 bg-[#050b14] flex flex-col flex-1 justify-between text-gray-200 leading-relaxed text-sm md:text-base">
            <div className="prose prose-invert max-w-none space-y-4" dangerouslySetInnerHTML={{ __html: topic.content }} />
            
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center bg-[#0a1325]/50 -mx-8 -mb-8 px-8 pb-6 rounded-b-2xl">
              <ReactionView targetId={topic.id} targetType="topic" currentUser={user} />
              <TopicModeration topic={topic} userProfile={userProfile} />
            </div>
          </div>
        </div>
      </div>

      {/* Cevaplar Bölümü */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b-2 border-white/10 pb-3">
          <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
            <MessageCircle size={20} className="text-cyan-400" /> TARTIŞMA CEVAPLARI ({replies?.length || 0})
          </h3>
          <span className="text-xs font-bold text-gray-400">Kronolojik Sıralama</span>
        </div>
        
        {replies && replies.length > 0 ? (
          replies.map((reply: any, idx: number) => (
            <div key={reply.id} className="flex flex-col md:flex-row gap-6">
              
              {/* Cevaplayan Bilgi Kutusu */}
              <div className="w-full md:w-56 habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-xl rounded-2xl overflow-hidden shrink-0 self-start">
                <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-[11px] uppercase tracking-wider px-4 py-3 text-center flex items-center justify-center gap-1">
                  <span>CEVAP #{idx + 1}</span>
                </div>
                
                <div className="p-4 bg-[#050b14] flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-[#0a1325] border border-white/10 mb-2 overflow-hidden flex items-center justify-center shadow-inner">
                    <HabboAvatar username={(reply.author as any)?.habbo_username || (reply.author as any)?.username || 'Admin'} size="m" direction={2} className="w-14 h-14 scale-110" />
                  </div>
                  <Link href={`/profile/${(reply.author as any)?.username}`} className="text-sm font-black text-white hover:text-cyan-300 transition-colors truncate w-full">
                    @{(reply.author as any)?.username || 'Anonim'}
                  </Link>
                </div>
              </div>

              {/* Cevap İçeriği */}
              <div className={`flex-1 habbo-box bg-[#0a1325]/80 border-2 shadow-xl rounded-2xl overflow-hidden flex flex-col ${reply.is_solution ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/10'}`}>
                <div className={`habbo-box-header border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 flex justify-between items-center ${reply.is_solution ? 'bg-gradient-to-r from-emerald-900/60 to-[#0d172a]' : 'bg-gradient-to-r from-[#14233d] to-[#0d172a]'}`}>
                  <span className="text-gray-300 text-[11px]">{formatDeterministicDateTime(reply.created_at)}</span>
                  {reply.is_solution && (
                    <span className="text-emerald-400 font-black tracking-wider flex items-center gap-1 bg-emerald-950 px-3 py-1 rounded-md border border-emerald-500/40">
                      <CheckCircle size={14} /> ONAYLI ÇÖZÜM
                    </span>
                  )}
                </div>
                
                <div className="p-6 bg-[#050b14] flex flex-col flex-1 justify-between text-gray-200 leading-relaxed text-sm md:text-base">
                  <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: reply.content }} />
                  
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                    <ReactionView targetId={reply.id} targetType="reply" currentUser={user} />
                  </div>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center p-12 text-gray-400 bg-[#0a1325]/40 border-2 border-dashed border-white/10 rounded-2xl">
            <MessageCircleQuestion size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-base font-bold text-white">Bu konuya henüz cevap yazılmamış.</p>
            <p className="text-xs text-gray-400 mt-1">İlk cevabı yazarak görüşlerini toplulukla paylaş!</p>
          </div>
        )}
      </div>

      {/* Cevap Yazma Formu */}
      {!topic.is_locked ? (
        <div className="mt-12 bg-[#0a1325]/80 border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
          <h4 className="text-sm font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" /> CEVAP VEYA GÖRÜŞ BİLDİR
          </h4>
          <ReplyForm topicId={topic.id} currentUser={user} />
        </div>
      ) : (
        <div className="mt-8 p-6 bg-red-500/10 border-2 border-red-500/40 text-red-300 text-center font-black rounded-2xl shadow-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          🔒 BU KONU YÖNETİCİ TARAFINDAN KİLİTLENMİŞTİR VE YENİ CEVAPLARA KAPALIDIR.
        </div>
      )}

    </div>
  );
}
