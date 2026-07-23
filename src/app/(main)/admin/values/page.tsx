import { createClient } from '@/utils/supabase/server'
import AddCategoryForm from './_components/AddCategoryForm'
import AddItemForm from './_components/AddItemForm'
import Image from 'next/image'

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
    .limit(50)

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Nadire Değerleri Yönetimi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Yeni Kategori</h2>
            <AddCategoryForm />
          </div>

          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Yeni Eşya</h2>
            <AddItemForm categories={categories || []} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1f1f1f]">
              <h2 className="text-lg font-bold text-white">Son Eklenen Eşyalar</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
                  <tr>
                    <th className="px-4 py-3">Görsel</th>
                    <th className="px-4 py-3">Adı</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3 text-right">Değer</th>
                  </tr>
                </thead>
                <tbody>
                  {items && items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} className="border-b border-[#333] hover:bg-[#333]/50 transition-colors">
                        <td className="px-4 py-3">
                          {item.image_url ? (
                            <div className="relative w-8 h-8 rounded bg-[#1f1f1f]">
                              <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3">{item.category?.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-yellow-500">
                          {item.current_value} {item.currency_type}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Eşya bulunamadı.
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
