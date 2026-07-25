'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wand2, 
  CreditCard, 
  Compass, 
  Newspaper, 
  BookOpen, 
  Gem, 
  Package, 
  Award, 
  Calendar, 
  Megaphone, 
  Home, 
  Book, 
  Users, 
  Image as ImageIcon, 
  MessageSquare 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'text-yellow-400', exact: true },
    { href: '/admin/studio', label: 'Canva Stüdyo', icon: Wand2, color: 'text-pink-400 animate-pulse', badge: 'PRO', badgeColor: 'bg-pink-500' },
    { href: '/admin/id-studio', label: 'Kart & İmza', icon: CreditCard, color: 'text-purple-400 animate-bounce', badge: 'NEW', badgeColor: 'bg-purple-500' },
    { href: '/admin/room-studio', label: 'Harita Stüdyo', icon: Compass, color: 'text-emerald-400 animate-spin-slow', badge: 'MAP', badgeColor: 'bg-emerald-500' },
    { href: '/admin/news', label: 'Haberler', icon: Newspaper, color: 'text-green-400' },
    { href: '/admin/magazines', label: 'Gazete/Dergi', icon: BookOpen, color: 'text-pink-400' },
    { href: '/admin/values', label: 'Nadire Değerleri', icon: Gem, color: 'text-yellow-400' },
    { href: '/admin/wiki', label: 'Wiki Kütüphanesi', icon: Package, color: 'text-purple-400' },
    { href: '/admin/badges', label: 'Rozetler', icon: Award, color: 'text-blue-400' },
    { href: '/admin/events', label: 'Etkinlik Takvimi', icon: Calendar, color: 'text-emerald-400' },
    { href: '/admin/announcements', label: 'Son Dakika Bantı', icon: Megaphone, color: 'text-red-400' },
    { href: '/admin/rooms', label: 'Odalar', icon: Home, color: 'text-cyan-400' },
    { href: '/admin/guides', label: 'Rehberler', icon: Book, color: 'text-orange-400' },
    { href: '/admin/users', label: 'Kullanıcılar', icon: Users, color: 'text-indigo-400' },
    { href: '/admin/staff', label: 'Ekip Yönetimi', icon: Users, color: 'text-amber-400' },
    { href: '/admin/gallery', label: 'Galeri', icon: ImageIcon, color: 'text-teal-400' },
    { href: '/admin/forum', label: 'Forum Kategorileri', icon: MessageSquare, color: 'text-violet-400' },
  ];

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <nav className="space-y-1 text-sm font-bold">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
              active
                ? 'bg-gradient-to-r from-yellow-500/20 via-blue-500/10 to-transparent text-white border-l-4 border-yellow-400 shadow-md shadow-yellow-500/5 font-black'
                : 'text-gray-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className={item.color} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`px-1.5 py-0.5 rounded ${item.badgeColor} text-white text-[9px] font-black uppercase tracking-wider shadow`}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
