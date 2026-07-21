'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewHabboItemPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [currencyType, setCurrencyType] = useState('Kredi');
  const [isLtd, setIsLtd] = useState(false);
  const [ltdCount, setLtdCount] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories
    supabase.from('habbo_item_categories').select('id, name').order('name').then(({ data }) => {
      if (data) {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      }
    });
  }, []);

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
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum bulunamadı.');

      let imageUrl = '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('habbo_items')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('habbo_items')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      const { data: insertedItem, error: insertError } = await supabase
        .from('habbo_items')
        .insert({
          category_id: categoryId,
          name,
          slug,
          description,
          image_url: imageUrl,
          current_value: Number(currentValue),
          currency_type: currencyType,
          is_ltd: isLtd,
          ltd_count: Number(ltdCount)
        }).select().single();

      if (insertError) throw insertError;

      // Log the initial value
      if (insertedItem) {
        await supabase.from('habbo_item_values').insert({
          item_id: insertedItem.id,
          value: insertedItem.current_value,
          currency_type: insertedItem.currency_type,
          updated_by: user.id
        });
      }

      router.push('/admin/habbo-items');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/habbo-items" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Yeni Eşya Ekle</h2>
          <p className="text-white/60">Sisteme yeni bir nadire, LTD veya eşya kaydedin.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Temel Bilgiler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Eşya Adı</label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="Örn: Mavi Ejderha"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="mavi-ejderha"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Açıklama (Opsiyonel)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="Eşya hakkında kısa bir not..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Kategori</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Görsel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={20}/> Görsel Yükle</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-white/60
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/80 transition-colors"
          />
        </div>

        {/* Değer & Özel Durumlar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Değer Bilgileri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Başlangıç Değeri</label>
              <input
                type="number"
                required
                min="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Para Birimi</label>
              <select
                value={currencyType}
                onChange={(e) => setCurrencyType(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              >
                <option value="Kredi">Kredi</option>
                <option value="Elmas">Elmas</option>
                <option value="Duckets">Duckets</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isLtd} 
                onChange={(e) => setIsLtd(e.target.checked)} 
                className="w-5 h-5 accent-primary" 
              />
              <span className="font-bold">Bu eşya LTD mi?</span>
            </label>
            
            {isLtd && (
              <div className="flex-1">
                <label className="block text-xs font-bold mb-1 opacity-80 uppercase">LTD Üretim Sayısı</label>
                <input
                  type="number"
                  min="0"
                  value={ltdCount}
                  onChange={(e) => setLtdCount(e.target.value)}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                  placeholder="Örn: 250"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest pixel-borders hover:bg-primary/90 transition-colors disabled:opacity-50 text-lg shadow-xl shadow-primary/20"
        >
          {loading ? 'Ekleniyor...' : <><Save size={24} /> Eşyayı Kaydet</>}
        </button>
      </form>
    </div>
  );
}
