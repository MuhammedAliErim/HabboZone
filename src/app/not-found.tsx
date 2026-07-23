import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center justify-center py-20 px-4 animate-in fade-in duration-500">
        <div className="habbo-box max-w-md w-full p-8 text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-[#1e293b] rounded-full border-4 border-black flex items-center justify-center relative shadow-[4px_4px_0_#000]">
            <img src="https://images.habbo.com/c_images/album1584/ADM.gif" alt="404 Error" className="scale-150 pixelated opacity-80" />
            <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1 border-2 border-black">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-black text-[#facc15] mb-2 drop-shadow-[0_2px_0_#000]">404</h1>
            <h2 className="text-xl font-bold text-white mb-2">Sayfa Bulunamadı</h2>
            <p className="text-[#94a3b8] text-sm">
              Aradığın sayfa Habbo Hotel'in karanlık koridorlarında kaybolmuş veya Frank onu yanlışlıkla silmiş olabilir.
            </p>
          </div>

          <Link href="/" className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-[13px] px-8 py-3 rounded-[4px] border-2 border-black shadow-[0_4px_0_#14532d] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 uppercase tracking-wide">
            <Home size={16} />
            Lobiye Dön
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
