import { Hammer, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ComingSoon({ title, description }: { title: string, description: string }) {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-16 animate-in fade-in duration-500 w-full">
      <div className="habbo-box p-12 text-center flex flex-col items-center justify-center relative overflow-hidden bg-[#0f172a]">
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Hammer size={120} />
        </div>
        
        <div className="w-24 h-24 bg-[#1e293b] rounded-full border-4 border-black flex items-center justify-center relative mb-6 shadow-[0_4px_0_#000]">
            <img src="https://images.habbo.com/c_images/album1584/ADM.gif" alt="Construction" className="scale-125 pixelated opacity-80" />
            <div className="absolute -bottom-2 -right-2 bg-[#facc15] rounded-full p-1.5 border-2 border-black">
              <Clock size={20} className="text-black" />
            </div>
        </div>

        <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-3 relative z-10 drop-shadow-[0_2px_0_#000]">
            {title}
        </h1>
        <div className="w-16 h-1 bg-[#facc15] mb-4"></div>
        <p className="text-gray-400 text-[14px] max-w-md mx-auto mb-8 relative z-10 font-medium leading-relaxed">
            {description}
        </p>

        <Link href="/" className="habbo-button outline px-6 py-3 relative z-10 text-[12px] uppercase">
            Lobiye Geri Dön
        </Link>
      </div>
    </div>
  );
}
