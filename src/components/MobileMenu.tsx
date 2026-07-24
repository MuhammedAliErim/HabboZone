'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, AlignLeft, Newspaper, Users, BookOpen, ShoppingBag, Wrench, LogIn, UserPlus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearch from './search/GlobalSearch';

export default function MobileMenu({ profile }: { profile: any }) {
  const [isOpen, setIsOpen] = useState(false);
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
    { href: '/tools', label: 'ARAÇLAR', icon: Wrench },
  ];

  return (
    <div className="lg:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 bg-[#1e293b] rounded-lg border border-gray-700 flex items-center justify-center text-white ml-2"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-[#090e17] border-l-2 border-black shadow-[-8px_0_0_rgba(0,0,0,0.5)] z-[101] flex flex-col"
            >
              <div className="h-[80px] flex items-center justify-between px-6 border-b border-white/10 flex-none">
                <div className="font-black leading-[0.8] tracking-tight">
                  <div className="text-[#facc15] text-[20px]">HABBO</div>
                  <div className="text-white text-[20px]">ZONE</div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded text-white hover:bg-white/20 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 border-b border-white/10">
                <GlobalSearch />
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = item.href === '/' 
                    ? pathname === '/' 
                    : pathname.startsWith(item.href);
                    
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        isActive 
                          ? 'border-[#facc15] bg-[#facc15]/10 text-white' 
                          : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} className={isActive ? 'text-[#facc15]' : ''} />
                      <span className="font-bold text-sm tracking-wide">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {!profile ? (
                <div className="p-4 border-t border-white/10 flex flex-col gap-3 mt-auto">
                  <Link 
                    href="/login" 
                    onClick={() => setIsOpen(false)}
                    className="habbo-button success w-full flex items-center justify-center gap-2 py-3"
                  >
                    <LogIn size={18} /> GİRİŞ YAP
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setIsOpen(false)}
                    className="habbo-button w-full flex items-center justify-center gap-2 py-3"
                  >
                    <UserPlus size={18} /> KAYIT OL
                  </Link>
                </div>
              ) : (
                <div className="p-4 border-t border-white/10 flex flex-col gap-3 mt-auto">
                  <Link 
                    href={`/profile/${profile.username}`}
                    onClick={() => setIsOpen(false)}
                    className="habbo-button blue w-full flex items-center justify-center gap-2 py-3"
                  >
                    <UserPlus size={18} /> PROFİLİM
                  </Link>
                  <Link 
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="habbo-button w-full flex items-center justify-center gap-2 py-3"
                  >
                    <Wrench size={18} /> AYARLAR
                  </Link>
                  <form action="/auth/signout" method="post" className="w-full">
                    <button type="submit" onClick={() => setIsOpen(false)} className="habbo-button w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700">
                      <LogOut size={18} /> ÇIKIŞ YAP
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
