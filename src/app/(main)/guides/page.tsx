import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export const revalidate = 60; // Cache for 60 seconds

export default async function GuidesPage() {
  const supabase = await createClient();

  const { data: guides } = await supabase
    .from('guides')
    .select('*')
    .order('created_at', { ascending: false });

  // Fallback to empty array if no guides
  const displayGuides = guides || [];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-6 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_2.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1000px] w-full mx-auto flex items-end justify-between">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">REHBERLER</h1>
                <p className="text-[#94a3b8] text-sm font-medium">HabboZone'u keşfetmek için ihtiyacın olan her şey!</p>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 bg-[#0a1325] border border-[#1e293b] rounded-md p-2">
                <input 
                  type="text" 
                  placeholder="Rehberlerde ara..." 
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-[200px] px-2"
                />
                <button className="text-[#64748b] hover:text-white transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#1e293b] pb-4 mb-6">
            <button className="px-6 py-2.5 bg-[#1e293b] text-white font-bold text-[12px] rounded border border-[#334155] transition-colors">
                TÜMÜ
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                BAŞLANGIÇ
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                MİMARİ
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                KABLOLU (WIRED)
            </button>
            <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                GÜVENLİK
            </button>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayGuides.length > 0 ? (
                displayGuides.map((guide) => (
                    <Link href="#" key={guide.id} className="habbo-box habbo-card-hover group flex flex-col overflow-hidden h-full">
                        
                        {/* Thumbnail */}
                        <div className="w-full h-[140px] relative border-b border-[#1e293b] overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={guide.image_url || 'https://images.habbo.com/c_images/reception/reception_backdrop_4.png'} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-2 left-2 bg-[#22c55e] text-black font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                                {guide.category}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-[15px] font-bold text-white group-hover:text-[#3b82f6] transition-colors mb-2 line-clamp-2">
                                {guide.title}
                            </h3>
                            <p className="text-[12px] text-[#94a3b8] line-clamp-3 mb-4 flex-1">
                                {guide.content}
                            </p>
                            
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1e293b]/50">
                                <div className="flex items-center gap-1.5 text-[11px] text-[#64748b] font-medium">
                                    <Clock size={12} />
                                    {guide.read_time}
                                </div>
                                <div className="text-[11px] font-bold text-[#3b82f6] group-hover:text-[#2563eb] transition-colors flex items-center gap-1">
                                    OKU <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                        
                    </Link>
                ))
            ) : (
                <div className="col-span-full text-center py-12 bg-[#0a1325] rounded-md border border-[#1e293b]">
                  <h3 className="text-gray-400 font-bold">Henüz hiç rehber bulunamadı.</h3>
                </div>
            )}
        </div>

        {displayGuides.length > 0 && (
            <div className="mt-8 text-center">
                <button className="text-[#64748b] hover:text-white font-bold text-[12px] transition-colors">
                    DAHA FAZLA YÜKLE ↓
                </button>
            </div>
        )}

      </div>
    </div>
  );
}
