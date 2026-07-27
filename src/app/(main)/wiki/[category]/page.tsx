import Link from 'next/link'
import { getWikiItemsByCategory } from '../actions'
import { Package, ChevronRight, ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: { category: string } }) {
  // Normally we would fetch the exact category name to put in title
  return {
    title: 'Kategori - Habbo Zone Wiki',
  }
}

export default async function WikiCategoryPage({ params }: { params: { category: string } }) {
  const { category } = params
  const { items, categoryName, description } = await getWikiItemsByCategory(category)

  return (
    <div className="w-full">
      {/* Header Alanı */}
      <div className="bg-[#0a1325] border-b border-[#1e293b] py-8">
        <div className="max-w-[1280px] mx-auto px-4">
          <Link href="/wiki" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft size={14} /> WİKİ'YE DÖN
          </Link>
          
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
            <Package size={28} className="text-[#facc15]" />
            {categoryName || category.toUpperCase()}
          </h1>
          {description && (
            <p className="text-gray-300 mt-2 text-xs font-medium max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {items.map((item: any) => (
            <Link 
              href={`/wiki/item/${item.slug}`} 
              key={item.id}
              className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-3 flex flex-col items-center text-center hover:border-[#facc15] hover:-translate-y-1 transition-all group shadow"
            >
              <div className="w-16 h-16 relative flex items-center justify-center mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="max-w-full max-h-full object-contain pixelated drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="font-black uppercase tracking-tight text-white text-xs line-clamp-2 leading-tight group-hover:text-[#facc15] transition-colors">
                {item.name}
              </h3>
              
              {/* Nadirlik Badge */}
              {item.rarity_level && item.rarity_level !== 'Common' && (
                <span className={`mt-auto pt-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] border ${
                  item.rarity_level === 'Legendary' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                  item.rarity_level === 'Epic' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                  'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30'
                }`}>
                  {item.rarity_level}
                </span>
              )}
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-[#0a1325] rounded-[3px] border border-[#1e293b] border-dashed shadow">
            <Package size={40} className="text-[#facc15] mb-4" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2">EŞYA BULUNAMADI</h3>
            <p className="text-gray-400 text-xs font-medium max-w-md">
              Bu kategoride henüz herhangi bir içerik eklenmemiş. Lütfen daha sonra tekrar kontrol edin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
