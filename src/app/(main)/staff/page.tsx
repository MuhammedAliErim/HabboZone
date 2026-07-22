import { createClient } from '@/utils/supabase/server';
import { Users, Shield, Radio, PenTool } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';
import Link from 'next/link';

export const revalidate = 60;

export default async function StaffPage() {
  const supabase = await createClient();

  type Profile = {
    id: string;
    username: string;
    habbo_username: string;
    motto: string;
    role: string;
  };

  type StaffMember = {
    id: string;
    position: string;
    order_index: number;
    profiles: Profile;
  };

  const { data } = await supabase
    .from('staff')
    .select(`
      id,
      position,
      order_index,
      profiles:user_id (
        id,
        username,
        habbo_username,
        motto,
        role
      )
    `)
    .order('order_index', { ascending: true });

  const staffMembers = data as unknown as StaffMember[];

  // Fallback data if no staff configured
  const displayStaff = staffMembers && staffMembers.length > 0 ? staffMembers : [];

  // Group staff by roles (using profile.role for categorization)
  const groupedStaff = {
    'Yönetim': displayStaff.filter(s => ['Owner', 'Developer', 'Administrator'].includes(s.profiles?.role)),
    'Moderasyon': displayStaff.filter(s => s.profiles?.role === 'Moderator'),
    'İçerik Ekibi': displayStaff.filter(s => ['Editor', 'Journalist'].includes(s.profiles?.role)),
    'Diğer Ekip Üyeleri': displayStaff.filter(s => !['Owner', 'Developer', 'Administrator', 'Moderator', 'Editor', 'Journalist'].includes(s.profiles?.role)),
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'Yönetim': return <Shield className="text-red-400" size={24} />;
      case 'Moderasyon': return <Shield className="text-blue-400" size={24} />;
      case 'İçerik Ekibi': return <PenTool className="text-green-400" size={24} />;
      default: return <Users className="text-gray-400" size={24} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Users size={200} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)]" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Site Kadrosu
          </h1>
          <p className="text-lg text-white/70 font-medium">
            HabboZone'un arkasındaki özverili ve yetenekli ekip üyelerimizle tanışın.
          </p>
        </div>
      </div>

      {Object.entries(groupedStaff).map(([groupName, members]) => {
        if (members.length === 0) return null;

        return (
          <div key={groupName} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                {getRoleIcon(groupName)}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest">{groupName}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((staff) => (
                <Link 
                  key={staff.id} 
                  href={`/profile/${staff.profiles?.username}`}
                  className="group relative overflow-hidden bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1 shadow-xl hover:shadow-primary/20 flex flex-col items-center text-center"
                >
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/5 to-transparent -z-10" />
                  
                  <div className="h-32 w-full flex justify-center mb-4 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                    <HabboAvatar 
                      username={staff.profiles?.habbo_username || 'Habbo'} 
                      size="l"
                      direction={4}
                      headDirection={4}
                      action="std"
                      className="drop-shadow-2xl h-48 -mt-8"
                    />
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
                    {staff.profiles?.username}
                  </h3>
                  
                  <div className="mt-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-white/5 text-white/70">
                    {staff.position}
                  </div>
                  
                  {staff.profiles?.motto && (
                    <p className="mt-4 text-sm text-white/50 italic line-clamp-2">
                      &ldquo;{staff.profiles.motto}&rdquo;
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {displayStaff.length === 0 && (
        <div className="text-center py-20 bg-black/20 border border-white/5 rounded-2xl">
          <Users size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-white/50">Henüz ekip üyesi eklenmedi</h3>
        </div>
      )}

    </div>
  );
}
