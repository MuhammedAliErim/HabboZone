'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminEventsPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) setError(error.message);
    else setEvents(data || []);
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 text-primary rounded-2xl">
            <Calendar size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Etkinlikler</h1>
            <p className="text-white/60">Topluluk etkinliklerini ve oyunları yönetin.</p>
          </div>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} /> Yeni Etkinlik
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 text-red-500 p-4 rounded-lg mb-8 font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-4xl text-primary">⚙</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/10">
              Sistemde kayıtlı etkinlik bulunmuyor.
            </div>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group relative">
                <button 
                  onClick={() => handleDelete(ev.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>

                <div className="aspect-video w-full bg-black/40 relative flex items-center justify-center p-4">
                  {ev.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={ev.image_url} alt={ev.title} className="max-w-full max-h-full object-contain filter drop-shadow-xl" />
                  ) : (
                    <Calendar size={48} className="text-white/20" />
                  )}
                  {!ev.is_active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-red-500 px-3 py-1 rounded font-black text-xs uppercase tracking-widest">İptal / Pasif</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="text-xs font-black text-primary uppercase tracking-widest mb-2">
                    {new Date(ev.event_date).toLocaleString('tr-TR')}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{ev.title}</h3>
                  <p className="text-sm text-white/60 mb-4 line-clamp-2">{ev.description}</p>
                  
                  {ev.reward_text && (
                    <div className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-lg border border-yellow-500/30">
                      Ödül: {ev.reward_text}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
