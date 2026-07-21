import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlusCircle, MessageCircle, Eye, Pin, Lock, CheckCircle } from 'lucide-react';

export const revalidate = 0; // Disable caching

export default async function SubForumPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  // Fetch forum details
  const { data: forum, error: forumError } = await supabase
    .from('forums')
    .select(`
      id,
      title,
      description,
      icon,
      category_id,
      categories ( name )
    `)
    .eq('slug', params.slug)
    .single();

  if (forumError || !forum) {
    notFound();
  }

  // Fetch topics in this forum
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select(`
      id,
      title,
      slug,
      is_pinned,
      is_locked,
      is_solved,
      views,
      created_at,
      author:profiles!topics_author_id_fkey(username, habbo_username),
      replies(count)
    `)
    .eq('forum_id', forum.id)
    .order('is_pinned', { ascending: false }) // Pinned first
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Üst Navigasyon & Başlık */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-4">
          <Link href="/forum" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Foruma Dön
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center text-3xl">
              {forum.icon || '💬'}
            </div>
            <div>
              <div className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
                {(forum.categories as any)?.name}
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest">
                {forum.title}
              </h1>
            </div>
          </div>
          <p className="text-white/60 text-lg max-w-2xl">
            {forum.description}
          </p>
        </div>

        <Link 
          href={`/forum/new?forum_id=${forum.id}`}
          className="bg-primary text-white font-bold uppercase tracking-widest px-6 py-3 rounded-lg pixel-borders hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 shadow-2xl"
        >
          <PlusCircle size={20} /> Yeni Konu Aç
        </Link>
      </div>

      {/* Konular Listesi */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl mt-8">
        
        {/* Tablo Başlıkları */}
        <div className="hidden md:flex bg-black/40 border-b border-white/10 p-4 text-xs font-bold text-white/50 uppercase tracking-widest">
          <div className="flex-[3]">Konu Başlığı</div>
          <div className="flex-1 text-center">İstatistikler</div>
          <div className="flex-1 text-right">Son Mesaj</div>
        </div>

        {/* Liste */}
        {topicsError ? (
          <div className="p-8 text-center text-red-500">Konular yüklenirken hata oluştu.</div>
        ) : topics?.length === 0 ? (
          <div className="p-16 text-center text-white/50 flex flex-col items-center">
            <MessageCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg">Bu forumda henüz hiç konu açılmamış.</p>
            <p className="text-sm mt-2">İlk konuyu sen açmak ister misin?</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {topics?.map((topic: any) => (
              <Link 
                key={topic.id}
                href={`/forum/topic/${topic.slug}`}
                className={`flex flex-col md:flex-row items-start md:items-center p-4 hover:bg-white/5 transition-colors group ${topic.is_pinned ? 'bg-primary/5' : ''}`}
              >
                {/* Sol: İkon & Başlık */}
                <div className="flex-[3] flex items-center gap-4 w-full">
                  <div className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(topic.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=m`}
                      alt={(topic.author as any)?.username}
                      className="w-12 h-12 rounded-full bg-black/20 border-2 border-white/10"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 flex items-center gap-2">
                      {topic.is_pinned && <Pin size={16} className="text-orange-400" />}
                      {topic.is_locked && <Lock size={16} className="text-red-400" />}
                      {topic.title}
                      {topic.is_solved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded uppercase tracking-wider ml-2">
                          <CheckCircle size={10} /> Çözüldü
                        </span>
                      )}
                    </h3>
                    <div className="text-sm text-white/50 mt-1 flex items-center gap-2">
                      <span className="font-bold text-white/70">{(topic.author as any)?.username}</span>
                      <span>•</span>
                      <span>{new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>

                {/* Orta: İstatistikler */}
                <div className="flex-1 flex justify-center gap-6 mt-4 md:mt-0 w-full md:w-auto text-sm text-white/50">
                  <div className="flex items-center gap-1" title="Cevaplar">
                    <MessageCircle size={16} /> {(topic.replies as any)?.[0]?.count || 0}
                  </div>
                  <div className="flex items-center gap-1" title="Görüntülenme">
                    <Eye size={16} /> {topic.views || 0}
                  </div>
                </div>

                {/* Sağ: Son Mesaj (Şu an statik, gerçekte reply'lardan çekilmeli) */}
                <div className="flex-1 mt-4 md:mt-0 w-full md:w-auto text-sm md:text-right">
                  <div className="text-white/50">
                    Henüz cevap yok
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
