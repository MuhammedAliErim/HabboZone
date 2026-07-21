import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Diamond, ArrowLeft, Search } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function CategoryValuesPage({ params }: { params: { category: string } }) {
  const supabase = createClient();

  // 1. Fetch category
  const { data: category } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .eq('slug', params.category)
    .single();

  if (!category) {
    notFound();
  }

  // 2. Fetch items in this category
  const { data: items } = await supabase
    .from('habbo_items')
    .select('*')
    .eq('category_id', category.id)
    .order('name', { ascending: true });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/values" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} /> Değer Merkezine Dön
          </Link>
          <div className="flex items-center gap-4">
            {category.icon_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={category.icon_url} alt={category.name} className="w-16 h-16 object-contain filter drop-shadow-xl" />
            ) : (
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Diamond size={32} className="text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest">{category.name}</h1>
              <p className="text-white/60 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
        
        {/* TODO: Add a client-side search input here in the future if requested */}
        <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 w-full md:w-64">
          <Search size={18} className="text-white/40" />
          <input 
            type="text" 
            placeholder="Eşya Ara..." 
            className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-white/30"
            disabled // Placeholder for future feature
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items?.map((item) => (
          <Link
            key={item.id}
            href={`/values/item/${item.slug}`}
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/10 transition-all hover:border-primary/30 hover:-translate-y-1 shadow-lg"
          >
            <div className="h-24 w-24 flex items-center justify-center mb-4 relative">
              {item.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform" />
              ) : (
                <Diamond size={40} className="text-white/20" />
              )}
              {item.is_ltd && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                  LTD
                </span>
              )}
            </div>
            
            <h4 className="font-bold text-sm truncate w-full mb-3 group-hover:text-primary transition-colors">{item.name}</h4>
            
            <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 w-full shadow-inner">
              <div className="font-black text-primary flex items-center justify-center gap-1 text-lg">
                {item.current_value}
                <span className="text-xs uppercase text-white/50">{item.currency_type}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {items?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <Diamond size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Bu Kategoride Eşya Yok</h3>
          <p className="text-white/50">Bu kategoriye henüz hiçbir Habbo eşyası eklenmemiş.</p>
        </div>
      )}

    </div>
  );
}
