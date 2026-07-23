import GuideForm from '../../_components/GuideForm'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditGuidePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: guide } = await supabase
    .from('guides')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!guide) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Rehber Düzenle: {guide.title}</h1>
      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
        <GuideForm initialData={guide} />
      </div>
    </div>
  )
}
