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
    .maybeSingle()

  if (!news) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-black text-white uppercase tracking-wider">HABERİ DÜZENLE</h1>
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[2px] p-6 shadow-lg">
        <NewsForm initialData={news} />
      </div>
    </div>
  )
}
