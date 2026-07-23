import { Wrench, Image as ImageIcon, Type, Sparkles } from 'lucide-react';
import AvatarTool from '@/components/tools/AvatarTool';
import FontGeneratorTool from '@/components/tools/FontGeneratorTool';

export const metadata = {
  title: 'Araçlar - HabboZone',
  description: 'HabboZone araçları ile avatarınızı oluşturun, özel fontlar yazın.',
};

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#0b1120] rounded-xl flex items-center justify-center border border-[#1e293b] shadow-lg">
          <Wrench size={24} className="text-[#f59e0b]" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">HABBO ARAÇLARI</h1>
          <p className="text-sm font-medium text-gray-500">Habbo deneyiminizi geliştirecek faydalı uygulamalar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tool 1: Avatar Generator */}
        <section className="habbo-box">
          <div className="habbo-box-header flex items-center gap-2">
            <ImageIcon size={18} className="text-blue-400" /> AVATAR OLUŞTURUCU
          </div>
          <div className="bg-white p-6">
            <p className="text-sm text-gray-600 mb-6">
              Herhangi bir Habbo karakterinin yüksek çözünürlüklü veya farklı duruşlardaki resmini saniyeler içinde oluştur ve indir.
            </p>
            <AvatarTool />
          </div>
        </section>

        {/* Tool 2: Pixel Font Generator */}
        <section className="habbo-box">
          <div className="habbo-box-header flex items-center gap-2">
            <Type size={18} className="text-purple-400" /> PİKSEL FONT YAZICI
          </div>
          <div className="bg-white p-6">
            <p className="text-sm text-gray-600 mb-6">
              Klasik Habbo piksel fontlarıyla kendi yazılarını yaz, resim olarak forumda veya profilinde paylaş.
            </p>
            <FontGeneratorTool />
          </div>
        </section>
        
        {/* Tool 3: Coming Soon */}
        <section className="habbo-box lg:col-span-2">
           <div className="habbo-box-header flex items-center gap-2">
            <Sparkles size={18} className="text-green-400" /> YAKINDA GELECEK ARAÇLAR
          </div>
          <div className="bg-[#f8fafc] p-12 flex flex-col items-center justify-center border-t border-gray-100 text-center">
             <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Wrench size={28} className="text-gray-400" />
             </div>
             <h3 className="text-lg font-black text-gray-800 mb-2">Daha fazla araç yolda!</h3>
             <p className="text-sm text-gray-500 max-w-md">
                Oda planlayıcı, değer hesaplayıcı ve daha birçok Habbo aracı çok yakında HabboZone'da sizlerle olacak.
             </p>
          </div>
        </section>
      </div>
    </div>
  );
}
