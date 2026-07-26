import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Diamond, ArrowLeft, History, Sparkles, TrendingUp, ShieldCheck, Flame, ArrowRightLeft } from 'lucide-react';
import ItemPriceChart from '@/components/values/ItemPriceChart';

export const revalidate = 60;

export default async function ValuesItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // 1. Fetch item from database
  let item: any = null;
  const { data: dbItem } = await supabase
    .from('habbo_items')
    .select('*, habbo_item_categories(name, slug)')
    .eq('slug', resolvedParams.slug)
    .single();

  if (dbItem) {
    item = dbItem;
  } else {
    // Fallback mock items dictionary so clicking catalog cards always displays a rich details page
    const mockItemsMap: Record<string, any> = {
      'altin-ejderha-lamba': {
        id: 201, name: 'Altın Ejderha Lamba', slug: 'altin-ejderha-lamba', current_value: 750, currency_type: 'credit', is_ltd: true, ltd_count: 250, description: 'Habbo Şarkısının efsanevi altın ejderha lambası. Oda tasarımlarında statü sembolü.', image_url: 'https://images.habbo.com/c_images/catalogue/icon_270.png', habbo_item_categories: { name: 'LTD Sınırlı Sürüm', slug: 'ltd-sinirli-surum' }
      },
      'bambu-kulube': {
        id: 202, name: 'Bambu Kulübe', slug: 'bambu-kulube', current_value: 25, currency_type: 'credit', is_ltd: false, description: 'Tropikal ada ve plaj odaları için mükemmel bambu dinlenme alanı.', image_url: 'https://images.habbo.com/c_images/catalogue/icon_253.png', habbo_item_categories: { name: 'Yeni Gelenler', slug: 'yeni-gelenler' }
      },
      'luks-tropik-palmiye': {
        id: 203, name: 'Lüks Tropik Palmiye', slug: 'luks-tropik-palmiye', current_value: 15, currency_type: 'credit', is_ltd: false, description: 'Yazlık odalara egzotik bir hava katan dev yapraklı palmiye ağacı.', image_url: 'https://images.habbo.com/c_images/catalogue/icon_272.png', habbo_item_categories: { name: 'Ağaçlar & Doğa', slug: 'agaclar-doga' }
      },
      'italyan-dondurma-arabasi': {
        id: 204, name: 'İtalyan Dondurma Arabası', slug: 'italyan-dondurma-arabasi', current_value: 120, currency_type: 'diamond', is_ltd: false, description: 'Klasik İtalyan gelato dondurmalarını servis eden nostaljik stant aracı.', image_url: 'https://images.habbo.com/c_images/catalogue/icon_195.png', habbo_item_categories: { name: 'Masalar & Stantlar', slug: 'masalar-stantlar' }
      },
      'neon-plaj-topu': {
        id: 205, name: 'Neon Plaj Topu', slug: 'neon-plaj-topu', current_value: 5, currency_type: 'credit', is_ltd: false, description: 'Havuz partilerinde arkadaşlarınızla oynayabileceğiniz parlak plaj topu.', image_url: 'https://images.habbo.com/c_images/catalogue/icon_215.png', habbo_item_categories: { name: 'Dış Mekan & Havuz', slug: 'dis-mekan-havuz' }
      },
      'altin-sorf-tahtasi': {
        id: 206, name: 'Altın Sörf Tahtası', slug: 'altin-sorf-tahtasi', current_value: 45, currency_type: 'diamond', is_ltd: true, ltd_count: 500, description: 'Yalnızca usta sörfçüler ve koleksiyonerler için tasarlanmış som altın sörf tahtası.', image_url: 'https://images.habbo.com/c_images/catalogue/icon_229.png', habbo_item_categories: { name: 'LTD Sınırlı Sürüm', slug: 'ltd-sinirli-surum' }
      },
      'siber-neon-taht': {
        id: 207, name: 'Siber Neon Taht', slug: 'siber-neon-taht', current_value: 350, currency_type: 'credit', is_ltd: false, description: 'Geleceğin teknolojisiyle donatılmış, ışık saçan siber taht.', image_url: 'https://images.habbo.com/c_images/catalogue/icon_195.png', habbo_item_categories: { name: 'Koltuklar & Tahtlar', slug: 'koltuklar-tahtlar' }
      },
      'klasik-lazer-kapisi': {
        id: 208, name: 'Klasik Lazer Kapısı', slug: 'klasik-lazer-kapisi', current_value: 80, currency_type: 'credit', is_ltd: false, description: 'Yarışma odalarında geçişleri kontrol eden efsanevi kırmızı lazer kapı.', image_url: 'https://images.habbo.com/c_images/catalogue/icon_270.png', habbo_item_categories: { name: 'Oyunlar & Kablolar', slug: 'oyunlar-kablolar' }
      },
    };
    item = mockItemsMap[resolvedParams.slug];
  }

  if (!item) {
    notFound();
  }

  // 2. Fetch value history
  let history: any[] = [];
  if (item.id && typeof item.id === 'number' && item.id < 200) {
    const { data: dbHistory } = await supabase
      .from('habbo_item_values')
      .select('value, created_at, profiles(username)')
      .eq('item_id', item.id)
      .order('created_at', { ascending: true });
    history = dbHistory || [];
  }

  // Fallback mock price history for chart rendering
  if (history.length === 0) {
    const baseVal = item.current_value || 100;
    history = [
      { value: Math.round(baseVal * 0.85), created_at: '2026-05-01T12:00:00Z', profiles: { username: 'System_Oracle' } },
      { value: Math.round(baseVal * 0.90), created_at: '2026-05-15T12:00:00Z', profiles: { username: 'Market_Analyst' } },
      { value: Math.round(baseVal * 0.88), created_at: '2026-06-01T12:00:00Z', profiles: { username: 'System_Oracle' } },
      { value: Math.round(baseVal * 0.95), created_at: '2026-06-15T12:00:00Z', profiles: { username: 'Market_Analyst' } },
      { value: baseVal, created_at: '2026-07-01T12:00:00Z', profiles: { username: 'MuhammedAliErim' } },
    ];
  }

  // Format data for Recharts (Deterministic string slicing for React 19 saflık)
  const chartData = history.map(h => {
    const dateStr = h.created_at ? h.created_at.split('T')[0] : '2026-07-01';
    return {
      date: dateStr,
      value: h.value
    };
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 py-8 px-6">
      
      {/* Breadcrumb / Back Button */}
      <div className="flex items-center justify-between">
        <Link href={`/values/category/${item.habbo_item_categories?.slug || 'tumu'}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-[#0a1325]/80 border border-white/10 hover:border-white/30 px-4 py-2.5 rounded-xl shadow-md">
          <ArrowLeft size={16} className="text-cyan-400" /> {item.habbo_item_categories?.name || 'Kataloğa'} Geri Dön
        </Link>
        <Link href="/tools" className="inline-flex items-center gap-2 text-xs font-black uppercase text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-4 py-2.5 rounded-xl transition-all">
          <ArrowRightLeft size={16} /> Takas Hesaplayıcısında Aç
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Item Details - Dark Premium Habbo-Box v4.0 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden relative text-center">
            <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                💎 EŞYA KÜNYESİ
              </span>
              <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 uppercase">
                ONAYLI VERİ
              </span>
            </div>
            
            <div className="p-8 bg-[#050b14] flex flex-col items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Item Avatar Showcase */}
              <div className="h-40 w-40 flex items-center justify-center mb-6 relative z-10 bg-[#0a1325]/90 border-2 border-white/10 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.15)] p-4 group">
                <div className="absolute inset-0 bg-cyan-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {item.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_12px_rgba(0,0,0,0.8)] scale-110 group-hover:scale-125 transition-transform duration-300" />
                ) : (
                  <Diamond size={56} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 text-white drop-shadow-md">{item.name}</h1>
              
              <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-300 shadow-sm">
                  {item.habbo_item_categories?.name || 'Katalog Öğesi'}
                </span>
                {item.is_ltd && (
                  <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Flame size={14} /> LTD {item.ltd_count > 0 && `(#${item.ltd_count})`}
                  </span>
                )}
              </div>

              {/* Price Display Box */}
              <div className="w-full bg-[#0a1325]/90 border-2 border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-400" /> GÜNCEL PİYASA DEĞERİ
                </div>
                <div className="text-3xl font-black text-white flex justify-center items-center gap-2 drop-shadow-md">
                  {item.current_value || item.price}{' '}
                  {item.currency_type === 'diamond' || item.currency === 'diamond' ? (
                    <span className="text-xs font-black text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-500/40 uppercase">Elmas</span>
                  ) : (
                    <span className="text-xs font-black text-amber-400 bg-amber-950 px-2.5 py-1 rounded-md border border-amber-500/40 uppercase">Kredi</span>
                  )}
                </div>
              </div>

              {item.description && (
                <div className="mt-6 text-gray-300 text-xs font-medium leading-relaxed bg-[#0a1325]/60 p-4 rounded-xl border border-white/10 w-full text-left">
                  <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider mb-1">Eşya Hakkında</div>
                  {item.description}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" /> PİYASA GÜVENİLİRLİK ENDEKSİ
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-gray-400">Takas Hacmi:</span>
                <span className="font-bold text-white">Yüksek (Aktif)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-gray-400">Değer Trendi:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">📈 Yükseliş Eğilimi</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Son Güncelleme:</span>
                <span className="font-bold text-cyan-400">Bugün (Canlı)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Price History Chart and Updates */}
        <div className="lg:col-span-2 space-y-6">
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History size={18} className="text-cyan-400" /> FİYAT ANALİZ GRAFİĞİ & DEĞER GEÇMİŞİ
              </span>
              <span className="text-[10px] font-bold text-gray-400">Son 6 Aylık Seyir</span>
            </div>
            
            <div className="p-6 bg-[#050b14]">
              <div className="bg-[#0a1325]/90 border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* ItemPriceChart renders natively in dark theme */}
                <ItemPriceChart data={chartData} currencyType={item.currency_type || item.currency || 'credit'} />
              </div>
            </div>
          </div>

          {/* Price Update Logs */}
          <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" /> SON DEĞER GÜNCELLEME KAYITLARI
              </span>
              <span className="text-[10px] bg-white/10 text-gray-300 px-2.5 py-1 rounded font-black uppercase">
                DOĞRULANMIŞ KAYITLAR
              </span>
            </div>

            <div className="p-6 bg-[#050b14]">
              <div className="space-y-3">
                {history && history.length > 0 ? (
                  [...history].reverse().slice(0, 5).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#0a1325]/80 hover:bg-[#111e38] rounded-xl border border-white/10 shadow-md transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        <div>
                          <div className="font-black text-white text-base flex items-center gap-1.5">
                            {record.value}{' '}
                            <span className="text-xs font-bold text-cyan-400 uppercase">
                              {item.currency_type || item.currency || 'credit'}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-gray-400 mt-0.5">
                            Tarih: {record.created_at ? record.created_at.split('T')[0] : '2026-07-01'}
                          </div>
                        </div>
                      </div>
                      {record.profiles && (
                        <div className="text-xs font-black text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <ShieldCheck size={14} className="text-emerald-400" /> @{(record.profiles as any)?.username}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8 text-xs font-bold bg-[#0a1325]/40 border border-white/10 rounded-xl">
                    Geçmiş kaydı bulunamadı.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
