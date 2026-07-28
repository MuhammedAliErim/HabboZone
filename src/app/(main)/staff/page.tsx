import { createClient } from '@/utils/supabase/server';
import { Users, Shield, Award, PenTool } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';
import Link from 'next/link';

export const metadata = { title: 'Ekip Kadrosu - HabboZone', description: 'HabboZone yönetim ekibi, moderatörler ve yetkili kadrosu.' };
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
  const displayStaff = staffMembers && staffMembers.length > 0 ? staffMembers : [];

  const groupedStaff = {
    'Yönetim & Kurucular': displayStaff.filter(s => ['Owner', 'Developer', 'Administrator'].includes(s.profiles?.role)),
    'Moderasyon & Denetim': displayStaff.filter(s => s.profiles?.role === 'Moderator'),
    'İçerik & Basın Ekibi': displayStaff.filter(s => ['Editor', 'Journalist'].includes(s.profiles?.role)),
    'Diğer Ekip Üyeleri': displayStaff.filter(s => !['Owner', 'Developer', 'Administrator', 'Moderator', 'Editor', 'Journalist'].includes(s.profiles?.role)),
  };

  const getRoleIcon = (roleName: string) => {
    if (roleName.includes('Yönetim')) return <Shield size={16} className="text-[#facc15]" />;
    if (roleName.includes('Moderasyon')) return <Award size={16} className="text-[#3b82f6]" />;
    if (roleName.includes('İçerik')) return <PenTool size={16} className="text-[#22c55e]" />;
    return <Users size={16} className="text-[#a855f7]" />;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* AUTHENTIC HABBO HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#2563eb] text-white px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#1d4ed8]">SİTE KADROSU</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Resmi Ekip</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
            HABBOZONE YÖNETİM EKİBİ
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            HabboZone'un arkasındaki özverili yönetici, geliştirici, moderatör ve habercilerimizle tanışın. Soru, destek ve önerileriniz için ekibimiz 7/24 yanınızda!
          </p>
        </div>

        <div className="bg-[#050a14] border border-[#1e293b] px-6 py-4 rounded-[4px] flex items-center gap-6 shrink-0 text-center">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Toplam Ekip</div>
            <div className="text-xl font-black text-white">{displayStaff.length}</div>
          </div>
          <div className="h-8 w-px bg-[#1e293b]"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Durum</div>
            <div className="text-xs font-black text-[#22c55e]">Aktif</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedStaff).map(([groupName, members]) => {
          if (members.length === 0) return null;

          return (
            <div key={groupName} className="flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                <div className="flex items-center gap-2">
                  {getRoleIcon(groupName)}
                  <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">{groupName}</h2>
                </div>
                <span className="text-gray-400 text-[11px] font-bold uppercase">{members.length} KİŞİ</span>
              </div>

              <div className="habbo-box p-4 bg-[#0a1325] border border-[#1e293b]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {members.map((staff) => (
                    <Link 
                      key={staff.id} 
                      href={`/profile/${staff.profiles?.username}`}
                      className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4 hover:border-[#3b82f6] transition-all flex flex-col items-center text-center group"
                    >
                      <div className="h-28 w-full flex justify-center mb-2 bg-[#0a1325] border border-[#1e293b] rounded-[2px] overflow-hidden relative group-hover:scale-[1.02] transition-transform">
                        <HabboAvatar 
                          username={staff.profiles?.habbo_username || 'Habbo'} 
                          size="l"
                          direction={4}
                          headDirection={4}
                          action="std"
                          className="h-44 -mt-5"
                        />
                      </div>

                      <h3 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-[#facc15] transition-colors mt-1">
                        {staff.profiles?.username}
                      </h3>
                      
                      <div className="mt-1 bg-[#facc15] text-black px-2 py-0.5 rounded-[2px] text-[10px] font-black uppercase tracking-wider">
                        {staff.position || staff.profiles?.role}
                      </div>
                      
                      {staff.profiles?.motto ? (
                        <p className="mt-2 text-[11px] text-gray-400 italic bg-[#0a1325] border border-[#1e293b] p-1.5 rounded-[2px] w-full truncate">
                          &ldquo;{staff.profiles.motto}&rdquo;
                        </p>
                      ) : (
                        <p className="mt-2 text-[11px] text-gray-500 italic bg-[#0a1325] border border-[#1e293b] p-1.5 rounded-[2px] w-full truncate">
                          &ldquo;HabboZone Ekibi&rdquo;
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayStaff.length === 0 && (
        <div className="text-center py-16 bg-[#0a1325] border border-[#1e293b] rounded-[3px]">
          <Users size={40} className="mx-auto text-gray-600 mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">Henüz ekip üyesi eklenmedi</h3>
          <p className="text-xs text-gray-400">Yönetim panelinden personel listesini yapılandırabilirsiniz.</p>
        </div>
      )}

    </div>
  );
}
