import { createClient } from '@/utils/supabase/server';
import { Users, Shield, PenTool, Award, Sparkles } from 'lucide-react';
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
    'Yönetim & Kurucular': displayStaff.filter(s => ['Owner', 'Developer', 'Administrator'].includes(s.profiles?.role)),
    'Moderasyon & Denetim': displayStaff.filter(s => s.profiles?.role === 'Moderator'),
    'İçerik & Basın Ekibi': displayStaff.filter(s => ['Editor', 'Journalist'].includes(s.profiles?.role)),
    'Diğer Ekip Üyeleri': displayStaff.filter(s => !['Owner', 'Developer', 'Administrator', 'Moderator', 'Editor', 'Journalist'].includes(s.profiles?.role)),
  };

  const getRoleIcon = (roleName: string) => {
    if (roleName.includes('Yönetim')) return <Shield size={18} className="text-amber-400" />;
    if (roleName.includes('Moderasyon')) return <Award size={18} className="text-blue-400" />;
    if (roleName.includes('İçerik')) return <PenTool size={18} className="text-emerald-400" />;
    return <Users size={18} className="text-purple-400" />;
  };

  const getRoleColor = (roleName: string) => {
    if (roleName.includes('Yönetim')) return 'orange';
    if (roleName.includes('Moderasyon')) return 'blue';
    if (roleName.includes('İçerik')) return 'green';
    return 'dark';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box overflow-hidden relative text-center border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header flex items-center justify-center gap-2" style={{backgroundColor: '#2563eb', borderBottomColor: '#1d4ed8'}}>
          <Shield size={18} /> HabboZone Yönetim & Operasyon Kadrosu
        </div>
        
        <div className="p-8 md:p-14 bg-gradient-to-br from-[#0a1224] via-[#111827] to-[#070c18] flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <Users size={260} className="text-blue-500" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles size={14} className="animate-spin text-yellow-400" style={{ animationDuration: '5s' }} /> Resmi HabboZone Ekibi
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Site Kadrosu
                </h1>
                <p className="text-sm md:text-base text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
                    HabboZone'un arkasındaki özverili yönetici, geliştirici, moderatör ve habercilerimizle tanışın. Soru, destek ve önerileriniz için ekibimiz 7/24 yanınızda!
                </p>
            </div>
        </div>
      </div>

      {Object.entries(groupedStaff).map(([groupName, members]) => {
        if (members.length === 0) return null;

        return (
          <div key={groupName} className="habbo-box overflow-hidden border-2 border-white/10 shadow-2xl">
            <div className={`habbo-box-header ${getRoleColor(groupName)} flex items-center justify-between`}>
                <span className="flex items-center gap-2.5">
                  {getRoleIcon(groupName)}
                  {groupName} ({members.length})
                </span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">Aktif Görevde</span>
            </div>

            <div className="p-6 bg-[#070c18]/90">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map((staff) => (
                    <Link 
                    key={staff.id} 
                    href={`/profile/${staff.profiles?.username}`}
                    className="group bg-[#0a1325]/80 border border-white/10 rounded-2xl p-5 hover:border-blue-500/60 hover:bg-[#0f1d38] transition-all duration-300 shadow-xl flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-1.5"
                    >
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#111827] to-transparent border-b border-white/5 z-0 group-hover:from-blue-950/40 transition-colors" />
                    
                    <div className="h-28 w-full flex justify-center mb-3 relative z-10 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        <HabboAvatar 
                        username={staff.profiles?.habbo_username || 'Habbo'} 
                        size="l"
                        direction={4}
                        headDirection={4}
                        action="std"
                        className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] h-44 -mt-5"
                        />
                    </div>

                    <h3 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors mt-2 flex items-center gap-1">
                        {staff.profiles?.username}
                    </h3>
                    
                    <div className="mt-1.5 bg-blue-950/60 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-blue-400 shadow-sm">
                        {staff.position || staff.profiles?.role}
                    </div>
                    
                    {staff.profiles?.motto ? (
                        <p className="mt-3 text-[11px] text-gray-400 italic bg-[#050b14]/80 border border-white/5 p-2 rounded-xl w-full shadow-inner truncate group-hover:text-gray-300 transition-colors">
                        &ldquo;{staff.profiles.motto}&rdquo;
                        </p>
                    ) : (
                        <p className="mt-3 text-[11px] text-gray-500 italic bg-[#050b14]/50 border border-white/5 p-2 rounded-xl w-full shadow-inner truncate">
                        &ldquo;HabboZone Ekip Üyesi&rdquo;
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
        <div className="text-center py-16 bg-[#0a1325]/60 border border-white/10 rounded-2xl shadow-xl">
          <Users size={48} className="mx-auto text-blue-500/50 mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Henüz ekip üyesi eklenmedi</h3>
          <p className="text-xs text-gray-400">Yönetim panelinden personel listesini yapılandırabilirsiniz.</p>
        </div>
      )}

    </div>
  );
}

