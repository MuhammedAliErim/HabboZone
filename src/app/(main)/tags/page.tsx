import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Hash, Newspaper, BookOpen, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Etiketler - Habbo Zone',
};

export default async function TagsPage() {
  const supabase = await createClient();

  const { data: tags } = await supabase
    .from('tags')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (!tags || tags.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto w-full py-12 px-4">
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] p-16 text-center">
          <Hash size={40} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">HENÜZ ETİKET YOK</h3>
          <p className="text-gray-400 text-xs">Henüz hiçbir etiket eklenmemiş.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto w-full py-12 px-4">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#050a14] rounded-[2px] border border-[#1e293b] shadow mb-4">
          <Hash size={28} className="text-[#facc15]" />
        </div>
        <h1 className="text-4xl font-black text-white mb-3 tracking-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
          ETİKETLER
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
          <strong className="text-white">{tags.length}</strong> etiket bulunuyor
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] px-5 py-3 hover:border-[#facc15] hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
          >
            <Hash size={16} className="text-[#facc15] shrink-0" />
            <span className="text-white font-bold text-sm group-hover:text-[#facc15] transition-colors">
              {tag.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
