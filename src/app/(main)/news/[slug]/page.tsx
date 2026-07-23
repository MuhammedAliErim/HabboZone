import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import NewsComments from '@/components/NewsComments';
import { Clock, Eye, Calendar, User } from 'lucide-react';

export const revalidate = 60;

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: newsItem } = await supabase
    .from('news')
    .select(`
      *,
      author:profiles!news_author_id_fkey(username, habbo_username)
    `)
    .eq('slug', resolvedParams.slug)
    .single();

  if (!newsItem) {
    notFound();
  }

  // Fetch initial comments
  const { data: initialComments } = await supabase
    .from('comments')
    .select('*, author:profiles(username, habbo_username, role, avatar_url)')
    .eq('news_id', newsItem.id)
    .order('created_at', { ascending: true });

  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(newsItem.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=l`;

  return (
    <article className="max-w-4xl mx-auto w-full py-8 space-y-6 animate-in fade-in duration-500 px-4 lg:px-0">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-[#1e293b] border border-black p-3 rounded-[4px] shadow-[0_4px_0_#000]">
          <Link href="/news" className="text-[11px] font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1 uppercase">
            ← Haberlere Dön
          </Link>
          <div className="text-[11px] font-bold text-gray-400 flex items-center gap-4">
            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(newsItem.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> 3 dk okuma</span>
            <span className="flex items-center gap-1"><Eye size={12}/> 1.2b</span>
          </div>
      </div>

      {/* Main Content Box */}
      <div className="habbo-box relative overflow-hidden">
        
        {/* Header */}
        <div className="habbo-box-header blue flex justify-between items-center border-b border-black">
            <span className="truncate">{newsItem.title}</span>
        </div>
        
        <div className="bg-[#0f172a]">
            {/* Hero Image */}
            <div className="w-full h-[300px] md:h-[400px] border-b-2 border-black bg-[#0a1325] relative">
                <img 
                    src={newsItem.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} 
                    alt={newsItem.title}
                    className="w-full h-full object-cover pixelated opacity-90"
                />
                
                {/* Author Badge */}
                <div className="absolute -bottom-6 left-6 flex items-center gap-3 bg-[#1e293b] p-2 rounded-[4px] border-2 border-black shadow-[4px_4px_0_#000] z-10">
                    <div className="w-12 h-12 bg-[#0a1325] rounded-[2px] border border-black overflow-hidden flex items-center justify-center">
                        <img src={avatarUrl} alt="yazar" className="pixelated -mt-2" />
                    </div>
                    <div className="pr-2">
                        <div className="text-[9px] text-[#facc15] uppercase font-black tracking-wider flex items-center gap-1 mb-0.5">
                            <User size={10} /> Yazar
                        </div>
                        <div className="font-bold text-[13px] text-white">{(newsItem.author as any)?.username || 'Admin'}</div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-8 pt-12 md:p-12 md:pt-14 relative z-0">
                <p className="text-[15px] font-bold text-white mb-8 border-l-4 border-[#facc15] pl-4 bg-[#1e293b] py-3 pr-4 rounded-r-[4px] shadow-sm leading-relaxed">
                    {newsItem.summary}
                </p>
                
                {/* Prose Content */}
                <div 
                    className="prose prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:text-white prose-a:text-[#38bdf8] hover:prose-a:text-[#7dd3fc] prose-p:text-gray-300 prose-strong:text-white prose-li:text-gray-300 prose-img:rounded-[4px] prose-img:border-2 prose-img:border-black prose-img:shadow-[4px_4px_0_#000]"
                    dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }} 
                />
            </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <NewsComments newsId={newsItem.id} initialComments={initialComments || []} />

    </article>
  );
}
