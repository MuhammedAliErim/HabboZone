'use client';

import { useState } from 'react';

interface HabboUser {
  uniqueId: string;
  name: string;
  figureString: string;
  motto: string;
  memberSince: string;
  profileVisible: boolean;
  selectedBadges: Array<{
    badgeIndex: number;
    code: string;
    name: string;
    description: string;
  }>;
}

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<HabboUser | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setUser(null);

    try {
      const res = await fetch(`/api/habbo/user?name=${encodeURIComponent(username.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setUser(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 w-full">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-4">
          Habbo Profil Arama
        </h1>
        <p className="opacity-80">
          Habbo Türkiye sunucusundaki herhangi bir oyuncunun profiline göz at!
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex gap-4 mb-12 max-w-lg mx-auto">
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Habbo kullanıcı adı..."
          className="flex-1 bg-white/10 dark:bg-black/20 border-2 border-white/30 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-lg"
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-primary text-white font-bold uppercase tracking-widest px-8 py-3 rounded-lg pixel-borders hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Aranıyor...' : 'Ara'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 text-red-700 dark:text-red-200 p-4 rounded-lg text-center font-bold pixel-borders mb-8 max-w-lg mx-auto">
          {error === 'User not found' ? 'Kullanıcı bulunamadı veya profili gizli.' : error}
        </div>
      )}

      {user && (
        <div className="bg-white/10 dark:bg-black/20 border-4 border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Background for Avatar */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            {/* Avatar */}
            <div className="w-48 h-48 rounded-full bg-black/10 border-4 border-white/30 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${user.name}&direction=2&head_direction=3&gesture=sml&size=l`}
                alt={user.name}
                className="mt-6 scale-125"
              />
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-4xl font-black mb-2 flex items-center justify-center md:justify-start gap-3">
                {user.name}
                {user.profileVisible && (
                  <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/50 px-2 py-1 rounded-md pixel-borders">Profil Açık</span>
                )}
              </h2>
              <div className="text-xl opacity-90 italic mb-4">
                "{user.motto || 'Motto yok.'}"
              </div>
              <div className="opacity-60 text-sm mb-6">
                Kayıt Tarihi: {new Date(user.memberSince).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>

              {/* Badges */}
              {user.selectedBadges && user.selectedBadges.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-3 opacity-80 border-b-2 border-black/10 dark:border-white/10 pb-2 inline-block">
                    Takılı Rozetler
                  </h3>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {user.selectedBadges.map((badge) => (
                      <div 
                        key={badge.badgeIndex}
                        className="bg-black/10 p-2 rounded-lg border border-white/20 shadow-sm relative group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`https://images.habbo.com/c_images/album1584/${badge.code}.png`} 
                          alt={badge.name}
                          className="w-10 h-10 object-contain drop-shadow-md"
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded w-max max-w-[200px] text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          <strong>{badge.name}</strong>
                          <br />
                          {badge.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
