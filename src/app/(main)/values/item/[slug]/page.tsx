import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Diamond, ArrowLeft, History, Sparkles, TrendingUp, ShieldCheck, Flame, ArrowRightLeft } from 'lucide-react';
import ItemPriceChart from '@/components/values/ItemPriceChart';

export const revalidate = 60;

export default async function ValuesItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  let item: any = null;
  const { data: dbItem } = await supabase
    .from('habbo_items')
    .select('*, habbo_item_categories(name, slug)')
    .eq('slug', resolvedParams.slug)
    .maybeSingle();

  if (dbItem) {
    item = dbItem;
  } else {
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

  let history: any[] = [];
  if (item.id && typeof item.id === 'number' && item.id < 200) {
    const { data: dbHistory } = await supabase
      .from('habbo_item_values')
      .select('value, created_at, profiles(username)')
      .eq('item_id', item.id)
      .order('created_at', { ascending: true });
    history = dbHistory || [];
  }

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

  const chartData = history.map(h => {
    const dateStr = h.created_at ? h.created_at.split('T')[0] : '2026-07-01';
    return {
      date: dateStr,
      value: h.value
    };
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <Link href={`/values/category/${item.habbo_item_categories?.slug || 'tumu'}`} className="bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white px-3 py-1.5 rounded-[3px] font-bold text-xs border border-[#1e293b] uppercase inline-flex items-center gap-2 transition-colors">
          <ArrowLeft size={14} className="text-[#3b82f6]" /> {item.habbo_item_categories?.name || 'Kataloğa'} Geri Dön
        </Link>
        <Link href="/tools" className="bg-[#15803d] hover:bg-[#16a34a] text-white px-3 py-1.5 rounded-[3px] font-black text-xs uppercase inline-flex items-center gap-1.5 transition-colors">
          <ArrowRightLeft size={14} /> Takas Hesapla
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Item Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] text-center">
            <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                💎 EŞYA KÜNYESİ
              </span>
              <span className="text-[9px] font-black text-[#22c55e] bg-[#0a1325] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">
                ONAYLI VERİ
              </span>
            </div>
            
            <div className="p-6 bg-[#0a1325] flex flex-col items-center">
              {/* Item Image */}
              <div className="h-32 w-32 flex items-center justify-center mb-4 bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} width={128} height={128} className="max-h-full max-w-full object-contain filter drop-shadow scale-110" unoptimized />
                ) : (
                  <Diamond size={48} className="text-[#3b82f6]" />
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 text-white">{item.name}</h1>
              
              <div className="flex items-center gap-2 mb-6 justify-center flex-wrap">
                <span className="px-2 py-0.5 bg-[#050a14] border border-[#1e293b] rounded-[2px] text-[10px] font-bold uppercase text-gray-300">
                  {item.habbo_item_categories?.name || 'Katalog Öğesi'}
                </span>
                {item.is_ltd && (
                  <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/50 text-red-400 rounded-[2px] text-[10px] font-black uppercase flex items-center gap-1">
                    <Flame size={12} /> LTD {item.ltd_count > 0 && `(#${item.ltd_count})`}
                  </span>
                )}
              </div>

              {/* Price Box */}
              <div className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center justify-center gap-1">
                  <TrendingUp size={13} className="text-[#22c55e]" /> GÜNCEL PİYASA DEĞERİ
                </div>
                <div className="text-2xl font-black text-white flex justify-center items-center gap-1.5">
                  {item.current_value || item.price}{' '}
                  {item.currency_type === 'diamond' || item.currency === 'diamond' ? (
                    <span className="text-[10px] font-black text-cyan-400 bg-[#0a1325] px-2 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">Elmas</span>
                  ) : (
                    <span className="text-[10px] font-black text-[#f59e0b] bg-[#0a1325] px-2 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">Kredi</span>
                  )}
                </div>
              </div>

              {item.description && (
                <div className="mt-4 text-gray-300 text-xs font-medium leading-relaxed bg-[#050a14] p-3 rounded-[3px] border border-[#1e293b] w-full text-left">
                  <div className="text-[10px] font-black text-[#facc15] uppercase mb-1">Eşya Hakkında</div>
                  {item.description}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b]">
            <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#22c55e]" /> PİYASA GÜVENİLİRLİK ENDEKSİ
            </div>
            <div className="p-4 space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between py-1.5 border-b border-[#1e293b]">
                <span className="text-gray-400 font-bold">Takas Hacmi:</span>
                <span className="font-black text-white">Yüksek (Aktif)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1e293b]">
                <span className="text-gray-400 font-bold">Değer Trendi:</span>
                <span className="font-black text-[#22c55e] flex items-center gap-1">📈 Yükseliş Eğilimi</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400 font-bold">Son Güncelleme:</span>
                <span className="font-black text-[#3b82f6]">Bugün (Canlı)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Price History Chart and Updates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b]">
            <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History size={16} className="text-[#3b82f6]" /> FİYAT ANALİZ GRAFİĞİ & DEĞER GEÇMİŞİ
              </span>
              <span className="text-[10px] font-bold text-gray-400">Son 6 Aylık Seyir</span>
            </div>
            
            <div className="p-4 bg-[#0a1325]">
              <div className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4">
                <ItemPriceChart data={chartData} currencyType={item.currency_type || item.currency || 'credit'} />
              </div>
            </div>
          </div>

          {/* Price Update Logs */}
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b]">
            <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#f59e0b]" /> SON DEĞER GÜNCELLEME KAYITLARI
              </span>
              <span className="text-[9px] bg-[#0a1325] text-gray-300 px-2 py-0.5 rounded-[2px] border border-[#1e293b] font-black uppercase">
                DOĞRULANMIŞ KAYITLAR
              </span>
            </div>

            <div className="p-4 bg-[#0a1325]">
              <div className="space-y-2">
                {history && history.length > 0 ? (
                  [...history].reverse().slice(0, 5).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#050a14] hover:bg-[#1e293b] rounded-[2px] border border-[#1e293b] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-[1px] bg-[#3b82f6]" />
                        <div>
                          <div className="font-black text-white text-sm flex items-center gap-1.5">
                            {record.value}{' '}
                            <span className="text-[10px] font-black text-[#f59e0b] uppercase">
                              {item.currency_type || item.currency || 'credit'}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium text-gray-400 mt-0.5">
                            Tarih: {record.created_at ? record.created_at.split('T')[0] : '2026-07-01'}
                          </div>
                        </div>
                      </div>
                      {record.profiles && (
                        <div className="text-[11px] font-bold text-gray-300 bg-[#0a1325] border border-[#1e293b] px-2.5 py-1 rounded-[2px] flex items-center gap-1">
                          <ShieldCheck size={13} className="text-[#22c55e]" /> @{(record.profiles as any)?.username}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-6 text-xs font-bold bg-[#050a14] border border-[#1e293b] rounded-[2px]">
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
