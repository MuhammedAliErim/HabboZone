import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import NewsComments from '@/components/NewsComments';
import { Lock } from 'lucide-react';
import Countdown from '@/components/Countdown';
import Breadcrumb from '@/components/ui/shared/Breadcrumb';
import ShareButtons from '@/components/ui/article/ShareButtons';
import ArticleMeta from '@/components/ui/article/ArticleMeta';
import TagList from '@/components/ui/article/TagList';
import VoteButtons from '@/components/ui/article/VoteButtons';
import TableOfContents from '@/components/ui/article/TableOfContents';
import { trackView, toggleVote } from '../actions';
import { Metadata, ResolvingMetadata } from 'next';
import Script from 'next/script';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: newsItem } = await supabase
    .from('news')
    .select('title, summary, thumbnail_url, published_at, author:profiles!news_author_id_fkey(username)')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!newsItem) {
    return { title: 'Haber Bulunamadı' };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = newsItem.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png';

  return {
    title: `${newsItem.title} - Habbo Zone`,
    description: newsItem.summary,
    openGraph: {
      title: newsItem.title,
      description: newsItem.summary,
      url: `https://habbozone.com/news/${resolvedParams.slug}`,
      siteName: 'Habbo Zone',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
        ...previousImages,
      ],
      locale: 'tr_TR',
      type: 'article',
      publishedTime: newsItem.published_at,
      authors: [newsItem.author ? (newsItem.author as any).username : 'Admin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: newsItem.title,
      description: newsItem.summary,
      images: [imageUrl],
    },
  };
}

