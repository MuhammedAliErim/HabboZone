import { createClient } from '@/utils/supabase/server'
import BadgeForm from './_components/BadgeForm'
import DeleteBadgeButton from './_components/DeleteBadgeButton'
import { Award } from 'lucide-react'
import Image from 'next/image'

export default async function AdminBadgesPage() {
  const supabase = await createClient()

  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Award size={28} className="text-[#facc15]" />
        <h1 className="text-2xl font-bold text-white">Rozet Yönetimi</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol Sütun: Form */}
        <div className="md:col-span-1">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Yeni Rozet Ekle</h2>
            <BadgeForm />
          </div>
        </div>

        {/* Sağ Sütun: Liste */}
        <div className="md:col-span-2">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1f1f1f]">
              <h2 className="text-lg font-bold text-white">Ekli Rozetler</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
                  <tr>
                    <th className="px-4 py-3">Görsel</th>
                    <th className="px-4 py-3">Rozet Adı</th>
                    <th className="px-4 py-3">Kazanma Yöntemi</th>
                    <th className="px-4 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {badges && badges.length > 0 ? (
                    badges.map((badge) => (
                      <tr key={badge.id} className="border-b border-[#333] hover:bg-[#333]/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="relative w-10 h-10 bg-[#1f1f1f] rounded flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={badge.image_url} 
                              alt={badge.name} 
                              className="pixelated max-w-8 max-h-8 object-contain"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-white">{badge.name}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate">{badge.how_to_get}</td>
                        <td className="px-4 py-3 text-right">
                          <DeleteBadgeButton id={badge.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Sistemde kayıtlı rozet bulunmuyor.
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
