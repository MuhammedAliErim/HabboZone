'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Award, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminBadgesPage() {
  const supabase = createClient();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setBadges(data || []);
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu rozeti silmek istediğinize emin misiniz? (Kullanıcılardan da silinecektir)')) return;

    const { error } = await supabase.from('badges').delete().eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      setBadges(badges.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 text-primary rounded-2xl">
            <Award size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Rozetler</h1>
            <p className="text-white/60">Sistemdeki rozetleri yönetin ve kullanıcılara verin.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/badges/assign"
            className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-white/20 transition-colors"
          >
            <Users size={20} /> Rozet Ver
          </Link>
          <Link
            href="/admin/badges/new"
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} /> Yeni Rozet
          </Link>
        </div>
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
          {badges.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/10">
              Henüz sistemde hiç rozet yok.
            </div>
          ) : (
            badges.map((badge) => (
              <div key={badge.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center relative group">
                <button 
                  onClick={() => handleDelete(badge.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>

                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={badge.image_url} alt={badge.name} className="max-w-full max-h-full object-contain filter drop-shadow-xl" />
                </div>
                
                <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                <span className="text-xs font-black uppercase tracking-widest text-primary mb-3">{badge.code}</span>
                <p className="text-sm text-white/50">{badge.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
