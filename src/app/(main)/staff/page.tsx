import { createClient } from '@/utils/supabase/server';
import { Users, Shield, PenTool } from 'lucide-react';
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
      case 'Yönetim': return <Shield size={16} />;
      case 'Moderasyon': return <Shield size={16} />;
      case 'İçerik Ekibi': return <PenTool size={16} />;
      default: return <Users size={16} />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Yönetim': return 'red';
      case 'Moderasyon': return 'blue';
      case 'İçerik Ekibi': return 'green';
      default: return 'dark';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box bg-white overflow-hidden relative text-center">
        <div className="habbo-box-header blue">
          Otel Kadrosu
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Users size={150} className="text-blue-600" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    Site Kadrosu
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                    HabboZone'un arkasındaki özverili ve yetenekli ekip üyelerimizle tanışın.
                </p>
            </div>
        </div>
      </div>

      {Object.entries(groupedStaff).map(([groupName, members]) => {
        if (members.length === 0) return null;

        return (
          <div key={groupName} className="habbo-box bg-white">
            <div className={`habbo-box-header ${getRoleColor(groupName)} flex items-center gap-2`}>
                {getRoleIcon(groupName)}
                {groupName}
            </div>

            <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map((staff) => (
                    <Link 
                    key={staff.id} 
                    href={`/profile/${staff.profiles?.username}`}
                    className="group bg-white border border-gray-200 rounded p-4 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm flex flex-col items-center text-center relative overflow-hidden"
                    >
                    <div className="absolute top-0 left-0 w-full h-16 bg-gray-100 border-b border-gray-200 z-0 group-hover:bg-blue-100 transition-colors" />
                    
                    <div className="h-24 w-full flex justify-center mb-2 relative z-10 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        <HabboAvatar 
                        username={staff.profiles?.habbo_username || 'Habbo'} 
                        size="l"
                        direction={4}
                        headDirection={4}
                        action="std"
                        className="drop-shadow-md h-40 -mt-6"
                        />
                    </div>

                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 group-hover:text-blue-700 transition-colors mt-2">
                        {staff.profiles?.username}
                    </h3>
                    
                    <div className="mt-1 bg-gray-100 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-gray-200 text-gray-600 shadow-sm">
                        {staff.position}
                    </div>
                    
                    {staff.profiles?.motto && (
                        <p className="mt-3 text-[10px] text-gray-500 italic bg-gray-50 border border-gray-100 p-2 rounded w-full shadow-inner truncate">
                        &ldquo;{staff.profiles.motto}&rdquo;
                        </p>
                    )}
                    </Link>
                ))}
                </div>
            </div>
          </div>
        );
      })}

      {displayStaff.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded shadow-sm">
          <Users size={48} className="mx-auto text-gray-300 mb-2" />
          <h3 className="text-sm font-bold text-gray-700">Henüz ekip üyesi eklenmedi</h3>
        </div>
      )}

    </div>
  );
}
