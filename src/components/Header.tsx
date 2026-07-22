import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import HabboAvatar from './HabboAvatar';
import { Settings, User as UserIcon, Crown, Coins } from 'lucide-react';
import Image from 'next/image';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1e293b] border-b-4 border-[#0f172a] shadow-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform drop-shadow-md pixel-borders bg-primary px-3 py-1">
            Habbo<span className="text-yellow-300">Zone</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-1 font-bold uppercase text-xs tracking-wider items-center h-full">
          <Link href="/" className="h-full flex items-center px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b-4 border-transparent hover:border-primary">Ana Sayfa</Link>
          <Link href="/news" className="h-full flex items-center px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b-4 border-transparent hover:border-primary">Haberler</Link>
          <Link href="/forum" className="h-full flex items-center px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b-4 border-transparent hover:border-primary">Forum</Link>
          <Link href="/gallery" className="h-full flex items-center px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b-4 border-transparent hover:border-primary">Galeri</Link>
          <Link href="/values" className="h-full flex items-center px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b-4 border-transparent hover:border-primary">Değerler</Link>
          <Link href="/leaderboard" className="h-full flex items-center px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b-4 border-transparent hover:border-primary">Liderlik</Link>
          <Link href="/staff" className="h-full flex items-center px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b-4 border-transparent hover:border-primary">Kadro</Link>
          <Link href="/vip" className="h-full flex items-center px-4 text-yellow-400 hover:text-yellow-300 hover:bg-white/10 transition-colors border-b-4 border-transparent hover:border-yellow-400 gap-1">
            <Crown size={14} className="mb-0.5" /> VIP
          </Link>
        </nav>

        {/* Auth Area */}
        <div className="flex items-center gap-4">
          {profile ? (
            <div className="flex items-center gap-2">
              
              <div className="hidden sm:flex items-center gap-1 bg-black/30 border border-black/50 rounded px-3 py-1 mr-2 shadow-inner">
                 <Coins size={14} className="text-yellow-400" />
                 <span className="text-white font-bold text-sm">{profile.hz_points || 0}</span>
              </div>

              <Link href={`/profile/${profile.username}`} className="flex items-center gap-2 bg-black/40 hover:bg-black/60 transition-colors rounded-full pr-4 p-1 border border-white/10 group shadow-md">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#82b428] flex items-center justify-center border border-black">
                  <HabboAvatar username={profile.habbo_username} size="m" headDirection={3} direction={3} className="w-12 h-12 -mt-4 group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-bold text-sm text-white">{profile.username}</span>
              </Link>
              
              <Link href="/settings" className="p-2 bg-white/10 hover:bg-primary hover:text-white rounded text-white/70 transition-colors border border-transparent hover:border-black" title="Ayarlar">
                <Settings size={18} />
              </Link>
              
            </div>
          ) : (
            <Link href="/login" className="habbo-button blue text-sm py-1.5 shadow-md">
              Giriş Yap
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-white">
            <div className="w-6 h-0.5 bg-current mb-1.5 rounded" />
            <div className="w-6 h-0.5 bg-current mb-1.5 rounded" />
            <div className="w-6 h-0.5 bg-current rounded" />
          </button>
        </div>

      </div>
    </header>
  );
}
