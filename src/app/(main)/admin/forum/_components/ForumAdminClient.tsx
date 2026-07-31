'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Plus, Trash2, Edit2, X, Save, Folder, MessageSquare } from 'lucide-react'
import { createCategory, deleteCategory, createForum, updateForum, deleteForum } from '../actions'

type Category = {
  id: string
  name: string
  slug: string
  description: string
}

type Forum = {
  id: string
  category_id: string
  title: string
  slug: string
  description: string
  icon: string
  order_index: number
}

export default function ForumAdminClient({
  categories,
  forums
}: {
  categories: Category[]
  forums: Forum[]
}) {
  const [loading, setLoading] = useState(false)

  // Category Add State
  const [isAddingCat, setIsAddingCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatSlug, setNewCatSlug] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')

  // Forum Add State
  const [addingForumToCat, setAddingForumToCat] = useState<string | null>(null)
  const [newForumTitle, setNewForumTitle] = useState('')
  const [newForumSlug, setNewForumSlug] = useState('')
  const [newForumDesc, setNewForumDesc] = useState('')
  const [newForumIcon, setNewForumIcon] = useState('')
  const [newForumOrder, setNewForumOrder] = useState('0')

  // Edit Forum State
  const [editingForumId, setEditingForumId] = useState<string | null>(null)
  const [editForumTitle, setEditForumTitle] = useState('')
  const [editForumDesc, setEditForumDesc] = useState('')
  const [editForumIcon, setEditForumIcon] = useState('')
  const [editForumOrder, setEditForumOrder] = useState('0')

  const handleCreateCategory = async () => {
    if (!newCatName || !newCatSlug) {
      alert('İsim ve URL (slug) zorunludur.')
      return
    }
    setLoading(true)
    try {
      await createCategory(newCatName, newCatSlug, newCatDesc)
      setIsAddingCat(false)
      setNewCatName('')
      setNewCatSlug('')
      setNewCatDesc('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz? (İçindeki forumlar varsa hata verebilir)')) return
    setLoading(true)
    try {
      await deleteCategory(id)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateForum = async (categoryId: string) => {
    if (!newForumTitle || !newForumSlug) {
      alert('İsim ve URL (slug) zorunludur.')
      return
    }
    setLoading(true)
    try {
      await createForum(categoryId, newForumTitle, newForumSlug, newForumDesc, newForumIcon, parseInt(newForumOrder) || 0)
      setAddingForumToCat(null)
      setNewForumTitle('')
      setNewForumSlug('')
      setNewForumDesc('')
      setNewForumIcon('')
      setNewForumOrder('0')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateForum = async (id: string) => {
    setLoading(true)
    try {
      await updateForum(id, editForumTitle, editForumDesc, editForumIcon, parseInt(editForumOrder) || 0)
      setEditingForumId(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteForum = async (id: string) => {
    if (!confirm('Bu alt forumu silmek istediğinize emin misiniz?')) return
    setLoading(true)
    try {
      await deleteForum(id)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate slug
  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  return (
    <div className="space-y-6">
      
      {/* Categories Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Folder className="text-[#facc15]" size={20} /> KATEGORİLER
        </h2>
        {!isAddingCat && (
          <button 
            onClick={() => setIsAddingCat(true)}
            className="habbo-button flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded-[2px] text-xs font-black uppercase tracking-wider shadow transition-colors"
          >
            <Plus size={16} /> YENİ KATEGORİ EKLE
          </button>
        )}
      </div>

      {/* Add Category Form */}
      {isAddingCat && (
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[2px] p-5 space-y-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">KATEGORİ ADI</label>
              <input 
                type="text" 
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value)
                  if (!newCatSlug) setNewCatSlug(generateSlug(e.target.value))
                }}
                className="w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                placeholder="Örn: Topluluk & Etkinlikler"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">URL (SLUG)</label>
              <input 
                type="text" 
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                placeholder="topluluk-etkinlikler"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">AÇIKLAMA (İSTEĞE BAĞLI)</label>
              <input 
                type="text" 
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-medium focus:border-[#facc15] focus:outline-none transition-colors"
                placeholder="Kategori hakkında kısa açıklama..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={() => setIsAddingCat(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              İPTAL
            </button>
            <button 
              onClick={handleCreateCategory}
              className="habbo-button bg-[#22c55e] hover:bg-green-600 text-black font-black uppercase tracking-wider px-5 py-2 rounded-[2px] text-xs transition-colors shadow"
              disabled={loading}
            >
              KAYDET
            </button>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-6">
        {(categories ?? []).map(cat => (
          <div key={cat.id} className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[2px] overflow-hidden shadow-lg">
            {/* Category Header */}
            <div className="bg-[#050a14] p-4 flex items-center justify-between border-b border-[#1e293b]">
              <div>
                <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
                  <Folder className="text-[#facc15]" size={18} />
                  {cat.name}
                </h3>
                {cat.description && <p className="text-xs text-gray-300 font-medium mt-1">{cat.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setAddingForumToCat(addingForumToCat === cat.id ? null : cat.id)}
                  className="habbo-button bg-[#3b82f6] hover:bg-blue-600 text-white px-3 py-1.5 rounded-[2px] transition-colors text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <Plus size={14} /> FORUM EKLE
                </button>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-1.5 rounded-[2px] transition-colors"
                  aria-label="Kategoriyi Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Add Forum Form */}
            {addingForumToCat === cat.id && (
              <div className="bg-[#050a14]/60 p-5 border-b border-[#1e293b] space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">FORUM ADI</label>
                    <input 
                      type="text" 
                      value={newForumTitle}
                      onChange={(e) => {
                        setNewForumTitle(e.target.value)
                        if (!newForumSlug) setNewForumSlug(generateSlug(e.target.value))
                      }}
                      className="w-full bg-[#0a1325] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                      placeholder="Örn: Genel Tartışma"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">URL (SLUG)</label>
                    <input 
                      type="text" 
                      value={newForumSlug}
                      onChange={(e) => setNewForumSlug(e.target.value)}
                      className="w-full bg-[#0a1325] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                      placeholder="genel-tartisma"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">İKON URL (İSTEĞE BAĞLI)</label>
                    <input 
                      type="text" 
                      value={newForumIcon}
                      onChange={(e) => setNewForumIcon(e.target.value)}
                      className="w-full bg-[#0a1325] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">SIRALAMA (KÜÇÜK ÖNCE)</label>
                    <input 
                      type="number" 
                      value={newForumOrder}
                      onChange={(e) => setNewForumOrder(e.target.value)}
                      className="w-full bg-[#0a1325] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">AÇIKLAMA</label>
                    <input 
                      type="text" 
                      value={newForumDesc}
                      onChange={(e) => setNewForumDesc(e.target.value)}
                      className="w-full bg-[#0a1325] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-medium focus:border-[#facc15] focus:outline-none transition-colors"
                      placeholder="Bu forum bölümünde neler konuşuluyor..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setAddingForumToCat(null)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                    disabled={loading}
                  >
                    İPTAL
                  </button>
                  <button 
                    onClick={() => handleCreateForum(cat.id)}
                    className="habbo-button bg-[#22c55e] hover:bg-green-600 text-black font-black uppercase tracking-wider px-5 py-2 rounded-[2px] text-xs transition-colors shadow"
                    disabled={loading}
                  >
                    EKLE
                  </button>
                </div>
              </div>
            )}

            {/* Forums List */}
            <div className="divide-y divide-[#1e293b]">
              {(forums ?? []).filter(f => f.category_id === cat.id).map(forum => (
                <div key={forum.id} className="p-4 flex items-start justify-between hover:bg-[#050a14] transition-colors">
                  {editingForumId === forum.id ? (
                    <div className="w-full space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">FORUM ADI</label>
                          <input 
                            type="text" 
                            value={editForumTitle}
                            onChange={(e) => setEditForumTitle(e.target.value)}
                            className="w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">İKON URL</label>
                          <input 
                            type="text" 
                            value={editForumIcon}
                            onChange={(e) => setEditForumIcon(e.target.value)}
                            className="w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">SIRALAMA</label>
                          <input 
                            type="number" 
                            value={editForumOrder}
                            onChange={(e) => setEditForumOrder(e.target.value)}
                            className="w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-bold focus:border-[#facc15] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="lg:col-span-3">
                          <label className="block text-[11px] font-black uppercase tracking-wider text-gray-300 mb-1.5">AÇIKLAMA</label>
                          <input 
                            type="text" 
                            value={editForumDesc}
                            onChange={(e) => setEditForumDesc(e.target.value)}
                            className="w-full bg-[#050a14] border border-[#1e293b] text-white rounded-[2px] px-3.5 py-2 text-xs font-medium focus:border-[#facc15] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingForumId(null)}
                          className="p-2 text-gray-400 hover:bg-[#0a1325] rounded-[2px] transition-colors"
                          title="İptal"
                        >
                          <X size={16} />
                        </button>
                        <button 
                          onClick={() => handleUpdateForum(forum.id)}
                          className="p-2 text-[#22c55e] hover:bg-green-500/10 rounded-[2px] transition-colors"
                          title="Kaydet"
                        >
                          <Save size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#050a14] border border-[#1e293b] rounded-[2px] flex items-center justify-center shrink-0 shadow-inner">
                          {forum.icon ? (
                            <Image src={forum.icon} alt="" width={24} height={24} className="object-contain" unoptimized />
                          ) : (
                            <MessageSquare size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-white text-sm tracking-wide">{forum.title}</h4>
                          <p className="text-xs text-gray-300 font-medium mt-0.5">{forum.description}</p>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2 flex gap-4">
                            <span className="text-[#facc15]">SIRA: {forum.order_index}</span>
                            <span className="text-[#3b82f6]">URL: /{forum.slug}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => {
                            setEditingForumId(forum.id)
                            setEditForumTitle(forum.title)
                            setEditForumDesc(forum.description || '')
                            setEditForumIcon(forum.icon || '')
                            setEditForumOrder(forum.order_index.toString())
                          }}
                          className="p-2 text-[#3b82f6] hover:bg-blue-500/10 rounded-[2px] transition-colors"
                          aria-label="Düzenle"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteForum(forum.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-[2px] transition-colors"
                          aria-label="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {(forums ?? []).filter(f => f.category_id === cat.id).length === 0 && (
                <div className="p-6 text-center text-gray-400 font-bold text-xs uppercase tracking-wider">
                  BU KATEGORİDE HENÜZ ALT FORUM YOK.
                </div>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="py-12 text-center text-gray-400 font-bold text-sm uppercase tracking-wider bg-[#0a1325] rounded-[2px] border border-[#1e293b]">
            HENÜZ KATEGORİ BULUNMUYOR.
          </div>
        )}
      </div>

    </div>
  )
}
