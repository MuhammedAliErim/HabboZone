import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Diamond, Activity, Sparkles } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function ValuesPage() {
  const supabase = await createClient();

  // Kategori listesini çek
  const { data: categories } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .order('name');

  // Son güncellenen eşyaları çek
  const { data: recentItems } = await supabase
    .from('habbo_items')
    .select('id, name, slug, image_url, current_value, currency_type, is_ltd, updated_at, habbo_item_categories(slug)')
    .order('updated_at', { ascending: false })
    .limit(6);

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="habbo-box bg-white overflow-hidden relative">
        <div className="habbo-box-header blue">
            Değer & Nadire Merkezi
        </div>
        <div className="p-8 md:p-12 bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center text-center">
            <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none">
                <Diamond size={200} className="text-blue-500" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    Piyasayı Yakından Takip Et!
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                    Habbo dünyasındaki tüm nadire, LTD ve özel eşyaların güncel piyasa değerlerini öğren, yatırımını doğru yap.
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
        {/* Sol Sütun: Kategoriler (Geniş) */}
        <div className="lg:col-span-2 space-y-6">
            <div className="habbo-box">
                <div className="habbo-box-header green flex items-center gap-2">
                    <Sparkles size={16} /> Kategoriler
                </div>
                <div className="bg-gray-50 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categories?.map((category) => (
                            <Link 
                            key={category.id} 
                            href={`/values/${category.slug}`}
                            className="bg-white border border-gray-200 rounded p-4 flex items-center gap-4 hover:border-green-400 hover:bg-green-50 transition-colors shadow-sm group"
                            >
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                {category.icon_url ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={category.icon_url} alt={category.name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform drop-shadow-sm" />
                                ) : (
                                <Diamond size={20} className="text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 group-hover:text-green-700 transition-colors">{category.name}</h3>
                                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                            </div>
                            </Link>
                        ))}
                        {categories?.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-400 bg-white border border-gray-200 rounded">
                            Henüz bir kategori eklenmemiş.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Sağ Sütun: Son Güncellenenler (Dar) */}
        <div className="space-y-6">
            <div className="habbo-box">
                <div className="habbo-box-header orange flex items-center gap-2">
                    <Activity size={16} /> Son Değişenler
                </div>
                <div className="bg-white p-4">
                    <div className="grid grid-cols-2 gap-3">
                    {recentItems?.map((item) => (
                        <Link
                        key={item.id}
                        href={`/values/item/${item.slug}`}
                        className="bg-gray-50 border border-gray-100 rounded p-2 flex flex-col items-center text-center hover:bg-orange-50 hover:border-orange-200 transition-colors group relative"
                        >
                        {item.is_ltd && (
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 border border-yellow-500 text-[9px] font-black px-1 rounded shadow-sm">
                            LTD
                            </span>
                        )}
                        <div className="h-12 w-12 flex items-center justify-center mb-2">
                            {item.image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform drop-shadow-sm" />
                            ) : (
                            <Diamond size={24} className="text-gray-300" />
                            )}
                        </div>
                        <h4 className="font-bold text-[10px] text-gray-700 truncate w-full mb-1">{item.name}</h4>
                        <div className="bg-white px-2 py-1 rounded border border-gray-200 w-full flex items-center justify-center gap-1 shadow-inner">
                            <span className="font-black text-xs text-gray-800">{item.current_value}</span>
                            <span className="text-[8px] uppercase font-bold text-gray-400">{item.currency_type}</span>
                        </div>
                        </Link>
                    ))}
                    </div>
                </div>
            </div>
        </div>
        
      </div>

    </div>
  );
}
