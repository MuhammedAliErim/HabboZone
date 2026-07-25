import { createClient } from '@/utils/supabase/server'
import AnnouncementForm from './_components/AnnouncementForm'
import DeleteAnnouncementButton from './_components/DeleteAnnouncementButton'
import ToggleAnnouncementButton from './_components/ToggleAnnouncementButton'
import { Megaphone, Sparkles, Radio, Layers, Clock } from 'lucide-react'

export const revalidate = 0;

export const metadata = {
  title: 'Son Dakika Bantı Yönetimi - Admin Paneli',
}

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  const activeCount = announcements?.filter(a => a.is_active).length || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Megaphone className="text-red-500 animate-pulse" size={32} /> SON DAKİKA BANTI YÖNETİMİ
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Sitenin en üstünde kayan yazı (ticker) olarak gösterilen acil durum ve kampanya duyurularını kontrol edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <Radio className="text-red-500 animate-ping" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Yayında Olan</span>
              <span className="text-base font-black text-red-400">{activeCount} Duyuru</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Sütun: Yeni Duyuru Ekle */}
        <div className="lg:col-span-1 space-y-6">
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl shadow-2xl">
            <h2 className="text-base font-black text-white uppercase tracking-wider mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="text-red-400" size={18} /> Yeni Kayan Yazı Ekle
            </h2>
            <AnnouncementForm />
          </div>
        </div>

        {/* Sağ Sütun: Kayıtlı Duyurular */}
        <div className="lg:col-span-2">
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#050a14]">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="text-yellow-400" size={18} /> Kayıtlı Duyurular Kasası
              </h2>
              <span className="text-xs text-gray-400 font-bold">
                {announcements?.length || 0} kayıtlı
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">DURUM</th>
                    <th className="px-6 py-4">DUYURU MESAJI</th>
                    <th className="px-6 py-4">TARİH</th>
                    <th className="px-6 py-4 text-right">İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {announcements && announcements.length > 0 ? (
                    announcements.map((ann) => (
                      <tr key={ann.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${
                            ann.is_active 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-gray-700/40 text-gray-400 border border-white/5'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${ann.is_active ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                            {ann.is_active ? 'Yayında' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">
                            {ann.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-500" />
                            {new Date(ann.created_at).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ToggleAnnouncementButton id={ann.id} isActive={ann.is_active} />
                            <DeleteAnnouncementButton id={ann.id} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        <div className="max-w-xs mx-auto space-y-2">
                          <Megaphone size={32} className="mx-auto text-gray-600 opacity-40" />
                          <p className="font-bold text-sm text-gray-400">Kasada hiç son dakika duyurusu bulunamadı.</p>
                          <p className="text-xs">Soldaki formu kullanarak hemen yeni bir kayan yazı ekleyin!</p>
                        </div>
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
