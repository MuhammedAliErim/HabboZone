import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { Award } from 'lucide-react';

export const metadata = { title: 'Rozetler - HabboZone', description: 'Habbo rozet arşivi — tüm rozetleri keşfedin ve nasıl kazanılacağını öğrenin.' };
export const revalidate = 60;

export default async function BadgesPage() {
  const supabase = await createClient();

  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* AUTHENTIC HABBO HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#be185d] text-white px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#831843]">ROZET MÜZESİ</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Resmi Koleksiyon</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
            HABBOZONE ROZETLERİ
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            Sitede düzenlenen etkinliklerden, özel görevlerden, turnuvalardan ve VIP üyeliklerden kazanabileceğiniz tüm özel nadire rozetlerin resmi listesi.
          </p>
        </div>

        <div className="bg-[#050a14] border border-[#1e293b] px-6 py-4 rounded-[4px] flex items-center gap-6 shrink-0 text-center">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Toplam Rozet</div>
            <div className="text-xl font-black text-white">{badges?.length || 0}</div>
          </div>
          <div className="h-8 w-px bg-[#1e293b]"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Durum</div>
            <div className="text-xs font-black text-[#22c55e]">Aktif</div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-[#facc15]" />
          <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">AKTİF KOLEKSİYON ROZETLERİ</h2>
        </div>
        <span className="text-gray-400 text-[11px] font-bold uppercase">TOPLAM {badges?.length || 0} ROZET</span>
      </div>

      {/* Grid */}
      <div className="habbo-box p-6 bg-[#0a1325] border border-[#1e293b]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {badges?.map((badge) => (
            <div key={badge.id} className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-3 flex flex-col items-center text-center hover:border-[#3b82f6] transition-all group">
              <div className="w-16 h-16 flex items-center justify-center mb-3 bg-[#0a1325] rounded-[2px] border border-[#1e293b] overflow-hidden relative">
                <Image src={badge.image_url} alt={badge.name} fill className="max-w-full max-h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform" unoptimized />
              </div>
              
              <h3 className="font-bold text-xs mb-1 text-white group-hover:text-[#facc15] transition-colors line-clamp-1">{badge.name}</h3>
              <span className="text-[9px] font-black uppercase tracking-wider text-black bg-[#facc15] px-1.5 py-0.5 rounded-[2px] mb-2">{badge.code}</span>
              <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight font-medium">{badge.description}</p>
            </div>
          ))}
        </div>

        {(!badges || badges.length === 0) && (
          <div className="text-center py-12 bg-[#050a14] border border-[#1e293b] rounded-[3px]">
            <Award size={40} className="mx-auto text-gray-600 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Rozet Bulunamadı</h3>
            <p className="text-xs text-gray-400">Henüz sisteme rozet eklenmemiş veya etkinlik bekleniyor.</p>
          </div>
        )}
      </div>

    </div>
  );
}
