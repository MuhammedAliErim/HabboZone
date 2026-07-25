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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Award className="text-yellow-400" size={32} /> ROZET KASASI (BADGE VAULT)
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Toplulukta dağıtılacak etkinlik, görev ve özel başarı rozetlerini yönetin ve yeni rozetler ekleyin.
          </p>
        </div>

        <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
          <Layers className="text-yellow-400" size={20} />
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Toplam Rozet</span>
            <span className="text-base font-black text-white">{badges?.length || 0} Adet</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Sütun: Yeni Rozet Ekle Formu */}
        <div className="lg:col-span-1 space-y-6">
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl shadow-2xl">
            <h2 className="text-base font-black text-white uppercase tracking-wider mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={18} /> Yeni Rozet Oluştur
            </h2>
            <BadgeForm />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-300 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-blue-400">
              <HelpCircle size={16} /> Habbo Rozet İpuçları
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
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#050a14]">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="text-amber-400" size={18} /> Aktif Rozet Koleksiyonu
              </h2>
              <span className="text-xs text-gray-400 font-bold">
                {badges?.length || 0} kayıtlı rozet
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">GÖRSEL</th>
                    <th className="px-6 py-4">ROZET ADI & HİKAYESİ</th>
                    <th className="px-6 py-4">KAZANMA YÖNTEMİ</th>
                    <th className="px-6 py-4 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {badges && badges.length > 0 ? (
                    badges.map((badge) => (
                      <tr key={badge.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="relative w-12 h-12 bg-[#050a14] border-2 border-white/10 rounded-xl flex items-center justify-center shadow-inner group-hover:border-yellow-400/50 transition-colors">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={badge.image_url} 
                              alt={badge.name} 
                              className="pixelated max-w-9 max-h-9 object-contain scale-110"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-black text-white text-base group-hover:text-yellow-400 transition-colors">
                            {badge.name}
                          </div>
                          {badge.description && (
                            <div className="text-xs text-gray-400 mt-0.5 max-w-[220px] truncate">
                              {badge.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-[260px]">
                          <span className="inline-block px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-xs text-blue-300 font-medium">
                            {badge.how_to_get || 'Yöntem belirtilmedi.'}
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
