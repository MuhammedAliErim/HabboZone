import Link from 'next/link'
import { getWikiItemBySlug } from '../../actions'
import { notFound } from 'next/navigation'
import { Package, ArrowLeft, Calendar, Tag, ShieldAlert } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getWikiItemBySlug(params.slug)
  if (!item) return { title: 'Bulunamadı - Habbo Zone Wiki' }
  return {
    title: `${item.name} - Habbo Zone Wiki`,
    description: item.description || `${item.name} eşyası hakkında bilgiler.`,
  }
}

export default async function WikiItemPage({ params }: { params: { slug: string } }) {
  const item = await getWikiItemBySlug(params.slug)

  if (!item) {
    notFound()
  }

  const rarityColor = 
    item.rarity_level === 'Legendary' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' :
    item.rarity_level === 'Epic' ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' :
    item.rarity_level === 'Rare' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
    'text-gray-300 bg-gray-500/10 border-gray-500/30'

  return (
    <div className="w-full">
      {/* Header Alanı */}
      <div className="bg-[#0f172a] border-b border-[#1e293b] py-6">
        <div className="max-w-[1280px] mx-auto px-4">
          <Link href={`/wiki/${item.wiki_categories?.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> {item.wiki_categories?.name} Kategorisine Dön
          </Link>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Sol Kısım: Resim (Vurgulu) */}
          <div className="w-full md:w-2/5 bg-[#090e17] p-8 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#1e293b] relative group">
            {/* Arka plan parlaklığı */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
            
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Sağ Kısım: Detaylar */}
          <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {item.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Link href={`/wiki/${item.wiki_categories?.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#111827] border border-[#1e293b] text-sm font-bold text-gray-300 hover:text-white hover:bg-[#1e293b] transition-colors">
                <Package size={14} className="text-[#facc15]" />
                {item.wiki_categories?.name}
              </Link>
              
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border text-sm font-bold ${rarityColor}`}>
                <ShieldAlert size={14} />
                {item.rarity_level}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 mb-8">
              <p className="text-lg leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-[#1e293b] pt-6">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Çıkış Tarihi
                </span>
                <span className="text-white font-medium">
                  {item.release_date 
                    ? new Date(item.release_date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Bilinmiyor'}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Tag size={12} /> Market Değeri
                </span>
                <span className="text-white font-medium">
                  {item.market_value ? (
                    <span className="flex items-center gap-1">
                      <img src="https://images.habbo.com/c_images/catalogue/icon_273.png" alt="kredi" className="w-4 h-4 object-contain" />
                      {item.market_value}
                    </span>
                  ) : 'Belirlenmedi'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
