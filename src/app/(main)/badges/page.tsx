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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box bg-white overflow-hidden relative text-center">
        <div className="habbo-box-header" style={{backgroundColor: '#E91E63', borderBottomColor: '#C2185B'}}>
          Koleksiyon Rozetleri
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-r from-pink-50 to-pink-100 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Award size={150} className="text-pink-600" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    Rozet Koleksiyonu
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                    Sitede düzenlenen etkinliklerden ve özel görevlerden kazanabileceğiniz tüm rozetlerin listesi.
                </p>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="habbo-box bg-white">
        <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges?.map((badge) => (
                <div key={badge.id} className="bg-white border border-gray-200 rounded p-4 flex flex-col items-center text-center hover:bg-pink-50 hover:border-pink-300 transition-colors shadow-sm group">
                <div className="w-16 h-16 flex items-center justify-center mb-4 bg-gray-50 rounded border border-gray-100 shadow-inner group-hover:bg-white transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={badge.image_url} alt={badge.name} className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform" />
                </div>
                
                <h3 className="font-bold text-xs mb-1 text-gray-800 group-hover:text-pink-700 transition-colors">{badge.name}</h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-pink-700 bg-pink-100 border border-pink-200 px-2 py-0.5 rounded shadow-sm mb-2">{badge.code}</span>
                <p className="text-[10px] text-gray-500 line-clamp-3 leading-tight">{badge.description}</p>
                </div>
            ))}
            </div>

            {badges?.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-200 rounded">
                <Award size={48} className="mx-auto text-gray-300 mb-2" />
                <h3 className="text-sm font-bold text-gray-700 mb-1">Rozet Bulunamadı</h3>
                <p className="text-xs text-gray-500">Henüz sisteme rozet eklenmemiş.</p>
            </div>
            )}
        </div>
      </div>

    </div>
  );
}
