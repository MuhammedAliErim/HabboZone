import { createClient } from '@/utils/supabase/server';
import { Calendar, Clock, Trophy } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-900/40 to-teal-900/40 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Calendar size={200} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)]" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Etkinlikler
          </h1>
          <p className="text-lg text-white/70 font-medium">
            Otel içindeki en eğlenceli oyunlar, maze'ler, partiler ve yarışmalar hakkında güncel bilgiler.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {events?.map((ev) => {
          const isPast = new Date(ev.event_date) < new Date();
          const isActive = ev.is_active && !isPast;
          
          return (
            <div key={ev.id} className={`flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:bg-white/10 transition-all ${!isActive ? 'opacity-70 grayscale-[50%]' : ''}`}>
              <div className="w-full md:w-64 shrink-0 bg-black/40 flex items-center justify-center p-4 relative min-h-[160px]">
                {ev.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.image_url} alt={ev.title} className="max-w-full max-h-full object-contain filter drop-shadow-xl" />
                ) : (
                  <Calendar size={48} className="text-white/20" />
                )}
                
                {isPast && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-white/20 text-white px-4 py-2 rounded-lg font-black text-sm uppercase tracking-widest border border-white/10">Bitti</span>
                  </div>
                )}
                
                {!isPast && !ev.is_active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-red-500/80 text-white px-4 py-2 rounded-lg font-black text-sm uppercase tracking-widest border border-red-500/50">İptal Edildi</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/60 mb-3">
                  <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                    <Calendar size={16} className="text-primary" />
                    <span>{new Date(ev.event_date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                    <Clock size={16} className="text-primary" />
                    <span>{new Date(ev.event_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {ev.reward_text && (
                    <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-500 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                      <Trophy size={16} />
                      <span>{ev.reward_text}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-black text-2xl mb-2">{ev.title}</h3>
                
                {ev.description && (
                  <p className="text-white/70">{ev.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {events?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <Calendar size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Etkinlik Bulunamadı</h3>
          <p className="text-white/50">Şu anda planlanmış bir etkinlik bulunmuyor.</p>
        </div>
      )}

    </div>
  );
}

