'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addEvent } from '../actions'

export default function EventForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Başlık</label>
        <input 
          type="text" 
          name="title" 
          required
          className="w-full bg-[#1f1f1f] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
          placeholder="Örn: Yaz Partisi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Yetkili Username</label>
        <input 
          type="text" 
          name="host_username" 
          required
          className="w-full bg-[#1f1f1f] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
          placeholder="Örn: frank"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Tarih ve Saat</label>
        <input 
          type="datetime-local" 
          name="event_time" 
          required
          className="w-full bg-[#1f1f1f] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Tür</label>
        <select 
          name="event_type" 
          className="w-full bg-[#1f1f1f] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
        >
          <option value="Oyun">Oyun</option>
          <option value="Yarışma">Yarışma</option>
          <option value="Parti">Parti</option>
          <option value="Radyo">Radyo</option>
          <option value="Genel">Genel</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {loading ? 'Ekleniyor...' : 'Etkinlik Ekle'}
      </button>
    </form>
  )
}
