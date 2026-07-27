'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, AlignLeft, Newspaper, Users, BookOpen, ShoppingBag, Wrench, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearch from './search/GlobalSearch';

export default function MobileMenu({ profile }: { profile: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const staffRoles = ['owner', 'developer', 'administrator', 'moderator', 'admin', 'editor', 'yazar', 'muhabir', 'staff', 'yetkili', 'yönetici', 'birim sorumlusu', 'mod'];
  const isStaff = profile && profile.role && (
    !['member', 'vip', 'user', 'üye', 'normal üye'].includes(profile.role.toLowerCase()) ||
    staffRoles.some(r => profile.role.toLowerCase().includes(r))
  );

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
        className="w-10 h-10 bg-[#050a14] hover:bg-[#0a1325] rounded-[2px] border border-[#1e293b] hover:border-[#facc15] flex items-center justify-center text-white ml-2 transition-colors shadow"
      >
        <Menu size={22} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] habbo-box bg-[#0a1325] border-l border-[#1e293b] shadow-2xl z-[101] flex flex-col"
            >
              <div className="h-[80px] flex items-center justify-between px-6 border-b border-[#1e293b] bg-[#050a14] flex-none">
                <div className="font-black leading-[0.8] tracking-tight">
                  <div className="text-[#facc15] text-[20px]">HABBO</div>
                  <div className="text-white text-[20px]">ZONE</div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-[#0a1325] border border-[#1e293b] rounded-[2px] text-white hover:border-[#facc15] hover:text-[#facc15] transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 border-b border-[#1e293b] bg-[#050a14]/50">
                <GlobalSearch />
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
                {navItems.map((item) => {
                  const isActive = item.href === '/' 
                    ? pathname === '/' 
                    : pathname.startsWith(item.href);
                    
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-[2px] border transition-all ${
                        isActive 
                          ? 'border-[#facc15] bg-[#facc15]/10 text-white shadow-[0_0_10px_rgba(250,204,21,0.2)]' 
                          : 'border-[#1e293b] bg-[#050a14] text-gray-400 hover:border-[#3b82f6] hover:bg-[#0a1325] hover:text-white'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-[#facc15]' : 'text-gray-400'} />
                      <span className="font-black text-xs uppercase tracking-wider">{item.label}</span>
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
                  {isStaff && (
                    <Link 
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="habbo-button warning w-full flex items-center justify-center gap-2 py-3 !bg-gradient-to-r !from-yellow-400 !to-amber-500 !text-black font-black shadow-lg"
                    >
                      <LayoutDashboard size={18} className="animate-bounce" /> ADMİN PANELİNE GİT
                    </Link>
                  )}
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
