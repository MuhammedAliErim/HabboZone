import { Crown, Star, CheckCircle2, ShieldAlert, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import HabboAvatar from '@/components/HabboAvatar';

export const metadata = {
  title: 'VIP Kulübü | HabboZone',
  description: 'HabboZone VIP Kulübüne katılarak özel ayrıcalıklara sahip olun.',
};

export default function VIPPage() {
  const vipPackages = [
    {
      name: 'ALTIN VIP',
      price: '₺50 / AY',
      badgeClass: 'bg-[#f59e0b] text-black font-black',
      borderClass: 'border-[#f59e0b]',
      icon: <Star size={28} className="text-[#f59e0b]" />,
      features: [
        'Profilde "Altın VIP" Özel Rozeti',
        'Sarı ve altın rengi parlayan özel nick',
        'Forumda özel VIP kulübü kategorisine erişim',
        'Radyo istek saatlerinde VIP önceliği',
        'Haber yorumlarında altın çerçeve & etiket',
      ]
    },
    {
      name: 'ELMAS VIP',
      price: '₺100 / AY',
      badgeClass: 'bg-[#3b82f6] text-white font-black',
      borderClass: 'border-[#3b82f6]',
      icon: <Crown size={28} className="text-[#3b82f6]" />,
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
      name: 'EFSANEVİ VIP',
      price: '₺250 / SINIRSIZ',
      badgeClass: 'bg-[#a855f7] text-white font-black',
      borderClass: 'border-[#a855f7]',
      icon: <Award size={28} className="text-[#a855f7]" />,
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
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* AUTHENTIC HABBO HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#f59e0b] text-black px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#b45309]">VIP KULÜBÜ</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Ayrıcalıklı Deneyim</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
            HABBOZONE VIP KULÜBÜ
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            HabboZone'u destekleyerek hem sitemizin büyümesine ve etkinlik ödüllerine katkıda bulunun, hem de otelde ve sitede birbirinden eşsiz prestijli ayrıcalıkların tadını çıkarın!
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <div className="bg-[#050a14] border border-[#1e293b] px-3 py-1.5 rounded-[3px] flex items-center gap-2">
              <HabboAvatar username="MuhammedAliErim" headDirection={3} direction={3} size="m" action="wlk" className="-mt-2 w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-black text-[#f59e0b] flex items-center gap-1">Altın Üye <Star size={10} /></div>
                <div className="text-[9px] text-gray-400">Prestijli Görünüm</div>
              </div>
            </div>
            <div className="bg-[#050a14] border border-[#1e293b] px-3 py-1.5 rounded-[3px] flex items-center gap-2">
              <HabboAvatar username="Erım" headDirection={3} direction={3} size="m" action="wlk" className="-mt-2 w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-black text-[#3b82f6] flex items-center gap-1">Elmas Lider <Crown size={10} /></div>
                <div className="text-[9px] text-gray-400">Öncelikli İstekler</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Crown size={16} className="text-[#facc15]" />
          <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">VIP PAKETLERİ & AYRICALIKLAR</h2>
        </div>
        <span className="text-gray-400 text-[11px] font-bold uppercase">ABONELİK SEÇENEKLERİ</span>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {vipPackages.map((pkg, index) => (
          <div 
            key={index} 
            className={`habbo-box bg-[#0a1325] border ${pkg.popular ? 'border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-[#1e293b]'} flex flex-col justify-between`}
          >
            <div>
              <div className="bg-[#050a14] border-b border-[#1e293b] p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {pkg.icon}
                  <span className="font-black text-white text-sm tracking-wide">{pkg.name}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-[2px] uppercase ${pkg.badgeClass}`}>
                  {pkg.popular ? 'EN ÇOK TERCİH EDİLEN' : 'PRESTİJ'}
                </span>
              </div>
              
              <div className="p-4 bg-[#0a1325] border-b border-[#1e293b] text-center">
                <div className="text-2xl font-black text-white">{pkg.price}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ABONELİK BEDELİ</div>
              </div>
              
              <div className="p-5">
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-gray-300">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#22c55e]" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-5 pt-0 mt-auto">
              <Link 
                href="https://discord.gg/habbozone" 
                target="_blank"
                className="w-full bg-[#15803d] hover:bg-[#16a34a] text-white font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-[3px] border-b-4 border-[#166534] active:border-b-0 active:translate-y-[4px] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Zap size={14} /> HEMEN BAŞVUR & SATIN AL
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-[#050a14] rounded-[3px] border border-[#1e293b] text-[#facc15] shrink-0">
          <ShieldAlert size={36} />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            VIP NASIL SATIN ALINIR & YENİLENİR?
          </h3>
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
            VIP paketleri aylık olarak yenilenir (Efsanevi VIP hariç ömür boyudur). Satın alma işlemleri, kart & EFT seçenekleri ve anında üyelik aktivasyonu için Discord sunucumuzdaki <strong className="text-[#3b82f6] font-bold">#vip-destek</strong> kanalından veya site yöneticilerinden bizzat destek alabilirsiniz. Toplanan tüm gelirler doğrudan HabboZone sunucu masrafları, turnuva ödülleri ve topluluk etkinlikleri için kullanılmaktadır.
          </p>
        </div>
      </div>
      
    </div>
  );
}
