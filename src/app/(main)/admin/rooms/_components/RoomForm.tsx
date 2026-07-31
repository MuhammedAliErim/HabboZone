'use client'

import Image from 'next/image'
import { useState } from 'react'
import { createRoom, updateRoom } from '../actions'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle2, Image as ImageIcon, Sparkles, User, Users, Layers, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null)
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2 flex items-center gap-1.5">
            <Sparkles size={14} /> Oda Adı <span className="text-red-500">*</span>
          </label>
          <input 
            name="name"
            defaultValue={initialData?.name}
            required
            placeholder="Örn: [HR] VIP Dinlenme Tesisi"
            className="w-full px-4 py-3 bg-[#050a14] border border-[#1e293b] rounded-[3px] text-white font-bold text-sm focus:outline-none focus:border-yellow-400 transition-colors shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
            <User size={14} /> Oda Sahibi (Habbo Adı) <span className="text-red-500">*</span>
          </label>
          <input 
            name="owner"
            defaultValue={initialData?.owner}
            required
            placeholder="Örn: MuhammedAliErim"
            className="w-full px-4 py-3 bg-[#050a14] border border-[#1e293b] rounded-[3px] text-white font-bold text-sm focus:outline-none focus:border-blue-400 transition-colors shadow-inner"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
          Oda Açıklaması
        </label>
        <textarea 
          name="description"
          defaultValue={initialData?.description}
          rows={3}
          placeholder="Oda kuralları, sohbet ortamı ve genel bilgi..."
          className="w-full px-4 py-3 bg-[#050a14] border border-[#1e293b] rounded-[3px] text-gray-300 text-xs focus:outline-none focus:border-yellow-400 transition-colors shadow-inner font-medium resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
            <Layers size={14} /> Kategori
          </label>
          <select 
            name="category"
            defaultValue={initialData?.category || 'Popüler'}
            className="w-full px-4 py-3 bg-[#050a14] border border-[#1e293b] rounded-[3px] text-white font-bold text-xs focus:outline-none focus:border-purple-400 transition-colors"
          >
            <option value="Popüler">🌟 Popüler Odalar</option>
            <option value="Yeni">✨ Yeni Açılanlar</option>
            <option value="Etkinlik">🎉 Etkinlik & Yarışma</option>
            <option value="Resmi">🏛️ Resmi Habbo Odaları</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
            <Users size={14} /> Maksimum Kapasite
          </label>
          <input 
            type="number"
            name="max_users"
            defaultValue={initialData?.max_users ?? 75}
            required
            className="w-full px-4 py-3 bg-[#050a14] border border-[#1e293b] rounded-[3px] text-white font-bold text-xs focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <Users size={14} /> Mevcut Çevrimiçi (Simülasyon)
          </label>
          <input 
            type="number"
            name="current_users"
            defaultValue={initialData?.current_users ?? 0}
            className="w-full px-4 py-3 bg-[#050a14] border border-[#1e293b] rounded-[3px] text-white font-bold text-xs focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
          />
        </div>
      </div>

      <div className="habbo-box bg-[#050a14] border border-[#1e293b] rounded-[3px] p-5 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
          <ImageIcon size={16} /> Oda Kapak Görseli (Screenshot / Minyatür) <span className="text-red-500">*</span>
        </label>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <label className="flex-1 w-full cursor-pointer bg-[#0a1325] hover:bg-[#0a1325] border-2 border-dashed border-[#1e293b] rounded-[3px] p-6 text-center transition-all group">
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
            <div className="w-full sm:w-48 aspect-video rounded-[3px] bg-black border-2 border-pink-500/50 overflow-hidden relative shadow-xl shrink-0">
              <Image src={previewUrl} alt="Oda Önizleme" fill className="object-cover" unoptimized />
            </div>
          )}
        </div>
      </div>

      {initialData?.image_url && (
        <input type="hidden" name="image_url" value={initialData.image_url} />
      )}

      <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#1e293b]">
        <Link 
          href="/admin/rooms" 
          className="px-6 py-3 rounded-[3px] bg-[#050a14] border border-[#1e293b] hover:bg-[#0a1325] text-gray-400 hover:text-white font-bold text-xs uppercase transition-colors"
        >
          İptal Et
        </Link>
        
        <button 
          type="submit"
          disabled={loading}
          className="habbo-button bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black px-8 py-3 rounded-[3px] shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> ODA KAYDEDİLİYOR...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> {initialData ? 'DEĞİŞİKLİKLERİ GÜNCELLE' : 'YENİ ODAYI YAYINLA'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
