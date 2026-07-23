'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto py-8 px-4 w-full space-y-6">
      
      {/* Search Header Box */}
      <div className="habbo-box bg-white">
        <div className="habbo-box-header blue flex items-center justify-center gap-2">
            <Search size={16} /> Habbo Profil Arama
        </div>
        <div className="p-8 bg-gray-50 flex flex-col items-center text-center border-b border-gray-200">
            <p className="text-gray-600 font-medium text-sm mb-6 max-w-md">
            Habbo Türkiye sunucusundaki herhangi bir oyuncunun profiline göz at! Habbo adını yaz ve ara.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
                <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Habbo Kullanıcı Adı..."
                className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 outline-none focus:border-blue-500 transition-colors text-sm font-bold shadow-inner text-gray-800"
                />
                <button 
                type="submit"
                disabled={loading}
                className="habbo-button blue px-8 py-2 w-full sm:w-auto"
                >
                {loading ? 'Aranıyor...' : 'Ara'}
                </button>
            </form>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded text-center text-sm font-bold shadow-sm">
          {error === 'User not found' ? 'Kullanıcı bulunamadı veya profili gizli.' : error}
        </div>
      )}

      {/* User Profile Box */}
      {user && (
        <div className="habbo-box bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="habbo-box-header dark">
            {user.name} Profil Bilgileri
          </div>
          
          <div className="p-6 md:p-10 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                {/* Avatar */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${user.name}&direction=2&head_direction=3&gesture=sml&size=l`}
                    alt={user.name}
                    className="mt-6 scale-110 relative z-10 filter drop-shadow-md"
                />
                </div>

                {/* Info */}
                <div className="text-center md:text-left flex-1 space-y-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 flex flex-col md:flex-row items-center gap-2 mb-1">
                    {user.name}
                    {user.profileVisible && (
                        <span className="text-[9px] bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded shadow-sm uppercase tracking-widest">
                            Profil Açık
                        </span>
                    )}
                    </h2>
                    <div className="text-sm text-gray-500 italic bg-white p-2 rounded border border-gray-100 shadow-inner inline-block">
                    "{user.motto || 'Motto yok.'}"
                    </div>
                </div>

                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                    <span>Kayıt Tarihi:</span>
                    <span className="text-gray-600">{new Date(user.memberSince).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                {/* Badges */}
                {user.selectedBadges && user.selectedBadges.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-3 text-gray-500">
                        Takılı Rozetler
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {user.selectedBadges.map((badge) => (
                        <div 
                            key={badge.badgeIndex}
                            className="bg-white p-2 rounded border border-gray-200 shadow-sm relative group hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                            src={`https://images.habbo.com/c_images/album1584/${badge.code}.png`} 
                            alt={badge.name}
                            className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-[10px] px-2 py-1.5 rounded w-max max-w-[200px] text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-md">
                            <strong className="block mb-0.5">{badge.name}</strong>
                            <span className="opacity-80 leading-tight">{badge.description}</span>
                            {/* Tooltip arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                )}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
