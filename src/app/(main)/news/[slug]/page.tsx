import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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

  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(newsItem.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=l`;

  return (
    <article className="max-w-4xl mx-auto w-full py-8 space-y-6">
      
      <div className="flex justify-between items-center bg-white border border-gray-200 p-2 rounded shadow-sm">
          <Link href="/news" className="text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
            ← Haberlere Dön
          </Link>
          <div className="text-[10px] text-gray-400">
            {new Date(newsItem.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
      </div>

      <div className="habbo-box">
        <div className="habbo-box-header blue flex justify-between items-center">
            <span className="truncate">{newsItem.title}</span>
        </div>
        <div className="bg-white">
            {/* Hero Image */}
            <div className="w-full h-[300px] md:h-[400px] border-b border-gray-200 bg-gray-100 relative">
                <img 
                    src={newsItem.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} 
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                />
                
                {/* Author Badge */}
                <div className="absolute -bottom-6 left-6 flex items-center gap-3 bg-white p-2 rounded shadow-md border border-gray-200">
                    <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                        <img src={avatarUrl} alt="yazar" className="w-16 h-16 -mt-2" />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Yazar</div>
                        <div className="font-bold text-sm text-gray-800">{(newsItem.author as any)?.username || 'Admin'}</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-12 md:p-12 md:pt-12">
                <p className="text-lg font-bold text-gray-700 mb-8 border-l-4 border-primary pl-4 bg-gray-50 py-2 pr-2 rounded-r">
                    {newsItem.summary}
                </p>
                
                {/* Prose Content */}
                <div 
                    className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-primary hover:prose-a:text-blue-600 prose-img:rounded-md prose-img:border prose-img:border-gray-200 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }} 
                />
            </div>
        </div>
      </div>
      
    </article>
  );
}
