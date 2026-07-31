'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, X, Save, UserPlus, Shield, Award, Hash, Check } from 'lucide-react'
import { addStaff, updateStaff, deleteStaff } from '../actions'
import Image from 'next/image'

type StaffMember = {
  id: string
  position: string
  order_index: number
  user_id: string
  profiles: {
    id: string
    username: string
    habbo_username: string
    avatar_url?: string
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
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff ?? [])
  const [users, setUsers] = useState<AvailableUser[]>(availableUsers ?? [])

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
      alert('Kullanıcı ve pozisyon adı seçmelisiniz!')
      return
    }

    setLoading(true)
    try {
      await addStaff(selectedUserId, position, parseInt(orderIndex) || 0)
      window.location.reload()
    } catch (err: any) {
      alert(err.message || 'Eklenirken hata oluştu!')
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editPosition) return

    setLoading(true)
    try {
      await updateStaff(id, editPosition, parseInt(editOrderIndex) || 0)
      window.location.reload()
    } catch (err: any) {
      alert(err.message || 'Güncellenirken hata oluştu!')
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu personeli resmi kadrodan çıkarmak istediğinize emin misiniz?')) return
    
    setLoading(true)
    try {
      await deleteStaff(id)
      window.location.reload()
    } catch (err: any) {
      alert(err.message || 'Silinirken hata oluştu!')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Yeni Personel Ekleme Kartı */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[3px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <UserPlus size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">YENİ KADRO PERSONELİ ATA</h2>
              <p className="text-xs text-gray-400">Resmi personel kadrosuna yeni bir HabboZone üyesi ekleyin ve unvan verin.</p>
            </div>
          </div>

          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="habbo-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-[3px] text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus size={16} /> Yeni Ata
            </button>
          )}
        </div>

        {isAdding && (
          <div className="space-y-6 border-t border-[#1e293b] pt-6 mt-6 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">KULLANICI SEÇİMİ <span className="text-red-400">*</span></label>
                <select 
                  value={selectedUserId} 
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="habbo-box w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[3px] px-4 py-3 text-sm font-bold focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Kadroya Eklenecek Üyeyi Seç --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} (Habbo: {u.habbo_username})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">GÖREV UNVANI / POZİSYON <span className="text-red-400">*</span></label>
                <input 
                  type="text" 
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="habbo-box w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[3px] px-4 py-3 text-sm font-bold focus:border-blue-500 focus:outline-none"
                  placeholder="Örn: Baş Editör, Etkinlik Sorumlusu..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">KADRO SIRALAMASI (ÖNCELİK)</label>
                <input 
                  type="number" 
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  className="habbo-box w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[3px] px-4 py-3 text-sm font-bold focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-gray-500 font-medium mt-1 block">Küçük sayılar sayfada en üstte gösterilir (Örn: 1, 2, 3...)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 rounded-[3px] text-xs font-bold text-gray-400 hover:text-white bg-[#050a14] border border-[#1e293b] hover:bg-[#0a1325] transition-colors"
                disabled={loading}
              >
                İptal Et
              </button>
              <button 
                onClick={handleAdd}
                className="habbo-button bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-2.5 rounded-[3px] text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
                disabled={loading}
              >
                <Check size={16} /> {loading ? 'Atama Yapılıyor...' : 'Kadroya Kaydet'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ekip Kadro Tablosu */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#050a14] border-b border-[#1e293b] flex items-center justify-between">
          <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Shield className="text-yellow-400" size={16} /> AKTİF PERSONEL LİSTESİ ({staff.length} Üye)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-gray-400 text-xs font-black uppercase tracking-wider border-b border-[#1e293b]">
              <tr>
                <th className="px-6 py-4">Kullanıcı Profil</th>
                <th className="px-6 py-4">Sistem Yetki Rolü</th>
                <th className="px-6 py-4">Kadro Pozisyonu / Unvan</th>
                <th className="px-6 py-4">Sıra No</th>
                <th className="px-6 py-4 text-right">Yönetim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {staff.length > 0 ? (
                staff.map((s) => (
                  <tr key={s.id} className="hover:bg-[#050a14] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[3px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center overflow-hidden shrink-0">
                          {s.profiles?.habbo_username ? (
                            <Image 
                              src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${s.profiles.habbo_username}&action=std&direction=2&head_direction=2&gesture=sml&size=m`}
                              alt={s.profiles.username}
                              width={40}
                              height={40}
                              className="object-contain -mt-2"
                              unoptimized
                            />
                          ) : (
                            <span className="font-black text-xs text-yellow-400">{s.profiles?.username?.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-white text-base flex items-center gap-2">
                            {s.profiles?.username}
                          </div>
                          <div className="text-xs text-gray-500">Habbo ID: <span className="text-gray-400 font-bold">{s.profiles?.habbo_username || 'Bağlı Değil'}</span></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-[2px] text-xs font-black uppercase tracking-wider border ${
                        s.profiles?.role === 'Owner' || s.profiles?.role === 'Developer'
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-md shadow-red-500/10'
                          : s.profiles?.role === 'Administrator'
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                          : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      }`}>
                        {s.profiles?.role || 'User'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {editingId === s.id ? (
                        <input 
                          type="text" 
                          value={editPosition}
                          onChange={(e) => setEditPosition(e.target.value)}
                          className="habbo-box bg-[#050a14] border-2 border-blue-500 text-white rounded-[3px] px-3 py-1.5 text-sm font-bold focus:outline-none w-full max-w-[220px]"
                          autoFocus
                        />
                      ) : (
                        <span className="font-bold text-yellow-300 bg-yellow-400/5 border border-yellow-400/20 px-3 py-1.5 rounded-[3px] text-xs">
                          {s.position}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                       {editingId === s.id ? (
                        <input 
                          type="number" 
                          value={editOrderIndex}
                          onChange={(e) => setEditOrderIndex(e.target.value)}
                          className="habbo-box bg-[#050a14] border-2 border-blue-500 text-white rounded-[3px] px-3 py-1.5 text-sm font-bold focus:outline-none w-20"
                        />
                      ) : (
                        <span className="font-black text-gray-400 bg-[#050a14] px-2.5 py-1 rounded-[2px] text-xs">
                          #{s.order_index}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {editingId === s.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUpdate(s.id)} 
                            disabled={loading}
                            className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-[3px] transition-all font-bold"
                            title="Değişiklikleri Kaydet"
                          >
                            <Save size={16} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)} 
                            disabled={loading}
                            className="p-2 bg-[#050a14] text-gray-400 hover:bg-[#0a1325] hover:text-white rounded-[3px] transition-all"
                            title="İptal Et"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingId(s.id)
                              setEditPosition(s.position)
                              setEditOrderIndex(s.order_index.toString())
                            }} 
                            disabled={loading}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-[3px] transition-all"
                            title="Düzenle"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(s.id)} 
                            disabled={loading}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-[3px] transition-all"
                            title="Kadroya Veda (Sil)"
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
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Award size={40} className="mx-auto mb-3 text-gray-600 opacity-40" />
                    <p className="font-bold text-base text-gray-400">Resmi kadroda henüz atanmış personel yok.</p>
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
