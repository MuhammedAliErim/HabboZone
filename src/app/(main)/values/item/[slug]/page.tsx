import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Diamond, ArrowLeft, History } from 'lucide-react';
import ItemPriceChart from '@/components/values/ItemPriceChart';

export const revalidate = 60;

export default async function ValuesItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // 1. Fetch item
  const { data: item } = await supabase
    .from('habbo_items')
    .select('*, habbo_item_categories(name, slug)')
    .eq('slug', resolvedParams.slug)
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 py-6">
      
      {/* Breadcrumb / Back */}
      <Link href={`/values/${item.habbo_item_categories.slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
        <ArrowLeft size={14} /> {item.habbo_item_categories.name} Kategorisine Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sol Kolon: Eşya Detayları */}
        <div className="lg:col-span-1 space-y-6">
          <div className="habbo-box bg-white overflow-hidden relative text-center">
            <div className="habbo-box-header green">Eşya Detayları</div>
            
            <div className="p-6 bg-gradient-to-b from-green-50 to-white flex flex-col items-center">
                <div className="h-32 w-32 flex items-center justify-center mb-6 relative z-10 bg-white border border-gray-200 rounded-full shadow-inner">
                {item.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow-md scale-110" />
                ) : (
                    <Diamond size={48} className="text-gray-300" />
                )}
                </div>

                <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-2 text-gray-800">{item.name}</h1>
                
                <div className="flex items-center gap-2 mb-6 justify-center">
                <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold uppercase tracking-wider text-gray-600 shadow-sm">
                    {item.habbo_item_categories.name}
                </span>
                {item.is_ltd && (
                    <span className="px-2 py-0.5 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-[10px] font-black uppercase tracking-wider shadow-sm">
                    LTD {item.ltd_count > 0 && `(${item.ltd_count})`}
                    </span>
                )}
                </div>

                <div className="w-full bg-gray-50 border border-gray-200 rounded p-4 shadow-inner">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Güncel Değer</div>
                <div className="text-2xl font-black text-green-600 flex justify-center items-center gap-2 drop-shadow-sm">
                    {item.current_value} <span className="text-xs text-gray-500 uppercase">{item.currency_type}</span>
                </div>
                </div>

                {item.description && (
                <p className="mt-4 text-gray-600 text-xs font-medium leading-relaxed bg-gray-50 p-3 rounded border border-gray-100 w-full text-left">
                    {item.description}
                </p>
                )}
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Fiyat Grafiği ve Geçmiş */}
        <div className="lg:col-span-2 space-y-6">
          <div className="habbo-box bg-white">
            <div className="habbo-box-header blue flex items-center gap-2">
                <History size={16} /> Fiyat Grafiği
            </div>
            <div className="p-4 md:p-6 bg-gray-50">
                <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
                    {/* Make sure ItemPriceChart renders well on white background */}
                    <ItemPriceChart data={chartData} currencyType={item.currency_type} />
                </div>
            </div>
          </div>

          {/* Güncelleme Kayıtları */}
          <div className="habbo-box bg-white">
            <div className="habbo-box-header orange">
                Son Güncellemeler
            </div>
            <div className="p-4 bg-gray-50">
                <div className="space-y-3">
                {history && history.length > 0 ? (
                    [...history].reverse().slice(0, 5).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        <div>
                            <div className="font-bold text-gray-800 text-sm">
                            {record.value} <span className="text-[10px] text-gray-500 uppercase">{item.currency_type}</span>
                            </div>
                            <div className="text-[10px] font-bold text-gray-400">
                            {new Date(record.created_at).toLocaleString('tr-TR')}
                            </div>
                        </div>
                        </div>
                        {record.profiles && (
                        <div className="text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
                            @{(record.profiles as any)?.username}
                        </div>
                        )}
                    </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4 text-xs font-bold bg-white border border-gray-200 rounded">Geçmiş kaydı bulunamadı.</div>
                )}
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
