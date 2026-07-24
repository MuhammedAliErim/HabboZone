import Link from 'next/link'
import Image from 'next/image'
import { getWikiCategories, getRecentWikiItems } from './actions'
import { Search, ChevronRight, Package, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Wiki - Habbo Zone',
  description: 'Habbo Zone Eşya Kütüphanesi ve Ansiklopedisi',
}

export default async function WikiHomePage() {
  const categories = await getWikiCategories()
  const recentItems = await getRecentWikiItems(12)

  return (
    <div className="w-full">
      {/* Header Alanı */}
      <div className="bg-[#0f172a] border-b border-[#1e293b] py-12 relative overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-blue-500 to-transparent"></div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-4">
                <Sparkles size={16} /> WİKİ & KÜTÜPHANE
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                HABBO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">KÜTÜPHANESİ</span>
              </h1>
              <p className="text-gray-400 mt-4 text-base max-w-2xl">
                Otelde bulunan tüm mobilyalar, nadireler, rozetler ve kıyafetler hakkında detaylı bilgiye ulaşabileceğiniz devasa arşiv.
              </p>
            </div>

            {/* Arama Çubuğu */}
            <div className="w-full md:w-auto min-w-[300px]">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Eşya veya rozet ara..." 
                  className="w-full bg-[#111827] border border-[#1e293b] text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-12">
        {/* Kategoriler */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Package size={20} className="text-[#facc15]" />
            Kategoriler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat: any) => (
              <Link 
                href={`/wiki/${cat.slug}`} 
                key={cat.id}
                className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 hover:bg-[#1e293b] hover:border-gray-600 transition-all group relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Package size={80} />
                </div>
                <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-4 line-clamp-2">
                  {cat.description}
                </p>
                <div className="text-blue-400 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  İncele <ChevronRight size={16} />
                </div>
              </Link>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500 bg-[#0f172a] border border-[#1e293b] rounded-xl">
                Henüz kategori bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* Son Eklenenler */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-[#3b82f6]" />
              Son Eklenen Eşyalar
            </h2>
            <Link href="/wiki/mobilyalar" className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              Tümünü Gör <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentItems.map((item: any) => (
              <Link 
                href={`/wiki/item/${item.slug}`} 
                key={item.id}
                className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col items-center text-center hover:bg-[#1e293b] hover:border-gray-600 transition-all group"
              >
                <div className="w-16 h-16 relative flex items-center justify-center mb-3">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
                  {item.wiki_categories?.name}
                </span>
                
                {/* Nadirlik Badge */}
                {item.rarity_level && item.rarity_level !== 'Common' && (
                  <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.rarity_level === 'Legendary' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    item.rarity_level === 'Epic' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {item.rarity_level}
                  </span>
                )}
              </Link>
            ))}
            {recentItems.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-[#0f172a] border border-[#1e293b] rounded-xl">
                Henüz eşya eklenmemiş.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
