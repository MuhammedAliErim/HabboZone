'use client';

import { useState } from 'react';
import Image from 'next/image';
import RoleSelect from './_components/RoleSelect';
import { Users, Search, Filter, ShieldCheck, Crown, Sparkles, UserCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

type UserProfile = {
  id: string;
  username: string;
  habbo_username?: string;
  avatar_url?: string;
  motto?: string;
  role?: string;
  created_at: string;
};

export default function UsersClient({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Filtreleme mantığı
  const filteredUsers = initialUsers.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.habbo_username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.motto?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = 
      selectedRole === 'all' || 
      (selectedRole === 'staff' && ['Owner', 'Developer', 'Administrator', 'Moderator'].includes(user.role || '')) ||
      (selectedRole === 'vip' && user.role === 'VIP') ||
      (selectedRole === 'member' && (!user.role || user.role === 'Member'));

    return matchesSearch && matchesRole;
  });

  // İstatistikler
  const totalUsers = initialUsers.length;
  const staffCount = initialUsers.filter(u => ['Owner', 'Developer', 'Administrator', 'Moderator'].includes(u.role || '')).length;
  const vipCount = initialUsers.filter(u => u.role === 'VIP').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık & İstatistik Kartları */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="text-yellow-400" size={32} /> KULLANICI YÖNETİMİ & ROL MERKEZİ
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Habbo Zone topluluğundaki tüm üyeleri yönet, rütbeleri denetle ve arama yap.
          </p>
        </div>

        {/* Mini Stats Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <UserCheck className="text-blue-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Toplam Üye</span>
              <span className="text-base font-black text-white">{totalUsers}</span>
            </div>
          </div>

          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <ShieldCheck className="text-amber-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Yetkili Ekip</span>
              <span className="text-base font-black text-amber-300">{staffCount}</span>
            </div>
          </div>

          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <Sparkles className="text-cyan-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">VIP Üyeler</span>
              <span className="text-base font-black text-cyan-300">{vipCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        
        {/* Arama Kutusu */}
        <div className="relative w-full sm:w-[350px]">
          <input 
            type="text" 
            placeholder="Kullanıcı adı, Habbo adı veya motto ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050a14] border-2 border-white/15 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-yellow-400 transition-colors placeholder:text-gray-500 font-medium"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Filtre Butonları */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          <button 
            onClick={() => setSelectedRole('all')}
            className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${selectedRole === 'all' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 font-black' : 'bg-black/40 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
          >
            Tümü ({totalUsers})
          </button>
          <button 
            onClick={() => setSelectedRole('staff')}
            className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${selectedRole === 'staff' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-black' : 'bg-black/40 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
          >
            🛡️ Yetkili Ekip ({staffCount})
          </button>
          <button 
            onClick={() => setSelectedRole('vip')}
            className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${selectedRole === 'vip' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-black' : 'bg-black/40 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
          >
            💎 VIP ({vipCount})
          </button>
          <button 
            onClick={() => setSelectedRole('member')}
            className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${selectedRole === 'member' ? 'bg-slate-700 text-white font-black' : 'bg-black/40 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
          >
            👤 Üyeler
          </button>
        </div>

      </div>

      {/* Kullanıcı Listesi Tablosu */}
      <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-white/10">
              <tr>
                <th className="px-6 py-4">KULLANICI & HABBO ADI</th>
                <th className="px-6 py-4">MOTTO / DURUM</th>
                <th className="px-6 py-4">KAYIT TARİHİ</th>
                <th className="px-6 py-4 text-right">YETKİ VE RÜTBE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl bg-[#050a14] border-2 border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                          <Image 
                            src={u.avatar_url || `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${u.habbo_username || u.username}&action=std&direction=2&head_direction=2&gesture=sml&size=m`} 
                            alt={u.username || 'User'} 
                            width={48}
                            height={48}
                            className="pixelated object-contain scale-110 mt-2"
                            unoptimized
                          />
                        </div>
                        <div>
                          <Link 
                            href={`/profile/${u.username}`} 
                            target="_blank"
                            className="font-black text-white hover:text-yellow-400 text-base transition-colors flex items-center gap-1.5"
                          >
                            {u.username}
                          </Link>
                          {u.habbo_username && (
                            <span className="text-xs text-yellow-400/90 font-medium block">
                              🎮 Habbo: {u.habbo_username}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[280px]">
                      {u.motto ? (
                        <span className="inline-block px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-300 italic truncate max-w-full">
                          "{u.motto}"
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">- motto yok -</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 flex items-center gap-1.5 mt-3">
                      <Calendar size={14} className="text-gray-500" />
                      {new Date(u.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <RoleSelect userId={u.id} currentRole={u.role || 'Member'} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="max-w-xs mx-auto text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                        <Search size={24} />
                      </div>
                      <p className="text-gray-400 font-bold">Kriterlere uygun kullanıcı bulunamadı.</p>
                      <button 
                        onClick={() => { setSearchTerm(''); setSelectedRole('all'); }}
                        className="text-xs text-yellow-400 hover:underline font-bold"
                      >
                        Tüm filtreleri temizle
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
