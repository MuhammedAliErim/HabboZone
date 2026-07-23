'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#111827] hover:bg-[#1e293b] border border-[#1e293b] rounded-lg p-1.5 pr-4 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded bg-[#1e293b] flex items-center justify-center overflow-hidden shrink-0">
          <HabboAvatar username={profile.habbo_username || 'Habbo'} size="m" headDirection={3} direction={3} className="w-12 h-12 -mt-2" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-bold text-white text-[12px] leading-tight">{profile.username}</span>
          {isVip && <span className="text-[#facc15] text-[10px] font-bold">VIP ÜYE</span>}
        </div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border-2 border-black rounded-[4px] shadow-[0_4px_0_#000] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <Link 
            href={`/profile/${profile.username}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-[12px] font-bold text-gray-300 hover:text-white hover:bg-[#1e293b] transition-colors border-b border-[#1e293b]"
          >
            <User size={14} className="text-[#3b82f6]" />
            PROFİLİM
          </Link>
          <Link 
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-[12px] font-bold text-gray-300 hover:text-white hover:bg-[#1e293b] transition-colors border-b border-[#1e293b]"
          >
            <Settings size={14} className="text-[#a855f7]" />
            AYARLAR
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-[12px] font-bold text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
          >
            <LogOut size={14} />
            ÇIKIŞ YAP
          </button>
        </div>
      )}
    </div>
  );
}
