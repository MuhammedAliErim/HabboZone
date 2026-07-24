import { createClient } from '@/utils/supabase/server';
import { Calendar, Clock, Trophy, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';

export const revalidate = 60; // Cache for 60 seconds

export default async function EventsPage() {
  const supabase = await createClient();

  // We are fetching events with related author info if needed, but for now just events
  const { data: events } = await supabase
    .from('events')
    .select('*, profiles:author_id(username)')
    .order('event_date', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-6">
      
      {/* Hero Section */}
      <div className="habbo-box overflow-hidden relative text-center">
        <div className="habbo-box-header green">
          Otel Etkinlikleri
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-br from-[#0a1224] to-[#050a14] border-b border-[#1e293b] flex flex-col items-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <Calendar size={250} className="text-white" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    Etkinlikler & Yarışmalar
                </h1>
                <p className="text-sm md:text-base text-gray-300 font-medium">
                    Otel içindeki en eğlenceli oyunlar, maze'ler, partiler ve yarışmalar hakkında güncel bilgiler. Habbo Zone ile hiçbir eğlenceyi kaçırma!
                </p>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
            {events?.map((ev) => {
            const isPast = new Date(ev.event_date) < new Date();
            const isActive = ev.is_active !== false && !isPast; 
            
            return (
                <div key={ev.id} className={`flex flex-col md:flex-row gap-0 habbo-box relative overflow-hidden group transition-all ${!isActive ? 'opacity-80' : 'hover:border-[#3b82f6]'}`}>
                
                {/* Event Image / Thumbnail */}
                <div className="w-full md:w-72 shrink-0 bg-[#0a1224] flex items-center justify-center p-4 relative min-h-[180px] border-r border-[#1e293b]">
                    {ev.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.image_url} alt={ev.title} className="max-w-full max-h-full object-contain filter drop-shadow-lg" />
                    ) : (
                    <Calendar size={64} className="text-[#1e293b]" />
                    )}
                    
                    {/* Status Badges */}
                    {isPast && (
                    <div className="absolute inset-0 bg-[#050a14]/80 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white/10 text-white px-4 py-1.5 rounded font-black text-xs uppercase tracking-widest border border-white/20">Süresi Bitti</span>
                    </div>
                    )}
                    
                    {!isPast && ev.is_active === false && (
                    <div className="absolute inset-0 bg-[#050a14]/80 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-red-500/20 text-red-400 px-4 py-1.5 rounded font-black text-xs uppercase tracking-widest border border-red-500/50">İptal Edildi</span>
                    </div>
                    )}
                </div>
                
                {/* Event Details */}
                <div className="p-6 flex-1 flex flex-col justify-center bg-[#111827]">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-300 mb-4">
                        <div className="flex items-center gap-1.5 bg-[#1e293b] border border-[#334155] px-3 py-1.5 rounded text-blue-400">
                            <Calendar size={14} />
                            <span>{new Date(ev.event_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#1e293b] border border-[#334155] px-3 py-1.5 rounded text-blue-400">
                            <Clock size={14} />
                            <span>{new Date(ev.event_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        
                        {ev.event_type && (
                            <div className="flex items-center gap-1.5 bg-[#1e293b] border border-[#334155] px-3 py-1.5 rounded text-purple-400">
                                <Tag size={14} />
                                <span>{ev.event_type}</span>
                            </div>
                        )}
                        
                        {ev.reward_text && (
                            <div className="flex items-center gap-1.5 bg-yellow-900/30 text-yellow-500 px-3 py-1.5 rounded border border-yellow-700/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                                <Trophy size={14} className="text-yellow-500" />
                                <span>{ev.reward_text}</span>
                            </div>
                        )}
                    </div>
                    
                    <h3 className="font-bold text-xl md:text-2xl mb-3 text-white group-hover:text-blue-400 transition-colors">{ev.title}</h3>
                    
                    {ev.description && (
                        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-4">
                            {ev.description}
                        </p>
                    )}
                    
                    <div className="mt-auto flex items-center justify-between border-t border-[#1e293b] pt-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                            <span>Yetkili:</span>
                            <span className="text-white">{ev.profiles?.username || 'Bilinmiyor'}</span>
                        </div>
                        
                        {ev.room_link && (
                            <a 
                                href={ev.room_link} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs font-bold bg-green-600/20 text-green-400 border border-green-600/50 px-3 py-1.5 rounded hover:bg-green-600/30 transition-colors"
                            >
                                <MapPin size={14} />
                                Odaya Git
                            </a>
                        )}
                    </div>
                </div>
                </div>
            );
            })}

            {events?.length === 0 && (
            <div className="habbo-box text-center py-20">
                <Calendar size={64} className="mx-auto text-[#1e293b] mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Etkinlik Bulunamadı</h3>
                <p className="text-sm text-gray-500">Şu anda planlanmış bir etkinlik bulunmuyor.</p>
            </div>
            )}
      </div>

    </div>
  );
}
