'use client'

import { useState } from 'react'
import { createCategory } from '../actions'
import { FolderPlus, Check } from 'lucide-react'

export default function AddCategoryForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createCategory(formData)
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      alert(err.message || 'Kategori eklenirken hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
          <FolderPlus size={14} className="text-yellow-400" /> KATEGORİ ADI
        </label>
        <input 
          name="name" 
          required 
          className="habbo-box w-full px-3.5 py-2.5 bg-[#050a14] border-2 border-white/10 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-yellow-400 transition-all placeholder:text-gray-600 placeholder:font-normal"
          placeholder="Örn: Klasik Nadireler, LTD Eşyaları..."
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="habbo-button w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        <Check size={16} /> {loading ? 'Oluşturuluyor...' : 'Yeni Kategori Ekle'}
      </button>
    </form>
  )
}
