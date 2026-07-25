'use client'

import { useState } from 'react'
import { createItem } from '../actions'
import { PackagePlus, Image as ImageIcon, Check, Coins, Sparkles, Folder } from 'lucide-react'

type Category = {
  id: string
  name: string
}

export default function AddItemForm({ categories }: { categories: Category[] }) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createItem(formData)
      ;(e.target as HTMLFormElement).reset()
      setImageUrl('')
    } catch (err: any) {
      alert(err.message || 'Eşya eklenirken hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
          <Folder size={14} className="text-blue-400" /> KATEGORİ SEÇİMİ <span className="text-red-400">*</span>
        </label>
        <select 
          name="category_id" 
          required 
          className="habbo-box w-full px-3.5 py-2.5 bg-[#050a14] border-2 border-white/10 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-blue-400 transition-all"
        >
          <option value="">-- Bir Kategori Belirleyin --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
          <PackagePlus size={14} className="text-emerald-400" /> EŞYA / NADİRE ADI <span className="text-red-400">*</span>
        </label>
        <input 
          name="name" 
          required 
          className="habbo-box w-full px-3.5 py-2.5 bg-[#050a14] border-2 border-white/10 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600 placeholder:font-normal"
          placeholder="Örn: Mavi Ejderha Lambası, Altın Taht..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
            <Coins size={14} className="text-yellow-400" /> DEĞER MİKTARI <span className="text-red-400">*</span>
          </label>
          <input 
            name="current_value" 
            type="number"
            required 
            min="0"
            className="habbo-box w-full px-3.5 py-2.5 bg-[#050a14] border-2 border-white/10 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-yellow-400 transition-all"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
            <Sparkles size={14} className="text-cyan-400" /> PARA BİRİMİ
          </label>
          <select 
            name="currency_type" 
            className="habbo-box w-full px-3.5 py-2.5 bg-[#050a14] border-2 border-white/10 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-cyan-400 transition-all"
          >
            <option value="Kredi">Kredi (c)</option>
            <option value="Elmas">Elmas / Elmas Bar</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
          <ImageIcon size={14} className="text-purple-400" /> GÖRSEL URL / İKON ADRESİ
        </label>
        <input 
          name="image_url" 
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="habbo-box w-full px-3.5 py-2.5 bg-[#050a14] border-2 border-white/10 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-purple-400 transition-all placeholder:text-gray-600 placeholder:font-normal"
          placeholder="https://www.habbo.com.tr/habbo-imaging/icon/..."
        />
        {imageUrl && (
          <div className="mt-2.5 p-3 rounded-xl bg-[#050a14] border border-white/10 flex items-center gap-3">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Önizleme:</span>
            <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-white/5">
              <img src={imageUrl} alt="preview" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="habbo-button w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
      >
        <Check size={16} /> {loading ? 'Eşya Ekleniyor...' : 'Eşyayı Değer Borsa Listesine Ekle'}
      </button>
    </form>
  )
}
