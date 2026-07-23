import { createClient } from '@/utils/supabase/server'
import EventForm from './_components/EventForm'
import DeleteEventButton from './_components/DeleteEventButton'
import { Calendar } from 'lucide-react'

export default async function AdminEventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_time', { ascending: true })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Calendar size={28} className="text-[#a855f7]" />
        <h1 className="text-2xl font-bold text-white">Etkinlik Takvimi</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Sütun: Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Yeni Etkinlik Ekle</h2>
            <EventForm />
          </div>
        </div>

        {/* Sağ Sütun: Liste */}
        <div className="lg:col-span-2">
          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1f1f1f]">
              <h2 className="text-lg font-bold text-white">Yaklaşan Etkinlikler</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
                  <tr>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3">Başlık</th>
                    <th className="px-4 py-3">Yetkili</th>
                    <th className="px-4 py-3">Tür</th>
                    <th className="px-4 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {events && events.length > 0 ? (
                    events.map((evt) => (
                      <tr key={evt.id} className="border-b border-[#333] hover:bg-[#333]/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                          {new Date(evt.event_time).toLocaleString('tr-TR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#a855f7]">{evt.title}</td>
                        <td className="px-4 py-3">{evt.host_username}</td>
                        <td className="px-4 py-3">{evt.event_type}</td>
                        <td className="px-4 py-3 text-right">
                          <DeleteEventButton id={evt.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Sistemde kayıtlı etkinlik bulunmuyor.
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
