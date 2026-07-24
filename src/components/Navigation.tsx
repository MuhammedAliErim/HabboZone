"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, AlignLeft, Newspaper, Users, BookOpen, ShoppingBag, Wrench, Package } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'ANA SAYFA', icon: Home },
    { href: '/news', label: 'HABERLER', icon: AlignLeft },
    { href: '/magazines', label: 'GAZETE', icon: Newspaper },
    { href: '/forum', label: 'TOPLULUK', icon: Users },
    { href: '/groups', label: 'GRUPLAR', icon: Users },
    { href: '/rooms', label: 'ODALAR', icon: Home },
    { href: '/guides', label: 'REHBERLER', icon: BookOpen },
    { href: '/market', label: 'PAZAR', icon: ShoppingBag },
    { href: '/wiki', label: 'WİKİ', icon: Package },
    { href: '/tools', label: 'ARAÇLAR', icon: Wrench },
  ];

  const activeIndex = navItems.findIndex(item => item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));

  return (
    <nav className="hidden lg:flex items-center h-full flex-1 gap-1 relative">
      {/* Sliding Active Indicator */}
      {activeIndex !== -1 && (
        <div 
          className="absolute bottom-0 h-[3px] bg-[#facc15] rounded-t-sm shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-all duration-300 ease-out"
          style={{ 
            width: '64px', // 4rem, slightly smaller than the 96px width of the item
            left: `${activeIndex * 100 + 16}px` // 96px width + 4px gap = 100px per item. +16px to center the 64px line within the 96px item.
          }}
        ></div>
      )}

      {navItems.map((item) => {
        // active if exact match, or if it's a sub-path (e.g. /news/something) but not for home '/'
        const isActive = item.href === '/' 
          ? pathname === '/' 
          : pathname.startsWith(item.href);

        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center justify-center w-24 h-full relative group transition-colors ${isActive ? 'text-white' : 'text-[#64748b] hover:text-white'}`}
          >
            <item.icon size={20} className={`mb-1.5 transition-all duration-300 ${isActive ? 'text-[#facc15] drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'group-hover:scale-110 group-hover:-translate-y-1 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[11px] font-bold uppercase tracking-wide">{item.label}</span>
            {!isActive && (
              <div className="absolute bottom-0 w-16 h-[3px] bg-[#334155] border-t border-dashed border-[#1e293b] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
