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

    let result;
    if (isEditMode && editingId) {
      result = await updateWikiCategory(editingId, formData);
      if (!result?.error) {
        setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } : c));
      }
    } else {
      result = await addWikiCategory(formData);
      if (!result?.error) {
        window.location.reload();
      }
    }

    if (result?.error) {
      setError(result.error);
    } else {
      closeModal();
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz? (İçindeki eşyalar da silinebilir veya hata verebilir)')) {
      const result = await deleteWikiCategory(id);
      if (result?.error) {
        alert('Hata: ' + result.error);
      } else {
        setCategories(categories.filter(c => c.id !== id));
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Package size={28} className="text-[#facc15]" />
            Wiki Kategorileri
          </h1>
          <p className="text-xs text-gray-300 font-bold uppercase tracking-wide mt-1">Wiki kütüphanesindeki ana kategorileri yönetin.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="habbo-button success px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} /> Yeni Kategori Ekle
        </button>
      </div>

      <div className="bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050a14] text-gray-400 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Sıra</th>
                <th className="px-6 py-4">İsim</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Açıklama</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-[#0a1325]/50 transition-colors">
                  <td className="px-6 py-4 font-mono">{category.sort_order}</td>
                  <td className="px-6 py-4 font-bold text-white">{category.name}</td>
                  <td className="px-6 py-4 font-mono text-gray-400">{category.slug}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{category.description || '-'}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openModal(category)}
                      className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-[2px] transition-colors"
                      title="Düzenle"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-[2px] transition-colors"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a1325] border border-[#1e293b] rounded-[3px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#050a14] border-b border-[#1e293b] px-6 py-4 flex items-center justify-between">
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
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-[2px] flex items-start gap-2 text-red-400 text-sm">
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
                    className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                    className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-4 py-2.5 text-gray-400 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="orn-mobilyalar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">Açıklama (Opsiyonel)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none h-24"
                    placeholder="Kısa bir açıklama girin..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">Sıralama (Küçük sayı önce çıkar)</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-[2px] font-bold text-gray-400 hover:text-white hover:bg-[#0a1325] transition-colors"
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
