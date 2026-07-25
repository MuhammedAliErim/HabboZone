import { createClient } from '@/utils/supabase/server'
import EventForm from './_components/EventForm'
import DeleteEventButton from './_components/DeleteEventButton'
import { Calendar, Sparkles, Gift, Clock, User, Layers } from 'lucide-react'

export const revalidate = 0;

export const metadata = {
  title: 'Etkinlik Takvimi Yönetimi - Admin Paneli',
}

export default async function AdminEventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*, profiles:author_id(username)')
    .order('event_date', { ascending: true })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Calendar className="text-purple-400" size={32} /> ETKİNLİK TAKVİMİ YÖNETİMİ
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Topluluk için planlanan oda yarışmaları, partiler ve turnuvaların takvimini organize edin.
          </p>
        </div>

        <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
          <Layers className="text-purple-400" size={20} />
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Planlı Etkinlik</span>
            <span className="text-base font-black text-white">{events?.length || 0} Adet</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Sütun: Yeni Etkinlik Ekle Formu */}
        <div className="lg:col-span-1 space-y-6">
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl shadow-2xl">
            <h2 className="text-base font-black text-white uppercase tracking-wider mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="text-purple-400" size={18} /> Takvime Etkinlik Ekle
            </h2>
            <EventForm />
          </div>
        </div>

        {/* Sağ Sütun: Planlanmış Etkinlikler Listesi */}
        <div className="lg:col-span-2">
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#050a14]">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="text-yellow-400" size={18} /> Planlanan ve Yayındaki Etkinlikler
              </h2>
              <span className="text-xs text-gray-400 font-bold">
                {events?.length || 0} etkinlik
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">TARİH & TÜR</th>
                    <th className="px-6 py-4">ETKİNLİK BAŞLIĞI & DETAYI</th>
                    <th className="px-6 py-4">ÖDÜL</th>
                    <th className="px-6 py-4">ORGANİZATÖR</th>
                    <th className="px-6 py-4 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events && events.length > 0 ? (
                    events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-black text-yellow-400 text-xs flex items-center gap-1.5">
                            <Clock size={14} className="text-purple-400" />
                            {new Date(ev.event_date).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase border border-purple-500/30">
                            {ev.event_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-black text-white text-base group-hover:text-purple-300 transition-colors">
                            {ev.title}
                          </div>
                          {ev.description && (
                            <div className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
                              {ev.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-[180px]">
                          {ev.reward_text ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-semibold">
                              <Gift size={12} className="shrink-0 text-amber-400" />
                              <span className="truncate">{ev.reward_text}</span>
                            </span>
                          ) : (
                            <span className="text-gray-600 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <User size={12} className="text-gray-500" />
                            {ev.profiles?.username || 'Yönetim'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DeleteEventButton id={ev.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="max-w-xs mx-auto space-y-2">
                          <Calendar size={32} className="mx-auto text-gray-600 opacity-40" />
                          <p className="font-bold text-sm text-gray-400">Takvimde planlanmış etkinlik yok.</p>
                          <p className="text-xs">Soldaki formu kullanarak takvime hemen yeni bir yarışma veya parti ekleyin!</p>
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
