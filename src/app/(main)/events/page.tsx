import { createClient } from '@/utils/supabase/server';
import { Calendar, Clock, Trophy, MapPin, Tag, Sparkles } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function EventsPage() {
  const supabase = await createClient();

  // We are fetching events with related author info if needed, but for now just events
  const { data: events } = await supabase
    .from('events')
    .select('*, profiles:author_id(username)')
    .order('event_date', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-6">
      
      {/* Hero Section */}
      <div className="habbo-box overflow-hidden relative text-center border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header flex items-center justify-center gap-2" style={{backgroundColor: '#16a34a', borderBottomColor: '#15803d'}}>
          <Calendar size={18} /> HabboZone Canlı Etkinlik Takvimi & Turnuvalar
        </div>
        
        <div className="p-8 md:p-14 bg-gradient-to-br from-[#0a1224] via-[#111827] to-[#070c18] flex flex-col items-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <Calendar size={260} className="text-green-500" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-1.5 rounded-full text-green-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles size={14} className="animate-spin text-yellow-400" style={{ animationDuration: '5s' }} /> Eğlence & Rozet Ödülleri
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Etkinlikler & Yarışmalar
                </h1>
                <p className="text-sm md:text-base text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
                    Otel içindeki en eğlenceli canlı oyunlar, zorlu labirentler, özel partiler ve ödüllü yarışmalar hakkında güncel takvim. HabboZone ile hiçbir rozeti ve ödülü kaçırma!
                </p>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
            {events?.map((ev) => {
            const isPast = new Date(ev.event_date) < new Date();
            const isActive = ev.is_active !== false && !isPast; 
            
            return (
                <div key={ev.id} className={`flex flex-col md:flex-row gap-0 habbo-box border-2 border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-300 ${!isActive ? 'opacity-70 bg-[#070c18]/80' : 'hover:border-green-500/60 bg-[#0a1325]/90 hover:-translate-y-1'}`}>
                
                {/* Event Image / Thumbnail */}
                <div className="w-full md:w-80 shrink-0 bg-[#050b14] flex items-center justify-center p-6 relative min-h-[200px] border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                    {ev.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.image_url} alt={ev.title} className="max-w-full max-h-52 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500 relative z-10" />
                    ) : (
                    <Calendar size={72} className="text-white/10" />
                    )}
                    
                    {/* Status Badges */}
                    {isPast && (
                    <div className="absolute inset-0 bg-[#050a14]/85 flex items-center justify-center backdrop-blur-sm z-20">
                        <span className="bg-white/10 text-gray-300 px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest border border-white/20 shadow-xl">Süresi Bitti</span>
                    </div>
                    )}
                    
                    {!isPast && ev.is_active === false && (
                    <div className="absolute inset-0 bg-[#050a14]/85 flex items-center justify-center backdrop-blur-sm z-20">
                        <span className="bg-red-500/20 text-red-400 px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest border border-red-500/50 shadow-xl">İptal Edildi</span>
                    </div>
                    )}
                    
                    {isActive && (
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-green-500/20 text-green-400 border border-green-500/40 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Canlı Etkinlik
                        </span>
                    </div>
                    )}
                </div>
                
                {/* Event Details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-gray-300 mb-4">
                        <div className="flex items-center gap-1.5 bg-[#050b14]/80 border border-white/10 px-3 py-1.5 rounded-xl text-blue-400 shadow-inner">
                            <Calendar size={14} />
                            <span>{new Date(ev.event_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#050b14]/80 border border-white/10 px-3 py-1.5 rounded-xl text-blue-400 shadow-inner">
                            <Clock size={14} />
                            <span>{new Date(ev.event_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        
                        {ev.event_type && (
                            <div className="flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl text-purple-400 shadow-inner">
                                <Tag size={14} />
                                <span>{ev.event_type}</span>
                            </div>
                        )}
                        
                        {ev.reward_text && (
                            <div className="flex items-center gap-1.5 bg-yellow-950/60 text-yellow-400 px-3 py-1.5 rounded-xl border border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.15)] animate-pulse">
                                <Trophy size={14} className="text-yellow-400" />
                                <span>{ev.reward_text}</span>
                            </div>
                        )}
                    </div>
                    
                    <h3 className="font-black text-xl md:text-2xl mb-3 text-white group-hover:text-green-400 transition-colors">{ev.title}</h3>
                    
                    {ev.description && (
                        <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6 bg-[#050b14]/50 p-4 rounded-xl border border-white/5 shadow-inner">
                            {ev.description}
                        </p>
                    )}
                    
                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                            <span>Düzenleyen Yetkili:</span>
                            <span className="text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">@{ev.profiles?.username || 'HabboZone'}</span>
                        </div>
                        
                        {ev.room_link && (
                            <a 
                                href={ev.room_link} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 text-xs font-black bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border border-green-500/50 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_20px_rgba(22,163,74,0.5)] transition-all transform hover:-translate-y-0.5"
                            >
                                <MapPin size={15} />
                                Odaya Git
                            </a>
                        )}
                    </div>
                </div>
                </div>
            );
            })}

            {events?.length === 0 && (
            <div className="habbo-box border-2 border-white/10 shadow-2xl bg-[#0a1325]/60 text-center py-20 rounded-2xl">
                <Calendar size={64} className="mx-auto text-green-500/40 mb-4" />
                <h3 className="text-lg font-black text-white mb-2">Etkinlik Bulunamadı</h3>
                <p className="text-sm text-gray-400">Şu anda planlanmış aktif veya geçmiş bir etkinlik bulunmuyor.</p>
            </div>
            )}
      </div>

    </div>
  );
}

