'use client'

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
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Folder className="text-yellow-400" /> Kategoriler
        </h2>
        {!isAddingCat && (
          <button 
            onClick={() => setIsAddingCat(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            <Plus size={16} /> Yeni Kategori Ekle
          </button>
        )}
      </div>

      {/* Add Category Form */}
      {isAddingCat && (
        <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Kategori Adı</label>
              <input 
                type="text" 
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value)
                  if (!newCatSlug) setNewCatSlug(generateSlug(e.target.value))
                }}
                className="w-full bg-[#1f1f1f] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">URL (Slug)</label>
              <input 
                type="text" 
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Açıklama (İsteğe bağlı)</label>
              <input 
                type="text" 
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsAddingCat(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              İptal
            </button>
            <button 
              onClick={handleCreateCategory}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
              disabled={loading}
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-[#1f1f1f] border border-[#333] rounded-lg overflow-hidden">
            {/* Category Header */}
            <div className="bg-[#2a2a2a] p-4 flex items-center justify-between border-b border-[#333]">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  {cat.name}
                </h3>
                {cat.description && <p className="text-xs text-gray-400 mt-1">{cat.description}</p>}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setAddingForumToCat(addingForumToCat === cat.id ? null : cat.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors text-xs flex items-center gap-1"
                >
                  <Plus size={14} /> Forum Ekle
                </button>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="bg-red-900/50 hover:bg-red-800 text-red-400 p-2 rounded transition-colors"
                  title="Kategoriyi Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Add Forum Form */}
            {addingForumToCat === cat.id && (
              <div className="bg-[#222] p-4 border-b border-[#333] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Forum Adı</label>
                    <input 
                      type="text" 
                      value={newForumTitle}
                      onChange={(e) => {
                        setNewForumTitle(e.target.value)
                        if (!newForumSlug) setNewForumSlug(generateSlug(e.target.value))
                      }}
                      className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">URL (Slug)</label>
                    <input 
                      type="text" 
                      value={newForumSlug}
                      onChange={(e) => setNewForumSlug(e.target.value)}
                      className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">İkon URL (İsteğe bağlı)</label>
                    <input 
                      type="text" 
                      value={newForumIcon}
                      onChange={(e) => setNewForumIcon(e.target.value)}
                      className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Sıralama (Küçük önce)</label>
                    <input 
                      type="number" 
                      value={newForumOrder}
                      onChange={(e) => setNewForumOrder(e.target.value)}
                      className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <label className="block text-xs text-gray-400 mb-1">Açıklama</label>
                    <input 
                      type="text" 
                      value={newForumDesc}
                      onChange={(e) => setNewForumDesc(e.target.value)}
                      className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setAddingForumToCat(null)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    disabled={loading}
                  >
                    İptal
                  </button>
                  <button 
                    onClick={() => handleCreateForum(cat.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    disabled={loading}
                  >
                    Ekle
                  </button>
                </div>
              </div>
            )}

            {/* Forums List */}
            <div className="divide-y divide-[#333]">
              {forums.filter(f => f.category_id === cat.id).map(forum => (
                <div key={forum.id} className="p-4 flex items-start justify-between hover:bg-[#252525] transition-colors">
                  {editingForumId === forum.id ? (
                    <div className="w-full space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Forum Adı</label>
                          <input 
                            type="text" 
                            value={editForumTitle}
                            onChange={(e) => setEditForumTitle(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">İkon URL</label>
                          <input 
                            type="text" 
                            value={editForumIcon}
                            onChange={(e) => setEditForumIcon(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Sıralama</label>
                          <input 
                            type="number" 
                            value={editForumOrder}
                            onChange={(e) => setEditForumOrder(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="lg:col-span-3">
                          <label className="block text-xs text-gray-400 mb-1">Açıklama</label>
                          <input 
                            type="text" 
                            value={editForumDesc}
                            onChange={(e) => setEditForumDesc(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-white rounded px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingForumId(null)}
                          className="p-2 text-gray-400 hover:bg-gray-400/10 rounded"
                        >
                          <X size={16} />
                        </button>
                        <button 
                          onClick={() => handleUpdateForum(forum.id)}
                          className="p-2 text-green-500 hover:bg-green-500/10 rounded"
                        >
                          <Save size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#333] rounded flex items-center justify-center shrink-0">
                          {forum.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={forum.icon} alt="" className="w-6 h-6 object-contain" />
                          ) : (
                            <MessageSquare size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{forum.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{forum.description}</p>
                          <div className="text-[10px] text-gray-500 mt-2 flex gap-3">
                            <span>Sıra: {forum.order_index}</span>
                            <span>URL: /{forum.slug}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingForumId(forum.id)
                            setEditForumTitle(forum.title)
                            setEditForumDesc(forum.description || '')
                            setEditForumIcon(forum.icon || '')
                            setEditForumOrder(forum.order_index.toString())
                          }}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteForum(forum.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {forums.filter(f => f.category_id === cat.id).length === 0 && (
                <div className="p-6 text-center text-gray-500 text-sm">
                  Bu kategoride henüz alt forum yok.
                </div>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="py-12 text-center text-gray-500 bg-[#1f1f1f] rounded-lg border border-[#333]">
            Henüz kategori bulunmuyor.
          </div>
        )}
      </div>

    </div>
  )
}
