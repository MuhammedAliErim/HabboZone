import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import GroupCard from '@/components/ui/groups/GroupCard';
import { Users, Search, Plus } from 'lucide-react';

export const metadata = { title: 'Gruplar - HabboZone', description: 'HabboZone gruplarını keşfedin, arkadaşlarınızla topluluk oluşturun.' };
export const revalidate = 60;

export default async function GroupsPage() {
  const supabase = await createClient();

  // Fetch groups
  const { data: groups } = await supabase
    .from('groups')
    .select(`
      id, 
      name, 
      slug, 
      description, 
      badge_url,
      cover_url,
      owner:profiles!groups_owner_id_fkey(username, habbo_username),
      group_members(count)
    `)
    .order('created_at', { ascending: false });

  // Map the member count
  const formattedGroups = groups?.map((g: any) => ({
    ...g,
    memberCount: g.group_members?.[0]?.count || 0
  })) || [];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-8 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/background_right_vip_room_1.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1200px] w-full mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">GRUPLAR & KULÜPLER</h1>
              <p className="text-[#94a3b8] text-sm font-medium">Birlikten kuvvet doğar! HabboZone kulüplerine katıl veya kendi topluluğunu kur.</p>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs px-6 py-3 rounded-[3px] border border-[#3b82f6] transition-colors flex items-center gap-2 uppercase tracking-wider shadow-md">
                <Plus size={16} /> GRUBUNU OLUŞTUR
              </button>
            </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 mb-6 border-b border-[#1e293b]">
          <div className="flex overflow-x-auto gap-2 scrollbar-hide w-full md:w-auto">
            <button className="px-5 py-2 bg-[#0a1325] text-[#facc15] font-black text-xs rounded-[3px] border border-[#3b82f6] uppercase tracking-wider transition-colors shadow">
              Tümü
            </button>
            <button className="px-5 py-2 bg-[#050a14] text-gray-400 hover:text-white font-bold text-xs rounded-[3px] border border-[#1e293b] hover:bg-[#0a1325] uppercase tracking-wider transition-colors">
              Benim Gruplarım
            </button>
            <button className="px-5 py-2 bg-[#050a14] text-gray-400 hover:text-white font-bold text-xs rounded-[3px] border border-[#1e293b] hover:bg-[#0a1325] uppercase tracking-wider transition-colors">
              Popüler
            </button>
          </div>
          
          <div className="relative w-full md:w-[280px]">
            <input 
              type="text" 
              placeholder="Grup ara..." 
              className="w-full bg-[#050a14] border border-[#1e293b] text-white px-4 py-2 pl-9 rounded-[3px] text-xs font-medium outline-none focus:border-[#3b82f6] transition-colors"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedGroups.length > 0 ? (
            formattedGroups.map((group: any) => (
              <GroupCard key={group.slug} group={group} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400 font-bold border border-dashed border-[#1e293b] rounded-[3px] bg-[#0a1325]">
              Henüz hiçbir grup oluşturulmamış.
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
