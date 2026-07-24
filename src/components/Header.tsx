import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import Navigation from './Navigation';
import UserDropdown from './UserDropdown';
import GlobalSearch from './search/GlobalSearch';
import MobileMenu from './MobileMenu';
import NotificationBell from './notifications/NotificationBell';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data || {
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'Kullanıcı',
      habbo_username: user.user_metadata?.habbo_username || '',
      role: 'Member'
    };
  }

  // Active state mocking
  const activePath = '/news';

  return (
    <header className="w-full bg-[#090e17] sticky top-0 z-50 h-[80px]">
      <div className="max-w-[1280px] mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex flex-col items-start justify-center h-full mr-8">
          <div className="font-black leading-[0.8] tracking-tight">
            <div className="text-[#facc15] text-[26px]">HABBO</div>
            <div className="text-white text-[26px]">ZONE</div>
          </div>
        </Link>
        
        {/* Center: Navigation Links */}
        <Navigation />

        {/* Right: Auth / User Area */}
        <div className="flex items-center gap-4 h-full">
          
          <div className="hidden md:block">
            <GlobalSearch />
          </div>

          {!profile ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="habbo-button success px-4 py-2.5">
                <LogIn size={16} /> GİRİŞ YAP
              </Link>
              <Link href="/register" className="habbo-button px-6 py-2.5">
                KAYIT OL
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NotificationBell userId={user?.id || ''} />
              <UserDropdown profile={profile} />
            </div>
          )}

          <MobileMenu profile={profile} />
        </div>

      </div>
    </header>
  );
}
