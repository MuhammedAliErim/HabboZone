import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getMarketCategories, getLatestItems } from '@/actions/market'
import { Activity, Search, ArrowRight, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Market - HabboZone',
  description: 'Habbo nadir eşya ekonomi sistemi, güncel kredi değerleri ve fiyat grafikleri.',
}

export default async function MarketPage() {
  const categories = await getMarketCategories()
  const latestItems = await getLatestItems(8)

  return (
    <div className="flex flex-col gap-8 pb-16 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="relative w-full h-[200px] border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8 bg-[#0a1325]">
        <div 
          className="absolute inset-0 z-0 opacity-30 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/background_right_coffee_1.png")',
            backgroundPosition: 'right center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050a14] via-[#050a14]/60 to-transparent"></div>
        
        <div className="relative z-20 max-w-[1200px] w-full mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3 drop-shadow" style={{ textShadow: '2px 2px 0 #000' }}>
                <Activity className="text-[#facc15]" size={32} />
                NADİR EŞYA PAZARI
              </h1>
              <p className="text-gray-300 text-xs md:text-sm font-medium mt-1">HabboZone ekonomi sistemi, güncel kredi değerleri, LTD serileri ve fiyat değişim grafikleri.</p>
            </div>
            
            <div className="w-full md:w-[320px] bg-[#050a14] border border-[#1e293b] p-1.5 rounded-[3px] flex items-center gap-2">
              <Search size={16} className="text-gray-400 ml-2" />
              <input 
                type="text" 
                placeholder="Nadir eşya veya LTD ara..." 
                className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-gray-500 font-medium"
              />
            </div>
        </div>
      </section>

      <div className="max-w-[1200px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Categories */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden">
            <div className="bg-[#050a14] border-b border-[#1e293b] px-4 py-3">
              <h2 className="text-xs font-black text-[#facc15] uppercase tracking-wider flex items-center gap-2">
                📁 KATEGORİLER
              </h2>
            </div>
            <div className="p-3 bg-[#0a1325] flex flex-col gap-2">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/market/${category.slug}`}
                  className="flex items-center justify-between p-3 bg-[#050a14] hover:bg-[#1e293b] border border-[#1e293b] hover:border-[#3b82f6] rounded-[2px] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0a1325] rounded-[2px] flex items-center justify-center p-1.5 border border-[#1e293b]">
                      <Image src={category.image_url} alt={category.name} width={40} height={40} className="object-contain pixelated drop-shadow max-w-full max-h-full" unoptimized />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xs group-hover:text-[#facc15] transition-colors uppercase tracking-tight">{category.name}</h3>
                      <p className="text-gray-400 text-[11px] line-clamp-1 font-medium">{category.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Latest & Trending */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden">
            <div className="bg-[#050a14] border-b border-[#1e293b] px-4 py-3 flex justify-between items-center">
              <h2 className="text-xs font-black text-[#facc15] uppercase tracking-wider flex items-center gap-2">
                🔥 SON EKLENEN NADİRELER
              </h2>
              <span className="text-[10px] font-black text-[#22c55e] uppercase">Canlı Piyasa</span>
            </div>
            
            <div className="p-4 bg-[#0a1325] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {latestItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/market/item/${item.slug}`}
                  className="flex flex-col bg-[#050a14] border border-[#1e293b] rounded-[2px] hover:border-[#3b82f6] transition-all duration-300 hover:-translate-y-1 overflow-hidden group shadow"
                >
                  <div className="h-28 bg-[#0a1325] flex items-center justify-center p-4 relative border-b border-[#1e293b]">
                    {item.is_ltd && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-[2px] shadow border border-red-400">
                        LTD
                      </div>
                    )}
                    <Image 
                      src={item.image_url} 
                      alt={item.name} 
                      fill
                      className="object-contain pixelated group-hover:scale-110 transition-transform drop-shadow p-4" 
                      unoptimized
                    />
                  </div>
                  <div className="p-3 flex flex-col justify-between flex-1 bg-[#050a14]">
                    <div>
                      <span className="text-gray-500 text-[9px] uppercase font-black tracking-wider block mb-0.5">{item.category?.name}</span>
                      <h3 className="text-white font-black text-xs line-clamp-1 group-hover:text-[#facc15] transition-colors uppercase tracking-tight">{item.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[#1e293b]/50">
                      <Image 
                        src={item.currency_type === 'credits' 
                          ? 'https://images.habbo.com/c_images/album1584/CRED.gif' 
                          : 'https://images.habbo.com/c_images/album1584/DIA.gif'} 
                        alt={item.currency_type}
                        width={14}
                        height={14}
                        className="pixelated"
                        unoptimized
                      />
                      <span className="text-[#f59e0b] font-black text-xs">{item.current_value.toLocaleString('tr-TR')} c</span>
                    </div>
                  </div>
                </Link>
              ))}
              
              {latestItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400 font-bold text-sm bg-[#050a14] rounded-[2px] border border-[#1e293b]">
                  Henüz piyasaya eşya eklenmemiş.
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
