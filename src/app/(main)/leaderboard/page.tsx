import { createClient } from '@/utils/supabase/server';
import { Trophy, Star, TrendingUp, Users, Coins } from 'lucide-react';
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
      <div className="habbo-box bg-white overflow-hidden relative text-center">
        <div className="habbo-box-header green">
          Topluluk Sıralamaları
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-r from-green-50 to-emerald-100 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Trophy size={150} className="text-green-600" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-green-200">
                    <Trophy size={32} className="text-green-500 drop-shadow-sm" />
                </div>
                
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    Liderlik Tablosu
                </h1>
                
                <p className="text-sm text-gray-600 font-medium max-w-lg mx-auto">
                    HabboZone'un en öne çıkan isimleri, en çok puana sahip oyuncular, yeni katılanlar ve efsaneler burada!
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Points Users */}
        <div className="habbo-box bg-white">
          <div className="habbo-box-header blue flex items-center gap-2">
            <Coins size={16} /> En Çok Puanı Olanlar
          </div>
          
          <div className="p-4 bg-gray-50 space-y-2">
            {topPointsUsers?.map((user, index) => (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className="flex items-center gap-4 p-3 rounded bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-colors shadow-sm group"
              >
                <div className="w-8 text-center font-black text-xl text-gray-300 group-hover:text-blue-500 transition-colors">
                  #{index + 1}
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={2} direction={2} size="m" className="-mt-2 w-12 h-12" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-800 group-hover:text-blue-700 transition-colors">{user.username}</div>
                  <div className="text-[10px] text-gray-500 font-bold bg-yellow-100 border border-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded inline-block mt-0.5 shadow-sm">
                      {user.hz_points || 0} HZ Puanı
                  </div>
                </div>
              </Link>
            ))}
            
            {(!topPointsUsers || topPointsUsers.length === 0) && (
              <div className="text-center py-6 text-gray-400 text-xs font-bold border border-gray-200 rounded bg-white">Sıralama bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Newest Users */}
        <div className="habbo-box bg-white">
          <div className="habbo-box-header dark flex items-center gap-2">
            <Users size={16} /> En Yeni Üyeler
          </div>
          
          <div className="p-4 bg-gray-50 space-y-2">
            {newestUsers?.map((user, index) => (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className="flex items-center gap-4 p-3 rounded bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-400 transition-colors shadow-sm group"
              >
                <div className="w-8 text-center font-black text-xl text-gray-300 group-hover:text-gray-600 transition-colors">
                  #{index + 1}
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={2} direction={2} size="m" className="-mt-2 w-12 h-12" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-800 group-hover:text-black transition-colors">{user.username}</div>
                  <div className="text-[10px] text-gray-500 font-medium">{new Date(user.created_at).toLocaleDateString('tr-TR')} tarihinde katıldı</div>
                </div>
              </Link>
            ))}
            
            {(!newestUsers || newestUsers.length === 0) && (
              <div className="text-center py-6 text-gray-400 text-xs font-bold border border-gray-200 rounded bg-white">Kayıtlı üye bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Staff / VIPs */}
        <div className="md:col-span-2 habbo-box bg-white">
          <div className="habbo-box-header orange flex items-center gap-2">
            <Star size={16} /> Öne Çıkan Ekip
          </div>
          
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {staffMembers?.map((user, index) => (
                <Link 
                    href={`/profile/${user.username}`} 
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 transition-colors shadow-sm group"
                >
                    <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    <HabboAvatar username={user.habbo_username || 'Habbo'} headDirection={3} direction={3} size="m" action="wlk" className="-mt-2 w-12 h-12" />
                    </div>
                    <div>
                    <div className="font-bold text-sm text-gray-800 group-hover:text-orange-600 transition-colors">{user.username}</div>
                    <div className="text-[9px] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded shadow-sm inline-block mt-0.5 text-gray-600 font-bold uppercase tracking-widest">{user.role}</div>
                    </div>
                </Link>
                ))}
            </div>
            
            {(!staffMembers || staffMembers.length === 0) && (
              <div className="text-center py-6 text-gray-400 text-xs font-bold border border-gray-200 rounded bg-white">Kayıtlı ekip üyesi bulunamadı.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
