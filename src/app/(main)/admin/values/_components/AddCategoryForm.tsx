'use client'

import { useState } from 'react'
import { createCategory } from '../actions'

export default function AddCategoryForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createCategory(formData)
      alert('Kategori eklendi!')
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Kategori Adı</label>
        <input 
          name="name" 
          required 
          className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333] rounded text-white focus:outline-none focus:border-yellow-500"
          placeholder="Örn: Klasik Nadireler"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded transition-colors w-full disabled:opacity-50"
      >
        {loading ? 'Ekleniyor...' : 'Kategori Ekle'}
      </button>
    </form>
  )
}
