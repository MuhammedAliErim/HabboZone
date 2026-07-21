import { createClient } from '@/utils/supabase/server';
import { Award } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function BadgesPage() {
  const supabase = await createClient();

  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Award size={200} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)]" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Koleksiyon Rozetleri
          </h1>
          <p className="text-lg text-white/70 font-medium">
            Sitede düzenlenen etkinliklerden ve özel görevlerden kazanabileceğiniz tüm rozetlerin listesi.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {badges?.map((badge) => (
          <div key={badge.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
            <div className="w-16 h-16 flex items-center justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badge.image_url} alt={badge.name} className="max-w-full max-h-full object-contain filter drop-shadow-xl" />
            </div>
            
            <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3">{badge.code}</span>
            <p className="text-xs text-white/50 line-clamp-3">{badge.description}</p>
          </div>
        ))}
      </div>

      {badges?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <Award size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Rozet Bulunamadı</h3>
          <p className="text-white/50">Henüz sisteme rozet eklenmemiş.</p>
        </div>
      )}

    </div>
  );
}

