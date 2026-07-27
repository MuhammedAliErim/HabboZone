'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addAnnouncement } from '../actions'
import { Megaphone, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'

export default function AnnouncementForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await addAnnouncement(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
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
        <label className="block text-xs font-black uppercase tracking-wider text-[#facc15] mb-2 flex items-center gap-1.5">
          <Sparkles size={14} /> DUYURU / SON DAKİKA MESAJI <span className="text-red-500">*</span>
        </label>
        <textarea 
          name="message" 
          rows={4}
          required
          className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3.5 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-[#facc15] transition-colors shadow-inner resize-none placeholder:text-gray-600"
          placeholder="Örn: 🚨 BÜYÜK YAZ TURNUVASI BAŞLADI! Hemen kayıt olmak için etkinlik odasını ziyaret edin..."
        />
        <p className="text-[10px] text-gray-400 mt-1.5 font-medium uppercase tracking-wide">
          Bu mesaj sitenin üst kısmındaki son dakika bantında kayan yazı olarak yayınlanacaktır.
        </p>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="habbo-button w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-3 rounded-[2px] shadow transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50 mt-2 shadow-red-500/20"
      >
        <CheckCircle2 size={16} />
        {loading ? 'YAYINLANIYOR...' : 'SON DAKİKA DUYURUSU YAYINLA'}
      </button>
    </form>
  )
}
