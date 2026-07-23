'use client'

import { useState } from 'react'
import { updateUserRole } from '../actions'

const roles = ['Member', 'VIP', 'Moderator', 'Administrator', 'Developer', 'Owner']

export default function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState(currentRole)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setLoading(true)
    try {
      await updateUserRole(userId, newRole)
      setRole(newRole)
      alert('Rol güncellendi')
    } catch (err: any) {
      alert(err.message || 'Rol güncellenirken hata oluştu')
      // revert select
      e.target.value = role
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={loading}
      className="bg-[#1f1f1f] border border-[#333] text-sm rounded px-2 py-1 focus:border-yellow-500 focus:outline-none disabled:opacity-50"
    >
      {roles.map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  )
}
