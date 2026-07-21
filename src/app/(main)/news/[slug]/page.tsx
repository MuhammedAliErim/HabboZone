import { MOCK_NEWS } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const newsItem = MOCK_NEWS.find(n => n.slug === resolvedParams.slug);

  if (!newsItem) {
    notFound();
  }

  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${newsItem.author.habbo_username}&direction=2&head_direction=2&gesture=sml&size=l`;

  return (
    <article className="max-w-4xl mx-auto w-full py-12 px-4">
      <Link href="/" className="inline-block mb-8 text-primary font-bold hover:underline">
        ← Ana Sayfaya Dön
      </Link>

      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
          {newsItem.title}
        </h1>
        
        <div className="flex items-center justify-center gap-4 text-sm opacity-80">
          <div className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-4 py-2 rounded-full border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarUrl} alt={newsItem.author.name} className="w-8 h-8 rounded-full bg-black/10 object-cover overflow-hidden" />
            <span className="font-bold text-primary">{newsItem.author.name}</span>
          </div>
          <span>•</span>
          <time dateTime={newsItem.published_at}>
            {new Date(newsItem.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>
      </header>

      {/* Hero Image */}
      <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 border-4 border-white/20 shadow-2xl relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={newsItem.thumbnail_url} 
          alt={newsItem.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Modern Typography Content */}
      <div className="prose prose-lg dark:prose-invert prose-headings:font-black prose-a:text-primary hover:prose-a:text-primary/80 max-w-none bg-white/10 dark:bg-black/20 p-8 md:p-12 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl">
        <p className="lead text-xl md:text-2xl font-medium opacity-90 mb-8 border-l-4 border-primary pl-6">
          {newsItem.summary}
        </p>
        
        {/* Mock Markdown Rendering (We will use an MDX or Markdown parser in real integration) */}
        <div dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }} />
      </div>
    </article>
  );
}
