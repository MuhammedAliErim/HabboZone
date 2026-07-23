import Link from 'next/link';
import { Clock, Eye, MessageSquare } from 'lucide-react';

interface NewsCardProps {
  news: {
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string;
    author: { username: string; habbo_username: string };
    published_at: string;
    views?: string;
    comments?: string;
    time?: string;
    tag?: string;
    tagColor?: string;
  };
}

export default function NewsCard({ news }: NewsCardProps) {
  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${news.author.habbo_username}&direction=2&head_direction=2&gesture=sml&size=s`;

  // Mocks for now if not provided
  const views = news.views || Math.floor(Math.random() * 500 + 100).toString();
  const comments = news.comments || Math.floor(Math.random() * 50 + 5).toString();
  const time = news.time || "3 dk";
  const tag = news.tag || "HABER";
  const tagColor = news.tagColor || "bg-[#3b82f6]";

  return (
    <Link href={`/news/${news.slug}`} className="habbo-box hover:border-[#3b82f6]/50 p-3 flex flex-col gap-3 group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]">
      <div className="w-full h-[140px] bg-[#0a1325] rounded-[4px] relative overflow-hidden border border-[#1e293b]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={news.thumbnail_url || 'https://images.habbo.com/c_images/reception/new_furni_promo.png'} 
          alt={news.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pixelated" 
        />
        <span className={`absolute top-2 left-2 ${tagColor} text-white text-[10px] font-black px-2 py-0.5 rounded-[3px] uppercase shadow-md z-10`}>
          {tag}
        </span>
      </div>
      
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-white font-bold text-[15px] leading-tight group-hover:text-[#facc15] transition-colors mb-2">
            {news.title}
          </h3>
          <p className="text-gray-400 text-[12px] leading-snug line-clamp-2 mb-3">
            {news.summary}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 border-t border-[#1e293b]/50 pt-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-white text-[11px] font-bold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} className="w-5 h-5 rounded-full bg-[#0a1325] pixelated border border-[#1e293b]" alt={news.author.username} /> 
              {news.author.username}
            </span>
            <span className="text-[#6b7280] text-[10px] font-bold">
              {new Date(news.published_at).toLocaleDateString('tr-TR')}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#6b7280] text-[10px] font-bold">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors"><Clock size={10} /> {time}</span>
                <span className="flex items-center gap-1 group-hover:text-green-400 transition-colors"><Eye size={10} /> {views}</span>
              </div>
              <span className="flex items-center gap-1 group-hover:text-[#facc15] transition-colors"><MessageSquare size={10} /> {comments} Yorum</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
