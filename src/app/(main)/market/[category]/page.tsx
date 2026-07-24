import { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByCategory, getMarketCategories } from '@/actions/market'
import { ArrowLeft, Filter } from 'lucide-react'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categories = await getMarketCategories()
  const category = categories.find(c => c.slug === params.category)
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı - Habbo Zone',
    }
  }

  return {
    title: `${category.name} - Market - Habbo Zone`,
    description: category.description,
  }
}

export default async function MarketCategoryPage({ params }: { params: { category: string } }) {
  const categories = await getMarketCategories()
  const category = categories.find(c => c.slug === params.category)
  
  if (!category) {
    notFound()
  }
  
  const items = await getItemsByCategory(params.category)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
        <Link href="/market" className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft size={16} /> Pazar
        </Link>
        <span>/</span>
        <span className="text-white">{category.name}</span>
      </div>

      <div className="habbo-box bg-[#0f172a]">
        <div className="habbo-box-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#090e17] rounded-[4px] flex items-center justify-center p-1 border border-black/30">
              <img src={category.image_url} alt={category.name} className="max-w-full max-h-full object-contain pixelated" />
            </div>
            <h1 className="text-xl font-bold">{category.name}</h1>
          </div>
          
          <button className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#2b3548] text-white text-xs font-bold px-3 py-1.5 rounded-[4px] border border-[#2b3548] transition-colors">
            <Filter size={14} /> Filtrele
          </button>
        </div>
        
        <div className="p-4 bg-[#1e293b] border-b border-[#2b3548] text-sm text-gray-300">
          {category.description} • {items.length} eşya bulundu
        </div>
        
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
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
                <h3 className="text-white font-bold text-xs line-clamp-2" title={item.name}>{item.name}</h3>
                <div className="flex items-center gap-1.5 mt-auto pt-1">
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
          
          {items.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 text-sm">
              Bu kategoride henüz eşya bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
