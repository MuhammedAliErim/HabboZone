'use client'

import { useState } from 'react'
import { createMagazine, updateMagazine } from '../actions'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, ImageIcon, FileText } from 'lucide-react'

type MagazineFormProps = {
  initialData?: {
    id: string
    title: string
    issue_number: number
    cover_image_url: string
    pdf_url: string
    read_link: string
    published_at: string
    is_active: boolean
  }
}

export default function MagazineForm({ initialData }: MagazineFormProps) {
  const [loading, setLoading] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // Upload cover file if provided
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `cover_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('magazines')
          .upload(fileName, coverFile)
          
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('magazines')
          .getPublicUrl(fileName)
          
        formData.set('cover_image_url', publicUrl)
      } else if (!initialData?.cover_image_url) {
        throw new Error("Lütfen bir kapak görseli seçin!")
      }

      // Upload PDF file if provided
      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop()
        const fileName = `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('magazines')
          .upload(fileName, pdfFile)
          
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('magazines')
          .getPublicUrl(fileName)
          
        formData.set('pdf_url', publicUrl)
      } else if (!initialData?.pdf_url) {
        throw new Error("Lütfen bir PDF dosyası seçin!")
      }

      if (initialData) {
        await updateMagazine(initialData.id, formData)
      } else {
        await createMagazine(formData)
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
            placeholder="Örn: HabboZone Temmuz Sayısı"
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sayı No</label>
          <input 
            type="number"
            name="issue_number"
            defaultValue={initialData?.issue_number}
            required
            placeholder="Örn: 1"
            className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1f1f1f] border border-[#333] rounded-md p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <ImageIcon size={16} /> Kapak Görseli {initialData?.cover_image_url && '(Yüklü)'}
          </label>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
          />
          {coverFile && <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><CheckCircle size={12}/> Seçildi</p>}
        </div>

        <div className="bg-[#1f1f1f] border border-[#333] rounded-md p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <FileText size={16} /> PDF Dosyası {initialData?.pdf_url && '(Yüklü)'}
          </label>
          <input 
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
          />
          {pdfFile && <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><CheckCircle size={12}/> Seçildi</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Yayınlanma Tarihi</label>
        <input 
          type="datetime-local"
          name="published_at"
          defaultValue={initialData?.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : ''}
          className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#333] rounded-md text-white focus:outline-none focus:border-yellow-500"
        />
        <p className="text-xs text-gray-500 mt-1">Eğer boş bırakırsanız otomatik olarak "Şimdi" kabul edilir.</p>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          name="is_active" 
          id="is_active"
          defaultChecked={initialData?.is_active ?? true}
          className="w-4 h-4 rounded border-[#333] bg-[#1f1f1f] text-yellow-500 focus:ring-yellow-500"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-300">
          Aktif mi? (İşaretli değilse yayın tarihi gelse bile gizlenir)
        </label>
      </div>

      {initialData?.cover_image_url && (
          <input type="hidden" name="cover_image_url" value={initialData.cover_image_url} />
      )}
      {initialData?.pdf_url && (
          <input type="hidden" name="pdf_url" value={initialData.pdf_url} />
      )}

      <div className="flex justify-end gap-4">
        <a 
          href="/admin/magazines" 
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
