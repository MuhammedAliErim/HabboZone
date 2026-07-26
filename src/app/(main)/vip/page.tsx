import { Crown, Star, Sparkles, CheckCircle2, ShieldAlert, Zap, Award } from 'lucide-react';
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
      headerClass: 'orange',
      bgClass: 'from-amber-950/60 via-[#0a1325]/90 to-[#0a1325]/80 border-2 border-amber-500/40 hover:border-amber-400',
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      icon: <Star size={36} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />,
      features: [
        'Profilde "Altın VIP" Özel Rozeti',
        'Sarı ve altın rengi parlayan özel nick',
        'Forumda özel VIP kulübü kategorisine erişim',
        'Radyo istek saatlerinde VIP önceliği',
        'Haber yorumlarında altın çerçeve & etiket',
      ]
    },
    {
      name: 'Elmas VIP',
      price: '₺100 / Ay',
      headerClass: 'blue',
      bgClass: 'from-cyan-950/60 via-[#0a1325]/90 to-[#0a1325]/80 border-2 border-cyan-400/60 hover:border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.2)]',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
      icon: <Crown size={36} className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-pulse" />,
      popular: true,
      features: [
        'Profilde "Elmas VIP" hareketli ve parlayan rozet',
        'Turkuaz renkli, neon efektli özel nick',
        'Forumda VIP ve Elmas lobi odalarına özel erişim',
        'Radyo isteklerinde en üst sırada anında çalınma',
        'Haber yorumlarında hareketli turkuaz çerçeve',
        'HabboZone Discord sunucusunda "Elmas VIP" rolü',
        'Ayda 1 kez ücretsiz özel haber yayınlatma hakkı'
      ]
    },
    {
      name: 'Efsanevi VIP',
      price: '₺250 / Sınırsız',
      headerClass: 'dark',
      bgClass: 'from-purple-950/60 via-[#0a1325]/90 to-[#0a1325]/80 border-2 border-purple-500/50 hover:border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.2)]',
      badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      icon: <Sparkles size={36} className="text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,0.8)] animate-spin" style={{ animationDuration: '6s' }} />,
      features: [
        'Profilde "Efsanevi VIP" hareketli & ömür boyu kalıcı rozet',
        'İstediğiniz renk RGB animasyonlu nick',
        'Tüm VIP özelliklerine sınırsız ve ömür boyu erişim',
        'Radyoda size özel 1 saatlik DJ yayın seçeneği',
        'Site üst yönetimi ile özel direkt iletişim kanalı',
        'Tüm site ödüllü turnuvalarına direkt final katılım hakkı',
        'Habbo avatarınızın ana sayfada Şeref Köşesi kısmında yer alması'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box overflow-hidden relative text-center border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header flex items-center justify-center gap-2" style={{backgroundColor: '#d97706', borderBottomColor: '#b45309'}}>
          <Crown size={18} /> HabboZone Destekçileri & VIP Elit Kulübü
        </div>
        
        <div className="p-8 md:p-14 bg-gradient-to-br from-[#0a1224] via-[#111827] to-[#070c18] flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <Crown size={260} className="text-amber-500" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Zap size={14} className="text-yellow-400 animate-bounce" /> Ayrıcalıklı Habbo Deneyimi
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    VIP KULÜBÜ
                </h1>
                
                <p className="text-sm md:text-base text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
                    HabboZone'u destekleyerek hem sitemizin büyümesine ve etkinlik ödüllerine katkıda bulunun, hem de otelde ve sitede birbirinden eşsiz prestijli ayrıcalıkların tadını çıkarın!
                </p>

                <div className="pt-4 flex justify-center gap-3">
                  <div className="bg-[#050b14]/80 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
                    <HabboAvatar username="MuhammedAliErim" headDirection={3} direction={3} size="m" action="wlk" className="-mt-3 w-10 h-10 shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-black text-amber-400 flex items-center gap-1">Altın Üye <Star size={12} /></div>
                      <div className="text-[10px] text-gray-400">Prestijli Görünüm</div>
                    </div>
                  </div>
                  <div className="bg-[#050b14]/80 border border-cyan-500/30 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg hidden sm:flex">
                    <HabboAvatar username="Erım" headDirection={3} direction={3} size="m" action="wlk" className="-mt-3 w-10 h-10 shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-black text-cyan-400 flex items-center gap-1">Elmas Lider <Crown size={12} /></div>
                      <div className="text-[10px] text-gray-400">Öncelikli İstekler</div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vipPackages.map((pkg, index) => (
          <div 
            key={index} 
            className={`habbo-box overflow-hidden relative transition-all duration-300 ${pkg.popular ? 'lg:-translate-y-2 lg:scale-105 shadow-2xl z-10' : 'shadow-xl'}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.8)] border border-cyan-300 z-20 whitespace-nowrap animate-pulse">
                ★ En Çok Tercih Edilen ★
              </div>
            )}

            <div className={`habbo-box-header ${pkg.headerClass} relative z-10 flex items-center justify-between`}>
              <span>{pkg.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${pkg.badgeClass}`}>Prestij</span>
            </div>
            
            <div className="p-0 bg-[#070c18]/90 flex flex-col h-full">
              <div className={`p-6 bg-gradient-to-br ${pkg.bgClass} flex flex-col items-center text-center relative overflow-hidden`}>
                <div className="absolute top-2 right-2 opacity-20">
                  {pkg.icon}
                </div>
                <div className="mb-2">{pkg.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10 mb-1">{pkg.price}</div>
                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest relative z-10">Abonelik Bedeli</div>
              </div>
              
              <div className="p-6 space-y-5 flex-1 flex flex-col bg-[#070c18]/90">
                <ul className="space-y-3.5 flex-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-gray-300 group">
                      <CheckCircle2 size={16} className={`shrink-0 mt-0.5 transition-transform group-hover:scale-125 ${
                        pkg.popular ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-amber-400'
                      }`} />
                      <span className="leading-relaxed group-hover:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <Link 
                    href="https://discord.gg/habbozone" 
                    target="_blank"
                    className={`habbo-button ${pkg.popular ? 'blue' : 'green'} w-full flex items-center justify-center py-2.5 text-xs font-black tracking-wider shadow-lg hover:brightness-110`}
                  >
                    Hemen Başvur & Satın Al
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="habbo-box overflow-hidden border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header dark flex items-center justify-between">
            <span className="flex items-center gap-2"><ShieldAlert size={16} className="text-cyan-400" /> Önemli VIP Bilgilendirmesi</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-black uppercase">Güvenli İşlem</span>
        </div>
        <div className="p-6 bg-gradient-to-r from-[#0a1224] to-[#070c18] flex flex-col md:flex-row items-center gap-6">
            <div className="p-5 bg-[#050b14] rounded-2xl border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] shrink-0">
                <Award size={40} className="animate-pulse" />
            </div>
            <div className="space-y-2 text-center md:text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                  VIP Nasıl Satın Alınır & Yenilenir?
                </h3>
                <p className="text-xs text-gray-300 font-medium leading-relaxed">
                    VIP paketleri aylık olarak yenilenir (Efsanevi VIP hariç ömür boyudur). Satın alma işlemleri, kart & EFT seçenekleri ve anında üyelik aktivasyonu için Discord sunucumuzdaki <strong className="text-cyan-400 font-bold">#vip-destek</strong> kanalından veya site yöneticilerinden bizzat destek alabilirsiniz. Toplanan tüm gelirler doğrudan HabboZone sunucu masrafları, turnuva ödülleri ve topluluk etkinlikleri için kullanılmaktadır.
                </p>
            </div>
        </div>
      </div>
      
    </div>
  );
}

