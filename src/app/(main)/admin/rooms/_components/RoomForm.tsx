'use client'

import { useState } from 'react'
import { createRoom, updateRoom } from '../actions'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, ImageIcon } from 'lucide-react'

type RoomFormProps = {
  initialData?: {
    id: string
    name: string
    owner: string
    description: string
    max_users: number
    current_users: number
    category: string
    image_url: string
  }
}

export default function RoomForm({ initialData }: RoomFormProps) {
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
        const fileName = `room_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('rooms')
          .upload(fileName, imageFile)
          
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('rooms')
          .getPublicUrl(fileName)
          
        formData.set('image_url', publicUrl)
      } else if (!initialData?.image_url) {
        throw new Error("Lütfen oda için bir kapak görseli seçin!")
      }

      if (initialData) {
        await updateRoom(initialData.id, formData)
      } else {
        await createRoom(formData)
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Oda Adı</label>
          <input 
            name="name"
            defaultValue={initialData?.name}
            required
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Oda Sahibi (Kullanıcı Adı)</label>
          <input 
            name="owner"
            defaultValue={initialData?.owner}
            required
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
        <textarea 
          name="description"
          defaultValue={initialData?.description}
          rows={3}
          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
          <select 
            name="category"
            defaultValue={initialData?.category || 'Popüler'}
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="Popüler">Popüler</option>
            <option value="Yeni">Yeni</option>
            <option value="Etkinlik">Etkinlik</option>
            <option value="Resmi">Resmi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Maks. Kullanıcı</label>
          <input 
            type="number"
            name="max_users"
            defaultValue={initialData?.max_users ?? 100}
            required
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mevcut Kullanıcı (Opsiyonel)</label>
          <input 
            type="number"
            name="current_users"
            defaultValue={initialData?.current_users ?? 0}
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="bg-[#1f1f1f] border border-[#333] rounded-md p-4">
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <ImageIcon size={16} /> Oda Görseli {initialData?.image_url && '(Yüklü)'}
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
          href="/admin/rooms" 
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
