import { createClient } from '@/utils/supabase/server'
import ForumAdminClient from './_components/ForumAdminClient'
import { MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'Forum Kategorileri Yönetimi - Admin Paneli',
}

export default async function AdminForumPage() {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'forum')
    .order('created_at', { ascending: true })

  // Fetch forums
  const { data: forums } = await supabase
    .from('forums')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <MessageSquare className="text-yellow-400" />
          Forum Yönetimi
        </h1>
        <p className="text-gray-400 text-sm">
          Forum ana kategorilerini ve alt forumları (bölümleri) yönetin.
        </p>
      </div>

      <ForumAdminClient 
        categories={categories || []} 
        forums={forums || []} 
      />
    </div>
  )
}
