import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import Navigation from './Navigation';
import UserDropdown from './UserDropdown';
import SearchOverlay from './SearchOverlay';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
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
          
          <SearchOverlay />

          {!profile ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="habbo-button success px-4 py-2.5">
                <LogIn size={16} /> GİRİŞ YAP
              </Link>
              <Link href="/register" className="habbo-button px-6 py-2.5">
                KAYIT OL
              </Link>
            </div>
          ) : (
            <UserDropdown profile={profile} />
          )}
        </div>

      </div>
    </header>
  );
}
