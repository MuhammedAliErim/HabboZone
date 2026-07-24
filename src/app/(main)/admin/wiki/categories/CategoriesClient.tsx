'use client';

import { useState } from 'react';
import { addWikiCategory, updateWikiCategory, deleteWikiCategory, WikiCategory } from '../actions';
import { Package, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

export default function CategoriesClient({ initialCategories }: { initialCategories: WikiCategory[] }) {
  const [categories, setCategories] = useState<WikiCategory[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: !isEditMode ? generateSlug(name) : prev.slug
    }));
  };

  const openModal = (category?: WikiCategory) => {
    if (category) {
      setIsEditMode(true);
      setEditingId(category.id);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        sort_order: category.sort_order,
      });
    } else {
      setIsEditMode(false);
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        sort_order: 0,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && editingId) {
        await updateWikiCategory(editingId, formData);
        setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } : c));
      } else {
        await addWikiCategory(formData);
        // Refresh page to get new categories with proper IDs
        window.location.reload();
      }
      closeModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz? (İçindeki eşyalar da silinebilir veya hata verebilir)')) {
      try {
        await deleteWikiCategory(id);
        setCategories(categories.filter(c => c.id !== id));
      } catch (err: any) {
        alert('Hata: ' + err.message);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={24} className="text-yellow-400" />
            Wiki Kategorileri
          </h1>
          <p className="text-gray-400 text-sm mt-1">Wiki kütüphanesindeki ana kategorileri yönetin.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="habbo-button success px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} /> Yeni Kategori Ekle
        </button>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0f172a] text-gray-400 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Sıra</th>
                <th className="px-6 py-4">İsim</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Açıklama</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-[#334155]/50 transition-colors">
                  <td className="px-6 py-4 font-mono">{category.sort_order}</td>
                  <td className="px-6 py-4 font-bold text-white">{category.name}</td>
                  <td className="px-6 py-4 font-mono text-gray-400">{category.slug}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{category.description || '-'}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openModal(category)}
                      className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Henüz hiçbir kategori eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border-2 border-black rounded-xl shadow-[8px_8px_0_#000] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#0f172a] border-b border-[#334155] px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Package size={20} className="text-yellow-400" />
                {isEditMode ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">Kategori İsmi</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Örn: Mobilyalar"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">URL Slug (Otomatik)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-gray-400 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="orn-mobilyalar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">Açıklama (Opsiyonel)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none h-24"
                    placeholder="Kısa bir açıklama girin..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">Sıralama (Küçük sayı önce çıkar)</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-[#334155] transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="habbo-button success px-6 py-2"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
