import Link from 'next/link';

interface NewsCardProps {
  news: {
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string;
    author: { username: string; habbo_username: string };
    published_at: string;
  };
}

export default function NewsCard({ news }: NewsCardProps) {
  // Classic avatar API URL:
  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${news.author.habbo_username}&direction=2&head_direction=2&gesture=sml&size=m`;

  return (
    <Link href={`/news/${news.slug}`} className="group block bg-white/10 dark:bg-black/20 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 hover:border-primary transition-all hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={news.thumbnail_url} 
          alt={news.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{news.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm opacity-80 line-clamp-2 mb-4">{news.summary}</p>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/10 overflow-hidden border-2 border-white/30 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarUrl} alt={news.author.username} className="mt-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-primary">{news.author.username}</div>
            <div className="text-xs opacity-60">{new Date(news.published_at).toLocaleDateString('tr-TR')}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
