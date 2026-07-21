'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Save, User, Award } from 'lucide-react';
import Link from 'next/link';

export default function AssignBadgePage() {
  const router = useRouter();
  const supabase = createClient();

  const [badges, setBadges] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [badgesRes, profilesRes] = await Promise.all([
      supabase.from('badges').select('*').order('name'),
      supabase.from('profiles').select('id, username').order('username')
    ]);

    if (badgesRes.data) {
      setBadges(badgesRes.data);
      if (badgesRes.data.length > 0) setSelectedBadgeId(badgesRes.data[0].id);
    }
    
    if (profilesRes.data) {
      setProfiles(profilesRes.data);
      if (profilesRes.data.length > 0) setSelectedUserId(profilesRes.data[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('user_badges')
        .insert({
          user_id: selectedUserId,
          badge_id: selectedBadgeId,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('Bu kullanıcı zaten bu rozete sahip.');
        }
        throw insertError;
      }

      router.push('/admin/badges');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/badges" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Kullanıcıya Rozet Ver</h2>
          <p className="text-white/60">Bir oyuncuyu seçip ona rozet atayabilirsiniz.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-bold mb-2 opacity-80 uppercase flex items-center gap-2"><User size={16}/> Kullanıcı (Oyuncu)</label>
            <select
              required
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.username}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold mb-2 opacity-80 uppercase flex items-center gap-2"><Award size={16}/> Verilecek Rozet</label>
            <select
              required
              value={selectedBadgeId}
              onChange={(e) => setSelectedBadgeId(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
            >
              {badges.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || badges.length === 0 || profiles.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest pixel-borders hover:bg-primary/90 transition-colors disabled:opacity-50 text-lg shadow-xl shadow-primary/20"
        >
          {loading ? 'İşleniyor...' : <><Save size={24} /> Rozeti Teslim Et</>}
        </button>
      </form>
    </div>
  );
}
