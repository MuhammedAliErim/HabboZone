import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Users, Search, Plus } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export const revalidate = 60; // Cache for 60 seconds

export default async function RoomsPage() {
  const supabase = await createClient();

  // Mock Room Data
  const mockRooms = [
    { id: 1, name: 'Plaj Partisi', owner: 'HabboStaff', desc: "Güneş, kum ve müzik! Plaj Partisi'nde doyasıya eğlen!", currentUsers: 126, maxUsers: 250, img: 'https://images.habbo.com/c_images/reception/background_left_party_1.png' },
    { id: 2, name: 'Kafe', owner: 'KafeTeam', desc: "Dostlarınla sohbet edebileceğin sıcacık bir ortam.", currentUsers: 96, maxUsers: 100, img: 'https://images.habbo.com/c_images/reception/background_right_party_1.png' },
    { id: 3, name: 'Retro Disko', owner: 'RetroHabbo', desc: "Retro müzikler eşliğinde nostalji zamanı!", currentUsers: 75, maxUsers: 100, img: 'https://images.habbo.com/c_images/reception/reception_backdrop_4.png' },
    { id: 4, name: 'HabboZone Parkı', owner: 'HabboStaff', desc: "Doğayla iç içe, huzurlu bir park odası.", currentUsers: 60, maxUsers: 100, img: 'https://images.habbo.com/c_images/reception/reception_backdrop_2.png' },
  ];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-6 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/background_right_party_1.png")',
            backgroundPosition: 'right center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1000px] w-full mx-auto flex items-end justify-between">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">ODALAR</h1>
                <p className="text-[#94a3b8] text-sm font-medium">En popüler odaları keşfet!</p>
            </div>
            
            <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-[12px] px-6 py-2.5 rounded transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                ODA OLUŞTUR
            </button>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#1e293b] pb-4 mb-6">
            <button className="px-6 py-2.5 bg-[#1e293b] text-white font-bold text-[12px] rounded border border-[#334155] transition-colors">
                POPÜLER ODALAR
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                YENİ ODALAR
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                ETKİNLİK ODALARI
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                RESMİ ODALAR
            </button>
        </div>

        {/* Room List */}
        <div className="space-y-3">
            {mockRooms.map((room) => (
                <Link href="#" key={room.id} className="habbo-box habbo-card-hover p-3 flex items-center gap-4 group">
                    
                    {/* Thumbnail */}
                    <div className="w-[120px] h-[80px] shrink-0 rounded overflow-hidden relative border border-[#1e293b]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={room.img} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="text-[14px] font-bold text-white group-hover:text-[#22c55e] transition-colors mb-0.5 line-clamp-1">{room.name}</h3>
                        <p className="text-[11px] text-[#64748b] flex items-center gap-1 mb-1">
                            <HabboAvatar username={room.owner} size="m" headOnly direction={3} className="w-4 h-4 -mt-1" />
                            by <span className="font-bold text-[#94a3b8]">{room.owner}</span>
                        </p>
                        <p className="text-[12px] text-[#94a3b8] line-clamp-1">{room.desc}</p>
                    </div>

                    {/* Action & Stats */}
                    <div className="shrink-0 flex flex-col items-end gap-3 w-[100px]">
                        <div className="text-[11px] font-bold text-white flex items-center gap-1.5 bg-[#0a1325] px-2.5 py-1 rounded border border-[#1e293b]">
                            <Users size={12} className="text-[#22c55e]" />
                            {room.currentUsers} / {room.maxUsers}
                        </div>
                        <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-[11px] px-6 py-1.5 rounded transition-colors w-full">
                            GİT
                        </button>
                    </div>
                    
                </Link>
            ))}
        </div>

        <div className="mt-8 text-center">
            <button className="text-[#64748b] hover:text-white font-bold text-[12px] transition-colors">
                TÜM ODALARI GÖR →
            </button>
        </div>

      </div>
    </div>
  );
}
