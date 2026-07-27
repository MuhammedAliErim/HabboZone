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

  const formatDeterministicDate = (dateStr?: string) => {
    if (!dateStr) return 'Bilinmiyor';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  const rarityColor = 
    item.rarity_level === 'Legendary' ? 'text-[#facc15] bg-[#facc15]/10 border-[#facc15]' :
    item.rarity_level === 'Epic' ? 'text-purple-400 bg-purple-500/10 border-purple-500' :
    item.rarity_level === 'Rare' ? 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]' :
    'text-gray-300 bg-gray-500/10 border-gray-500'

  return (
    <div className="w-full pb-16 animate-in fade-in duration-500">
      {/* Header Alanı */}
      <div className="bg-[#050a14] border-b border-[#1e293b] py-6">
        <div className="max-w-[1200px] mx-auto px-6">
          <Link href={`/wiki/${item.wiki_categories?.slug}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> {item.wiki_categories?.name} KATEGORİSİNE DÖN
          </Link>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-8">
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-md flex flex-col md:flex-row">
          
          {/* Sol Kısım: Resim (Vurgulu) */}
          <div className="w-full md:w-2/5 bg-[#050a14] p-8 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#1e293b] relative group">
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500 pixelated"
              />
            </div>
          </div>

          {/* Sağ Kısım: Detaylar */}
          <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight" style={{ textShadow: '2px 2px 0 #000' }}>
                  {item.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Link href={`/wiki/${item.wiki_categories?.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-xs font-black uppercase tracking-wider text-gray-300 hover:text-white hover:border-[#3b82f6] transition-colors">
                  <Package size={14} className="text-[#facc15]" />
                  {item.wiki_categories?.name}
                </Link>
                
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] border text-xs font-black uppercase tracking-wider ${rarityColor}`}>
                  <ShieldAlert size={14} />
                  {item.rarity_level}
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-gray-300 mb-8">
                <p className="text-sm leading-relaxed font-medium">{item.description}</p>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-[#1e293b] pt-6 bg-[#050a14] -mx-6 md:-mx-10 -mb-6 md:-mb-10 p-6 md:p-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={12} className="text-[#3b82f6]" /> Çıkış Tarihi
                </span>
                <span className="text-white font-bold text-sm">
                  {formatDeterministicDate(item.release_date)}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Tag size={12} className="text-[#facc15]" /> Market Değeri
                </span>
                <span className="text-white font-bold text-sm">
                  {item.market_value ? (
                    <span className="flex items-center gap-1 font-black text-[#facc15]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://images.habbo.com/c_images/catalogue/icon_273.png" alt="kredi" className="w-4 h-4 object-contain" />
                      {item.market_value} c
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
