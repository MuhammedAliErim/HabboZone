import FeaturedSlider from '@/components/FeaturedSlider';
import NewsCard from '@/components/NewsCard';
import MarketWidget from '@/components/MarketWidget';
import { MOCK_NEWS, MOCK_MAGAZINES } from '@/lib/mockData';
import Link from 'next/link';

export default function Home() {
  const featuredNews = MOCK_NEWS.filter(n => n.is_featured);
  const regularNews = MOCK_NEWS.filter(n => !n.is_featured);
  const latestMagazine = MOCK_MAGAZINES[0];

  return (
    <div className="py-8 space-y-16">
      {/* Featured Slider */}
      <section>
        <FeaturedSlider items={featuredNews} />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: News Grid (Takes up 2/3 space on large screens) */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black/10 dark:border-white/10 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-4 h-4 bg-primary inline-block pixel-borders"></span>
              Son Haberler
            </h2>
            <Link href="/news" className="text-sm font-bold text-primary hover:underline">Tümünü Gör →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularNews.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>

        {/* Right Column: Magazine Showcase & Widgets */}
        <aside className="space-y-8">
          {/* Magazine Showcase */}
          <div className="bg-white/10 dark:bg-black/20 p-6 rounded-2xl border-4 border-white/20 shadow-lg relative overflow-hidden group">
            {/* Decorative background blob */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
            
            <h3 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
              <span className="text-2xl">📖</span> E-Dergi Vitrini
            </h3>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-48 h-64 bg-black/20 rounded-lg overflow-hidden shadow-2xl border-2 border-white/30 transform rotate-[-2deg] group-hover:rotate-0 transition-transform mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={latestMagazine.cover_image_url} 
                  alt={latestMagazine.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-lg mb-2">{latestMagazine.title}</h4>
              <p className="text-sm opacity-80 mb-6">Sayı #{latestMagazine.issue_number} • En son çıkan sürüm</p>
              
              <Link 
                href={`/magazines/${latestMagazine.id}`}
                className="w-full py-3 bg-primary text-white font-bold uppercase tracking-widest rounded-lg pixel-borders hover:bg-primary/90 transition-colors text-center"
              >
                Hemen Oku
              </Link>
            </div>
          </div>
          
          {/* Economy/Market Widget */}
          <MarketWidget />
        </aside>

      </div>
    </div>
  );
}
