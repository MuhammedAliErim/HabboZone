import { Calendar, Clock, Eye, MessageSquare, RefreshCw, User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ArticleMetaProps {
  author: {
    username: string;
    habbo_username?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  views?: number;
  readingTime?: number;
  commentsCount?: number;
}

export default function ArticleMeta({
  author,
  publishedAt,
  updatedAt,
  views = 0,
  readingTime = 3,
  commentsCount = 0,
}: ArticleMetaProps) {
  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${author.habbo_username || author.username}&direction=2&head_direction=2&gesture=sml&size=l`;
  const pubDate = new Date(publishedAt);
  const upDate = updatedAt ? new Date(updatedAt) : null;
  const showUpdated = upDate && upDate.getTime() > pubDate.getTime() + 86400000; // Show if updated > 1 day after publish

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-3 sm:p-4 rounded-[4px] border border-black shadow-[0_4px_0_#000]">
      {/* Author Section */}
      <Link href={`/profile/${author.username}`} className="flex items-center gap-3 group">
        <div className="w-12 h-12 bg-[#0a1325] rounded-[2px] border border-black overflow-hidden flex items-center justify-center group-hover:border-[#facc15] transition-colors shadow-inner">
          <img src={avatarUrl} alt={author.username} className="pixelated -mt-2" />
        </div>
        <div>
          <div className="text-[10px] text-[#facc15] uppercase font-black tracking-wider flex items-center gap-1 mb-0.5">
            <User size={10} /> YAZAR
          </div>
          <div className="font-bold text-[14px] text-white group-hover:text-[#facc15] transition-colors">{author.username}</div>
        </div>
      </Link>

      {/* Meta Stats */}
      <div className="flex flex-wrap items-center gap-4 text-[12px] font-bold text-gray-400">
        <div className="flex items-center gap-1.5" title="Yayın Tarihi">
          <Calendar size={14} className="text-gray-500" />
          <span>{pubDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        
        {showUpdated && (
          <div className="flex items-center gap-1.5 text-blue-400" title="Son Güncellenme">
            <RefreshCw size={12} />
            <span>{formatDistanceToNow(upDate, { addSuffix: true, locale: tr })} güncellendi</span>
          </div>
        )}

        <div className="flex items-center gap-1.5" title="Okuma Süresi">
          <Clock size={14} className="text-gray-500" />
          <span>{readingTime} dk okuma</span>
        </div>
        
        <div className="flex items-center gap-1.5" title="Görüntülenme">
          <Eye size={14} className="text-gray-500" />
          <span>{views.toLocaleString('tr-TR')}</span>
        </div>

        <div className="flex items-center gap-1.5" title="Yorumlar">
          <MessageSquare size={14} className="text-gray-500" />
          <span>{commentsCount}</span>
        </div>
      </div>
    </div>
  );
}
