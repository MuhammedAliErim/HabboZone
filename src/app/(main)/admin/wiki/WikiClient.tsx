'use client';

import { useState } from 'react';
import { addWikiItem, updateWikiItem, deleteWikiItem, WikiItem, WikiCategory } from './actions';
import { Package, Plus, Pencil, Trash2, X, AlertCircle, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WikiClient({ 
  initialItems, 
  categories 
}: { 
  initialItems: WikiItem[], 
  categories: WikiCategory[] 
}) {
  const [items, setItems] = useState<WikiItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Arama ve Filtreleme
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    image_url: '',
    rarity_level: 'Common' as 'Common' | 'Rare' | 'Epic' | 'Legendary' | null,
    market_value: '',
    release_date: '',
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

  const openModal = (item?: WikiItem) => {
    if (item) {
      setIsEditMode(true);
      setEditingId(item.id);
      setFormData({
        category_id: item.category_id,
        name: item.name,
        slug: item.slug,
        description: item.description || '',
        image_url: item.image_url,
        rarity_level: item.rarity_level,
        market_value: item.market_value || '',
        release_date: item.release_date || '',
      });
    } else {
      setIsEditMode(false);
      setEditingId(null);
      setFormData({
        category_id: categories.length > 0 ? categories[0].id : '',
        name: '',
        slug: '',
        description: '',
        image_url: '',
        rarity_level: 'Common',
        market_value: '',
        release_date: '',
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

    // Kategori kontrolü
    if (!formData.category_id) {
      setError("Lütfen bir kategori seçin.");
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        market_value: formData.market_value === '' ? null : formData.market_value,
        release_date: formData.release_date === '' ? null : formData.release_date,
      };

      if (isEditMode && editingId) {
        await updateWikiItem(editingId, dataToSubmit);
      } else {
        await addWikiItem(dataToSubmit);
      }
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu eşyayı silmek istediğinize emin misiniz?')) {
      try {
        await deleteWikiItem(id);
        setItems(items.filter(c => c.id !== id));
      } catch (err: any) {
        alert('Hata: ' + err.message);
      }
    }
  };

  // Filtrelenmiş Liste
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={24} className="text-yellow-400" />
            Wiki Eşyaları
          </h1>
          <p className="text-gray-400 text-sm mt-1">Wiki kütüphanesindeki tüm eşyaları yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/wiki/categories"
            className="px-4 py-2 bg-[#334155] text-white rounded-lg font-bold hover:bg-[#475569] transition-colors"
          >
            Kategorileri Yönet
          </Link>
          <button 
            onClick={() => openModal()}
            className="habbo-button success px-4 py-2 flex items-center gap-2"
          >
            <Plus size={16} /> Yeni Eşya Ekle
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Eşya adı veya açıklama ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="sm:w-64 relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0f172a] text-gray-400 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Görsel</th>
                <th className="px-6 py-4">İsim</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Nadirlik</th>
                <th className="px-6 py-4">Pazar Değeri</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#334155]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-[#0f172a] rounded-lg flex items-center justify-center p-1 relative border border-[#334155]">
                      <Image 
                        src={item.image_url} 
                        alt={item.name} 
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">{item.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-[#334155] rounded-md text-xs font-medium">
                      {item.wiki_categories?.name || 'Bilinmiyor'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                      item.rarity_level === 'Legendary' ? 'bg-orange-500/20 text-orange-400' :
                      item.rarity_level === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                      item.rarity_level === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.rarity_level || 'Common'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.market_value ? (
                      <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm">
                        <Image src="/images/credits.png" alt="C" width={14} height={14} />
                        {item.market_value}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2 h-full py-6">
                    <button 
                      onClick={() => openModal(item)}
                      className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Package size={32} className="mx-auto mb-3 opacity-20" />
                    Aradığınız kriterlere uygun eşya bulunamadı.
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
          <div className="bg-[#1e293b] border-2 border-black rounded-xl shadow-[8px_8px_0_#000] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="bg-[#0f172a] border-b border-[#334155] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Package size={20} className="text-yellow-400" />
                {isEditMode ? 'Eşyayı Düzenle' : 'Yeni Eşya Ekle'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Kategori</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="" disabled>Seçiniz...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Eşya İsmi</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleNameChange}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Örn: Kırmızı Ejderha"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-gray-400 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Açıklama (Opsiyonel)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none h-24"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Görsel URL</label>
                    <input
                      type="text"
                      required
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="https://..."
                    />
                    {formData.image_url && (
                      <div className="mt-2 w-16 h-16 bg-[#0f172a] border border-[#334155] rounded-lg p-1 relative flex items-center justify-center">
                        <Image 
                          src={formData.image_url} 
                          alt="Preview" 
                          fill 
                          className="object-contain p-1" 
                          unoptimized
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Nadirlik Seviyesi</label>
                    <select
                      value={formData.rarity_level || 'Common'}
                      onChange={(e) => setFormData({...formData, rarity_level: e.target.value as any})}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Common">Common (Yaygın)</option>
                      <option value="Rare">Rare (Nadir)</option>
                      <option value="Epic">Epic (Epik)</option>
                      <option value="Legendary">Legendary (Efsanevi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Pazar Değeri (Opsiyonel)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Image src="/images/credits.png" alt="C" width={16} height={16} />
                      </div>
                      <input
                        type="number"
                        value={formData.market_value}
                        onChange={(e) => setFormData({...formData, market_value: e.target.value})}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-10 pr-4 py-2.5 text-yellow-400 font-bold focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Örn: 50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Çıkış Tarihi (Opsiyonel)</label>
                    <input
                      type="date"
                      value={formData.release_date}
                      onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-[#334155]">
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
