import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Star, LayoutGrid, Diamond, TrendingUp, Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export const metadata = { title: 'Nadire Değerleri - HabboZone', description: 'Habbo nadire eşya değerleri, fiyat grafikleri ve piyasa analizi.' };
export const revalidate = 60;

export default async function ValuesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .order('name');

  const { data: recentItems } = await supabase
    .from('habbo_items')
    .select('id, name, slug, image_url, current_value, currency_type, is_ltd, updated_at, habbo_item_categories(slug)')
    .order('updated_at', { ascending: false })
    .limit(16);

  const mockCategories = [
    { id: 1, name: 'Tümü', slug: 'tumu', icon: <LayoutGrid size={14} className="text-[#3b82f6]" /> },
    { id: 2, name: 'Yeni Gelenler', slug: 'yeni-gelenler', icon: <Star size={14} className="text-[#facc15]" /> },
    { id: 3, name: 'Klasik Nadireler', slug: 'klasik-nadireler', icon: <Flame size={14} className="text-[#f59e0b]" /> },
    { id: 4, name: 'LTD Sınırlı Sürüm', slug: 'ltd-sinirli-surum', icon: <Diamond size={14} className="text-[#ef4444]" /> },
    { id: 5, name: 'Koltuklar & Tahtlar', slug: 'koltuklar-tahtlar', icon: <div className="w-3 h-3 bg-[#6366f1] rounded-[1px]"></div> },
    { id: 6, name: 'Masalar & Stantlar', slug: 'masalar-stantlar', icon: <div className="w-3 h-3 bg-[#10b981] rounded-[1px]"></div> },
    { id: 7, name: 'Ağaçlar & Doğa', slug: 'agaclar-doga', icon: <div className="w-3 h-3 bg-[#22c55e] rounded-[1px]"></div> },
    { id: 8, name: 'Oyunlar & Kablolar', slug: 'oyunlar-kablolar', icon: <div className="w-3 h-3 bg-[#a855f7] rounded-[1px]"></div> },
    { id: 9, name: 'Dış Mekan & Havuz', slug: 'dis-mekan-havuz', icon: <div className="w-3 h-3 bg-[#06b6d4] rounded-[1px]"></div> },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : mockCategories;

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
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* AUTHENTIC HABBO HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#2563eb] text-white px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#1d4ed8]">PİYASA ENDEKSİ</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Canlı Fiyatlar</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase flex items-center gap-2" style={{ textShadow: '2px 2px 0 #000' }}>
            <Diamond size={32} className="text-[#3b82f6]" /> NADİRE DEĞER MERKEZİ
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            Habbo Türkiye&apos;nin en güncel ve güvenilir nadire piyasa fiyatları, kurgu eşya grafikleri ve elmas endeksi!
          </p>
        </div>

        <div className="bg-[#050a14] border border-[#1e293b] px-6 py-4 rounded-[4px] flex items-center gap-6 shrink-0 text-center">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Takip Edilen</div>
            <div className="text-xl font-black text-white flex items-center justify-center gap-1">
              <ShieldCheck size={16} className="text-[#22c55e]" /> 1,450+
            </div>
          </div>
          <div className="h-8 w-px bg-[#1e293b]"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Günlük Akış</div>
            <div className="text-xs font-black text-[#22c55e] flex items-center justify-center gap-1">
              <TrendingUp size={14} /> %99.8 Net
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1e293b] pb-4 mb-6">
        <button className="px-4 py-2 bg-[#2563eb] text-white font-black text-xs uppercase tracking-wider rounded-[3px] border border-[#3b82f6]">
          🔥 TÜM NADİRELER
        </button>
        <Link href="/values/category/ltd-sinirli-surum" className="px-4 py-2 bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-[3px] border border-[#1e293b] transition-colors flex items-center gap-1.5">
          <Diamond size={13} className="text-[#ef4444]" /> LTD SINIRLI SÜRÜM
        </Link>
        <Link href="/values/category/klasik-nadireler" className="px-4 py-2 bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-[3px] border border-[#1e293b] transition-colors flex items-center gap-1.5">
          <Flame size={13} className="text-[#f59e0b]" /> KLASİK NADİRELER
        </Link>
        <Link href="/values/category/koltuklar-tahtlar" className="px-4 py-2 bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-[3px] border border-[#1e293b] transition-colors">
          🛋️ KOLTUKLAR & TAHTLAR
        </Link>
        <Link href="/tools" className="px-4 py-2 bg-[#15803d] hover:bg-[#16a34a] text-white font-black text-xs uppercase tracking-wider rounded-[3px] transition-colors ml-auto flex items-center gap-1.5">
          ⚡ TAKAS HESAPLAYICISI <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          
        {/* Left Column: Categories Sidebar */}
        <aside className="space-y-4">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b]">
            <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center gap-2">
              <LayoutGrid size={15} /> KATEGORİ KATALOĞU
            </div>
            <div className="p-2 bg-[#0a1325]">
              <ul className="space-y-1">
                {displayCategories.map((cat: any) => (
                  <li key={cat.id || cat.slug}>
                    <Link 
                      href={`/values/category/${cat.slug || cat.id}`} 
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-[2px] text-left transition-colors ${
                        cat.name === 'Tümü' 
                          ? 'bg-[#2563eb] text-white font-black' 
                          : 'bg-[#050a14] hover:bg-[#1e293b] text-gray-300 hover:text-white font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="shrink-0">
                          {cat.icon || <div className="w-3 h-3 bg-[#3b82f6] rounded-[1px]"></div>}
                        </span>
                        <span className="text-xs">{cat.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-500">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Trade Tip Banner */}
          <div className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4">
            <div className="flex items-center gap-2 text-[#f59e0b] font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles size={15} /> GÜVENLİK İPUCU
            </div>
            <p className="text-gray-300 text-xs leading-relaxed font-medium mb-3">
              Takas yaparken eşyanın sadece katalok fiyatına değil, piyasadaki anlık alıcı sayısına ve son işlem grafiğine mutlaka dikkat ediniz!
            </p>
            <Link href="/tools" className="inline-flex items-center justify-center w-full py-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-wider rounded-[2px] transition-colors">
              TAKAS HESAPLA
            </Link>
          </div>
        </aside>

        {/* Right Column: Items Grid */}
        <div className="space-y-4">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b]">
            <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#f59e0b]" /> ÖNE ÇIKAN & GÜNCEL NADİRELER
              </div>
              <span className="text-[10px] font-bold text-[#3b82f6] bg-[#0a1325] border border-[#1e293b] px-2 py-0.5 rounded-[2px] uppercase">
                Canlı Piyasa
              </span>
            </div>

            <div className="p-4 bg-[#0a1325]">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayItems.map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={`/values/item/${item.slug || item.id}`}
                    className="group bg-[#050a14] border border-[#1e293b] hover:border-[#3b82f6] rounded-[3px] flex flex-col justify-between h-[190px] p-2.5 transition-colors"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-[2px] uppercase ${
                        item.tag === 'LTD' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                          : item.tag === 'POPÜLER'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                      }`}>
                        {item.tag || 'NADİRE'}
                      </span>
                      
                      <div className="flex items-center gap-0.5 text-[10px] font-black text-[#22c55e]">
                        <TrendingUp size={11} /> +2.5%
                      </div>
                    </div>
                    
                    {/* Center Image */}
                    <div className="flex-1 flex items-center justify-center w-full my-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="max-w-[64px] max-h-[64px] object-contain filter drop-shadow group-hover:scale-110 transition-transform" 
                      />
                    </div>

                    {/* Bottom Info */}
                    <div className="w-full flex flex-col gap-1 border-t border-[#1e293b] pt-2 bg-[#0a1325] -mx-2.5 -mb-2.5 p-2.5 rounded-b-[2px]">
                      <h4 className="text-white font-bold text-xs truncate group-hover:text-[#facc15] transition-colors">
                        {item.name}
                      </h4>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-white font-black text-xs">{item.price}</span>
                          {item.currency === 'diamond' ? (
                            <span className="text-[9px] font-black text-cyan-400 bg-[#050a14] px-1 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">Elmas</span>
                          ) : (
                            <span className="text-[9px] font-black text-[#f59e0b] bg-[#050a14] px-1 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">Kredi</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-white transition-colors">Detay →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[2px] bg-[#0a1325] border border-[#1e293b] flex items-center justify-center shrink-0">
                    <Sparkles size={16} className="text-[#3b82f6]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs">Aradığınız nadireyi bulamadınız mı?</h4>
                    <p className="text-gray-400 text-[11px]">Piyasa endeksine yeni eklenen öğeleri her gün güncelliyoruz.</p>
                  </div>
                </div>
                <Link href="/tools" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs px-4 py-2 rounded-[3px] transition-colors whitespace-nowrap flex items-center gap-1.5">
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
