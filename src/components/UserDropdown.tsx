'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Settings, User, ChevronDown, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import HabboAvatar from './HabboAvatar';

interface UserDropdownProps {
  profile: {
    username: string;
    habbo_username?: string;
    role: string;
  };
}

export default function UserDropdown({ profile }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const isVip = ['VIP', 'Admin', 'Owner', 'Developer'].includes(profile.role);
  const staffRoles = ['owner', 'developer', 'administrator', 'moderator', 'admin', 'editor', 'yazar', 'muhabir', 'staff', 'yetkili', 'yönetici', 'birim sorumlusu', 'mod'];
  const isStaff = profile && profile.role && (
    !['member', 'vip', 'user', 'üye', 'normal üye'].includes(profile.role.toLowerCase()) ||
    staffRoles.some(r => profile.role.toLowerCase().includes(r))
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#0a1325] hover:bg-[#1e293b] border border-[#1e293b] rounded-[2px] p-1.5 pr-3.5 transition-colors text-left shadow-sm"
      >
        <div className="w-9 h-9 rounded-[2px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center overflow-hidden shrink-0">
          <HabboAvatar username={profile.habbo_username || 'Habbo'} size="m" headDirection={3} direction={3} className="w-12 h-12 -mt-2" />
        </div>
        <div className="hidden sm:flex flex-col justify-center">
          <span className="font-black text-white text-xs leading-tight uppercase tracking-tight">{profile.username}</span>
          {isVip && <span className="text-[#facc15] text-[9px] font-black tracking-wider uppercase">VIP ÜYE</span>}
        </div>
        <ChevronDown size={14} className={`hidden sm:block text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-[#0a1325] border border-[#1e293b] rounded-[3px] shadow-xl z-50 overflow-hidden animate-in fade-in duration-150">
          {isStaff && (
            <Link 
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-xs font-black text-black bg-[#facc15] hover:bg-[#eab308] transition-colors border-b border-[#1e293b] uppercase tracking-tight"
            >
              <LayoutDashboard size={15} className="text-black" />
              <span>ADMİN PANELİNE GİT</span>
            </Link>
          )}
          <Link 
            href={`/profile/${profile.username}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-[#1e293b] transition-colors border-b border-[#1e293b] uppercase tracking-tight"
          >
            <User size={14} className="text-[#3b82f6]" />
            PROFİLİM
          </Link>
          <Link 
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-[#1e293b] transition-colors border-b border-[#1e293b] uppercase tracking-tight"
          >
            <Settings size={14} className="text-[#a855f7]" />
            AYARLAR
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-[#ef4444] hover:bg-[#050a14] transition-colors uppercase tracking-tight"
          >
            <LogOut size={14} />
            ÇIKIŞ YAP
          </button>
        </div>
      )}
    </div>
  );
}
