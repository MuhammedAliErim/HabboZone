import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import HabboAvatar from './HabboAvatar';
import { Settings, Crown, Coins } from 'lucide-react';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <header className="w-full bg-[#1e293b] border-b-[6px] border-[#0f172a] shadow-xl relative overflow-hidden">
      {/* Background Banner */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'repeat-x',
          imageRendering: 'pixelated'
        }}
      />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Top Area: Logo & User */}
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-6 md:gap-0">
          
          {/* Logo Area */}
          <Link href="/" className="flex flex-col items-center md:items-start group">
            <div className="text-4xl md:text-6xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] bg-[#0f172a]/50 p-2 rounded pixel-borders border-white/20">
              Habbo<span className="text-yellow-400">Zone</span>
            </div>
            <div className="text-xs font-bold text-white/80 bg-black/50 px-3 py-1 rounded-full mt-2 border border-white/10 shadow-inner">
              Türkiye'nin Yeni Habbo Topluluğu
            </div>
          </Link>
          
          {/* Main Auth / User Area */}
          <div className="flex items-center gap-3">
            {profile ? (
              <div className="flex items-center gap-3 bg-black/40 p-2 pr-4 rounded-xl border-2 border-[#0f172a] shadow-inner backdrop-blur-sm">
                <Link href={`/profile/${profile.username}`} className="relative group block shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#82b428] flex items-center justify-center border-2 border-black group-hover:bg-[#92c534] transition-colors relative z-10">
                    <HabboAvatar username={profile.habbo_username || 'Habbo'} size="l" headDirection={3} direction={3} className="w-20 h-20 -mt-6 group-hover:scale-110 transition-transform" />
                  </div>
                </Link>

                <div className="flex flex-col items-start justify-center hidden sm:flex">
                  <span className="font-black text-white drop-shadow-md text-lg leading-none mb-1">{profile.username}</span>
                  <div className="flex items-center gap-1 bg-black/50 border border-black/50 rounded-full px-2 py-0.5 shadow-inner mt-1">
                    <Coins size={12} className="text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-xs">{profile.hz_points || 0} HZ Puanı</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 ml-2 border-l border-white/10 pl-3">
                  <Link href="/settings" className="p-2 bg-white/10 hover:bg-white/30 rounded-lg border border-transparent hover:border-white/50 text-white transition-colors flex items-center justify-center" title="Ayarlar">
                    <Settings size={18} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 bg-black/40 p-4 rounded-xl border-2 border-[#0f172a] shadow-inner backdrop-blur-sm">
                <div className="text-sm font-bold text-white drop-shadow-md">Aramıza katıl!</div>
                <Link href="/login" className="habbo-button green text-sm py-2 px-6 shadow-lg hover:scale-105">
                  GİRİŞ YAP / KAYIT OL
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Bar (Thick classic fan site style) */}
        <nav className="flex overflow-x-auto no-scrollbar gap-1 font-black uppercase text-[11px] tracking-wider items-center bg-[#0f172a] p-1.5 rounded-t-xl border-4 border-b-0 border-[#334155]">
          <Link href="/" className="px-5 py-3 text-white hover:bg-[#1e293b] hover:text-white rounded-t-lg transition-colors whitespace-nowrap">Ana Sayfa</Link>
          <Link href="/news" className="px-5 py-3 text-white/70 hover:bg-[#1e293b] hover:text-white rounded-t-lg transition-colors whitespace-nowrap">Haberler</Link>
          <Link href="/forum" className="px-5 py-3 text-white/70 hover:bg-[#1e293b] hover:text-white rounded-t-lg transition-colors whitespace-nowrap">Forum</Link>
          <Link href="/gallery" className="px-5 py-3 text-white/70 hover:bg-[#1e293b] hover:text-white rounded-t-lg transition-colors whitespace-nowrap">Galeri</Link>
          <Link href="/values" className="px-5 py-3 text-white/70 hover:bg-[#1e293b] hover:text-white rounded-t-lg transition-colors whitespace-nowrap">Değerler</Link>
          <Link href="/leaderboard" className="px-5 py-3 text-white/70 hover:bg-[#1e293b] hover:text-white rounded-t-lg transition-colors whitespace-nowrap">Liderlik</Link>
          <Link href="/staff" className="px-5 py-3 text-white/70 hover:bg-[#1e293b] hover:text-white rounded-t-lg transition-colors whitespace-nowrap">Kadro</Link>
          <Link href="/vip" className="px-5 py-3 text-yellow-400 hover:bg-[#1e293b] hover:text-yellow-300 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ml-auto">
            <Crown size={14} className="mb-0.5" /> VIP KULÜBÜ
          </Link>
        </nav>

      </div>
    </header>
  );
}
