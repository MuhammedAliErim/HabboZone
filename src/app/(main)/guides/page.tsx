import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import GuideCard from '@/components/ui/guides/GuideCard';

export const revalidate = 60; // Cache for 60 seconds

export default async function GuidesPage() {
  const supabase = await createClient();

  // Fetch only categories that have type='guide'
  const { data: guideCategories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('type', 'guide');

  const categoryIds = guideCategories?.map(c => c.id) || [];

  let guidesItems: any = [];

  // Only fetch if we have guide categories
  if (categoryIds.length > 0) {
    const { data } = await supabase
      .from('news')
      .select(`
        title, 
        slug, 
        summary, 
        thumbnail_url, 
        published_at,
        custom_data,
        category:categories!inner(name, slug),
        author:profiles!news_author_id_fkey(username, avatar_url)
      `)
      .eq('status', 'published')
      .in('category_id', categoryIds)
      .order('published_at', { ascending: false });
      
    guidesItems = data || [];
  }

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-8 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/background_right_val16.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1400px] w-full mx-auto">
            <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">REHBERLER</h1>
            <p className="text-[#94a3b8] text-sm font-medium">Kablolu (Wired) Sistemleri, Görevler, Rozetler ve İnşa İpuçları!</p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Categories Bar */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
          <Link href="/guides" className="habbo-box bg-[#0a1325] px-4 py-2 border border-[#3b82f6] text-white text-[12px] font-bold whitespace-nowrap">
            Tümü
          </Link>
          {guideCategories?.map((cat: any) => (
            <Link key={cat.slug} href={`/guides/category/${cat.slug}`} className="habbo-box bg-[#050a14] px-4 py-2 hover:border-[#3b82f6] hover:bg-[#0a1325] text-gray-400 hover:text-white transition-colors text-[12px] font-bold whitespace-nowrap">
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {guidesItems.length > 0 ? (
            guidesItems.map((guide: any) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500 font-bold border-2 border-dashed border-[#1e293b] rounded-lg bg-[#050a14]">
              Henüz bu kategoride hiç rehber yayınlanmamış.
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
