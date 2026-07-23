'use client'

import { useState } from 'react'
import { createGuide, updateGuide } from '../actions'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, ImageIcon } from 'lucide-react'

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
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
          <input 
            name="title"
            defaultValue={initialData?.title}
            required
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
          <select 
            name="category"
            defaultValue={initialData?.category || 'Genel'}
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="Kablolu">Kablolu</option>
            <option value="Mimari">Mimari</option>
            <option value="Genel">Genel</option>
            <option value="Etkinlik">Etkinlik</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Okuma Süresi (Örn: 3 dk)</label>
        <input 
          name="read_time"
          defaultValue={initialData?.read_time || '3 dk'}
          required
          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">İçerik (Markdown veya Metin)</label>
        <textarea 
          name="content"
          defaultValue={initialData?.content}
          rows={6}
          required
          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div className="bg-[#1f1f1f] border border-[#333] rounded-md p-4">
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <ImageIcon size={16} /> Rehber Görseli {initialData?.image_url && '(Yüklü)'}
        </label>
        <input 
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
        />
        {imageFile && <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><CheckCircle size={12}/> Seçildi</p>}
      </div>

      {initialData?.image_url && (
          <input type="hidden" name="image_url" value={initialData.image_url} />
      )}

      <div className="flex justify-end gap-4">
        <a 
          href="/admin/guides" 
          className="px-6 py-2 bg-[#333] text-white rounded-md hover:bg-[#444] transition-colors"
        >
          İptal
        </a>
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}
