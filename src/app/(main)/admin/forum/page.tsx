import { createClient } from '@/utils/supabase/server'
import ForumAdminClient from './_components/ForumAdminClient'
import { MessageSquare, Folder, Layers, Sparkles } from 'lucide-react'

export const revalidate = 0;

export const metadata = {
  title: 'Forum & Topluluk Bölümleri Yönetimi - Admin Paneli',
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

  const catCount = categories?.length || 0;
  const forumCount = forums?.length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık & İstatistikler */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="text-yellow-400" size={32} /> FORUM & KATEGORİ YÖNETİM MERKEZİ
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Topluluk tartışma alanlarını, ana kategorileri, alt forum bölümlerini ve ikonları yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
            <Folder className="text-yellow-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Ana Kategori</span>
              <span className="text-base font-black text-yellow-300">{catCount} Başlık</span>
            </div>
          </div>

          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
            <Layers className="text-blue-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Alt Forum</span>
              <span className="text-base font-black text-blue-300">{forumCount} Bölüm</span>
            </div>
          </div>
        </div>
      </div>

      <ForumAdminClient 
        categories={categories || []} 
        forums={forums || []} 
      />
    </div>
  )
}
