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
        <div className="p-3 bg-red-500/10 border-2 border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
          <Sparkles size={14} /> Duyuru / Son Dakika Mesajı <span className="text-red-500">*</span>
        </label>
        <textarea 
          name="message" 
          rows={4}
          required
          className="w-full bg-[#050a14] border-2 border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-red-500 transition-colors shadow-inner resize-none placeholder:text-gray-600"
          placeholder="Örn: 🚨 BÜYÜK YAZ TURNUVASI BAŞLADI! Hemen kayıt olmak için etkinlik odasını ziyaret edin..."
        />
        <p className="text-[10px] text-gray-500 mt-1.5">
          Bu mesaj sitenin üst kısmındaki son dakika bantında kayan yazı olarak yayınlanacaktır.
        </p>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="habbo-button w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase disabled:opacity-50 mt-2 shadow-red-500/20"
      >
        <CheckCircle2 size={18} />
        {loading ? 'YAYINLANIYOR...' : 'SON DAKİKA DUYURUSU YAYINLA'}
      </button>
    </form>
  )
}
