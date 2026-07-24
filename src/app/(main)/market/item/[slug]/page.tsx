import { Metadata } from 'next'
import Link from 'next/link'
import { getItemDetails, getItemsByCategory } from '@/actions/market'
import { ArrowLeft, ExternalLink, Info, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react'
import { notFound } from 'next/navigation'
import PriceChart from '@/components/ui/market/PriceChart'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getItemDetails(params.slug)
  
  if (!data?.item) {
    return {
      title: 'Eşya Bulunamadı - Habbo Zone',
    }
  }

  return {
    title: `${data.item.name} - Market - Habbo Zone`,
    description: data.item.description,
  }
}

export default async function MarketItemPage({ params }: { params: { slug: string } }) {
  const data = await getItemDetails(params.slug)
  
  if (!data?.item) {
    notFound()
  }
  
  const { item, history } = data
  const relatedItems = await getItemsByCategory(item.category.slug)
  
  // Filter out the current item and get up to 5 related items
  const related = relatedItems.filter(i => i.id !== item.id).slice(0, 5)

  // Calculate percentage change if there is history
  let percentChange = 0
  let isUp = true
  if (history && history.length > 1) {
    const latest = history[history.length - 1].value
    const previous = history[history.length - 2].value
    percentChange = ((latest - previous) / previous) * 100
    isUp = percentChange >= 0
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
          <Link href="/market" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Pazar
          </Link>
          <span>/</span>
          <Link href={`/market/${item.category.slug}`} className="hover:text-white transition-colors">
            {item.category.name}
          </Link>
          <span>/</span>
          <span className="text-white">{item.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Item Image & Details */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="habbo-box bg-[#0f172a]">
            <div className="habbo-box-header text-center">
              <h1 className="text-lg font-bold">{item.name}</h1>
            </div>
            
            <div className="p-6 bg-[#090e17] flex items-center justify-center relative border-b border-[#2b3548] min-h-[200px]">
              {item.is_ltd && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-[2px] shadow-sm z-10 flex flex-col items-center">
                  <span>LTD</span>
                  {item.total_ltd_count && (
                    <span className="text-[10px] opacity-80">/ {item.total_ltd_count}</span>
                  )}
                </div>
              )}
              
              <div className="w-32 h-32 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="max-w-full max-h-full object-contain pixelated relative z-10 scale-125" 
                />
              </div>
            </div>
            
            <div className="p-5 flex flex-col gap-5">
              <div className="flex flex-col items-center p-4 bg-[#1e293b] border border-[#2b3548] rounded-[4px]">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">GÜNCEL DEĞER</span>
                <div className="flex items-center gap-3">
                  <img 
                    src={item.currency_type === 'credits' 
                      ? 'https://images.habbo.com/c_images/album1584/CRED.gif' 
                      : 'https://images.habbo.com/c_images/album1584/DIA.gif'} 
                    alt={item.currency_type}
                    className="w-6 h-6 pixelated"
                  />
                  <span className="text-yellow-400 font-bold text-3xl">{item.current_value.toLocaleString('tr-TR')}</span>
                </div>
                
                {history.length > 1 && (
                  <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {isUp ? '+' : ''}{percentChange.toFixed(1)}% 
                    <span className="text-gray-500 text-xs font-normal ml-1">(Son değişime göre)</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-white font-bold text-sm flex items-center gap-1.5 border-b border-[#2b3548] pb-2">
                  <Info size={16} className="text-blue-400" />
                  Eşya Hakkında
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-white font-bold text-sm flex items-center gap-1.5 border-b border-[#2b3548] pb-2">
                  <Activity size={16} className="text-blue-400" />
                  İstatistikler
                </h3>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-400">Kategori:</span>
                  <Link href={`/market/${item.category.slug}`} className="text-blue-400 hover:underline">
                    {item.category.name}
                  </Link>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-400">Sisteme Eklenme:</span>
                  <span className="text-gray-200">{new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-400">Fiyat Güncellemesi:</span>
                  <span className="text-gray-200">{history.length > 0 ? new Date(history[history.length - 1].created_at).toLocaleDateString('tr-TR') : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chart & Related */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="habbo-box bg-[#0f172a]">
            <div className="habbo-box-header flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-yellow-400" />
                Fiyat Trendi
              </h2>
            </div>
            <div className="p-4">
              <PriceChart history={history} currencyType={item.currency_type} />
              
              <div className="mt-4 bg-[#1e293b] border border-[#2b3548] rounded-[4px] p-3 text-xs text-gray-400 flex items-start gap-2">
                <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <p>Bu grafikteki veriler pazar analistlerimiz tarafından Habbo otelindeki güncel takas değerleri baz alınarak oluşturulmaktadır. Değerler kesinlik taşımaz ve sadece rehber amaçlıdır.</p>
              </div>
            </div>
          </div>
          
          {related.length > 0 && (
            <div className="habbo-box bg-[#0f172a]">
              <div className="habbo-box-header">
                <h2 className="text-lg font-bold">Benzer Eşyalar</h2>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {related.map((relItem) => (
                  <Link 
                    key={relItem.id} 
                    href={`/market/item/${relItem.slug}`}
                    className="flex flex-col bg-[#1e293b] border border-[#2b3548] rounded-[4px] hover:border-blue-500/50 transition-colors overflow-hidden group"
                  >
                    <div className="h-20 bg-[#090e17] flex items-center justify-center p-2 relative">
                      <img 
                        src={relItem.image_url} 
                        alt={relItem.name} 
                        className="max-w-full max-h-full object-contain pixelated group-hover:scale-110 transition-transform" 
                      />
                    </div>
                    <div className="p-2 flex flex-col gap-1 border-t border-[#2b3548]">
                      <h3 className="text-white font-bold text-[11px] line-clamp-1" title={relItem.name}>{relItem.name}</h3>
                      <div className="flex items-center gap-1 mt-auto pt-1">
                        <img 
                          src={relItem.currency_type === 'credits' 
                            ? 'https://images.habbo.com/c_images/album1584/CRED.gif' 
                            : 'https://images.habbo.com/c_images/album1584/DIA.gif'} 
                          alt={relItem.currency_type}
                          className="w-3 h-3 pixelated"
                        />
                        <span className="text-yellow-400 font-bold text-xs">{relItem.current_value.toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
        </div>
        
      </div>
    </div>
  )
}
