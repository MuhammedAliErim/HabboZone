'use client'

import { useState } from 'react'
import { createItem } from '../actions'

type Category = {
  id: string
  name: string
}

export default function AddItemForm({ categories }: { categories: Category[] }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createItem(formData)
      alert('Eşya eklendi!')
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
        <label className="block text-sm text-gray-400 mb-1">Kategori</label>
        <select 
          name="category_id" 
          required 
          className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333] rounded text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="">Kategori Seçin</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Eşya Adı</label>
        <input 
          name="name" 
          required 
          className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333] rounded text-white focus:outline-none focus:border-yellow-500"
          placeholder="Örn: Mavi Ejderha"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Değer</label>
          <input 
            name="current_value" 
            type="number"
            required 
            min="0"
            className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333] rounded text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Para Birimi</label>
          <select 
            name="currency_type" 
            className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333] rounded text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="Kredi">Kredi</option>
            <option value="Elmas">Elmas</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Görsel URL (İsteğe Bağlı)</label>
        <input 
          name="image_url" 
          className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333] rounded text-white focus:outline-none focus:border-yellow-500"
          placeholder="https://..."
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded transition-colors w-full disabled:opacity-50"
      >
        {loading ? 'Ekleniyor...' : 'Eşya Ekle'}
      </button>
    </form>
  )
}
