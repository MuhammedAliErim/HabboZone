import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ShoppingBag, Star, LayoutGrid, CheckCircle } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function ValuesPage() {
  const supabase = await createClient();

  // Categories
  const { data: categories } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .order('name');

  // Recent Items
  const { data: recentItems } = await supabase
    .from('habbo_items')
    .select('id, name, slug, image_url, current_value, currency_type, is_ltd, updated_at, habbo_item_categories(slug)')
    .order('updated_at', { ascending: false })
    .limit(12);

  // Mock static categories for the sidebar if database is empty
  const mockCategories = [
    { id: 1, name: 'Tümü', icon: <LayoutGrid size={12} /> },
    { id: 2, name: 'Yeni Gelenler', icon: <Star size={12} /> },
    { id: 3, name: 'Klasik Furniler', icon: <CheckCircle size={12} /> },
    { id: 4, name: 'Koltuklar', icon: <div className="w-3 h-3 bg-[#1e293b] rounded-sm"></div> },
    { id: 5, name: 'Masalar', icon: <div className="w-3 h-3 bg-[#1e293b] rounded-sm"></div> },
    { id: 6, name: 'Ağaçlar', icon: <div className="w-3 h-3 bg-[#1e293b] rounded-sm"></div> },
    { id: 7, name: 'Dekorasyon', icon: <div className="w-3 h-3 bg-[#1e293b] rounded-sm"></div> },
    { id: 8, name: 'Oyunlar', icon: <div className="w-3 h-3 bg-[#1e293b] rounded-sm"></div> },
    { id: 9, name: 'Dış Mekan', icon: <div className="w-3 h-3 bg-[#1e293b] rounded-sm"></div> },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : mockCategories;

  // Mock items if database is empty
  const mockItems = [
    { id: 1, name: 'Şezlong', price: 2, currency: 'diamond', tag: 'YENİ', img: 'https://images.habbo.com/c_images/catalogue/icon_270.png' },
    { id: 2, name: 'Bambu Kulübe', price: 5, currency: 'credit', tag: 'YENİ', img: 'https://images.habbo.com/c_images/catalogue/icon_253.png' },
    { id: 3, name: 'Palmiye', price: 3, currency: 'credit', tag: 'YENİ', img: 'https://images.habbo.com/c_images/catalogue/icon_272.png' },
    { id: 4, name: 'Dondurma Arabası', price: 10, currency: 'diamond', tag: 'YENİ', img: 'https://images.habbo.com/c_images/catalogue/icon_195.png' },
    { id: 5, name: 'Plaj Topu', price: 1, currency: 'credit', tag: 'YENİ', img: 'https://images.habbo.com/c_images/catalogue/icon_215.png' },
    { id: 6, name: 'Sörf Tahtası', price: 4, currency: 'diamond', tag: 'YENİ', img: 'https://images.habbo.com/c_images/catalogue/icon_229.png' },
  ];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-6 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1400px] w-full mx-auto">
            <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">MAĞAZA</h1>
            <p className="text-[#94a3b8] text-sm font-medium">Furni, kıyafet, rozet ve daha fazlası!</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#1e293b] pb-4">
            <button className="px-6 py-2.5 bg-[#1e293b] text-white font-bold text-[12px] rounded border border-[#334155] transition-colors">
                FURNİ
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                KIYAFETLER
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                ROZETLER
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                VİP
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                KREDİLER
            </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          
        {/* Left Column: Categories */}
        <aside className="space-y-6">
            <div className="habbo-box">
                <div className="habbo-box-header text-[11px]">
                    KATEGORİLER
                </div>
                <div className="p-2 bg-[#050a14]">
                    <ul className="space-y-1">
                        {displayCategories.map((cat: any) => (
                            <li key={cat.id}>
                                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-colors ${cat.name === 'Tümü' ? 'bg-[#1e293b] text-white' : 'text-[#64748b] hover:bg-[#0a1325] hover:text-white'}`}>
                                    <span className="shrink-0">{cat.icon || <div className="w-3 h-3 bg-[#334155] rounded-sm"></div>}</span>
                                    <span className="text-[12px] font-bold">{cat.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>

        {/* Right Column: Items Grid */}
        <div className="space-y-6">
            <div className="habbo-box">
                <div className="habbo-box-header text-[11px]">
                    YENİ GELENLER
                </div>
                <div className="bg-[#050a14] p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {mockItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#144b82] border border-[#1e61a5] rounded-md flex flex-col items-center justify-center h-[140px] relative group overflow-hidden shadow-inner cursor-pointer"
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20 group-hover:from-white/20 transition-colors pointer-events-none"></div>

                                {/* Tag */}
                                <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm tracking-wider">
                                    {item.tag}
                                </div>
                                
                                {/* Image */}
                                <div className="flex-1 flex items-center justify-center relative z-10">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.img} alt={item.name} className="max-w-[60px] max-h-[60px] object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300" />
                                </div>

                                {/* Price Bar */}
                                <div className="w-full bg-[#072445] h-8 flex items-center justify-start px-3 gap-1 relative z-10 border-t border-[#144b82]/50">
                                    <span className="text-white font-bold text-[11px]">{item.price}</span>
                                    {item.currency === 'diamond' ? (
                                        <div className="w-3 h-3 bg-blue-400 rotate-45 transform scale-75"></div>
                                    ) : (
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full scale-75 border border-yellow-600"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-between items-center border-t border-[#1e293b] pt-4">
                        <span className="text-[#64748b] text-[11px]">Daha fazla ürün için mağazamızı ziyaret et!</span>
                        <Link href="/values" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-bold px-4 py-2 rounded transition-colors flex items-center gap-2">
                            MAĞAZAYA GİT <span>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}
