import { createClient } from '@/utils/supabase/server';
import { Award, Sparkles } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function BadgesPage() {
  const supabase = await createClient();

  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box overflow-hidden relative text-center border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header flex items-center justify-center gap-2" style={{backgroundColor: '#be185d', borderBottomColor: '#9d174d'}}>
          <Award size={18} /> Rozet Koleksiyonu & Müzeyi Keşfet
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-br from-[#0a1224] via-[#111827] to-[#070c18] flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <Award size={220} className="text-pink-500" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 px-4 py-1.5 rounded-full text-pink-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles size={14} className="animate-spin" style={{ animationDuration: '4s' }} /> Resmi HabboZone Rozet Müzesi
                </div>
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Rozet Koleksiyonu
                </h1>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                    Sitede düzenlenen etkinliklerden, özel görevlerden, turnuvalardan ve VIP üyeliklerden kazanabileceğiniz tüm özel nadire rozetlerin listesi.
                </p>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="habbo-box overflow-hidden border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header dark flex items-center justify-between">
          <span className="flex items-center gap-2"><Award size={16} className="text-pink-400" /> Aktif Koleksiyon Rozetleri ({badges?.length || 0})</span>
          <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded font-black uppercase">Canlı Yayın</span>
        </div>

        <div className="p-6 bg-[#070c18]/90">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges?.map((badge) => (
                <div key={badge.id} className="bg-[#0a1325]/80 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center hover:bg-[#0f1d38] hover:border-pink-500/50 transition-all duration-300 shadow-xl group hover:-translate-y-1">
                <div className="w-20 h-20 flex items-center justify-center mb-4 bg-[#050b14]/90 rounded-lg border border-white/10 shadow-inner group-hover:border-pink-500/30 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={badge.image_url} alt={badge.name} className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform relative z-10" />
                </div>
                
                <h3 className="font-bold text-xs mb-1 text-white group-hover:text-pink-400 transition-colors">{badge.name}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 bg-pink-950/50 border border-pink-500/30 px-2 py-0.5 rounded shadow-sm mb-2">{badge.code}</span>
                <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">{badge.description}</p>
                </div>
            ))}
            </div>

            {badges?.length === 0 && (
            <div className="text-center py-16 bg-[#0a1325]/60 border border-white/10 rounded-xl">
                <Award size={48} className="mx-auto text-pink-500/50 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Rozet Bulunamadı</h3>
                <p className="text-xs text-gray-400">Henüz sisteme rozet eklenmemiş veya etkinlik bekleniyor.</p>
            </div>
            )}
        </div>
      </div>

    </div>
  );
}

