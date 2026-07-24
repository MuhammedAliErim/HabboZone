import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Users, LogIn, Settings, ArrowLeft, ShieldAlert } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export const revalidate = 60;

export default async function GroupDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  
  const supabase = await createClient();

  // Fetch the group and its members
  const { data: group } = await supabase
    .from('groups')
    .select(`
      *,
      owner:profiles!groups_owner_id_fkey(username, habbo_username),
      members:group_members(
        role,
        joined_at,
        user:profiles!group_members_user_id_fkey(username, habbo_username)
      )
    `)
    .eq('slug', slug)
    .single();

  if (!group) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  // Check if current user is a member or admin
  const currentUserMemberInfo = user ? group.members.find((m: any) => m.user.id === user.id) : null;
  const isMember = !!currentUserMemberInfo;
  const isAdmin = currentUserMemberInfo?.role === 'admin' || currentUserMemberInfo?.role === 'owner';
  
  const memberCount = group.members.length;

  return (
    <div className="pb-16 animate-in fade-in duration-500 max-w-[1200px] mx-auto w-full">
      
      {/* Back to groups */}
      <div className="p-4 md:p-6">
        <Link href="/groups" className="text-gray-400 hover:text-white flex items-center gap-2 font-bold text-sm transition-colors w-fit">
          <ArrowLeft size={16} /> GRUPLARA DÖN
        </Link>
      </div>

      {/* Cover Area */}
      <div className="mx-4 md:mx-6 rounded-lg overflow-hidden border-2 border-[#1e293b] shadow-2xl relative mb-8">
        <div className="h-[250px] md:h-[350px] w-full relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={group.cover_url || 'https://images.habbo.com/c_images/reception/background_right_coffee_1.png'} 
            alt={group.name} 
            className="w-full h-full object-cover pixelated opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020610] via-[#020610]/60 to-transparent"></div>
        </div>

        {/* Group Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row items-end gap-6">
          
          <div className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] bg-[#0a1325]/90 backdrop-blur-md rounded-xl border-4 border-[#1e293b] flex items-center justify-center p-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-10 shrink-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={group.badge_url} alt="Badge" className="max-w-full max-h-full pixelated drop-shadow-xl" />
          </div>

          <div className="flex-1 w-full relative z-10">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight text-shadow-lg mb-2">{group.name}</h1>
            <p className="text-gray-300 font-medium text-sm md:text-base max-w-2xl drop-shadow-md mb-4 leading-relaxed">
              {group.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 bg-[#0a1325]/80 px-3 py-1.5 rounded border border-[#1e293b] text-[#3b82f6] text-[12px] font-bold shadow-md">
                <Users size={16} />
                {memberCount} ÜYE
              </span>
              <span className="flex items-center gap-2 bg-[#0a1325]/80 px-3 py-1.5 rounded border border-[#1e293b] text-[#facc15] text-[12px] font-bold shadow-md">
                <ShieldAlert size={16} />
                KURUCU: {group.owner.username}
              </span>
            </div>
          </div>
          
          <div className="w-full md:w-auto relative z-10 shrink-0 mt-4 md:mt-0 flex gap-2">
            {!isMember ? (
              <button className="habbo-button success flex-1 md:flex-none justify-center px-8 py-3 text-sm">
                <LogIn size={18} className="mr-2" /> GRUBA KATIL
              </button>
            ) : (
              <button className="habbo-button bg-red-600 hover:bg-red-700 border-red-800 flex-1 md:flex-none justify-center px-6 py-3 text-sm">
                AYRIL
              </button>
            )}
            
            {isAdmin && (
              <button className="habbo-button bg-gray-700 hover:bg-gray-600 border-gray-800 px-4 py-3" title="Grup Ayarları">
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Members) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="habbo-box bg-[#090e17] p-6 border-[#1e293b]">
            <h2 className="text-xl font-black text-white mb-6 border-b border-[#1e293b] pb-3">Grup Üyeleri ({memberCount})</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.members.map((member: any, i: number) => (
                <Link key={i} href={`/profile/${member.user.username}`} className="bg-[#050a14] rounded-lg border border-[#1e293b] p-3 flex items-center gap-3 hover:border-[#3b82f6] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[#1e293b] overflow-hidden flex-shrink-0 relative">
                     <HabboAvatar username={member.user.habbo_username} action="std" size="m" headOnly={true} className="absolute -top-2 left-1 scale-150" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-white text-[12px] font-bold truncate group-hover:text-[#3b82f6]">{member.user.username}</span>
                    <span className={`text-[10px] font-bold ${member.role === 'owner' ? 'text-[#facc15]' : member.role === 'admin' ? 'text-purple-400' : 'text-gray-500'}`}>
                      {member.role === 'owner' ? 'KURUCU' : member.role === 'admin' ? 'YÖNETİCİ' : 'ÜYE'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column (Widgets) */}
        <div className="flex flex-col gap-6">
          {/* Admin Notice Widget */}
          <div className="habbo-box bg-gradient-to-br from-[#0a1325] to-[#050a14] p-5 border-blue-900/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
            
            <h3 className="text-sm font-black text-white mb-2 flex items-center gap-2">
              <ShieldAlert size={16} className="text-blue-400" />
              Kulüp Yönetimi
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4 relative z-10">
              Şu an Habbo Zone Grupları test aşamasındadır. Gruba katılabilir veya ayrılabilseniz de, sayfa tasarımlarını (badge ve kapak fotoğrafı gibi) şimdilik sadece yöneticiler değiştirebilir.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
