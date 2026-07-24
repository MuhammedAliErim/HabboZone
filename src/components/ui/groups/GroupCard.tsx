import Link from 'next/link';
import { Users, ShieldAlert } from 'lucide-react';

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    slug: string;
    description: string;
    badge_url: string;
    cover_url: string;
    memberCount?: number;
    owner: {
      username: string;
      habbo_username: string;
    };
  };
}

export default function GroupCard({ group }: GroupCardProps) {
  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${group.owner.habbo_username}&direction=2&head_direction=2&gesture=sml&size=s`;
  const members = group.memberCount || Math.floor(Math.random() * 100 + 10);

  return (
    <Link href={`/groups/${group.slug}`} className="habbo-box hover:border-[#3b82f6]/50 p-0 flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] relative overflow-hidden h-[240px]">
      
      {/* Cover Background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={group.cover_url || 'https://images.habbo.com/c_images/reception/background_right_coffee_1.png'} 
          alt={group.name} 
          className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 pixelated" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col h-full justify-between">
        
        {/* Top: Badge & Admin */}
        <div className="flex justify-between items-start">
          <div className="w-[50px] h-[50px] bg-[#0a1325]/80 backdrop-blur-sm rounded-lg border border-[#1e293b] flex items-center justify-center p-1 shadow-lg group-hover:border-[#facc15]/50 transition-colors">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={group.badge_url} alt="Badge" className="max-w-full max-h-full pixelated drop-shadow-md group-hover:scale-110 transition-transform" />
          </div>
          
          <div className="flex items-center gap-1.5 bg-[#0a1325]/80 backdrop-blur-sm px-2 py-1 rounded-md border border-[#1e293b]">
            <ShieldAlert size={12} className="text-[#facc15]" />
            <span className="text-white text-[10px] font-bold uppercase">Kurucu: {group.owner.username}</span>
          </div>
        </div>
        
        {/* Bottom: Info */}
        <div className="mt-auto pt-4 border-t border-[#1e293b]/50">
          <h3 className="text-white font-black text-[18px] leading-tight group-hover:text-[#facc15] transition-colors mb-1 drop-shadow-md">
            {group.name}
          </h3>
          <p className="text-gray-300 text-[12px] leading-snug line-clamp-2 mb-3 drop-shadow-md">
            {group.description}
          </p>
          
          <div className="flex justify-between items-center bg-[#0a1325]/80 p-2 rounded border border-[#1e293b]">
            <span className="flex items-center gap-2 text-[#3b82f6] text-[11px] font-bold">
              <Users size={14} />
              {members} Üye
            </span>
            <span className="text-[#facc15] text-[10px] font-bold uppercase hover:underline">
              Grubu İncele
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
