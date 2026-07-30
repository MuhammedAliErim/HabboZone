import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import BadgeForm from './_components/BadgeForm'
import DeleteBadgeButton from './_components/DeleteBadgeButton'
import { Award, Shield, Sparkles, HelpCircle, Layers } from 'lucide-react'

export const revalidate = 0;

export const metadata = {
  title: 'Rozet Kasası (Badge Vault) - Admin Paneli',
}

export default async function AdminBadgesPage() {
  const supabase = await createClient()

  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#1e293b]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Award className="text-[#facc15]" size={28} /> ROZET KASASI (BADGE VAULT)
          </h1>
          <p className="text-xs text-gray-300 font-bold uppercase tracking-wide mt-1">
            Toplulukta dağıtılacak etkinlik, görev ve özel başarı rozetlerini yönetin ve yeni rozetler ekleyin.
          </p>
        </div>

        <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
          <Layers className="text-[#facc15]" size={18} />
          <div>
            <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">TOPLAM ROZET</span>
            <span className="text-sm font-black text-white uppercase">{badges?.length || 0} ADET</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Sütun: Yeni Rozet Ekle Formu */}
        <div className="lg:col-span-1 space-y-6">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] p-6 rounded-[3px] shadow-2xl">
            <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4 pb-3 border-b border-[#1e293b] flex items-center gap-2">
              <Sparkles className="text-[#facc15]" size={16} /> YENİ ROZET OLUŞTUR
            </h2>
            <BadgeForm />
          </div>

          <div className="habbo-box bg-[#050a14] border border-[#3b82f6]/30 rounded-[2px] p-4 text-xs text-blue-300 space-y-2 font-medium">
            <div className="font-black flex items-center gap-1.5 text-[#3b82f6] uppercase tracking-wider text-xs">
              <HelpCircle size={14} /> HABBO ROZET İPUÇLARI
            </div>
            <p>
              • Rozet görselleri <strong>PNG veya GIF</strong> formatında olmalı ve şeffaf arka plana sahip olmalıdır.
            </p>
            <p>
              • Habbo standartlarında rozet boyutları genellikle <strong>40x40 piksel</strong> civarındadır.
            </p>
          </div>
        </div>

        {/* Sağ Sütun: Ekli Rozetler Kasası */}
        <div className="lg:col-span-2">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
            <div className="habbo-box-header flex justify-between items-center">
              <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="text-[#facc15]" size={16} /> AKTİF ROZET KOLEKSİYONU
              </h2>
              <span className="text-[10px] text-gray-300 font-black uppercase tracking-wider bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px]">
                {badges?.length || 0} KAYITLI ROZET
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-[#1e293b] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">GÖRSEL</th>
                    <th className="px-5 py-3.5">ROZET ADI & HİKAYESİ</th>
                    <th className="px-5 py-3.5">KAZANMA YÖNTEMİ</th>
                    <th className="px-5 py-3.5 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {badges && badges.length > 0 ? (
                    badges.map((badge) => (
                      <tr key={badge.id} className="hover:bg-[#050a14] transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="relative w-11 h-11 bg-[#050a14] border border-[#1e293b] rounded-[2px] flex items-center justify-center shadow group-hover:border-[#facc15] transition-colors">
                            <Image 
                              src={badge.image_url} 
                              alt={badge.name} 
                              width={32}
                              height={32}
                              className="pixelated object-contain scale-110"
                              unoptimized
                            />
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-black text-white text-sm uppercase tracking-tight group-hover:text-[#facc15] transition-colors">
                            {badge.name}
                          </div>
                          {badge.description && (
                            <div className="text-[11px] text-gray-400 mt-0.5 max-w-[220px] truncate font-bold">
                              {badge.description}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 max-w-[260px]">
                          <span className="inline-block px-2.5 py-1 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-[11px] text-[#3b82f6] font-bold uppercase tracking-wider">
                            {badge.how_to_get || 'YÖNTEM BELİRTİLMEDİ.'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DeleteBadgeButton id={badge.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        <div className="max-w-xs mx-auto space-y-2">
                          <Award size={32} className="mx-auto text-gray-600 opacity-40" />
                          <p className="font-bold text-sm text-gray-400">Kasada hiç rozet bulunamadı.</p>
                          <p className="text-xs">Soldaki formu kullanarak hemen yeni bir rozet ekleyin!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
