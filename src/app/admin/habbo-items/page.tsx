'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Edit, TrendingUp } from 'lucide-react';
import Link from 'next/link';

type Item = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image_url: string;
  current_value: number;
  currency_type: string;
  is_ltd: boolean;
  ltd_count: number;
  created_at: string;
  habbo_item_categories: { name: string };
};

export default function HabboItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [itemsRes, catsRes] = await Promise.all([
      supabase
        .from('habbo_items')
        .select('*, habbo_item_categories(name)')
        .order('created_at', { ascending: false }),
      supabase
        .from('habbo_item_categories')
        .select('id, name')
        .order('name', { ascending: true })
    ]);

    if (itemsRes.error) setError(itemsRes.error.message);
    else setItems(itemsRes.data || []);
    
    if (catsRes.data) setCategories(catsRes.data);

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu eşyayı silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase.from('habbo_items').delete().eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const updateItemValue = async (item: Item) => {
    const newVal = prompt(`${item.name} için yeni fiyatı girin (${item.currency_type}):`, item.current_value.toString());
    if (newVal === null || newVal === item.current_value.toString() || isNaN(Number(newVal))) return;

    const numericVal = Number(newVal);

    // Get current user id
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Update item
    const { error: updateError } = await supabase
      .from('habbo_items')
      .update({ current_value: numericVal, updated_at: new Date().toISOString() })
      .eq('id', item.id);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    // 2. Insert into values log
    const { error: logError } = await supabase
      .from('habbo_item_values')
      .insert({
        item_id: item.id,
        value: numericVal,
        currency_type: item.currency_type,
        updated_by: user?.id
      });

    if (logError) {
      console.error("Fiyat logu eklenemedi:", logError);
    }

    // Update local state
    setItems(items.map(i => i.id === item.id ? { ...i, current_value: numericVal } : i));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Eşyalar (Değerler)</h1>
          <p className="text-white/60">Sistemdeki tüm Habbo eşyalarını görüntüleyin ve fiyatlarını güncelleyin.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/habbo-items/categories" className="text-sm font-bold text-white/50 hover:text-white transition-colors underline underline-offset-4">
            Kategorileri Yönet
          </Link>
          <Link
            href="/admin/habbo-items/new"
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} /> Yeni Eşya Ekle
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 text-red-500 p-4 rounded-lg mb-8 font-bold">
          {error}
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
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80">Görsel</th>
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80">Eşya Adı</th>
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80">Kategori</th>
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80 text-right">Güncel Fiyat</th>
                <th className="p-4 font-bold uppercase tracking-wider text-sm opacity-80 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center opacity-60">
                    Henüz eşya eklenmemiş.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 w-20">
                      {item.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12 bg-black/20 rounded border border-white/10 flex items-center justify-center text-xs opacity-50">Yok</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold flex items-center gap-2">
                        {item.name}
                        {item.is_ltd && (
                          <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded font-black">LTD {item.ltd_count > 0 && `(${item.ltd_count})`}</span>
                        )}
                      </div>
                      <div className="text-xs text-white/40">{item.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold border border-white/10">
                        {item.habbo_item_categories?.name || 'Kategorisiz'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-black text-lg">
                        {item.current_value} <span className="text-sm font-bold text-white/50">{item.currency_type}</span>
                      </div>
                    </td>
                    <td className="p-4 flex justify-end gap-2 items-center h-20">
                      <button 
                        onClick={() => updateItemValue(item)}
                        className="p-2 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-transparent hover:border-green-500/30"
                        title="Fiyatı Güncelle"
                      >
                        <TrendingUp size={16} /> Fiyat Güncelle
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
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
