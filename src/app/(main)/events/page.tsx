import { createClient } from '@/utils/supabase/server';
import { Calendar, Clock, Trophy, MapPin, Tag } from 'lucide-react';

export const metadata = { title: 'Etkinlikler - HabboZone', description: 'HabboZone canlı oyunlar, turnuvalar ve ödüllü yarışma takvimi.' };
export const revalidate = 60;

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  const formatDeterministicDate = (dateStr?: string) => {
    if (!dateStr) return '26.07.2026';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  const formatDeterministicTime = (dateStr?: string) => {
    if (!dateStr) return '20:30';
    if (dateStr.includes('T')) {
      const timePart = dateStr.split('T')[1]?.substring(0, 5);
      if (timePart) return timePart;
    }
    return '20:30';
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#16a34a] text-white px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#15803d]">ETKİNLİK TAKVİMİ</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Oyunlar & Turnuvalar</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
            HABBOZONE ETKİNLİKLERİ
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            Otel içindeki en eğlenceli canlı oyunlar, zorlu labirentler, özel partiler ve ödüllü yarışmalar hakkında güncel takvim. HabboZone ile hiçbir rozeti ve ödülü kaçırma!
          </p>
        </div>

        <div className="bg-[#050a14] border border-[#1e293b] px-6 py-4 rounded-[4px] flex items-center gap-6 shrink-0 text-center">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Planlanan</div>
            <div className="text-xl font-black text-white">{events?.length || 0}</div>
          </div>
          <div className="h-8 w-px bg-[#1e293b]"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Durum</div>
            <div className="text-xs font-black text-[#22c55e]">Canlı</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#facc15]" />
          <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">ETKİNLİK LİSTESİ & TAKVİM</h2>
        </div>
        <span className="text-gray-400 text-[11px] font-bold uppercase">TOPLAM {events?.length || 0} ETKİNLİK</span>
      </div>

      <div className="space-y-4">
        {events?.map((ev) => {
          const isActive = ev.is_active !== false; 
          
          return (
            <div key={ev.id} className={`flex flex-col md:flex-row gap-0 habbo-box bg-[#0a1325] border border-[#1e293b] transition-all ${!isActive ? 'opacity-70 bg-[#050a14]' : 'hover:border-[#3b82f6]'}`}>
              
              <div className="w-full md:w-72 shrink-0 bg-[#050a14] flex items-center justify-center p-4 relative min-h-[180px] border-b md:border-b-0 md:border-r border-[#1e293b] overflow-hidden">
                {ev.image_url ? (
                  <img src={ev.image_url} alt={ev.title} className="max-w-full max-h-48 object-contain filter drop-shadow" />
                ) : (
                  <Calendar size={56} className="text-gray-600" />
                )}
                
                {ev.is_active === false && (
                  <div className="absolute inset-0 bg-[#050a14]/90 flex items-center justify-center z-10">
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-[2px] font-black text-xs uppercase tracking-widest border border-red-500/50">İptal Edildi</span>
                  </div>
                )}
                
                {isActive && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-[#15803d] text-white border border-[#166534] px-2 py-0.5 rounded-[2px] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Canlı Etkinlik
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-300 mb-3">
                    <div className="flex items-center gap-1 bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px] text-[#3b82f6]">
                      <Calendar size={13} />
                      <span>{formatDeterministicDate(ev.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px] text-[#3b82f6]">
                      <Clock size={13} />
                      <span>{formatDeterministicTime(ev.event_date)}</span>
                    </div>
                    
                    {ev.event_type && (
                      <div className="flex items-center gap-1 bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px] text-[#a855f7]">
                        <Tag size={13} />
                        <span>{ev.event_type}</span>
                      </div>
                    )}
                    
                    {ev.reward_text && (
                      <div className="flex items-center gap-1 bg-[#facc15] text-black px-2.5 py-1 rounded-[2px] font-black">
                        <Trophy size={13} />
                        <span>{ev.reward_text}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-black text-lg md:text-xl mb-2 text-white group-hover:text-[#facc15] transition-colors">{ev.title}</h3>
                  
                  {ev.description && (
                    <p className="text-xs text-gray-300 font-medium leading-relaxed mb-4 bg-[#050a14] p-3 rounded-[2px] border border-[#1e293b]">
                      {ev.description}
                    </p>
                  )}
                </div>
                
                <div className="mt-auto flex items-center justify-between border-t border-[#1e293b] pt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                    <span>Yetkili:</span>
                    <span className="text-white bg-[#050a14] px-2 py-0.5 rounded-[2px] border border-[#1e293b]">@HabboZone</span>
                  </div>
                  
                  {ev.room_link && (
                    <a 
                      href={ev.room_link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-black bg-[#15803d] hover:bg-[#16a34a] text-white border-b-2 border-[#166534] px-3 py-1.5 rounded-[3px] transition-all"
                    >
                      <MapPin size={14} /> Odaya Git
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {(!events || events.length === 0) && (
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] text-center py-16 rounded-[3px]">
            <Calendar size={48} className="mx-auto text-gray-600 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Etkinlik Bulunamadı</h3>
            <p className="text-xs text-gray-400">Şu anda planlanmış aktif veya geçmiş bir etkinlik bulunmuyor.</p>
          </div>
        )}
      </div>

    </div>
  );
}
