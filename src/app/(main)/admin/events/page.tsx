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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#1e293b]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Calendar className="text-purple-400" size={28} /> ETKİNLİK TAKVİMİ YÖNETİMİ
          </h1>
          <p className="text-xs text-gray-300 font-bold uppercase tracking-wide mt-1">
            Topluluk için planlanan oda yarışmaları, partiler ve turnuvaların takvimini organize edin.
          </p>
        </div>

        <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
          <Layers className="text-purple-400" size={18} />
          <div>
            <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">PLANLI ETKİNLİK</span>
            <span className="text-sm font-black text-white uppercase">{events?.length || 0} ADET</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Sütun: Yeni Etkinlik Ekle Formu */}
        <div className="lg:col-span-1 space-y-6">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] p-6 rounded-[3px] shadow-2xl">
            <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4 pb-3 border-b border-[#1e293b] flex items-center gap-2">
              <Sparkles className="text-purple-400" size={16} /> TAKVİME ETKİNLİK EKLE
            </h2>
            <EventForm />
          </div>
        </div>

        {/* Sağ Sütun: Planlanmış Etkinlikler Listesi */}
        <div className="lg:col-span-2">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
            <div className="habbo-box-header flex justify-between items-center">
              <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="text-[#facc15]" size={16} /> PLANLANAN VE YAYINDAKİ ETKİNLİKLER
              </h2>
              <span className="text-[10px] text-gray-300 font-black uppercase tracking-wider bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px]">
                {events?.length || 0} ETKİNLİK
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-[#1e293b] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">TARİH & TÜR</th>
                    <th className="px-5 py-3.5">ETKİNLİK BAŞLIĞI & DETAYI</th>
                    <th className="px-5 py-3.5">ÖDÜL</th>
                    <th className="px-5 py-3.5">ORGANİZATÖR</th>
                    <th className="px-5 py-3.5 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {events && events.length > 0 ? (
                    events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-[#050a14] transition-colors group">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-black text-[#facc15] text-[11px] flex items-center gap-1.5 uppercase">
                            <Clock size={13} className="text-purple-400" />
                            {ev.event_date ? `${ev.event_date.slice(0, 10).split('-').reverse().join('.')} ${ev.event_date.slice(11, 16)}` : '-'}
                          </div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-[2px] bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase border border-purple-500/30 tracking-wider">
                            {ev.event_type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-black text-white text-sm uppercase tracking-tight group-hover:text-purple-300 transition-colors">
                            {ev.title}
                          </div>
                          {ev.description && (
                            <div className="text-[11px] text-gray-400 mt-0.5 max-w-[200px] truncate font-bold">
                              {ev.description}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 max-w-[180px]">
                          {ev.reward_text ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] bg-[#050a14] border border-[#facc15]/30 text-[11px] text-[#facc15] font-black uppercase tracking-wider">
                              <Gift size={12} className="shrink-0 text-[#facc15]" />
                              <span className="truncate">{ev.reward_text}</span>
                            </span>
                          ) : (
                            <span className="text-gray-600 text-xs font-black">-</span>
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
