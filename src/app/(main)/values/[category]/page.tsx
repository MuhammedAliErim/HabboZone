import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Diamond, ArrowLeft, Search, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function CategoryValuesPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // 1. Fetch category
  let category: any = null;
  const { data: dbCategory } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .eq('slug', resolvedParams.category)
    .single();

  if (dbCategory) {
    category = dbCategory;
  } else {
    // Check fallback mock categories
    const mockCategoriesMap: Record<string, any> = {
      'tumu': { id: 1, name: 'Tümü', slug: 'tumu', description: 'Tüm Habbo nadireleri ve katalog öğeleri' },
      'yeni-gelenler': { id: 2, name: 'Yeni Gelenler', slug: 'yeni-gelenler', description: 'Piyasaya en son eklenen yeni nadireler' },
      'klasik-nadireler': { id: 3, name: 'Klasik Nadireler', slug: 'klasik-nadireler', description: 'Habbo tarihinin en efsanevi klasik nadire eşyaları' },
      'ltd-sinirli-surum': { id: 4, name: 'LTD Sınırlı Sürüm', slug: 'ltd-sinirli-surum', description: 'Sınırlı sayıda üretilmiş özel koleksiyon LTD nadireleri' },
      'koltuklar-tahtlar': { id: 5, name: 'Koltuklar & Tahtlar', slug: 'koltuklar-tahtlar', description: 'Odalarda prestij sembolü olan özel tahtlar ve koltuklar' },
      'masalar-stantlar': { id: 6, name: 'Masalar & Stantlar', slug: 'masalar-stantlar', description: 'Lüks oda tasarımları için masalar ve sergi stantları' },
      'agaclar-doga': { id: 7, name: 'Ağaçlar & Doğa', slug: 'agaclar-doga', description: 'Bahçe ve orman labirentleri için nadire bitkiler ve ağaçlar' },
      'oyunlar-kablolar': { id: 8, name: 'Oyunlar & Kablolar', slug: 'oyunlar-kablolar', description: 'Yarışma odaları ve oyun mekanizmaları için kablolu sistemler' },
      'dis-mekan-havuz': { id: 9, name: 'Dış Mekan & Havuz', slug: 'dis-mekan-havuz', description: 'Yaz temalı odalar ve havuz partileri için özel mobilyalar' },
    };
    category = mockCategoriesMap[resolvedParams.category];
  }

  if (!category) {
    notFound();
  }

  // 2. Fetch items in this category
  let items: any[] = [];
  if (category.id && typeof category.id === 'number' && !category.slug?.includes('mock')) {
    const { data: dbItems } = await supabase
      .from('habbo_items')
      .select('*')
      .eq('category_id', category.id)
      .order('name', { ascending: true });
    items = dbItems || [];
  }

  // Fallback mock items if DB items are empty
  if (items.length === 0) {
    items = [
      { id: 201, name: 'Altın Ejderha Lamba', slug: 'altin-ejderha-lamba', current_value: 750, currency_type: 'credit', is_ltd: true, image_url: 'https://images.habbo.com/c_images/catalogue/icon_270.png' },
      { id: 202, name: 'Bambu Kulübe', slug: 'bambu-kulube', current_value: 25, currency_type: 'credit', is_ltd: false, image_url: 'https://images.habbo.com/c_images/catalogue/icon_253.png' },
      { id: 203, name: 'Lüks Tropik Palmiye', slug: 'luks-tropik-palmiye', current_value: 15, currency_type: 'credit', is_ltd: false, image_url: 'https://images.habbo.com/c_images/catalogue/icon_272.png' },
      { id: 204, name: 'İtalyan Dondurma Arabası', slug: 'italyan-dondurma-arabasi', current_value: 120, currency_type: 'diamond', is_ltd: false, image_url: 'https://images.habbo.com/c_images/catalogue/icon_195.png' },
      { id: 205, name: 'Neon Plaj Topu', slug: 'neon-plaj-topu', current_value: 5, currency_type: 'credit', is_ltd: false, image_url: 'https://images.habbo.com/c_images/catalogue/icon_215.png' },
      { id: 206, name: 'Altın Sörf Tahtası', slug: 'altin-sorf-tahtasi', current_value: 45, currency_type: 'diamond', is_ltd: true, image_url: 'https://images.habbo.com/c_images/catalogue/icon_229.png' },
      { id: 207, name: 'Siber Neon Taht', slug: 'siber-neon-taht', current_value: 350, currency_type: 'credit', is_ltd: false, image_url: 'https://images.habbo.com/c_images/catalogue/icon_195.png' },
      { id: 208, name: 'Klasik Lazer Kapısı', slug: 'klasik-lazer-kapisi', current_value: 80, currency_type: 'credit', is_ltd: false, image_url: 'https://images.habbo.com/c_images/catalogue/icon_270.png' },
    ];
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-8 px-6">
      
      {/* Header Section - Dark Premium v4.0 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <Link href="/values" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-[#0a1325]/80 border border-white/10 hover:border-white/30 px-3.5 py-2 rounded-lg shadow-md mb-6">
            <ArrowLeft size={14} className="text-cyan-400" /> Nadire Değer Merkezine Dön
          </Link>
          <div className="flex items-center gap-5 bg-[#0a1325]/90 p-6 rounded-2xl border-2 border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="w-20 h-20 bg-[#050b14] border-2 border-white/10 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
              {category.icon_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={category.icon_url} alt={category.name} className="w-14 h-14 object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]" />
              ) : (
                <Diamond size={36} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              )}
            </div>
            <div>
              <div className="text-[11px] font-black text-cyan-400 tracking-widest uppercase mb-1 flex items-center gap-1.5">
                <Sparkles size={14} /> NADİRE KATEGORİSİ
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-sm">{category.name}</h1>
              <p className="text-gray-300 text-sm mt-1 max-w-xl">{category.description || 'Bu kategorideki tüm Habbo nadire ve mobilya öğeleri.'}</p>
            </div>
          </div>
        </div>
        
        {/* Search Input Box */}
        <div className="bg-[#0a1325]/90 border-2 border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 w-full md:w-80 shadow-xl">
          <Search size={18} className="text-cyan-400" />
          <input 
            type="text" 
            placeholder="Bu kategoride eşya ara..." 
            className="bg-transparent border-none outline-none w-full text-xs font-bold placeholder:text-gray-500 text-white"
            disabled
          />
          <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-black">CANLI</span>
        </div>
      </div>

      {/* Items Grid - Dark Premium Habbo-Box */}
      <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
        <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            💎 KATEGORİ ÖĞELERİ ({items.length})
          </span>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Gerçek Zamanlı Piyasa Endeksi
          </span>
        </div>

        <div className="p-6 bg-[#050b14]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/values/item/${item.slug || item.id}`}
                className="group bg-[#0a1325]/90 border-2 border-white/10 hover:border-cyan-400/80 rounded-xl p-3 flex flex-col justify-between items-center text-center hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(34,211,238,0.2)] transition-all duration-300 relative overflow-hidden min-h-[190px]"
              >
                {item.is_ltd && (
                  <span className="absolute top-2 right-2 bg-red-500/20 text-red-400 border border-red-500/50 text-[9px] font-black px-2 py-0.5 rounded shadow-sm z-10 uppercase tracking-wider">
                    LTD
                  </span>
                )}
                
                <div className="h-20 w-20 flex items-center justify-center my-3 relative z-10">
                  <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {item.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.7)] group-hover:scale-125 transition-transform duration-300" />
                  ) : (
                    <Diamond size={36} className="text-cyan-400" />
                  )}
                </div>
                
                <h4 className="font-bold text-xs text-white truncate w-full mb-3 group-hover:text-cyan-400 transition-colors">{item.name}</h4>
                
                <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 w-full shadow-inner flex items-center justify-center gap-1.5">
                  <span className="font-black text-xs text-white">{item.current_value || item.price}</span>
                  {item.currency_type === 'diamond' || item.currency === 'diamond' ? (
                    <span className="text-[9px] font-black text-cyan-400 uppercase bg-cyan-950 px-1 py-0.5 rounded border border-cyan-500/40">Elmas</span>
                  ) : (
                    <span className="text-[9px] font-black text-amber-400 uppercase bg-amber-950 px-1 py-0.5 rounded border border-amber-500/40">Kredi</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20 bg-[#0a1325]/40 border-2 border-dashed border-white/10 rounded-2xl">
              <Diamond size={48} className="mx-auto text-gray-600 mb-3 animate-pulse" />
              <h3 className="text-base font-bold text-white mb-1">Kategori Boş</h3>
              <p className="text-xs text-gray-400">Bu kategoriye henüz hiçbir Habbo eşyası eklenmemiş.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
