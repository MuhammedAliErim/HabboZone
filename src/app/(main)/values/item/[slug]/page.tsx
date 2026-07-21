import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Diamond, ArrowLeft, History } from 'lucide-react';
import ItemPriceChart from '@/components/values/ItemPriceChart';

export const revalidate = 60;

export default async function ValuesItemPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  // 1. Fetch item
  const { data: item } = await supabase
    .from('habbo_items')
    .select('*, habbo_item_categories(name, slug)')
    .eq('slug', params.slug)
    .single();

  if (!item) {
    notFound();
  }

  // 2. Fetch value history
  const { data: history } = await supabase
    .from('habbo_item_values')
    .select('value, created_at, profiles(username)')
    .eq('item_id', item.id)
    .order('created_at', { ascending: true }); // Ascending for chart

  // Format data for Recharts
  const chartData = history?.map(h => ({
    date: new Date(h.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
    value: h.value
  })) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Breadcrumb / Back */}
      <Link href={`/values/${item.habbo_item_categories.slug}`} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={16} /> {item.habbo_item_categories.name} Kategorisine Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Kolon: Eşya Detayları */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/20 to-transparent -z-10" />
            
            <div className="h-40 w-40 flex items-center justify-center mb-6 relative z-10">
              {item.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow-2xl scale-125" />
              ) : (
                <Diamond size={64} className="text-white/20" />
              )}
            </div>

            <h1 className="text-3xl font-black uppercase tracking-widest mb-2">{item.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-white/70">
                {item.habbo_item_categories.name}
              </span>
              {item.is_ltd && (
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 rounded-full text-xs font-black uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                  LTD {item.ltd_count > 0 && `(${item.ltd_count})`}
                </span>
              )}
            </div>

            <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6">
              <div className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Güncel Değer</div>
              <div className="text-4xl font-black text-primary flex justify-center items-center gap-2">
                {item.current_value} <span className="text-lg text-white/50 uppercase">{item.currency_type}</span>
              </div>
            </div>

            {item.description && (
              <p className="mt-6 text-white/60 text-sm leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Sağ Kolon: Fiyat Grafiği ve Geçmiş */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                <History className="text-primary" size={28} />
                Fiyat Geçmişi
              </h2>
            </div>
            
            <ItemPriceChart data={chartData} currencyType={item.currency_type} />
          </div>

          {/* Güncelleme Kayıtları */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-white/80">Son Güncellemeler</h3>
            <div className="space-y-4">
              {history && history.length > 0 ? (
                [...history].reverse().slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <div className="font-bold">
                          {record.value} <span className="text-xs text-white/50">{item.currency_type}</span>
                        </div>
                        <div className="text-xs text-white/40">
                          {new Date(record.created_at).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    </div>
                    {record.profiles && (
                      <div className="text-xs font-bold text-white/30 bg-white/5 px-2 py-1 rounded">
                        @{record.profiles.username}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-white/40 py-4 text-sm">Geçmiş kaydı bulunamadı.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
