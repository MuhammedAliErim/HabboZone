import { Wrench, Image as ImageIcon, Type, Sparkles } from 'lucide-react';
import AvatarTool from '@/components/tools/AvatarTool';
import FontGeneratorTool from '@/components/tools/FontGeneratorTool';

export const metadata = {
  title: 'Araçlar - HabboZone',
  description: 'HabboZone araçları ile avatarınızı oluşturun, özel fontlar yazın.',
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
                <p className="text-[#94a3b8] text-sm font-medium">Habbo deneyiminizi geliştirecek faydalı uygulamalar</p>
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
        
        {/* Tool 3: Coming Soon */}
        <div className="bg-[#050a14] border border-[#14213a] rounded-lg overflow-hidden lg:col-span-2">
            <div className="bg-[#0a1325] border-b border-[#14213a] p-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#22c55e]" />
                <h2 className="text-[13px] font-bold text-white tracking-wide">YAKINDA GELECEK ARAÇLAR</h2>
            </div>
            <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#0a1325] border border-[#1e293b] rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Wrench size={28} className="text-[#475569]" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">Daha fazla araç yolda!</h3>
                <p className="text-[12px] text-[#94a3b8] max-w-md">
                    Oda planlayıcı, değer hesaplayıcı ve daha birçok Habbo aracı çok yakında HabboZone'da sizlerle olacak.
                </p>
            </div>
        </div>
        
      </div>
    </div>
  );
}
