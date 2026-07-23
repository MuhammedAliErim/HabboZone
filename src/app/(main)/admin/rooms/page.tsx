import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

export default async function AdminRoomsPage() {
  const supabase = await createClient()

  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Odalar Yönetimi</h1>
        <Link 
          href="/admin/rooms/new"
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-bold transition-colors"
        >
          <Plus size={18} />
          Yeni Oda Ekle
        </Link>
      </div>

      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
              <tr>
                <th className="px-6 py-4">Görsel</th>
                <th className="px-6 py-4">Oda Adı</th>
                <th className="px-6 py-4">Sahip</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {rooms && rooms.length > 0 ? (
                rooms.map((item) => (
                  <tr key={item.id} className="border-b border-[#333] hover:bg-[#333]/50 transition-colors">
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <div className="relative w-16 h-10 rounded overflow-hidden border border-[#444]">
                          <Image 
                            src={item.image_url} 
                            alt={item.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Yok</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-yellow-500">
                      {item.owner}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#333] px-2 py-1 rounded text-xs">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/rooms/${item.id}/edit`}
                          className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        {/* We use a simple form to handle deletion for ease without client components */}
                        <form action={async () => {
                          'use server'
                          const sb = await createClient()
                          await sb.from('rooms').delete().eq('id', item.id)
                        }}>
                          <button 
                            type="submit"
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Henüz hiç oda bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
