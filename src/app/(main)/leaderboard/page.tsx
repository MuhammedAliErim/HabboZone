import { createClient } from '@/utils/supabase/server';
import { Trophy, Star, Users, Coins } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';
import Link from 'next/link';

export const metadata = {
  title: 'Liderlik Tablosu | HabboZone',
  description: 'HabboZone liderlik tablosu, en aktif üyeler, en çok puanı olanlar ve en yeniler.',
};

export const revalidate = 60;

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: newestUsers } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, role, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: topPointsUsers } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, role, hz_points')
    .order('hz_points', { ascending: false })
    .limit(10);

  const { data: staffMembers } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, role')
    .in('role', ['Owner', 'Developer', 'Administrator', 'Moderator', 'Editor', 'Journalist'])
    .limit(10);

  const formatDeterministicDate = (dateStr?: string) => {
    if (!dateStr) return '26.07.2026';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* AUTHENTIC HABBO HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#16a34a] text-white px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#15803d]">LİDERLİK TABLOSU</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Şeref Kürsüsü</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
            HABBOZONE LİDERLERİ
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            HabboZone'un en öne çıkan elit isimleri, en çok HZ puana sahip şampiyonlar, aramıza yeni katılan oyuncular ve yönetim ekibi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Points Users */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
            <div className="flex items-center gap-2">
              <Coins size={16} className="text-[#facc15]" />
              <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">EN ÇOK HZ PUANI OLANLAR</h2>
            </div>
            <span className="text-gray-400 text-[11px] font-bold uppercase">TOP 10</span>
          </div>

          <div className="habbo-box p-3 bg-[#0a1325] flex flex-col gap-2">
            {topPointsUsers?.map((user, index) => {
              const isTop1 = index === 0;
              
              return (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className={`p-2.5 rounded-[3px] flex items-center justify-between transition-colors ${
                  isTop1 ? 'bg-[#1e293b] border border-[#facc15]' : 'bg-[#050a14] hover:bg-[#1e293b] border border-[#1e293b]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 text-center font-black text-sm ${isTop1 ? 'text-[#facc15]' : 'text-gray-400'}`}>
                    #{index + 1}
                  </span>
                  
                  <div className="w-10 h-10 bg-[#0a1325] rounded-[2px] border border-[#1e293b] overflow-hidden flex items-center justify-center shrink-0">
                    <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={2} direction={2} size="m" className="-mt-1 w-8 h-8" />
                  </div>
                  
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate">
                      {user.username}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      @{user.habbo_username || user.username}
                    </div>
                  </div>
                </div>

                <div className="bg-[#facc15] text-black font-black text-[11px] px-2 py-0.5 rounded-[2px] shrink-0 uppercase">
                  {user.hz_points || 0} HZ
                </div>
              </Link>
            )})}
            
            {(!topPointsUsers || topPointsUsers.length === 0) && (
              <div className="text-center py-6 text-gray-400 text-xs font-bold">Sıralama bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Newest Users */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#facc15]" />
              <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">EN YENİ ÜYELER</h2>
            </div>
            <span className="text-gray-400 text-[11px] font-bold uppercase">HOŞ GELDİNİZ</span>
          </div>

          <div className="habbo-box p-3 bg-[#0a1325] flex flex-col gap-2">
            {newestUsers?.map((user, index) => (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className="p-2.5 rounded-[3px] bg-[#050a14] hover:bg-[#1e293b] border border-[#1e293b] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center font-black text-sm text-gray-400">
                    #{index + 1}
                  </span>
                  
                  <div className="w-10 h-10 bg-[#0a1325] rounded-[2px] border border-[#1e293b] overflow-hidden flex items-center justify-center shrink-0">
                    <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={2} direction={2} size="m" className="-mt-1 w-8 h-8" />
                  </div>
                  
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate">{user.username}</div>
                    <div className="text-[10px] text-gray-400 font-medium">Katılım: {formatDeterministicDate(user.created_at)}</div>
                  </div>
                </div>

                <span className="bg-[#3b82f6] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase">
                  Yeni
                </span>
              </Link>
            ))}
            
            {(!newestUsers || newestUsers.length === 0) && (
              <div className="text-center py-6 text-gray-400 text-xs font-bold">Kayıtlı üye bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Staff Members */}
        <div className="md:col-span-2 flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-[#facc15]" />
              <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">HABBOZONE YÖNETİM & EKİP ÜYELERİ</h2>
            </div>
          </div>

          <div className="habbo-box p-4 bg-[#0a1325]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {staffMembers?.map((user) => (
                <Link 
                  href={`/profile/${user.username}`} 
                  key={user.id}
                  className="p-3 bg-[#050a14] hover:bg-[#1e293b] border border-[#1e293b] rounded-[3px] flex items-center gap-3 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#0a1325] rounded-[2px] border border-[#1e293b] overflow-hidden flex items-center justify-center shrink-0">
                    <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={3} direction={3} size="m" action="wlk" className="-mt-1 w-10 h-10" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-white truncate">{user.username}</div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-black bg-[#facc15] px-1.5 py-0.5 rounded-[2px] inline-block mt-1">{user.role}</div>
                  </div>
                </Link>
              ))}
            </div>
            
            {(!staffMembers || staffMembers.length === 0) && (
              <div className="text-center py-6 text-gray-400 text-xs font-bold">Kayıtlı ekip üyesi bulunamadı.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
