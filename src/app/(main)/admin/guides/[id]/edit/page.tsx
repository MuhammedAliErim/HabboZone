import GuideForm from '../../_components/GuideForm'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Rehber Düzenle - Admin Paneli',
}

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: guide } = await supabase
    .from('guides')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!guide) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={Edit}
        iconColor="text-blue-400"
        title="REHBERİ VE KILAVUZU GÜNCELLE"
        subtitle={
          <>
            <strong className="text-[#facc15]">{guide.title}</strong> rehberinin içeriğini, görsellerini ve bilgilerini düzenleyin.
          </>
        }
        actions={
          <Link
            href="/admin/guides"
            className="px-4 py-2 rounded-[3px] bg-[#050a14] border border-[#1e293b] hover:bg-[#0a1325] text-gray-300 hover:text-white font-bold text-xs uppercase transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Geri Dön
          </Link>
        }
      />

      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-8 shadow-2xl">
        <GuideForm initialData={guide} />
      </div>
    </div>
  )
}
