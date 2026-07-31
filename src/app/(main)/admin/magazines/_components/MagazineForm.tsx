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
          <label className="block text-xs font-black uppercase tracking-wider text-[#facc15] mb-1.5">BAŞLIK</label>
          <input 
            name="title"
            defaultValue={initialData?.title}
            required
            placeholder="Örn: HabboZone Temmuz Sayısı"
            className="w-full px-3.5 py-2.5 bg-[#050a14] border border-[#1e293b] rounded-[2px] text-white text-xs font-bold focus:outline-none focus:border-[#facc15] transition-colors shadow-inner"
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">SAYI NO</label>
          <input 
            type="number"
            name="issue_number"
            defaultValue={initialData?.issue_number}
            required
            placeholder="Örn: 1"
            className="w-full px-3.5 py-2.5 bg-[#050a14] border border-[#1e293b] rounded-[2px] text-white text-xs font-bold focus:outline-none focus:border-[#facc15] transition-colors shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0a1325] border border-[#1e293b] rounded-[2px] p-4 shadow">
          <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#facc15]" /> KAPAK GÖRSELİ {initialData?.cover_image_url && '(YÜKLÜ)'}
          </label>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-gray-300 font-bold file:mr-4 file:py-1.5 file:px-3 file:rounded-[2px] file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-[#facc15] file:text-black hover:file:bg-yellow-400 transition-colors"
          />
          {coverFile && <p className="text-xs text-green-400 font-bold mt-2 flex items-center gap-1 uppercase"><CheckCircle size={14}/> SEÇİLDİ</p>}
        </div>

        <div className="bg-[#0a1325] border border-[#1e293b] rounded-[2px] p-4 shadow">
          <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-2">
            <FileText size={16} className="text-[#3b82f6]" /> PDF DOSYASI {initialData?.pdf_url && '(YÜKLÜ)'}
          </label>
          <input 
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-gray-300 font-bold file:mr-4 file:py-1.5 file:px-3 file:rounded-[2px] file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-[#3b82f6] file:text-white hover:file:bg-blue-600 transition-colors"
          />
          {pdfFile && <p className="text-xs text-green-400 font-bold mt-2 flex items-center gap-1 uppercase"><CheckCircle size={14}/> SEÇİLDİ</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">YAYINLANMA TARİHİ</label>
        <input 
          type="datetime-local"
          name="published_at"
          defaultValue={initialData?.published_at ? initialData.published_at.slice(0, 16) : ''}
          className="w-full px-3.5 py-2 bg-[#050a14] border border-[#1e293b] rounded-[2px] text-white text-xs font-bold focus:outline-none focus:border-[#facc15] transition-colors"
        />
        <p className="text-[11px] text-gray-400 font-medium mt-1">Eğer boş bırakırsanız otomatik olarak "Şimdi" kabul edilir.</p>
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <input 
          type="checkbox" 
          name="is_active" 
          id="is_active"
          defaultChecked={initialData?.is_active ?? true}
          className="w-4 h-4 rounded-[2px] border-[#1e293b] bg-[#050a14] text-[#facc15] focus:ring-0 cursor-pointer"
        />
        <label htmlFor="is_active" className="text-xs font-bold uppercase tracking-wide text-gray-300 cursor-pointer">
          Aktif mi? (İşaretli değilse yayın tarihi gelse bile gizlenir)
        </label>
      </div>

      {initialData?.cover_image_url && (
          <input type="hidden" name="cover_image_url" value={initialData.cover_image_url} />
      )}
      {initialData?.pdf_url && (
          <input type="hidden" name="pdf_url" value={initialData.pdf_url} />
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-[#1e293b]">
        <a 
          href="/admin/magazines" 
          className="px-5 py-2.5 bg-[#0a1325] border border-[#1e293b] text-white font-bold uppercase tracking-wider text-xs rounded-[2px] hover:bg-[#0a1325] transition-colors"
        >
          İPTAL
        </a>
        <button 
          type="submit" 
          disabled={loading}
          className="habbo-button px-6 py-2.5 bg-[#facc15] text-black font-black uppercase tracking-wider text-xs rounded-[2px] hover:bg-yellow-400 transition-all shadow disabled:opacity-50"
        >
          {loading ? 'KAYDEDİLİYOR...' : 'KAYDET'}
        </button>
      </div>
    </form>
  )
}
