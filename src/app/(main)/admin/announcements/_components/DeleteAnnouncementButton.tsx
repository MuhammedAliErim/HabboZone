'use client'

import { useState } from 'react'
import { deleteAnnouncement } from '../actions'
import { Trash2 } from 'lucide-react'

export default function DeleteAnnouncementButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!window.confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return

    setLoading(true)
    const result = await deleteAnnouncement(id)
    if (result?.error) {
      alert(result.error)
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition-colors disabled:opacity-50"
      title="Sil"
    >
      <Trash2 size={18} />
    </button>
  )
}
