import MagazineForm from '../../_components/MagazineForm'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditMagazinePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: magazine } = await supabase
    .from('magazines')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!magazine) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Gazete/Dergi Düzenle: #{magazine.issue_number}</h1>
      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
        <MagazineForm initialData={magazine} />
      </div>
    </div>
  )
}
