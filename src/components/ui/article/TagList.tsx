import Link from 'next/link';
import { Tag } from 'lucide-react';

interface TagItem {
  id: string;
  name: string;
  slug: string;
}

interface TagListProps {
  tags: TagItem[];
}

export default function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-[11px] font-bold text-gray-400 uppercase mr-1 flex items-center gap-1">
        <Tag size={12} /> ETİKETLER:
      </div>
      {tags.map((tag) => (
        <Link 
          key={tag.id} 
          href={`/tags/${tag.slug}`}
          className="text-[11px] font-bold bg-[#334155] text-gray-200 hover:text-white hover:bg-[#475569] px-2.5 py-1 rounded-[4px] border border-black shadow-[1px_1px_0_#000] hover:translate-y-[1px] hover:shadow-none transition-all uppercase"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
