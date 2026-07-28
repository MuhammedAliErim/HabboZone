import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2, Newspaper, Calendar, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export const revalidate = 0;

export const metadata = {
  title: 'Haber & Yayın Merkezi - Admin Paneli',
}

export default async function AdminNewsPage() {
  const supabase = await createClient()

  // Fetch news with author details
  const { data: news } = await supabase
    .from('news')
    .select(`
      *,
      author:profiles!news_author_id_fkey(username, avatar_url, habbo_username)
    `)
    .order('created_at', { ascending: false })

  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('type', 'news')

  const categoryMap = new Map(allCategories?.map(c => [c.id, c.name]) || [])

  const totalNews = news?.length || 0;
  const publishedCount = news?.filter(n => n.status === 'Published').length || 0;
  const draftCount = totalNews - publishedCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık & İstatistikler */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#1e293b]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Newspaper className="text-[#3b82f6]" size={28} /> HABER & MEDYA YAYIN MERKEZİ
          </h1>
          <p className="text-xs text-gray-300 font-bold uppercase tracking-wide mt-1">
            Topluluk gündemini belirleyen habercilik yazıları, manşetler ve duyuruları yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
            <CheckCircle2 className="text-emerald-400" size={18} />
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">YAYINDA OLAN</span>
              <span className="text-sm font-black text-emerald-300 uppercase">{publishedCount} HABER</span>
            </div>
          </div>

          <div className="habbo-box bg-[#050a14] border border-[#1e293b] px-4 py-2 rounded-[2px] flex items-center gap-3 shadow">
            <AlertCircle className="text-[#facc15]" size={18} />
            <div>
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-wider">TASLAK / BEKLEYEN</span>
              <span className="text-sm font-black text-[#facc15] uppercase">{draftCount} YAZI</span>
            </div>
          </div>

          <Link 
            href="/admin/news/new"
            className="habbo-button success px-4 py-2.5 rounded-[2px] font-black text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Plus size={16} /> YENİ HABER YAZ
          </Link>
        </div>
      </div>

      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
        <div className="habbo-box-header flex justify-between items-center">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Newspaper className="text-[#facc15]" size={16} /> TÜM HABERLER LİSTESİ
          </span>
          <span className="text-[10px] text-gray-300 font-black uppercase tracking-wider bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px]">
            TOPLAM {totalNews} KAYIT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#050a14] text-gray-400 font-black uppercase tracking-wider border-b border-[#1e293b]">
              <tr>
                <th className="px-5 py-3.5 w-24">MANŞET</th>
                <th className="px-5 py-3.5">HABER BAŞLIĞI & ÖZETİ</th>
                <th className="px-5 py-3.5">KATEGORİ</th>
                <th className="px-5 py-3.5">DURUM</th>
                <th className="px-5 py-3.5">YAZAR</th>
                <th className="px-5 py-3.5">TARİH</th>
                <th className="px-5 py-3.5 text-right">YÖNETİM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] font-medium">
              {news && news.length > 0 ? (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-[#050a14] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="relative w-16 h-11 rounded-[2px] overflow-hidden bg-[#050a14] border border-[#1e293b] shadow">
                        <Image 
                          src={item.thumbnail_url || '/placeholder-news.png'} 
                          alt={item.title || 'Haber Görseli'} 
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-black text-white text-sm uppercase tracking-tight max-w-[260px] truncate group-hover:text-[#facc15] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[260px] mt-0.5 font-bold">
                        {item.summary || 'ÖZET BULUNMUYOR'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#050a14] border border-[#1e293b] px-2.5 py-1 rounded-[2px] text-[10px] font-black uppercase text-gray-300 tracking-wider">
                        {categoryMap.get(item.category_id) || 'GENEL'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-black uppercase tracking-wider border shadow ${
                        item.status === 'Published' 
                          ? 'bg-[#050a14] border-emerald-500/50 text-emerald-400' :
                        item.status === 'Scheduled' 
                          ? 'bg-[#050a14] border-blue-500/50 text-[#3b82f6]' :
                          'bg-[#050a14] border-[#facc15]/50 text-[#facc15]'
                      }`}>
                        {item.status === 'Published' ? (
                          <><CheckCircle2 size={12} /> YAYINDA</>
                        ) : item.status === 'Scheduled' ? (
                          <><Clock size={12} /> ZAMANLANDI</>
                        ) : (
                          <><AlertCircle size={12} /> TASLAK</>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 font-black text-xs text-gray-300 uppercase">
                        <div className="w-6 h-6 rounded-[2px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center overflow-hidden shrink-0">
                          {item.author?.avatar_url ? (
                            <img src={item.author.avatar_url} alt="Author" className="w-full h-full object-cover" />
                          ) : (
                            <User size={12} className="text-[#3b82f6]" />
                          )}
                        </div>
                        <span>{item.author?.username || 'ANONİM EDİTÖR'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[11px] font-bold text-gray-400">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString('tr-TR') : new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/news/${item.id}/edit`}
                          className="habbo-button blue px-3 py-1.5 rounded-[2px] font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow"
                        >
                          <Edit size={12} /> DÜZENLE
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    <Newspaper size={40} className="mx-auto mb-3 text-gray-600 opacity-40" />
                    <p className="font-bold text-base text-gray-400">Henüz yayınlanmış veya taslak halinde haber bulunmuyor.</p>
                    <p className="text-xs mt-1">Yeni bir haber oluşturarak topluluğu bilgilendirmeye başlayın.</p>
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
