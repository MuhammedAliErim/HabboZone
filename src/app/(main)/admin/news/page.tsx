import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

export default async function AdminNewsPage() {
  const supabase = await createClient()

  // Fetch news with author details
  const { data: news, error } = await supabase
    .from('news')
    .select(`
      *,
      author:profiles!news_author_id_fkey(username, avatar_url)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Haber Yönetimi</h1>
        <Link 
          href="/admin/news/new"
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-bold transition-colors"
        >
          <Plus size={18} />
          Yeni Haber Ekle
        </Link>
      </div>

      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
              <tr>
                <th className="px-6 py-4">Görsel</th>
                <th className="px-6 py-4">Başlık</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Yazar</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {news && news.length > 0 ? (
                news.map((item) => (
                  <tr key={item.id} className="border-b border-[#333] hover:bg-[#333]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-12 rounded overflow-hidden">
                        <Image 
                          src={item.image_url || '/placeholder-news.png'} 
                          alt={item.title} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">
                      {item.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#333] px-2 py-1 rounded text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.author?.avatar_url && (
                          <Image src={item.author.avatar_url} alt="Avatar" width={20} height={20} className="rounded-full" />
                        )}
                        <span>{item.author?.username || 'Bilinmiyor'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/news/${item.id}/edit`}
                          className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        {/* We'll implement delete via client component or server action later */}
                        <button 
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Henüz hiç haber bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
