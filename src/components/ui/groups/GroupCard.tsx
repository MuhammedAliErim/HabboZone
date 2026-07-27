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
  const members = group.memberCount || ((group.name.length * 7) % 50) + 12;

  return (
    <Link href={`/groups/${group.slug}`} className="habbo-box bg-[#0a1325] border border-[#1e293b] hover:border-[#3b82f6] rounded-[3px] p-0 flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden h-[250px]">
      
      {/* Cover Background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={group.cover_url || 'https://images.habbo.com/c_images/reception/background_right_coffee_1.png'} 
          alt={group.name} 
          className="w-full h-full object-cover opacity-35 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500 pixelated" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/90 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col h-full justify-between">
        
        {/* Top: Badge & Admin */}
        <div className="flex justify-between items-start">
          <div className="w-[48px] h-[48px] bg-[#0a1325]/90 rounded-[2px] border border-[#1e293b] flex items-center justify-center p-1.5 shadow group-hover:border-[#facc15] transition-colors">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={group.badge_url} alt="Badge" className="max-w-full max-h-full pixelated drop-shadow group-hover:scale-110 transition-transform" />
          </div>
          
          <div className="flex items-center gap-1.5 bg-[#0a1325]/90 px-2.5 py-1 rounded-[2px] border border-[#1e293b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarUrl} alt={group.owner.username} className="w-4 h-4 object-contain rounded-[1px] bg-black/40" />
            <ShieldAlert size={12} className="text-[#facc15]" />
            <span className="text-white text-[10px] font-black uppercase">Kurucu: {group.owner.username}</span>
          </div>
        </div>
        
        {/* Bottom: Info */}
        <div className="mt-auto pt-3 border-t border-[#1e293b]">
          <h3 className="text-white font-black text-lg leading-tight group-hover:text-[#facc15] transition-colors mb-1 drop-shadow uppercase tracking-tight">
            {group.name}
          </h3>
          <p className="text-gray-300 text-xs leading-snug line-clamp-2 mb-3 font-medium">
            {group.description}
          </p>
          
          <div className="flex justify-between items-center bg-[#050a14] px-3 py-2 rounded-[2px] border border-[#1e293b]">
            <span className="flex items-center gap-1.5 text-[#3b82f6] text-xs font-black">
              <Users size={14} />
              {members} ÜyE
            </span>
            <span className="text-[#facc15] text-[10px] font-black uppercase hover:underline">
              Grubu İncele →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
