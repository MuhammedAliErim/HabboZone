import Link from 'next/link';
import { Hash as Twitter, Camera as Instagram, MessageSquare as Discord, Shield, Book, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050a14] border-t-4 border-black pt-16 pb-8 relative z-10">
      <div className="max-w-[1200px] mx-auto px-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 mb-12">
            
            {/* Column 1: Brand & Desc */}
            <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-start gap-4 pr-0 lg:pr-8">
                <div className="font-black tracking-tighter leading-none transform -skew-x-6 flex items-center justify-center">
                    <span className="text-[#facc15] text-3xl drop-shadow-[0_2px_0_rgba(0,0,0,1)] -mr-1">HABBO</span>
                    <span className="text-white text-3xl drop-shadow-[0_2px_0_rgba(0,0,0,1)]">ZONE</span>
                </div>
                <p className="text-[12px] font-bold text-[#64748b] leading-relaxed text-left">
                  HabboZone, Türkiye'nin en büyük ve en güncel Habbo portalıdır. En yeni haberler, rehberler, değerler ve eğlenceli etkinliklerle Habbo maceranıza renk katıyoruz.
                </p>
                
                {/* Socials */}
                <div className="flex gap-2 mt-2">
                    <Link href="#" className="w-10 h-10 bg-[#1e293b] border-2 border-black rounded-[4px] flex items-center justify-center text-gray-300 hover:text-[#facc15] hover:-translate-y-1 hover:bg-[#0a1325] shadow-[2px_2px_0_#000] hover:shadow-none transition-all">
                        <Twitter size={18} />
                    </Link>
                    <Link href="#" className="w-10 h-10 bg-[#1e293b] border-2 border-black rounded-[4px] flex items-center justify-center text-gray-300 hover:text-[#facc15] hover:-translate-y-1 hover:bg-[#0a1325] shadow-[2px_2px_0_#000] hover:shadow-none transition-all">
                        <Instagram size={18} />
                    </Link>
                    <Link href="#" className="w-10 h-10 bg-[#1e293b] border-2 border-black rounded-[4px] flex items-center justify-center text-gray-300 hover:text-[#facc15] hover:-translate-y-1 hover:bg-[#0a1325] shadow-[2px_2px_0_#000] hover:shadow-none transition-all">
                        <Discord size={18} />
                    </Link>
                </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col gap-4">
                <h3 className="text-white font-black text-[14px] uppercase tracking-wider mb-2 border-l-4 border-[#facc15] pl-2">Hızlı Erişim</h3>
                <nav className="flex flex-col gap-2.5">
                    <Link href="/news" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">Haberler</Link>
                    <Link href="/forum" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">Topluluk (Forum)</Link>
                    <Link href="/magazines" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">HabboZone Gazetesi</Link>
                    <Link href="/values" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">Değerler</Link>
                    <Link href="/badges" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">Rozet Arşivi</Link>
                </nav>
            </div>

            {/* Column 3: Useful Links */}
            <div className="flex flex-col gap-4">
                <h3 className="text-white font-black text-[14px] uppercase tracking-wider mb-2 border-l-4 border-[#facc15] pl-2">Kurumsal</h3>
                <nav className="flex flex-col gap-2.5">
                    <Link href="/about" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all flex items-center gap-1.5"><Heart size={14}/> Hakkımızda</Link>
                    <Link href="/rules" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all flex items-center gap-1.5"><Shield size={14}/> Kurallar</Link>
                    <Link href="/terms" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all flex items-center gap-1.5"><Book size={14}/> Kullanım Şartları</Link>
                    <Link href="/contact" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">İletişim</Link>
                </nav>
            </div>

            {/* Column 4: Legal & Policies */}
            <div className="flex flex-col gap-4">
                <h3 className="text-white font-black text-[14px] uppercase tracking-wider mb-2 border-l-4 border-[#facc15] pl-2">Yasal</h3>
                <nav className="flex flex-col gap-2.5">
                    <Link href="/privacy" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">Gizlilik Politikası</Link>
                    <Link href="/cookies" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">Çerez Politikası</Link>
                    <Link href="/kvkk" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">KVKK Aydınlatma Metni</Link>
                    <Link href="/fan-site-policy" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">Fan Site Politikası</Link>
                    <Link href="/contact" className="text-[12px] font-bold text-gray-400 hover:text-[#facc15] hover:translate-x-1 transition-all">İçerik Kaldırma Talebi</Link>
                </nav>
            </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col items-center gap-4 pt-8 border-t border-[#1e293b]">
            <p className="max-w-4xl mx-auto text-[10px] font-bold text-[#475569] leading-relaxed text-center px-4">
            Bu HabboZone, Sulake Oy veya İştirakleri tarafından doğrulanmamış, onaylanmamış ve desteklenmemiştir ve bunlar ile bağlı değildir. Bu HabboZone, Habbo Fan Sitesi Poliçesi altında izin verilen ticaret markalarını ve diğer Habbo fikrî mülkiyetlerini kullanabilir.
            </p>
            <div className="text-[10px] text-[#facc15] font-black tracking-widest uppercase mt-2">
            &copy; {new Date().getFullYear()} HABBOZONE. TÜM HAKLARI SAKLIDIR.
            </div>
        </div>

      </div>
    </footer>
  );
}
