'use client'

import { useState } from 'react'
import { toggleAnnouncement } from '../actions'
import { Eye, EyeOff } from 'lucide-react'

export default function ToggleAnnouncementButton({ id, isActive }: { id: string, isActive: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    const result = await toggleAnnouncement(id, isActive)
    if (result?.error) {
      alert(result.error)
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`${isActive ? 'text-green-500 hover:text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:text-gray-400 hover:bg-gray-500/10'} p-2 rounded transition-colors disabled:opacity-50`}
      title={isActive ? "Gizle" : "Göster"}
    >
      {isActive ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  )
}
