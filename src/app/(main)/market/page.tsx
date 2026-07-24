import { Metadata } from 'next'
import Link from 'next/link'
import { getMarketCategories, getLatestItems } from '@/actions/market'
import { TrendingUp, TrendingDown, ArrowRight, Activity, Search } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Market - Habbo Zone',
  description: 'Habbo nadir eşya ekonomi sistemi, güncel kredi değerleri ve fiyat grafikleri.',
}

export default async function MarketPage() {
  const categories = await getMarketCategories()
  const latestItems = await getLatestItems(8)

  return (
    <div className="flex flex-col gap-6">
      
      {/* Hero Section */}
      <div className="habbo-box bg-[#0f172a] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-full opacity-10 bg-[url('https://images.habbo.com/c_images/catalogue/icon_253.png')] bg-no-repeat bg-right-bottom bg-[length:150px]"></div>
        
        <div className="habbo-box-header flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-yellow-400" />
            Nadir Eşya Pazarı
          </h1>
        </div>
        
        <div className="p-6 relative z-10">
          <p className="text-gray-300 max-w-2xl text-sm leading-relaxed mb-6">
            Habbo Zone Market, oyun içerisindeki nadir eşyaların, LTD serilerinin ve özel kıyafetlerin
            güncel değerlerini takip edebileceğiniz ekonomi portalıdır. Eşyaların değer değişim grafiklerini inceleyin ve ticaretin nabzını tutun.
          </p>
          
          <div className="flex items-center gap-3 w-full max-w-md bg-[#1e293b] border border-[#2b3548] p-2 rounded-[4px]">
            <Search size={18} className="text-gray-400 ml-2" />
            <input 
              type="text" 
              placeholder="Nadir eşya, LTD veya kıyafet ara..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Categories */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="habbo-box bg-[#0f172a]">
            <div className="habbo-box-header">
              <h2 className="text-lg font-bold">Kategoriler</h2>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/market/${category.slug}`}
                  className="flex items-center justify-between p-3 bg-[#1e293b] hover:bg-[#2b3548] border border-[#2b3548] rounded-[4px] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#090e17] rounded-[4px] flex items-center justify-center p-2 border border-black/30">
                      <img src={category.image_url} alt={category.name} className="max-w-full max-h-full object-contain pixelated" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm group-hover:text-yellow-400 transition-colors">{category.name}</h3>
                      <p className="text-gray-500 text-xs line-clamp-1">{category.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Latest & Trending */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="habbo-box bg-[#0f172a]">
            <div className="habbo-box-header flex justify-between items-center">
              <h2 className="text-lg font-bold">Son Eklenen Eşyalar</h2>
            </div>
            
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {latestItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/market/item/${item.slug}`}
                  className="flex flex-col bg-[#1e293b] border border-[#2b3548] rounded-[4px] hover:border-blue-500/50 transition-colors overflow-hidden group"
                >
                  <div className="h-28 bg-[#090e17] flex items-center justify-center p-4 relative">
                    {item.is_ltd && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] shadow-sm">
                        LTD
                      </div>
                    )}
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="max-w-full max-h-full object-contain pixelated group-hover:scale-110 transition-transform" 
                    />
                  </div>
                  <div className="p-3 flex flex-col gap-1 border-t border-[#2b3548]">
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{item.category?.name}</span>
                    <h3 className="text-white font-bold text-xs line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <img 
                        src={item.currency_type === 'credits' 
                          ? 'https://images.habbo.com/c_images/album1584/CRED.gif' 
                          : 'https://images.habbo.com/c_images/album1584/DIA.gif'} 
                        alt={item.currency_type}
                        className="w-4 h-4 pixelated"
                      />
                      <span className="text-yellow-400 font-bold text-sm">{item.current_value.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </Link>
              ))}
              
              {latestItems.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-500 text-sm">
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
