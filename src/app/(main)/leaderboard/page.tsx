import { createClient } from '@/utils/supabase/server';
import { Trophy, Star, TrendingUp, Users } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';
import Link from 'next/link';

export const metadata = {
  title: 'Liderlik Tablosu | HabboZone',
  description: 'HabboZone liderlik tablosu, en aktif üyeler ve en yeniler.',
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

  // Fetch staff members for a "Top Staff" or similar section
  const { data: staffMembers } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, role')
    .in('role', ['Owner', 'Developer', 'Administrator', 'Moderator', 'Editor', 'Journalist'])
    .limit(10);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 via-green-900/40 to-teal-900/40 border border-emerald-500/30 p-8 md:p-16 text-center">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Trophy size={300} className="text-emerald-500" />
        </div>
        <div className="absolute top-0 left-0 p-8 opacity-10 pointer-events-none">
          <TrendingUp size={300} className="text-emerald-500" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(52,211,153,0.5)] border-4 border-emerald-200">
            <Trophy size={40} className="text-white drop-shadow-md" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-500 drop-shadow-sm">
            Liderlik Tablosu
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-100/80 font-medium">
            HabboZone'un en öne çıkan isimleri, yeni katılanlar ve efsaneler burada!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Newest Users */}
        <div className="bg-black/20 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Users size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-blue-100">En Yeni Üyeler</h2>
          </div>
          
          <div className="space-y-4">
            {newestUsers?.map((user, index) => (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-10 text-center font-black text-2xl text-white/20 group-hover:text-blue-400 transition-colors">
                  #{index + 1}
                </div>
                <div className="w-14 h-14 bg-black/40 rounded-full overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                  <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={2} direction={2} size="m" className="-mt-4 w-16 h-16" />
                </div>
                <div>
                  <div className="font-bold text-lg group-hover:text-blue-300 transition-colors">{user.username}</div>
                  <div className="text-xs text-white/50">{new Date(user.created_at).toLocaleDateString('tr-TR')} tarihinde katıldı</div>
                </div>
              </Link>
            ))}
            
            {(!newestUsers || newestUsers.length === 0) && (
              <div className="text-center py-8 text-white/50">Kayıtlı üye bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Staff / VIPs */}
        <div className="bg-black/20 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl">
              <Star size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-yellow-100">Öne Çıkan Ekip</h2>
          </div>
          
          <div className="space-y-4">
            {staffMembers?.map((user, index) => (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-yellow-500/30 transition-all group"
              >
                <div className="w-10 text-center font-black text-2xl text-white/20 group-hover:text-yellow-400 transition-colors">
                  #{index + 1}
                </div>
                <div className="w-14 h-14 bg-black/40 rounded-full overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                  <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={3} direction={3} size="m" action="wlk" className="-mt-4 w-16 h-16" />
                </div>
                <div>
                  <div className="font-bold text-lg group-hover:text-yellow-300 transition-colors">{user.username}</div>
                  <div className="text-xs bg-white/10 px-2 py-0.5 rounded-full inline-block mt-1 text-white/70 font-medium">{user.role}</div>
                </div>
              </Link>
            ))}
            
            {(!staffMembers || staffMembers.length === 0) && (
              <div className="text-center py-8 text-white/50">Kayıtlı ekip üyesi bulunamadı.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
