import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import NewsForm from '../../_components/NewsForm'

export default async function EditNewsPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !news) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Haberi Düzenle</h1>
      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
        <NewsForm initialData={news} />
      </div>
    </div>
  )
}
