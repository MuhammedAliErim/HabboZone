import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2, Home, Users, Layers, Sparkles } from 'lucide-react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStat from '@/components/admin/AdminStat'

export const revalidate = 0;

export const metadata = {
  title: 'Popüler Odalar Yönetimi - Admin Paneli',
}

export default async function AdminRoomsPage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false })

  const totalCapacity = rooms?.reduce((acc, r) => acc + (r.max_users || 0), 0) || 0
  const activeRooms = rooms?.length || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={Home}
        iconColor="text-[#facc15]"
        title="HABBO ODALARI YÖNETİM MERKEZİ"
        subtitle="Topluluğun gözde mekanlarını, resmi oda listesini ve buluşma alanlarını organize edin."
        stats={
          <>
            <AdminStat
              label="Kayıtlı Mekan"
              value={`${activeRooms} Oda`}
              icon={Layers}
              iconColor="text-[#facc15]"
            />
            <AdminStat
              label="Toplam Kapasite"
              value={<span className="text-emerald-300">{totalCapacity} Kişi</span>}
              icon={Users}
              iconColor="text-emerald-400"
            />
          </>
        }
        actions={
          <Link
            href="/admin/rooms/new"
            className="habbo-button px-5 py-2.5 font-black transition-all flex items-center gap-2 shadow-lg text-xs uppercase"
          >
            <Plus size={18} />
            Yeni Oda Ekle
          </Link>
        }
      />

      {/* Oda Listesi Tablosu */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#050a14]">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={18} /> Gözde Odalar ve Mekan Listesi
          </h2>
          <span className="text-xs text-gray-400 font-bold">
            {activeRooms} aktif oda
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050a14] text-gray-400 uppercase text-xs font-black border-b border-[#1e293b]">
              <tr>
                <th className="px-6 py-4">ODA KAPAK GÖRSELİ</th>
                <th className="px-6 py-4">ODA ADI & AÇIKLAMA</th>
                <th className="px-6 py-4">SAHİP</th>
                <th className="px-6 py-4">KATEGORİ</th>
                <th className="px-6 py-4 text-center">KAPASİTE</th>
                <th className="px-6 py-4 text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rooms && rooms.length > 0 ? (
                rooms.map((item) => (
                  <tr key={item.id} className="hover:bg-[#0a1325] transition-colors group">
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <div className="relative w-24 h-14 rounded-[3px] overflow-hidden border border-[#1e293b] shadow-md group-hover:border-yellow-400/50 transition-colors shrink-0">
                          <Image 
                            src={item.image_url} 
                            alt={item.name} 
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
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-400 mt-0.5 max-w-[260px] truncate">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-yellow-400 text-xs bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-[2px]">
                        👤 {item.owner}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-[2px] text-xs font-bold uppercase">
                        {item.category || 'Popüler'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-white text-sm bg-black/40 px-3 py-1 rounded-[2px] border border-[#1e293b]">
                        {item.current_users || 0} / {item.max_users || 75}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/rooms/${item.id}/edit`}
                          className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-[3px] transition-all shadow-sm"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        
                        <form action={async () => {
                          'use server'
                          const sb = await createClient()
                          await sb.from('rooms').delete().eq('id', item.id)
                        }}>
                          <button 
                            type="submit"
                            className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-[3px] transition-all shadow-sm"
                            title="Odayı Sil"
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
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Home size={32} className="mx-auto text-gray-600 opacity-40" />
                      <p className="font-bold text-sm text-gray-400">Listede hiç Habbo odası bulunamadı.</p>
                      <p className="text-xs">Yukarıdaki "Yeni Oda Ekle" butonuna tıklayarak ilk odayı ekleyin!</p>
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
