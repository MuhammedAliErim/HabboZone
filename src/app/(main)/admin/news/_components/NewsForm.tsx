'use client'

import { useState } from 'react'
import { createNews, updateNews } from '../actions'
import TipTapEditor from '@/components/admin/TipTapEditor'
import { Newspaper, Image as ImageIcon, Calendar, Tag, FileText, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type NewsFormProps = {
  initialData?: {
    id: string
    title: string
    excerpt: string
    content: string
    category: string
    image_url: string
    status?: string
    published_at?: string
  }
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(initialData?.content || '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    formData.set('content', content)
    
    const result = initialData
      ? await updateNews(initialData.id, formData)
      : await createNews(formData)

    if (result?.error) {
      alert(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
      
      {/* Üst Başlık Barı */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/news" 
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Newspaper className="text-yellow-400" />
              {initialData ? 'HABERİ DÜZENLE' : 'YENİ HABER OLUŞTUR'}
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {initialData ? `#${initialData.id.slice(0, 8)} referanslı haberi güncelliyorsunuz` : 'Topluluğa duyurmak istediğin yeni bir içerik yayınla'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol 2 Kolon: Ana Haber Alanı */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Başlık */}
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2 flex items-center gap-1.5">
                <FileText size={16} /> Haber Başlığı <span className="text-red-500">*</span>
              </label>
              <input 
                name="title"
                defaultValue={initialData?.title}
                required
                placeholder="Örn: Habbo Zone 2026 Yaz Festivali Başlıyor!"
                className="w-full px-4 py-3 bg-[#050a14] border-2 border-white/10 rounded-xl text-white font-bold text-lg focus:outline-none focus:border-yellow-500 transition-colors shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Kısa Özet (Ana Sayfa Kart Açıklaması)
              </label>
              <textarea 
                name="excerpt"
                defaultValue={initialData?.excerpt}
                rows={2}
                placeholder="Haber kartlarında görünecek 1-2 cümlelik çarpıcı bir özet yazın..."
                className="w-full px-4 py-2.5 bg-[#050a14] border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-yellow-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* TipTap Editör (Zengin Metin Alanı) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
              <Newspaper size={16} /> Haber İçeriği (Pro Editör) <span className="text-red-500">*</span>
            </label>
            
            <input type="hidden" name="content" value={content} />
            <TipTapEditor content={content} onChange={setContent} />
          </div>

        </div>

        {/* Sağ 1 Kolon: Ayarlar & Medya */}
        <div className="space-y-6">
          
          {/* Yayın Ayarları */}
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl shadow-xl space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
              <Calendar className="text-blue-400" size={18} /> Yayın Ayarları
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1">
                <Tag size={14} className="text-yellow-400" /> Kategori
              </label>
              <select 
                name="category"
                defaultValue={initialData?.category || 'Duyuru'}
                className="w-full px-4 py-2.5 bg-[#050a14] border border-white/15 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Duyuru">📢 Duyuru</option>
                <option value="Etkinlik">🎉 Etkinlik</option>
                <option value="Kampanya">💎 Kampanya</option>
                <option value="Güncelleme">⚡ Güncelleme</option>
                <option value="Yarışma">🏆 Yarışma</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">Durum</label>
              <select 
                name="status"
                defaultValue={initialData?.status || 'Published'}
                className="w-full px-4 py-2.5 bg-[#050a14] border border-white/15 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Published">🟢 Yayınlandı (Canlı)</option>
                <option value="Draft">🟡 Taslak (Gizli)</option>
                <option value="Scheduled">🔵 Zamanlandı</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">Yayınlanma Tarihi</label>
              <input 
                type="datetime-local"
                name="published_at"
                defaultValue={initialData?.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : ''}
                className="w-full px-4 py-2 bg-[#050a14] border border-white/15 rounded-xl text-gray-300 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-[11px] text-gray-500 mt-1">Boş bırakılırsa hemen şimdi yayınlanır.</p>
            </div>
          </div>

          {/* Kapak Görseli */}
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
              <ImageIcon className="text-pink-400" size={18} /> Kapak Görseli
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">Görsel URL Adresi</label>
              <input 
                name="image_url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#050a14] border border-white/15 rounded-xl text-gray-300 text-xs focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-white/20 aspect-video bg-black/50 group">
                <img 
                  src={imageUrl} 
                  alt="Kapak Önizleme" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-xl aspect-video flex flex-col items-center justify-center text-gray-500 bg-black/20 p-4 text-center">
                <ImageIcon size={28} className="mb-2 opacity-40" />
                <span className="text-xs">Kapak görseli URL'si yapıştırıldığında burada önizleme belirecektir.</span>
              </div>
            )}
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-col gap-3 pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="habbo-button bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              {loading ? 'KAYDEDİLİYOR...' : 'HABERİ KAYDET & YAYINLA'}
            </button>

            <Link 
              href="/admin/news" 
              className="text-center py-2.5 text-xs font-bold text-gray-400 hover:text-white transition-colors border border-white/10 rounded-xl bg-white/5 hover:bg-white/10"
            >
              İPTAL ET VE GERİ DÖN
            </Link>
          </div>

        </div>

      </form>
    </div>
  )
}
