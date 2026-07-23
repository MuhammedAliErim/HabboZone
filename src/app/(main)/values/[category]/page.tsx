import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Diamond, ArrowLeft, Search } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function CategoryValuesPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // 1. Fetch category
  const { data: category } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .eq('slug', resolvedParams.category)
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/values" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200 mb-4">
            <ArrowLeft size={14} /> Değer Merkezine Dön
          </Link>
          <div className="flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                {category.icon_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={category.icon_url} alt={category.name} className="w-12 h-12 object-contain drop-shadow-sm" />
                ) : (
                <Diamond size={24} className="text-gray-400" />
                )}
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Kategori</div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-800">{category.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{category.description}</p>
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="bg-white border border-gray-200 rounded px-3 py-2 flex items-center gap-2 w-full md:w-64 shadow-sm">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Eşya Ara..." 
            className="bg-transparent border-none outline-none w-full text-xs font-bold placeholder:text-gray-400 text-gray-800"
            disabled // Placeholder for future feature
          />
        </div>
      </div>

      {/* Grid */}
      <div className="habbo-box bg-white">
        <div className="habbo-box-header blue">
            Bu Kategorideki Eşyalar ({items?.length || 0})
        </div>
        <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items?.map((item) => (
                <Link
                key={item.id}
                href={`/values/item/${item.slug}`}
                className="group bg-white border border-gray-200 rounded p-2 flex flex-col items-center text-center hover:bg-blue-50 hover:border-blue-300 transition-colors relative shadow-sm"
                >
                {item.is_ltd && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 border border-yellow-500 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                    LTD
                    </span>
                )}
                <div className="h-16 w-16 flex items-center justify-center mb-2">
                    {item.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform" />
                    ) : (
                    <Diamond size={32} className="text-gray-300" />
                    )}
                </div>
                
                <h4 className="font-bold text-[10px] text-gray-700 truncate w-full mb-2 group-hover:text-blue-700 transition-colors">{item.name}</h4>
                
                <div className="bg-gray-50 px-2 py-1 rounded border border-gray-100 w-full shadow-inner flex items-center justify-center gap-1">
                    <span className="font-black text-xs text-gray-800">{item.current_value}</span>
                    <span className="text-[8px] uppercase font-bold text-gray-500">{item.currency_type}</span>
                </div>
                </Link>
            ))}
            </div>

            {items?.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-200 rounded">
                <Diamond size={32} className="mx-auto text-gray-300 mb-2" />
                <h3 className="text-sm font-bold text-gray-700 mb-1">Eşya Bulunamadı</h3>
                <p className="text-xs text-gray-500">Bu kategoriye henüz hiçbir Habbo eşyası eklenmemiş.</p>
            </div>
            )}
        </div>
      </div>

    </div>
  );
}
