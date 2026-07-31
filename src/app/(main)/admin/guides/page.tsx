import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2, BookOpen, Layers, Sparkles, Clock } from 'lucide-react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStat from '@/components/admin/AdminStat'

export const revalidate = 0;

export const metadata = {
  title: 'Rehberler ve Bilgi Bankası - Admin Paneli',
}

export default async function AdminGuidesPage() {
  const supabase = await createClient()

  const { data: guides } = await supabase
    .from('guides')
    .select('*')
    .order('created_at', { ascending: false })

  const totalGuides = guides?.length || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={BookOpen}
        iconColor="text-[#facc15]"
        title="REHBERLER & BİLGİ BANKASI MERKEZİ"
        subtitle="Topluluk üyelerine Wired mekanizmaları, oda tasarımları ve oyun taktiklerini öğreten rehberleri organize edin."
        stats={
          <AdminStat
            label="Toplam Rehber"
            value={`${totalGuides} Adet`}
            icon={Layers}
            iconColor="text-[#facc15]"
          />
        }
        actions={
          <Link
            href="/admin/guides/new"
            className="habbo-button px-5 py-2.5 font-black transition-all flex items-center gap-2 shadow-lg text-xs uppercase"
          >
            <Plus size={18} />
            Yeni Rehber Ekle
          </Link>
        }
      />

      {/* Rehberler Tablosu */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#050a14]">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={18} /> Yayınlanan Kılavuzlar
          </h2>
          <span className="text-xs text-gray-400 font-bold">
            {totalGuides} rehber kaydı
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-[#1e293b]">
              <tr>
                <th className="px-6 py-4">KAPAK GÖRSELİ</th>
                <th className="px-6 py-4">REHBER BAŞLIĞI</th>
                <th className="px-6 py-4">KATEGORİ</th>
                <th className="px-6 py-4">OKUMA SÜRESİ</th>
                <th className="px-6 py-4 text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {guides && guides.length > 0 ? (
                guides.map((item) => (
                  <tr key={item.id} className="hover:bg-[#0a1325] transition-colors group">
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <div className="relative w-24 h-14 rounded-[3px] overflow-hidden border border-[#1e293b] shadow-md group-hover:border-yellow-400/50 transition-colors shrink-0">
                          <Image 
                            src={item.image_url} 
                            alt={item.title} 
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-14 rounded-[3px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center text-xs text-gray-500 italic">
                          Görsel Yok
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-white text-base group-hover:text-yellow-400 transition-colors">
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-[2px] text-xs font-bold uppercase">
                        {item.category || 'Genel'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-500" />
                        {item.read_time || '3 dk'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/guides/${item.id}/edit`}
                          className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-[3px] transition-all shadow-sm"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        
                        <form action={async () => {
                          'use server'
                          const sb = await createClient()
                          await sb.from('guides').delete().eq('id', item.id)
                        }}>
                          <button 
                            type="submit"
                            className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-[3px] transition-all shadow-sm"
                            title="Rehberi Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <BookOpen size={32} className="mx-auto text-gray-600 opacity-40" />
                      <p className="font-bold text-sm text-gray-400">Kasada hiç rehber bulunamadı.</p>
                      <p className="text-xs">Yukarıdaki "Yeni Rehber Ekle" butonuna tıklayarak ilk rehberi yayınlayın!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
