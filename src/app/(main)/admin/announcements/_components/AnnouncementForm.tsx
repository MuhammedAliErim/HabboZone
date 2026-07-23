'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addAnnouncement } from '../actions'

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Duyuru Mesajı</label>
        <textarea 
          name="message" 
          rows={3}
          required
          className="w-full bg-[#1f1f1f] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
          placeholder="Son dakika duyurusunu buraya girin..."
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {loading ? 'Ekleniyor...' : 'Duyuru Ekle'}
      </button>
    </form>
  )
}
