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
      <div className="bg-[#0a1325] border-b border-[#1e293b] py-12 relative overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[#3b82f6] to-transparent"></div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-[#facc15] text-[10px] font-black uppercase tracking-widest mb-4 shadow">
                <Sparkles size={14} /> WİKİ & KÜTÜPHANE
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
                HABBO <span className="text-[#facc15]">KÜTÜPHANESİ</span>
              </h1>
              <p className="text-gray-300 mt-4 text-xs max-w-2xl font-medium">
                Otelde bulunan tüm mobilyalar, nadireler, rozetler ve kıyafetler hakkında detaylı bilgiye ulaşabileceğiniz devasa arşiv.
              </p>
            </div>

            {/* Arama Çubuğu */}
            <div className="w-full md:w-auto min-w-[300px]">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Eşya veya rozet ara..." 
                  className="w-full bg-[#050a14] border border-[#1e293b] text-white text-xs font-bold rounded-[2px] pl-10 pr-4 py-3 focus:outline-none focus:border-[#3b82f6] shadow-inner"
                />
                <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-12">
        {/* Kategoriler */}
        <div className="mb-12">
          <h2 className="text-lg font-black uppercase tracking-wider text-white mb-6 flex items-center gap-2">
            <Package size={18} className="text-[#facc15]" />
            KATEGORİLER
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat: any) => (
              <Link 
                href={`/wiki/${cat.slug}`} 
                key={cat.id}
                className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-5 hover:border-[#facc15] hover:-translate-y-1 transition-all group relative overflow-hidden shadow"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Package size={80} />
                </div>
                <h3 className="font-black text-white text-base uppercase tracking-tight group-hover:text-[#facc15] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 mb-4 line-clamp-2 font-medium">
                  {cat.description}
                </p>
                <div className="text-[#3b82f6] text-xs font-black uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  İNCELE <ChevronRight size={14} />
                </div>
              </Link>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-400 text-xs font-bold uppercase tracking-wider bg-[#0a1325] border border-[#1e293b] rounded-[3px]">
                Henüz kategori bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* Son Eklenenler */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles size={18} className="text-[#facc15]" />
              SON EKLENEN EŞYALAR
            </h2>
            <Link href="/wiki/mobilyalar" className="text-xs font-black text-gray-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors">
              TÜMÜNÜ GÖR <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentItems.map((item: any) => (
              <Link 
                href={`/wiki/item/${item.slug}`} 
                key={item.id}
                className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 flex flex-col items-center text-center hover:border-[#facc15] hover:-translate-y-1 transition-all group shadow"
              >
                <div className="w-16 h-16 relative flex items-center justify-center mb-3">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain pixelated drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-black uppercase tracking-tight text-white text-xs line-clamp-1 group-hover:text-[#facc15] transition-colors">
                  {item.name}
                </h3>
                <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
                  {item.wiki_categories?.name}
                </span>
                
                {/* Nadirlik Badge */}
                {item.rarity_level && item.rarity_level !== 'Common' && (
                  <span className={`mt-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-[2px] border ${
                    item.rarity_level === 'Legendary' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    item.rarity_level === 'Epic' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                    'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30'
                  }`}>
                    {item.rarity_level}
                  </span>
                )}
              </Link>
            ))}
            {recentItems.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-wider bg-[#0a1325] border border-[#1e293b] rounded-[3px]">
                Henüz eşya eklenmemiş.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
