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
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* AUTHENTIC HABBO HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#2563eb] text-white px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider">OYUNCU ARAÇLARI V4.0</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Ücretsiz Kullanım</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase flex items-center gap-2" style={{ textShadow: '2px 2px 0 #000' }}>
            <Wrench size={32} className="text-[#facc15]" /> HABBO ARAÇ MERKEZİ
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            Habbo oyun deneyiminizi geliştirecek, takaslarınızı güvenceye alacak ve odalarınızı şenlendirecek interaktif uygulamalar!
          </p>
        </div>

        <div className="bg-[#050a14] border border-[#1e293b] px-6 py-4 rounded-[4px] flex items-center gap-6 shrink-0 text-center">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Aktif Araç</div>
            <div className="text-xl font-black text-white flex items-center justify-center gap-1">
              <Star size={16} className="text-[#facc15]" /> 4 Ücretsiz
            </div>
          </div>
          <div className="h-8 w-px bg-[#1e293b]"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Sistem Durumu</div>
            <div className="text-xs font-black text-[#22c55e] flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> %100 Çalışır
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tool 1: Avatar Generator */}
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] flex flex-col">
          <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ImageIcon size={16} className="text-[#3b82f6]" /> AVATAR OLUŞTURUCU & GÖRSEL İNDİRİCİ
            </span>
            <span className="text-[9px] font-black text-[#3b82f6] bg-[#0a1325] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">
              CANLI API
            </span>
          </div>
          <div className="p-4 bg-[#0a1325] flex-1 flex flex-col justify-between">
            <p className="text-xs text-gray-300 font-medium mb-4 leading-relaxed bg-[#050a14] p-3 rounded-[3px] border border-[#1e293b]">
              Herhangi bir Habbo karakterinin adını yazarak farklı yön, boyut ve yüz ifadelerindeki saydam PNG resmini saniyeler içinde oluştur ve profilinde kullan!
            </p>
            <div className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4">
              <AvatarTool />
            </div>
          </div>
        </div>

        {/* Tool 2: Pixel Font Generator */}
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] flex flex-col">
          <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Type size={16} className="text-purple-400" /> PİKSEL FONT YAZICI & LOGO ÜRETİCİ
            </span>
            <span className="text-[9px] font-black text-purple-400 bg-[#0a1325] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">
              KLASİK STİL
            </span>
          </div>
          <div className="p-4 bg-[#0a1325] flex-1 flex flex-col justify-between">
            <p className="text-xs text-gray-300 font-medium mb-4 leading-relaxed bg-[#050a14] p-3 rounded-[3px] border border-[#1e293b]">
              Klasik Habbo piksel fontlarıyla istediğin yazıyı veya sloganı yaz, anında saydam resim olarak forum imzanda, rehberlerinde veya profilinde paylaş!
            </p>
            <div className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4">
              <FontGeneratorTool />
            </div>
          </div>
        </div>

        {/* Tool 3: Trade Value Calculator */}
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] lg:col-span-2">
          <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ArrowRightLeft size={16} className="text-[#22c55e]" /> NADİRE TAKAS & KREDİ DEĞERLEME HESAPLAYICISI
            </span>
            <span className="text-[9px] font-black text-[#f59e0b] bg-[#0a1325] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b] uppercase flex items-center gap-1">
              <Flame size={11} /> EN ÇOK KULLANILAN
            </span>
          </div>
          <div className="p-4 bg-[#0a1325]">
            <p className="text-xs text-gray-300 font-medium mb-4 leading-relaxed bg-[#050a14] p-3 rounded-[3px] border border-[#1e293b]">
              Takas edeceğiniz nadireleri karşı tarafın teklifiyle karşılaştırın. Kredi ve elmas endeksine göre anında kazanç/zarar analizi yapıp takas özetinizi tek tıkla kopyalayın!
            </p>
            <div className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4">
              <TradeCalculatorTool />
            </div>
          </div>
        </div>

        {/* Tool 4: Wheel of Fortune */}
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] lg:col-span-2">
          <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy size={16} className="text-pink-400" /> HABBO ÇEKİLİŞ & ŞANS ÇARKI V2.0
            </span>
            <span className="text-[9px] font-black text-pink-400 bg-[#0a1325] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">
              CANLI ANİMASYONLU
            </span>
          </div>
          <div className="p-4 bg-[#0a1325]">
            <p className="text-xs text-gray-300 font-medium mb-4 leading-relaxed bg-[#050a14] p-3 rounded-[3px] border border-[#1e293b]">
              Oda yarışmalarınızda, sandalye kapmaca oyunlarında veya rozet çekilişlerinizde katılımcılarınızı ekleyerek tamamen adil ve görsel şölen eşliğinde kazananı seçin!
            </p>
            <div className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4">
              <WheelOfFortuneTool />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
