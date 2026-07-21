'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminMagazinesPage() {
  const supabase = createClient();
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setMagazines(data || []);
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu dergiyi silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase.from('magazines').delete().eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      setMagazines(magazines.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 text-primary rounded-2xl">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Dergiler</h1>
            <p className="text-white/60">HabboZone yayınlarını (Bülten, Dergi) yönetin.</p>
          </div>
        </div>
        <Link
          href="/admin/magazines/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} /> Yeni Dergi
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {magazines.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/10">
              Henüz eklenmiş bir dergi yok.
            </div>
          ) : (
            magazines.map((mag) => (
              <div key={mag.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group relative flex flex-col">
                <button 
                  onClick={() => handleDelete(mag.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>

                <div className="aspect-[3/4] w-full bg-black/40 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mag.cover_image_url} alt={mag.title} className="w-full h-full object-cover" />
                  {mag.issue_number && (
                    <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                      Sayı {mag.issue_number}
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{mag.title}</h3>
                    <p className="text-xs text-white/50 mb-4">{new Date(mag.created_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div className="flex gap-2">
                    {mag.read_link && (
                      <a href={mag.read_link} target="_blank" rel="noreferrer" className="flex-1 bg-white/10 hover:bg-white/20 text-center py-2 rounded-lg text-xs font-bold uppercase transition-colors">
                        Oku
                      </a>
                    )}
                    {mag.pdf_url && (
                      <a href={mag.pdf_url} target="_blank" rel="noreferrer" className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 text-center py-2 rounded-lg text-xs font-bold uppercase transition-colors">
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
