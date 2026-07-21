import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Diamond, TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function ValuesPage() {
  const supabase = createClient();

  // Kategori listesini çek
  const { data: categories } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .order('name');

  // Son güncellenen eşyaları çek
  const { data: recentItems } = await supabase
    .from('habbo_items')
    .select('id, name, slug, image_url, current_value, currency_type, is_ltd, updated_at, habbo_item_categories(slug)')
    .order('updated_at', { ascending: false })
    .limit(6);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Diamond size={200} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)]" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Değer & Nadire Merkezi
          </h1>
          <p className="text-lg text-white/70 font-medium">
            Habbo dünyasındaki tüm nadire, LTD ve özel eşyaların güncel piyasa değerlerini takip et.
          </p>
        </div>
      </div>

      {/* Kategoriler Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2 bg-primary/20 rounded-lg text-primary">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest">Kategoriler</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <Link 
              key={category.id} 
              href={`/values/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-black/40 border border-white/5 p-6 hover:border-primary/50 transition-all hover:-translate-y-1 shadow-xl hover:shadow-primary/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
              <div className="flex items-start gap-4">
                {category.icon_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={category.icon_url} alt={category.name} className="w-12 h-12 object-contain filter drop-shadow-lg" />
                ) : (
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Diamond size={24} className="text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-sm text-white/50 mt-1 line-clamp-2">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
          {categories?.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/40">
              Henüz bir kategori eklenmemiş.
            </div>
          )}
        </div>
      </div>

      {/* Son Güncellenenler */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <Activity size={24} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest">Son Güncellenenler</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentItems?.map((item) => (
            <Link
              key={item.id}
              href={`/values/item/${item.slug}`}
              className="group bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-all hover:border-white/20"
            >
              <div className="h-20 w-20 flex items-center justify-center mb-3 relative">
                {item.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform" />
                ) : (
                  <Diamond size={32} className="text-white/20" />
                )}
                {item.is_ltd && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                    LTD
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm truncate w-full mb-2">{item.name}</h4>
              <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 w-full">
                <div className="font-black text-primary flex items-center justify-center gap-1">
                  {item.current_value}
                  <span className="text-[10px] uppercase text-white/50">{item.currency_type}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
