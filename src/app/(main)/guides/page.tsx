import Link from 'next/link';
import { BookOpen, Search, ArrowRight } from 'lucide-react';

export default function GuidesPage() {
  const mockGuides = [
    { id: 1, title: 'Habbo\'ya Yeni Başlayanlar İçin', category: 'Temel Rehber', readTime: '5 dk okuma' },
    { id: 2, title: 'Nadir Eşya Takası Nasıl Yapılır?', category: 'Ticaret', readTime: '8 dk okuma' },
    { id: 3, title: 'Güvenli Hesabın Sırları', category: 'Güvenlik', readTime: '4 dk okuma' },
    { id: 4, title: 'Oda Tasarımında İpuçları', category: 'Mimari', readTime: '10 dk okuma' },
  ];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-6 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
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
                <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">REHBERLER</h1>
                <p className="text-[#94a3b8] text-sm font-medium">İhtiyacın olan tüm bilgileri burada bul!</p>
            </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockGuides.map(guide => (
              <Link href="#" key={guide.id} className="habbo-box habbo-card-hover p-5 group cursor-pointer block">
                  <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={16} className="text-[#3b82f6]" />
                      <span className="text-[11px] font-bold text-[#3b82f6] uppercase">{guide.category}</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-white mb-2 group-hover:text-[#3b82f6] transition-colors">{guide.title}</h3>
                  <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[#64748b]">{guide.readTime}</span>
                      <ArrowRight size={16} className="text-[#475569] group-hover:text-white transition-colors" />
                  </div>
              </Link>
          ))}
      </div>
    </div>
  );
}
