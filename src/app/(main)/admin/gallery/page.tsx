import { createClient } from '@/utils/supabase/server'
import GalleryAdminClient from './_components/GalleryAdminClient'
import { Image as ImageIcon } from 'lucide-react'

export const metadata = {
  title: 'Galeri Yönetimi - Admin Paneli',
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
    .limit(20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <ImageIcon className="text-yellow-400" />
          Galeri Yönetimi
        </h1>
        <p className="text-gray-400 text-sm">
          Kullanıcıların yüklediği görselleri onaylayın veya reddedin.
        </p>
      </div>

      <GalleryAdminClient 
        pendingImages={pendingImages || []} 
        approvedImages={approvedImages || []} 
      />
    </div>
  )
}
