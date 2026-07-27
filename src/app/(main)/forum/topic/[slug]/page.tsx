import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageCircle, Clock, CheckCircle, ShieldCheck, Flame, MessageSquare } from 'lucide-react';
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

  if (topic.id && typeof topic.id === 'string' && !topic.id.startsWith('top-')) {
    await supabase.from('topics').update({ views: (topic.views || 0) + 1 }).eq('id', topic.id);
  }

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

  const formatDeterministicDateTime = (dateStr?: string) => {
    if (!dateStr) return '26.07.2026, 14:30';
    const parts = dateStr.split('T');
    const dateParts = parts[0].split('-');
    const timeParts = parts[1] ? parts[1].substring(0, 5) : '12:00';
    if (dateParts.length === 3) return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}, ${timeParts}`;
    return dateStr;
  };

  return (
    <div className="pb-16 w-full max-w-[1200px] mx-auto px-4 pt-6">
      
      {/* Top Breadcrumb */}
      <div className="mb-4">
        <Link href={`/forum/category/${(topic.forums as any)?.slug || 'duyurular'}`} className="bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white px-4 py-2 rounded-[3px] font-bold text-xs border border-[#1e293b] uppercase inline-flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} className="text-[#3b82f6]" /> {(topic.forums as any)?.title || 'Kategori'} FORUMUNA DÖN
        </Link>
      </div>
      
      {/* AUTHENTIC HABBO TOPIC HEADER */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#3b82f6] text-white text-[10px] font-black px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
              {(topic.forums as any)?.title || 'Genel Tartışma'}
            </span>
            {topic.is_solved && (
              <span className="bg-[#22c55e] text-white text-[10px] font-black px-2 py-0.5 rounded-[2px] uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={12} /> ÇÖZÜLDÜ
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#64748b]">
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-gray-400" /> {formatDeterministicDateTime(topic.created_at)}
            </span>
            <span>•</span>
            <span className="text-[#3b82f6] font-black">
              {replies?.length || 0} Cevap
            </span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
          {topic.title}
        </h1>
      </div>

      {/* Poll Display if any */}
      {topic.polls && topic.polls.length > 0 && (
        <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b]">
          <PollView poll={topic.polls[0]} currentUser={user} />
        </div>
      )}

      {/* Main Topic Content Area */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        
        {/* Author Box */}
        <div className="w-full md:w-64 habbo-box bg-[#0a1325] border border-[#1e293b] shrink-0 self-start">
          <div className="bg-[#050a14] border-b border-[#1e293b] text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-[#facc15]" /> KONU SAHİBİ
          </div>
          
          <div className="p-5 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[4px] bg-[#050a14] border border-[#1e293b] mb-3 overflow-hidden flex items-center justify-center relative">
              <HabboAvatar username={(topic.author as any)?.habbo_username || (topic.author as any)?.username || 'Admin'} size="l" direction={2} className="w-16 h-16 scale-110" />
            </div>
            
            <Link href={`/profile/${(topic.author as any)?.username}`} className="text-sm font-black text-white hover:text-[#facc15] transition-colors truncate w-full">
              @{(topic.author as any)?.username || 'Anonim'}
            </Link>
            
            <div className="text-[10px] font-black text-black bg-[#facc15] px-2.5 py-0.5 rounded-[2px] mt-2 uppercase tracking-wider">
              {(topic.author as any)?.role || 'Topluluk Üyesi'}
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 habbo-box bg-[#0a1325] border border-[#1e293b] flex flex-col min-h-[250px]">
          <div className="bg-[#050a14] border-b border-[#1e293b] text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[#facc15]" /> TARTIŞMA İÇERİĞİ
            </span>
          </div>

          <div className="p-6 flex flex-col flex-1 justify-between text-gray-200 leading-relaxed text-sm md:text-base">
            <div className="prose prose-invert max-w-none space-y-4" dangerouslySetInnerHTML={{ __html: topic.content }} />
            
            <div className="mt-8 pt-4 border-t border-[#1e293b] flex flex-wrap gap-4 justify-between items-center">
              <ReactionView targetId={topic.id} targetType="topic" currentUser={user} />
              <TopicModeration topic={topic} userProfile={userProfile} />
            </div>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-[#facc15]" />
            <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">TARTIŞMA CEVAPLARI ({replies?.length || 0})</h2>
          </div>
          <span className="text-gray-400 text-[11px] font-bold uppercase">KRONOLOJİK SIRALAMA</span>
        </div>
        
        {replies && replies.length > 0 ? (
          replies.map((reply: any, idx: number) => (
            <div key={reply.id} className="flex flex-col md:flex-row gap-6">
              
              {/* Replier Box */}
              <div className="w-full md:w-56 habbo-box bg-[#0a1325] border border-[#1e293b] shrink-0 self-start">
                <div className="bg-[#050a14] border-b border-[#1e293b] text-white font-black text-[11px] uppercase tracking-wider px-3 py-2 text-center">
                  <span>CEVAP #{idx + 1}</span>
                </div>
                
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-[4px] bg-[#050a14] border border-[#1e293b] mb-2 overflow-hidden flex items-center justify-center">
                    <HabboAvatar username={(reply.author as any)?.habbo_username || (reply.author as any)?.username || 'Admin'} size="m" direction={2} className="w-12 h-12 scale-110" />
                  </div>
                  <Link href={`/profile/${(reply.author as any)?.username}`} className="text-xs font-black text-white hover:text-[#facc15] transition-colors truncate w-full">
                    @{(reply.author as any)?.username || 'Anonim'}
                  </Link>
                </div>
              </div>

              {/* Reply Content */}
              <div className={`flex-1 habbo-box bg-[#0a1325] border flex flex-col ${reply.is_solution ? 'border-[#22c55e]' : 'border-[#1e293b]'}`}>
                <div className={`border-b border-[#1e293b] text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 flex justify-between items-center ${reply.is_solution ? 'bg-[#14532d]' : 'bg-[#050a14]'}`}>
                  <span className="text-gray-400 text-[11px]">{formatDeterministicDateTime(reply.created_at)}</span>
                  {reply.is_solution && (
                    <span className="text-[#22c55e] font-black tracking-wider flex items-center gap-1 uppercase">
                      <CheckCircle size={14} /> ONAYLI ÇÖZÜM
                    </span>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1 justify-between text-gray-200 leading-relaxed text-sm md:text-base">
                  <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: reply.content }} />
                  
                  <div className="mt-6 pt-3 border-t border-[#1e293b] flex justify-end">
                    <ReactionView targetId={reply.id} targetType="reply" currentUser={user} />
                  </div>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="habbo-box p-8 text-center text-gray-400 bg-[#0a1325]">
            <p className="font-bold text-sm text-white">Bu konuya henüz cevap yazılmamış.</p>
            <p className="text-xs text-gray-400 mt-1">İlk cevabı yazarak görüşlerini toplulukla paylaş!</p>
          </div>
        )}
      </div>

      {/* Reply Form */}
      {!topic.is_locked ? (
        <div className="mt-8 habbo-box p-6 bg-[#0a1325] border border-[#1e293b]">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#facc15] mb-4 flex items-center gap-2">
            <MessageSquare size={16} /> CEVAP VEYA GÖRÜŞ BİLDİR
          </h3>
          <ReplyForm topicId={topic.id} currentUser={user} />
        </div>
      ) : (
        <div className="mt-8 habbo-box p-4 bg-[#7f1d1d] border-2 border-black text-white text-center font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          🔒 BU KONU YÖNETİCİ TARAFINDAN KİLİTLENMİŞTİR VE YENİ CEVAPLARA KAPALIDIR.
        </div>
      )}

    </div>
  );
}
