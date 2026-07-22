import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import HabboAvatar from './HabboAvatar';
import { Settings, LogOut, User as UserIcon, Crown } from 'lucide-react';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border-b-4 border-white/30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-black tracking-tighter text-primary group-hover:scale-105 transition-transform drop-shadow-md">
            Habbo<span className="text-foreground">Zone</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 font-bold uppercase text-sm tracking-wide items-center">
          <Link href="/" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Ana Sayfa</Link>
          <Link href="/news" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Haberler</Link>
          <Link href="/forum" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Forum</Link>
          <Link href="/gallery" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Galeri</Link>
          <Link href="/leaderboard" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Liderlik</Link>
          <Link href="/staff" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Kadro</Link>
          <Link href="/vip" className="text-yellow-400 hover:text-yellow-300 transition-colors py-2 border-b-2 border-transparent hover:border-yellow-400 flex items-center gap-1">
            <Crown size={14} className="mb-0.5" /> VIP
          </Link>
        </nav>

        {/* Auth Area */}
        <div className="flex items-center gap-4">
          {profile ? (
            <div className="flex items-center gap-3">
              <Link href={`/profile/${profile.username}`} className="flex items-center gap-2 bg-black/40 hover:bg-black/60 transition-colors rounded-full pr-4 p-1 border border-white/10">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <HabboAvatar username={profile.habbo_username} size="m" headDirection={3} direction={3} className="w-12 h-12 -mt-4" />
                </div>
                <span className="font-bold text-sm">{profile.username}</span>
              </Link>
              
              <Link href="/settings" className="p-2 bg-white/10 hover:bg-primary hover:text-black rounded-xl transition-colors" title="Ayarlar">
                <Settings size={18} />
              </Link>
              
              {/* Çıkış yap butonu için form kullanılabilir ama şimdilik auth helpers ile Client component kullanılabilir veya direkt link verilebilir */}
            </div>
          ) : (
            <Link href="/login" className="bg-primary text-black font-black uppercase text-sm px-4 py-2 rounded-xl hover:scale-105 transition-transform shadow-md">
              Giriş Yap
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground">
            <div className="w-6 h-0.5 bg-current mb-1.5 rounded" />
            <div className="w-6 h-0.5 bg-current mb-1.5 rounded" />
            <div className="w-6 h-0.5 bg-current rounded" />
          </button>
        </div>

      </div>
    </header>
  );
}
