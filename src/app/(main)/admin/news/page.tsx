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

  const totalNews = news?.length || 0;
  const publishedCount = news?.filter(n => n.status === 'Published').length || 0;
  const draftCount = totalNews - publishedCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık & İstatistikler */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Newspaper className="text-blue-400" size={32} /> HABER & MEDYA YAYIN MERKEZİ
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Topluluk gündemini belirleyen habercilik yazıları, manşetler ve duyuruları yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Yayında Olan</span>
              <span className="text-base font-black text-emerald-300">{publishedCount} Haber</span>
            </div>
          </div>

          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-amber-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Taslak / Bekleyen</span>
              <span className="text-base font-black text-amber-300">{draftCount} Yazı</span>
            </div>
          </div>

          <Link 
            href="/admin/news/new"
            className="habbo-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus size={18} /> YENİ HABER YAZ
          </Link>
        </div>
      </div>

      <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#050a14] border-b border-white/10 flex justify-between items-center">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Newspaper className="text-blue-400" size={16} /> TÜM HABERLER LİSTESİ
          </h2>
          <span className="text-xs text-gray-400 font-bold bg-white/5 px-3 py-1 rounded-lg">
            Toplam {totalNews} Kayıt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-gray-400 text-xs font-black uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4 w-24">Manşet Görseli</th>
                <th className="px-6 py-4">Haber Başlığı & Özeti</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Yayın Durumu</th>
                <th className="px-6 py-4">Yazar</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4 text-right">Stüdyo Yönetimi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {news && news.length > 0 ? (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-[#050a14] border border-white/10 shadow-md group-hover:scale-105 transition-transform">
                        <Image 
                          src={item.image_url || '/placeholder-news.png'} 
                          alt={item.title || 'Haber Görseli'} 
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-white text-base max-w-[260px] truncate group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[260px] mt-0.5 font-normal">
                        {item.summary || 'Özet bulunmuyor'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs font-bold text-gray-300">
                        {item.category || 'Genel'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                        item.status === 'Published' 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10' :
                        item.status === 'Scheduled' 
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                          'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}>
                        {item.status === 'Published' ? (
                          <><CheckCircle2 size={12} /> Yayında</>
                        ) : item.status === 'Scheduled' ? (
                          <><Clock size={12} /> Zamanlandı</>
                        ) : (
                          <><AlertCircle size={12} /> Taslak</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-xs text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center overflow-hidden shrink-0">
                          {item.author?.avatar_url ? (
                            <img src={item.author.avatar_url} alt="Author" className="w-full h-full object-cover" />
                          ) : (
                            <User size={12} className="text-blue-400" />
                          )}
                        </div>
                        <span>{item.author?.username || 'Anonim Editör'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString('tr-TR') : new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/news/${item.id}/edit`}
                          className="px-3.5 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Edit size={14} /> DÜZENLE
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
