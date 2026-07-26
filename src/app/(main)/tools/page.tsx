import { Wrench, Image as ImageIcon, Type, Sparkles, ArrowRightLeft, Trophy, ShieldCheck, Flame, Star } from 'lucide-react';
import AvatarTool from '@/components/tools/AvatarTool';
import FontGeneratorTool from '@/components/tools/FontGeneratorTool';
import TradeCalculatorTool from '@/components/tools/TradeCalculatorTool';
import WheelOfFortuneTool from '@/components/tools/WheelOfFortuneTool';

export const metadata = {
  title: 'Habbo Araçları & Stüdyoları - HabboZone',
  description: 'HabboZone araçları ile avatar oluşturun, nadire takas hesaplayın ve şans çarkı çevirin.',
};

export default function ToolsPage() {
  return (
    <div className="pb-20 animate-in fade-in duration-500">
      
      {/* Hero Banner - Dark Premium v4.0 */}
      <section className="relative w-full min-h-[260px] mb-8 border-b-2 border-white/10 overflow-hidden flex flex-col justify-end p-8 bg-[#050b14]">
        <div 
          className="absolute inset-0 z-0 opacity-30 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")',
            backgroundPosition: 'left center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a1224] via-[#0a1224]/80 to-transparent"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-20 max-w-[1400px] w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <Sparkles size={14} className="text-yellow-400 animate-pulse" />
              YENİ NESİL OYUNCU ARAÇLARI V4.0
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2 flex items-center gap-3">
              <Wrench size={36} className="text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" /> 
              HABBO ARAÇ MERKEZİ
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-medium max-w-2xl">
              Habbo oyun deneyiminizi geliştirecek, takaslarınızı güvenceye alacak ve odalarınızı şenlendirecek interaktif uygulamalar!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#060d1a]/90 border-2 border-white/10 px-5 py-3 rounded-xl shadow-xl backdrop-blur-md">
            <div className="flex flex-col items-center border-r border-white/10 pr-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Aktif Araç Sayısı</span>
              <span className="text-xl font-black text-white flex items-center gap-1.5">
                <Star size={18} className="text-amber-400" /> 4 Ücretsiz
              </span>
            </div>
            <div className="flex flex-col items-center pl-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sistem Durumu</span>
              <span className="text-xl font-black text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={18} /> %100 Çalışır
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid - Dark Premium Habbo-Box Containers */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Tool 1: Avatar Generator */}
        <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
          <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ImageIcon size={18} className="text-blue-400" /> AVATAR OLUŞTURUCU & GÖRSEL İNDİRİCİ
            </span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
              CANLI API
            </span>
          </div>
          <div className="p-6 bg-[#050b14] flex-1 flex flex-col justify-between">
            <p className="text-xs text-gray-300 font-medium mb-6 leading-relaxed bg-[#0a1325]/60 p-4 rounded-xl border border-white/10">
              Herhangi bir Habbo karakterinin adını yazarak farklı yön, boyut ve yüz ifadelerindeki saydam PNG resmini saniyeler içinde oluştur ve profilinde kullan!
            </p>
            <div className="bg-[#0a1325]/90 border-2 border-white/10 rounded-2xl p-5 shadow-inner">
              <AvatarTool />
            </div>
          </div>
        </div>

        {/* Tool 2: Pixel Font Generator */}
        <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
          <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Type size={18} className="text-purple-400" /> PİKSEL FONT YAZICI & LOGO ÜRETİCİ
            </span>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              KLASİK STİL
            </span>
          </div>
          <div className="p-6 bg-[#050b14] flex-1 flex flex-col justify-between">
            <p className="text-xs text-gray-300 font-medium mb-6 leading-relaxed bg-[#0a1325]/60 p-4 rounded-xl border border-white/10">
              Klasik Habbo piksel fontlarıyla istediğin yazıyı veya sloganı yaz, anında saydam resim olarak forum imzanda, rehberlerinde veya profilinde paylaş!
            </p>
            <div className="bg-[#0a1325]/90 border-2 border-white/10 rounded-2xl p-5 shadow-inner">
              <FontGeneratorTool />
            </div>
          </div>
        </div>

        {/* Tool 3: Trade Value Calculator */}
        <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden lg:col-span-2">
          <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ArrowRightLeft size={18} className="text-emerald-400 animate-pulse" /> NADİRE TAKAS & KREDİ DEĞERLEME HESAPLAYICISI
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Flame size={12} className="text-orange-400" /> EN ÇOK KULLANILAN
            </span>
          </div>
          <div className="p-6 md:p-8 bg-[#050b14]">
            <p className="text-xs md:text-sm text-gray-300 font-medium mb-6 leading-relaxed bg-[#0a1325]/60 p-4.5 rounded-xl border border-white/10">
              Takas edeceğiniz nadireleri karşı tarafın teklifiyle karşılaştırın. Kredi ve elmas endeksine göre anında kazanç/zarar analizi yapıp takas özetinizi tek tıkla kopyalayın!
            </p>
            <div className="bg-[#0a1325]/90 border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
              <TradeCalculatorTool />
            </div>
          </div>
        </div>

        {/* Tool 4: Wheel of Fortune */}
        <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden lg:col-span-2">
          <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy size={18} className="text-pink-400 animate-bounce" /> HABBO ÇEKİLİŞ & ŞANS ÇARKI V2.0
            </span>
            <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 border border-pink-500/30 px-3 py-1 rounded-full">
              CANLI ANİMASYONLU
            </span>
          </div>
          <div className="p-6 md:p-8 bg-[#050b14]">
            <p className="text-xs md:text-sm text-gray-300 font-medium mb-6 leading-relaxed bg-[#0a1325]/60 p-4.5 rounded-xl border border-white/10">
              Oda yarışmalarınızda, sandalye kapmaca oyunlarında veya rozet çekilişlerinizde katılımcılarınızı ekleyerek tamamen adil ve görsel şölen eşliğinde kazananı seçin!
            </p>
            <div className="bg-[#0a1325]/90 border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
              <WheelOfFortuneTool />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
