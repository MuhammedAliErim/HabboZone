import Link from 'next/link';
import Image from 'next/image';
import { Clock, BarChart2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface GuideCardProps {
  guide: {
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string;
    published_at: string;
    custom_data?: {
      difficulty?: string;
      estimated_time?: string;
      reward_badge?: string;
    };
    category: {
      name: string;
      slug: string;
    };
    author?: {
      username: string;
      avatar_url: string;
    };
  };
}

export default function GuideCard({ guide }: GuideCardProps) {
  const difficultyColors: Record<string, string> = {
    'Kolay': 'bg-green-500/20 text-green-400 border-green-500/50',
    'Orta': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'Zor': 'bg-red-500/20 text-red-400 border-red-500/50'
  };

  const difficulty = guide.custom_data?.difficulty || 'Orta';
  const diffColorClass = difficultyColors[difficulty] || difficultyColors['Orta'];

  return (
    <div className="group bg-[#090e17] border-2 border-black rounded-lg overflow-hidden flex flex-col relative before:absolute before:-inset-1 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:-translate-x-full hover:before:animate-[shimmer_1.5s_infinite] transition-transform hover:-translate-y-1">
      {/* Thumbnail */}
      <Link href={`/guides/${guide.slug}`} className="block relative aspect-video overflow-hidden border-b-2 border-black bg-[#050a14]">
        {guide.thumbnail_url ? (
          <Image
            src={guide.thumbnail_url}
            alt={guide.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            Resim Yok
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-[#facc15] text-black text-[10px] font-black px-2 py-1 uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          {guide.category.name}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/guides/${guide.slug}`} className="block mb-2">
          <h3 className="text-[16px] font-bold text-white group-hover:text-[#3b82f6] transition-colors leading-tight line-clamp-2">
            {guide.title}
          </h3>
        </Link>
        <p className="text-[13px] text-gray-400 line-clamp-2 mb-4 flex-1">
          {guide.summary}
        </p>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded border ${diffColorClass}`}>
            <BarChart2 size={12} /> {difficulty}
          </div>
          {guide.custom_data?.estimated_time && (
            <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded border border-white/10 bg-white/5 text-gray-300">
              <Clock size={12} /> {guide.custom_data.estimated_time}
            </div>
          )}
          {guide.custom_data?.reward_badge && (
             <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded border border-purple-500/50 bg-purple-500/20 text-purple-400">
                ⭐ {guide.custom_data.reward_badge}
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
          {guide.author ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#1e293b] border border-black overflow-hidden relative">
                <img 
                  src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${guide.author.username}&action=std&direction=2&head_direction=2&gesture=sml&size=m&headonly=1`} 
                  alt={guide.author.username}
                  className="absolute -top-3 -left-1 drop-shadow-sm scale-[1.3] pixelated"
                />
              </div>
              <span className="text-[12px] font-bold text-white">{guide.author.username}</span>
            </div>
          ) : (
            <span className="text-[12px] font-bold text-white/50">Sistem</span>
          )}
          
          <span className="text-[11px] text-gray-500">
            {guide.published_at ? formatDistanceToNow(new Date(guide.published_at), { addSuffix: true, locale: tr }) : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
