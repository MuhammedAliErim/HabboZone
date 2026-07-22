import { Crown, Star, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import HabboAvatar from '@/components/HabboAvatar';

export const metadata = {
  title: 'VIP Kulübü | HabboZone',
  description: 'HabboZone VIP Kulübüne katılarak özel ayrıcalıklara sahip olun.',
};

export default function VIPPage() {
  const vipPackages = [
    {
      name: 'Altın VIP',
      price: '₺50 / Ay',
      color: 'from-yellow-400 to-amber-600',
      icon: <Star size={32} className="text-yellow-200" />,
      features: [
        'Profilde "Altın VIP" Rozeti',
        'Sarı renkli özel nick',
        'Forumda özel VIP kategorisine erişim',
        'Radyo isteklerinde öncelik',
        'Haberlere yorum yaparken özel çerçeve',
      ]
    },
    {
      name: 'Elmas VIP',
      price: '₺100 / Ay',
      color: 'from-cyan-400 to-blue-600',
      icon: <Crown size={32} className="text-cyan-100" />,
      popular: true,
      features: [
        'Profilde "Elmas VIP" hareketli rozet',
        'Turkuaz renkli ve parlayan özel nick',
        'Forumda VIP kategorisine ve Elmas odasına erişim',
        'Radyo isteklerinde en üst sırada yer alma',
        'Haber yorumlarında hareketli özel çerçeve',
        'HabboZone Discord sunucusunda "Elmas VIP" rolü',
        'Ayda 1 kez ücretsiz haber yayınlatma hakkı'
      ]
    },
    {
      name: 'Efsanevi VIP',
      price: '₺250 / Sınırsız',
      color: 'from-purple-500 to-pink-600',
      icon: <Sparkles size={32} className="text-pink-200" />,
      features: [
        'Profilde "Efsanevi VIP" hareketli ve kalıcı rozet',
        'İstediğiniz renk özel nick',
        'Tüm VIP özelliklerine sınırsız ve ömür boyu erişim',
        'Radyoda size özel 1 saatlik yayın seçeneği',
        'Site ekibi ile özel iletişim kanalı',
        'Site etkinliklerinde direkt katılım hakkı',
        'Habbo avatarınızın ana sayfada "Destekçilerimiz" kısmında yer alması'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-900/40 via-amber-900/40 to-yellow-900/40 border border-yellow-500/30 p-8 md:p-16 text-center">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown size={300} className="text-yellow-500" />
        </div>
        <div className="absolute top-0 left-0 p-8 opacity-10 pointer-events-none">
          <Crown size={300} className="text-yellow-500" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(251,191,36,0.5)] border-4 border-yellow-200">
            <Crown size={40} className="text-white drop-shadow-md" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-sm">
            VIP KULÜBÜ
          </h1>
          
          <p className="text-lg md:text-xl text-yellow-100/80 font-medium">
            HabboZone'u destekleyerek hem sitemizin büyümesine katkıda bulunun hem de birbirinden eşsiz ayrıcalıkların tadını çıkarın.
          </p>
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {vipPackages.map((pkg, index) => (
          <div 
            key={index} 
            className={`relative rounded-3xl overflow-hidden border ${
              pkg.popular 
                ? 'border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.15)] -translate-y-2' 
                : 'border-white/10 hover:border-white/20'
            } bg-black/40 transition-all duration-500`}
          >
            {pkg.popular && (
              <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-cyan-400 to-blue-500 py-1.5 text-center text-xs font-black uppercase tracking-widest text-white z-10 shadow-md">
                En Çok Tercih Edilen
              </div>
            )}
            
            <div className={`pt-12 pb-8 px-8 bg-gradient-to-br ${pkg.color} bg-opacity-10 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 opacity-20 -mr-4 -mt-4 transform rotate-12">
                {pkg.icon}
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black uppercase tracking-wider text-white drop-shadow-md">{pkg.name}</h3>
                <div className="mt-4 text-3xl font-bold text-white/90">{pkg.price}</div>
              </div>
            </div>
            
            <div className="p-8 space-y-6 bg-black/20">
              <ul className="space-y-4">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-medium text-white/70">
                    <CheckCircle2 size={20} className={`shrink-0 ${
                      pkg.popular ? 'text-cyan-400' : 'text-primary'
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-6 border-t border-white/5">
                <Link 
                  href="https://discord.gg/habbozone" 
                  target="_blank"
                  className={`block w-full py-4 rounded-xl text-center font-black uppercase tracking-widest transition-all ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Satın Al
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-blue-950/30 border border-blue-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-blue-500/20 rounded-full text-blue-400 shrink-0">
          <ShieldAlert size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-blue-300">Önemli Bilgilendirme</h3>
          <p className="text-blue-200/70 text-sm leading-relaxed">
            VIP paketleri aylık olarak yenilenir (Efsanevi VIP hariç). Satın alma işlemleri ve ödeme yöntemleri için Discord sunucumuzdaki <strong>#vip-destek</strong> kanalından veya site yöneticilerinden bizzat destek alabilirsiniz. Toplanan tüm gelirler HabboZone sunucu masrafları ve ödüllü etkinlikler için kullanılmaktadır.
          </p>
        </div>
      </div>
      
    </div>
  );
}
