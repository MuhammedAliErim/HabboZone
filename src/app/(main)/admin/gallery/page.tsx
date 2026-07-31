import { createClient } from '@/utils/supabase/server'
import GalleryAdminClient from './_components/GalleryAdminClient'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStat from '@/components/admin/AdminStat'
import { Image as ImageIcon, Sparkles, ShieldCheck } from 'lucide-react'

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
      <AdminPageHeader
        icon={ImageIcon}
        iconColor="text-[#facc15]"
        title="GALERİ DENETİM & ONAY MERKEZİ"
        subtitle="Topluluk üyelerinin yüklediği oda tasarımları, etkinlik kareleri ve nostalji fotoğraflarını denetleyin."
        stats={
          <>
            <AdminStat
              label="Bekleyen Onay"
              value={<span className="text-yellow-300">{pendingCount} Fotoğraf</span>}
              icon={Sparkles}
              iconColor="text-[#facc15]"
            />
            <AdminStat
              label="Son Onaylananlar"
              value={<span className="text-emerald-300">{approvedCount} Kayıt</span>}
              icon={ShieldCheck}
              iconColor="text-emerald-400"
            />
          </>
        }
      />

      <GalleryAdminClient 
        pendingImages={pendingImages || []} 
        approvedImages={approvedImages || []} 
      />
    </div>
  )
}
