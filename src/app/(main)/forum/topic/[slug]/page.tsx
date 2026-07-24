import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import ReplyForm from './ReplyForm';
import PollView from './PollView';
import ReactionView from './ReactionView';
import TopicModeration from './TopicModeration';

export const revalidate = 0; // Disable caching

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
  const { data: topic, error: topicError } = await supabase
    .from('topics')
    .select(`
      id,
      title,
      slug,
      content,
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

  if (topicError || !topic) {
    notFound();
  }

  // Increment views asynchronously
  supabase.rpc('increment_topic_views', { topic_id: topic.id }).then(); // Will implement rpc later if needed, or simple update:
  // For now, doing a direct update:
  await supabase.from('topics').update({ views: topic.views + 1 }).eq('id', topic.id);

  // Fetch Replies
  const { data: replies } = await supabase
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 py-6">
      
      {/* Üst Kısım: Breadcrumb & Başlık */}
      <div className="space-y-4">
        <Link href={`/forum/${(topic.forums as any)?.slug}`} className="inline-flex items-center gap-2 text-[10px] font-bold text-[#64748b] hover:text-white transition-colors bg-[#050a14] px-3 py-1.5 rounded border border-[#1e293b]">
          <ArrowLeft size={14} /> {(topic.forums as any)?.title} Forumuna Dön
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
          {topic.title}
          {topic.is_solved && (
            <span className="px-2 py-0.5 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-[10px] rounded uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <CheckCircle size={12} /> Çözüldü
            </span>
          )}
        </h1>
        <div className="flex items-center gap-4 text-[10px] text-[#64748b] font-bold border-b border-[#1e293b] pb-4">
          <span className="flex items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="w-5 h-5 rounded overflow-hidden bg-[#0a1325] border border-[#1e293b] flex items-center justify-center">
                <img 
                src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(topic.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=s`}
                alt="Author"
                className="w-6 h-6 -mt-1 pixelated"
                />
            </div>
            <Link href={`/profile/${(topic.author as any)?.username}`} className="hover:text-[#3b82f6] transition-colors">
              {(topic.author as any)?.username}
            </Link>
          </span>
          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
          <span className="flex items-center gap-1"><MessageCircle size={12} /> {replies?.length || 0} Cevap</span>
        </div>
      </div>

      {/* Anket Gösterimi (Eğer varsa) */}
      {topic.polls && topic.polls.length > 0 && (
        <PollView poll={topic.polls[0]} currentUser={user} />
      )}

      {/* Ana Konu Gövdesi */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Yazar Bilgi Kutusu */}
        <div className="hidden md:flex flex-col items-center w-48 habbo-box flex-shrink-0 self-start">
          <div className="habbo-box-header green py-1 px-2 text-[10px] text-center w-full uppercase tracking-widest font-bold">Konu Sahibi</div>
          <div className="bg-[#050a14] w-full p-4 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="w-full aspect-square bg-[#0a1325] border border-[#1e293b] rounded mb-4 overflow-hidden flex items-center justify-center shadow-inner relative">
                <img 
                src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(topic.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=l`}
                alt={(topic.author as any)?.username}
                className="w-full h-full object-cover pixelated"
                style={{ objectPosition: 'center -10px' }}
                />
            </div>
            <Link href={`/profile/${(topic.author as any)?.username}`} className="text-[13px] font-black text-white text-center truncate w-full hover:text-[#3b82f6] transition-colors">
              {(topic.author as any)?.username}
            </Link>
            <div className="text-[10px] text-[#64748b] mt-1">{(topic.author as any)?.role || 'Üye'}</div>
          </div>
        </div>

        {/* İçerik */}
        <div className="flex-1 habbo-box min-h-[200px] flex flex-col">
            <div className="habbo-box-header blue py-1 px-2 text-[10px]">{new Date(topic.created_at).toLocaleString('tr-TR')}</div>
            <div className="p-6 bg-[#050a14] flex flex-col flex-1">
                <div className="prose prose-invert prose-sm md:prose-base max-w-none flex-1 text-gray-300" dangerouslySetInnerHTML={{ __html: topic.content }} />
                
                <div className="mt-8 border-t border-[#1e293b] pt-4 flex flex-wrap gap-4 justify-between items-center bg-[#0a1325] -mx-6 -mb-6 px-6 pb-6 rounded-b">
                  <ReactionView targetId={topic.id} targetType="topic" currentUser={user} />
                  <TopicModeration topic={topic} userProfile={userProfile} />
                </div>
            </div>
        </div>
      </div>

      {/* Cevaplar */}
      <div className="space-y-4 pt-8">
        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2 text-white">Cevaplar ({replies?.length || 0})</h3>
        
        {replies?.map((reply: any) => (
          <div key={reply.id} className="flex flex-col md:flex-row gap-4">
            <div className="hidden md:flex flex-col items-center w-48 habbo-box flex-shrink-0 self-start">
              <div className="habbo-box-header gray py-1 px-2 text-[10px] text-center w-full uppercase tracking-widest font-bold">Cevaplayan</div>
              <div className="bg-[#050a14] w-full p-4 flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="w-full aspect-square bg-[#0a1325] border border-[#1e293b] rounded mb-2 overflow-hidden flex items-center justify-center shadow-inner relative">
                    <img 
                    src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(reply.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=l`}
                    alt={(reply.author as any)?.username}
                    className="w-full h-full object-cover pixelated"
                    style={{ objectPosition: 'center -10px' }}
                    />
                </div>
                <Link href={`/profile/${(reply.author as any)?.username}`} className="text-[12px] font-black text-white text-center truncate w-full hover:text-[#3b82f6] transition-colors">
                  {(reply.author as any)?.username}
                </Link>
              </div>
            </div>
            
            <div className={`flex-1 habbo-box flex flex-col ${reply.is_solution ? 'border-[#22c55e]' : ''}`}>
              <div className={`habbo-box-header py-1 px-2 text-[10px] flex justify-between ${reply.is_solution ? 'green' : 'gray'}`}>
                <span>{new Date(reply.created_at).toLocaleString('tr-TR')}</span>
                {reply.is_solution && <span className="text-white font-bold tracking-wider">✅ Çözüm</span>}
              </div>
              <div className={`p-6 flex flex-col flex-1 ${reply.is_solution ? 'bg-[#050a14]' : 'bg-[#050a14]'}`}>
                <div className="prose prose-invert prose-sm md:prose-base max-w-none flex-1 text-gray-300" dangerouslySetInnerHTML={{ __html: reply.content }} />
                
                <div className={`mt-6 pt-4 border-t ${reply.is_solution ? 'border-[#22c55e]/30' : 'border-[#1e293b]'}`}>
                    <ReactionView targetId={reply.id} targetType="reply" currentUser={user} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {replies?.length === 0 && (
          <div className="text-center p-12 text-[#64748b] bg-[#050a14] border border-dashed border-[#1e293b] rounded habbo-box text-sm">
            Bu konuya henüz cevap yazılmamış. İlk cevabı sen yaz!
          </div>
        )}
      </div>

      {/* Cevap Yazma Formu */}
      {!topic.is_locked ? (
        <div className="mt-12">
          <ReplyForm topicId={topic.id} currentUser={user} />
        </div>
      ) : (
        <div className="mt-8 p-6 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-center font-bold rounded habbo-box text-xs uppercase tracking-widest">
          🔒 Bu konu kilitlenmiştir ve yeni cevaplara kapalıdır.
        </div>
      )}

    </div>
  );
}
