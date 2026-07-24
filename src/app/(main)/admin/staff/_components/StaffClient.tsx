'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react'
import { addStaff, updateStaff, deleteStaff } from '../actions'

type StaffMember = {
  id: string
  position: string
  order_index: number
  user_id: string
  profiles: {
    id: string
    username: string
    habbo_username: string
    avatar_url: string
    role: string
  }
}

type AvailableUser = {
  id: string
  username: string
  habbo_username: string
}

export default function StaffClient({ 
  initialStaff, 
  availableUsers 
}: { 
  initialStaff: StaffMember[], 
  availableUsers: AvailableUser[] 
}) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [users, setUsers] = useState<AvailableUser[]>(availableUsers)

  const [isAdding, setIsAdding] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [position, setPosition] = useState('')
  const [orderIndex, setOrderIndex] = useState('0')
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPosition, setEditPosition] = useState('')
  const [editOrderIndex, setEditOrderIndex] = useState('0')

  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!selectedUserId || !position) {
      alert('Kullanıcı ve pozisyon seçmelisiniz.')
      return
    }

    setLoading(true)
    try {
      await addStaff(selectedUserId, position, parseInt(orderIndex) || 0)
      alert('Personel başarıyla eklendi!')
      window.location.reload()
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editPosition) return

    setLoading(true)
    try {
      await updateStaff(id, editPosition, parseInt(editOrderIndex) || 0)
      alert('Personel başarıyla güncellendi!')
      window.location.reload()
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu personeli ekipten çıkarmak istediğinize emin misiniz?')) return
    
    setLoading(true)
    try {
      await deleteStaff(id)
      alert('Personel silindi!')
      window.location.reload()
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Add New Staff */}
      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Yeni Personel Ekle</h2>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              <Plus size={16} /> Ekle
            </button>
          )}
        </div>

        {isAdding && (
          <div className="space-y-4 border-t border-[#333] pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Kullanıcı Seç</label>
                <select 
                  value={selectedUserId} 
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Kullanıcı Seç --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.habbo_username})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Pozisyon (Örn: Editör, Radyocu)</label>
                <input 
                  type="text" 
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Pozisyon adı..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Sıralama (Küçük sayı önce çıkar)</label>
                <input 
                  type="number" 
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button 
                onClick={handleAdd}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                disabled={loading}
              >
                {loading ? 'Ekleniyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Staff List */}
      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">Sistem Rolü</th>
                <th className="px-6 py-4">Pozisyon</th>
                <th className="px-6 py-4">Sıralama</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {staff.length > 0 ? (
                staff.map((s) => (
                  <tr key={s.id} className="border-b border-[#333] hover:bg-[#333]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{s.profiles?.username}</div>
                      <div className="text-xs text-gray-500">Habbo: {s.profiles?.habbo_username}</div>
                    </td>
                    <td className="px-6 py-4">
                      {s.profiles?.role}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === s.id ? (
                        <input 
                          type="text" 
                          value={editPosition}
                          onChange={(e) => setEditPosition(e.target.value)}
                          className="bg-[#1f1f1f] border border-[#333] text-white rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none w-full max-w-[150px]"
                        />
                      ) : (
                        s.position
                      )}
                    </td>
                    <td className="px-6 py-4">
                       {editingId === s.id ? (
                        <input 
                          type="number" 
                          value={editOrderIndex}
                          onChange={(e) => setEditOrderIndex(e.target.value)}
                          className="bg-[#1f1f1f] border border-[#333] text-white rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none w-20"
                        />
                      ) : (
                        s.order_index
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === s.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUpdate(s.id)} 
                            disabled={loading}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded transition-colors"
                            title="Kaydet"
                          >
                            <Save size={16} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)} 
                            disabled={loading}
                            className="p-2 text-gray-400 hover:bg-gray-400/10 rounded transition-colors"
                            title="İptal"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingId(s.id)
                              setEditPosition(s.position)
                              setEditOrderIndex(s.order_index.toString())
                            }} 
                            disabled={loading}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(s.id)} 
                            disabled={loading}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Ekip üyesi bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
