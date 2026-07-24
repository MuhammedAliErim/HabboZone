import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import NewsComments from '@/components/NewsComments';
import { Lock, Clock, BarChart2 } from 'lucide-react';
import Countdown from '@/components/Countdown';
import Breadcrumb from '@/components/ui/shared/Breadcrumb';
import ShareButtons from '@/components/ui/article/ShareButtons';
import ArticleMeta from '@/components/ui/article/ArticleMeta';
import TagList from '@/components/ui/article/TagList';
import VoteButtons from '@/components/ui/article/VoteButtons';
import TableOfContents from '@/components/ui/article/TableOfContents';
import { trackView, toggleVote } from '../../news/actions';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
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
  const { data: guideItem } = await supabase
    .from('news')
    .select('title, summary, thumbnail_url, published_at, author:profiles!news_author_id_fkey(username)')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!guideItem) {
    return { title: 'Rehber Bulunamadı' };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = guideItem.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png';

  return {
    title: `${guideItem.title} - Habbo Zone Rehberler`,
    description: guideItem.summary,
    openGraph: {
      title: guideItem.title,
      description: guideItem.summary,
      url: `https://habbozone.com/guides/${resolvedParams.slug}`,
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
      publishedTime: guideItem.published_at,
      authors: [guideItem.author ? (guideItem.author as any).username : 'Admin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: guideItem.title,
      description: guideItem.summary,
      images: [imageUrl],
    },
  };
}

export default async function GuideDetail({ params }: Props) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch main guide item with category
  const { data: guideItem } = await supabase
    .from('news')
    .select(`
      *,
      author:profiles!news_author_id_fkey(id, username, habbo_username),
      category:categories(id, name, slug)
    `)
    .eq('slug', resolvedParams.slug)
    .single();

  if (!guideItem) {
    notFound();
  }
  
  // Track view asynchronously
  trackView(guideItem.id);

  // Fetch Tags
  let tags: any = [];
  const { data: taggables } = await supabase
    .from('taggables')
    .select('tag:tags(id, name, slug)')
    .eq('target_type', 'news')
    .eq('target_id', guideItem.id);
    
  if (taggables) {
    tags = taggables.map(t => t.tag).filter(Boolean);
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
        .eq('target_id', guideItem.id)
        .single();
      userVote = vote?.reaction_type || null;
    }
  }

  // Count Votes
  const { count: upvotes } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', 'news')
    .eq('target_id', guideItem.id)
    .eq('reaction_type', 'upvote');
    
  const { count: downvotes } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', 'news')
    .eq('target_id', guideItem.id)
    .eq('reaction_type', 'downvote');

  // Fetch initial comments
  const { data: initialComments } = await supabase
    .from('comments')
    .select('*, author:profiles(username, habbo_username, role, avatar_url)', { count: 'exact' })
    .eq('news_id', guideItem.id)
    .order('created_at', { ascending: true });

  // Fetch Related Guides
  let relatedGuides: any = [];
  if (guideItem.category?.id) {
    const { data: related } = await supabase
      .from('news')
      .select('title, slug, thumbnail_url, published_at')
      .eq('category_id', guideItem.category.id)
      .eq('status', 'published')
      .neq('id', guideItem.id)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(3);
    if (related) relatedGuides = related;
  }

  // Parse custom_data for guides
  const difficultyColors: Record<string, string> = {
    'Kolay': 'bg-green-500/20 text-green-400 border-green-500/50',
    'Orta': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'Zor': 'bg-red-500/20 text-red-400 border-red-500/50'
  };
  const difficulty = guideItem.custom_data?.difficulty || 'Orta';
  const diffColorClass = difficultyColors[difficulty] || difficultyColors['Orta'];
  const estimatedTime = guideItem.custom_data?.estimated_time;
  const rewardBadge = guideItem.custom_data?.reward_badge;

  const isLocked = new Date(guideItem.published_at).getTime() > Date.now();
  const isAuthor = user?.id === guideItem.author_id;

  const breadcrumbs = [
    { label: 'Rehberler', href: '/guides' },
    ...(guideItem.category ? [{ label: guideItem.category.name as string, href: `/guides/category/${guideItem.category.slug}` }] : []),
    { label: guideItem.title },
  ];

  return (
    <>
      <Script
        id="guide-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guideItem.title,
            image: guideItem.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png',
            author: {
              '@type': 'Person',
              name: guideItem.author ? (guideItem.author as any).username : 'Admin',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Habbo Zone',
              logo: {
                '@type': 'ImageObject',
                url: 'https://habbozone.com/logo.png',
              },
            },
            datePublished: guideItem.published_at,
            dateModified: guideItem.updated_at || guideItem.published_at,
          }),
        }}
      />
      <div className="pb-16 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <section className="relative w-full min-h-[350px] md:min-h-[450px] mb-8 border-b-2 border-black flex flex-col justify-end">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${guideItem.thumbnail_url || 'https://images.habbo.com/c_images/article_images_tr/tr_news_header_1.png'})`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050a14] via-[#050a14]/80 to-transparent"></div>
          
          <div className="relative z-20 max-w-[1000px] w-full mx-auto px-6 pb-12 pt-32">
            <div className="mb-6 flex justify-center md:justify-start text-white/70">
              <Breadcrumb items={breadcrumbs} />
            </div>
            
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
              
              {/* Badges / Tags */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {guideItem.category && (
                  <Link href={`/guides/category/${guideItem.category.slug}`} className="bg-[#facc15] text-black text-[11px] font-black px-3 py-1.5 uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
                    {guideItem.category.name}
                  </Link>
                )}
                {isLocked && (
                  <span className="bg-gray-800 text-white border-2 border-gray-600 text-[11px] font-black px-3 py-1.5 uppercase tracking-wider flex items-center gap-2">
                    <Lock size={14} className="text-yellow-500" /> Zamanlandı
                  </span>
                )}
                {isAuthor && (
                  <span className="bg-blue-600 text-white border-2 border-blue-400 text-[11px] font-black px-3 py-1.5 uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    Senin Rehberin
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight text-shadow-lg drop-shadow-2xl">
                {guideItem.title}
              </h1>

              {/* Summary */}
              <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl text-shadow-sm leading-relaxed">
                {guideItem.summary}
              </p>

              {/* Meta info & Custom Data row */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 pt-4 border-t border-white/10 w-full max-w-2xl">
                <ArticleMeta 
                  author={guideItem.author} 
                  publishedAt={guideItem.published_at} 
                  views={guideItem.views || 0}
                />
                
                {/* Guide Specs */}
                <div className="flex items-center gap-3 ml-auto">
                    <div className={`flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-md border shadow-sm ${diffColorClass}`}>
                        <BarChart2 size={14} /> {difficulty}
                    </div>
                    {estimatedTime && (
                        <div className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-md border border-white/20 bg-white/10 text-gray-200 shadow-sm backdrop-blur-sm">
                            <Clock size={14} /> {estimatedTime}
                        </div>
                    )}
                    {rewardBadge && (
                        <div className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-md border border-purple-500/50 bg-purple-500/20 text-purple-300 shadow-sm backdrop-blur-sm">
                            ⭐ Rozet: {rewardBadge}
                        </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {isLocked && !isAuthor ? (
          <div className="max-w-3xl mx-auto px-6 py-16">
            <div className="habbo-box border-yellow-500/30 bg-[#0f172a] p-12 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6">
                 <Lock size={40} className="text-yellow-500" />
               </div>
               <h2 className="text-2xl font-black text-white mb-4">Bu Rehber Henüz Yayınlanmadı</h2>
               <p className="text-gray-400 mb-8 max-w-md mx-auto">Bu rehber için belirlenen yayın tarihi henüz gelmedi. Aşağıdaki geri sayım bittiğinde rehber otomatik olarak erişime açılacaktır.</p>
               <div className="bg-[#050a14] border border-[#1e293b] p-6 rounded-xl shadow-inner min-w-[300px]">
                  <div className="text-3xl font-black text-yellow-400">
                    <Countdown targetDate={guideItem.published_at} />
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            
            {/* Left Column - Article Body */}
            <div className="w-full min-w-0">
              
              <div className="habbo-box bg-[#090e17] p-6 md:p-10 mb-8 border-t-4 border-t-[#3b82f6]">
                
                {/* Desktop Share (Floating/Sticky) usually handled by ShareButtons if designed so, but here inline */}
                <div className="flex justify-end mb-6 pb-6 border-b border-white/5">
                   <ShareButtons title={guideItem.title} url={`https://habbozone.com/guides/${guideItem.slug}`} />
                </div>

                <div 
                  id="guide-content"
                  className="prose prose-invert prose-blue max-w-none prose-img:rounded-xl prose-img:border prose-img:border-[#1e293b] prose-headings:font-black prose-a:text-[#3b82f6] prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: guideItem.content }}
                />

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  {tags.length > 0 && <TagList tags={tags} />}
                  <div className="shrink-0">
                     <VoteButtons 
                        targetId={guideItem.id}
                        targetType="news"
                        initialUpvotes={upvotes || 0}
                        initialDownvotes={downvotes || 0}
                        initialUserVote={userVote as 'upvote' | 'downvote' | null}
                        onVoteAction={toggleVote}
                      />
                  </div>
                </div>
              </div>

              {/* Author Box */}
              {guideItem.author && (
                <div className="habbo-box bg-gradient-to-r from-[#0f172a] to-[#090e17] p-6 mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                   <div className="w-24 h-24 rounded-2xl bg-[#050a14] border-2 border-black flex items-center justify-center shrink-0 relative overflow-hidden shadow-lg">
                      <img 
                        src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${(guideItem.author as any).username}&action=std&direction=2&head_direction=2&gesture=sml&size=m`} 
                        alt={(guideItem.author as any).username}
                        className="absolute -top-4 drop-shadow-md scale-[1.5] pixelated"
                      />
                   </div>
                   <div className="flex-1 text-center sm:text-left">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Rehberi Hazırlayan</div>
                      <Link href={`/profile/${(guideItem.author as any).username}`} className="text-2xl font-black text-white hover:text-[#facc15] transition-colors">
                        {(guideItem.author as any).username}
                      </Link>
                      <p className="text-gray-400 text-sm mt-3 font-medium">
                        Habbo Zone ekibinden. Bu rehber sana yardımcı olduysa oy vermeyi ve yorum yapmayı unutma!
                      </p>
                   </div>
                </div>
              )}

              {/* Comments Section */}
              <NewsComments newsId={guideItem.id} initialComments={initialComments || []} />
              
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-24 self-start">
               {/* Table of Contents */}
               <TableOfContents contentSelector="#guide-content" />

               {/* Related Guides Widget */}
               {relatedGuides.length > 0 && (
                 <div className="habbo-box bg-[#090e17] p-5">
                   <h3 className="font-black text-white text-[15px] uppercase tracking-wider mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
                     <span className="w-2 h-2 bg-[#facc15] rounded-full"></span>
                     İlgili Rehberler
                   </h3>
                   <div className="space-y-4">
                     {relatedGuides.map((related: any) => (
                       <Link key={related.slug} href={`/guides/${related.slug}`} className="flex gap-4 group">
                         <div className="w-20 h-16 rounded bg-[#050a14] border border-[#1e293b] overflow-hidden relative shrink-0">
                            {related.thumbnail_url && (
                              <Image src={related.thumbnail_url} alt={related.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                            )}
                         </div>
                         <div className="flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-gray-200 group-hover:text-[#3b82f6] transition-colors line-clamp-2 leading-tight">
                              {related.title}
                            </h4>
                            <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                               <Clock size={10} />
                               {new Date(related.published_at).toLocaleDateString('tr-TR')}
                            </div>
                         </div>
                       </Link>
                     ))}
                   </div>
                 </div>
               )}
            </div>
            
          </div>
        )}
      </div>
    </>
  );
}
