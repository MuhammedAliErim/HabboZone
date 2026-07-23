import { Crown, Star, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

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
      bgClass: 'from-orange-50 to-yellow-100',
      icon: <Star size={32} className="text-orange-500" />,
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
      headerClass: 'blue',
      bgClass: 'from-blue-50 to-cyan-100',
      icon: <Crown size={32} className="text-blue-500" />,
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
      headerClass: 'dark',
      bgClass: 'from-purple-50 to-pink-100',
      icon: <Sparkles size={32} className="text-purple-600" />,
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box bg-white overflow-hidden relative text-center">
        <div className="habbo-box-header orange">
          HabboZone Destekçileri
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-r from-orange-50 to-yellow-100 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Crown size={150} className="text-orange-600" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-orange-200">
                    <Crown size={32} className="text-orange-500 drop-shadow-sm" />
                </div>
                
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    VIP KULÜBÜ
                </h1>
                
                <p className="text-sm text-gray-600 font-medium max-w-lg mx-auto">
                    HabboZone'u destekleyerek hem sitemizin büyümesine katkıda bulunun hem de birbirinden eşsiz ayrıcalıkların tadını çıkarın.
                </p>
            </div>
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vipPackages.map((pkg, index) => (
          <div 
            key={index} 
            className={`habbo-box bg-white relative transition-transform duration-300 ${pkg.popular ? 'lg:-translate-y-2 lg:scale-105 shadow-md' : ''}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shadow-sm border border-yellow-500 z-20 whitespace-nowrap">
                En Çok Tercih Edilen
              </div>
            )}

            <div className={`habbo-box-header ${pkg.headerClass} relative z-10`}>
              {pkg.name}
            </div>
            
            <div className="p-0 bg-gray-50 flex flex-col h-full">
              <div className={`p-6 bg-gradient-to-br ${pkg.bgClass} flex flex-col items-center text-center border-b border-gray-200 relative overflow-hidden`}>
                <div className="absolute top-2 right-2 opacity-20">
                  {pkg.icon}
                </div>
                <div className="text-2xl font-black text-gray-800 drop-shadow-sm relative z-10 mb-1">{pkg.price}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest relative z-10">Abonelik Bedeli</div>
              </div>
              
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-bold text-gray-600">
                      <CheckCircle2 size={16} className={`shrink-0 ${
                        pkg.popular ? 'text-blue-500' : 'text-green-500'
                      }`} />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <Link 
                    href="https://discord.gg/habbozone" 
                    target="_blank"
                    className={`habbo-button ${pkg.popular ? 'blue' : 'green'} w-full flex items-center justify-center py-2 text-xs`}
                  >
                    Satın Al
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="habbo-box bg-white">
        <div className="habbo-box-header dark flex items-center gap-2">
            <ShieldAlert size={16} /> Önemli Bilgilendirme
        </div>
        <div className="p-6 bg-blue-50 flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-white rounded border border-blue-200 text-blue-500 shadow-inner shrink-0">
                <ShieldAlert size={32} />
            </div>
            <div className="space-y-2 text-center md:text-left">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Nasıl Satın Alınır?</h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    VIP paketleri aylık olarak yenilenir (Efsanevi VIP hariç). Satın alma işlemleri ve ödeme yöntemleri için Discord sunucumuzdaki <strong className="text-gray-800">#vip-destek</strong> kanalından veya site yöneticilerinden bizzat destek alabilirsiniz. Toplanan tüm gelirler HabboZone sunucu masrafları ve ödüllü etkinlikler için kullanılmaktadır.
                </p>
            </div>
        </div>
      </div>
      
    </div>
  );
}
