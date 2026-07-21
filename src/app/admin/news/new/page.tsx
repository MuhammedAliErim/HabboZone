'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewNewsPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('Draft');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  // SEO Meta
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').eq('type', 'news');
    if (data) {
      setCategories(data);
      if (data.length > 0) setCategoryId(data[0].id);
    }
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum bulunamadı.');

      let thumbnailUrl = '';

      // 2. Upload image if exists
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('news')
          .upload(filePath, coverImage);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('news')
          .getPublicUrl(filePath);
          
        thumbnailUrl = publicUrl;
      }

      // 3. Prepare SEO Metadata
      const seoMetadata = {
        meta_title: metaTitle,
        meta_description: metaDescription
      };

      // 4. Insert News
      const { error: insertError } = await supabase
        .from('news')
        .insert({
          title,
          slug,
          summary,
          content,
          category_id: categoryId,
          author_id: user.id,
          status,
          thumbnail_url: thumbnailUrl,
          seo_metadata: seoMetadata,
          published_at: status === 'Published' ? new Date().toISOString() : null,
        });

      if (insertError) throw insertError;

      router.push('/admin/news');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/news" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Yeni Haber Ekle</h2>
          <p className="text-white/60">Toplulukla paylaşmak için harika bir içerik oluştur.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 text-red-500 p-4 rounded-lg font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* TEMEL BİLGİLER */}
        <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold uppercase border-b-2 border-white/10 pb-4">Temel Bilgiler</h3>
          
          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Başlık</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors font-bold text-lg"
              placeholder="Haber başlığını buraya yazın..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Kategori</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">URL (Slug)</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-white/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Kapak Resmi</label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-black/20 hover:bg-white/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-10 h-10 mb-3 opacity-50" />
                <p className="mb-2 text-sm text-white/60 font-bold">
                  {coverImage ? coverImage.name : 'Resim yüklemek için tıklayın'}
                </p>
                <p className="text-xs text-white/40">PNG, JPG (Max. 2MB)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Özet (Ana Sayfa Görünümü)</label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="Ana sayfada görünecek kısa açıklama..."
            />
          </div>
        </div>

        {/* İÇERİK EDİTÖRÜ */}
        <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold uppercase border-b-2 border-white/10 pb-4">Haber İçeriği</h3>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        {/* SEO & YAYIN AYARLARI */}
        <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold uppercase border-b-2 border-white/10 pb-4">SEO & Yayınlama</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Durum</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors font-bold"
              >
                <option value="Draft">Taslak Olarak Kaydet</option>
                <option value="Published">Hemen Yayınla</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase text-blue-400">SEO Meta Title (İsteğe Bağlı)</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-blue-400 transition-colors"
                placeholder="Özel Google başlığı..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase text-blue-400">SEO Meta Description (İsteğe Bağlı)</label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-blue-400 transition-colors"
              placeholder="Google aramalarında görünecek açıklama..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 sticky bottom-8">
          <button
            type="submit"
            disabled={loading || content.length < 10}
            className="flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest pixel-borders hover:bg-primary/90 transition-all hover:scale-105 shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <><span className="animate-spin">⚙</span> İşleniyor...</>
            ) : (
              <><Save size={20} /> Haberi Kaydet</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
