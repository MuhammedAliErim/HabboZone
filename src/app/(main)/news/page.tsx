import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 60; // Cache for 60 seconds

export default async function NewsPage() {
  const supabase = await createClient();

  // Fetch News
  const { data: newsItems } = await supabase
    .from('news')
    .select(`
      title, 
      slug, 
      summary, 
      thumbnail_url, 
      published_at,
      author:profiles!news_author_id_fkey(username, habbo_username)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      <div className="habbo-box">
        <div className="habbo-box-header blue">Tüm Haberler</div>
        <div className="p-4 bg-gray-50">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems?.map((news: any) => (
              <div key={news.slug} className="bg-white border border-gray-200 rounded p-2 shadow-sm flex flex-col gap-2 hover:border-primary transition-colors group">
                <div className="h-40 rounded overflow-hidden relative border border-gray-100">
                  <img src={news.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="px-1 py-2 flex flex-col flex-1">
                    <Link href={`/news/${news.slug}`} className="font-bold text-sm text-gray-800 hover:text-primary leading-tight mb-2">
                        {news.title}
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">
                        {news.summary}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mt-auto pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded overflow-hidden bg-gray-100">
                                <img src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(news.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=s`} alt="" className="w-8 h-8 -mt-1" />
                            </div>
                            <span className="font-bold">{(news.author as any)?.username || 'Admin'}</span>
                        </div>
                        <span>{new Date(news.published_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>
              </div>
            ))}
            
            {(!newsItems || newsItems.length === 0) && (
              <div className="col-span-full p-8 text-center text-gray-500 bg-white border border-gray-200 rounded">
                Henüz hiç haber eklenmemiş.
              </div>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
