'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addBadge } from '../actions'
import { Award, Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

export default function BadgeForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await addBadge(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      setPreviewUrl(null)
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-[2px] text-xs flex items-center gap-2 font-bold">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#facc15] mb-1.5 flex items-center gap-1">
          <Award size={14} /> ROZET ADI <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          name="name" 
          required
          className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3.5 py-2 text-white text-sm font-bold focus:outline-none focus:border-[#facc15] transition-colors shadow-inner"
          placeholder="Örn: 2026 Yaz Şampiyonu"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
          AÇIKLAMA / HİKAYE
        </label>
        <input 
          type="text" 
          name="description" 
          className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3.5 py-2 text-gray-300 text-xs font-medium focus:outline-none focus:border-[#facc15] transition-colors shadow-inner"
          placeholder="Örn: Habbo Zone yaz etkinliklerinde üstün başarı..."
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#3b82f6] mb-1.5 flex items-center gap-1">
          <Sparkles size={14} /> KAZANMA YÖNTEMİ <span className="text-red-500">*</span>
        </label>
        <textarea 
          name="how_to_get" 
          rows={3}
          required
          className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3.5 py-2 text-gray-300 text-xs focus:outline-none focus:border-[#3b82f6] transition-colors shadow-inner font-medium resize-none"
          placeholder="Oyuncular bu rozeti odada hangi görevi yaparak veya hangi etkinliğe katılarak kazanabilir?"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-pink-400 mb-1.5 flex items-center gap-1">
          <Upload size={14} /> ROZET GÖRSELİ (GIF VEYA PNG) <span className="text-red-500">*</span>
        </label>
        
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer bg-[#050a14] hover:bg-white/5 border border-dashed border-[#1e293b] rounded-[2px] p-4 text-center transition-all group">
            <input 
              type="file" 
              name="image_file" 
              accept="image/*"
              onChange={handleFileChange}
              required
              className="hidden"
            />
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 group-hover:text-white flex items-center justify-center gap-2">
              <Upload size={16} className="text-pink-400" /> DOSYA SEÇ VEYA SÜRÜKLE
            </span>
          </label>

          {previewUrl && (
            <div className="w-16 h-16 rounded-[2px] bg-[#050a14] border border-[#facc15] flex items-center justify-center p-2 shadow-lg shrink-0 animate-bounce">
              <img src={previewUrl} alt="Rozet Önizleme" className="pixelated max-w-10 max-h-10 object-contain" />
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="habbo-button w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black py-3 rounded-[2px] shadow transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50 mt-2"
      >
        <CheckCircle2 size={16} />
        {loading ? 'ROZET YÜKLENİYOR...' : 'ROZETİ KASAYA EKLE'}
      </button>
    </form>
  )
}
