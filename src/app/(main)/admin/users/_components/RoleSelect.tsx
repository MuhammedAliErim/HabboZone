'use client'

import { useState } from 'react'
import { updateUserRole } from '../actions'
import { Shield, Check, Loader2 } from 'lucide-react'

const roles = [
  { value: 'Member', label: '👤 Üye (Member)', class: 'bg-slate-800/60 text-slate-300 border-slate-600/50' },
  { value: 'VIP', label: '💎 VIP Üye', class: 'bg-blue-900/60 text-blue-300 border-blue-500/50 font-bold' },
  { value: 'Moderator', label: '🛡️ Moderatör', class: 'bg-purple-900/60 text-purple-300 border-purple-500/50 font-bold' },
  { value: 'Administrator', label: '⚡ Yöneticisi (Admin)', class: 'bg-amber-900/60 text-amber-300 border-amber-500/50 font-black' },
  { value: 'Developer', label: '💻 Geliştirici', class: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50 font-black' },
  { value: 'Owner', label: '👑 Kurucu (Owner)', class: 'bg-rose-900/60 text-rose-300 border-rose-500/50 font-black shadow-lg shadow-rose-500/20' }
]

export default function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState(currentRole)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setLoading(true)
    try {
      await updateUserRole(userId, newRole)
      setRole(newRole)
    } catch (err: any) {
      alert(err.message || 'Rol güncellenirken hata oluştu')
      e.target.value = role
    } finally {
      setLoading(false)
    }
  }

  const activeRoleConfig = roles.find(r => r.value === role) || roles[0]

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {loading ? (
        <Loader2 size={16} className="text-yellow-400 animate-spin" />
      ) : (
        <Shield size={14} className="text-gray-400" />
      )}
      
      <select
        value={role}
        onChange={handleChange}
        disabled={loading}
        className={`px-3 py-1.5 rounded-[2px] border text-xs outline-none cursor-pointer transition-all ${activeRoleConfig.class} hover:border-[#facc15] disabled:opacity-50`}
      >
        {roles.map(r => (
          <option key={r.value} value={r.value} className="bg-[#050a14] text-white font-medium py-1">
            {r.label}
          </option>
        ))}
      </select>
    </div>
  )
}
