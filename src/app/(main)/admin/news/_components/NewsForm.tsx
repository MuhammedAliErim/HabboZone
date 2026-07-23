'use client'

import { useState } from 'react'
import { createNews, updateNews } from '../actions'

type NewsFormProps = {
  initialData?: {
    id: string
    title: string
    excerpt: string
    content: string
    category: string
    image_url: string
  }
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      if (initialData) {
        await updateNews(initialData.id, formData)
      } else {
        await createNews(formData)
      }
    } catch (error) {
      console.error(error)
      alert('Bir hata oluştu!')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          defaultValue={initialData?.category || 'Duyuru'}
          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="Duyuru">Duyuru</option>
          <option value="Etkinlik">Etkinlik</option>
          <option value="Kampanya">Kampanya</option>
          <option value="Güncelleme">Güncelleme</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Görsel URL</label>
        <input 
          name="image_url"
          defaultValue={initialData?.image_url}
          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Özet (Kısa Açıklama)</label>
        <textarea 
          name="excerpt"
          defaultValue={initialData?.excerpt}
          rows={3}
          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">İçerik</label>
        <textarea 
          name="content"
          defaultValue={initialData?.content}
          required
          rows={10}
          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500 font-mono text-sm"
          placeholder="Buraya HTML formatında içerik girebilirsiniz..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <a 
          href="/admin/news" 
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
