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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#1e293b]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Users className="text-[#facc15]" size={28} /> KULLANICI YÖNETİMİ & ROL MERKEZİ
          </h1>
          <p className="text-xs text-gray-300 font-bold uppercase tracking-wide mt-1">
            Habbo Zone topluluğundaki tüm üyeleri yönet, rütbeleri denetle ve arama yap.
          </p>
        </div>

        {/* Mini Stats Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
            <UserCheck className="text-[#3b82f6]" size={18} />
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">TOPLAM ÜYE</span>
              <span className="text-sm font-black text-white uppercase">{totalUsers}</span>
            </div>
          </div>

          <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
            <ShieldCheck className="text-[#facc15]" size={18} />
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">YETKİLİ EKİP</span>
              <span className="text-sm font-black text-[#facc15] uppercase">{staffCount}</span>
            </div>
          </div>

          <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
            <Sparkles className="text-cyan-400" size={18} />
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">VIP ÜYELER</span>
              <span className="text-sm font-black text-cyan-300 uppercase">{vipCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] p-4 rounded-[3px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        
        {/* Arama Kutusu */}
        <div className="relative w-full sm:w-[350px]">
          <input 
            type="text" 
            placeholder="KULLANICI ADI VEYA MOTTO ARA..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050a14] border border-[#1e293b] text-white pl-10 pr-4 py-2 rounded-[2px] text-xs outline-none focus:border-[#facc15] transition-colors placeholder:text-gray-500 font-bold uppercase tracking-wider"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400 hover:text-white"
            >
              TEMİZLE
            </button>
          )}
        </div>

        {/* Filtre Butonları */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          <button 
            onClick={() => setSelectedRole('all')}
            className={`px-3.5 py-2 rounded-[2px] font-black text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${selectedRole === 'all' ? 'bg-[#facc15] text-black shadow-lg shadow-yellow-400/20' : 'bg-[#050a14] text-gray-400 hover:text-white border border-[#1e293b]'}`}
          >
            TÜMÜ ({totalUsers})
          </button>
          <button 
            onClick={() => setSelectedRole('staff')}
            className={`px-3.5 py-2 rounded-[2px] font-black text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${selectedRole === 'staff' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-[#050a14] text-gray-400 hover:text-white border border-[#1e293b]'}`}
          >
            🛡️ YETKİLİ EKİP ({staffCount})
          </button>
          <button 
            onClick={() => setSelectedRole('vip')}
            className={`px-3.5 py-2 rounded-[2px] font-black text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${selectedRole === 'vip' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-[#050a14] text-gray-400 hover:text-white border border-[#1e293b]'}`}
          >
            💎 VIP ({vipCount})
          </button>
          <button 
            onClick={() => setSelectedRole('member')}
            className={`px-3.5 py-2 rounded-[2px] font-black text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${selectedRole === 'member' ? 'bg-[#3b82f6] text-white' : 'bg-[#050a14] text-gray-400 hover:text-white border border-[#1e293b]'}`}
          >
            👤 ÜYELER
          </button>
        </div>

      </div>

      {/* Kullanıcı Listesi Tablosu */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-[#1e293b] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">KULLANICI & HABBO ADI</th>
                <th className="px-5 py-3.5">MOTTO / DURUM</th>
                <th className="px-5 py-3.5">KAYIT TARİHİ</th>
                <th className="px-5 py-3.5 text-right">YETKİ VE RÜTBE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#050a14] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-11 h-11 rounded-[2px] bg-[#050a14] border border-[#1e293b] overflow-hidden shrink-0 flex items-center justify-center shadow">
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
                            className="font-black text-white hover:text-[#facc15] text-sm uppercase transition-colors flex items-center gap-1.5"
                          >
                            {u.username}
                          </Link>
                          {u.habbo_username && (
                            <span className="text-[11px] text-[#facc15]/90 font-bold block uppercase">
                              🎮 Habbo: {u.habbo_username}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-[280px]">
                      {u.motto ? (
                        <span className="inline-block px-2.5 py-1 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-[11px] text-gray-300 font-bold italic truncate max-w-full">
                          "{u.motto}"
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[11px] font-bold uppercase">- MOTTO YOK -</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[11px] font-bold text-gray-400 flex items-center gap-1.5 mt-3">
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
