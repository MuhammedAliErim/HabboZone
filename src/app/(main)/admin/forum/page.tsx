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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#1e293b]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <MessageSquare className="text-[#facc15]" size={28} /> FORUM & KATEGORİ YÖNETİM MERKEZİ
          </h1>
          <p className="text-xs text-gray-300 font-bold uppercase tracking-wide mt-1">
            Topluluk tartışma alanlarını, ana kategorileri, alt forum bölümlerini ve ikonları yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
            <Folder className="text-[#facc15]" size={18} />
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">ANA KATEGORİ</span>
              <span className="text-sm font-black text-[#facc15] uppercase">{catCount} BAŞLIK</span>
            </div>
          </div>

          <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
            <Layers className="text-[#3b82f6]" size={18} />
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">ALT FORUM</span>
              <span className="text-sm font-black text-[#3b82f6] uppercase">{forumCount} BÖLÜM</span>
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
