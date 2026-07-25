import { createClient } from '@/utils/supabase/server'
import GalleryAdminClient from './_components/GalleryAdminClient'
import { Image as ImageIcon, Sparkles, Layers, ShieldCheck } from 'lucide-react'

export const revalidate = 0;

export const metadata = {
  title: 'Galeri Denetim ve Onay Merkezi - Admin Paneli',
}

export default async function AdminGalleryPage() {
  const supabase = await createClient()

  const { data: pendingImages } = await supabase
    .from('gallery')
    .select('*, profiles(username, habbo_username)')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  const { data: approvedImages } = await supabase
    .from('gallery')
    .select('*, profiles(username, habbo_username)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(30)

  const pendingCount = pendingImages?.length || 0
  const approvedCount = approvedImages?.length || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık & Mini İstatistikler */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="text-yellow-400" size={32} /> GALERİ DENETİM & ONAY MERKEZİ
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Topluluk üyelerinin yüklediği oda tasarımları, etkinlik kareleri ve nostalji fotoğraflarını denetleyin.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <Sparkles className="text-yellow-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Bekleyen Onay</span>
              <span className="text-base font-black text-yellow-300">{pendingCount} Fotoğraf</span>
            </div>
          </div>

          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Son Onaylananlar</span>
              <span className="text-base font-black text-emerald-300">{approvedCount} Kayıt</span>
            </div>
          </div>
        </div>
      </div>

      <GalleryAdminClient 
        pendingImages={pendingImages || []} 
        approvedImages={approvedImages || []} 
      />
    </div>
  )
}
