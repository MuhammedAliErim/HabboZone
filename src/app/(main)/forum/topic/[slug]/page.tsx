import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import ReplyForm from './ReplyForm';
import PollView from './PollView';
import ReactionView from './ReactionView';
import TopicModeration from './TopicModeration';

export const revalidate = 0; // Disable caching

export default async function TopicPage({ params }: { params: { slug: string } }) {
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
    .eq('slug', params.slug)
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
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Üst Kısım: Breadcrumb & Başlık */}
      <div className="space-y-4">
        <Link href={`/forum/${topic.forums?.slug}`} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={16} /> {topic.forums?.title} Forumuna Dön
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest flex items-center gap-3">
          {topic.title}
          {topic.is_solved && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={16} /> Çözüldü
            </span>
          )}
        </h1>
        <div className="flex items-center gap-4 text-sm text-white/50 font-bold border-b border-white/10 pb-4">
          <span className="flex items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${topic.author?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=s`}
              alt="Author"
              className="w-5 h-5 rounded-full bg-black/20"
            />
            {topic.author?.username}
          </span>
          <span className="flex items-center gap-1"><Clock size={14} /> {new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
          <span className="flex items-center gap-1"><MessageCircle size={14} /> {replies?.length || 0} Cevap</span>
        </div>
      </div>

      {/* Anket Gösterimi (Eğer varsa) */}
      {topic.polls && topic.polls.length > 0 && (
        <PollView poll={topic.polls[0]} currentUser={user} />
      )}

      {/* Ana Konu Gövdesi */}
      <div className="flex gap-4">
        {/* Yazar Bilgi Kutusu */}
        <div className="hidden md:flex flex-col items-center w-48 bg-black/20 border border-white/10 rounded-2xl p-4 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${topic.author?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=l`}
            alt={topic.author?.username}
            className="w-full aspect-square object-cover bg-black/40 rounded-xl mb-4"
            style={{ objectPosition: 'center -10px' }}
          />
          <div className="text-lg font-black text-center truncate w-full">{topic.author?.username}</div>
          <div className="text-xs text-primary font-bold uppercase tracking-widest mb-4">Konu Sahibi</div>
          {/* Rozetler buraya gelecek */}
        </div>

        {/* İçerik */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[200px] flex flex-col">
          <div className="prose prose-invert max-w-none flex-1" dangerouslySetInnerHTML={{ __html: topic.content }} />
          
          <div className="mt-8 border-t border-white/10 pt-4 flex justify-between items-center">
            <ReactionView targetId={topic.id} targetType="topic" currentUser={user} />
            <TopicModeration topic={topic} userProfile={userProfile} />
          </div>
        </div>
      </div>

      {/* Cevaplar */}
      <div className="space-y-4 pt-8">
        <h3 className="text-xl font-bold uppercase tracking-widest border-b border-white/10 pb-2">Cevaplar ({replies?.length || 0})</h3>
        
        {replies?.map((reply: any) => (
          <div key={reply.id} className="flex gap-4">
            <div className="hidden md:flex flex-col items-center w-48 bg-black/20 border border-white/10 rounded-2xl p-4 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${reply.author?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=l`}
                alt={reply.author?.username}
                className="w-full aspect-square object-cover bg-black/40 rounded-xl mb-2"
                style={{ objectPosition: 'center -10px' }}
              />
              <div className="text-sm font-black text-center truncate w-full">{reply.author?.username}</div>
            </div>
            
            <div className={`flex-1 border rounded-2xl p-6 flex flex-col ${reply.is_solution ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between items-center mb-4 text-xs text-white/50 font-bold border-b border-white/5 pb-2">
                <span>{new Date(reply.created_at).toLocaleString('tr-TR')}</span>
                {reply.is_solution && <span className="text-green-400">✅ Çözüm Olarak İşaretlendi</span>}
              </div>
              <div className="prose prose-invert max-w-none flex-1" dangerouslySetInnerHTML={{ __html: reply.content }} />
              
              <div className="mt-4 border-t border-white/5 pt-2">
                <ReactionView targetId={reply.id} targetType="reply" currentUser={user} />
              </div>
            </div>
          </div>
        ))}

        {replies?.length === 0 && (
          <div className="text-center p-8 text-white/50">
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
        <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 text-red-400 text-center font-bold rounded-2xl uppercase tracking-widest">
          Bu konu kilitlenmiştir ve yeni cevaplara kapalıdır.
        </div>
      )}

    </div>
  );
}
