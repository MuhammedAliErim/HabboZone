'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  created_at: string;
};

export default function HabboItemCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('habbo_item_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!isAdding) return; 
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data, error } = await supabase
      .from('habbo_item_categories')
      .insert([
        {
          name,
          slug,
          description,
          icon_url: iconUrl,
        },
      ])
      .select();

    if (error) {
      setError(error.message);
    } else if (data) {
      setCategories([data[0], ...categories]);
      setIsAdding(false);
      setName('');
      setSlug('');
      setDescription('');
      setIconUrl('');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase.from('habbo_item_categories').delete().eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Eşya Kategorileri</h1>
          <p className="text-white/60">Habbo Nadire, LTD ve Kıyafet kategorilerini yönetin.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/habbo-items" className="text-sm font-bold text-white/50 hover:text-white transition-colors underline underline-offset-4">Eşyalara Dön</Link>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            {isAdding ? 'İptal' : 'Yeni Ekle'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 text-red-500 p-4 rounded-lg mb-8 font-bold">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold uppercase mb-4">Yeni Kategori Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Kategori Adı</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                  placeholder="Örn: LTD"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                  placeholder="orn-ltd"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Açıklama</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                placeholder="Kategori hakkında kısa açıklama..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase flex items-center gap-2">
                <LinkIcon size={14} /> İkon URL (Opsiyonel)
              </label>
              <input
                type="text"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-4xl text-primary">⚙</div>
        </div>
      ) : (
        <div className="bg-white/5 border-2 border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/40 border-b-2 border-white/10">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80">İkon & Ad</th>
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80">Açıklama</th>
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80">Slug</th>
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center opacity-60">
                    Henüz eşya kategorisi eklenmemiş.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold flex items-center gap-3">
                      {category.icon_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={category.icon_url} alt={category.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 bg-black/20 rounded flex items-center justify-center text-xs text-white/50 border border-white/10">?</div>
                      )}
                      {category.name}
                    </td>
                    <td className="p-4 opacity-60 text-sm max-w-xs truncate">{category.description || '-'}</td>
                    <td className="p-4 opacity-60 text-sm">{category.slug}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
