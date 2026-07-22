import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlusCircle, MessageCircle, Eye, Pin, Lock, CheckCircle } from 'lucide-react';

export const revalidate = 0; // Disable caching

export default async function SubForumPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
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
    .eq('slug', resolvedParams.slug)
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 py-6">
      
      {/* Üst Navigasyon & Başlık */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-4">
          <Link href="/forum" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
            <ArrowLeft size={14} /> Foruma Dön
          </Link>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-3xl">
              {forum.icon || '💬'}
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
                {(forum.categories as any)?.name}
              </div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-800">
                {forum.title}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {forum.description}
              </p>
            </div>
          </div>
        </div>

        <Link 
          href={`/forum/new?forum_id=${forum.id}`}
          className="habbo-button green text-sm flex items-center gap-2"
        >
          <PlusCircle size={16} /> Yeni Konu Aç
        </Link>
      </div>

      {/* Konular Listesi */}
      <div className="habbo-box">
        
        {/* Tablo Başlıkları */}
        <div className="habbo-box-header blue hidden md:flex text-[10px]">
          <div className="flex-[3]">Konu Başlığı</div>
          <div className="flex-1 text-center">İstatistikler</div>
          <div className="flex-1 text-right">Son Mesaj</div>
        </div>

        {/* Liste */}
        <div className="bg-white">
            {topicsError ? (
            <div className="p-8 text-center text-red-500 text-sm font-bold bg-red-50">Konular yüklenirken hata oluştu.</div>
            ) : topics?.length === 0 ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center bg-gray-50">
                <MessageCircle size={48} className="mb-4 text-gray-300" />
                <p className="text-sm font-bold">Bu forumda henüz hiç konu açılmamış.</p>
                <p className="text-xs mt-2">İlk konuyu sen açmak ister misin?</p>
            </div>
            ) : (
            <div className="divide-y divide-gray-200">
                {topics?.map((topic: any) => (
                <Link 
                    key={topic.id}
                    href={`/forum/topic/${topic.slug}`}
                    className={`flex flex-col md:flex-row items-start md:items-center p-3 hover:bg-gray-50 transition-colors group ${topic.is_pinned ? 'bg-orange-50/50' : ''}`}
                >
                    {/* Sol: İkon & Başlık */}
                    <div className="flex-[3] flex items-center gap-3 w-full">
                    <div className="flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                            <img 
                            src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(topic.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=m`}
                            alt={(topic.author as any)?.username}
                            className="w-16 h-16 -mt-2"
                            />
                        </div>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1 flex items-center gap-2">
                        {topic.is_pinned && <Pin size={14} className="text-orange-500" />}
                        {topic.is_locked && <Lock size={14} className="text-red-500" />}
                        {topic.title}
                        {topic.is_solved && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] rounded uppercase tracking-wider ml-2 border border-green-200">
                            <CheckCircle size={8} /> Çözüldü
                            </span>
                        )}
                        </h3>
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-2">
                        <span className="font-bold text-gray-700">{(topic.author as any)?.username}</span>
                        <span>•</span>
                        <span>{new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                    </div>

                    {/* Orta: İstatistikler */}
                    <div className="flex-1 flex justify-center gap-4 mt-3 md:mt-0 w-full md:w-auto text-xs text-gray-500">
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-gray-200" title="Cevaplar">
                        <MessageCircle size={12} /> <span className="font-bold text-gray-700">{(topic.replies as any)?.[0]?.count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-gray-200" title="Görüntülenme">
                        <Eye size={12} /> <span className="font-bold text-gray-700">{topic.views || 0}</span>
                    </div>
                    </div>

                    {/* Sağ: Son Mesaj (Şu an statik, gerçekte reply'lardan çekilmeli) */}
                    <div className="flex-1 mt-3 md:mt-0 w-full md:w-auto text-[10px] md:text-right">
                    <div className="text-gray-400 bg-gray-50 p-2 rounded border border-gray-100 text-center md:text-right inline-block">
                        Henüz cevap yok
                    </div>
                    </div>
                </Link>
                ))}
            </div>
            )}
        </div>
      </div>

    </div>
  );
}
