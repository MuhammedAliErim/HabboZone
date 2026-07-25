'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addEvent } from '../actions'
import { Calendar, Sparkles, Gift, Image as ImageIcon, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export default function EventForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await addEvent(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      setImageUrl('')
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
        <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-1.5 flex items-center gap-1">
          <Sparkles size={14} /> Etkinlik Başlığı <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          name="title" 
          required
          className="w-full bg-[#050a14] border-2 border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
          placeholder="Örn: 2026 Büyük Kış Turnuvası"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1">
            <Clock size={14} className="text-yellow-400" /> Tarih ve Saat <span className="text-red-500">*</span>
          </label>
          <input 
            type="datetime-local" 
            name="event_date" 
            required
            className="w-full bg-[#050a14] border border-white/10 rounded-xl px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Kategori Türü
          </label>
          <select 
            name="event_type" 
            className="w-full bg-[#050a14] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="Oyun">🎮 Oda Oyunu</option>
            <option value="Yarışma">🏆 Yarışma / Turnuva</option>
            <option value="Parti">🎉 Müzik & Parti</option>
            <option value="Radyo">📻 Radyo Yayını</option>
            <option value="Genel">📢 Genel Duyuru</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
          Etkinlik Açıklaması
        </label>
        <textarea 
          name="description" 
          rows={3}
          className="w-full bg-[#050a14] border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 text-xs focus:outline-none focus:border-purple-500 transition-colors shadow-inner font-medium resize-none"
          placeholder="Etkinlik kuralları, nerede yapılacağı ve detaylar..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1">
          <Gift size={14} /> Ödül Tanımı (Opsiyonel)
        </label>
        <input 
          type="text" 
          name="reward_text" 
          className="w-full bg-[#050a14] border border-white/10 rounded-xl px-4 py-2.5 text-amber-300 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          placeholder="Örn: 50 Kredi + Özel Şampiyon Rozeti + NADİRE!"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 mb-1.5 flex items-center gap-1">
          <ImageIcon size={14} /> Afiş / Banner URL Adresi
        </label>
        <input 
          type="url" 
          name="image_url" 
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full bg-[#050a14] border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 text-xs focus:outline-none focus:border-pink-500 transition-colors"
          placeholder="https://..."
        />

        {imageUrl ? (
          <div className="mt-3 relative rounded-xl overflow-hidden border-2 border-white/20 aspect-video bg-black/50 group">
            <img src={imageUrl} alt="Afiş Önizleme" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="mt-2 border-2 border-dashed border-white/10 rounded-xl h-24 flex items-center justify-center text-gray-500 text-xs bg-black/20">
            Afiş görseli URL'si yapıştırıldığında burada önizleme belirecektir.
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="habbo-button w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase disabled:opacity-50 mt-2"
      >
        <CheckCircle2 size={18} />
        {loading ? 'TAKVİME İŞLENİYOR...' : 'ETKİNLİĞİ TAKVİME YAYINLA'}
      </button>
    </form>
  )
}
