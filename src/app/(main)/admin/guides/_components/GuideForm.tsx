'use client'

import Image from 'next/image'
import { useState } from 'react'
import { createGuide, updateGuide } from '../actions'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle2, Image as ImageIcon, Sparkles, Clock, BookOpen, Layers, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import TipTapEditor from '@/components/admin/TipTapEditor'

type GuideFormProps = {
  initialData?: {
    id: string
    title: string
    category: string
    content: string
    read_time: string
    image_url: string
  }
}

export default function GuideForm({ initialData }: GuideFormProps) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null)
  const [content, setContent] = useState<string>(initialData?.content || '')
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(initialData?.image_url || null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (!content || content.replace(/<[^>]*>?/gm, '').trim().length === 0) {
        throw new Error("Lütfen rehber için bir içerik yazın!")
      }

      const formData = new FormData(e.currentTarget)
      formData.set('content', content)
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `guide_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('guides')
          .upload(fileName, imageFile)
          
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('guides')
          .getPublicUrl(fileName)
          
        formData.set('image_url', publicUrl)
      } else if (!initialData?.image_url) {
        throw new Error("Lütfen rehber için bir kapak görseli seçin!")
      }

      if (initialData) {
        await updateGuide(initialData.id, formData)
      } else {
        await createGuide(formData)
      }
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Bir hata oluştu!')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2 flex items-center gap-1.5">
            <Sparkles size={14} /> Rehber Başlığı <span className="text-red-500">*</span>
          </label>
          <input 
            name="title"
            defaultValue={initialData?.title}
            required
            placeholder="Örn: Wired (Kablolu) Sistemler Başlangıç Rehberi"
            className="w-full px-4 py-3 bg-[#050a14] border-2 border-white/10 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-yellow-400 transition-colors shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
            <Layers size={14} /> Kategori
          </label>
          <select 
            name="category"
            defaultValue={initialData?.category || 'Genel'}
            className="w-full px-4 py-3 bg-[#050a14] border-2 border-white/10 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-purple-400 transition-colors"
          >
            <option value="Kablolu">⚡ Kablolu (Wired)</option>
            <option value="Mimari">🏰 Mimari & Tasarım</option>
            <option value="Genel">📘 Genel Rehber</option>
            <option value="Etkinlik">🎯 Oyun & Yarışma</option>
            <option value="Ekonomi">💎 Kredi & Ekonomi</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
            <Clock size={14} /> Tahmini Okuma Süresi
          </label>
          <input 
            name="read_time"
            defaultValue={initialData?.read_time || '4 dk okuma'}
            required
            className="w-full px-4 py-3 bg-[#050a14] border-2 border-white/10 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
          />
        </div>

        <div className="text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2">
          <BookOpen className="text-yellow-400 shrink-0" size={18} />
          <span>Profesyonel düzenleyici ile renkli metinler, başlıklar ve görseller ekleyebilirsiniz.</span>
        </div>
      </div>

      <div className="habbo-box bg-[#050a14] border-2 border-white/10 rounded-xl p-5 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
          <ImageIcon size={16} /> Rehber Kapak Görseli (Geniş Banner / Thumbnail) <span className="text-red-500">*</span>
        </label>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <label className="flex-1 w-full cursor-pointer bg-[#0a1224] hover:bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-6 text-center transition-all group">
            <input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-xs font-bold text-gray-400 group-hover:text-white flex flex-col items-center justify-center gap-2">
              <ImageIcon size={24} className="text-pink-400" />
              <span>Görsel Yüklemek İçin Tıklayın veya Sürükleyin</span>
              <span className="text-[10px] text-gray-500 font-normal">(PNG, JPG veya WEBP - Tavsiye edilen: 16:9 geniş açı)</span>
            </span>
          </label>

          {previewUrl && (
            <div className="w-full sm:w-48 aspect-video rounded-xl bg-black border-2 border-pink-500/50 overflow-hidden relative shadow-xl shrink-0">
              <Image src={previewUrl} alt="Rehber Önizleme" fill className="object-cover" unoptimized />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
          <BookOpen size={14} /> Rehber İçerik Editörü (Canva & TipTap Stili) <span className="text-red-500">*</span>
        </label>
        <TipTapEditor 
          content={content} 
          onChange={setContent} 
        />
        <input type="hidden" name="content" value={content} />
      </div>

      {initialData?.image_url && (
        <input type="hidden" name="image_url" value={initialData.image_url} />
      )}

      <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/10">
        <Link 
          href="/admin/guides" 
          className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs uppercase transition-colors"
        >
          İptal Et
        </Link>
        
        <button 
          type="submit"
          disabled={loading}
          className="habbo-button bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black px-8 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> REHBER KAYDEDİLİYOR...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> {initialData ? 'REHBERİ GÜNCELLE' : 'YENİ REHBERİ YAYINLA'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
