import { Wrench, Image as ImageIcon, Type, Sparkles, ArrowRightLeft, Trophy } from 'lucide-react';
import AvatarTool from '@/components/tools/AvatarTool';
import FontGeneratorTool from '@/components/tools/FontGeneratorTool';
import TradeCalculatorTool from '@/components/tools/TradeCalculatorTool';
import WheelOfFortuneTool from '@/components/tools/WheelOfFortuneTool';

export const metadata = {
  title: 'Araçlar - HabboZone',
  description: 'HabboZone araçları ile avatar oluşturun, nadire takas hesaplayın ve şans çarkı çevirin.',
};

export default function ToolsPage() {
  return (
    <div className="pb-16 animate-in fade-in duration-500">
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-6 border-b border-[#14213a] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")',
            backgroundPosition: 'left center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1000px] w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1 flex items-center gap-2">
                    <Wrench size={32} className="text-[#f59e0b]" /> 
                    HABBO ARAÇLARI
                </h1>
                <p className="text-[#94a3b8] text-sm font-medium">Habbo deneyiminizi geliştirecek faydalı uygulamalar ve canlı hesaplayıcılar</p>
            </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tool 1: Avatar Generator */}
        <div className="bg-[#050a14] border border-[#14213a] rounded-lg overflow-hidden">
            <div className="bg-[#0a1325] border-b border-[#14213a] p-4 flex items-center gap-2">
                <ImageIcon size={18} className="text-[#3b82f6]" />
                <h2 className="text-[13px] font-bold text-white tracking-wide">AVATAR OLUŞTURUCU</h2>
            </div>
            <div className="p-6">
                <p className="text-[12px] text-[#94a3b8] mb-6">
                Herhangi bir Habbo karakterinin yüksek çözünürlüklü veya farklı duruşlardaki resmini saniyeler içinde oluştur ve indir.
                </p>
                <div className="bg-[#0a1325] border border-[#1e293b] rounded-lg p-4">
                    <AvatarTool />
                </div>
            </div>
        </div>

        {/* Tool 2: Pixel Font Generator */}
        <div className="bg-[#050a14] border border-[#14213a] rounded-lg overflow-hidden">
            <div className="bg-[#0a1325] border-b border-[#14213a] p-4 flex items-center gap-2">
                <Type size={18} className="text-[#a855f7]" />
                <h2 className="text-[13px] font-bold text-white tracking-wide">PİKSEL FONT YAZICI</h2>
            </div>
            <div className="p-6">
                <p className="text-[12px] text-[#94a3b8] mb-6">
                Klasik Habbo piksel fontlarıyla kendi yazılarını yaz, resim olarak forumda veya profilinde paylaş.
                </p>
                <div className="bg-[#0a1325] border border-[#1e293b] rounded-lg p-4">
                    <FontGeneratorTool />
                </div>
            </div>
        </div>

        {/* Tool 3: Trade Value Calculator */}
        <div className="bg-[#050a14] border border-[#14213a] rounded-lg overflow-hidden lg:col-span-2">
            <div className="bg-[#0a1325] border-b border-[#14213a] p-4 flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-[#22c55e]" />
                <h2 className="text-[13px] font-bold text-white tracking-wide">NADİRE TAKAS & DEĞER HESAPLAYICISI</h2>
            </div>
            <div className="p-6">
                <p className="text-[12px] text-[#94a3b8] mb-6">
                Takas edeceğiniz nadireleri karşı tarafın teklifiyle karşılaştırın. Kredi ve elmas endeksine göre anında kazanç/zarar analizi yapın ve sonucu kopyalayın!
                </p>
                <div className="bg-[#0a1325] border border-[#1e293b] rounded-lg p-4">
                    <TradeCalculatorTool />
                </div>
            </div>
        </div>

        {/* Tool 4: Wheel of Fortune */}
        <div className="bg-[#050a14] border border-[#14213a] rounded-lg overflow-hidden lg:col-span-2">
            <div className="bg-[#0a1325] border-b border-[#14213a] p-4 flex items-center gap-2">
                <Trophy size={18} className="text-[#ec4899]" />
                <h2 className="text-[13px] font-bold text-white tracking-wide">HABBO ÇEKİLİŞ & ŞANS ÇARKI</h2>
            </div>
            <div className="p-6">
                <p className="text-[12px] text-[#94a3b8] mb-6">
                Oda yarışmalarınızda, sandalye kapmaca oyunlarında veya rozet çekilişlerinde katılımcılarınızı ekleyerek adil ve eğlenceli şekilde kazananı seçin!
                </p>
                <div className="bg-[#0a1325] border border-[#1e293b] rounded-lg p-4">
                    <WheelOfFortuneTool />
                </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}
