import { createClient } from '@/utils/supabase/server'
import AnnouncementForm from './_components/AnnouncementForm'
import DeleteAnnouncementButton from './_components/DeleteAnnouncementButton'
import ToggleAnnouncementButton from './_components/ToggleAnnouncementButton'
import { Megaphone } from 'lucide-react'

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Megaphone size={28} className="text-[#ef4444]" />
        <h1 className="text-2xl font-bold text-white">Son Dakika Bantı Yönetimi</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Sütun: Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Yeni Duyuru Ekle</h2>
            <AnnouncementForm />
          </div>
        </div>

        {/* Sağ Sütun: Liste */}
        <div className="lg:col-span-2">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1f1f1f]">
              <h2 className="text-lg font-bold text-white">Kayıtlı Duyurular</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
                  <tr>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3">Mesaj</th>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements && announcements.length > 0 ? (
                    announcements.map((ann) => (
                      <tr key={ann.id} className={`border-b border-[#333] hover:bg-[#333]/50 transition-colors ${!ann.is_active ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3">
                          {ann.is_active ? (
                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold">Aktif</span>
                          ) : (
                            <span className="bg-gray-500/10 text-gray-500 px-2 py-1 rounded text-xs font-bold">Pasif</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-white max-w-[300px] truncate">{ann.message}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(ann.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 text-right flex justify-end gap-1">
                          <ToggleAnnouncementButton id={ann.id} isActive={ann.is_active} />
                          <DeleteAnnouncementButton id={ann.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Sistemde kayıtlı duyuru bulunmuyor.
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
