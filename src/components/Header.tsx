import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import HabboAvatar from './HabboAvatar';
import { Settings, Crown, Coins, Search, Home, AlignLeft, Newspaper, Users, BookOpen, ShoppingBag, Wrench } from 'lucide-react';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  // Active state could be passed as a prop or derived from current path, 
  // but since we are server-side and don't have easy access to pathname without middleware/headers hack in App Router,
  // we'll keep it simple or use client component for active states if needed.
  // For now, we will just render the static links.

  return (
    <header className="w-full bg-[#0b1120] border-b border-[#1e293b] sticky top-0 z-50 shadow-md">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex flex-col items-start group relative mt-[-4px]">
          <div className="font-black tracking-tighter leading-none transform -skew-x-6">
            <div className="text-[#f59e0b] text-[26px] drop-shadow-[0_2px_0_rgba(0,0,0,1)] -mb-1">HABBO</div>
            <div className="text-white text-[26px] drop-shadow-[0_2px_0_rgba(0,0,0,1)]">ZONE</div>
          </div>
        </Link>
        
        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 h-full">
          {[
            { href: '/', label: 'Ana Sayfa', icon: Home, active: false },
            { href: '/news', label: 'Haberler', icon: AlignLeft, active: true },
            { href: '/magazines', label: 'Gazete', icon: Newspaper, active: false },
            { href: '/forum', label: 'Topluluk', icon: Users, active: false },
            { href: '/guides', label: 'Rehberler', icon: BookOpen, active: false },
            { href: '/values', label: 'Mağaza', icon: ShoppingBag, active: false },
            { href: '/tools', label: 'Araçlar', icon: Wrench, active: false },
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex flex-col items-center justify-center w-24 h-full relative group transition-colors ${item.active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <item.icon size={20} className={`mb-1 transition-transform ${item.active ? 'text-[#f59e0b]' : 'group-hover:scale-110'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              
              {/* Active Indicator Underline */}
              {item.active && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#f59e0b] rounded-t-sm shadow-[0_-2px_8px_rgba(245,158,11,0.5)]"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Auth / User Area */}
        <div className="flex items-center gap-4">
          
          <button className="text-gray-400 hover:text-white transition-colors p-2 hidden sm:block">
            <Search size={20} />
          </button>

          {profile ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="font-bold text-white text-sm">{profile.username}</span>
                <div className="flex items-center gap-1 text-[#f59e0b] font-bold text-[11px]">
                  <Coins size={12} /> {profile.hz_points || 0}
                </div>
              </div>
              <Link href={`/profile/${profile.username}`} className="relative group block shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#22c55e] flex items-center justify-center border-2 border-[#1e293b] group-hover:border-white transition-colors">
                  <HabboAvatar username={profile.habbo_username || 'Habbo'} size="m" headDirection={3} direction={3} className="w-14 h-14 -mt-3" />
                </div>
              </Link>
              <Link href="/settings" className="text-gray-400 hover:text-white transition-colors">
                <Settings size={18} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="habbo-button text-[11px] px-4 py-2 flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-current rounded-sm opacity-50 flex items-center justify-center text-[8px] font-bold">→</span>
                GİRİŞ YAP
              </Link>
              <Link href="/register" className="habbo-button yellow text-[11px] px-4 py-2 hidden sm:block">
                KAYIT OL
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