export default async function NewsDetail({ params }: Props) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch main news item with category and tags
  const { data: newsItem } = await supabase
    .from('news')
    .select(`
      *,
      author:profiles!news_author_id_fkey(id, username, habbo_username),
      category:categories(id, name, slug)
    `)
    .eq('slug', resolvedParams.slug)
    .single();

  if (!newsItem) {
    notFound();
  }
  
  // Track view asynchronously
  trackView(newsItem.id);

  // Fetch Tags
  let tags = [];
  const { data: taggables, error: taggablesError } = await supabase
    .from('taggables')
    .select('tag:tags(id, name, slug)')
    .eq('target_type', 'news')
    .eq('target_id', newsItem.id);
    
  if (!taggablesError && taggables && taggables.length > 0) {
    tags = taggables.map((t: any) => t.tag);
  } else {
    // Fallback to news_tags
    const { data: tagsData } = await supabase
      .from('news_tags')
      .select('tag:tags(id, name, slug)')
      .eq('news_id', newsItem.id);
    tags = tagsData?.map((t: any) => t.tag) || [];
  }

  // Fetch User Vote if logged in
  let userVote = null;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
    if (profile) {
      const { data: vote } = await supabase
        .from('likes')
        .select('reaction_type')
        .eq('user_id', profile.id)
        .eq('target_type', 'news')
        .eq('target_id', newsItem.id)
        .single();
      userVote = vote?.reaction_type || null;
    }
  }

  // Count Votes
  const { count: upvotes } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', 'news')
    .eq('target_id', newsItem.id)
    .eq('reaction_type', 'upvote');
    
  const { count: downvotes } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', 'news')
    .eq('target_id', newsItem.id)
    .eq('reaction_type', 'downvote');

  // Check if content is locked (scheduled for the future)
  const isLocked = new Date(newsItem.published_at).getTime() > Date.now();

  // Fetch initial comments
  const { data: initialComments, count: commentsCount } = await supabase
    .from('comments')
    .select('*, author:profiles(username, habbo_username, role, avatar_url)', { count: 'exact' })
    .eq('news_id', newsItem.id)
    .order('created_at', { ascending: true });

  // Fetch Related News
  const { data: relatedNews } = await supabase
    .from('news')
    .select('id, title, slug, thumbnail_url, published_at')
    .eq('category_id', (newsItem.category as any)?.id)
    .neq('id', newsItem.id)
    .eq('status', 'Published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(3);

  // Fetch Prev/Next News
  const { data: prevNews } = await supabase
    .from('news')
    .select('title, slug')
    .eq('status', 'Published')
    .lt('published_at', newsItem.published_at)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  const { data: nextNews } = await supabase
    .from('news')
    .select('title, slug')
    .eq('status', 'Published')
    .gt('published_at', newsItem.published_at)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: true })
    .limit(1)
    .single();

  // Reading time estimation (rough: 200 words per minute)
  const wordCount = newsItem.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(newsItem.author as any)?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=l`;
  const categoryName = (newsItem.category as any)?.name || 'Haberler';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: newsItem.title,
    image: [
      newsItem.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'
    ],
    datePublished: newsItem.published_at,
    dateModified: newsItem.updated_at || newsItem.published_at,
    author: [{
        '@type': 'Person',
        name: (newsItem.author as any)?.username || 'Admin'
    }]
  };

  return (
    <>
    <Script
      id="news-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <article className="max-w-4xl mx-auto w-full py-8 space-y-6 animate-in fade-in duration-500 px-4 lg:px-0">
      
      <Breadcrumb items={[
        { label: 'Haberler', href: '/news' },
        { label: categoryName },
        { label: newsItem.title }
      ]} />

      {/* Main Content Box */}
      <div className="habbo-box relative overflow-hidden group/article">
        
        <div className="bg-[#0f172a]">
            {/* Hero Image */}
            <div className="w-full h-[300px] md:h-[450px] border-b-2 border-black bg-[#0a1325] relative overflow-hidden">
                <img 
                    src={newsItem.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} 
                    alt={newsItem.title}
                    className={`w-full h-full object-cover pixelated transition-transform duration-700 group-hover/article:scale-105 ${isLocked ? 'opacity-30 grayscale' : 'opacity-90'}`}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                   <div className="flex gap-2 mb-3">
                     <span className="bg-[#facc15] text-black text-[11px] font-black uppercase px-2 py-1 rounded-[2px] shadow-[2px_2px_0_#000]">
                       {categoryName}
                     </span>
                   </div>
                   <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-tight mb-2 group-hover/article:text-[#facc15] transition-colors">
                     {newsItem.title}
                   </h1>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-10 relative z-0">
                {isLocked ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 bg-[#1e293b] rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)] mb-6">
                      <Lock size={48} className="text-yellow-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">BU HABER KİLİTLİ</h2>
                    <p className="text-gray-400 text-[15px] mb-8 max-w-md mx-auto">
                      Haberin yayınlanma tarihi henüz gelmedi. İçeriği okuyabilmek için lütfen geri sayımın bitmesini bekleyin.
                    </p>
                    
                    <div className="bg-[#1e293b] px-8 py-4 rounded-[6px] border-2 border-[#334155] shadow-[0_4px_0_#000]">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-2">AÇILMASINA KALAN SÜRE</p>
                      <div className="text-4xl font-black text-yellow-400 drop-shadow-md">
                        <Countdown targetDate={newsItem.published_at} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <ArticleMeta 
                        author={newsItem.author as any}
                        publishedAt={newsItem.published_at}
                        updatedAt={newsItem.updated_at}
                        views={newsItem.views || 0}
                        readingTime={readingTime}
                        commentsCount={commentsCount || 0}
                      />
                    </div>

                    <TableOfContents contentSelector="#article-content" />

                    <p className="text-[16px] md:text-[18px] font-bold text-gray-200 mb-8 border-l-4 border-[#facc15] pl-4 bg-[#1e293b]/50 py-4 pr-4 rounded-r-[4px] leading-relaxed shadow-inner">
                        {newsItem.summary}
                    </p>
                    
                    {/* Prose Content */}
                    <div 
                        id="article-content"
                        className="prose prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:text-white prose-a:text-[#38bdf8] hover:prose-a:text-[#7dd3fc] prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-white prose-li:text-gray-300 prose-img:rounded-[4px] prose-img:border-2 prose-img:border-black prose-img:shadow-[4px_4px_0_#000]"
                        dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }} 
                    />

                    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
                       <TagList tags={tags} />
                       <ShareButtons url={`/news/${newsItem.slug}`} title={newsItem.title} />
                    </div>

                    <div className="mt-8 flex justify-center">
                      <VoteButtons 
                        targetId={newsItem.id}
                        targetType="news"
                        initialUpvotes={upvotes || 0}
                        initialDownvotes={downvotes || 0}
                        initialUserVote={userVote as 'upvote' | 'downvote' | null}
                        onVoteAction={toggleVote}
                      />
                    </div>
                  </>
                )}
            </div>
        </div>
      </div>
      
      {/* Prev / Next Navigation */}
      {!isLocked && (prevNews || nextNews) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prevNews ? (
            <Link href={`/news/${prevNews.slug}`} className="habbo-box bg-[#1e293b] p-4 flex flex-col hover:border-[#facc15] transition-colors group">
              <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Önceki Haber</span>
              <span className="text-white font-bold text-[14px] truncate group-hover:text-[#facc15] transition-colors">{prevNews.title}</span>
            </Link>
          ) : <div></div>}
          
          {nextNews && (
            <Link href={`/news/${nextNews.slug}`} className="habbo-box bg-[#1e293b] p-4 flex flex-col text-right hover:border-[#facc15] transition-colors group">
              <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sonraki Haber</span>
              <span className="text-white font-bold text-[14px] truncate group-hover:text-[#facc15] transition-colors">{nextNews.title}</span>
            </Link>
          )}
        </div>
      )}

      {/* Related News */}
      {!isLocked && relatedNews && relatedNews.length > 0 && (
        <div className="mt-8">
          <div className="habbo-box-header blue flex justify-between items-center border-b border-black mb-4">
              <span className="truncate">İlgili Haberler</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedNews.map((rn) => (
               <Link key={rn.id} href={`/news/${rn.slug}`} className="habbo-box bg-[#0f172a] overflow-hidden group/card flex flex-col hover:border-[#facc15] transition-colors">
                 <div className="h-32 w-full relative border-b-2 border-black overflow-hidden bg-[#0a1325]">
                   <img src={rn.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'} className="w-full h-full object-cover pixelated group-hover/card:scale-110 transition-transform duration-500" alt={rn.title} />
                 </div>
                 <div className="p-3">
                   <h4 className="text-white font-bold text-[13px] line-clamp-2 group-hover/card:text-[#facc15] transition-colors">{rn.title}</h4>
                   <span className="text-gray-500 text-[10px] mt-2 block">{new Date(rn.published_at).toLocaleDateString('tr-TR')}</span>
                 </div>
               </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      {!isLocked && (
        <NewsComments newsId={newsItem.id} initialComments={initialComments || []} />
      )}

    </article>
    </>
  );
}
