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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box bg-white overflow-hidden relative text-center">
        <div className="habbo-box-header green">
          Otel Etkinlikleri
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-r from-green-50 to-green-100 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Calendar size={150} className="text-green-600" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    Etkinlikler & Yarışmalar
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                    Otel içindeki en eğlenceli oyunlar, maze'ler, partiler ve yarışmalar hakkında güncel bilgiler.
                </p>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="habbo-box bg-white">
        <div className="p-4 md:p-6 bg-gray-50 space-y-4">
            {events?.map((ev) => {
            const isPast = new Date(ev.event_date) < new Date();
            const isActive = ev.is_active && !isPast;
            
            return (
                <div key={ev.id} className={`flex flex-col md:flex-row gap-0 bg-white border border-gray-200 rounded overflow-hidden group shadow-sm transition-all ${!isActive ? 'opacity-70 grayscale-[50%]' : ''}`}>
                <div className="w-full md:w-64 shrink-0 bg-gray-100 flex items-center justify-center p-4 relative min-h-[160px] border-r border-gray-200">
                    {ev.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.image_url} alt={ev.title} className="max-w-full max-h-full object-contain filter drop-shadow-sm" />
                    ) : (
                    <Calendar size={48} className="text-gray-300" />
                    )}
                    
                    {isPast && (
                    <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white/90 text-gray-800 px-3 py-1 rounded font-black text-[10px] uppercase tracking-widest shadow-sm">Bitti</span>
                    </div>
                    )}
                    
                    {!isPast && !ev.is_active && (
                    <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-red-500/90 text-white px-3 py-1 rounded font-black text-[10px] uppercase tracking-widest shadow-sm">İptal Edildi</span>
                    </div>
                    )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-600 mb-3">
                    <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
                        <Calendar size={14} className="text-green-600" />
                        <span>{new Date(ev.event_date).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
                        <Clock size={14} className="text-green-600" />
                        <span>{new Date(ev.event_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {ev.reward_text && (
                        <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-300 shadow-sm">
                        <Trophy size={14} className="text-yellow-600" />
                        <span>{ev.reward_text}</span>
                        </div>
                    )}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{ev.title}</h3>
                    
                    {ev.description && (
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{ev.description}</p>
                    )}
                </div>
                </div>
            );
            })}

            {events?.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-200 rounded">
                <Calendar size={48} className="mx-auto text-gray-300 mb-2" />
                <h3 className="text-sm font-bold text-gray-700 mb-1">Etkinlik Bulunamadı</h3>
                <p className="text-xs text-gray-500">Şu anda planlanmış bir etkinlik bulunmuyor.</p>
            </div>
            )}
        </div>
      </div>

    </div>
  );
}
