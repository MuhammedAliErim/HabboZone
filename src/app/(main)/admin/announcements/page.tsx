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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#1e293b]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Megaphone className="text-red-500 animate-pulse" size={28} /> SON DAKİKA BANTI YÖNETİMİ
          </h1>
          <p className="text-xs text-gray-300 font-bold uppercase tracking-wide mt-1">
            Sitenin en üstünde kayan yazı (ticker) olarak gösterilen acil durum ve kampanya duyurularını kontrol edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
            <Radio className="text-red-500 animate-ping" size={18} />
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">YAYINDA OLAN</span>
              <span className="text-sm font-black text-red-400 uppercase">{activeCount} DUYURU</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Sütun: Yeni Duyuru Ekle */}
        <div className="lg:col-span-1 space-y-6">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] p-6 rounded-[3px] shadow-2xl">
            <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4 pb-3 border-b border-[#1e293b] flex items-center gap-2">
              <Sparkles className="text-red-400" size={16} /> YENİ KAYAN YAZI EKLE
            </h2>
            <AnnouncementForm />
          </div>
        </div>

        {/* Sağ Sütun: Kayıtlı Duyurular */}
        <div className="lg:col-span-2">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
            <div className="habbo-box-header flex justify-between items-center">
              <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="text-[#facc15]" size={16} /> KAYITLI DUYURULAR KASASI
              </h2>
              <span className="text-[10px] text-gray-300 font-black uppercase tracking-wider bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px]">
                {announcements?.length || 0} KAYITLI
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-[#1e293b] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">DURUM</th>
                    <th className="px-5 py-3.5">DUYURU MESAJI</th>
                    <th className="px-5 py-3.5">TARİH</th>
                    <th className="px-5 py-3.5 text-right">İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {announcements && announcements.length > 0 ? (
                    announcements.map((ann) => (
                      <tr key={ann.id} className="hover:bg-[#050a14] transition-colors group">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[11px] font-black uppercase tracking-wider ${
                            ann.is_active 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-gray-700/40 text-gray-400 border border-[#1e293b]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ann.is_active ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                            {ann.is_active ? 'YAYINDA' : 'PASİF'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-white text-sm uppercase tracking-tight group-hover:text-[#facc15] transition-colors">
                            {ann.message}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-[11px] font-black text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-gray-500" />
                            {ann.created_at ? ann.created_at.slice(0, 10).split('-').reverse().join('.') : '-'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
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
