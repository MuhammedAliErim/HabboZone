import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Diamond, ArrowLeft, Search, Sparkles, TrendingUp } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function CategoryValuesPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  let category: any = null;
  const { data: dbCategory } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .eq('slug', resolvedParams.category)
    .maybeSingle();

  if (dbCategory) {
    category = dbCategory;
  } else {
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

  let items: any[] = [];
  if (category.id && typeof category.id === 'number' && !category.slug?.includes('mock')) {
    const { data: dbItems } = await supabase
      .from('habbo_items')
      .select('*')
      .eq('category_id', category.id)
      .order('name', { ascending: true });
    items = dbItems || [];
  }

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
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/values" className="bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white px-3 py-1.5 rounded-[3px] font-bold text-xs border border-[#1e293b] uppercase inline-flex items-center gap-2 transition-colors">
          <ArrowLeft size={14} className="text-[#3b82f6]" /> DEĞER MERKEZİNE DÖN
        </Link>
      </div>

      {/* AUTHENTIC HABBO HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#050a14] border border-[#1e293b] rounded-[2px] flex items-center justify-center shrink-0">
            {category.icon_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={category.icon_url} alt={category.name} className="w-12 h-12 object-contain filter drop-shadow" />
            ) : (
              <Diamond size={32} className="text-[#3b82f6]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#2563eb] text-white px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-wider">NADİRE KATEGORİSİ</span>
              <span className="text-gray-400 text-[10px] font-bold uppercase">{items.length} ÖĞE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
              {category.name}
            </h1>
            <p className="text-gray-300 text-xs mt-1 max-w-xl font-medium">
              {category.description || 'Bu kategorideki tüm Habbo nadire ve mobilya öğeleri.'}
            </p>
          </div>
        </div>

        <div className="bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[3px] flex items-center gap-2 w-full md:w-72">
          <Search size={16} className="text-[#facc15]" />
          <input 
            type="text" 
            placeholder="Kategoride eşya ara..." 
            className="bg-transparent border-none outline-none w-full text-xs font-bold placeholder:text-gray-500 text-white"
            disabled
          />
          <span className="text-[9px] bg-[#0a1325] text-gray-300 px-1.5 py-0.5 rounded-[2px] border border-[#1e293b] font-black uppercase">CANLI</span>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Diamond size={16} className="text-[#facc15]" />
          <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">KATEGORİ ÖĞELERİ & FİYATLAR</h2>
        </div>
        <span className="text-gray-400 text-[11px] font-bold uppercase">TOPLAM {items.length} EŞYA</span>
      </div>

      {/* Items Grid */}
      <div className="habbo-box p-6 bg-[#0a1325] border border-[#1e293b]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/values/item/${item.slug || item.id}`}
              className="group bg-[#050a14] border border-[#1e293b] hover:border-[#3b82f6] rounded-[3px] p-2.5 flex flex-col justify-between items-center text-center transition-colors min-h-[180px] relative"
            >
              {item.is_ltd && (
                <span className="absolute top-2 right-2 bg-red-500/20 text-red-400 border border-red-500/50 text-[9px] font-black px-1.5 py-0.5 rounded-[2px] uppercase">
                  LTD
                </span>
              )}
              
              <div className="h-16 w-16 flex items-center justify-center my-2">
                {item.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-110 transition-transform" />
                ) : (
                  <Diamond size={32} className="text-[#3b82f6]" />
                )}
              </div>
              
              <h4 className="font-bold text-xs text-white truncate w-full mb-2 group-hover:text-[#facc15] transition-colors">{item.name}</h4>
              
              <div className="bg-[#0a1325] px-2.5 py-1 rounded-[2px] border border-[#1e293b] w-full flex items-center justify-center gap-1">
                <span className="font-black text-xs text-white">{item.current_value || item.price}</span>
                {item.currency_type === 'diamond' || item.currency === 'diamond' ? (
                  <span className="text-[9px] font-black text-cyan-400 uppercase bg-[#050a14] px-1 py-0.5 rounded-[2px] border border-[#1e293b]">Elmas</span>
                ) : (
                  <span className="text-[9px] font-black text-[#f59e0b] uppercase bg-[#050a14] px-1 py-0.5 rounded-[2px] border border-[#1e293b]">Kredi</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16 bg-[#050a14] border border-[#1e293b] rounded-[3px]">
            <Diamond size={40} className="mx-auto text-gray-600 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Kategori Boş</h3>
            <p className="text-xs text-gray-400">Bu kategoriye henüz hiçbir Habbo eşyası eklenmemiş.</p>
          </div>
        )}
      </div>

    </div>
  );
}
