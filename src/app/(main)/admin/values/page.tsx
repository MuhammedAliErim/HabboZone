import { createClient } from '@/utils/supabase/server'
import AddCategoryForm from './_components/AddCategoryForm'
import AddItemForm from './_components/AddItemForm'
import Image from 'next/image'
import { TrendingUp, FolderPlus, PackagePlus, Coins, Sparkles, Layers } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStat from '@/components/admin/AdminStat'

export const revalidate = 0;

export const metadata = {
  title: 'Nadire Değer Borsa Yönetimi - Admin Paneli',
}

export default async function AdminValuesPage() {
  const supabase = await createClient()

  // Fetch Categories
  const { data: categories } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .order('name')

  // Fetch Items with Category info
  const { data: items } = await supabase
    .from('habbo_items')
    .select(`
      *,
      category:habbo_item_categories(name)
    `)
    .order('created_at', { ascending: false })
    .limit(60)

  const itemsCount = items?.length || 0
  const categoriesCount = categories?.length || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={TrendingUp}
        iconColor="text-[#facc15]"
        title="NADİRE & BORSA DEĞERLERİ MERKEZİ"
        subtitle="HabboZone nadire borsasındaki eşyaları, kategorileri ve güncel piyasa kredi değerlerini yönetin."
        stats={
          <>
            <AdminStat
              label="Kategori"
              value={<span className="text-blue-300">{categoriesCount} Grup</span>}
              icon={Layers}
              iconColor="text-blue-400"
            />
            <AdminStat
              label="Kayıtlı Eşya"
              value={<span className="text-yellow-300">{itemsCount} Nadire</span>}
              icon={Coins}
              iconColor="text-[#facc15]"
            />
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sol Kolon: Formlar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#1e293b]">
              <div className="p-2 rounded-[3px] bg-yellow-500/10 text-yellow-400">
                <FolderPlus size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider">YENİ KATEGORİ OLUŞTUR</h2>
                <p className="text-[11px] text-gray-400">Eşyaları gruplamak için yeni bir başlık açın.</p>
              </div>
            </div>
            <AddCategoryForm />
          </div>

          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#1e293b]">
              <div className="p-2 rounded-[3px] bg-emerald-500/10 text-emerald-400">
                <PackagePlus size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider">BORSAYA EŞYA EKLE</h2>
                <p className="text-[11px] text-gray-400">Piyasada yer alacak nadire veya kıymetli eşyayı tanıtın.</p>
              </div>
            </div>
            <AddItemForm categories={categories || []} />
          </div>
        </div>

        {/* Sağ Kolon: Liste Tablosu */}
        <div className="lg:col-span-7">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#050a14] border-b border-[#1e293b] flex justify-between items-center">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={16} /> BORSADAKİ SON EŞYALAR & NADİRELER
              </h2>
              <span className="text-xs text-gray-400 font-bold bg-[#050a14] px-3 py-1 rounded-[2px]">
                Son {items?.length || 0} Kayıt
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-black/30 text-gray-400 text-xs font-black uppercase tracking-wider border-b border-[#1e293b]">
                  <tr>
                    <th className="px-5 py-4 w-16">İkon</th>
                    <th className="px-5 py-4">Nadire Adı</th>
                    <th className="px-5 py-4">Kategori Grubu</th>
                    <th className="px-5 py-4 text-right">Piyasa Değeri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {items && items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#050a14] transition-colors group">
                        <td className="px-5 py-3.5">
                          {item.image_url ? (
                            <div className="relative w-10 h-10 rounded-[3px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
                              <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                fill
                                className="object-contain p-1"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-[3px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center text-gray-600 font-bold text-xs">
                              ?
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-black text-white text-base group-hover:text-yellow-300 transition-colors">
                          {item.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px] text-xs font-bold text-gray-300">
                            {item.category?.name || 'Kategorisiz'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="inline-flex items-center gap-1.5 font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1.5 rounded-[3px] text-xs shadow-sm">
                            <Coins size={14} className="text-yellow-400 animate-pulse" />
                            {item.current_value} {item.currency_type}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-gray-500">
                        <Coins size={40} className="mx-auto mb-3 text-gray-600 opacity-40" />
                        <p className="font-bold text-base text-gray-400">Borsada henüz kayıtlı nadire bulunamadı.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
