import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ShoppingBag, Star, LayoutGrid, CheckCircle, Diamond, TrendingUp, Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

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
    .limit(16);

  // Mock static categories for the sidebar if database is empty or sparse
  const mockCategories = [
    { id: 1, name: 'Tümü', slug: 'tumu', icon: <LayoutGrid size={16} className="text-blue-400" /> },
    { id: 2, name: 'Yeni Gelenler', slug: 'yeni-gelenler', icon: <Star size={16} className="text-yellow-400" /> },
    { id: 3, name: 'Klasik Nadireler', slug: 'klasik-nadireler', icon: <Flame size={16} className="text-orange-400" /> },
    { id: 4, name: 'LTD Sınırlı Sürüm', slug: 'ltd-sinirli-surum', icon: <Diamond size={16} className="text-red-400" /> },
    { id: 5, name: 'Koltuklar & Tahtlar', slug: 'koltuklar-tahtlar', icon: <div className="w-3.5 h-3.5 bg-indigo-500 rounded-sm shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div> },
    { id: 6, name: 'Masalar & Stantlar', slug: 'masalar-stantlar', icon: <div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div> },
    { id: 7, name: 'Ağaçlar & Doğa', slug: 'agaclar-doga', icon: <div className="w-3.5 h-3.5 bg-green-500 rounded-sm shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> },
    { id: 8, name: 'Oyunlar & Kablolar', slug: 'oyunlar-kablolar', icon: <div className="w-3.5 h-3.5 bg-purple-500 rounded-sm shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div> },
    { id: 9, name: 'Dış Mekan & Havuz', slug: 'dis-mekan-havuz', icon: <div className="w-3.5 h-3.5 bg-cyan-500 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div> },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : mockCategories;

  // Mock items if database is empty or has very few items
  const mockItems = [
    { id: 101, name: 'Altın Ejderha Lamba', slug: 'altin-ejderha-lamba', price: 750, currency: 'credit', tag: 'LTD', trend: 'up', img: 'https://images.habbo.com/c_images/catalogue/icon_270.png' },
    { id: 102, name: 'Bambu Kulübe', slug: 'bambu-kulube', price: 25, currency: 'credit', tag: 'YENİ', trend: 'stable', img: 'https://images.habbo.com/c_images/catalogue/icon_253.png' },
    { id: 103, name: 'Lüks Tropik Palmiye', slug: 'luks-tropik-palmiye', price: 15, currency: 'credit', tag: 'POPÜLER', trend: 'up', img: 'https://images.habbo.com/c_images/catalogue/icon_272.png' },
    { id: 104, name: 'İtalyan Dondurma Arabası', slug: 'italyan-dondurma-arabasi', price: 120, currency: 'diamond', tag: 'NADİRE', trend: 'up', img: 'https://images.habbo.com/c_images/catalogue/icon_195.png' },
    { id: 105, name: 'Neon Plaj Topu', slug: 'neon-plaj-topu', price: 5, currency: 'credit', tag: 'YENİ', trend: 'stable', img: 'https://images.habbo.com/c_images/catalogue/icon_215.png' },
    { id: 106, name: 'Altın Sörf Tahtası', slug: 'altin-sorf-tahtasi', price: 45, currency: 'diamond', tag: 'LTD', trend: 'up', img: 'https://images.habbo.com/c_images/catalogue/icon_229.png' },
    { id: 107, name: 'Siber Neon Taht', slug: 'siber-neon-taht', price: 350, currency: 'credit', tag: 'NADİRE', trend: 'up', img: 'https://images.habbo.com/c_images/catalogue/icon_195.png' },
    { id: 108, name: 'Klasik Lazer Kapısı', slug: 'klasik-lazer-kapisi', price: 80, currency: 'credit', tag: 'KLASİK', trend: 'stable', img: 'https://images.habbo.com/c_images/catalogue/icon_270.png' },
  ];

  // Merge database items or fallback to mock items
  const displayItems = recentItems && recentItems.length > 0 
    ? recentItems.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.current_value,
        currency: item.currency_type,
        tag: item.is_ltd ? 'LTD' : 'NADİRE',
        trend: 'up',
        img: item.image_url || 'https://images.habbo.com/c_images/catalogue/icon_270.png'
      }))
    : mockItems;

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      
      {/* Hero Banner - Ultra Dark Premium v4.0 */}
      <section className="relative w-full min-h-[260px] mb-8 border-b-2 border-white/10 overflow-hidden flex flex-col justify-end p-8 bg-[#050b14]">
        <div 
          className="absolute inset-0 z-0 opacity-30 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a1224] via-[#0a1224]/80 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-20 max-w-[1400px] w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-3 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
              <Sparkles size={14} className="text-yellow-400 animate-pulse" />
              CANLI HABBO EKONOMİ & DEĞER ENDEKSİ
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2 flex items-center gap-3">
              <Diamond size={36} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              NADİRE DEĞER MERKEZİ
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-medium max-w-2xl">
              Habbo Türkiye&apos;nin en güncel ve güvenilir nadire piyasa fiyatları, kurgu eşya grafikleri ve elmas endeksi!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#060d1a]/90 border-2 border-white/10 px-5 py-3 rounded-xl shadow-xl backdrop-blur-md">
            <div className="flex flex-col items-center border-r border-white/10 pr-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Takip Edilen Eşya</span>
              <span className="text-xl font-black text-white flex items-center gap-1.5">
                <ShieldCheck size={18} className="text-emerald-400" /> 1,450+
              </span>
            </div>
            <div className="flex flex-col items-center pl-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Günlük Değişim</span>
              <span className="text-xl font-black text-emerald-400 flex items-center gap-1">
                <TrendingUp size={18} /> %99.8 Net
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Navigation Tabs */}
      <div className="max-w-[1400px] mx-auto px-6 mb-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-lg border border-blue-400/50 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
            🔥 TÜM NADİRELER
          </button>
          <Link href="/values/category/ltd-sinirli-surum" className="px-6 py-2.5 bg-[#0a1325]/80 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/10 hover:border-white/30 hover:bg-[#111e38] transition-all flex items-center gap-2">
            <Diamond size={14} className="text-red-400" /> LTD SINIRLI SÜRÜM
          </Link>
          <Link href="/values/category/klasik-nadireler" className="px-6 py-2.5 bg-[#0a1325]/80 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/10 hover:border-white/30 hover:bg-[#111e38] transition-all flex items-center gap-2">
            <Flame size={14} className="text-orange-400" /> KLASİK NADİRELER
          </Link>
          <Link href="/values/category/koltuklar-tahtlar" className="px-6 py-2.5 bg-[#0a1325]/80 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/10 hover:border-white/30 hover:bg-[#111e38] transition-all">
            🛋️ KOLTUKLAR & TAHTLAR
          </Link>
          <Link href="/tools" className="px-6 py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs uppercase tracking-wider rounded-lg border border-emerald-500/30 transition-all ml-auto flex items-center gap-2">
            ⚡ TAKAS HESAPLAYICISI <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
        {/* Left Column: Categories Sidebar */}
        <aside className="space-y-6">
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-xl overflow-hidden">
            <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-4 py-3 flex items-center gap-2">
              <LayoutGrid size={16} className="text-cyan-400" /> KATEGORİ KATALOĞU
            </div>
            <div className="p-3 bg-[#050b14]">
              <ul className="space-y-1.5">
                {displayCategories.map((cat: any) => (
                  <li key={cat.id || cat.slug}>
                    <Link 
                      href={`/values/category/${cat.slug || cat.id}`} 
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-left transition-all duration-200 group border ${
                        cat.name === 'Tümü' 
                          ? 'bg-blue-600/20 text-white border-blue-500/50 shadow-[0_0_12px_rgba(37,99,235,0.2)] font-black' 
                          : 'bg-[#0a1325]/60 text-gray-300 border-white/5 hover:border-white/20 hover:bg-[#111e38] hover:text-white font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="shrink-0 p-1.5 rounded bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                          {cat.icon || <div className="w-3.5 h-3.5 bg-blue-500 rounded-sm"></div>}
                        </span>
                        <span className="text-xs">{cat.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 group-hover:text-cyan-400 transition-colors">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Trade Tip Banner */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border-2 border-amber-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles size={16} /> GÜVENLİK İPUCU
            </div>
            <p className="text-gray-300 text-xs leading-relaxed font-medium mb-4">
              Takas yaparken eşyanın sadece katalok fiyatına değil, piyasadaki anlık alıcı sayısına ve son işlem grafiğine mutlaka dikkat ediniz!
            </p>
            <Link href="/tools" className="inline-flex items-center justify-center w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all">
              TAKAS HESAPLA
            </Link>
          </div>
        </aside>

        {/* Right Column: Items Grid */}
        <div className="space-y-6">
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-xl overflow-hidden">
            <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-400 animate-pulse" /> ÖNE ÇIKAN & GÜNCEL NADİRELER
              </div>
              <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
                Canlı Piyasa Verisi
              </span>
            </div>

            <div className="bg-[#050b14] p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayItems.map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={`/values/item/${item.slug || item.id}`}
                    className="group bg-[#0a1325]/90 border-2 border-white/10 hover:border-cyan-400/80 rounded-xl flex flex-col justify-between h-[210px] relative overflow-hidden shadow-xl hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(34,211,238,0.2)] transition-all duration-300 p-3"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between w-full relative z-10">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-wider uppercase border ${
                        item.tag === 'LTD' 
                          ? 'bg-red-500/20 text-red-400 border-red-500/50' 
                          : item.tag === 'POPÜLER'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      }`}>
                        {item.tag || 'NADİRE'}
                      </span>
                      
                      <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        <TrendingUp size={12} /> +2.5%
                      </div>
                    </div>
                    
                    {/* Center Image */}
                    <div className="flex-1 flex items-center justify-center relative z-10 w-full my-2">
                      <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="max-w-[75px] max-h-[75px] object-contain filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.7)] group-hover:scale-125 transition-transform duration-300" 
                      />
                    </div>

                    {/* Bottom Info Section */}
                    <div className="w-full relative z-10 flex flex-col gap-1.5 border-t border-white/10 pt-2 bg-black/40 -mx-3 -mb-3 p-3 rounded-b-xl">
                      <h4 className="text-white font-bold text-xs truncate group-hover:text-cyan-400 transition-colors">
                        {item.name}
                      </h4>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-black text-sm tracking-tight">{item.price}</span>
                          {item.currency === 'diamond' ? (
                            <span className="text-[10px] font-black text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40 uppercase">Elmas</span>
                          ) : (
                            <span className="text-[10px] font-black text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/40 uppercase">Kredi</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-white transition-colors">Detay →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#0a1325]/60 border border-white/10 rounded-xl p-5 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                    <Sparkles size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Aradığınız nadireyi bulamadınız mı?</h4>
                    <p className="text-gray-400 text-xs">Piyasa endeksine yeni eklenen öğeleri her gün güncelliyoruz.</p>
                  </div>
                </div>
                <Link href="/tools" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs px-5 py-2.5 rounded-lg shadow-lg transition-all whitespace-nowrap flex items-center gap-2">
                  TAKAS HESAPLA <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
