import { createClient } from '@/utils/supabase/server';
import { Trophy, Star, TrendingUp, Users, Coins, Crown, Sparkles } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';
import Link from 'next/link';

export const metadata = {
  title: 'Liderlik Tablosu | HabboZone',
  description: 'HabboZone liderlik tablosu, en aktif üyeler, en çok puanı olanlar ve en yeniler.',
};

export const revalidate = 60;

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Fetch newest users
  const { data: newestUsers } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, role, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  // Fetch top users by points
  const { data: topPointsUsers } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, role, hz_points')
    .order('hz_points', { ascending: false })
    .limit(10);

  // Fetch staff members for a "Top Staff" or similar section
  const { data: staffMembers } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, role')
    .in('role', ['Owner', 'Developer', 'Administrator', 'Moderator', 'Editor', 'Journalist'])
    .limit(10);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box overflow-hidden relative text-center border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header flex items-center justify-center gap-2" style={{backgroundColor: '#15803d', borderBottomColor: '#166534'}}>
          <Trophy size={18} /> Topluluk Şampiyonları & Liderlik Arenası
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-br from-[#0a1224] via-[#05131a] to-[#070c18] flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <Trophy size={240} className="text-emerald-500" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Crown size={14} className="text-yellow-400 animate-bounce" /> HabboZone Şeref Kürsüsü
                </div>
                
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Liderlik Tablosu
                </h1>
                
                <p className="text-sm text-gray-300 font-medium max-w-lg mx-auto leading-relaxed">
                    HabboZone'un en öne çıkan elit isimleri, en çok HZ puana sahip şampiyonlar, aramıza yeni katılan oyuncular ve efsaneler burada!
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Points Users */}
        <div className="habbo-box overflow-hidden border-2 border-white/10 shadow-2xl">
          <div className="habbo-box-header blue flex items-center justify-between">
            <span className="flex items-center gap-2"><Coins size={16} className="text-yellow-400" /> En Çok HZ Puanı Olanlar</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-black uppercase">Top 10</span>
          </div>
          
          <div className="p-4 bg-[#070c18]/90 space-y-2.5">
            {topPointsUsers?.map((user, index) => {
              const isTop1 = index === 0;
              const isTop2 = index === 1;
              const isTop3 = index === 2;
              
              return (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 shadow-lg group ${
                  isTop1 ? 'bg-gradient-to-r from-yellow-950/40 via-[#0a1325]/90 to-[#0a1325]/80 border-2 border-yellow-500/50 hover:border-yellow-400' :
                  isTop2 ? 'bg-gradient-to-r from-slate-800/40 via-[#0a1325]/90 to-[#0a1325]/80 border border-slate-400/40 hover:border-slate-300' :
                  isTop3 ? 'bg-gradient-to-r from-amber-950/40 via-[#0a1325]/90 to-[#0a1325]/80 border border-amber-600/40 hover:border-amber-500' :
                  'bg-[#0a1325]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0f1d38]'
                }`}
              >
                <div className={`w-8 text-center font-black text-xl transition-colors ${
                  isTop1 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' :
                  isTop2 ? 'text-slate-300' :
                  isTop3 ? 'text-amber-500' :
                  'text-gray-500 group-hover:text-blue-400'
                }`}>
                  #{index + 1}
                </div>
                <div className="w-12 h-12 bg-[#050b14]/90 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-inner group-hover:border-blue-500/30">
                  <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={2} direction={2} size="m" className="-mt-2 w-12 h-12" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    {user.username}
                    {isTop1 && <Crown size={14} className="text-yellow-400 inline" />}
                  </div>
                  <div className="text-[10px] text-yellow-400 font-bold bg-yellow-950/60 border border-yellow-500/30 px-2 py-0.5 rounded inline-flex items-center gap-1 mt-1 shadow-sm">
                      <Coins size={10} /> {user.hz_points || 0} HZ Puanı
                  </div>
                </div>
              </Link>
            )})}
            
            {(!topPointsUsers || topPointsUsers.length === 0) && (
              <div className="text-center py-8 text-gray-400 text-xs font-bold border border-white/10 rounded-xl bg-[#0a1325]/60">Sıralama bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Newest Users */}
        <div className="habbo-box overflow-hidden border-2 border-white/10 shadow-2xl">
          <div className="habbo-box-header dark flex items-center justify-between">
            <span className="flex items-center gap-2"><Users size={16} className="text-emerald-400" /> En Yeni Üyeler</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-black uppercase">Hoş Geldiniz</span>
          </div>
          
          <div className="p-4 bg-[#070c18]/90 space-y-2.5">
            {newestUsers?.map((user, index) => (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-[#0a1325]/80 hover:bg-[#0f1d38] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-lg group"
              >
                <div className="w-8 text-center font-black text-xl text-gray-500 group-hover:text-emerald-400 transition-colors">
                  #{index + 1}
                </div>
                <div className="w-12 h-12 bg-[#050b14]/90 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-inner group-hover:border-emerald-500/30">
                  <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={2} direction={2} size="m" className="-mt-2 w-12 h-12" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{user.username}</div>
                  <div className="text-[10px] text-gray-400 font-medium mt-0.5">{new Date(user.created_at).toLocaleDateString('tr-TR')} tarihinde katıldı</div>
                </div>
              </Link>
            ))}
            
            {(!newestUsers || newestUsers.length === 0) && (
              <div className="text-center py-8 text-gray-400 text-xs font-bold border border-white/10 rounded-xl bg-[#0a1325]/60">Kayıtlı üye bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Staff / VIPs */}
        <div className="md:col-span-2 habbo-box overflow-hidden border-2 border-white/10 shadow-2xl">
          <div className="habbo-box-header orange flex items-center justify-between">
            <span className="flex items-center gap-2"><Star size={16} className="text-yellow-300" /> Öne Çıkan Yönetim & Ekip Üyeleri</span>
            <span className="text-[10px] bg-orange-500/20 text-orange-200 border border-orange-500/30 px-2.5 py-0.5 rounded font-black uppercase">HabboZone Ekibi</span>
          </div>
          
          <div className="p-6 bg-[#070c18]/90">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {staffMembers?.map((user) => (
                <Link 
                    href={`/profile/${user.username}`} 
                    key={user.id}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0a1325]/80 hover:bg-[#0f1d38] border border-white/10 hover:border-orange-500/50 transition-all duration-300 shadow-xl group"
                >
                    <div className="w-12 h-12 bg-[#050b14]/90 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-inner group-hover:border-orange-500/30">
                    <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={3} direction={3} size="m" action="wlk" className="-mt-2 w-12 h-12" />
                    </div>
                    <div>
                    <div className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors flex items-center gap-1">
                      {user.username}
                    </div>
                    <div className="text-[9px] bg-orange-950/60 border border-orange-500/30 px-2 py-0.5 rounded shadow-sm inline-block mt-1 text-orange-400 font-bold uppercase tracking-widest">{user.role}</div>
                    </div>
                </Link>
                ))}
            </div>
            
            {(!staffMembers || staffMembers.length === 0) && (
              <div className="text-center py-8 text-gray-400 text-xs font-bold border border-white/10 rounded-xl bg-[#0a1325]/60">Kayıtlı ekip üyesi bulunamadı.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

